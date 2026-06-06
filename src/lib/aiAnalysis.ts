import { mockPeers } from "./mockData";
import { extractTagsFromQuery } from "./matching";

export interface Resource {
  title: string;
  source: string;
  type: "paper" | "internal";
  url: string;
}

export interface PastMessage {
  from: "asker" | "expert";
  text: string;
}

export type QueryAnalysis =
  | {
      kind: "expert";
      tags: string[];
      resources: Resource[];
    }
  | {
      kind: "broad";
      tags: string[];
      summaryTopic: string;
      subtopics: string[];
      /** Alternative focused topics the user can switch to. */
      topicOptions: { summaryTopic: string; subtopics: string[] }[];
      resources: Resource[];
    }
  | {
      kind: "faq";
      tags: string[];
      title: string;
      askCount: number;
      pastConversation: PastMessage[];
      resources: Resource[];
    };

/**
 * Questions the system has "seen" many times before. If a new question looks
 * like one of these, the AI can publish an anonymized past answer instead of
 * pinging a human again.
 */
const faqEntries: Array<{
  id: string;
  keywords: string[];
  title: string;
  askCount: number;
  pastConversation: PastMessage[];
}> = [
  {
    id: "access",
    keywords: ["password", "log in", "login", "locked out", "access", "sign in"],
    title: "Getting back into FinFlow",
    askCount: 23,
    pastConversation: [
      { from: "asker", text: "I'm locked out of FinFlow right before a client meeting." },
      {
        from: "expert",
        text: "Our SSO resets don't go through the vendor portal — use the internal IT self-service tile, not finflow.com. Caught me out too the first time.",
      },
    ],
  },
  {
    id: "export",
    keywords: ["export", "pdf", "print", "download report"],
    title: "Exporting a FinFlow report to PDF",
    askCount: 14,
    pastConversation: [
      { from: "asker", text: "The PDF export button does nothing on the monthly report." },
      {
        from: "expert",
        text: "You have to set the branch filter first or the export silently fails — undocumented quirk in how our bank configured FinFlow.",
      },
    ],
  },
];

/** Signals that a question is so broad it would pull in half the workforce. */
const broadSignals = [
  "everything",
  "all of",
  "entire",
  "whole",
  "from scratch",
  "get up to speed",
  "overview of",
  "teach me finflow",
  "learn finflow",
  "end to end",
  "end-to-end",
];

const paperLibrary: Record<string, Resource> = {
  FinFlow: {
    title: "FinFlow Branch Admin Guide (internal wiki)",
    source: "Internal Knowledge Base",
    type: "internal",
    url: "#",
  },
  "Loan Approval": {
    title: "Credit Risk & Loan Origination Workflows: A Review",
    source: "Journal of Banking & Finance, 2022",
    type: "paper",
    url: "#",
  },
  "Compliance Reporting": {
    title: "Automating Regulatory Reporting in Retail Banking",
    source: "Int. Journal of Bank Marketing, 2021",
    type: "paper",
    url: "#",
  },
  "Legacy Core Banking": {
    title: "Modernizing Legacy Core Banking Systems",
    source: "IEEE Software, 2020",
    type: "paper",
    url: "#",
  },
  Reporting: {
    title: "Our FinFlow Reporting Cookbook (internal)",
    source: "Internal Knowledge Base",
    type: "internal",
    url: "#",
  },
};

const defaultResource: Resource = {
  title: "Knowledge Transfer & the Retirement of Experts in Organizations",
  source: "Academy of Management Review, 2019",
  type: "paper",
  url: "#",
};

/** Build a small, relevant reading list from the detected topic tags. */
export function resourcesForTags(tags: string[]): Resource[] {
  const picks = tags
    .map((t) => paperLibrary[t])
    .filter((r): r is Resource => Boolean(r));
  const unique = Array.from(new Map(picks.map((r) => [r.title, r])).values());
  if (unique.length < 2) unique.push(defaultResource);
  return unique.slice(0, 3);
}

/** Turn detected tags into a focused, learnable topic + subtopics. */
function buildTopic(tags: string[]): { summaryTopic: string; subtopics: string[] } {
  const lead = tags[0];
  return {
    summaryTopic: lead
      ? `${lead} for branch managers`
      : "FinFlow fundamentals for branch managers",
    subtopics: [
      lead ? `Core ${lead} workflows we use day-to-day` : "Daily FinFlow workflows",
      "Where our bank's setup differs from the vendor defaults",
      "The 3 reports a branch manager actually needs",
    ],
  };
}

/** A few focused topics to offer, one per detected area, plus a fallback. */
function buildTopicOptions(
  tags: string[]
): { summaryTopic: string; subtopics: string[] }[] {
  const perTag = tags.map((t) => buildTopic([t, ...tags.filter((x) => x !== t)]));
  const fallback = {
    summaryTopic: "A 30-minute FinFlow starter for branch managers",
    subtopics: [
      "Just the screens you touch weekly",
      "The 3 reports that matter for your branch",
      "Who to ask when something breaks",
    ],
  };
  const all = [...perTag, fallback];
  return Array.from(
    new Map(all.map((o) => [o.summaryTopic, o])).values()
  ).slice(0, 4);
}

/**
 * Simulated "AI triage". Decides whether a question is:
 *  - faq    → answer with anonymized past sessions (saves an expert's time)
 *  - broad  → too big; summarize a focused learning topic and route that on
 *  - expert → genuine, scoped company-specific question → match a human directly
 */
export function analyzeQuery(query: string): QueryAnalysis {
  const text = query.toLowerCase();
  const tags = extractTagsFromQuery(query, mockPeers);

  const faq = faqEntries.find((f) => f.keywords.some((k) => text.includes(k)));
  if (faq) {
    return {
      kind: "faq",
      tags,
      title: faq.title,
      askCount: faq.askCount,
      pastConversation: faq.pastConversation,
      resources: resourcesForTags(tags),
    };
  }

  // Only treat a question as "too broad" when it actually signals scope
  // ("everything", "entire", "from scratch", …) — not just because it touches
  // several topics. A focused multi-tag question still goes straight to a human.
  const isBroad = broadSignals.some((s) => text.includes(s));
  if (isBroad) {
    const focused = tags.slice(0, 3);
    const topicOptions = buildTopicOptions(focused);
    return {
      kind: "broad",
      tags: focused,
      summaryTopic: topicOptions[0].summaryTopic,
      subtopics: topicOptions[0].subtopics,
      topicOptions,
      resources: resourcesForTags(focused),
    };
  }

  return {
    kind: "expert",
    tags,
    resources: resourcesForTags(tags),
  };
}

/**
 * Simulated re-check of a topic the user typed themselves. Confirms it's
 * specific enough to route to one expert (not vague, not "everything").
 */
export function validateCustomTopic(topic: string): {
  ok: boolean;
  message: string;
} {
  const t = topic.trim();
  const lower = t.toLowerCase();
  const words = t.split(/\s+/).filter(Boolean);

  if (words.length < 2) {
    return {
      ok: false,
      message: "Too vague — add a bit more detail so we can match the right expert.",
    };
  }
  if (broadSignals.some((s) => lower.includes(s)) || /\ball\b/.test(lower)) {
    return {
      ok: false,
      message: "Still too broad — narrow it to one specific area or task.",
    };
  }
  return {
    ok: true,
    message: "Looks focused enough — routing you to the right experts.",
  };
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  options: string[];
}

/** Coach feedback: AI should challenge broad questions before suggesting a topic. */
export function getBroadFollowUps(_query: string): FollowUpQuestion[] {
  return [
    {
      id: "area",
      question: "Which area do you need most right now?",
      options: ["FinFlow reports", "Core banking workflows", "Compliance setup"],
    },
    {
      id: "scope",
      question: "Who is this for?",
      options: ["Just my branch", "My whole department", "Only me learning"],
    },
    {
      id: "tried",
      question: "What have you already tried?",
      options: ["Vendor documentation", "Asked a colleague", "Nothing yet"],
    },
  ];
}

/** Demo shortcuts so each AI path is easy to show in a pitch. */
export const exampleQueries = [
  {
    label: "Specific (→ expert)",
    text: "I need help setting up loan-approval reports in our new FinFlow dashboard.",
  },
  {
    label: "Common (→ past answers)",
    text: "I'm locked out of FinFlow before a client meeting.",
  },
  {
    label: "Too broad (→ focus topic)",
    text: "Can someone teach me everything about our entire FinFlow and core banking setup from scratch?",
  },
];

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

const faqEntries: Array<{
  id: string;
  keywords: string[];
  title: string;
  askCount: number;
  pastConversation: PastMessage[];
}> = [
  {
    id: "null",
    keywords: ["null", "is null", "coalesce", "missing values"],
    title: "Handling NULL values in SQL",
    askCount: 19,
    pastConversation: [
      { from: "asker", text: "My counts are wrong — NULL rows seem to disappear." },
      {
        from: "expert",
        text: "Use COALESCE or filter IS NULL explicitly. COUNT(column) ignores NULLs but COUNT(*) does not — easy trap.",
      },
    ],
  },
  {
    id: "groupby",
    keywords: ["group by", "aggregate", "aggregation", "having"],
    title: "GROUP BY column rules",
    askCount: 14,
    pastConversation: [
      { from: "asker", text: "SQL says my SELECT doesn't match GROUP BY." },
      {
        from: "expert",
        text: "Every non-aggregated column in SELECT must be in GROUP BY. Wrap the rest in SUM/MAX or drop them.",
      },
    ],
  },
];

const broadSignals = [
  "everything",
  "all of",
  "entire",
  "whole",
  "from scratch",
  "get up to speed",
  "overview of",
  "teach me sql",
  "learn sql",
  "all sql",
  "end to end",
  "end-to-end",
];

const paperLibrary: Record<string, Resource> = {
  SQL: {
    title: "SQL Style Guide (internal wiki)",
    source: "Internal Knowledge Base",
    type: "internal",
    url: "#",
  },
  JOINs: {
    title: "Join Processing in Relational Databases: A Survey",
    source: "ACM Computing Surveys, 2021",
    type: "paper",
    url: "#",
  },
  Aggregations: {
    title: "Aggregation Pushdown in Analytical SQL Engines",
    source: "VLDB, 2020",
    type: "paper",
    url: "#",
  },
  "Window Functions": {
    title: "Window Functions in Modern SQL Warehouses",
    source: "IEEE Data Engineering Bulletin, 2022",
    type: "paper",
    url: "#",
  },
  "Query Optimization": {
    title: "Our Query Tuning Playbook (internal)",
    source: "Internal Knowledge Base",
    type: "internal",
    url: "#",
  },
  PostgreSQL: {
    title: "PostgreSQL Query Planner Explained",
    source: "Internal Knowledge Base",
    type: "internal",
    url: "#",
  },
};

const defaultResource: Resource = {
  title: "Learning SQL: From Simple Queries to Complex Analytics",
  source: "O'Reilly, 2023",
  type: "paper",
  url: "#",
};

export function resourcesForTags(tags: string[]): Resource[] {
  const picks = tags
    .map((t) => paperLibrary[t])
    .filter((r): r is Resource => Boolean(r));
  const unique = Array.from(new Map(picks.map((r) => [r.title, r])).values());
  if (unique.length < 2) unique.push(defaultResource);
  return unique.slice(0, 3);
}

function buildTopic(tags: string[]): { summaryTopic: string; subtopics: string[] } {
  const lead = tags[0] ?? "SQL";
  return {
    summaryTopic: `${lead} fundamentals for analysts`,
    subtopics: [
      `Core ${lead} patterns we use on real data`,
      "Common mistakes on our warehouse tables",
      "One query you can reuse this week",
    ],
  };
}

function buildTopicOptions(
  tags: string[]
): { summaryTopic: string; subtopics: string[] }[] {
  const perTag = tags.map((t) => buildTopic([t, ...tags.filter((x) => x !== t)]));
  const fallback = {
    summaryTopic: "A 30-minute SQL starter for analysts",
    subtopics: [
      "SELECT, WHERE, and JOIN basics",
      "When to use a subquery vs a JOIN",
      "Who to ask when a query won't run",
    ],
  };
  const all = [...perTag, fallback];
  return Array.from(
    new Map(all.map((o) => [o.summaryTopic, o])).values()
  ).slice(0, 4);
}

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

  const isBroad = broadSignals.some((s) => text.includes(s));
  if (isBroad) {
    const focused = tags.length > 0 ? tags.slice(0, 3) : ["SQL", "JOINs", "Aggregations"];
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
      message: "Too vague — add a bit more detail so we can match the right helper.",
    };
  }
  if (broadSignals.some((s) => lower.includes(s)) || /\ball\b/.test(lower)) {
    return {
      ok: false,
      message: "Still too broad — narrow it to one specific SQL area or task.",
    };
  }
  return {
    ok: true,
    message: "Looks focused enough — routing you to the right helpers.",
  };
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  options: string[];
}

export function getBroadFollowUps(_query: string): FollowUpQuestion[] {
  return [
    {
      id: "area",
      question: "Which SQL area do you need most right now?",
      options: ["JOINs & relationships", "Aggregations & GROUP BY", "Window functions"],
    },
    {
      id: "scope",
      question: "What kind of data are you working with?",
      options: ["Customer tables", "Sales & revenue", "Internal ops data"],
    },
    {
      id: "tried",
      question: "What have you already tried?",
      options: ["Stack Overflow / docs", "Asked a colleague", "Nothing yet"],
    },
  ];
}

export const exampleQueries = [
  {
    label: "Specific",
    text: "How do I write a SQL query that joins three tables and still runs fast on our warehouse?",
  },
  {
    label: "Common",
    text: "My GROUP BY query keeps failing — which columns should go in SELECT vs GROUP BY?",
  },
  {
    label: "Broad",
    text: "Can someone teach me everything about SQL and our entire data warehouse from scratch?",
  },
];

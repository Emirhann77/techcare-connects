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
      kind: "simple";
      tags: string[];
      title: string;
      answer: string;
      resources: Resource[];
    }
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

const simpleEntries: Array<{
  keywords: string[];
  title: string;
  answer: string;
}> = [
  {
    keywords: [
      "first 10",
      "first ten",
      "limit 10",
      "top 10",
      "only 10 rows",
      "first few rows",
    ],
    title: "Show only the first 10 rows",
    answer:
      "Add LIMIT 10 at the end of your query — for example: SELECT * FROM customers LIMIT 10. If you care which 10 rows you get, add ORDER BY first (e.g. ORDER BY created_at DESC LIMIT 10). On SQL Server use TOP 10 instead of LIMIT.",
  },
  {
    keywords: ["order by", "sort results", "sort rows", "ascending", "descending"],
    title: "Sort results with ORDER BY",
    answer:
      "ORDER BY goes at the end of your query and controls row order. Example: SELECT name, amount FROM sales ORDER BY amount DESC. Use ASC for smallest/oldest first, DESC for largest/newest first. You can sort by multiple columns: ORDER BY region ASC, amount DESC.",
  },
  {
    keywords: ["select *", "select star", "what columns"],
    title: "What SELECT * does",
    answer:
      "SELECT * returns every column from the table. It is fine for a quick look, but for reports list only the columns you need — it is faster, easier to read, and less likely to break if someone adds a column later.",
  },
  {
    keywords: ["distinct", "duplicate rows", "unique values", "remove duplicates"],
    title: "Remove duplicate rows with DISTINCT",
    answer:
      "DISTINCT keeps one copy of each unique value. Example: SELECT DISTINCT country FROM customers. Use it when you only need unique values, not every row. If duplicates come from joining tables, fix the JOIN instead of relying on DISTINCT alone.",
  },
  {
    keywords: ["where vs having", "difference between where and having"],
    title: "WHERE vs HAVING",
    answer:
      "WHERE filters rows before grouping. HAVING filters groups after GROUP BY. Rule of thumb: filter individual rows with WHERE; filter aggregated results (like SUM > 1000) with HAVING.",
  },
  {
    keywords: ["count(", "count rows", "how many rows"],
    title: "Count rows in SQL",
    answer:
      "COUNT(*) counts every row. COUNT(column_name) counts rows where that column is not NULL. Example: SELECT COUNT(*) FROM orders WHERE status = 'open'. Use COUNT(DISTINCT customer_id) when you need unique customers.",
  },
];

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
    title: "GROUP BY — which columns go where?",
    askCount: 14,
    pastConversation: [
      { from: "asker", text: "My GROUP BY query keeps failing." },
      {
        from: "expert",
        text: "Every column in SELECT must either be in GROUP BY or wrapped in SUM/COUNT/MAX. Example: SELECT region, SUM(amount) FROM sales GROUP BY region.",
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

const expertSignals = [
  "three tables",
  "join three",
  "warehouse",
  "runs fast",
  "optimize",
  "performance",
  "slow query",
  "window function",
  "subquery",
  "our data",
  "internal",
];

const simpleStarters = [
  "what is ",
  "what does ",
  "what's ",
  "explain ",
  "how do i show",
  "how do i get",
  "how do i list",
  "how do i sort",
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
    summaryTopic: `${lead} basics for day-to-day work`,
    subtopics: [
      `Core ${lead} patterns on our tables`,
      "One example query you can copy",
      "When to ask a colleague instead",
    ],
  };
}

function buildTopicOptions(
  tags: string[]
): { summaryTopic: string; subtopics: string[] }[] {
  const perTag = tags.map((t) => buildTopic([t, ...tags.filter((x) => x !== t)]));
  const fallback = {
    summaryTopic: "SQL starter — reads, filters, and joins",
    subtopics: [
      "SELECT and WHERE in plain English",
      "When to use a JOIN vs a filter",
      "Who to ask when a query errors",
    ],
  };
  const all = [...perTag, fallback];
  return Array.from(
    new Map(all.map((o) => [o.summaryTopic, o])).values()
  ).slice(0, 4);
}

function matchSimple(text: string): (typeof simpleEntries)[0] | null {
  return (
    simpleEntries.find((entry) =>
      entry.keywords.some((k) => text.includes(k))
    ) ?? null
  );
}

function genericSimpleAnswer(query: string): { title: string; answer: string } {
  return {
    title: "Quick SQL answer",
    answer: `For "${query.trim()}": start with a basic SELECT on one table, add WHERE to filter, and ORDER BY if you need sorting. If you are joining tables or tuning performance on our warehouse, that is a Specific question — use the expert path instead.`,
  };
}

export function analyzeQuery(query: string): QueryAnalysis {
  const text = query.toLowerCase();
  const tags = extractTagsFromQuery(query, mockPeers);

  const simple = matchSimple(text);
  if (simple) {
    return {
      kind: "simple",
      tags,
      title: simple.title,
      answer: simple.answer,
      resources: resourcesForTags(tags),
    };
  }

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

  const looksSimple =
    !expertSignals.some((s) => text.includes(s)) &&
    simpleStarters.some((s) => text.includes(s)) &&
    query.trim().length < 120;

  if (looksSimple) {
    const generic = genericSimpleAnswer(query);
    return {
      kind: "simple",
      tags,
      title: generic.title,
      answer: generic.answer,
      resources: resourcesForTags(tags),
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
      message: "Too vague — name one SQL topic (e.g. JOINs on customer tables).",
    };
  }
  if (broadSignals.some((s) => lower.includes(s)) || /\ball\b/.test(lower)) {
    return {
      ok: false,
      message: "Still too broad — pick one focused SQL topic.",
    };
  }
  return {
    ok: true,
    message: "Looks focused — we can post this to the pool.",
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
      question: "What do you want to learn first?",
      options: ["JOINs (combine tables)", "Totals with GROUP BY", "Rankings with window functions"],
    },
    {
      id: "scope",
      question: "Which data do you work with most?",
      options: ["Customers", "Sales & revenue", "Branch / ops data"],
    },
    {
      id: "tried",
      question: "What have you tried so far?",
      options: ["Docs / Google", "Asked a colleague", "Nothing yet"],
    },
  ];
}

export const exampleQueries = [
  {
    label: "Specific",
    text: "How do I join customers, orders, and products in one SQL query?",
  },
  {
    label: "Common",
    text: "My GROUP BY query fails — which columns belong in GROUP BY?",
  },
  {
    label: "Broad",
    text: "I need to learn SQL from scratch for our data warehouse.",
  },
  {
    label: "Simple",
    text: "How do I show only the first 10 rows in SQL?",
  },
];

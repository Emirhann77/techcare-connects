export type AvailabilityStatus = "Available" | "Busy" | "Away";

export interface Peer {
  id: string;
  name: string;
  role: string;
  experienceTags: string[];
  availabilityStatus: AvailabilityStatus;
  gamificationPoints: number;
  blurb: string;
  /** Time slot ids (see `timeSlots`) this peer could meet in. */
  availableSlots: string[];
}

/** Proposed meeting windows the user and peers can overlap on. */
export const timeSlots = [
  { id: "s1", label: "Today · 16:30–16:50" },
  { id: "s2", label: "Fri 5 Jun · 15:30–15:50" },
  { id: "s3", label: "Mon 8 Jun · 14:00–14:20" },
  { id: "s4", label: "Tue 9 Jun · 11:00–11:20" },
] as const;

/** Where the quick knowledge-transfer session could happen. */
export const meetingSpots = [
  { id: "coffee", label: "Coffee Kitchen" },
  { id: "online", label: "Online (Teams)" },
  { id: "desk", label: "At my desk" },
] as const;

export interface CurrentUser {
  id: string;
  name: string;
  role: string;
  gamificationPoints: number;
  /** The thing Thomas is currently stuck on. Drives the demo story. */
  currentProblem: string;
}

/**
 * The point economy. Helping is worth more than learning to nudge
 * experienced employees to share institutional knowledge before they leave.
 */
export const gamificationRules = {
  HELPER_POINTS: 4,
  LEARNER_POINTS: 2,
} as const;

/**
 * Level thresholds. Used to turn raw points into a human label in the header.
 */
export const levelTiers = [
  { name: "Newcomer", min: 0 },
  { name: "Learner", min: 10 },
  { name: "Contributor", min: 25 },
  { name: "Knowledge Champion", min: 50 },
] as const;

export function getLevelForPoints(points: number): string {
  let label: string = levelTiers[0].name;
  for (const tier of levelTiers) {
    if (points >= tier.min) label = tier.name;
  }
  return label;
}

export const currentUser: CurrentUser = {
  id: "u-thomas",
  name: "Thomas",
  role: "Branch Manager · 20 yrs at the bank",
  gamificationPoints: 12,
  currentProblem:
    "I need help setting up loan-approval reports in our new FinFlow dashboard.",
};

export type TicketUrgency = "High" | "Normal" | "Low";

/** How soon the asker needs an answer — set when picking time slots. */
export type QuestionUrgency = "Urgent" | "Normal" | "Can wait";

export const questionUrgencyOptions: {
  id: QuestionUrgency;
  label: string;
  hint: string;
}[] = [
  { id: "Urgent", label: "Urgent", hint: "I need help today" },
  { id: "Normal", label: "Normal", hint: "Within the next few days" },
  { id: "Can wait", label: "Can wait", hint: "No rush — whenever someone is free" },
];

/** Max open tickets per person — asking or helping — so nobody gets overwhelmed. */
export const MAX_ACTIVE_TICKETS = 3;

/** Legacy assigned-ticket shape (seed data for the pool). */
export interface Ticket {
  id: string;
  fromName: string;
  fromRole: string;
  title: string;
  detail: string;
  tags: string[];
  urgency: TicketUrgency;
  postedAgo: string;
}

export type PoolTicketStatus = "open" | "claimed" | "ready";

/** A help request sitting in the shared pool — helpers pick what to work on. */
export interface PoolTicket {
  id: string;
  title: string;
  detail: string;
  tags: string[];
  urgency: QuestionUrgency;
  spot: string;
  /** Real asker name — never shown in the pool UI. */
  askerName: string;
  askerRole: string;
  /** Anonymous label helpers see (e.g. "Asker #2"). */
  anonymousLabel: string;
  status: PoolTicketStatus;
  claimedBy?: string;
  /** Revealed to both parties once the ticket is claimed. */
  helperName?: string;
  helperRole?: string;
  postedAgo: string;
  /** Set when Thomas (or another user) posts the ticket. */
  createdBy?: string;
}

/** A request Thomas posted to the pool (the asking side). */
export interface MyRequest {
  id: string;
  poolTicketId: string;
  title: string;
  detail: string;
  tags: string[];
  urgency: QuestionUrgency;
  spot: string;
  status: "In pool" | "Claimed" | "Ready";
  /** Real helper name — revealed once someone claims the ticket. */
  helperName?: string;
  helperRole?: string;
  createdAgo: string;
}

export function anonymousAskerLabel(ticketId: string, pool: PoolTicket[]): string {
  const openOrder = pool.filter((t) => t.status === "open" || t.id === ticketId);
  const n = openOrder.findIndex((t) => t.id === ticketId) + 1;
  return n > 0 ? `Asker #${n}` : "Asker";
}

export function anonymousHelperLabel(index: number): string {
  return `Helper #${index}`;
}

/** Mock colleague who claims Thomas's ticket in the single-user demo. */
export const simulatedPoolHelper = {
  id: "helper-sim",
  name: "Almira Voss",
  role: "Senior Loan Officer",
};

/** Asker label in pool UI — anonymous until claimed. */
export function displayAskerName(ticket: PoolTicket): string {
  return ticket.status === "open" ? ticket.anonymousLabel : ticket.askerName;
}

/** Helper label for the asker — hidden until claimed. */
export function displayHelperName(
  request: Pick<MyRequest, "status" | "helperName" | "helperRole">
): string | null {
  if (request.status === "In pool" || !request.helperName) return null;
  return request.helperName;
}

/**
 * The "helping" side: requests routed to Thomas because of his 20 years of
 * branch experience. This is how institutional knowledge gets pulled out of him
 * before he retires.
 */
export const mockTickets: Ticket[] = [
  {
    id: "t-1",
    fromName: "Jonas Weber",
    fromRole: "New Teller (2 weeks in)",
    title: "Which figure is the real cash position?",
    detail:
      "I can't tell which FinFlow number is the actual end-of-day cash position for our branch. There seem to be three.",
    tags: ["FinFlow", "Reporting"],
    urgency: "High",
    postedAgo: "20m ago",
  },
  {
    id: "t-2",
    fromName: "Mei Lin",
    fromRole: "Junior Loan Officer",
    title: "My first mortgage approval",
    detail:
      "Which internal checks does our branch require before I submit a mortgage approval in FinFlow?",
    tags: ["Loan Approval", "FinFlow"],
    urgency: "Normal",
    postedAgo: "1h ago",
  },
  {
    id: "t-3",
    fromName: "Carlos Mendes",
    fromRole: "Customer Advisor",
    title: "Old account won't migrate",
    detail:
      "A customer's legacy account won't move to the new core system. What did we used to do in this case?",
    tags: ["Legacy Core Banking"],
    urgency: "High",
    postedAgo: "2h ago",
  },
];

function ticketUrgencyToQuestion(u: TicketUrgency): QuestionUrgency {
  if (u === "High") return "Urgent";
  if (u === "Low") return "Can wait";
  return "Normal";
}

/** Seed tickets converted into the shared pool (asker identity hidden). */
export function createInitialPoolTickets(): PoolTicket[] {
  return mockTickets.map((t, i) => ({
    id: t.id,
    title: t.title,
    detail: t.detail,
    tags: t.tags,
    urgency: ticketUrgencyToQuestion(t.urgency),
    spot: "online",
    askerName: t.fromName,
    askerRole: t.fromRole,
    anonymousLabel: `Asker #${i + 1}`,
    status: "open" as const,
    postedAgo: t.postedAgo,
  }));
}

/**
 * The internal expert pool. These are colleagues with company-specific,
 * tribal knowledge that no search engine or general AI could ever surface.
 */
export const mockPeers: Peer[] = [
  {
    id: "p-almira",
    name: "Almira Voss",
    role: "Senior Loan Officer",
    experienceTags: ["FinFlow", "Loan Approval", "Core Banking"],
    availabilityStatus: "Available",
    gamificationPoints: 248,
    blurb: "Built the original FinFlow loan-approval workflow for our branches.",
    availableSlots: ["s1", "s3"],
  },
  {
    id: "p-tomas",
    name: "Tomas Berg",
    role: "Legacy Systems Engineer",
    experienceTags: ["Legacy Core Banking", "FinFlow", "Internal Tools"],
    availabilityStatus: "Available",
    gamificationPoints: 176,
    blurb: "Knows every undocumented quirk in our core banking platform.",
    availableSlots: ["s2", "s4"],
  },
  {
    id: "p-priya",
    name: "Priya Nair",
    role: "Compliance Manager",
    experienceTags: ["Compliance Reporting", "FinFlow", "Regulations"],
    availabilityStatus: "Busy",
    gamificationPoints: 132,
    blurb: "Owns how our bank configured FinFlow for regulatory reports.",
    availableSlots: ["s3"],
  },
  {
    id: "p-dmitri",
    name: "Dmitri Sokolov",
    role: "Digital Banking Specialist",
    experienceTags: ["FinFlow", "Reporting", "Automation"],
    availabilityStatus: "Available",
    gamificationPoints: 98,
    blurb: "Automates branch reporting inside FinFlow all day long.",
    availableSlots: ["s1", "s2"],
  },
  {
    id: "p-lena",
    name: "Lena Fischer",
    role: "Branch Operations Veteran (retiring Q4)",
    experienceTags: ["FinFlow", "Legacy Core Banking", "Tribal Knowledge"],
    availabilityStatus: "Away",
    gamificationPoints: 410,
    blurb: "30 years of institutional memory walking out the door soon.",
    availableSlots: ["s4"],
  },
  {
    id: "p-marco",
    name: "Marco Ruiz",
    role: "Systems Integration Engineer",
    experienceTags: ["Core Banking", "FinFlow", "APIs"],
    availabilityStatus: "Available",
    gamificationPoints: 87,
    blurb: "Connects FinFlow to our older core banking systems.",
    availableSlots: ["s1", "s4"],
  },
  {
    id: "p-sara",
    name: "Sara Lindqvist",
    role: "Onboarding Buddy",
    experienceTags: ["Onboarding", "Internal Tools", "Mentoring"],
    availabilityStatus: "Available",
    gamificationPoints: 64,
    blurb: "Loves helping colleagues get comfortable with new tools.",
    availableSlots: ["s2", "s3"],
  },
  {
    id: "p-kwame",
    name: "Kwame Mensah",
    role: "Business Analyst",
    experienceTags: ["Reporting", "Dashboards", "FinFlow"],
    availabilityStatus: "Busy",
    gamificationPoints: 51,
    blurb: "Turns raw branch data into clean FinFlow dashboards.",
    availableSlots: ["s4"],
  },
];

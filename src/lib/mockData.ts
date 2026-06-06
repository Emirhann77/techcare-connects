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

/** A help request from a colleague, assigned to Thomas (the experienced one). */
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

/** A request Thomas created by connecting with an expert (the asking side). */
export interface MyRequest {
  id: string;
  peerId: string;
  expertName: string;
  expertRole: string;
  title: string;
  detail: string;
  tags: string[];
  urgency: QuestionUrgency;
  spot: string;
  status: "Pending" | "Ready";
  createdAgo: string;
}

/**
 * The "helping" side: requests routed to Thomas because of his 20 years of
 * branch experience. This is how institutional knowledge gets pulled out of him
 * before he retires.
 */
/** Shown instead of real names when picking helpers / helpees (avoids bias). */
export function anonymousExpertLabel(peer: Peer): string {
  const n = mockPeers.findIndex((p) => p.id === peer.id) + 1;
  return `Internal expert #${n}`;
}

export function anonymousColleagueLabel(ticket: Ticket): string {
  const n = mockTickets.findIndex((t) => t.id === ticket.id) + 1;
  return `Colleague #${n}`;
}

export function expertInitials(peer: Peer): string {
  const n = mockPeers.findIndex((p) => p.id === peer.id) + 1;
  return `E${n}`;
}

export const mockTickets: Ticket[] = [
  {
    id: "t-1",
    fromName: "Colleague #1",
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
    fromName: "Colleague #2",
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
    fromName: "Colleague #3",
    fromRole: "Customer Advisor",
    title: "Old account won't migrate",
    detail:
      "A customer's legacy account won't move to the new core system. What did we used to do in this case?",
    tags: ["Legacy Core Banking"],
    urgency: "High",
    postedAgo: "2h ago",
  },
];

/**
 * The internal expert pool. These are colleagues with company-specific,
 * tribal knowledge that no search engine or general AI could ever surface.
 */
export const mockPeers: Peer[] = [
  {
    id: "p-almira",
    name: "Internal expert #1",
    role: "Senior Loan Officer",
    experienceTags: ["FinFlow", "Loan Approval", "Core Banking"],
    availabilityStatus: "Available",
    gamificationPoints: 248,
    blurb: "Built the original FinFlow loan-approval workflow for our branches.",
    availableSlots: ["s1", "s3"],
  },
  {
    id: "p-tomas",
    name: "Internal expert #2",
    role: "Legacy Systems Engineer",
    experienceTags: ["Legacy Core Banking", "FinFlow", "Internal Tools"],
    availabilityStatus: "Available",
    gamificationPoints: 176,
    blurb: "Knows every undocumented quirk in our core banking platform.",
    availableSlots: ["s2", "s4"],
  },
  {
    id: "p-priya",
    name: "Internal expert #3",
    role: "Compliance Manager",
    experienceTags: ["Compliance Reporting", "FinFlow", "Regulations"],
    availabilityStatus: "Busy",
    gamificationPoints: 132,
    blurb: "Owns how our bank configured FinFlow for regulatory reports.",
    availableSlots: ["s3"],
  },
  {
    id: "p-dmitri",
    name: "Internal expert #4",
    role: "Digital Banking Specialist",
    experienceTags: ["FinFlow", "Reporting", "Automation"],
    availabilityStatus: "Available",
    gamificationPoints: 98,
    blurb: "Automates branch reporting inside FinFlow all day long.",
    availableSlots: ["s1", "s2"],
  },
  {
    id: "p-lena",
    name: "Internal expert #5",
    role: "Branch Operations Veteran (retiring Q4)",
    experienceTags: ["FinFlow", "Legacy Core Banking", "Tribal Knowledge"],
    availabilityStatus: "Away",
    gamificationPoints: 410,
    blurb: "30 years of institutional memory walking out the door soon.",
    availableSlots: ["s4"],
  },
  {
    id: "p-marco",
    name: "Internal expert #6",
    role: "Systems Integration Engineer",
    experienceTags: ["Core Banking", "FinFlow", "APIs"],
    availabilityStatus: "Available",
    gamificationPoints: 87,
    blurb: "Connects FinFlow to our older core banking systems.",
    availableSlots: ["s1", "s4"],
  },
  {
    id: "p-sara",
    name: "Internal expert #7",
    role: "Onboarding Buddy",
    experienceTags: ["Onboarding", "Internal Tools", "Mentoring"],
    availabilityStatus: "Available",
    gamificationPoints: 64,
    blurb: "Loves helping colleagues get comfortable with new tools.",
    availableSlots: ["s2", "s3"],
  },
  {
    id: "p-kwame",
    name: "Internal expert #8",
    role: "Business Analyst",
    experienceTags: ["Reporting", "Dashboards", "FinFlow"],
    availabilityStatus: "Busy",
    gamificationPoints: 51,
    blurb: "Turns raw branch data into clean FinFlow dashboards.",
    availableSlots: ["s4"],
  },
];

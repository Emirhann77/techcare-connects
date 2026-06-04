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

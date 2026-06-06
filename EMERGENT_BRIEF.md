# Build Prompt: "TechCare Connects" — peer-support click-dummy

Copy everything below (from "PROJECT" down) into Emergent AI (or any AI app builder).
It is written to recreate the same prototype so you can compare the result against
the existing version.

---

## PROJECT

Build a **frontend-only, clickable prototype** (a "click dummy") for a peer-support
platform called **TechCare Connects**. It connects an employee who is stuck on a
**company-specific** problem with internal colleagues who hold that tribal knowledge.

**Hard rules:**
- **No backend, no database, no real AI, no auth.** Everything is mock data held in
  the frontend and all "AI"/"matching" is simulated with plain JavaScript + fake
  loading delays (setTimeout).
- Tech: **React + Tailwind CSS + lucide-react icons** (Next.js App Router is fine).
  It must be deployable as a fully static site.
- Mobile-friendly, clean, modern, minimal. The whole story must be understandable in
  under 3 minutes. Smooth/instant transitions between steps.

## THE PROBLEM IT SOLVES (context for the messaging)

Post-onboarding isolation + the "retirement problem": experienced employees leave and
their institutional knowledge leaves with them. The **key differentiator**: this app
is for sharing *company-specific experience* that you **cannot** get from Google or a
general AI — so the app uses **AI as a first filter, and humans as the second level.**

## PERSONA / CURRENT USER

- Name: **Thomas**, Role: **"Branch Manager · 20 yrs at the bank"**
- Not very tech-savvy; pressured to use new internal technology; limited time to learn.
- Starting gamification points: **12**
- His current problem (pre-filled): **"I need help setting up loan-approval reports in
  our new FinFlow dashboard."** (FinFlow = a fictional internal banking system.)

## GAMIFICATION RULES (constants)

- Helping someone (the expert/teacher) earns **+4 points**.
- Getting help (the learner) earns **+2 points**.
- Level tiers by total points: **Newcomer (0+), Learner (10+), Contributor (25+),
  Knowledge Champion (50+)**. A helper function maps a point total to its level label.

## MOCK DATA

### Time slots (proposed meeting windows; ids + labels)
- s1: "Today · 16:30–16:50"
- s2: "Fri 5 Jun · 15:30–15:50"
- s3: "Mon 8 Jun · 14:00–14:20"
- s4: "Tue 9 Jun · 11:00–11:20"

### Meeting spots (location suggestion)
- "Coffee Kitchen", "Online (Teams)", "At my desk"

### Peers (array of 8). Each has: id, name, role, experienceTags[], availabilityStatus
("Available" | "Busy" | "Away"), gamificationPoints, blurb, availableSlots[] (slot ids).

1. Almira Voss — Senior Loan Officer — tags: [FinFlow, Loan Approval, Core Banking] —
   Available — 248 pts — "Built the original FinFlow loan-approval workflow for our
   branches." — slots: [s1, s3]
2. Tomas Berg — Legacy Systems Engineer — tags: [Legacy Core Banking, FinFlow, Internal
   Tools] — Available — 176 pts — "Knows every undocumented quirk in our core banking
   platform." — slots: [s2, s4]
3. Priya Nair — Compliance Manager — tags: [Compliance Reporting, FinFlow, Regulations]
   — Busy — 132 pts — "Owns how our bank configured FinFlow for regulatory reports." —
   slots: [s3]
4. Dmitri Sokolov — Digital Banking Specialist — tags: [FinFlow, Reporting, Automation]
   — Available — 98 pts — "Automates branch reporting inside FinFlow all day long." —
   slots: [s1, s2]
5. Lena Fischer — Branch Operations Veteran (retiring Q4) — tags: [FinFlow, Legacy Core
   Banking, Tribal Knowledge] — Away — 410 pts — "30 years of institutional memory
   walking out the door soon." — slots: [s4]
6. Marco Ruiz — Systems Integration Engineer — tags: [Core Banking, FinFlow, APIs] —
   Available — 87 pts — "Connects FinFlow to our older core banking systems." —
   slots: [s1, s4]
7. Sara Lindqvist — Onboarding Buddy — tags: [Onboarding, Internal Tools, Mentoring] —
   Available — 64 pts — "Loves helping colleagues get comfortable with new tools." —
   slots: [s2, s3]
8. Kwame Mensah — Business Analyst — tags: [Reporting, Dashboards, FinFlow] — Busy —
   51 pts — "Turns raw branch data into clean FinFlow dashboards." — slots: [s4]

## THE USER JOURNEY (single page, 3 stages + 2 modals)

Persistent **GamificationHeader** at the top on every stage: app name, "Hi Thomas",
current points (live-updating, with a little "+2"/"+4" pop animation when points
change), and the current Level label.

### Stage 1 — AI First Filter
- A chat-like input/textarea pre-filled with Thomas's problem, plus an "Ask" button.
- On submit: show a fake loading state ("AI analyzing your request…") for ~1.8s.
- Then show the verdict message (this exact idea):
  **"AI cannot answer this. This requires company-specific experience that isn't in any
  manual, on Google, or in a general AI model. Let's find an internal expert."**
  Plus a tagline: **"AI is the first filter. People are the second level."**
- A button: **"Find an internal expert"** → goes to Stage 2.

### Stage 2 — Availability / Timeslot Matching (NEW key feature)
Heading like "When works for you?". The user:
- Picks **one or more time slots** they're free (multi-select cards from the time slots).
- Picks a **meeting location** (the meeting spots).
- Has a checkbox toggle: **"I'm okay to wait for busy experts"** with helper text that it
  will also show people who are Busy or Away.
- Button: **"Find matching experts"** → goes to Stage 3.

### Stage 3 — Peer Matches
- A frontend ranking function (see below) produces the **Top 5** matches.
- A banner with a clear CTA referencing the #1 match, e.g.:
  **"Almira knows FinFlow. Connect now!"** plus a line that it shows the top matches "so
  the right people aren't overwhelmed". The banner also reflects whether busy experts are
  included or not.
- Render each match as a **PeerCard**: avatar initials, name, role, availability dot
  (green/amber/grey), blurb, experience tags (tags that matched the query are
  highlighted), the peer's points, and a button **"Connect (Earn 2 pts)"**.
  - If the user and peer share a selected time slot, show a green badge:
    **"You both free: <slot label>"**.
  - If the peer is Busy/Away (only shown because "okay to wait" is on), show an amber
    badge: **"Not free at your times — you chose to wait for the right expert."**

### Modal A — ChatModal (simulated chat)
- Clicking "Connect" opens a chat modal with the chosen peer.
- The user's original problem appears as the first sent message; the peer auto-replies
  after short delays with 1–2 messages that emphasize the fix is **company-specific /
  not in the vendor docs**.
- User can type more messages (they just append; no real backend).
- A green **"Resolve Session"** button at the bottom.

### Modal B — CelebrationModal (gamification payoff)
- Clicking "Resolve Session" closes the chat and opens a celebratory modal:
  **"Session Complete!"** showing **Thomas earned +2 points (for learning)** and the
  **expert earned +4 points (for teaching)**.
- Small hint text: **"Points count towards your Q3 promotion goals."**
- Thomas's points in the header increase by 2 (with the pop animation). A "Done" button
  closes it.

## MATCHING FUNCTION (plain JS, frontend only)

1. From the typed problem text, extract experience tags by matching keywords against the
   peers' tags (case-insensitive substring match), plus loose hints, e.g.: "finflow"→
   FinFlow, "loan"→Loan Approval, "dashboard"→Dashboards, "report"→Reporting,
   "compliance"→Compliance Reporting, "legacy"→Legacy Core Banking, "core banking"→Core
   Banking.
2. Filter peers: if "okay to wait" is OFF, keep only **Available** peers; if ON, keep all.
3. Score each peer = (#matched tags × 10) + (#shared selected time slots × 6) +
   availability weight (Available=3, Busy=1, Away=0) + (peer points ÷ 100).
4. Keep only peers with at least one matched tag, sort by score descending, take **Top 5**.
   Track which tags and which slots matched for display.

## STYLE NOTES

- Soft light background, white rounded cards (rounded-2xl/3xl), subtle shadows, a blue
  "brand" accent color, amber for points, emerald for success/availability.
- Lucide icons throughout (sparkles, award, trending-up, bot, calendar-clock, users,
  message-square, check-circle, party-popper, etc.).
- Light entrance animations (fade-in, scale-in, a "pop" for the celebration/points).
- Keep it to essentially one screen with stage swapping — no complex menus or routing.

---

End of prompt.

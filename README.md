# TechCare Connects — Click Dummy

A frontend-only prototype of a peer-support platform that connects employees with
colleagues who hold **company-specific experience** — the kind of tribal knowledge
you can't Google or ask a general AI. Built to solve post-onboarding isolation and
the "retirement problem" (institutional knowledge walking out the door).

> This is a clickable prototype. There is **no backend, database, or real AI** —
> all data is mock JSON and all "AI" / "matching" is simulated in the frontend.

## Tech stack

- Next.js 14 (App Router) + React 18
- TypeScript
- Tailwind CSS
- lucide-react icons

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## The demo story (Thomas' journey)

1. **AI First Filter** — Thomas asks: _"I need help with Supplier John's Excel macro."_
   The AI "analyzes", then declines: this needs company-specific experience.
   AI is the first filter; people are the second level.
2. **Scalable Peer Matching** — a frontend function ranks `mockPeers` by experience
   tag overlap (+ availability + reputation) and shows the **Top 5** so experts
   aren't overwhelmed.
3. **Collaboration & Gamification Loop** — Connect opens a simulated chat. Resolving
   the session awards points: **Learner +2, Helper +4**, with a nudge that points
   count toward Q3 promotion goals.

## Where things live

- `src/lib/mockData.ts` — `currentUser`, `mockPeers`, `gamificationRules`, levels
- `src/lib/matching.ts` — tag extraction + Top-N peer matching
- `src/components/` — `GamificationHeader`, `AiFilter`, `PeerCard`, `ChatModal`, `CelebrationModal`
- `src/app/page.tsx` — orchestrates the three-step journey

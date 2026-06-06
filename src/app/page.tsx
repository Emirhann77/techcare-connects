"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import GamificationHeader from "@/components/GamificationHeader";
import AiFilter, { type ProceedContext } from "@/components/AiFilter";
import AvailabilityStep, { type AvailabilityChoice } from "@/components/AvailabilityStep";
import PeerCard from "@/components/PeerCard";
import ChatModal from "@/components/ChatModal";
import CelebrationModal from "@/components/CelebrationModal";
import TicketStrip from "@/components/TicketStrip";
import MyRequestsStrip from "@/components/MyRequestsStrip";
import TicketDetail from "@/components/TicketDetail";
import TicketCreatedSuccess from "@/components/TicketCreatedSuccess";
import {
  currentUser,
  gamificationRules,
  MAX_ACTIVE_TICKETS,
  mockPeers,
  mockTickets,
  type MyRequest,
  type Peer,
  type Ticket,
} from "@/lib/mockData";
import { matchPeers } from "@/lib/matching";

type Stage = "filter" | "availability" | "matches" | "ticket-created" | "ticket";
type Mode = "learning" | "teaching";

interface Session {
  peer: Peer;
  mode: Mode;
  problem: string;
  spot: string;
  myRequestId?: string;
}

const ticketToPeer = (t: Ticket): Peer => ({
  id: t.id,
  name: t.fromName,
  role: t.fromRole,
  experienceTags: t.tags,
  availabilityStatus: "Available",
  gamificationPoints: 0,
  blurb: t.detail,
  availableSlots: [],
});

const requestToPeer = (r: MyRequest): Peer => {
  const found = mockPeers.find((p) => p.id === r.peerId);
  if (found) return found;
  return {
    id: r.peerId,
    name: r.expertName,
    role: r.expertRole,
    experienceTags: r.tags,
    availabilityStatus: "Available",
    gamificationPoints: 0,
    blurb: r.detail,
    availableSlots: [],
  };
};

function titleFromProblem(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length <= 56) return trimmed;
  return `${trimmed.slice(0, 53)}…`;
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("filter");
  const [problem, setProblem] = useState(currentUser.currentProblem);
  const [matchTags, setMatchTags] = useState<string[]>([]);
  const [focusTopic, setFocusTopic] = useState<string | undefined>(undefined);
  const [availability, setAvailability] = useState<AvailabilityChoice | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [myRequests, setMyRequests] = useState<MyRequest[]>([]);
  const [justCreated, setJustCreated] = useState<MyRequest | null>(null);
  const [points, setPoints] = useState(currentUser.gamificationPoints);
  const [recentlyEarned, setRecentlyEarned] = useState<number | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [celebrate, setCelebrate] = useState<{ peer: Peer; mode: Mode } | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const atRequestLimit = myRequests.length >= MAX_ACTIVE_TICKETS;

  const matches = useMemo(
    () =>
      matchPeers(matchTags, mockPeers, {
        selectedSlots: availability?.slots,
        okayToWait: availability?.okayToWait,
      }),
    [matchTags, availability]
  );

  const handleProceed = (ctx: ProceedContext) => {
    setProblem(ctx.problem);
    setMatchTags(ctx.tags);
    setFocusTopic(ctx.topic);
    setStage("availability");
  };

  const handleAvailability = (choice: AvailabilityChoice) => {
    setAvailability(choice);
    setStage("matches");
  };

  const handleCreateRequest = (peer: Peer) => {
    if (atRequestLimit) return;

    const id = `my-${Date.now()}`;
    const request: MyRequest = {
      id,
      peerId: peer.id,
      expertName: peer.name,
      expertRole: peer.role,
      title: titleFromProblem(problem),
      detail: problem,
      tags: peer.experienceTags.filter((t) =>
        matchTags.some((m) => m.toLowerCase() === t.toLowerCase())
      ),
      urgency: availability?.urgency ?? "Normal",
      spot: availability?.spot ?? "online",
      status: "Pending",
      createdAgo: "Just now",
    };

    setMyRequests((prev) => [...prev, request]);
    setJustCreated(request);
    setStage("ticket-created");

    // Simulate the expert accepting — chat unlocks from My requests.
    setTimeout(() => {
      setMyRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "Ready" as const } : r))
      );
      setJustCreated((prev) =>
        prev?.id === id ? { ...prev, status: "Ready" } : prev
      );
    }, 2000);
  };

  const handleOpenMyRequestChat = (request: MyRequest) => {
    if (request.status !== "Ready") return;
    setSession({
      peer: requestToPeer(request),
      mode: "learning",
      problem: request.detail,
      spot: request.spot,
      myRequestId: request.id,
    });
  };

  const handleResolve = (peer: Peer) => {
    const mode = session?.mode ?? "learning";
    const earned =
      mode === "teaching"
        ? gamificationRules.HELPER_POINTS
        : gamificationRules.LEARNER_POINTS;
    setPoints((p) => p + earned);
    setRecentlyEarned(earned);
    setCelebrate({ peer, mode });
    setSession(null);

    // Remove resolved learning request from open list (frees a slot).
    if (mode === "learning" && session?.myRequestId) {
      setMyRequests((prev) => prev.filter((r) => r.id !== session.myRequestId));
    }
  };

  const handleReset = () => {
    setStage("filter");
    setProblem(currentUser.currentProblem);
    setMatchTags([]);
    setFocusTopic(undefined);
    setAvailability(null);
    setSelectedTicket(null);
    setMyRequests([]);
    setJustCreated(null);
    setPoints(currentUser.gamificationPoints);
    setRecentlyEarned(null);
    setSession(null);
    setCelebrate(null);
    setResetKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen">
      <GamificationHeader
        userName={currentUser.name}
        points={points}
        recentlyEarned={recentlyEarned}
        onReset={handleReset}
      />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        {stage === "filter" && (
          <section className="space-y-4">
            <TicketStrip
              tickets={mockTickets.slice(0, MAX_ACTIVE_TICKETS)}
              onSelect={(t) => {
                setSelectedTicket(t);
                setStage("ticket");
              }}
            />

            <MyRequestsStrip requests={myRequests} onChat={handleOpenMyRequestChat} />

            <div className="mt-4">
              <p className="uppercase-label text-stone-400">Stage 01 · AI First Filter</p>
              <h1 className="mt-2 max-w-2xl font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
                What are you stuck on,{" "}
                <span className="text-brand-600">{currentUser.name}?</span>
              </h1>
              <p className="mt-3 max-w-xl text-stone-500">
                Start with the AI. If it can&apos;t actually help, we&apos;ll route you to
                a human who&apos;s been there.
              </p>
              <div className="mt-8">
                <AiFilter key={resetKey} defaultProblem={problem} onProceed={handleProceed} />
              </div>
            </div>
          </section>
        )}

        {stage === "ticket-created" && justCreated && (
          <TicketCreatedSuccess
            request={justCreated}
            onGoHome={() => {
              setJustCreated(null);
              setStage("filter");
            }}
          />
        )}

        {stage === "ticket" && selectedTicket && (
          <TicketDetail
            ticket={selectedTicket}
            onBack={() => {
              setSelectedTicket(null);
              setStage("filter");
            }}
            onHelp={(t) =>
              setSession({
                peer: ticketToPeer(t),
                mode: "teaching",
                problem: t.detail,
                spot: "online",
              })
            }
          />
        )}

        {stage === "availability" && (
          <section>
            <button
              onClick={() => setStage("filter")}
              className="uppercase-label mb-4 inline-flex items-center gap-1.5 text-stone-400 transition hover:text-stone-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <p className="uppercase-label text-stone-400">Stage 02 · Your Availability</p>
            <h1 className="mt-2 font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
              When works for <span className="text-brand-600">you?</span>
            </h1>
            <p className="mt-3 max-w-xl text-stone-500">
              {focusTopic ? (
                <>
                  Focused topic: <span className="font-medium text-stone-700">{focusTopic}</span>.
                  Pick when you&apos;re free — we&apos;ll only show experts whose calendar
                  overlaps yours.
                </>
              ) : (
                <>
                  Pick the windows you&apos;re free. We&apos;ll only show experts whose
                  calendar overlaps yours — so no one&apos;s time gets wasted.
                </>
              )}
            </p>
            <div className="mt-8">
              <AvailabilityStep key={resetKey} onContinue={handleAvailability} />
            </div>
          </section>
        )}

        {stage === "matches" && (
          <section className="animate-fade-in">
            <button
              onClick={() => setStage("availability")}
              className="uppercase-label mb-4 inline-flex items-center gap-1.5 text-stone-400 transition hover:text-stone-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <p className="uppercase-label text-stone-400">Stage 03 · Peer Matches</p>
            <h1 className="mt-2 font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
              Top <span className="text-brand-600">{matches.length}</span> people
              <br className="hidden sm:block" /> who can actually help.
            </h1>
            <p className="mt-3 max-w-xl text-stone-500">
              {matches.length > 0 ? (
                <>Showing the best matches first so the right people aren&apos;t overwhelmed. </>
              ) : (
                <>
                  No one matches your times right now. Go back and tick &ldquo;I&apos;m okay
                  to wait&rdquo; to include busy experts.{" "}
                </>
              )}
              {availability && !availability.okayToWait
                ? "Only people available right now."
                : availability?.okayToWait
                  ? "Including busy experts you'll wait for."
                  : ""}
            </p>
            {availability && (
              <p className="mt-2 text-sm text-stone-500">
                Urgency:{" "}
                <span
                  className={`font-semibold ${
                    availability.urgency === "Urgent"
                      ? "text-red-600"
                      : availability.urgency === "Can wait"
                        ? "text-stone-500"
                        : "text-brand-600"
                  }`}
                >
                  {availability.urgency}
                </span>
                {availability.urgency === "Urgent" &&
                  " — we'll prioritise experts who are free soon."}
              </p>
            )}

            {atRequestLimit && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                You already have {MAX_ACTIVE_TICKETS} open requests. Resolve one from{" "}
                <span className="font-semibold">My requests</span> on the home page before
                creating another — we cap it so experts aren&apos;t overwhelmed.
              </div>
            )}

            {matches.length > 0 && (
              <div className="mt-6 rounded-3xl border border-brand-200 bg-white p-5">
                <p className="uppercase-label flex items-center gap-1.5 text-brand-700">
                  <Sparkles className="h-4 w-4" />
                  #1 Match
                </p>
                <p className="mt-1 font-serif text-2xl text-stone-900">
                  <span className="text-brand-600">{matches[0].peer.name.split(" ")[0]}</span>{" "}
                  knows {matches[0].matchedTags[0]}.{" "}
                  <span className="text-stone-400">Create a ticket to connect.</span>
                </p>
              </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {matches.map(({ peer, matchedTags, matchedSlots }, i) => (
                <PeerCard
                  key={peer.id}
                  peer={peer}
                  matchedTags={matchedTags}
                  matchedSlots={matchedSlots}
                  highlight={i === 0}
                  connectDisabled={atRequestLimit}
                  connectLabel={
                    atRequestLimit ? "Limit reached (3/3)" : "Create ticket"
                  }
                  onConnect={handleCreateRequest}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {session && (
        <ChatModal
          peer={session.peer}
          userName={currentUser.name}
          problem={session.problem}
          spot={session.spot}
          mode={session.mode}
          onClose={() => setSession(null)}
          onResolve={handleResolve}
        />
      )}

      {celebrate && (
        <CelebrationModal
          peer={celebrate.peer}
          userName={currentUser.name}
          mode={celebrate.mode}
          onClose={() => setCelebrate(null)}
        />
      )}
    </div>
  );
}

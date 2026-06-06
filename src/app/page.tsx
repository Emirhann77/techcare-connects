"use client";

import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import GamificationHeader from "@/components/GamificationHeader";
import AiFilter, { type ProceedContext } from "@/components/AiFilter";
import AvailabilityStep, { type AvailabilityChoice } from "@/components/AvailabilityStep";
import ChatModal from "@/components/ChatModal";
import CelebrationModal from "@/components/CelebrationModal";
import TicketPoolStrip from "@/components/TicketPoolStrip";
import MyHelpingStrip from "@/components/MyHelpingStrip";
import MyRequestsStrip from "@/components/MyRequestsStrip";
import PoolTicketDetail from "@/components/PoolTicketDetail";
import TicketCreatedSuccess from "@/components/TicketCreatedSuccess";
import {
  anonymousHelperLabel,
  createInitialPoolTickets,
  currentUser,
  gamificationRules,
  MAX_ACTIVE_TICKETS,
  type MyRequest,
  type Peer,
  type PoolTicket,
} from "@/lib/mockData";

type Stage = "filter" | "availability" | "ticket-created" | "pool-ticket";
type Mode = "learning" | "teaching";

interface Session {
  peer: Peer;
  mode: Mode;
  problem: string;
  spot: string;
  myRequestId?: string;
  poolTicketId?: string;
}

const poolTicketToPeer = (t: PoolTicket): Peer => ({
  id: t.id,
  name: t.anonymousLabel,
  role: t.askerRole,
  experienceTags: t.tags,
  availabilityStatus: "Available",
  gamificationPoints: 0,
  blurb: t.detail,
  availableSlots: [],
});

const helperPeerForLearning = (helperLabel: string, tags: string[]): Peer => ({
  id: "helper-anon",
  name: helperLabel,
  role: "Matched helper",
  experienceTags: tags,
  availabilityStatus: "Available",
  gamificationPoints: 0,
  blurb: "Claimed your ticket from the pool.",
  availableSlots: [],
});

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
  const [poolTickets, setPoolTickets] = useState<PoolTicket[]>(createInitialPoolTickets);
  const [selectedPoolTicket, setSelectedPoolTicket] = useState<PoolTicket | null>(null);
  const [myRequests, setMyRequests] = useState<MyRequest[]>([]);
  const [justCreated, setJustCreated] = useState<MyRequest | null>(null);
  const [points, setPoints] = useState(currentUser.gamificationPoints);
  const [recentlyEarned, setRecentlyEarned] = useState<number | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [celebrate, setCelebrate] = useState<{ peer: Peer; mode: Mode } | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const atRequestLimit = myRequests.length >= MAX_ACTIVE_TICKETS;

  const openPoolTickets = useMemo(
    () =>
      poolTickets.filter(
        (t) => t.status === "open" && t.createdBy !== currentUser.id
      ),
    [poolTickets]
  );

  const myActiveHelps = useMemo(
    () =>
      poolTickets.filter(
        (t) =>
          t.claimedBy === currentUser.id &&
          (t.status === "claimed" || t.status === "ready")
      ),
    [poolTickets]
  );

  const atHelperCapacity = myActiveHelps.length >= MAX_ACTIVE_TICKETS;

  const handleProceed = (ctx: ProceedContext) => {
    setProblem(ctx.problem);
    setMatchTags(ctx.tags);
    setFocusTopic(ctx.topic);
    setStage("availability");
  };

  const handlePostToPool = (choice: AvailabilityChoice) => {
    if (atRequestLimit) return;

    const poolId = `pool-${Date.now()}`;
    const reqId = `my-${Date.now()}`;
    const askerNumber =
      poolTickets.filter((t) => t.createdBy !== currentUser.id).length +
      myRequests.length +
      1;

    const poolTicket: PoolTicket = {
      id: poolId,
      title: titleFromProblem(problem),
      detail: problem,
      tags: matchTags,
      urgency: choice.urgency,
      spot: choice.spot,
      askerName: currentUser.name,
      askerRole: currentUser.role,
      anonymousLabel: `Asker #${askerNumber}`,
      status: "open",
      postedAgo: "Just now",
      createdBy: currentUser.id,
    };

    const request: MyRequest = {
      id: reqId,
      poolTicketId: poolId,
      title: poolTicket.title,
      detail: problem,
      tags: matchTags,
      urgency: choice.urgency,
      spot: choice.spot,
      status: "In pool",
      createdAgo: "Just now",
    };

    setPoolTickets((prev) => [...prev, poolTicket]);
    setMyRequests((prev) => [...prev, request]);
    setJustCreated(request);
    setStage("ticket-created");

    // Simulate a helper claiming from the pool (demo has no second user).
    const helperLabel = anonymousHelperLabel(1);
    setTimeout(() => {
      setPoolTickets((prev) =>
        prev.map((t) =>
          t.id === poolId
            ? { ...t, status: "claimed", claimedBy: "helper-sim" }
            : t
        )
      );
      setMyRequests((prev) =>
        prev.map((r) =>
          r.poolTicketId === poolId
            ? { ...r, status: "Claimed", helperLabel }
            : r
        )
      );
      setJustCreated((prev) =>
        prev?.poolTicketId === poolId
          ? { ...prev, status: "Claimed", helperLabel }
          : prev
      );

      setTimeout(() => {
        setPoolTickets((prev) =>
          prev.map((t) =>
            t.id === poolId ? { ...t, status: "ready" } : t
          )
        );
        setMyRequests((prev) =>
          prev.map((r) =>
            r.poolTicketId === poolId ? { ...r, status: "Ready" } : r
          )
        );
        setJustCreated((prev) =>
          prev?.poolTicketId === poolId ? { ...prev, status: "Ready" } : prev
        );
      }, 1500);
    }, 2500);
  };

  const handleClaimPoolTicket = (ticket: PoolTicket) => {
    if (atHelperCapacity) return;

    setPoolTickets((prev) =>
      prev.map((t) =>
        t.id === ticket.id
          ? { ...t, status: "claimed", claimedBy: currentUser.id }
          : t
      )
    );
    setSelectedPoolTicket(null);
    setStage("filter");

    setTimeout(() => {
      setPoolTickets((prev) =>
        prev.map((t) =>
          t.id === ticket.id ? { ...t, status: "ready" } : t
        )
      );
    }, 1500);
  };

  const handleOpenMyRequestChat = (request: MyRequest) => {
    if (request.status !== "Ready" || !request.helperLabel) return;
    setSession({
      peer: helperPeerForLearning(request.helperLabel, request.tags),
      mode: "learning",
      problem: request.detail,
      spot: request.spot,
      myRequestId: request.id,
      poolTicketId: request.poolTicketId,
    });
  };

  const handleOpenHelpingChat = (ticket: PoolTicket) => {
    if (ticket.status !== "ready") return;
    setSession({
      peer: poolTicketToPeer(ticket),
      mode: "teaching",
      problem: ticket.detail,
      spot: ticket.spot,
      poolTicketId: ticket.id,
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

    if (session?.poolTicketId) {
      setPoolTickets((prev) =>
        prev.filter((t) => t.id !== session.poolTicketId)
      );
    }
    if (mode === "learning" && session?.myRequestId) {
      setMyRequests((prev) =>
        prev.filter((r) => r.id !== session.myRequestId)
      );
    }
  };

  const handleReset = () => {
    setStage("filter");
    setProblem(currentUser.currentProblem);
    setMatchTags([]);
    setFocusTopic(undefined);
    setPoolTickets(createInitialPoolTickets());
    setSelectedPoolTicket(null);
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
            <TicketPoolStrip
              tickets={openPoolTickets}
              onSelect={(t) => {
                setSelectedPoolTicket(t);
                setStage("pool-ticket");
              }}
            />

            <MyHelpingStrip
              tickets={myActiveHelps}
              onChat={handleOpenHelpingChat}
            />

            <MyRequestsStrip requests={myRequests} onChat={handleOpenMyRequestChat} />

            <div className="mt-4">
              <p className="uppercase-label text-stone-400">Stage 01 · AI First Filter</p>
              <h1 className="mt-2 max-w-2xl font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
                What are you stuck on,{" "}
                <span className="text-brand-600">{currentUser.name}?</span>
              </h1>
              <p className="mt-3 max-w-xl text-stone-500">
                Start with the AI. If it can&apos;t actually help, post your question
                to the ticket pool — helpers pick what they can answer. No names shown
                until the session ends.
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

        {stage === "pool-ticket" && selectedPoolTicket && (
          <PoolTicketDetail
            ticket={selectedPoolTicket}
            onBack={() => {
              setSelectedPoolTicket(null);
              setStage("filter");
            }}
            onClaim={handleClaimPoolTicket}
            atCapacity={atHelperCapacity}
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
            <p className="uppercase-label text-stone-400">Stage 02 · Post to pool</p>
            <h1 className="mt-2 font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
              When works for <span className="text-brand-600">you?</span>
            </h1>
            <p className="mt-3 max-w-xl text-stone-500">
              {focusTopic ? (
                <>
                  Focused topic:{" "}
                  <span className="font-medium text-stone-700">{focusTopic}</span>.
                  Set your availability — your ticket goes to the shared pool for
                  helpers to claim.
                </>
              ) : (
                <>
                  Set your availability and urgency. Your question joins the ticket
                  pool — helpers browse and pick what matches their skills. Nobody
                  picks people upfront.
                </>
              )}
            </p>

            {atRequestLimit && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                You already have {MAX_ACTIVE_TICKETS} open requests. Resolve one from{" "}
                <span className="font-semibold">My requests</span> before posting
                another.
              </div>
            )}

            <div className="mt-8">
              <AvailabilityStep
                key={resetKey}
                onContinue={atRequestLimit ? () => {} : handlePostToPool}
              />
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

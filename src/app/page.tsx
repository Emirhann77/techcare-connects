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
import HelperProposalStep from "@/components/HelperProposalStep";
import TicketCreatedSuccess from "@/components/TicketCreatedSuccess";
import TeamsIntegrationBanner from "@/components/TeamsIntegrationBanner";
import HelperMotivationPanel from "@/components/HelperMotivationPanel";
import HelperCapacityControl from "@/components/HelperCapacityControl";
import {
  createInitialPoolTickets,
  currentUser,
  gamificationRules,
  MAX_ACTIVE_TICKETS,
  simulatedPoolHelper,
  type MeetingProposal,
  type MyRequest,
  type Peer,
  type PoolTicket,
  type QuestionComplexity,
} from "@/lib/mockData";

type Stage = "filter" | "availability" | "ticket-created" | "pool-ticket" | "helper-propose";
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
  name: t.status === "open" ? t.anonymousLabel : t.askerName,
  role: t.askerRole,
  experienceTags: t.tags,
  availabilityStatus: "Available",
  gamificationPoints: 0,
  blurb: t.detail,
  availableSlots: [],
});

const helperPeerForLearning = (
  helperName: string,
  helperRole: string,
  tags: string[]
): Peer => ({
  id: "helper-anon",
  name: helperName,
  role: helperRole,
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

function applyProposal(
  ticket: PoolTicket,
  proposal: MeetingProposal
): PoolTicket {
  return { ...ticket, status: "negotiating", proposal };
}

function acceptProposalOnTicket(ticket: PoolTicket): PoolTicket {
  if (!ticket.proposal) return ticket;
  return {
    ...ticket,
    status: "ready",
    agreedSpot: ticket.proposal.spot,
    agreedSlotId: ticket.proposal.slotId,
  };
}

function acceptProposalOnRequest(request: MyRequest): MyRequest {
  if (!request.proposal) return request;
  return {
    ...request,
    status: "Ready",
    agreedSpot: request.proposal.spot,
    agreedSlotId: request.proposal.slotId,
  };
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("filter");
  const [problem, setProblem] = useState(currentUser.currentProblem);
  const [matchTags, setMatchTags] = useState<string[]>([]);
  const [focusTopic, setFocusTopic] = useState<string | undefined>(undefined);
  const [complexity, setComplexity] = useState<QuestionComplexity>("Specific");
  const [poolTickets, setPoolTickets] = useState<PoolTicket[]>(createInitialPoolTickets);
  const [selectedPoolTicket, setSelectedPoolTicket] = useState<PoolTicket | null>(null);
  const [myRequests, setMyRequests] = useState<MyRequest[]>([]);
  const [justCreated, setJustCreated] = useState<MyRequest | null>(null);
  const [points, setPoints] = useState(currentUser.gamificationPoints);
  const [recentlyEarned, setRecentlyEarned] = useState<number | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [celebrate, setCelebrate] = useState<{ peer: Peer; mode: Mode } | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [helperCapacity, setHelperCapacity] = useState(2);

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
          (t.status === "claimed" ||
            t.status === "negotiating" ||
            t.status === "ready")
      ),
    [poolTickets]
  );

  const atHelperCapacity = myActiveHelps.length >= helperCapacity;

  const syncRequestFromTicket = (poolTicketId: string, updater: (r: MyRequest) => MyRequest) => {
    setMyRequests((prev) =>
      prev.map((r) => (r.poolTicketId === poolTicketId ? updater(r) : r))
    );
    setJustCreated((prev) =>
      prev?.poolTicketId === poolTicketId ? updater(prev) : prev
    );
  };

  const handleProceed = (ctx: ProceedContext) => {
    setProblem(ctx.problem);
    setMatchTags(ctx.tags);
    setFocusTopic(ctx.topic);
    setComplexity(ctx.complexity);
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
      complexity,
      askerSlots: choice.slots,
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
      complexity,
      askerSlots: choice.slots,
      status: "In pool",
      createdAgo: "Just now",
    };

    setPoolTickets((prev) => [...prev, poolTicket]);
    setMyRequests((prev) => [...prev, request]);
    setJustCreated(request);
    setStage("ticket-created");

    // Demo: simulated helper claims, then proposes a meeting.
    setTimeout(() => {
      const claimed = {
        status: "claimed" as const,
        claimedBy: simulatedPoolHelper.id,
        helperName: simulatedPoolHelper.name,
        helperRole: simulatedPoolHelper.role,
      };
      setPoolTickets((prev) =>
        prev.map((t) => (t.id === poolId ? { ...t, ...claimed } : t))
      );
      syncRequestFromTicket(poolId, (r) => ({
        ...r,
        status: "Claimed",
        helperName: simulatedPoolHelper.name,
        helperRole: simulatedPoolHelper.role,
      }));

      setTimeout(() => {
        const proposal: MeetingProposal = {
          spot: "online",
          slotId: choice.slots[0] ?? "s2",
          note: "Happy to help — Teams works best for me.",
        };
        setPoolTickets((prev) =>
          prev.map((t) =>
            t.id === poolId ? applyProposal({ ...t, ...claimed }, proposal) : t
          )
        );
        syncRequestFromTicket(poolId, (r) => ({
          ...r,
          status: "Awaiting OK",
          proposal,
        }));
      }, 1500);
    }, 2500);
  };

  const handleClaimPoolTicket = (ticket: PoolTicket) => {
    if (atHelperCapacity) return;

    const claimed: PoolTicket = {
      ...ticket,
      status: "claimed",
      claimedBy: currentUser.id,
      helperName: currentUser.name,
      helperRole: currentUser.role,
    };
    setPoolTickets((prev) =>
      prev.map((t) => (t.id === ticket.id ? claimed : t))
    );
    setSelectedPoolTicket(claimed);
    setStage("helper-propose");
  };

  const simulateHelpeeAccept = (poolTicketId: string, delayMs = 2500) => {
    setTimeout(() => {
      setPoolTickets((prev) =>
        prev.map((t) =>
          t.id === poolTicketId && t.proposal
            ? acceptProposalOnTicket(t)
            : t
        )
      );
    }, delayMs);
  };

  const handleSendProposal = (proposal: MeetingProposal) => {
    if (!selectedPoolTicket) return;
    const id = selectedPoolTicket.id;
    const isHelpingSomeoneElse = selectedPoolTicket.createdBy !== currentUser.id;

    setPoolTickets((prev) =>
      prev.map((t) => (t.id === id ? applyProposal(t, proposal) : t))
    );
    setSelectedPoolTicket(null);
    setStage("filter");

    // Demo has no second user — auto-accept when we proposed to a colleague's ticket.
    if (isHelpingSomeoneElse) {
      simulateHelpeeAccept(id);
    }
  };

  const handleAcceptProposal = (request: MyRequest) => {
    setPoolTickets((prev) =>
      prev.map((t) =>
        t.id === request.poolTicketId ? acceptProposalOnTicket(t) : t
      )
    );
    syncRequestFromTicket(request.poolTicketId, acceptProposalOnRequest);
  };

  const handleOpenMyRequestChat = (request: MyRequest) => {
    if (request.status !== "Ready" || !request.helperName || !request.agreedSpot) return;
    setSession({
      peer: helperPeerForLearning(
        request.helperName,
        request.helperRole ?? "Matched helper",
        request.tags
      ),
      mode: "learning",
      problem: request.detail,
      spot: request.agreedSpot,
      myRequestId: request.id,
      poolTicketId: request.poolTicketId,
    });
  };

  const handleOpenHelpingChat = (ticket: PoolTicket) => {
    if (ticket.status !== "ready" || !ticket.agreedSpot) return;
    setSession({
      peer: poolTicketToPeer(ticket),
      mode: "teaching",
      problem: ticket.detail,
      spot: ticket.agreedSpot,
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
    setComplexity("Specific");
    setPoolTickets(createInitialPoolTickets());
    setSelectedPoolTicket(null);
    setMyRequests([]);
    setJustCreated(null);
    setPoints(currentUser.gamificationPoints);
    setRecentlyEarned(null);
    setSession(null);
    setCelebrate(null);
    setHelperCapacity(2);
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
          <section className="space-y-5">
            <div>
              <p className="uppercase-label text-stone-400">Stage 01 · AI First Filter</p>
              <h1 className="mt-2 max-w-2xl font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
                What are you stuck on,{" "}
                <span className="text-brand-600">{currentUser.name}?</span>
              </h1>
              <p className="mt-3 max-w-xl text-stone-500">
                Start with the AI. If it can&apos;t actually help, we&apos;ll route you to
                a human who&apos;s been there.
              </p>
              <div className="mt-6">
                <AiFilter key={resetKey} defaultProblem={problem} onProceed={handleProceed} />
              </div>
            </div>

            <TeamsIntegrationBanner />
            <HelperMotivationPanel />
            <HelperCapacityControl
              capacity={helperCapacity}
              activeHelping={myActiveHelps.length}
              onChange={setHelperCapacity}
            />
            <MyRequestsStrip
              requests={myRequests}
              onChat={handleOpenMyRequestChat}
              onAcceptProposal={handleAcceptProposal}
            />
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
              onPropose={(t) => {
                setSelectedPoolTicket(t);
                setStage("helper-propose");
              }}
            />
            {atHelperCapacity && (
              <p className="text-center text-xs text-amber-600">
                You&apos;re at your helping limit ({helperCapacity}). New pool tickets
                are visible but paused until a slot opens.
              </p>
            )}
          </section>
        )}

        {stage === "ticket-created" && justCreated && (
          <TicketCreatedSuccess
            request={justCreated}
            onGoHome={() => {
              setJustCreated(null);
              setStage("filter");
            }}
            onAcceptProposal={handleAcceptProposal}
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

        {stage === "helper-propose" && selectedPoolTicket && (
          <HelperProposalStep
            ticket={selectedPoolTicket}
            onBack={() => {
              setSelectedPoolTicket(null);
              setStage("filter");
            }}
            onSubmit={handleSendProposal}
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
              Pick your free times and urgency. Complexity is set by the AI — helpers
              propose the meeting location after they claim your ticket.
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
                complexity={complexity}
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

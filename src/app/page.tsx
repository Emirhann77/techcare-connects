"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import GamificationHeader from "@/components/GamificationHeader";
import AiFilter, { type ProceedContext } from "@/components/AiFilter";
import ExpertsAndTimesStep from "@/components/ExpertsAndTimesStep";
import type { AvailabilityChoice } from "@/components/AvailabilityStep";
import ChatModal from "@/components/ChatModal";
import CelebrationModal from "@/components/CelebrationModal";
import TicketStrip from "@/components/TicketStrip";
import MyRequestsStrip from "@/components/MyRequestsStrip";
import TicketDetail from "@/components/TicketDetail";
import TicketCreatedSuccess from "@/components/TicketCreatedSuccess";
import TeamsIntegrationBanner from "@/components/TeamsIntegrationBanner";
import HelperMotivationPanel from "@/components/HelperMotivationPanel";
import HelperCapacityControl from "@/components/HelperCapacityControl";
import {
  currentUser,
  gamificationRules,
  MAX_ACTIVE_TICKETS,
  mockPeers,
  mockTickets,
  revealedPeerName,
  type MyRequest,
  type Peer,
  type Ticket,
} from "@/lib/mockData";

type Stage = "filter" | "experts-times" | "ticket-created" | "ticket";
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
  realName: t.fromRealName,
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
    realName: r.expertName,
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
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [myRequests, setMyRequests] = useState<MyRequest[]>([]);
  const [justCreated, setJustCreated] = useState<MyRequest | null>(null);
  const [points, setPoints] = useState(currentUser.gamificationPoints);
  const [recentlyEarned, setRecentlyEarned] = useState<number | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [celebrate, setCelebrate] = useState<{ peer: Peer; mode: Mode } | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [helperCapacity, setHelperCapacity] = useState(2);
  const [helpingCount, setHelpingCount] = useState(mockTickets.length);

  const atRequestLimit = myRequests.length >= MAX_ACTIVE_TICKETS;
  const atHelperCapacity = helpingCount >= helperCapacity;

  const handleProceed = (ctx: ProceedContext) => {
    setProblem(ctx.problem);
    setMatchTags(ctx.tags);
    setFocusTopic(ctx.topic);
    setStage("experts-times");
  };

  const handleCreateRequest = (peer: Peer, choice: AvailabilityChoice) => {
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
      urgency: choice.urgency,
      spot: choice.spot,
      status: "Pending",
      createdAgo: "Just now",
    };

    setMyRequests((prev) => [...prev, request]);
    setJustCreated(request);
    setStage("ticket-created");

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
    setCelebrate({
      peer: { ...peer, realName: revealedPeerName(peer) },
      mode,
    });
    setSession(null);

    if (mode === "learning" && session?.myRequestId) {
      setMyRequests((prev) => prev.filter((r) => r.id !== session.myRequestId));
    }
    if (mode === "teaching") {
      setHelpingCount((c) => Math.max(0, c - 1));
    }
  };

  const handleReset = () => {
    setStage("filter");
    setProblem(currentUser.currentProblem);
    setMatchTags([]);
    setFocusTopic(undefined);
    setSelectedTicket(null);
    setMyRequests([]);
    setJustCreated(null);
    setPoints(currentUser.gamificationPoints);
    setRecentlyEarned(null);
    setSession(null);
    setCelebrate(null);
    setHelperCapacity(2);
    setHelpingCount(mockTickets.length);
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
              activeHelping={helpingCount}
              onChange={setHelperCapacity}
            />
            <MyRequestsStrip requests={myRequests} onChat={handleOpenMyRequestChat} />
            <TicketStrip
              tickets={mockTickets.slice(0, MAX_ACTIVE_TICKETS)}
              onSelect={(t) => {
                if (atHelperCapacity) return;
                setSelectedTicket(t);
                setStage("ticket");
              }}
            />
            {atHelperCapacity && (
              <p className="text-center text-xs text-amber-600">
                You&apos;re at your weekly helping limit ({helperCapacity}). New assigned
                tickets are visible but paused until a slot opens.
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
          />
        )}

        {stage === "ticket" && selectedTicket && (
          <TicketDetail
            ticket={selectedTicket}
            onBack={() => {
              setSelectedTicket(null);
              setStage("filter");
            }}
            onHelp={
              atHelperCapacity
                ? undefined
                : (t) =>
                    setSession({
                      peer: ticketToPeer(t),
                      mode: "teaching",
                      problem: t.detail,
                      spot: "online",
                    })
            }
            atCapacity={atHelperCapacity}
          />
        )}

        {stage === "experts-times" && (
          <section>
            <button
              onClick={() => setStage("filter")}
              className="uppercase-label mb-4 inline-flex items-center gap-1.5 text-stone-400 transition hover:text-stone-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <p className="uppercase-label text-stone-400">Stage 02 · Times &amp; experts</p>
            <h1 className="mt-2 font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
              Pick your times, see <span className="text-brand-600">who&apos;s free</span>
            </h1>
            <p className="mt-3 max-w-xl text-stone-500">
              Choose when you&apos;re available once — experts update live below. No second
              time prompt later.
            </p>
            <div className="mt-8">
              <ExpertsAndTimesStep
                matchTags={matchTags}
                focusTopic={focusTopic}
                atRequestLimit={atRequestLimit}
                onCreateTicket={handleCreateRequest}
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

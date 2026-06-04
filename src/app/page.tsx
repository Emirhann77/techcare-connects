"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Users } from "lucide-react";
import GamificationHeader from "@/components/GamificationHeader";
import AiFilter from "@/components/AiFilter";
import AvailabilityStep, { type AvailabilityChoice } from "@/components/AvailabilityStep";
import PeerCard from "@/components/PeerCard";
import ChatModal from "@/components/ChatModal";
import CelebrationModal from "@/components/CelebrationModal";
import { currentUser, gamificationRules, mockPeers, type Peer } from "@/lib/mockData";
import { extractTagsFromQuery, matchPeers } from "@/lib/matching";

type Stage = "filter" | "availability" | "matches";

export default function Home() {
  const [stage, setStage] = useState<Stage>("filter");
  const [problem, setProblem] = useState(currentUser.currentProblem);
  const [availability, setAvailability] = useState<AvailabilityChoice | null>(null);
  const [points, setPoints] = useState(currentUser.gamificationPoints);
  const [recentlyEarned, setRecentlyEarned] = useState<number | null>(null);
  const [activePeer, setActivePeer] = useState<Peer | null>(null);
  const [celebratePeer, setCelebratePeer] = useState<Peer | null>(null);

  const matches = useMemo(() => {
    const tags = extractTagsFromQuery(problem, mockPeers);
    return matchPeers(tags, mockPeers, {
      selectedSlots: availability?.slots,
      okayToWait: availability?.okayToWait,
    });
  }, [problem, availability]);

  const handleEscalate = (text: string) => {
    setProblem(text);
    setStage("availability");
  };

  const handleAvailability = (choice: AvailabilityChoice) => {
    setAvailability(choice);
    setStage("matches");
  };

  const handleResolve = (peer: Peer) => {
    setActivePeer(null);
    setPoints((p) => p + gamificationRules.LEARNER_POINTS);
    setRecentlyEarned(gamificationRules.LEARNER_POINTS);
    setCelebratePeer(peer);
  };

  return (
    <div className="min-h-screen">
      <GamificationHeader
        userName={currentUser.name}
        points={points}
        recentlyEarned={recentlyEarned}
      />

      <main className="mx-auto max-w-5xl px-4 py-8">
        {stage === "filter" && (
          <section>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Stuck on something only a colleague would know?
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Ask the AI first. If it&apos;s company-specific, we&apos;ll connect
                you to the person who&apos;s solved it before.
              </p>
            </div>
            <AiFilter defaultProblem={problem} onEscalate={handleEscalate} />
          </section>
        )}

        {stage === "availability" && (
          <section>
            <button
              onClick={() => setStage("filter")}
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to AI
            </button>
            <AvailabilityStep onContinue={handleAvailability} />
          </section>
        )}

        {stage === "matches" && (
          <section className="animate-fade-in">
            <button
              onClick={() => setStage("availability")}
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to availability
            </button>

            <div className="mb-5 rounded-2xl border border-brand-200 bg-brand-50 p-4">
              <div className="flex items-center gap-2 text-brand-700">
                <Users className="h-5 w-5" />
                <p className="font-semibold">Top internal experts for you</p>
              </div>
              <p className="mt-1 text-sm text-brand-700/80">
                {matches.length > 0 ? (
                  <>
                    <span className="font-semibold">
                      {matches[0].peer.name.split(" ")[0]} knows{" "}
                      {matches[0].matchedTags[0]}.
                    </span>{" "}
                    Connect now! Showing the top {matches.length} matches so the
                    right people aren&apos;t overwhelmed.
                  </>
                ) : (
                  <>
                    No one matches your times right now. Go back and tick
                    &ldquo;I&apos;m okay to wait&rdquo; to include busy experts.
                  </>
                )}
              </p>
              {availability && !availability.okayToWait ? (
                <p className="mt-2 text-xs text-brand-700/70">
                  Showing only experts free at your selected times. Want more
                  options? Choose to wait for busy experts.
                </p>
              ) : availability?.okayToWait ? (
                <p className="mt-2 text-xs text-brand-700/70">
                  Including busy experts you&apos;re willing to wait for.
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {matches.map(({ peer, matchedTags, matchedSlots }, i) => (
                <PeerCard
                  key={peer.id}
                  peer={peer}
                  matchedTags={matchedTags}
                  matchedSlots={matchedSlots}
                  highlight={i === 0}
                  onConnect={(p) => setActivePeer(p)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {activePeer && (
        <ChatModal
          peer={activePeer}
          userName={currentUser.name}
          problem={problem}
          onClose={() => setActivePeer(null)}
          onResolve={handleResolve}
        />
      )}

      {celebratePeer && (
        <CelebrationModal
          peer={celebratePeer}
          userName={currentUser.name}
          onClose={() => setCelebratePeer(null)}
        />
      )}
    </div>
  );
}

"use client";

import { GraduationCap, PartyPopper, Sparkles, Target, UserCheck } from "lucide-react";
import { gamificationRules, revealedPeerName, type Peer } from "@/lib/mockData";

interface CelebrationModalProps {
  peer: Peer;
  userName: string;
  mode?: "learning" | "teaching";
  onClose: () => void;
}

export default function CelebrationModal({
  peer,
  userName,
  mode = "learning",
  onClose,
}: CelebrationModalProps) {
  const peerRealName = revealedPeerName(peer);
  const teacher = mode === "teaching"
    ? { name: userName, points: gamificationRules.HELPER_POINTS }
    : { name: peerRealName, points: gamificationRules.HELPER_POINTS };
  const learner = mode === "teaching"
    ? { name: peerRealName, points: gamificationRules.LEARNER_POINTS }
    : { name: userName, points: gamificationRules.LEARNER_POINTS };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/75 p-4">
      <div className="relative w-full max-w-sm animate-pop overflow-hidden rounded-3xl border border-paper-300 bg-paper-50 p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          <PartyPopper className="h-8 w-8" />
        </div>

        <h2 className="mt-4 font-serif text-3xl font-semibold text-stone-900">
          Session Complete!
        </h2>
        <p className="mt-1 text-sm text-stone-500">Knowledge stays in the bank.</p>

        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-brand-50 px-3 py-2.5 text-left ring-1 ring-brand-200">
          <UserCheck className="h-4 w-4 shrink-0 text-brand-600" />
          <p className="text-xs text-brand-800">
            <span className="font-semibold">Identity revealed:</span> you worked with{" "}
            <span className="font-semibold">{peerRealName}</span>
            {mode === "learning" ? " (your expert)" : " (your colleague)"}.
          </p>
        </div>

        <div className="mt-5 space-y-3 text-left">
          <div className="flex items-center justify-between rounded-2xl bg-white p-3 ring-1 ring-paper-300">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-stone-900">{teacher.name}</p>
                <p className="uppercase-label text-stone-400">Teacher</p>
              </div>
            </div>
            <span className="font-serif text-xl font-bold text-brand-600">
              +{teacher.points}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-white p-3 ring-1 ring-paper-300">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-stone-900">{learner.name}</p>
                <p className="uppercase-label text-stone-400">Learner</p>
              </div>
            </div>
            <span className="font-serif text-xl font-bold text-brand-600">
              +{learner.points}
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-xs text-stone-500 ring-1 ring-paper-300">
          <Target className="h-4 w-4 text-stone-400" />
          Points count towards your Q3 promotion goals.
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-full bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800 active:scale-[0.98]"
        >
          Done
        </button>
      </div>
    </div>
  );
}

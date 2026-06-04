"use client";

import { GraduationCap, PartyPopper, Sparkles, Target } from "lucide-react";
import { gamificationRules, type Peer } from "@/lib/mockData";

interface CelebrationModalProps {
  peer: Peer;
  userName: string;
  onClose: () => void;
}

export default function CelebrationModal({
  peer,
  userName,
  onClose,
}: CelebrationModalProps) {
  const helperName = peer.name.split(" ")[0];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm animate-pop overflow-hidden rounded-3xl bg-white p-6 text-center shadow-2xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center gap-6 text-2xl opacity-80">
          <span className="animate-fade-in">🎉</span>
          <span className="animate-fade-in">✨</span>
          <span className="animate-fade-in">🎊</span>
        </div>

        <div className="mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <PartyPopper className="h-8 w-8" />
        </div>

        <h2 className="mt-4 text-xl font-bold text-slate-900">Session Complete!</h2>
        <p className="mt-1 text-sm text-slate-500">
          Company knowledge just got passed on — not lost.
        </p>

        <div className="mt-5 space-y-3 text-left">
          <div className="flex items-center justify-between rounded-2xl bg-brand-50 p-3 ring-1 ring-brand-100">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-slate-900">{userName}</p>
                <p className="text-xs text-slate-500">for learning</p>
              </div>
            </div>
            <span className="rounded-full bg-brand-600 px-2.5 py-1 text-sm font-bold text-white">
              +{gamificationRules.LEARNER_POINTS} pts
            </span>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-amber-50 p-3 ring-1 ring-amber-100">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-slate-900">{helperName}</p>
                <p className="text-xs text-slate-500">for teaching</p>
              </div>
            </div>
            <span className="rounded-full bg-amber-500 px-2.5 py-1 text-sm font-bold text-white">
              +{gamificationRules.HELPER_POINTS} pts
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
          <Target className="h-4 w-4 text-slate-400" />
          Points count towards your Q3 promotion goals.
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
        >
          Done
        </button>
      </div>
    </div>
  );
}

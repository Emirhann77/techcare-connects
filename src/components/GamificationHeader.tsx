"use client";

import { Award, RotateCcw, Sparkles } from "lucide-react";
import { currentUser } from "@/lib/mockData";

interface GamificationHeaderProps {
  userName: string;
  points: number;
  recentlyEarned?: number | null;
  onReset: () => void;
  showNav?: boolean;
}

export default function GamificationHeader({
  userName,
  points,
  recentlyEarned,
  onReset,
  showNav = true,
}: GamificationHeaderProps) {
  const roleLabel = currentUser.role.split(" · ")[0];

  return (
    <div className="relative mb-8 pt-1 sm:mb-10">
      {showNav && (
        <div className="absolute right-0 top-0 flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right leading-tight">
              <p className="text-xs font-semibold text-stone-800 sm:text-sm">
                Hi {userName}
              </p>
              <p className="text-[10px] text-stone-500 sm:text-xs">{roleLabel}</p>
            </div>
            <div className="relative flex items-center gap-1.5 rounded-full border border-paper-200 bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur-sm">
              <Award className="h-4 w-4 text-accent-pink" />
              <span className="font-semibold tabular-nums text-stone-900">{points}</span>
              <span className="text-sm text-stone-400">pts</span>
              {recentlyEarned ? (
                <span
                  key={points}
                  className="absolute -right-2 -top-3 animate-pop rounded-full bg-gradient-to-r from-accent-pink to-accent-orange px-1.5 py-0.5 text-[10px] font-bold text-white shadow"
                >
                  +{recentlyEarned}
                </span>
              ) : null}
            </div>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] text-stone-300 transition hover:text-stone-500"
            title="Reset prototype"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="uppercase-label">Reset</span>
          </button>
        </div>
      )}

      <div className="flex flex-col items-center px-2 pt-10 sm:pt-2">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-accent-pink/50 sm:w-16" />
          <Sparkles className="h-4 w-4 text-accent-pink sm:h-5 sm:w-5" />
          <p className="font-serif text-xl font-bold tracking-wide text-stone-700 sm:text-3xl">
            TechCare Connects
          </p>
          <Sparkles className="h-4 w-4 text-accent-orange sm:h-5 sm:w-5" />
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-accent-orange/50 sm:w-16" />
        </div>
        <div className="mt-4 h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-accent-pink/60 to-transparent" />
      </div>
    </div>
  );
}

"use client";

import { Award, RotateCcw, Sparkles } from "lucide-react";
import { currentUser, getLevelForPoints } from "@/lib/mockData";

interface GamificationHeaderProps {
  userName: string;
  points: number;
  recentlyEarned?: number | null;
  onReset: () => void;
}

export default function GamificationHeader({
  userName,
  points,
  recentlyEarned,
  onReset,
}: GamificationHeaderProps) {
  const level = getLevelForPoints(points);

  return (
    <header className="sticky top-0 z-40 border-b border-paper-300 bg-paper-100/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-600 ring-1 ring-brand-200">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="font-serif text-lg font-semibold text-stone-900">
              TechCare Connects
            </p>
            <p className="uppercase-label text-stone-400">
              Hi {userName} · {currentUser.role.split(" · ")[0]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex items-center gap-2 rounded-full border border-paper-300 bg-white px-3.5 py-1.5">
            <Award className="h-4 w-4 text-brand-600" />
            <span className="font-semibold tabular-nums text-stone-900">{points}</span>
            <span className="text-sm text-stone-400">pts</span>
            <span className="ml-1 hidden text-sm text-stone-500 sm:inline">{level}</span>
            {recentlyEarned ? (
              <span
                key={points}
                className="absolute -right-2 -top-3 animate-pop rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white shadow"
              >
                +{recentlyEarned}
              </span>
            ) : null}
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-stone-400 transition hover:bg-paper-200 hover:text-stone-700"
            title="Reset prototype"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="uppercase-label hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
}

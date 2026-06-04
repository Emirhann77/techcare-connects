"use client";

import { Award, Sparkles, TrendingUp } from "lucide-react";
import { getLevelForPoints } from "@/lib/mockData";

interface GamificationHeaderProps {
  userName: string;
  points: number;
  recentlyEarned?: number | null;
}

export default function GamificationHeader({
  userName,
  points,
  recentlyEarned,
}: GamificationHeaderProps) {
  const level = getLevelForPoints(points);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">
              TechCare Connects
            </p>
            <p className="text-xs text-slate-500">Hi {userName} 👋</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 sm:flex">
            <Award className="h-4 w-4" />
            {level}
          </div>
          <div className="relative flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700 ring-1 ring-amber-200">
            <TrendingUp className="h-4 w-4" />
            <span className="tabular-nums">{points}</span>
            <span className="font-medium text-amber-600">pts</span>
            {recentlyEarned ? (
              <span
                key={points}
                className="absolute -right-2 -top-3 animate-pop rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow"
              >
                +{recentlyEarned}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

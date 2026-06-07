"use client";

import { ArrowLeftRight } from "lucide-react";
import type { HubMode } from "./HomeHubScreen";

interface ModeSwitchBarProps {
  current: HubMode;
  onSwitch: (mode: HubMode) => void;
  onBackToHub: () => void;
}

export default function ModeSwitchBar({
  current,
  onSwitch,
  onBackToHub,
}: ModeSwitchBarProps) {
  const other: HubMode = current === "getting-help" ? "helping" : "getting-help";
  const otherLabel = other === "helping" ? "Helping" : "Getting help";

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-paper-200 bg-white/80 px-4 py-3 shadow-sm">
      <button
        type="button"
        onClick={onBackToHub}
        className="text-xs font-semibold text-stone-500 transition hover:text-stone-800"
      >
        ← Home
      </button>
      <div className="flex items-center gap-1 rounded-full border border-paper-200 bg-paper-50 p-1">
        <button
          type="button"
          onClick={() => onSwitch("getting-help")}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
            current === "getting-help"
              ? "bg-stone-900 text-white"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          Getting help
        </button>
        <button
          type="button"
          onClick={() => onSwitch("helping")}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
            current === "helping"
              ? "bg-gradient-to-r from-accent-pink to-accent-orange text-white"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          Helping
        </button>
      </div>
      <button
        type="button"
        onClick={() => onSwitch(other)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-pink transition hover:text-accent-orange"
      >
        <ArrowLeftRight className="h-3.5 w-3.5" />
        Switch to {otherLabel}
      </button>
    </div>
  );
}

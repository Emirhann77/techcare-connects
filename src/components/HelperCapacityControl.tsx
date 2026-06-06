"use client";

import { Users } from "lucide-react";

interface HelperCapacityControlProps {
  capacity: number;
  activeHelping: number;
  onChange: (n: number) => void;
}

export default function HelperCapacityControl({
  capacity,
  activeHelping,
  onChange,
}: HelperCapacityControlProps) {
  const atCapacity = activeHelping >= capacity;

  return (
    <div className="card-surface p-4 sm:p-5">
      <p className="uppercase-label flex items-center gap-2 text-stone-400">
        <Users className="h-4 w-4" />
        Your helping capacity this week
      </p>
      <p className="mt-1 text-xs text-stone-500">
        Set how many pool tickets you can realistically help.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              capacity === n
                ? "border-transparent bg-gradient-to-r from-accent-pink to-accent-orange text-white shadow-sm"
                : "border-paper-200 text-stone-600 hover:border-accent-pink/30"
            }`}
          >
            {n} / week
          </button>
        ))}
        <span
          className={`ml-1 text-xs font-medium ${atCapacity ? "text-amber-600" : "text-emerald-600"}`}
        >
          {activeHelping}/{capacity} slots used
          {atCapacity ? " · at capacity" : ""}
        </span>
      </div>
    </div>
  );
}

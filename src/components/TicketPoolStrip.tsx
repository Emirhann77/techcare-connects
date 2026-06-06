"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MAX_ACTIVE_TICKETS, type PoolTicket, type QuestionUrgency } from "@/lib/mockData";

interface TicketPoolStripProps {
  tickets: PoolTicket[];
  onSelect: (ticket: PoolTicket) => void;
}

const urgencyStyles: Record<QuestionUrgency, string> = {
  Urgent: "bg-red-100 text-red-700",
  Normal: "bg-amber-100 text-amber-700",
  "Can wait": "bg-stone-100 text-stone-500",
};

export default function TicketPoolStrip({ tickets, onSelect }: TicketPoolStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <div className="card-surface border-connect/20 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-end gap-1.5">
        <span className="rounded-full bg-gradient-to-r from-accent-pink/10 to-accent-orange/10 px-2.5 py-0.5 text-xs font-semibold text-accent-pink">
          {tickets.length} open
        </span>
        <button
          onClick={() => scrollBy(-1)}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-paper-200 text-stone-500 transition hover:bg-paper-50"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => scrollBy(1)}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-paper-200 text-stone-500 transition hover:bg-paper-50"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {tickets.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-connect/30 bg-connect/5 px-4 py-6 text-center text-sm text-stone-500">
          No open tickets in the pool right now (max {MAX_ACTIVE_TICKETS} active helps).
        </p>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tickets.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              className="group flex w-64 shrink-0 flex-col gap-2 rounded-2xl border border-paper-200 bg-gradient-to-b from-white to-paper-50 p-4 text-left transition hover:border-accent-pink/40 hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                  {t.postedAgo}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${urgencyStyles[t.urgency]}`}
                >
                  {t.urgency}
                </span>
              </div>
              <p className="font-serif text-base font-semibold leading-snug text-stone-900 group-hover:text-accent-pink">
                {t.title}
              </p>
              <div className="space-y-1 text-xs text-stone-500">
                <p>
                  <span className="font-semibold text-stone-600">Topic:</span> {t.topic}
                </p>
                <p>
                  <span className="font-semibold text-stone-600">Estimated time to solve:</span>{" "}
                  {t.estimatedSolveTime}
                </p>
              </div>
              <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-accent-orange">
                Pick ticket
                <ChevronRight className="h-3 w-3" />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

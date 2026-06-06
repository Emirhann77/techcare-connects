"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";
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
    <div className="rounded-3xl border border-paper-300 bg-white/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="uppercase-label flex items-center gap-2 text-stone-400">
          <Layers className="h-4 w-4" />
          Ticket pool · pick a question to help
        </p>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">
            {tickets.length} open
          </span>
          <button
            onClick={() => scrollBy(-1)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-paper-300 text-stone-500 transition hover:bg-paper-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollBy(1)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-paper-300 text-stone-500 transition hover:bg-paper-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {tickets.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-paper-300 bg-paper-50 px-4 py-6 text-center text-sm text-stone-500">
          No open tickets in the pool right now. Check back when colleagues post
          questions (max {MAX_ACTIVE_TICKETS} active helps at once).
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
              className="flex w-60 shrink-0 flex-col gap-2 rounded-2xl border border-paper-300 bg-white p-3.5 text-left transition hover:border-brand-300 hover:shadow-sm active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <span className="uppercase-label text-stone-400">{t.postedAgo}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${urgencyStyles[t.urgency]}`}
                >
                  {t.urgency}
                </span>
              </div>
              <p className="font-serif text-base leading-snug text-stone-900">{t.title}</p>
              <p className="text-xs text-stone-500">
                {t.anonymousLabel} · {t.askerRole} · identity hidden
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {t.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-paper-100 px-2 py-0.5 text-[10px] font-medium text-stone-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

}

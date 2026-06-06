"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, HeartHandshake, MessageSquare } from "lucide-react";
import {
  displayAskerName,
  MAX_ACTIVE_TICKETS,
  type PoolTicket,
  type QuestionUrgency,
} from "@/lib/mockData";

interface MyHelpingStripProps {
  tickets: PoolTicket[];
  onChat: (ticket: PoolTicket) => void;
}

const urgencyStyles: Record<QuestionUrgency, string> = {
  Urgent: "bg-red-100 text-red-700",
  Normal: "bg-amber-100 text-amber-700",
  "Can wait": "bg-stone-100 text-stone-500",
};

export default function MyHelpingStrip({ tickets, onChat }: MyHelpingStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  if (tickets.length === 0) return null;

  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="uppercase-label flex items-center gap-2 text-emerald-700">
          <HeartHandshake className="h-4 w-4" />
          My active helps · tickets you claimed
        </p>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
            {tickets.length}/{MAX_ACTIVE_TICKETS}
          </span>
          <button
            onClick={() => scrollBy(-1)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-paper-300 bg-white text-stone-500 transition hover:bg-paper-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollBy(1)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-paper-300 bg-white text-stone-500 transition hover:bg-paper-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tickets.map((t) => (
          <div
            key={t.id}
            className="flex w-64 shrink-0 flex-col gap-2 rounded-2xl border border-paper-300 bg-white p-3.5"
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
              Helping {displayAskerName(t)}
              {t.status === "open" ? " · identity hidden" : ` · ${t.askerRole}`}
            </p>
            <span
              className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                t.status === "ready"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {t.status === "ready" ? "Ready to chat" : "Claimed"}
            </span>
            <button
              onClick={() => t.status === "ready" && onChat(t)}
              disabled={t.status !== "ready"}
              className={`mt-1 flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition ${
                t.status === "ready"
                  ? "bg-brand-600 text-white hover:bg-brand-700 active:scale-95"
                  : "cursor-not-allowed bg-stone-100 text-stone-400"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              {t.status === "ready" ? "Open chat" : "Starting session…"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

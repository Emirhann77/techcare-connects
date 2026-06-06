"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, MessageSquare, Send } from "lucide-react";
import { MAX_ACTIVE_TICKETS, type MyRequest, type QuestionUrgency } from "@/lib/mockData";

interface MyRequestsStripProps {
  requests: MyRequest[];
  onChat: (request: MyRequest) => void;
}

const urgencyStyles: Record<QuestionUrgency, string> = {
  Urgent: "bg-red-100 text-red-700",
  Normal: "bg-amber-100 text-amber-700",
  "Can wait": "bg-stone-100 text-stone-500",
};

const statusLabel: Record<MyRequest["status"], string> = {
  "In pool": "Waiting in pool",
  Claimed: "Helper claimed",
  Ready: "Ready to chat",
};

export default function MyRequestsStrip({ requests, onChat }: MyRequestsStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <div className="rounded-3xl border border-brand-200 bg-brand-50/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="uppercase-label flex items-center gap-2 text-brand-700">
          <Send className="h-4 w-4" />
          My requests · questions you posted
        </p>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
            {requests.length}/{MAX_ACTIVE_TICKETS}
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

      {requests.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-brand-200 bg-white/60 px-4 py-6 text-center text-sm text-stone-500">
          No open requests yet. Post your question to the ticket pool and a helper
          will pick it up (max {MAX_ACTIVE_TICKETS} at a time).
        </p>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {requests.map((r) => (
            <div
              key={r.id}
              className="flex w-64 shrink-0 flex-col gap-2 rounded-2xl border border-paper-300 bg-white p-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="uppercase-label text-stone-400">{r.createdAgo}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${urgencyStyles[r.urgency]}`}
                >
                  {r.urgency}
                </span>
              </div>
              <p className="font-serif text-base leading-snug text-stone-900">{r.title}</p>
              <p className="text-xs text-stone-500">
                {r.status === "In pool"
                  ? "In the shared pool · waiting for a helper"
                  : r.helperLabel
                    ? `${r.helperLabel} · identity hidden until session ends`
                    : "A helper is reviewing your ticket"}
              </p>
              <span
                className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  r.status === "Ready"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {statusLabel[r.status]}
              </span>
              <button
                onClick={() => r.status === "Ready" && onChat(r)}
                disabled={r.status !== "Ready"}
                className={`mt-1 flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition ${
                  r.status === "Ready"
                    ? "bg-brand-600 text-white hover:bg-brand-700 active:scale-95"
                    : "cursor-not-allowed bg-stone-100 text-stone-400"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                {r.status === "Ready" ? "Open chat" : "Waiting for helper"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

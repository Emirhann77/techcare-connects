"use client";

import { ArrowLeft, Clock, HeartHandshake } from "lucide-react";
import { MAX_ACTIVE_TICKETS, type PoolTicket, type QuestionUrgency } from "@/lib/mockData";
import { resourcesForTags } from "@/lib/aiAnalysis";
import ResourceList from "./ResourceList";

interface PoolTicketDetailProps {
  ticket: PoolTicket;
  onBack: () => void;
  onClaim?: (ticket: PoolTicket) => void;
  atCapacity?: boolean;
}

const urgencyStyles: Record<QuestionUrgency, string> = {
  Urgent: "bg-red-100 text-red-700",
  Normal: "bg-amber-100 text-amber-700",
  "Can wait": "bg-stone-100 text-stone-500",
};

export default function PoolTicketDetail({
  ticket,
  onBack,
  onClaim,
  atCapacity,
}: PoolTicketDetailProps) {
  const resources = resourcesForTags(ticket.tags);

  return (
    <section className="animate-fade-in">
      <button
        onClick={onBack}
        className="uppercase-label mb-4 inline-flex items-center gap-1.5 text-stone-400 transition hover:text-stone-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to pool
      </button>

      <p className="uppercase-label text-stone-400">Ticket pool · detail</p>
      <h1 className="mt-2 max-w-2xl font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
        {ticket.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-stone-500">
        <span className="font-medium text-stone-700">{ticket.anonymousLabel}</span>
        <span className="text-xs text-stone-400">(identity hidden)</span>
        <span>·</span>
        <span>{ticket.askerRole}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${urgencyStyles[ticket.urgency]}`}
        >
          {ticket.urgency}
        </span>
        <span className="flex items-center gap-1 text-stone-400">
          <Clock className="h-3.5 w-3.5" />
          {ticket.postedAgo}
        </span>
      </div>

      <div className="mt-8 max-w-2xl">
        <div className="rounded-3xl border border-paper-300 bg-white p-6 shadow-sm sm:p-7">
          <p className="uppercase-label text-stone-400">Their question</p>
          <p className="mt-3 font-serif text-2xl leading-snug text-stone-900">
            &ldquo;{ticket.detail}&rdquo;
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {ticket.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-200"
              >
                {tag}
              </span>
            ))}
          </div>

          {atCapacity ? (
            <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-800">
              You&apos;re already helping {MAX_ACTIVE_TICKETS} colleagues. Finish an open session
              before claiming another ticket from the pool.
            </p>
          ) : (
            <button
              onClick={() => onClaim?.(ticket)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.99]"
            >
              <HeartHandshake className="h-4 w-4" />
              Claim &amp; help {ticket.anonymousLabel} (Earn 4 pts)
            </button>
          )}
        </div>

        <div className="mt-4">
          <ResourceList resources={resources} title="Bring these to the session" />
        </div>
      </div>
    </section>
  );
}

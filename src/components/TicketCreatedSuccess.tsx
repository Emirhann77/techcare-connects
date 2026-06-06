"use client";

import { ArrowRight, CheckCircle2, Ticket } from "lucide-react";
import type { MyRequest } from "@/lib/mockData";

interface TicketCreatedSuccessProps {
  request: MyRequest;
  onGoHome: () => void;
}

export default function TicketCreatedSuccess({
  request,
  onGoHome,
}: TicketCreatedSuccessProps) {
  return (
    <section className="mx-auto max-w-lg animate-fade-in text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <p className="uppercase-label mt-6 text-stone-400">Ticket created</p>
      <h1 className="mt-2 font-serif text-4xl leading-tight text-stone-900">
        We&apos;ve routed your question to a{" "}
        <span className="text-brand-600">matched expert</span>.
      </h1>
      <p className="mt-3 text-sm text-stone-500">
        Your ticket is in the queue. They&apos;ll be notified — open the chat from{" "}
        <span className="font-medium text-stone-700">My requests</span> on the home
        page once they&apos;re ready. Names stay hidden until you connect.
      </p>

      <div className="mt-8 rounded-3xl border border-paper-300 bg-white p-5 text-left shadow-sm">
        <div className="flex items-center gap-2 text-stone-400">
          <Ticket className="h-4 w-4" />
          <span className="uppercase-label">Your ticket · {request.id}</span>
        </div>
        <p className="mt-2 font-serif text-xl text-stone-900">{request.title}</p>
        <p className="mt-1 text-sm text-stone-500">
          Expert: {request.expertName} · {request.expertRole}
        </p>
        <p className="mt-2 text-xs text-stone-400">
          Urgency: {request.urgency} · Status: {request.status}
        </p>
      </div>

      <button
        onClick={onGoHome}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 active:scale-[0.99]"
      >
        Back to main page
        <ArrowRight className="h-4 w-4" />
      </button>
      <p className="mt-3 text-xs text-stone-400">
        Find it under &ldquo;My requests&rdquo; — separate from tickets assigned to
        you for helping others.
      </p>
    </section>
  );
}

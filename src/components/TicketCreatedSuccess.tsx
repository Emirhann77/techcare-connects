"use client";

import { useState } from "react";
import { ArrowRight, CalendarDays, Check, CheckCircle2, Ticket, X } from "lucide-react";
import {
  displayHelperName,
  meetingSpots,
  slotLabel,
  spotLabel,
  timeSlots,
  type MeetingProposal,
  type MyRequest,
} from "@/lib/mockData";

interface TicketCreatedSuccessProps {
  request: MyRequest;
  onGoHome: () => void;
  onAcceptProposal: (request: MyRequest) => void;
  onCounterProposal: (request: MyRequest, proposal: MeetingProposal) => void;
  onDeclineProposal: (request: MyRequest) => void;
}

export default function TicketCreatedSuccess({
  request,
  onGoHome,
  onAcceptProposal,
  onCounterProposal,
  onDeclineProposal,
}: TicketCreatedSuccessProps) {
  const [showCounter, setShowCounter] = useState(false);
  const [slotId, setSlotId] = useState(request.askerSlots[0] ?? timeSlots[0].id);
  const [spot, setSpot] = useState<string>(meetingSpots[0].id);
  const [note, setNote] = useState("");

  return (
    <section className="mx-auto max-w-lg animate-fade-in text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <p className="uppercase-label mt-6 text-stone-400">Posted to ticket pool</p>
      <h1 className="mt-2 font-serif text-4xl leading-tight text-stone-900">
        Your question is in the{" "}
        <span className="text-brand-600">shared pool</span>.
      </h1>
      <p className="mt-3 text-sm text-stone-500">
        Helpers browse and claim tickets. Once claimed, they propose a time and
        location — you accept before chat opens.
      </p>

      <div className="mt-8 rounded-3xl border border-paper-300 bg-white p-5 text-left shadow-sm">
        <div className="flex items-center gap-2 text-stone-400">
          <Ticket className="h-4 w-4" />
          <span className="uppercase-label">Your ticket · {request.id}</span>
        </div>
        <p className="mt-2 font-serif text-xl text-stone-900">{request.title}</p>
        <p className="mt-1 text-sm text-stone-500">
          Status: {request.status} · Urgency: {request.urgency}
        </p>
        {displayHelperName(request) && (
          <p className="mt-2 text-sm font-medium text-brand-700">
            Helper: {displayHelperName(request)}
            {request.helperRole ? ` · ${request.helperRole}` : ""}
          </p>
        )}
        {request.status === "Awaiting OK" && request.proposal && (
          <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <p className="font-semibold">Meeting proposed</p>
            <p className="mt-0.5 text-xs">
              {spotLabel(request.proposal.spot)} · {slotLabel(request.proposal.slotId)}
            </p>
            {request.proposal.note && (
              <p className="mt-1 text-xs italic">&ldquo;{request.proposal.note}&rdquo;</p>
            )}
          </div>
        )}
      </div>

      {request.status === "Awaiting OK" ? (
        <div className="mt-6 space-y-2">
          {!showCounter ? (
            <>
              <button
                type="button"
                onClick={() => onAcceptProposal(request)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.99]"
              >
                <Check className="h-4 w-4" />
                Accept meeting
              </button>
              <button
                type="button"
                onClick={() => setShowCounter(true)}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-brand-300 bg-white px-4 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                <CalendarDays className="h-4 w-4" />
                Propose another date
              </button>
              <button
                type="button"
                onClick={() => onDeclineProposal(request)}
                className="flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-stone-400 transition hover:text-red-600"
              >
                <X className="h-4 w-4" />
                Decline
              </button>
            </>
          ) : (
            <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                Your preferred time
              </p>
              <div className="mt-2 space-y-1">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSlotId(slot.id)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                      slotId === slot.id
                        ? "border-brand-500 bg-white font-medium"
                        : "border-transparent bg-white/70"
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {meetingSpots.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSpot(m.id)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      spot === m.id
                        ? "bg-stone-900 text-white"
                        : "bg-white ring-1 ring-paper-300"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onCounterProposal(request, {
                      spot,
                      slotId,
                      note: note.trim() || undefined,
                      from: "helpee",
                    });
                    setShowCounter(false);
                  }}
                  className="flex-1 rounded-full bg-brand-600 py-2 text-sm font-semibold text-white"
                >
                  Send new time
                </button>
                <button
                  type="button"
                  onClick={() => setShowCounter(false)}
                  className="rounded-full px-4 py-2 text-sm text-stone-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={onGoHome}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 active:scale-[0.99]"
        >
          Back to main page
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </section>
  );
}

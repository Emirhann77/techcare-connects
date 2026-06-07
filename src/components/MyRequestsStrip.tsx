"use client";

import { useState } from "react";
import {
  CalendarDays,
  Check,
  MessageSquare,
  Send,
  X,
} from "lucide-react";
import {
  displayHelperName,
  MAX_ACTIVE_TICKETS,
  meetingSpots,
  slotLabel,
  spotLabel,
  timeSlots,
  type MeetingProposal,
  type MyRequest,
  type QuestionUrgency,
} from "@/lib/mockData";

interface MyRequestsStripProps {
  requests: MyRequest[];
  onChat: (request: MyRequest) => void;
  onAcceptProposal: (request: MyRequest) => void;
  onCounterProposal: (request: MyRequest, proposal: MeetingProposal) => void;
  onDeclineProposal: (request: MyRequest) => void;
  layout?: "column" | "strip";
}

const urgencyStyles: Record<QuestionUrgency, string> = {
  Urgent: "bg-red-100 text-red-700",
  Normal: "bg-amber-100 text-amber-700",
  "Can wait": "bg-stone-100 text-stone-500",
};

const statusLabel: Record<MyRequest["status"], string> = {
  "In pool": "Waiting in pool",
  Claimed: "Helper claimed",
  "Awaiting OK": "Meeting proposed",
  "Awaiting helper": "Waiting on helper",
  Ready: "Ready to chat",
};

function CounterProposalForm({
  request,
  onSubmit,
  onCancel,
}: {
  request: MyRequest;
  onSubmit: (proposal: MeetingProposal) => void;
  onCancel: () => void;
}) {
  const askerSlots = request.askerSlots ?? [];
  const defaultSlot = askerSlots[0] ?? timeSlots[1]?.id ?? timeSlots[0].id;
  const [slotId, setSlotId] = useState(defaultSlot);
  const [spot, setSpot] = useState<string>(meetingSpots[0].id);
  const [note, setNote] = useState("");

  return (
    <div className="mt-2 space-y-2 rounded-xl border border-brand-200 bg-brand-50/50 p-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-700">
        Your preferred time
      </p>
      <div className="max-h-28 space-y-1 overflow-y-auto">
        {timeSlots.map((slot) => (
          <button
            key={slot.id}
            type="button"
            onClick={() => setSlotId(slot.id)}
            className={`w-full rounded-lg border px-2 py-1.5 text-left text-[11px] transition ${
              slotId === slot.id
                ? "border-brand-500 bg-white font-medium text-brand-800"
                : "border-transparent bg-white/70 text-stone-600 hover:bg-white"
            }`}
          >
            {slot.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {meetingSpots.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setSpot(m.id)}
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition ${
              spot === m.id
                ? "bg-stone-900 text-white"
                : "bg-white text-stone-600 ring-1 ring-paper-300"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Short note (optional)"
        className="w-full rounded-lg border border-paper-300 bg-white px-2 py-1.5 text-[11px] outline-none focus:border-brand-400"
      />
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={() =>
            onSubmit({ spot, slotId, note: note.trim() || undefined, from: "helpee" })
          }
          className="flex flex-1 items-center justify-center gap-1 rounded-full bg-brand-600 px-2 py-1.5 text-[11px] font-semibold text-white hover:bg-brand-700"
        >
          <CalendarDays className="h-3 w-3" />
          Send
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-2 py-1.5 text-[11px] font-medium text-stone-500 hover:bg-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function RequestCard({
  request: r,
  onChat,
  onAcceptProposal,
  onCounterProposal,
  onDeclineProposal,
}: {
  request: MyRequest;
  onChat: (request: MyRequest) => void;
  onAcceptProposal: (request: MyRequest) => void;
  onCounterProposal: (request: MyRequest, proposal: MeetingProposal) => void;
  onDeclineProposal: (request: MyRequest) => void;
}) {
  const [showCounter, setShowCounter] = useState(false);

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-paper-300 bg-white p-3.5 shadow-sm">
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
          : r.status === "Awaiting OK" && r.proposal
            ? `${displayHelperName(r)} proposes ${spotLabel(r.proposal.spot)} · ${slotLabel(r.proposal.slotId)}`
            : r.status === "Awaiting helper" && r.proposal
              ? `You proposed ${spotLabel(r.proposal.spot)} · ${slotLabel(r.proposal.slotId)}`
              : displayHelperName(r)
                ? `Helper: ${displayHelperName(r)}${r.helperRole ? ` · ${r.helperRole}` : ""}`
                : "A helper is reviewing your ticket"}
      </p>
      {r.status === "Awaiting OK" && r.proposal?.note && (
        <p className="text-[11px] italic text-stone-400">
          &ldquo;{r.proposal.note}&rdquo;
        </p>
      )}
      <span
        className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
          r.status === "Ready"
            ? "bg-emerald-100 text-emerald-700"
            : r.status === "Awaiting helper"
              ? "bg-sky-100 text-sky-700"
              : "bg-amber-100 text-amber-700"
        }`}
      >
        {statusLabel[r.status]}
      </span>

      {r.status === "Awaiting OK" ? (
        <div className="mt-1 space-y-1.5">
          {!showCounter ? (
            <>
              <button
                type="button"
                onClick={() => onAcceptProposal(r)}
                className="flex w-full items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 active:scale-95"
              >
                <Check className="h-3.5 w-3.5" />
                Accept meeting
              </button>
              <button
                type="button"
                onClick={() => setShowCounter(true)}
                className="flex w-full items-center justify-center gap-1.5 rounded-full border border-brand-300 bg-white px-3 py-2 text-xs font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                <CalendarDays className="h-3.5 w-3.5" />
                Propose another date
              </button>
              <button
                type="button"
                onClick={() => onDeclineProposal(r)}
                className="flex w-full items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-stone-400 transition hover:bg-stone-50 hover:text-red-600"
              >
                <X className="h-3.5 w-3.5" />
                Decline
              </button>
            </>
          ) : (
            <CounterProposalForm
              request={r}
              onSubmit={(p) => {
                onCounterProposal(r, p);
                setShowCounter(false);
              }}
              onCancel={() => setShowCounter(false)}
            />
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => r.status === "Ready" && onChat(r)}
          disabled={r.status !== "Ready"}
          className={`mt-1 flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition ${
            r.status === "Ready"
              ? "bg-brand-600 text-white hover:bg-brand-700 active:scale-95"
              : "cursor-not-allowed bg-stone-100 text-stone-400"
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          {r.status === "Ready"
            ? "Open chat"
            : r.status === "Awaiting helper"
              ? "Helper reviewing…"
              : "Waiting for helper"}
        </button>
      )}
    </div>
  );
}

export default function MyRequestsStrip({
  requests,
  onChat,
  onAcceptProposal,
  onCounterProposal,
  onDeclineProposal,
  layout = "column",
}: MyRequestsStripProps) {
  const isColumn = layout === "column";

  return (
    <div
      className={`card-surface border-accent-pink/20 bg-gradient-to-br from-white to-accent-pink/5 ${
        isColumn ? "sticky top-6 p-4" : "p-4 sm:p-5"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="uppercase-label flex items-center gap-2 text-brand-700">
          <Send className="h-4 w-4" />
          My requests
        </p>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
          {requests.length}/{MAX_ACTIVE_TICKETS}
        </span>
      </div>

      {requests.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-brand-200 bg-white/60 px-4 py-6 text-center text-sm text-stone-500">
          No open requests yet. Post your question to the ticket pool (max{" "}
          {MAX_ACTIVE_TICKETS} at a time).
        </p>
      ) : (
        <div className={isColumn ? "space-y-3" : "flex gap-3 overflow-x-auto pb-1"}>
          {requests.map((r) => (
            <div key={r.id} className={isColumn ? "" : "w-64 shrink-0"}>
              <RequestCard
                request={r}
                onChat={onChat}
                onAcceptProposal={onAcceptProposal}
                onCounterProposal={onCounterProposal}
                onDeclineProposal={onDeclineProposal}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

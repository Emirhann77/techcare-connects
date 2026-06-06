"use client";

import { useState } from "react";
import { ArrowRight, CalendarDays, Check, MapPin } from "lucide-react";
import BackButton from "./BackButton";
import {
  displayAskerName,
  meetingSpots,
  slotLabel,
  timeSlots,
  type MeetingProposal,
  type PoolTicket,
} from "@/lib/mockData";

interface HelperProposalStepProps {
  ticket: PoolTicket;
  onBack: () => void;
  onSubmit: (proposal: MeetingProposal) => void;
}

export default function HelperProposalStep({
  ticket,
  onBack,
  onSubmit,
}: HelperProposalStepProps) {
  const askerSlots = ticket.askerSlots ?? [];
  const defaultSlot = askerSlots[0] ?? timeSlots[0].id;
  const [slotId, setSlotId] = useState(defaultSlot);
  const [spot, setSpot] = useState<string>(meetingSpots[0].id);
  const [note, setNote] = useState("");

  return (
    <section className="animate-fade-in">
      <BackButton onClick={onBack} />

      <p className="uppercase-label text-stone-400">Propose a meeting</p>
      <h1 className="mt-2 max-w-2xl font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
        Set time &amp; place for{" "}
        <span className="text-brand-600">{displayAskerName(ticket)}</span>
      </h1>
      <p className="mt-3 max-w-xl text-stone-500">
        You claimed this ticket. Pick a location and time — use their windows or
        suggest a later slot if you need to delay. They&apos;ll accept before chat opens.
      </p>

      <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-paper-300 bg-white p-6 shadow-sm sm:p-7">
        {askerSlots.length > 0 && (
          <>
            <p className="uppercase-label flex items-center gap-2 text-stone-400">
              <CalendarDays className="h-4 w-4" />
              Their preferred times
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {askerSlots.map((id) => (
                <span
                  key={id}
                  className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-200"
                >
                  {slotLabel(id)}
                </span>
              ))}
            </div>
          </>
        )}

        <p className="uppercase-label mt-6 flex items-center gap-2 text-stone-400">
          <CalendarDays className="h-4 w-4" />
          Your proposed time
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {timeSlots.map((slot) => {
            const selected = slotId === slot.id;
            const isTheirs = askerSlots.includes(slot.id);
            return (
              <button
                key={slot.id}
                onClick={() => setSlotId(slot.id)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                  selected
                    ? "border-brand-500 bg-brand-50"
                    : "border-paper-300 hover:border-stone-300"
                }`}
              >
                <span className="text-sm text-stone-900">
                  {slot.label}
                  {isTheirs && (
                    <span className="ml-1 text-[10px] text-emerald-600">· matches theirs</span>
                  )}
                </span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    selected
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-stone-300 text-transparent"
                  }`}
                >
                  <Check className="h-3 w-3" />
                </span>
              </button>
            );
          })}
        </div>

        <p className="uppercase-label mt-6 flex items-center gap-2 text-stone-400">
          <MapPin className="h-4 w-4" />
          Where to meet
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {meetingSpots.map((m) => (
            <button
              key={m.id}
              onClick={() => setSpot(m.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                spot === m.id
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-paper-300 text-stone-600 hover:border-stone-300"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <label className="mt-6 block">
          <span className="uppercase-label text-stone-400">
            Note (optional — e.g. need to delay)
          </span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Can only do Tuesday instead…"
            className="mt-2 w-full rounded-xl border border-paper-300 px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </label>

        <button
          onClick={() => onSubmit({ spot, slotId, note: note.trim() || undefined })}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.99]"
        >
          Send meeting request to helpee
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

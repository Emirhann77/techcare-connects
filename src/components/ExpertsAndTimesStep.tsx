"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  MapPin,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import {
  meetingSpots,
  mockPeers,
  questionUrgencyOptions,
  timeSlots,
  type Peer,
  type QuestionUrgency,
} from "@/lib/mockData";
import { matchPeers } from "@/lib/matching";
import PeerCard from "./PeerCard";
import type { AvailabilityChoice } from "./AvailabilityStep";

interface ExpertsAndTimesStepProps {
  matchTags: string[];
  focusTopic?: string;
  atRequestLimit: boolean;
  onCreateTicket: (peer: Peer, choice: AvailabilityChoice) => void;
}

export default function ExpertsAndTimesStep({
  matchTags,
  focusTopic,
  atRequestLimit,
  onCreateTicket,
}: ExpertsAndTimesStepProps) {
  const [slots, setSlots] = useState<string[]>([]);
  const [spot, setSpot] = useState<string>(meetingSpots[0].id);
  const [urgency, setUrgency] = useState<QuestionUrgency>("Normal");
  const [okayToWait, setOkayToWait] = useState(false);

  const choice: AvailabilityChoice = { slots, spot, urgency, okayToWait };

  const matches = useMemo(
    () =>
      matchPeers(matchTags, mockPeers, {
        selectedSlots: slots,
        okayToWait,
        urgency,
      }),
    [matchTags, slots, okayToWait, urgency]
  );

  const toggleSlot = (id: string) => {
    setSlots((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const spotLabel = meetingSpots.find((m) => m.id === spot)?.label ?? spot;
  const selectedSlotLabels = timeSlots
    .filter((s) => slots.includes(s.id))
    .map((s) => s.label);

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-2xl rounded-3xl border border-paper-300 bg-white p-6 shadow-sm sm:p-7">
        <p className="uppercase-label text-stone-400">Step 1 · Your times &amp; urgency</p>
        <p className="mt-1 text-sm text-stone-500">
          {focusTopic ? (
            <>
              Focused topic: <span className="font-medium text-stone-700">{focusTopic}</span>.
              Pick when you&apos;re free — experts below update to match.
            </>
          ) : (
            <>Pick your windows once. We won&apos;t ask again later.</>
          )}
        </p>

        <p className="uppercase-label mt-5 flex items-center gap-2 text-stone-400">
          <CalendarDays className="h-4 w-4" />
          When are you free?
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {timeSlots.map((slot) => {
            const selected = slots.includes(slot.id);
            return (
              <button
                key={slot.id}
                onClick={() => toggleSlot(slot.id)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                  selected
                    ? "border-brand-500 bg-brand-50"
                    : "border-paper-300 hover:border-stone-300"
                }`}
              >
                <span className="font-serif text-base text-stone-900">{slot.label}</span>
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

        <p className="uppercase-label mt-5 flex items-center gap-2 text-stone-400">
          <Zap className="h-4 w-4" />
          How urgent?
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {questionUrgencyOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setUrgency(opt.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                urgency === opt.id
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-paper-300 text-stone-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <p className="uppercase-label mt-5 flex items-center gap-2 text-stone-400">
          <MapPin className="h-4 w-4" />
          Where to meet
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {meetingSpots.map((m) => (
            <button
              key={m.id}
              onClick={() => setSpot(m.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                spot === m.id
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-paper-300 text-stone-600"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <label className="mt-4 flex cursor-pointer items-start gap-2">
          <input
            type="checkbox"
            checked={okayToWait}
            onChange={(e) => setOkayToWait(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-brand-600"
          />
          <span className="text-xs text-stone-600">
            <Users className="mr-1 inline h-3.5 w-3.5" />
            I&apos;m okay to wait for busy experts
          </span>
        </label>
      </div>

      <div className="animate-fade-in">
        <p className="uppercase-label text-stone-400">Step 2 · Experts for your times</p>
        <h2 className="mt-1 font-serif text-3xl text-stone-900">
          Top <span className="text-brand-600">{matches.length}</span> matches
        </h2>

        {slots.length > 0 && (
          <div className="mt-4 rounded-2xl border border-brand-200 bg-brand-50/60 p-4">
            <p className="uppercase-label text-brand-700">Your schedule (locked in)</p>
            <p className="mt-1 text-sm font-medium text-stone-800">
              {selectedSlotLabels.join(" · ")}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              {spotLabel} · {urgency}
              {urgency === "Urgent" && " — experts free soonest shown first"}
            </p>
          </div>
        )}

        {slots.length === 0 && (
          <p className="mt-3 text-sm text-amber-700">
            Pick at least one time slot above to see which experts overlap.
          </p>
        )}

        {atRequestLimit && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            You have 3 open requests. Resolve one from My requests before creating another.
          </div>
        )}

        {matches.length > 0 && slots.length > 0 && (
          <div className="mt-4 rounded-3xl border border-brand-200 bg-white p-4">
            <p className="uppercase-label flex items-center gap-1.5 text-brand-700">
              <Sparkles className="h-4 w-4" />
              #1 Match
            </p>
            <p className="font-serif text-xl text-stone-900">
              <span className="text-brand-600">
                {matches[0].peer.name}
              </span>{" "}
              — free at{" "}
              {matches[0].matchedSlots[0]
                ? timeSlots.find((t) => t.id === matches[0].matchedSlots[0])?.label
                : "your times"}
            </p>
          </div>
        )}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {matches.map(({ peer, matchedTags, matchedSlots }, i) => (
            <PeerCard
              key={peer.id}
              peer={peer}
              matchedTags={matchedTags}
              matchedSlots={matchedSlots}
              highlight={i === 0}
              connectDisabled={atRequestLimit || slots.length === 0}
              connectLabel={
                slots.length === 0
                  ? "Pick a time first"
                  : atRequestLimit
                    ? "Limit reached (3/3)"
                    : "Create ticket"
              }
              onConnect={(p) => onCreateTicket(p, choice)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

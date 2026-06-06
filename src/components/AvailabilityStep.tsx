"use client";

import { useState } from "react";
import { ArrowRight, CalendarDays, Check, MapPin, Users, Zap } from "lucide-react";
import {
  meetingSpots,
  questionUrgencyOptions,
  timeSlots,
  type QuestionUrgency,
} from "@/lib/mockData";

export interface AvailabilityChoice {
  slots: string[];
  spot: string;
  urgency: QuestionUrgency;
  okayToWait: boolean;
}

interface AvailabilityStepProps {
  onContinue: (choice: AvailabilityChoice) => void;
}

export default function AvailabilityStep({ onContinue }: AvailabilityStepProps) {
  const [slots, setSlots] = useState<string[]>([]);
  const [spot, setSpot] = useState<string>(meetingSpots[0].id);
  const [urgency, setUrgency] = useState<QuestionUrgency>("Normal");
  const [okayToWait, setOkayToWait] = useState(false);

  const toggleSlot = (id: string) => {
    setSlots((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-in">
      <div className="rounded-3xl border border-paper-300 bg-white p-6 shadow-sm sm:p-7">
        <p className="uppercase-label flex items-center gap-2 text-stone-400">
          <CalendarDays className="h-4 w-4" />
          Choose one or more
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {timeSlots.map((slot) => {
            const selected = slots.includes(slot.id);
            return (
              <button
                key={slot.id}
                onClick={() => toggleSlot(slot.id)}
                className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition ${
                  selected
                    ? "border-brand-500 bg-brand-50"
                    : "border-paper-300 hover:border-stone-300"
                }`}
              >
                <span className="font-serif text-lg text-stone-900">{slot.label}</span>
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
          <Zap className="h-4 w-4" />
          How urgent is your question?
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {questionUrgencyOptions.map((opt) => {
            const selected = urgency === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setUrgency(opt.id)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  selected
                    ? opt.id === "Urgent"
                      ? "border-red-400 bg-red-50 ring-1 ring-red-200"
                      : opt.id === "Can wait"
                        ? "border-stone-400 bg-stone-50 ring-1 ring-stone-200"
                        : "border-brand-500 bg-brand-50 ring-1 ring-brand-200"
                    : "border-paper-300 hover:border-stone-300"
                }`}
              >
                <span
                  className={`text-sm font-semibold ${
                    selected && opt.id === "Urgent"
                      ? "text-red-700"
                      : selected
                        ? "text-stone-900"
                        : "text-stone-700"
                  }`}
                >
                  {opt.label}
                </span>
                <span className="mt-0.5 block text-xs text-stone-500">{opt.hint}</span>
              </button>
            );
          })}
        </div>

        <p className="uppercase-label mt-6 flex items-center gap-2 text-stone-400">
          <MapPin className="h-4 w-4" />
          Where to meet
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {meetingSpots.map((m) => {
            const selected = spot === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSpot(m.id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  selected
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-paper-300 text-stone-600 hover:border-stone-300"
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={okayToWait}
            onChange={(e) => setOkayToWait(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-brand-600"
          />
          <span className="text-sm">
            <span className="flex items-center gap-1.5 font-medium text-stone-800">
              <Users className="h-4 w-4 text-stone-400" />
              I&apos;m okay to wait for busy experts
            </span>
            <span className="text-stone-500">
              Also show people who are Busy or Away — the best person may not be free
              right now.
            </span>
          </span>
        </label>

        <button
          onClick={() => onContinue({ slots, spot, urgency, okayToWait })}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.99]"
        >
          Find matching experts
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-2 text-center text-xs text-stone-400">
          {slots.length > 0
            ? `${slots.length} time slot${slots.length > 1 ? "s" : ""} selected`
            : "Tip: pick at least one slot for the best time match"}
        </p>
      </div>
    </div>
  );
}

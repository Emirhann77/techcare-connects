"use client";

import { useState } from "react";
import { CalendarClock, Check, Clock, MapPin, Users } from "lucide-react";
import { meetingSpots, timeSlots } from "@/lib/mockData";

export interface AvailabilityChoice {
  slots: string[];
  spot: string;
  okayToWait: boolean;
}

interface AvailabilityStepProps {
  onContinue: (choice: AvailabilityChoice) => void;
}

export default function AvailabilityStep({ onContinue }: AvailabilityStepProps) {
  const [slots, setSlots] = useState<string[]>([]);
  const [spot, setSpot] = useState<string>(meetingSpots[0].id);
  const [okayToWait, setOkayToWait] = useState(false);

  const toggleSlot = (id: string) => {
    setSlots((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-in">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-slate-900">When works for you?</p>
            <p className="text-xs text-slate-500">
              Step 2 · We&apos;ll match you with experts free at the same time
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <Clock className="h-4 w-4 text-slate-400" />
            Pick the times you&apos;re available
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {timeSlots.map((slot) => {
              const selected = slots.includes(slot.id);
              return (
                <button
                  key={slot.id}
                  onClick={() => toggleSlot(slot.id)}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    selected
                      ? "border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-200"
                      : "border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {slot.label}
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      selected
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-slate-300 text-transparent"
                    }`}
                  >
                    <Check className="h-3 w-3" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5">
          <p className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <MapPin className="h-4 w-4 text-slate-400" />
            Where would you like to meet?
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
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-50 p-4">
          <input
            type="checkbox"
            checked={okayToWait}
            onChange={(e) => setOkayToWait(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-brand-600"
          />
          <span className="text-sm">
            <span className="flex items-center gap-1.5 font-medium text-slate-800">
              <Users className="h-4 w-4 text-slate-400" />
              I&apos;m okay to wait for busy experts
            </span>
            <span className="text-slate-500">
              Also show people who are Busy or Away — the best person to help may
              not be free right now.
            </span>
          </span>
        </label>

        <button
          onClick={() => onContinue({ slots, spot, okayToWait })}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99]"
        >
          Find matching experts
        </button>
        <p className="mt-2 text-center text-xs text-slate-400">
          {slots.length > 0
            ? `${slots.length} time slot${slots.length > 1 ? "s" : ""} selected`
            : "Tip: pick at least one slot for the best time match"}
        </p>
      </div>
    </div>
  );
}

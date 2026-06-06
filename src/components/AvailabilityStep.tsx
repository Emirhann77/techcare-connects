"use client";

import { useState } from "react";
import { ArrowRight, Bot, CalendarDays, Check, Zap } from "lucide-react";
import {
  complexityLabels,
  questionUrgencyOptions,
  timeSlots,
  type QuestionComplexity,
  type QuestionUrgency,
} from "@/lib/mockData";

export interface AvailabilityChoice {
  slots: string[];
  urgency: QuestionUrgency;
}

interface AvailabilityStepProps {
  complexity: QuestionComplexity;
  onContinue: (choice: AvailabilityChoice) => void;
}

export default function AvailabilityStep({
  complexity,
  onContinue,
}: AvailabilityStepProps) {
  const [slots, setSlots] = useState<string[]>([]);
  const [urgency, setUrgency] = useState<QuestionUrgency>("Normal");

  const toggleSlot = (id: string) => {
    setSlots((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const complexityInfo = complexityLabels[complexity];

  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-in">
      <div className="rounded-3xl border border-paper-300 bg-white p-6 shadow-sm sm:p-7">
        <div className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3">
          <p className="uppercase-label flex items-center gap-2 text-brand-700">
            <Bot className="h-4 w-4" />
            AI set complexity
          </p>
          <p className="mt-1 font-serif text-lg text-stone-900">{complexityInfo.label}</p>
          <p className="text-xs text-stone-500">{complexityInfo.hint}</p>
        </div>

        <p className="uppercase-label mt-6 flex items-center gap-2 text-stone-400">
          <CalendarDays className="h-4 w-4" />
          When are you free?
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

        <button
          onClick={() => onContinue({ slots, urgency })}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.99]"
        >
          Post to ticket pool
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-2 text-center text-xs text-stone-400">
          {slots.length > 0
            ? `${slots.length} time slot${slots.length > 1 ? "s" : ""} selected · location set by helper after claim`
            : "Tip: pick at least one slot — helpers propose the meeting place"}
        </p>
      </div>
    </div>
  );
}

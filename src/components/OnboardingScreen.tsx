"use client";

import { ArrowRight, Network, Star, Trophy } from "lucide-react";

interface OnboardingScreenProps {
  onContinue: () => void;
}

const benefits = [
  {
    icon: Network,
    title: "Widen your network",
    text: "Meet colleagues you'd never cross paths with otherwise.",
  },
  {
    icon: Trophy,
    title: "Real work challenges",
    text: "Help with problems that actually matter — not textbook stuff.",
  },
  {
    icon: Star,
    title: "Employee of the month",
    text: "Helping counts toward recognition and your annual review.",
  },
];

export default function OnboardingScreen({ onContinue }: OnboardingScreenProps) {
  return (
    <section className="mx-auto max-w-3xl animate-fade-in px-4 py-12 sm:py-16">
      <div className="text-center">
        <p className="uppercase-label text-stone-400">TechCare Connects</p>
        <h1 className="mt-3 font-serif text-4xl font-bold text-stone-900 sm:text-5xl">
          How might TechCare Connects help you?
        </h1>
        <div className="mx-auto mt-5 max-w-lg rounded-2xl border border-accent-pink/30 bg-white px-5 py-4 shadow-sm">
          <p className="font-serif text-lg text-stone-800">
            Stuck on SQL but tired of generic AI answers?
          </p>
        </div>
      </div>

      <div className="relative my-8 flex items-center justify-center">
        <span className="h-px w-full bg-paper-200" />
        <span className="absolute rounded-full border border-paper-200 bg-white px-5 py-1 font-serif text-base font-semibold italic text-stone-400 shadow-sm">
          Or
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {benefits.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-2xl border border-paper-300 bg-white p-5 shadow-sm transition hover:border-accent-pink/40 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-pink/20 to-accent-orange/20 text-accent-pink">
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-3 font-semibold text-stone-900">{title}</p>
            <p className="mt-1 text-sm text-stone-500">{text}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="btn-gradient mx-auto mt-10 flex w-full max-w-xs items-center justify-center gap-2 py-3.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95 active:scale-[0.98] sm:w-auto sm:px-12"
      >
        Continue
        <ArrowRight className="h-4 w-4" />
      </button>
      <p className="mt-4 text-center text-xs text-stone-400">
        Prototype demo · logged in as Thomas
      </p>
    </section>
  );
}

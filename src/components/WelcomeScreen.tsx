"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import ConnectIllustration from "./ConnectIllustration";

interface WelcomeScreenProps {
  onContinue: () => void;
  onSkip: () => void;
}

export default function WelcomeScreen({ onContinue, onSkip }: WelcomeScreenProps) {
  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-accent-pink/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-20 h-56 w-56 rounded-full bg-accent-orange/20 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center">
        <div className="mb-8 flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:mb-10">
          <span className="hidden h-px w-16 bg-gradient-to-r from-transparent to-accent-pink/60 sm:block" />
          <Sparkles className="h-5 w-5 shrink-0 text-accent-pink" />
          <h2 className="bg-gradient-to-r from-accent-pink via-stone-800 to-accent-orange bg-clip-text font-serif text-3xl font-bold tracking-tight text-transparent sm:text-5xl">
            TechCare Connects
          </h2>
          <Sparkles className="h-5 w-5 shrink-0 text-accent-orange" />
          <span className="hidden h-px w-16 bg-gradient-to-l from-transparent to-accent-orange/60 sm:block" />
        </div>

        <h1 className="font-serif text-6xl font-bold tracking-tight text-stone-900 sm:text-8xl">
          WELCOME
        </h1>
        <p className="mt-4 max-w-md text-stone-500">
          Real colleagues. Real answers. No more generic AI fluff.
        </p>

        <div className="mt-10 flex w-full justify-center">
          <ConnectIllustration />
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="btn-gradient mt-12 inline-flex items-center gap-2 px-10 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 active:scale-[0.98]"
        >
          Enter
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="mt-4 text-sm font-medium text-stone-400 transition hover:text-stone-600"
        >
          Skip
        </button>
      </div>
    </section>
  );
}

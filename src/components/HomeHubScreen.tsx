"use client";

import { ArrowRight, HandHeart, HelpCircle } from "lucide-react";

export type HubMode = "getting-help" | "helping";

interface HomeHubScreenProps {
  onSelect: (mode: HubMode) => void;
}

export default function HomeHubScreen({ onSelect }: HomeHubScreenProps) {
  return (
    <section className="mx-auto max-w-4xl animate-fade-in py-4 sm:py-8">
      <div className="text-center">
        <p className="uppercase-label text-stone-400">TechCare Connects</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
          What would you like to do?
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-stone-500">
          Pick a path — ask for help or help a colleague. You can switch anytime.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6">
        <button
          type="button"
          onClick={() => onSelect("getting-help")}
          className="group flex flex-col rounded-3xl border-2 border-accent-pink/30 bg-gradient-to-br from-accent-pink/10 via-white to-white p-6 text-left shadow-sm transition hover:border-accent-pink/50 hover:shadow-md active:scale-[0.99] sm:p-8"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-pink/15 text-accent-pink">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h2 className="mt-5 font-serif text-2xl font-bold text-stone-900">
            Getting help
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-500">
            Ask the AI first, then post to the pool if you need a colleague who&apos;s
            been there.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-pink">
            Go to help centre
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelect("helping")}
          className="group flex flex-col rounded-3xl border-2 border-accent-orange/30 bg-gradient-to-br from-accent-orange/10 via-white to-white p-6 text-left shadow-sm transition hover:border-accent-orange/50 hover:shadow-md active:scale-[0.99] sm:p-8"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-orange/15 text-accent-orange">
            <HandHeart className="h-6 w-6" />
          </div>
          <h2 className="mt-5 font-serif text-2xl font-bold text-stone-900">
            Helping
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-500">
            Browse the ticket pool, claim a question, and share what you know.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-orange">
            Go to ticket pool
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </button>
      </div>
    </section>
  );
}

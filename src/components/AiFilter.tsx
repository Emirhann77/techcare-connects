"use client";

import { useState } from "react";
import { Bot, Loader2, Send, UserSearch } from "lucide-react";

interface AiFilterProps {
  defaultProblem: string;
  onEscalate: (problem: string) => void;
}

type Phase = "input" | "analyzing" | "verdict";

export default function AiFilter({ defaultProblem, onEscalate }: AiFilterProps) {
  const [problem, setProblem] = useState(defaultProblem);
  const [phase, setPhase] = useState<Phase>("input");

  const submit = () => {
    if (!problem.trim()) return;
    setPhase("analyzing");
    // Fake the AI "thinking" so the first-filter step is tangible.
    setTimeout(() => setPhase("verdict"), 1800);
  };

  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-in">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Bot className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-slate-900">AI Assistant</p>
            <p className="text-xs text-slate-500">Step 1 · First filter for your question</p>
          </div>
        </div>

        <div className="mt-5">
          <label className="text-sm font-medium text-slate-700">
            What do you need help with?
          </label>
          <div className="mt-2 flex items-end gap-2">
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              disabled={phase !== "input"}
              rows={2}
              className="flex-1 resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50 disabled:text-slate-500"
              placeholder="e.g. I need help with loan-approval reports in FinFlow."
            />
            <button
              onClick={submit}
              disabled={phase !== "input"}
              className="inline-flex h-[52px] items-center gap-2 rounded-2xl bg-brand-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-95 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              Ask
            </button>
          </div>
        </div>

        {phase === "analyzing" && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
            AI analyzing your request…
          </div>
        )}

        {phase === "verdict" && (
          <div className="mt-5 animate-fade-in space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-800">
                AI cannot answer this.
              </p>
              <p className="mt-1 text-sm text-amber-700">
                This requires <span className="font-semibold">company-specific
                experience</span> that isn&apos;t in any manual, on Google, or in a
                general AI model. Let&apos;s find an internal expert who has lived
                this before.
              </p>
            </div>

            <button
              onClick={() => onEscalate(problem)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99]"
            >
              <UserSearch className="h-4 w-4" />
              Find an internal expert
            </button>
            <p className="text-center text-xs text-slate-400">
              AI is the first filter. People are the second level.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

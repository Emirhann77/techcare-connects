"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Sparkles,
  UserSearch,
  Users,
} from "lucide-react";
import {
  analyzeQuery,
  exampleQueries,
  getBroadFollowUps,
  validateCustomTopic,
  type QueryAnalysis,
} from "@/lib/aiAnalysis";
import type { QuestionComplexity } from "@/lib/mockData";
import ResourceList from "./ResourceList";

export interface ProceedContext {
  problem: string;
  tags: string[];
  topic?: string;
  complexity: QuestionComplexity;
}

interface AiFilterProps {
  defaultProblem: string;
  onProceed: (ctx: ProceedContext) => void;
}

type Phase = "input" | "analyzing" | "verdict" | "self-served";

export default function AiFilter({ defaultProblem, onProceed }: AiFilterProps) {
  const [problem, setProblem] = useState(defaultProblem);
  const [phase, setPhase] = useState<Phase>("input");
  const [analysis, setAnalysis] = useState<QueryAnalysis | null>(null);
  const [selectedExample, setSelectedExample] = useState<string | null>(null);

  const submit = () => {
    if (!problem.trim()) return;
    setPhase("analyzing");
    setTimeout(() => {
      setAnalysis(analyzeQuery(problem));
      setPhase("verdict");
    }, 1700);
  };

  const reAsk = () => {
    setPhase("input");
    setAnalysis(null);
  };

  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-in">
      <div className="rounded-3xl border border-paper-300 bg-white p-6 shadow-sm sm:p-7">
        <div className="flex items-center justify-between">
          <p className="uppercase-label flex items-center gap-2 text-stone-400">
            <Bot className="h-4 w-4" />
            Ask anything
          </p>
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex flex-wrap justify-end gap-1.5">
              {exampleQueries.map((ex) => {
                const active = selectedExample === ex.label;
                const activeClass =
                  ex.label === "Simple"
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : ex.label === "Common"
                      ? "border-amber-600 bg-amber-600 text-white"
                      : "border-brand-600 bg-brand-600 text-white";
                return (
                  <button
                    key={ex.label}
                    onClick={() => {
                      setProblem(ex.text);
                      setSelectedExample(ex.label);
                      setPhase("input");
                      setAnalysis(null);
                    }}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                      active
                        ? activeClass
                        : "border-paper-300 text-stone-500 hover:border-brand-300 hover:text-brand-700"
                    }`}
                  >
                    {ex.label}
                  </button>
                );
              })}
            </div>
            <p className="w-full text-center text-sm font-medium italic text-stone-500">
              It is for simulation purposes
            </p>
          </div>
        </div>

        <textarea
          value={problem}
          onChange={(e) => {
            setProblem(e.target.value);
            setSelectedExample(null);
          }}
          disabled={phase === "analyzing"}
          rows={4}
          className="mt-4 min-h-[7rem] w-full resize-y overflow-y-auto bg-transparent font-serif text-xl leading-snug text-stone-900 outline-none placeholder:text-stone-300 disabled:opacity-60 sm:text-2xl"
          placeholder="What do you need help with?"
        />

        <div className="mt-4 flex items-center justify-between border-t border-paper-200 pt-4">
          <p className="text-xs text-stone-400">
            {phase === "analyzing"
              ? "Reading your question…"
              : "AI is the first filter · people are the second level"}
          </p>
          <button
            onClick={submit}
            disabled={phase === "analyzing"}
            className="btn-gradient inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 active:scale-95 disabled:opacity-50"
          >
            {phase === "analyzing" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Ask AI <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {phase === "verdict" && analysis && (
        <div className="mt-4 animate-fade-in">
          {analysis.kind === "simple" && (
            <SimpleVerdict
              analysis={analysis}
              onSelfServed={() => setPhase("self-served")}
            />
          )}
          {analysis.kind === "expert" && (
            <ExpertVerdict
              analysis={analysis}
              onProceed={() =>
                onProceed({ problem, tags: analysis.tags, complexity: "Specific" })
              }
            />
          )}
          {analysis.kind === "broad" && (
            <BroadVerdict
              analysis={analysis}
              onProceed={(topic) =>
                onProceed({ problem, tags: analysis.tags, topic, complexity: "Broad" })
              }
            />
          )}
          {analysis.kind === "faq" && (
            <FaqVerdict
              analysis={analysis}
              onSelfServed={() => setPhase("self-served")}
              onProceed={() =>
                onProceed({ problem, tags: analysis.tags, complexity: "Common" })
              }
            />
          )}
        </div>
      )}

      {phase === "self-served" && (
        <div className="mt-4 animate-fade-in rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
          <p className="mt-2 font-serif text-xl text-stone-900">Glad that helped!</p>
          <p className="mt-1 text-sm text-stone-600">
            You just saved an expert&apos;s time — that&apos;s the whole point.
          </p>
          <button
            onClick={reAsk}
            className="mt-4 rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-white"
          >
            Ask something else
          </button>
        </div>
      )}
    </div>
  );
}

function VerdictShell({
  tone,
  children,
}: {
  tone: "clay" | "amber";
  children: React.ReactNode;
}) {
  const ring = tone === "clay" ? "border-brand-200 bg-brand-50" : "border-amber-200 bg-amber-50";
  return <div className={`rounded-3xl border p-6 ${ring}`}>{children}</div>;
}

function ExpertVerdict({
  analysis,
  onProceed,
}: {
  analysis: Extract<QueryAnalysis, { kind: "expert" }>;
  onProceed: () => void;
}) {
  return (
    <VerdictShell tone="amber">
      <p className="uppercase-label text-amber-700">Specific · needs an expert</p>
      <p className="mt-2 text-stone-700">
        This is a focused question about our data — we&apos;ll post it to the pool
        and match you with a colleague who has solved it before.
      </p>
      <button
        onClick={onProceed}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 active:scale-[0.99]"
      >
        <UserSearch className="h-4 w-4" />
        Post to ticket pool
      </button>
      <div className="mt-4">
        <ResourceList resources={analysis.resources} />
      </div>
    </VerdictShell>
  );
}

function BroadVerdict({
  analysis,
  onProceed,
}: {
  analysis: Extract<QueryAnalysis, { kind: "broad" }>;
  onProceed: (topic: string) => void;
}) {
  const followUps = getBroadFollowUps("");
  const [step, setStep] = useState<"challenge" | "topic">("challenge");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [idx, setIdx] = useState(0);
  const [custom, setCustom] = useState("");
  const [check, setCheck] = useState<{
    status: "idle" | "checking" | "ok" | "bad";
    message: string;
  }>({ status: "idle", message: "" });

  const allAnswered = followUps.every((q) => answers[q.id]);
  const usingCustom = custom.trim().length > 0;
  const current = analysis.topicOptions[idx];
  const chosenTopic = usingCustom ? custom.trim() : current.summaryTopic;

  const handleProceed = () => {
    if (!usingCustom) {
      onProceed(chosenTopic);
      return;
    }
    if (check.status === "ok") {
      onProceed(chosenTopic);
      return;
    }
    setCheck({ status: "checking", message: "" });
    setTimeout(() => {
      const res = validateCustomTopic(custom);
      setCheck({ status: res.ok ? "ok" : "bad", message: res.message });
      if (res.ok) onProceed(chosenTopic);
    }, 900);
  };

  if (step === "challenge") {
    return (
      <VerdictShell tone="clay">
        <p className="uppercase-label flex items-center gap-1.5 text-brand-700">
          <Users className="h-4 w-4" />
          Let&apos;s be specific!
        </p>
        <p className="mt-2 text-stone-700">
          That covers a lot — answer three quick questions so we can narrow it to
          one clear topic before posting to the pool.
        </p>
        <div className="mt-4 space-y-4">
          {followUps.map((q) => (
            <div key={q.id} className="rounded-2xl border border-paper-300 bg-white p-4">
              <p className="text-sm font-semibold text-stone-800">{q.question}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      answers[q.id] === opt
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-paper-300 text-stone-600 hover:border-brand-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => allAnswered && setStep("topic")}
          disabled={!allAnswered}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50"
        >
          Continue with a focused topic
          <ArrowRight className="h-4 w-4" />
        </button>
      </VerdictShell>
    );
  }

  return (
    <VerdictShell tone="clay">
      <p className="uppercase-label flex items-center gap-1.5 text-brand-700">
        <Users className="h-4 w-4" />
        Focused topic for you to learn about…
      </p>
      <p className="mt-2 text-stone-700">
        Based on your answers, here&apos;s a scoped SQL topic — then we&apos;ll post it to
        the ticket pool for the right helper.
      </p>
      {Object.keys(answers).length > 0 && (
        <p className="mt-2 text-xs text-stone-500">
          You said: {Object.values(answers).join(" · ")}
        </p>
      )}

      <div className="mt-4 rounded-2xl border border-brand-200 bg-white p-4">
        <p className="uppercase-label text-stone-400">Suggested learning topic</p>
        <p className="mt-1 font-serif text-xl text-stone-900">{current.summaryTopic}</p>
        <ul className="mt-3 space-y-1.5">
          {current.subtopics.map((s) => (
            <li key={s} className="flex items-start gap-2 text-sm text-stone-600">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <p className="uppercase-label flex items-center gap-1.5 text-stone-400">
          <RefreshCw className="h-3.5 w-3.5" />
          Not the right focus? Pick another
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {analysis.topicOptions.map((opt, i) => {
            const active = !usingCustom && i === idx;
            return (
              <button
                key={opt.summaryTopic}
                onClick={() => {
                  setIdx(i);
                  setCustom("");
                  setCheck({ status: "idle", message: "" });
                }}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-paper-300 text-stone-600 hover:border-brand-300 hover:text-brand-700"
                }`}
              >
                {opt.summaryTopic}
              </button>
            );
          })}
        </div>
        <input
          value={custom}
          onChange={(e) => {
            setCustom(e.target.value);
            setCheck({ status: "idle", message: "" });
          }}
          placeholder="…or type your own focus topic"
          className={`mt-2 w-full rounded-full border px-4 py-2 text-sm outline-none transition focus:ring-2 focus:ring-brand-100 ${
            usingCustom ? "border-brand-500 bg-brand-50" : "border-paper-300 focus:border-brand-400"
          }`}
        />
        {usingCustom && check.status !== "idle" && (
          <div
            className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${
              check.status === "checking"
                ? "text-stone-500"
                : check.status === "ok"
                  ? "text-emerald-600"
                  : "text-amber-600"
            }`}
          >
            {check.status === "checking" ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                AI re-checking your topic…
              </>
            ) : check.status === "ok" ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                {check.message}
              </>
            ) : (
              <>
                <AlertTriangle className="h-3.5 w-3.5" />
                {check.message}
              </>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleProceed}
        disabled={check.status === "checking"}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 active:scale-[0.99] disabled:opacity-60"
      >
        {check.status === "checking" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking your topic…
          </>
        ) : usingCustom && check.status === "bad" ? (
          <>
            Re-check &amp; find experts
            <RefreshCw className="h-4 w-4" />
          </>
        ) : (
          <>
            Focus on this topic &amp; post to pool
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
      <div className="mt-4">
        <ResourceList resources={analysis.resources} />
      </div>
    </VerdictShell>
  );
}

function FaqVerdict({
  analysis,
  onSelfServed,
  onProceed,
}: {
  analysis: Extract<QueryAnalysis, { kind: "faq" }>;
  onSelfServed: () => void;
  onProceed: () => void;
}) {
  return (
    <VerdictShell tone="clay">
      <p className="uppercase-label flex items-center gap-1.5 text-amber-700">
        <Users className="h-4 w-4" />
        Common · asked {analysis.askCount} times before
      </p>
      <p className="mt-2 text-stone-700">
        Others had the same question. Here&apos;s a short answer from past sessions
        on &ldquo;{analysis.title}&rdquo; — try this before asking a person.
      </p>
      <div className="mt-4 space-y-2 rounded-2xl border border-paper-300 bg-white p-4">
        {analysis.pastConversation.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.from === "asker" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${
                m.from === "asker"
                  ? "rounded-br-md bg-stone-100 text-stone-700"
                  : "rounded-bl-md bg-brand-600 text-white"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <p className="pt-1 text-center text-[11px] text-stone-400">
          Names removed · shared from anonymized history
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          onClick={onSelfServed}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 active:scale-[0.99]"
        >
          <CheckCircle2 className="h-4 w-4" />
          That solved it
        </button>
        <button
          onClick={onProceed}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-white"
        >
          Still need a person
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4">
        <ResourceList resources={analysis.resources} />
      </div>
    </VerdictShell>
  );
}

function SimpleVerdict({
  analysis,
  onSelfServed,
}: {
  analysis: Extract<QueryAnalysis, { kind: "simple" }>;
  onSelfServed: () => void;
}) {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
      <p className="uppercase-label flex items-center gap-1.5 text-emerald-700">
        <Bot className="h-4 w-4" />
        Simple · answered by AI
      </p>
      <p className="mt-2 font-serif text-lg text-stone-900">{analysis.title}</p>
      <p className="mt-1 text-sm text-stone-600">
        Basic SQL — no need to wake up an expert. Here is a direct answer:
      </p>
      <div className="mt-4 rounded-2xl border border-emerald-200/80 bg-white p-4 text-sm leading-relaxed text-stone-700">
        {analysis.answer}
      </div>
      <div className="mt-4">
        <ResourceList resources={analysis.resources} compact title="Learn more" />
      </div>
      <p className="mt-4 text-center text-xs text-stone-500">
        Experts stay free for Specific and Common questions.
      </p>
      <button
        type="button"
        onClick={onSelfServed}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99]"
      >
        <CheckCircle2 className="h-4 w-4" />
        That solved it
      </button>
    </div>
  );
}

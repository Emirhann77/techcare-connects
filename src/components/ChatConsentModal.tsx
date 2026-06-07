"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Lock,
  MessageSquareText,
  Mic,
  ShieldCheck,
} from "lucide-react";
import type { Peer } from "@/lib/mockData";
import { resourcesForTags } from "@/lib/aiAnalysis";
import ResourceList from "./ResourceList";

export interface ThreadConsentPrefs {
  audio: boolean;
  saveChat: boolean;
}

interface ChatConsentModalProps {
  peer: Peer;
  userName: string;
  mode: "learning" | "teaching";
  onComplete: (prefs: ThreadConsentPrefs) => void;
}

export default function ChatConsentModal({
  peer,
  userName,
  mode,
  onComplete,
}: ChatConsentModalProps) {
  const isTeaching = mode === "teaching";
  const firstName = peer.name.split(" ")[0];
  const myRole = isTeaching ? "helper" : "helpee";
  const resources = resourcesForTags(peer.experienceTags ?? []);

  const [audio, setAudio] = useState(false);
  const [saveChat, setSaveChat] = useState(false);
  const [peerReady, setPeerReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPeerReady(true), 900);
    return () => clearTimeout(t);
  }, []);

  const accentBorder = isTeaching
    ? "ring-accent-orange/30"
    : "ring-accent-pink/30";
  const accentIconBg = isTeaching
    ? "bg-accent-orange/15 text-accent-orange"
    : "bg-accent-pink/15 text-accent-pink";
  const accentLabel = isTeaching ? "text-accent-orange" : "text-accent-pink";
  const checkedBorder = isTeaching
    ? "border-accent-orange/40 bg-accent-orange/5"
    : "border-accent-pink/40 bg-accent-pink/5";

  const finish = () => {
    setSubmitting(true);
    setTimeout(() => {
      onComplete({ audio, saveChat });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-sm">
      <div
        className={`w-full max-w-md animate-scale-in rounded-3xl bg-white p-6 shadow-2xl ring-1 ${accentBorder}`}
        role="dialog"
        aria-labelledby="consent-title"
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accentIconBg}`}
          >
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className={`uppercase-label ${accentLabel}`}>Before you chat</p>
            <h2 id="consent-title" className="font-serif text-xl font-semibold text-stone-900">
              Knowledge capture consent
            </h2>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-stone-600">
          You&apos;re about to connect with <strong>{peer.name}</strong>. Choose
          what you&apos;re comfortable saving — both of you must agree. Preferences
          are remembered for this session only.
        </p>

        <div className="mt-5 space-y-3">
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition ${
              audio ? checkedBorder : "border-paper-200 hover:border-paper-300"
            }`}
          >
            <input
              type="checkbox"
              checked={audio}
              onChange={(e) => setAudio(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-stone-300"
            />
            <span className="flex-1">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-stone-800">
                <Mic className="h-4 w-4 text-stone-500" />
                Audio recording
              </span>
              <span className="mt-0.5 block text-xs text-stone-500">
                Record the session for the internal knowledge base.
              </span>
            </span>
          </label>

          <label
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition ${
              saveChat ? checkedBorder : "border-paper-200 hover:border-paper-300"
            }`}
          >
            <input
              type="checkbox"
              checked={saveChat}
              onChange={(e) => setSaveChat(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-stone-300"
            />
            <span className="flex-1">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-stone-800">
                <MessageSquareText className="h-4 w-4 text-stone-500" />
                Save conversation
              </span>
              <span className="mt-0.5 block text-xs text-stone-500">
                Store chat text so others can find answers later.
              </span>
            </span>
          </label>
        </div>

        <div className="mt-4 rounded-xl bg-paper-50 px-3 py-2.5 text-xs text-stone-500">
          {peerReady ? (
            <span className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {firstName} is ready — they&apos;ll match your choices when you continue.
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              Waiting for {firstName} to join…
            </span>
          )}
        </div>

        {resources.length > 0 && (
          <div className="mt-3">
            <ResourceList resources={resources} compact title="Related reading" />
          </div>
        )}

        <button
          type="button"
          disabled={!peerReady || submitting}
          onClick={finish}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${isTeaching ? "bg-accent-orange" : "bg-accent-pink"}`}
        >
          {submitting ? "Saving preferences…" : "Continue to chat"}
        </button>

        <p className="mt-3 text-center text-[10px] text-stone-400">
          {userName} · {myRole} · nothing is persisted in this prototype
        </p>
      </div>
    </div>
  );
}

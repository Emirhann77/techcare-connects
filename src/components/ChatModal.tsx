"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Lock,
  MessageSquareText,
  Mic,
  MicOff,
  Send,
  X,
} from "lucide-react";
import { expertInitials, meetingSpots, type Peer } from "@/lib/mockData";
import { resourcesForTags } from "@/lib/aiAnalysis";
import ResourceList from "./ResourceList";

interface ChatMessage {
  from: "me" | "peer";
  text: string;
}

interface DualConsent {
  me: boolean;
  peer: boolean;
  peerPending: boolean;
}

interface ChatModalProps {
  peer: Peer;
  userName: string;
  problem: string;
  spot: string;
  mode?: "learning" | "teaching";
  onClose: () => void;
  onResolve: (peer: Peer) => void;
}

function ConsentRow({
  label,
  consent,
  helperLabel,
  helpeeLabel,
  myRole,
  onMeAccept,
}: {
  label: string;
  consent: DualConsent;
  helperLabel: string;
  helpeeLabel: string;
  myRole: "helper" | "helpee";
  onMeAccept: () => void;
}) {
  const unlocked = consent.me && consent.peer;
  const helperAccepted = myRole === "helper" ? consent.me : consent.peer;
  const helpeeAccepted = myRole === "helpee" ? consent.me : consent.peer;
  const helperPending = myRole === "helpee" && consent.peerPending;
  const helpeePending = myRole === "helper" && consent.peerPending;

  return (
    <div className="rounded-xl border border-paper-200 bg-paper-50 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-stone-700">{label}</span>
        {unlocked ? (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
            <CheckCircle2 className="h-3 w-3" />
            Unlocked
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-stone-400">
            <Lock className="h-3 w-3" />
            Locked
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <ConsentChip
          name={`Helper (${helperLabel})`}
          accepted={helperAccepted}
          pending={helperPending}
          action={
            myRole === "helper" && !consent.me ? onMeAccept : undefined
          }
        />
        <ConsentChip
          name={`Helpee (${helpeeLabel})`}
          accepted={helpeeAccepted}
          pending={helpeePending}
          action={
            myRole === "helpee" && !consent.me ? onMeAccept : undefined
          }
        />
      </div>
    </div>
  );
}

function ConsentChip({
  name,
  accepted,
  pending,
  action,
}: {
  name: string;
  accepted: boolean;
  pending?: boolean;
  action?: () => void;
}) {
  if (accepted) {
    return (
      <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
        <CheckCircle2 className="h-3 w-3" />
        {name} ✓
      </span>
    );
  }
  if (pending) {
    return (
      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-600">
        {name}… waiting
      </span>
    );
  }
  if (action) {
    return (
      <button
        onClick={action}
        className="rounded-full border border-brand-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-brand-700 transition hover:bg-brand-50"
      >
        {name}: I agree
      </button>
    );
  }
  return (
    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-400">
      {name}: —
    </span>
  );
}

export default function ChatModal({
  peer,
  userName,
  problem,
  spot,
  mode = "learning",
  onClose,
  onResolve,
}: ChatModalProps) {
  const expertLabel = peer.name;
  const spotLabel = meetingSpots.find((m) => m.id === spot)?.label ?? "Online";
  const isLocal = spot === "coffee" || spot === "desk";
  const isTeaching = mode === "teaching";
  const resources = resourcesForTags(peer.experienceTags);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: isTeaching ? "peer" : "me", text: problem },
  ]);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [audioConsent, setAudioConsent] = useState<DualConsent>({
    me: false,
    peer: false,
    peerPending: false,
  });
  const [conversationConsent, setConversationConsent] = useState<DualConsent>({
    me: false,
    peer: false,
    peerPending: false,
  });
  const [audioActive, setAudioActive] = useState(false);
  const [conversationSaved, setConversationSaved] = useState(false);

  const audioUnlocked = audioConsent.me && audioConsent.peer;
  const conversationUnlocked =
    conversationConsent.me && conversationConsent.peer;
  const myRole: "helper" | "helpee" = isTeaching ? "helper" : "helpee";
  const helperLabel = isTeaching ? userName.split(" ")[0] : expertLabel;
  const helpeeLabel = isTeaching ? expertLabel : userName.split(" ")[0];

  const requestConsent = (
    setter: React.Dispatch<React.SetStateAction<DualConsent>>,
    peerName: string
  ) => {
    setter((c) => ({ ...c, me: true, peerPending: true }));
    setTimeout(() => {
      setter((c) => ({ ...c, peer: true, peerPending: false }));
      setMessages((m) => [
        ...m,
        {
          from: "peer",
          text: `Your matched colleague agreed to knowledge capture. ✅`,
        },
      ]);
    }, 1200);
  };

  useEffect(() => {
    const learningReplies = [
      `Hey ${userName}! I've hit that exact ${peer.experienceTags[0]} issue before — it's not documented anywhere. Let me walk you through it. 🙂`,
      "The trick is a setting our bank changed during rollout — not in the vendor docs. I'll show you the 2-minute fix we use internally.",
    ];
    const teachingReplies = [
      `Thanks so much for picking this up, ${userName}! 🙏`,
      "Ah, that makes total sense — I'd never have figured that out on my own.",
    ];
    const replies = isTeaching ? teachingReplies : learningReplies;
    const timers = [
      setTimeout(() => setMessages((m) => [...m, { from: "peer", text: replies[0] }]), 700),
      setTimeout(() => setMessages((m) => [...m, { from: "peer", text: replies[1] }]), 1800),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!draft.trim()) return;
    setMessages((m) => [...m, { from: "me", text: draft.trim() }]);
    setDraft("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/70 p-0 sm:items-center sm:p-4">
      <div className="flex h-[90vh] w-full max-w-md animate-scale-in flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:h-[640px] sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-paper-200 bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 font-serif text-xs font-bold text-white">
              {expertInitials(peer)}
            </div>
            <div className="leading-tight">
              <p className="font-serif text-base font-semibold text-stone-900">{peer.name}</p>
              <p className="text-[10px] text-stone-400">{peer.role}</p>
              <p className="flex items-center gap-1 text-xs text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Connected · {spotLabel}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 transition hover:bg-paper-100 hover:text-stone-600"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-paper-50 p-4">
          <p className="mx-auto w-fit rounded-full bg-paper-200 px-3 py-1 text-center text-[11px] text-stone-500">
            Connected with {expertLabel}. Knowledge transfer in progress.
          </p>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex animate-fade-in ${msg.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
                  msg.from === "me"
                    ? "rounded-br-md bg-brand-600 text-white"
                    : "rounded-bl-md bg-white text-stone-700 ring-1 ring-paper-200"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-brand-200 bg-white p-3.5">
            <p className="uppercase-label text-brand-700">Capture this knowledge</p>
            <p className="mt-1 text-xs text-stone-500">
              {isLocal
                ? `In-person at ${spotLabel}. Both helper and helpee must agree before anything is saved.`
                : "Both helper and helpee must agree before recording or saving."}
            </p>

            <div className="mt-3 space-y-2">
              <ConsentRow
                label="Audio recording"
                consent={audioConsent}
                helperLabel={helperLabel}
                helpeeLabel={helpeeLabel}
                myRole={myRole}
                onMeAccept={() => requestConsent(setAudioConsent, expertLabel)}
              />
              <ConsentRow
                label="Save conversation"
                consent={conversationConsent}
                helperLabel={helperLabel}
                helpeeLabel={helpeeLabel}
                myRole={myRole}
                onMeAccept={() => requestConsent(setConversationConsent, expertLabel)}
              />
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => audioUnlocked && setAudioActive((a) => !a)}
                disabled={!audioUnlocked}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                  !audioUnlocked
                    ? "cursor-not-allowed border-stone-200 bg-stone-50 text-stone-300"
                    : audioActive
                      ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                      : "border-stone-300 text-stone-700 hover:bg-paper-100"
                }`}
              >
                {!audioUnlocked ? (
                  <>
                    <MicOff className="h-3.5 w-3.5" />
                    Audio locked
                  </>
                ) : audioActive ? (
                  <>
                    <Mic className="h-3.5 w-3.5 animate-pulse text-red-600" />
                    Stop recording
                  </>
                ) : (
                  <>
                    <Mic className="h-3.5 w-3.5" />
                    Start recording
                  </>
                )}
              </button>
              <button
                onClick={() => conversationUnlocked && setConversationSaved(true)}
                disabled={!conversationUnlocked || conversationSaved}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                  !conversationUnlocked
                    ? "cursor-not-allowed border-stone-200 bg-stone-50 text-stone-300"
                    : conversationSaved
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-stone-300 text-stone-700 hover:bg-paper-100"
                }`}
              >
                {conversationSaved ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Conversation saved
                  </>
                ) : !conversationUnlocked ? (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    Chat locked
                  </>
                ) : (
                  <>
                    <MessageSquareText className="h-3.5 w-3.5" />
                    Save conversation
                  </>
                )}
              </button>
            </div>

            {audioActive && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                Recording… both parties consented.
              </p>
            )}
            {(audioActive || conversationSaved) && (
              <p className="mt-2 text-xs text-emerald-700">
                {audioActive && !conversationSaved && "Audio will be saved when you stop recording."}
                {conversationSaved && !audioActive && "Full conversation transcript saved to the knowledge base."}
                {audioActive && conversationSaved && "Audio + conversation both captured."}
              </p>
            )}
          </div>

          <ResourceList resources={resources} title="Related research & internal docs" />
        </div>

        <div className="space-y-2 border-t border-paper-200 bg-white p-3">
          <div className="flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message…"
              className="flex-1 rounded-full border border-paper-300 px-4 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
            <button
              onClick={send}
              className="rounded-full bg-paper-100 p-2.5 text-stone-600 transition hover:bg-paper-200"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => onResolve(peer)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
          >
            <CheckCircle2 className="h-4 w-4" />
            Resolve Session
          </button>
        </div>
      </div>
    </div>
  );
}

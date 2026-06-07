"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, MessageSquare, Send } from "lucide-react";
import { meetingSpots, type Peer } from "@/lib/mockData";
import ChatConsentModal, { type ThreadConsentPrefs } from "./ChatConsentModal";

export interface ChatThread {
  id: string;
  title: string;
  peer: Peer;
  problem: string;
  spot: string;
  poolTicketId?: string;
  myRequestId?: string;
}

interface ChatMessage {
  from: "me" | "peer";
  text: string;
}

interface ChatWorkspaceProps {
  threads: ChatThread[];
  activeThreadId: string;
  onSelectThread: (id: string) => void;
  userName: string;
  mode?: "learning" | "teaching";
  onBack: () => void;
  onResolve: (threadId: string, peer: Peer) => void;
}

export default function ChatWorkspace({
  threads,
  activeThreadId,
  onSelectThread,
  userName,
  mode = "learning",
  onBack,
  onResolve,
}: ChatWorkspaceProps) {
  const isTeaching = mode === "teaching";
  const activeThread =
    threads.find((t) => t.id === activeThreadId) ?? threads[0];

  const peer = activeThread?.peer;
  const spot = activeThread?.spot ?? "online";

  const spotLabelText =
    meetingSpots.find((m) => m.id === spot)?.label ?? "Online";

  const theme = isTeaching
    ? {
        sidebar: "from-accent-orange/10 via-paper-50 to-white",
        accentBg: "bg-accent-orange",
        activeItem: "border-accent-orange/40 bg-accent-orange/10",
        bubbleMe: "bg-accent-orange text-white",
        label: "Helping",
        icon: "text-accent-orange",
      }
    : {
        sidebar: "from-accent-pink/10 via-paper-50 to-white",
        accentBg: "bg-accent-pink",
        activeItem: "border-accent-pink/40 bg-accent-pink/10",
        bubbleMe: "bg-accent-pink text-white",
        label: "Getting help",
        icon: "text-accent-pink",
      };

  const [consentByThread, setConsentByThread] = useState<
    Record<string, ThreadConsentPrefs>
  >({});
  const [messagesByThread, setMessagesByThread] = useState<
    Record<string, ChatMessage[]>
  >({});
  const [startedThreads, setStartedThreads] = useState<Set<string>>(
    () => new Set()
  );
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = messagesByThread[activeThread?.id ?? ""] ?? [];
  const needsConsent =
    !!activeThread && !consentByThread[activeThread.id];

  const appendMessage = (threadId: string, msg: ChatMessage) => {
    setMessagesByThread((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] ?? []), msg],
    }));
  };

  const handleConsentComplete = (prefs: ThreadConsentPrefs) => {
    if (!activeThread || !peer) return;
    setConsentByThread((prev) => ({
      ...prev,
      [activeThread.id]: prefs,
    }));
  };

  useEffect(() => {
    if (!activeThread || !peer || needsConsent) return;
    if (startedThreads.has(activeThread.id)) return;

    const id = activeThread.id;
    setStartedThreads((s) => new Set(s).add(id));

    setMessagesByThread((prev) => ({
      ...prev,
      [id]: [{ from: isTeaching ? "peer" : "me", text: activeThread.problem }],
    }));

    const learningReplies = [
      `Hey ${userName}! I've hit that exact ${peer.experienceTags[0] ?? "work"} issue before — let me walk you through it.`,
      "The trick is something our team figured out internally — not in the vendor docs. I'll show you the quick fix.",
    ];
    const teachingReplies = [
      `Thanks for picking this up, ${userName}!`,
      "That makes total sense — I wouldn't have figured that out on my own.",
    ];
    const replies = isTeaching ? teachingReplies : learningReplies;

    const timers = [
      setTimeout(
        () => appendMessage(id, { from: "peer", text: replies[0] }),
        700
      ),
      setTimeout(
        () => appendMessage(id, { from: "peer", text: replies[1] }),
        1800
      ),
    ];
    return () => timers.forEach(clearTimeout);
  }, [
    activeThread,
    peer,
    needsConsent,
    isTeaching,
    userName,
    startedThreads,
  ]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, activeThread?.id]);

  const send = () => {
    if (!draft.trim() || !activeThread || needsConsent) return;
    appendMessage(activeThread.id, { from: "me", text: draft.trim() });
    setDraft("");
  };

  if (!activeThread || !peer) return null;

  return (
    <section className="animate-fade-in">
      {needsConsent && (
        <ChatConsentModal
          peer={peer}
          userName={userName}
          mode={mode}
          onComplete={handleConsentComplete}
        />
      )}

      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-stone-500 transition hover:text-stone-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {isTeaching ? "helping" : "getting help"}
      </button>

      <div
        className={`flex min-h-[calc(100vh-12rem)] overflow-hidden rounded-3xl border border-paper-200 bg-white shadow-sm ${needsConsent ? "pointer-events-none opacity-40" : ""}`}
      >
        <aside
          className={`hidden w-64 shrink-0 flex-col border-r border-paper-200 bg-gradient-to-b sm:flex lg:w-72 ${theme.sidebar}`}
        >
          <div className="border-b border-paper-200/80 px-4 py-4">
            <p className={`uppercase-label ${theme.icon}`}>
              {isTeaching ? "Your helps" : "Your questions"}
            </p>
            <p className="mt-1 text-sm font-semibold text-stone-800">Sessions</p>
          </div>
          <div className="flex-1 space-y-1 overflow-y-auto p-2">
            {threads.map((thread) => (
              <button
                key={thread.id}
                type="button"
                onClick={() => onSelectThread(thread.id)}
                className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${
                  thread.id === activeThread.id
                    ? theme.activeItem
                    : "border-transparent hover:bg-white/80"
                }`}
              >
                <p className="line-clamp-2 text-sm font-medium text-stone-800">
                  {thread.title}
                </p>
                <p className="mt-0.5 text-xs text-stone-500">
                  {thread.peer.name.split(" ")[0]}
                </p>
              </button>
            ))}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-b border-paper-200 px-4 py-3 sm:px-5">
            <p className={`uppercase-label ${theme.icon}`}>{theme.label}</p>
            <p className="truncate font-serif text-lg font-semibold text-stone-900">
              {activeThread.title}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-stone-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {peer.name} · {spotLabelText}
            </p>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-paper-50/60 px-4 py-4 sm:px-5"
          >
            {messages.length === 0 && needsConsent ? (
              <p className="py-12 text-center text-sm text-stone-400">
                Complete consent to start chatting…
              </p>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[min(520px,88%)] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.from === "me"
                        ? `${theme.bubbleMe} rounded-br-md shadow-sm`
                        : "rounded-bl-md bg-white text-stone-700 ring-1 ring-paper-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-paper-200 bg-white p-3 sm:p-4">
            <div className="flex items-center gap-2 rounded-2xl border border-paper-200 bg-paper-50 px-3 py-2">
              <MessageSquare className={`h-4 w-4 shrink-0 ${theme.icon}`} />
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                disabled={needsConsent}
                placeholder={
                  needsConsent
                    ? "Waiting for consent…"
                    : isTeaching
                      ? "Share your answer…"
                      : "Ask a follow-up question…"
                }
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-stone-400 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={send}
                disabled={needsConsent}
                className={`rounded-full p-2 text-white transition hover:opacity-90 disabled:opacity-40 ${theme.accentBg}`}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => onResolve(activeThread.id, peer)}
              disabled={needsConsent}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCircle2 className="h-4 w-4" />
              Resolve session
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Send, X } from "lucide-react";
import type { Peer } from "@/lib/mockData";

interface ChatMessage {
  from: "me" | "peer";
  text: string;
}

interface ChatModalProps {
  peer: Peer;
  userName: string;
  problem: string;
  onClose: () => void;
  onResolve: (peer: Peer) => void;
}

export default function ChatModal({
  peer,
  userName,
  problem,
  onClose,
  onResolve,
}: ChatModalProps) {
  const firstName = peer.name.split(" ")[0];
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "me", text: problem },
  ]);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulate the expert reading and replying after they "connect".
  useEffect(() => {
    const timers = [
      setTimeout(
        () =>
          setMessages((m) => [
            ...m,
            {
              from: "peer",
              text: `Hey ${userName}! I've hit that exact issue with ${peer.experienceTags[0]} before — it's not documented anywhere. Let me walk you through it. 🙂`,
            },
          ]),
        700
      ),
      setTimeout(
        () =>
          setMessages((m) => [
            ...m,
            {
              from: "peer",
              text: "The trick is a setting our bank changed during the rollout — it's not in the vendor docs. I'll show you the 2-minute fix we use internally.",
            },
          ]),
        1800
      ),
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex h-[85vh] w-full max-w-md animate-scale-in flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:h-[600px] sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
              {peer.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-900">{peer.name}</p>
              <p className="flex items-center gap-1 text-xs text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Connected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
          <p className="mx-auto w-fit rounded-full bg-slate-200 px-3 py-1 text-center text-[11px] text-slate-500">
            You connected with {firstName}. Knowledge transfer in progress.
          </p>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex animate-fade-in ${
                msg.from === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
                  msg.from === "me"
                    ? "rounded-br-md bg-brand-600 text-white"
                    : "rounded-bl-md bg-white text-slate-700 ring-1 ring-slate-200"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 border-t border-slate-200 bg-white p-3">
          <div className="flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message…"
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
            <button
              onClick={send}
              className="rounded-xl bg-slate-100 p-2.5 text-slate-600 transition hover:bg-slate-200"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => onResolve(peer)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
          >
            <CheckCircle2 className="h-4 w-4" />
            Resolve Session
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { CalendarClock, Circle, Clock, MessageSquarePlus, Trophy } from "lucide-react";
import { timeSlots, type Peer } from "@/lib/mockData";

interface PeerCardProps {
  peer: Peer;
  matchedTags: string[];
  matchedSlots?: string[];
  highlight?: boolean;
  onConnect: (peer: Peer) => void;
}

const slotLabel = (id: string) =>
  timeSlots.find((s) => s.id === id)?.label ?? id;

const statusStyles: Record<
  Peer["availabilityStatus"],
  { dot: string; text: string }
> = {
  Available: { dot: "text-emerald-500 fill-emerald-500", text: "text-emerald-600" },
  Busy: { dot: "text-amber-500 fill-amber-500", text: "text-amber-600" },
  Away: { dot: "text-slate-400 fill-slate-400", text: "text-slate-500" },
};

export default function PeerCard({
  peer,
  matchedTags,
  matchedSlots = [],
  highlight,
  onConnect,
}: PeerCardProps) {
  const status = statusStyles[peer.availabilityStatus];
  const matched = new Set(matchedTags.map((t) => t.toLowerCase()));
  const isBusy = peer.availabilityStatus !== "Available";

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md ${
        highlight ? "border-brand-300 ring-2 ring-brand-200" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
            {peer.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-slate-900">{peer.name}</p>
            <p className="text-xs text-slate-500">{peer.role}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${status.text}`}>
          <Circle className={`h-2.5 w-2.5 ${status.dot}`} />
          {peer.availabilityStatus}
        </div>
      </div>

      <p className="text-sm text-slate-600">{peer.blurb}</p>

      <div className="flex flex-wrap gap-1.5">
        {peer.experienceTags.map((tag) => {
          const isMatch = matched.has(tag.toLowerCase());
          return (
            <span
              key={tag}
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                isMatch
                  ? "bg-brand-100 text-brand-700 ring-1 ring-brand-300"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {tag}
            </span>
          );
        })}
      </div>

      {matchedSlots.length > 0 ? (
        <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          <CalendarClock className="h-3.5 w-3.5" />
          You both free: {matchedSlots.map(slotLabel).join(", ")}
        </div>
      ) : isBusy ? (
        <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
          <Clock className="h-3.5 w-3.5" />
          Not free at your times — you chose to wait for the right expert.
        </div>
      ) : null}

      <div className="mt-1 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
          <Trophy className="h-3.5 w-3.5" />
          {peer.gamificationPoints} pts
        </span>
        <button
          onClick={() => onConnect(peer)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-95"
        >
          <MessageSquarePlus className="h-4 w-4" />
          Connect (Earn 2 pts)
        </button>
      </div>
    </div>
  );
}

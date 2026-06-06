"use client";

import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export default function BackButton({ onClick, label = "Back" }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-paper-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-stone-500 shadow-sm backdrop-blur-sm transition hover:border-paper-300 hover:text-stone-800"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

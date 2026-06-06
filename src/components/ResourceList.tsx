import { BookOpen, FileText } from "lucide-react";
import type { Resource } from "@/lib/aiAnalysis";

interface ResourceListProps {
  resources: Resource[];
  title?: string;
}

export default function ResourceList({
  resources,
  title = "Relevant reading while you wait",
}: ResourceListProps) {
  if (resources.length === 0) return null;
  return (
    <div className="rounded-2xl border border-paper-300 bg-paper-50 p-4">
      <p className="uppercase-label text-stone-500">{title}</p>
      <ul className="mt-3 space-y-2">
        {resources.map((r) => (
          <li key={r.title}>
            <a
              href={r.url}
              className="group flex items-start gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-paper-200"
            >
              <span
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  r.type === "paper"
                    ? "bg-brand-100 text-brand-700"
                    : "bg-stone-200 text-stone-600"
                }`}
              >
                {r.type === "paper" ? (
                  <BookOpen className="h-4 w-4" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
              </span>
              <span className="leading-tight">
                <span className="text-sm font-medium text-stone-800 group-hover:underline">
                  {r.title}
                </span>
                <span className="block text-xs text-stone-500">{r.source}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

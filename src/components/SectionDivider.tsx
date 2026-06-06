interface SectionDividerProps {
  title: string;
  accent?: "pink" | "orange";
  centered?: boolean;
}

export default function SectionDivider({
  title,
  accent = "orange",
  centered = false,
}: SectionDividerProps) {
  const via =
    accent === "pink" ? "via-accent-pink/50" : "via-accent-orange/50";

  if (centered) {
    return (
      <div className="py-4 text-center">
        <h2 className="font-serif text-xl font-bold text-stone-900 sm:text-2xl">{title}</h2>
        <span
          className={`mx-auto mt-3 block h-px w-full max-w-md bg-gradient-to-r from-transparent ${via} to-transparent`}
        />
      </div>
    );
  }

  const gradient =
    accent === "pink"
      ? "from-accent-pink/50 to-transparent"
      : "from-accent-orange/50 to-transparent";

  return (
    <div className="flex items-center gap-3 py-2">
      <h2 className="font-serif text-xl font-bold text-stone-900 sm:text-2xl">{title}</h2>
      <span className={`h-px flex-1 bg-gradient-to-r ${gradient}`} />
    </div>
  );
}

import { Award, BarChart3, Star } from "lucide-react";

export default function HelperMotivationPanel() {
  const items = [
    { icon: BarChart3, text: "Sessions show on your annual review" },
    { icon: Star, text: "Official Knowledge Champion badge" },
    { icon: Award, text: "Manager sees hours contributed each quarter" },
  ];

  return (
    <div className="card-surface p-4 sm:p-5">
      <p className="uppercase-label text-stone-400">Why help counts</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {items.map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="flex items-start gap-2.5 rounded-2xl border border-paper-100 bg-gradient-to-br from-white to-paper-50 p-3.5"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent-pink/15 to-accent-orange/15">
              <Icon className="h-4 w-4 text-accent-pink" />
            </div>
            <span className="text-xs leading-relaxed text-stone-600">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

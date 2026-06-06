import { Award, BarChart3, Star } from "lucide-react";

/** Why experts bother helping — ties points to real company value (coach feedback). */
export default function HelperMotivationPanel() {
  return (
    <div className="rounded-2xl border border-paper-300 bg-white p-4">
      <p className="uppercase-label text-stone-400">Why help counts</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="flex items-start gap-2 rounded-xl bg-paper-50 p-3">
          <BarChart3 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          <span className="text-xs text-stone-600">
            Sessions show on your <span className="font-semibold">annual review</span>
          </span>
        </div>
        <div className="flex items-start gap-2 rounded-xl bg-paper-50 p-3">
          <Star className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          <span className="text-xs text-stone-600">
            Official <span className="font-semibold">Knowledge Champion</span> badge
          </span>
        </div>
        <div className="flex items-start gap-2 rounded-xl bg-paper-50 p-3">
          <Award className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          <span className="text-xs text-stone-600">
            Manager sees <span className="font-semibold">hours contributed</span> each quarter
          </span>
        </div>
      </div>
    </div>
  );
}

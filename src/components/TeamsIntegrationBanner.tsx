import { MessageSquare } from "lucide-react";

/** Mock banner — production embeds inside Teams / Slack, not a separate app. */
export default function TeamsIntegrationBanner() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#464EB8]/20 bg-[#464EB8]/5 px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#464EB8] text-white">
        <MessageSquare className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-stone-800">Opens inside Microsoft Teams</p>
        <p className="mt-0.5 text-xs text-stone-500">
          In production you&apos;d get a Teams notification when you&apos;re stuck — no
          extra app to remember. This web prototype stands in for that embed.
        </p>
      </div>
    </div>
  );
}

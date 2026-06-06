import { Bell, BellOff } from "lucide-react";

interface CapacityNotificationBannerProps {
  atCapacity: boolean;
}

export default function CapacityNotificationBanner({
  atCapacity,
}: CapacityNotificationBannerProps) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${
        atCapacity
          ? "border-amber-200 bg-amber-50/80"
          : "border-connect/30 bg-connect/5"
      }`}
    >
      {atCapacity ? (
        <BellOff className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
      ) : (
        <Bell className="mt-0.5 h-4 w-4 shrink-0 text-connect" />
      )}
      <p className="text-xs leading-relaxed text-stone-600">
        {atCapacity ? (
          <>
            <span className="font-semibold text-amber-800">
              Notifications are automatically turned off when you reached capacity.
            </span>{" "}
            You can still take on more tickets voluntarily from the pool.
          </>
        ) : (
          <>
            You&apos;ll receive notifications for new pool tickets while you&apos;re
            under capacity.
          </>
        )}
      </p>
    </div>
  );
}

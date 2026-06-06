import { MessageCircle, User } from "lucide-react";

/** Decorative people-connect motif inspired by PEOPLE CONNECT reference. */
export default function ConnectIllustration() {
  const people = [
    { x: "22%", y: "55%", color: "bg-accent-pink", bubble: "right" },
    { x: "38%", y: "30%", color: "bg-accent-orange", bubble: "left" },
    { x: "50%", y: "50%", color: "bg-connect", bubble: "right" },
    { x: "62%", y: "28%", color: "bg-stone-900", bubble: "left" },
    { x: "78%", y: "58%", color: "bg-accent-pink", bubble: "right" },
  ] as const;

  return (
    <div className="relative mx-auto h-40 w-full max-w-md sm:h-48">
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <line x1="22%" y1="55%" x2="38%" y2="30%" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="38%" y1="30%" x2="50%" y2="50%" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="50%" y1="50%" x2="62%" y2="28%" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="62%" y1="28%" x2="78%" y2="58%" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" />
      </svg>
      {people.map((p, i) => (
        <div
          key={i}
          className="absolute flex flex-col items-center"
          style={{ left: p.x, top: p.y, transform: "translate(-50%, -50%)" }}
        >
          {p.bubble === "left" ? (
            <MessageCircle className="mb-1 h-5 w-5 text-connect stroke-[1.5]" />
          ) : null}
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-full ${p.color} text-white shadow-md`}
          >
            <User className="h-5 w-5" />
          </div>
          {p.bubble === "right" ? (
            <MessageCircle className="mt-1 h-5 w-5 text-connect stroke-[1.5]" />
          ) : null}
        </div>
      ))}
    </div>
  );
}

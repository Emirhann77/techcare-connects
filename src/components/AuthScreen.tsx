"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  AtSign,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import ConnectIllustration from "./ConnectIllustration";

type AuthMode = "login" | "signup";

interface AuthScreenProps {
  mode: AuthMode;
}

const copy = {
  login: {
    label: "Welcome back",
    headlineStart: "Pick up where you",
    headlineAccent: "left off.",
    sub: "Your colleagues kept the seat warm. Sign in to see who needs you today.",
    cta: "Sign in",
    switchPrompt: "New to TechCare Connects?",
    switchCta: "Create an account",
    switchHref: "/signup",
  },
  signup: {
    label: "Join the network",
    headlineStart: "Real colleagues,",
    headlineAccent: "real answers.",
    sub: "One account connects you to people who've already solved your problem — on our data, our stack.",
    cta: "Create account",
    switchPrompt: "Already have an account?",
    switchCta: "Sign in",
    switchHref: "/login",
  },
} as const;

const trustPoints = [
  "Anonymous until you're matched",
  "Helping counts toward recognition",
  "No generic AI fluff — ever",
];

function passwordStrength(pw: string): { score: number; label: string } {
  if (!pw) return { score: 0, label: "" };
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (pw.length >= 12) score += 1;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score += 1;
  const label =
    score <= 1 ? "Too weak" : score === 2 ? "Getting there" : score === 3 ? "Good" : "Strong";
  return { score, label };
}

const strengthColors = ["bg-stone-200", "bg-red-400", "bg-amber-400", "bg-accent-orange", "bg-emerald-500"];

export default function AuthScreen({ mode }: AuthScreenProps) {
  const router = useRouter();
  const t = copy[mode];
  const isSignup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const strength = useMemo(() => passwordStrength(password), [password]);

  const canSubmit =
    email.trim().length > 0 &&
    password.length > 0 &&
    (!isSignup || (name.trim().length > 0 && agreed)) &&
    !submitting;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    // Frontend-only demo: pretend to authenticate, then enter the app.
    setTimeout(() => router.push("/"), 1200);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute -right-24 top-12 h-72 w-72 rounded-full bg-accent-pink/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-16 h-64 w-64 rounded-full bg-accent-orange/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-connect/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-stretch gap-10 lg:flex-row lg:items-center lg:gap-16">
        {/* Brand panel */}
        <div className="hidden flex-1 lg:block">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-accent-pink" />
            <span className="bg-gradient-to-r from-accent-pink via-stone-800 to-accent-orange bg-clip-text font-serif text-2xl font-bold tracking-tight text-transparent">
              TechCare Connects
            </span>
          </div>

          <h1 className="mt-8 font-serif text-5xl font-bold leading-[1.08] tracking-tight text-stone-900 xl:text-6xl">
            {t.headlineStart}{" "}
            <span className="bg-gradient-to-r from-accent-pink to-accent-orange bg-clip-text text-transparent">
              {t.headlineAccent}
            </span>
          </h1>
          <p className="mt-4 max-w-md text-stone-500">{t.sub}</p>

          <div className="mt-8">
            <ConnectIllustration />
          </div>

          <ul className="mt-8 space-y-3">
            {trustPoints.map((point) => (
              <li key={point} className="flex items-center gap-3 text-sm text-stone-600">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-pink/20 to-accent-orange/20 text-accent-pink">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Form card */}
        <div className="w-full max-w-md self-center lg:self-auto">
          <div className="mb-6 flex items-center justify-center gap-2 lg:hidden">
            <Sparkles className="h-4 w-4 text-accent-pink" />
            <span className="bg-gradient-to-r from-accent-pink via-stone-800 to-accent-orange bg-clip-text font-serif text-xl font-bold tracking-tight text-transparent">
              TechCare Connects
            </span>
          </div>

          <div className="card-surface animate-scale-in p-6 sm:p-8">
            <p className="uppercase-label text-stone-400">{t.label}</p>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-stone-900">
              {isSignup ? "Create your account" : "Sign in"}
            </h2>

            <button
              type="button"
              className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full border border-paper-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-stone-300 hover:shadow active:scale-[0.99]"
            >
              <svg className="h-4 w-4" viewBox="0 0 23 23" aria-hidden>
                <rect x="1" y="1" width="10" height="10" fill="#f25022" />
                <rect x="12" y="1" width="10" height="10" fill="#7fba00" />
                <rect x="1" y="12" width="10" height="10" fill="#00a4ef" />
                <rect x="12" y="12" width="10" height="10" fill="#ffb900" />
              </svg>
              Continue with Microsoft
            </button>

            <div className="relative my-6 flex items-center justify-center">
              <span className="h-px w-full bg-paper-200" />
              <span className="absolute rounded-full border border-paper-200 bg-white px-4 py-0.5 font-serif text-sm font-semibold italic text-stone-400">
                Or
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {isSignup && (
                <div>
                  <label htmlFor="auth-name" className="uppercase-label text-stone-400">
                    Full name
                  </label>
                  <div className="mt-1.5 flex items-center gap-2.5 rounded-2xl border border-paper-300 bg-white px-4 py-3 transition focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
                    <User className="h-4 w-4 shrink-0 text-stone-300" />
                    <input
                      id="auth-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Thomas Berger"
                      className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-300"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="auth-email" className="uppercase-label text-stone-400">
                  Work email
                </label>
                <div className="mt-1.5 flex items-center gap-2.5 rounded-2xl border border-paper-300 bg-white px-4 py-3 transition focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
                  <AtSign className="h-4 w-4 shrink-0 text-stone-300" />
                  <input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@techcare.com"
                    className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-300"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor="auth-password" className="uppercase-label text-stone-400">
                    Password
                  </label>
                  {!isSignup && (
                    <button
                      type="button"
                      className="text-xs font-medium text-brand-600 transition hover:text-brand-700"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-2.5 rounded-2xl border border-paper-300 bg-white px-4 py-3 transition focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
                  <Lock className="h-4 w-4 shrink-0 text-stone-300" />
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignup ? "At least 8 characters" : "Your password"}
                    className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="shrink-0 text-stone-300 transition hover:text-stone-500"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {isSignup && password.length > 0 && (
                  <div className="mt-2 animate-fade-in">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <span
                          key={step}
                          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                            strength.score >= step ? strengthColors[strength.score] : "bg-paper-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-right text-[11px] font-medium text-stone-400">
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              {isSignup ? (
                <label className="flex cursor-pointer items-start gap-2.5 text-xs text-stone-500">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="peer sr-only"
                  />
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-stone-300 bg-white text-transparent transition peer-checked:border-brand-600 peer-checked:bg-brand-600 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand-200">
                    <Check className="h-3 w-3" />
                  </span>
                  <span>
                    I agree to the{" "}
                    <span className="font-medium text-brand-600">community guidelines</span> — be
                    kind, be honest, give credit.
                  </span>
                </label>
              ) : (
                <label className="flex cursor-pointer items-center gap-2.5 text-xs text-stone-500">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="peer sr-only"
                  />
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-stone-300 bg-white text-transparent transition peer-checked:border-brand-600 peer-checked:bg-brand-600 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand-200">
                    <Check className="h-3 w-3" />
                  </span>
                  Keep me signed in on this device
                </label>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="btn-gradient flex w-full items-center justify-center gap-2 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isSignup ? "Setting things up…" : "Signing you in…"}
                  </>
                ) : (
                  <>
                    {t.cta}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-stone-500">
              {t.switchPrompt}{" "}
              <Link
                href={t.switchHref}
                className="font-semibold text-brand-600 transition hover:text-brand-700"
              >
                {t.switchCta}
              </Link>
            </p>
          </div>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs text-stone-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Internal tool · only @techcare.com accounts can join
          </p>
        </div>
      </div>
    </div>
  );
}

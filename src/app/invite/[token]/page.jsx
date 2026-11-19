"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const serif = "var(--font-playfair), Georgia, serif";

export default function InvitePage({ params }) {
  const { token } = use(params);
  const router = useRouter();

  const [invite, setInvite] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/invite/${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (ignore) return;
        if (res.ok && data.success) setInvite(data);
        else setLoadError(data.message || "This invite link is invalid or has expired.");
      })
      .catch(() => !ignore && setLoadError("Network error. Please check your connection and reload."));
    return () => {
      ignore = true;
    };
  }, [token]);

  const rules = [
    { ok: password.length >= 8, label: "At least 8 characters" },
    { ok: /[A-Za-z]/.test(password) && /\d/.test(password), label: "Letters and numbers" },
    { ok: password.length > 0 && password === confirm, label: "Passwords match" },
  ];
  const valid = rules.every((r) => r.ok);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valid || submitting) return;
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/invite/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Could not set your password.");
        setSubmitting(false);
        return;
      }
      setDone(true);
      const result = await signIn("credentials", { redirect: false, email: data.email, password });
      if (result?.error) {
        router.replace("/login?callbackUrl=/manufacturer");
      } else {
        router.replace("/manufacturer");
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0D140F] text-[#FAF8F5] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-[#141E17] border border-[#C29B5D]/30 rounded-2xl shadow-2xl p-7 sm:p-8">
        <div className="flex items-center gap-3 mb-7">
          <Image src="/logotrans.png" alt="KrisluxECO" width={36} height={36} className="object-contain" />
          <div>
            <p className="text-lg font-bold" style={{ fontFamily: serif }}>
              Krislux<span className="text-[#C29B5D]">ECO</span>
            </p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#C29B5D]">Artisan Workshop Portal</p>
          </div>
        </div>

        {!invite && !loadError && (
          <div className="flex items-center gap-3 text-sm text-white/60 py-10 justify-center">
            <Loader2 size={18} className="animate-spin" /> Checking your invite…
          </div>
        )}

        {loadError && (
          <div className="space-y-5">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{loadError}</span>
            </div>
            <Link
              href="/login"
              className="block text-center text-xs font-bold uppercase tracking-widest text-[#C29B5D] hover:underline"
            >
              Already activated? Sign in
            </Link>
          </div>
        )}

        {invite && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: serif }}>
                {invite.isReset ? "Reset your password" : `Welcome, ${invite.firstName}`}
              </h1>
              <p className="text-sm text-white/60 mt-1.5 leading-relaxed">
                {invite.workshopName ? <strong className="text-white/80">{invite.workshopName}</strong> : "Your workshop"}{" "}
                · {invite.email}
                <br />
                Set a password to {invite.isReset ? "regain access to" : "activate"} your workshop account.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="text-xs text-white/60 mb-1.5 block">New password</span>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type={show ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-[#C29B5D]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </label>
              <label className="block">
                <span className="text-xs text-white/60 mb-1.5 block">Confirm password</span>
                <input
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C29B5D]"
                  required
                />
              </label>
            </div>

            <ul className="space-y-1.5">
              {rules.map((r) => (
                <li key={r.label} className={`flex items-center gap-2 text-xs ${r.ok ? "text-emerald-400" : "text-white/40"}`}>
                  <CheckCircle2 size={13} /> {r.label}
                </li>
              ))}
            </ul>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs">
                <AlertCircle size={15} className="shrink-0" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!valid || submitting}
              className="w-full bg-[#C29B5D] hover:bg-[#D4AD6F] text-[#0D140F] font-bold text-xs uppercase tracking-widest py-3.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {done ? "Signing you in…" : submitting ? "Saving…" : invite.isReset ? "Save new password" : "Activate my account"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import {
  Factory,
  CheckCircle2,
  Clock,
  Droplets,
  Sparkles,
  ShieldCheck,
  Package,
  Truck,
  Calendar,
  LogOut,
  RefreshCw,
  FileText,
  ChevronDown,
  Camera,
  X,
  AlertTriangle,
  Search,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { STAGE_ORDER, STAGE_INFO, MANUFACTURER_LAST_STAGE, nextStage, stageIndex } from "@/lib/trackingStages";

const STAGE_ICONS = {
  order_received: Clock,
  stem_curing: Droplets,
  weaving: Sparkles,
  quality_inspection: ShieldCheck,
  packed: Package,
  dispatched: Truck,
  delivered: CheckCircle2,
};

const ACTION_LABELS = {
  stem_curing: "Start stem curing",
  weaving: "Start hand-weaving",
  quality_inspection: "Mark QC & finishing done",
  packed: "Mark packed & ready",
};

const LAST_WORKSHOP_INDEX = stageIndex(MANUFACTURER_LAST_STAGE);

const daysUntil = (date) => {
  if (!date) return null;
  const ms = new Date(date).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(ms / 86400000);
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const fmtDateTime = (d) =>
  new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default function ManufacturerDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [workshop, setWorkshop] = useState(null);
  const [supervisor, setSupervisor] = useState("");
  const [isAdminPreview, setIsAdminPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [tab, setTab] = useState("active");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null);

  // Active "advance stage" panel
  const [panel, setPanel] = useState(null); // { orderId, stage }
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [panelError, setPanelError] = useState("");
  const [expandedHistory, setExpandedHistory] = useState({});

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadOrders = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/manufacturer/orders", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.orders || []);
        setWorkshop(data.workshop || null);
        setSupervisor(data.supervisor || "");
        setIsAdminPreview(!!data.isAdminPreview);
      } else {
        setLoadError(data.message || "Could not load your work orders.");
      }
    } catch {
      setLoadError("Network error. Check your connection and tap refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load: `loading` already starts as true, so no synchronous setState here.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await Promise.resolve(); // defer so state updates happen outside the effect body
      if (!cancelled) loadOrders(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [loadOrders]);

  const openPanel = (orderId, stage) => {
    setPanel({ orderId, stage });
    setNote("");
    setPhoto(null);
    setPanelError("");
  };

  const submitAdvance = async () => {
    if (!panel) return;
    setSubmitting(true);
    setPanelError("");
    try {
      let res;
      if (photo) {
        const form = new FormData();
        form.append("quoteId", panel.orderId);
        form.append("stage", panel.stage);
        form.append("note", note);
        form.append("photo", photo);
        res = await fetch("/api/manufacturer/orders", { method: "PATCH", body: form });
      } else {
        res = await fetch("/api/manufacturer/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quoteId: panel.orderId, stage: panel.stage, note }),
        });
      }
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) => prev.map((o) => (o._id === panel.orderId ? { ...o, ...data.order } : o)));
        showToast(`Updated: ${STAGE_INFO[panel.stage].title}`);
        setPanel(null);
      } else {
        setPanelError(data.message || "Update failed.");
        if (res.status === 409) loadOrders();
      }
    } catch {
      setPanelError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isHandedOver = (o) => stageIndex(o.currentStage || "order_received") >= LAST_WORKSHOP_INDEX;

  const stats = useMemo(() => {
    const active = orders.filter((o) => !isHandedOver(o));
    const overdue = active.filter((o) => {
      const d = daysUntil(o.targetCompletionDate);
      return d !== null && d < 0;
    });
    const dueSoon = active.filter((o) => {
      const d = daysUntil(o.targetCompletionDate);
      return d !== null && d >= 0 && d <= 3;
    });
    return { active: active.length, overdue: overdue.length, dueSoon: dueSoon.length, done: orders.length - active.length };
  }, [orders]);

  const visibleOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders
      .filter((o) => (tab === "active" ? !isHandedOver(o) : isHandedOver(o)))
      .filter(
        (o) =>
          !q ||
          o.trackingCode?.toLowerCase().includes(q) ||
          o.items?.some((i) => i.productName?.toLowerCase().includes(q))
      )
      .sort((a, b) => {
        if (tab !== "active") return new Date(b.updatedAt) - new Date(a.updatedAt);
        const da = a.targetCompletionDate ? new Date(a.targetCompletionDate) : Infinity;
        const db = b.targetCompletionDate ? new Date(b.targetCompletionDate) : Infinity;
        return da - db;
      });
  }, [orders, tab, query]);

  return (
    <div className="min-h-screen bg-[#0D140F] text-[#FAF8F5]">
      {toast && (
        <div
          role="status"
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-lg shadow-xl border flex items-center gap-2 text-xs font-semibold max-w-[calc(100%-32px)] ${
            toast.type === "error" ? "bg-rose-900 border-rose-500/40" : "bg-[#3E634A] border-[#C29B5D]/40"
          }`}
        >
          <CheckCircle2 size={16} /> {toast.msg}
        </div>
      )}

      <header className="border-b border-white/10 bg-[#141E17]/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Image src="/logotrans.png" alt="KrisluxECO" width={34} height={34} className="object-contain shrink-0" />
            <div className="min-w-0">
              <span className="font-serif text-lg font-bold block leading-tight">
                Krislux<span className="text-[#C29B5D]">ECO</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#C29B5D] block uppercase truncate">
                Artisan Workshop Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium">{supervisor || "Workshop Supervisor"}</p>
              <p className="text-[10px] text-[#C29B5D] font-mono">{workshop?.artisanCluster || ""}</p>
            </div>
            <button
              onClick={() => loadOrders()}
              className="p-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg border border-white/10"
              title="Refresh"
              aria-label="Refresh orders"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2 bg-white/5 hover:bg-rose-500/20 text-white/70 hover:text-rose-200 rounded-lg border border-white/10"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {isAdminPreview && (
          <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-xs p-3 rounded-lg">
            Admin preview — you are seeing every assigned order across all workshops.
          </div>
        )}

        {/* Workshop card */}
        <div className="bg-gradient-to-r from-[#141E17] to-[#1B2920] border border-[#C29B5D]/30 p-5 sm:p-6 rounded-2xl">
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#C29B5D] uppercase font-bold">Your workshop</span>
          <h1 className="text-xl sm:text-2xl font-bold font-serif mt-1">
            {workshop?.workshopName || "Artisan Workshop"}
          </h1>
          <p className="text-xs text-white/60 mt-1">
            {[workshop?.artisanCluster, workshop?.specialization].filter(Boolean).join(" · ")}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {[
              { label: "Active orders", value: stats.active, cls: "text-[#C29B5D]" },
              { label: "Due in 3 days", value: stats.dueSoon, cls: "text-amber-300" },
              { label: "Overdue", value: stats.overdue, cls: stats.overdue ? "text-rose-300" : "text-white/70" },
              { label: "Handed over", value: stats.done, cls: "text-emerald-300" },
            ].map((s) => (
              <div key={s.label} className="bg-black/25 border border-white/10 px-4 py-3 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-white/50 block">{s.label}</span>
                <span className={`text-2xl font-bold font-serif ${s.cls}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl flex items-start gap-3 text-xs text-white/70">
          <ShieldCheck size={17} className="text-[#C29B5D] shrink-0 mt-0.5" />
          <span>
            Update each order as work moves forward. <strong className="text-white/90">Notes and photos you add are shown to the customer</strong> on
            their tracking page, so keep them clear and professional. Customer contact details and prices are kept private.
          </span>
        </div>

        {/* Tabs + search */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="inline-flex bg-white/5 border border-white/10 rounded-lg p-1 self-start">
            {[
              { key: "active", label: `In progress (${stats.active})` },
              { key: "done", label: `Handed over (${stats.done})` },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                  tab === t.key ? "bg-[#C29B5D] text-[#0D140F]" : "text-white/60 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="relative sm:w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order ID or product"
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#C29B5D]/60"
            />
          </div>
        </div>

        {/* Orders */}
        {loadError ? (
          <div className="bg-rose-500/10 border border-rose-500/30 p-6 rounded-2xl text-center text-sm text-rose-200 space-y-3">
            <p>{loadError}</p>
            <button onClick={() => loadOrders()} className="text-xs font-bold uppercase tracking-widest underline">
              Try again
            </button>
          </div>
        ) : loading && orders.length === 0 ? (
          <div className="space-y-4">
            {[0, 1].map((i) => (
              <div key={i} className="h-56 bg-[#141E17] border border-white/10 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : visibleOrders.length === 0 ? (
          <div className="bg-[#141E17] border border-white/10 p-12 rounded-2xl text-center space-y-2">
            <Factory size={34} className="mx-auto text-white/20" />
            <p className="text-sm font-medium text-white/70">
              {tab === "active" ? "No work orders in progress." : "Nothing handed over yet."}
            </p>
            <p className="text-xs text-white/40">New orders assigned by KrisluxECO will appear here.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {visibleOrders.map((order) => {
              const current = order.currentStage || "order_received";
              const currentIdx = stageIndex(current);
              const upcoming = nextStage(current);
              const canAdvance = upcoming && stageIndex(upcoming) <= LAST_WORKSHOP_INDEX;
              const days = daysUntil(order.targetCompletionDate);
              const panelOpen = panel?.orderId === order._id;
              const history = [...(order.stageHistory || [])].reverse();
              const historyOpen = !!expandedHistory[order._id];

              return (
                <article
                  key={order._id}
                  className="bg-[#141E17] border border-white/10 hover:border-[#C29B5D]/30 rounded-2xl p-5 sm:p-6 space-y-5 transition-colors"
                >
                  {/* Top bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs font-mono font-bold bg-[#C29B5D]/15 text-[#C29B5D] px-3 py-1 rounded-md border border-[#C29B5D]/30">
                        {order.trackingCode}
                      </span>
                      <span className="text-xs text-white/50">{STAGE_INFO[current]?.label}</span>
                    </div>
                    {order.targetCompletionDate && (
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-md border ${
                          isHandedOver(order)
                            ? "text-white/50 bg-white/5 border-white/10"
                            : days < 0
                            ? "text-rose-300 bg-rose-500/10 border-rose-500/30"
                            : days <= 3
                            ? "text-amber-300 bg-amber-500/10 border-amber-500/30"
                            : "text-white/70 bg-white/5 border-white/10"
                        }`}
                      >
                        {!isHandedOver(order) && days < 0 ? <AlertTriangle size={13} /> : <Calendar size={13} />}
                        Target {fmtDate(order.targetCompletionDate)}
                        {!isHandedOver(order) &&
                          (days < 0 ? ` · ${-days}d overdue` : days === 0 ? " · today" : ` · ${days}d left`)}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Specs */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono uppercase text-[#C29B5D] tracking-wider block font-bold">
                        What to make
                      </span>
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white/5 border border-white/10 p-3.5 rounded-xl flex items-center justify-between gap-3"
                        >
                          <p className="text-sm font-semibold">{item.productName || "Custom item"}</p>
                          <span className="text-lg font-bold font-mono text-[#C29B5D] shrink-0">{item.quantity} pcs</span>
                        </div>
                      ))}
                      {order.additionalInfo && (
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5 text-xs text-white/75 whitespace-pre-line">
                          <span className="text-[10px] uppercase font-mono text-white/40 block mb-1">Requirements</span>
                          {order.additionalInfo}
                        </div>
                      )}
                      {order.customizationFileUrl && (
                        <a
                          href={order.customizationFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-semibold text-[#C29B5D] hover:underline"
                        >
                          <FileText size={14} /> Open design / reference file
                        </a>
                      )}
                    </div>

                    {/* Progress + action */}
                    <div className="space-y-4">
                      <span className="text-[10px] font-mono uppercase text-[#C29B5D] tracking-wider block font-bold">
                        Production progress
                      </span>
                      <ol className="space-y-1.5">
                        {STAGE_ORDER.map((key, idx) => {
                          const Icon = STAGE_ICONS[key];
                          const done = idx < currentIdx;
                          const isCurrent = idx === currentIdx;
                          const teamOnly = idx > LAST_WORKSHOP_INDEX;
                          return (
                            <li
                              key={key}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-xs ${
                                isCurrent
                                  ? "bg-[#C29B5D]/15 border-[#C29B5D]/60 text-white"
                                  : done
                                  ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-200/90"
                                  : "bg-white/[0.02] border-white/5 text-white/35"
                              }`}
                            >
                              <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                  done ? "bg-emerald-500/20" : isCurrent ? "bg-[#C29B5D]/30" : "bg-white/5"
                                }`}
                              >
                                {done ? <CheckCircle2 size={13} /> : <Icon size={13} />}
                              </span>
                              <span className="flex-1 font-medium">{STAGE_INFO[key].label}</span>
                              {teamOnly && <span className="text-[10px] font-mono text-white/30">KrisluxECO</span>}
                              {isCurrent && <span className="text-[10px] font-mono text-[#C29B5D]">NOW</span>}
                            </li>
                          );
                        })}
                      </ol>

                      {canAdvance && !panelOpen && !isAdminPreview && (
                        <button
                          onClick={() => openPanel(order._id, upcoming)}
                          className="w-full inline-flex items-center justify-center gap-2 bg-[#C29B5D] hover:bg-[#D4AD6F] text-[#0D140F] px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          {ACTION_LABELS[upcoming]} <ArrowRight size={14} />
                        </button>
                      )}

                      {!canAdvance && (
                        <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2.5 rounded-lg">
                          <CheckCircle2 size={14} />
                          {current === "delivered"
                            ? "Delivered to the customer. Great work!"
                            : current === "dispatched"
                            ? "Dispatched by KrisluxECO — on its way to the customer."
                            : "Ready for pickup — KrisluxECO will arrange dispatch."}
                        </div>
                      )}

                      {panelOpen && (
                        <div className="bg-black/30 border border-[#C29B5D]/40 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold">{STAGE_INFO[upcoming].title}</p>
                            <button
                              onClick={() => setPanel(null)}
                              className="text-white/50 hover:text-white"
                              aria-label="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value.slice(0, 500))}
                            rows={3}
                            placeholder="Optional note for the customer (e.g. 120 of 200 pieces woven)"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#C29B5D]"
                          />
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <label className="inline-flex items-center gap-2 text-xs text-white/70 cursor-pointer hover:text-white">
                              <Camera size={15} />
                              <span className="truncate max-w-[180px]">{photo ? photo.name : "Add progress photo"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0] || null;
                                  if (f && f.size > 5 * 1024 * 1024) {
                                    setPanelError("Photo must be smaller than 5 MB.");
                                    return;
                                  }
                                  setPanelError("");
                                  setPhoto(f);
                                }}
                              />
                            </label>
                            <span className="text-[10px] text-white/35 font-mono">{note.length}/500</span>
                          </div>
                          {panelError && <p className="text-xs text-rose-300">{panelError}</p>}
                          <button
                            onClick={submitAdvance}
                            disabled={submitting}
                            className="w-full inline-flex items-center justify-center gap-2 bg-[#C29B5D] hover:bg-[#D4AD6F] text-[#0D140F] px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                          >
                            {submitting && <Loader2 size={14} className="animate-spin" />}
                            {submitting ? "Updating…" : "Confirm update"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* History */}
                  {history.length > 0 && (
                    <div className="border-t border-white/10 pt-3">
                      <button
                        onClick={() => setExpandedHistory((s) => ({ ...s, [order._id]: !s[order._id] }))}
                        className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white"
                      >
                        <ChevronDown size={14} className={`transition-transform ${historyOpen ? "rotate-180" : ""}`} />
                        Update history ({history.length})
                      </button>
                      {historyOpen && (
                        <ul className="mt-3 space-y-3 pl-1">
                          {history.map((h, i) => (
                            <li key={i} className="flex gap-3 text-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C29B5D] mt-1.5 shrink-0" />
                              <div className="space-y-1 min-w-0">
                                <p className="font-semibold text-white/90">{h.title}</p>
                                <p className="text-white/40 font-mono text-[10px]">{fmtDateTime(h.updatedAt)}</p>
                                {h.note && <p className="text-white/70">{h.note}</p>}
                                {h.photoUrl && (
                                  <a href={h.photoUrl} target="_blank" rel="noopener noreferrer">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={h.photoUrl}
                                      alt="Progress"
                                      className="mt-1 w-28 h-20 object-cover rounded-md border border-white/10"
                                    />
                                  </a>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Factory,
  Search,
  Plus,
  Truck,
  CheckCircle2,
  RefreshCw,
  Eye,
  X,
  Copy,
  Check,
  Mail,
  Ban,
  Unlock,
  Send,
  AlertTriangle,
  MessageCircle,
  Users,
  Package,
  ChevronLeft,
  ChevronRight,
  Info,
  FileText,
  Settings2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { STAGE_ORDER, STAGE_INFO, stageIndex } from "@/lib/trackingStages";
import { COURIERS, findCourier, buildTrackingUrl } from "@/lib/couriers";

/* ----------------------------- constants ----------------------------- */

const VIEWS = [
  { key: "open", label: "Open" },
  { key: "unassigned", label: "Unassigned" },
  { key: "in_production", label: "In production" },
  { key: "ready", label: "Ready to dispatch" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "overdue", label: "Overdue" },
  { key: "all", label: "All" },
];

const STAGE_TONE = {
  order_received: "bg-slate-100 text-slate-700",
  stem_curing: "bg-amber-100 text-amber-800",
  weaving: "bg-violet-100 text-violet-800",
  quality_inspection: "bg-sky-100 text-sky-800",
  packed: "bg-indigo-100 text-indigo-800",
  dispatched: "bg-blue-100 text-blue-800",
  delivered: "bg-emerald-100 text-emerald-800",
};

const ACCOUNT_BADGE = {
  active: { label: "Active", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  invited: { label: "Invite sent", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  invite_expired: { label: "Invite expired", cls: "bg-rose-50 text-rose-700 border-rose-200" },
  blocked: { label: "Blocked", cls: "bg-gray-100 text-gray-600 border-gray-200" },
};

const EMPTY_MFR = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  workshopName: "",
  artisanCluster: "Begusarai, Bihar",
  specialization: "Water Hyacinth Twill Weaving",
};

const input =
  "w-full bg-white border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm text-[#1C1C1A] placeholder:text-[#B5ABA0] focus:outline-none focus:ring-2 focus:ring-[#4A6741]/25 focus:border-[#4A6741]";
const btnPrimary =
  "inline-flex items-center justify-center gap-2 bg-[#4A6741] hover:bg-[#3d5636] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50";
const btnGhost =
  "inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF7F2] text-[#1C1C1A] border border-[#E8DDD0] px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50";
const btnSmall =
  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50";

const toDateInput = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—");
const fmtDateTime = (d) =>
  new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const isOverdue = (o) =>
  o.targetCompletionDate &&
  stageIndex(o.currentStage || "order_received") < stageIndex("packed") &&
  new Date(o.targetCompletionDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
const workshopLabel = (m) =>
  `${m.workshopDetails?.workshopName || `${m.firstName} ${m.lastName}`}${
    m.isBlocked ? " (blocked)" : m.accountState !== "active" ? " (not activated)" : ""
  }`;

/* ----------------------------- small UI ------------------------------ */

function StageBar({ stage }) {
  const idx = stageIndex(stage);
  return (
    <div className="flex gap-0.5 mt-1.5" aria-hidden="true">
      {STAGE_ORDER.map((s, i) => (
        <span key={s} className={`h-1 flex-1 rounded-full ${i <= idx ? "bg-[#4A6741]" : "bg-[#E8DDD0]"}`} />
      ))}
    </div>
  );
}

function Section({ title, id, children }) {
  return (
    <section id={id} className="space-y-3 scroll-mt-4">
      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#9E9088]">{title}</h4>
      {children}
    </section>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40" onMouseDown={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8DDD0]"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 py-4 border-b border-[#F0E9DF] flex items-center justify-between sticky top-0 bg-white">
          <h3 className="font-semibold text-[#1C1C1A]">{title}</h3>
          <button onClick={onClose} className="text-[#9E9088] hover:text-[#1C1C1A]" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, total, limit, onPage, onLimit }) {
  if (!total) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(total, page * limit);
  const pages = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-[#F0E9DF] text-sm text-[#6B6560]">
      <div className="flex items-center gap-3">
        <span>
          Showing <strong className="text-[#1C1C1A]">{from}–{to}</strong> of <strong className="text-[#1C1C1A]">{total}</strong>
        </span>
        {onLimit && (
          <select
            value={limit}
            onChange={(e) => onLimit(Number(e.target.value))}
            className="border border-[#E8DDD0] rounded-md px-2 py-1 text-xs bg-white"
            aria-label="Rows per page"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
        )}
      </div>
      <nav className="flex items-center gap-1" aria-label="Pagination">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-md border border-[#E8DDD0] bg-white disabled:opacity-40 hover:bg-[#FAF7F2]"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="px-2">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p)}
              aria-current={p === page ? "page" : undefined}
              className={`min-w-8 h-8 px-2 rounded-md text-sm border ${
                p === page ? "bg-[#4A6741] border-[#4A6741] text-white" : "bg-white border-[#E8DDD0] hover:bg-[#FAF7F2]"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-md border border-[#E8DDD0] bg-white disabled:opacity-40 hover:bg-[#FAF7F2]"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}

/* ------------------------------ page -------------------------------- */

function ProductionBoard() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // All filters live in the URL, so every view is a shareable / bookmarkable link.
  const tab = sp.get("tab") === "workshops" ? "workshops" : "orders";
  const view = VIEWS.some((v) => v.key === sp.get("view")) ? sp.get("view") : "open";
  const q = sp.get("q") || "";
  const page = Math.max(1, parseInt(sp.get("page"), 10) || 1);
  const limit = [10, 20, 50].includes(Number(sp.get("limit"))) ? Number(sp.get("limit")) : 10;
  const openId = sp.get("order");
  const dispatchId = sp.get("dispatch");

  const [orders, setOrders] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [counts, setCounts] = useState({});
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(q);
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState("");
  const [copied, setCopied] = useState("");
  const [workshopPage, setWorkshopPage] = useState(1);

  const [showAdd, setShowAdd] = useState(false);
  const [newMfr, setNewMfr] = useState(EMPTY_MFR);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [inviteResult, setInviteResult] = useState(null);

  const drawerOrder = openId ? orders.find((o) => o._id === openId) || null : null;
  const dispatchOrder = dispatchId ? orders.find((o) => o._id === dispatchId) || null : null;

  const setParams = useCallback(
    (patch) => {
      const next = new URLSearchParams(sp.toString());
      const defaults = { page: "1", view: "open", tab: "orders", limit: "10" };
      Object.entries(patch).forEach(([k, v]) => {
        const val = v === null || v === undefined ? "" : String(v);
        if (!val || defaults[k] === val) next.delete(k);
        else next.set(k, val);
      });
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [sp, router, pathname]
  );

  // Debounced search → URL
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(() => {
      if (searchText.trim() !== q) setParams({ q: searchText.trim(), page: 1 });
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3800);
  };

  /* ------------------------------ data ------------------------------ */
  const loadData = useCallback(
    async (showSpinner = true) => {
      if (showSpinner) setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page), limit: String(limit), view, q });
        const res = await fetch(`/api/admin/production?${params}`, { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data.success) {
          setOrders(data.orders || []);
          setManufacturers(data.manufacturers || []);
          setCounts(data.counts || {});
          setPagination(data.pagination);
        } else {
          showToast(data.message || "Failed to load production data", "error");
        }
      } catch {
        showToast("Network error while loading production data", "error");
      } finally {
        setLoading(false);
      }
    },
    [page, limit, view, q]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await Promise.resolve(); // defer so state updates happen outside the effect body
      if (!cancelled) loadData(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [loadData]);

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 1800);
    } catch {
      showToast("Could not copy — select and copy manually", "error");
    }
  };

  const patchOrder = async (quoteId, payload, successMsg) => {
    setBusy(quoteId);
    try {
      const res = await fetch("/api/admin/production", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId, ...payload }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) => prev.map((o) => (o._id === quoteId ? data.order : o)));
        showToast(successMsg + (data.notified ? " · customer emailed" : ""));
        loadData(false); // refresh counts
        return true;
      }
      showToast(data.message || "Update failed", "error");
    } catch {
      showToast("Network error", "error");
    } finally {
      setBusy("");
    }
    return false;
  };

  const markDelivered = (order) => {
    if (window.confirm(`Mark ${order.trackingCode} as delivered? The customer will be emailed.`))
      patchOrder(order._id, { currentStage: "delivered" }, "Marked as delivered");
  };

  const openDrawer = (id) => setParams({ order: id, dispatch: null });
  const closeDrawer = useCallback(() => setParams({ order: null }), [setParams]);
  const openDispatch = (o) => setParams({ dispatch: o._id });
  const closeDispatch = useCallback(() => setParams({ dispatch: null }), [setParams]);

  /* ---------------------------- workshops --------------------------- */
  const handleCreateManufacturer = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      const res = await fetch("/api/admin/production", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMfr),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowAdd(false);
        setInviteResult({
          name: `${newMfr.firstName} ${newMfr.lastName}`,
          email: newMfr.email,
          mobile: newMfr.mobile,
          inviteUrl: data.inviteUrl,
          emailSent: data.emailSent,
        });
        setNewMfr(EMPTY_MFR);
        loadData(false);
      } else {
        setFormError(data.message || "Failed to create workshop");
      }
    } catch {
      setFormError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const manufacturerAction = async (m, action) => {
    if (action === "block" && !window.confirm(`Block ${m.workshopDetails?.workshopName || m.email}? They lose portal access immediately.`))
      return;
    setBusy(m._id);
    try {
      const res = await fetch(`/api/admin/production/manufacturers/${m._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setManufacturers((prev) => prev.map((x) => (x._id === m._id ? { ...x, ...data.manufacturer, activeOrders: x.activeOrders } : x)));
        if (action === "resend_invite") {
          setInviteResult({
            name: `${m.firstName} ${m.lastName}`,
            email: m.email,
            mobile: m.mobile,
            inviteUrl: data.inviteUrl,
            emailSent: data.emailSent,
            isResend: true,
          });
        } else showToast(action === "block" ? "Workshop blocked" : "Workshop unblocked");
      } else showToast(data.message || "Action failed", "error");
    } catch {
      showToast("Network error", "error");
    } finally {
      setBusy("");
    }
  };

  const whatsappHref = (r) => {
    const text = `Hello ${r.name}, your KrisluxECO Artisan Workshop account is ready. Set your password here (valid 48 hours): ${r.inviteUrl}`;
    const digits = (r.mobile || "").replace(/\D/g, "");
    const phone = digits.length === 10 ? `91${digits}` : digits;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  const WS_PER_PAGE = 10;
  const wsTotalPages = Math.max(1, Math.ceil(manufacturers.length / WS_PER_PAGE));
  const wsPage = Math.min(workshopPage, wsTotalPages);
  const wsRows = manufacturers.slice((wsPage - 1) * WS_PER_PAGE, wsPage * WS_PER_PAGE);

  /* ------------------------------ render ----------------------------- */
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-5 text-[#1C1C1A]">
      {toast && (
        <div
          role="status"
          className={`fixed top-5 right-5 z-[80] px-4 py-3 rounded-lg shadow-lg border flex items-center gap-2 text-sm max-w-[calc(100%-40px)] ${
            toast.type === "error" ? "bg-rose-50 border-rose-200 text-rose-800" : "bg-white border-[#4A6741]/30 text-[#1C1C1A]"
          }`}
        >
          {toast.type === "error" ? <AlertTriangle size={16} className="text-rose-600" /> : <CheckCircle2 size={16} className="text-[#4A6741]" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">Production</h1>
          <p className="text-sm text-[#6B6560] mt-1">Assign confirmed orders to workshops, follow progress and dispatch to customers.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => loadData(true)} className={btnGhost} aria-label="Refresh">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => {
              setFormError("");
              setShowAdd(true);
            }}
            className={btnPrimary}
          >
            <Plus size={16} /> Add workshop
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2.5 text-sm text-[#6B6560] bg-white border border-[#E8DDD0] rounded-xl px-4 py-3">
        <Info size={16} className="text-[#4A6741] shrink-0 mt-0.5" />
        <p>
          Only <strong className="text-[#1C1C1A]">confirmed orders</strong> appear here. New quotes stay in{" "}
          <Link href="/admin/orders" className="text-[#4A6741] font-medium underline underline-offset-2">
            Orders &amp; Quotes
          </Link>{" "}
          — change a quote to <strong className="text-[#1C1C1A]">Approved</strong> there and it moves to this board.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#E8DDD0]">
        {[
          { key: "orders", label: "Orders", count: counts.all, icon: Package },
          { key: "workshops", label: "Workshops", count: manufacturers.length, icon: Users },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setParams({ tab: t.key, order: null })}
            className={`inline-flex items-center gap-2 pb-3 -mb-px text-sm font-semibold border-b-2 transition-colors ${
              tab === t.key ? "border-[#4A6741] text-[#4A6741]" : "border-transparent text-[#9E9088] hover:text-[#1C1C1A]"
            }`}
          >
            <t.icon size={16} /> {t.label}
            {t.count !== undefined && <span className="text-xs bg-[#F4EFE6] text-[#6B6560] px-2 py-0.5 rounded-full">{t.count}</span>}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <>
          {/* Filters */}
          <div className="flex flex-col xl:flex-row xl:items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {VIEWS.map((v) => {
                const active = view === v.key;
                const warn = (v.key === "overdue" || v.key === "unassigned") && counts[v.key] > 0;
                return (
                  <button
                    key={v.key}
                    onClick={() => setParams({ view: v.key, page: 1 })}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      active ? "bg-[#1C1C1A] border-[#1C1C1A] text-white" : "bg-white border-[#E8DDD0] text-[#6B6560] hover:border-[#1C1C1A]/40"
                    }`}
                  >
                    {v.label}
                    <span className={`px-1.5 rounded-full text-[10px] ${active ? "bg-white/20" : warn ? "bg-rose-100 text-rose-700" : "bg-[#F4EFE6]"}`}>
                      {counts[v.key] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="relative xl:ml-auto xl:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9088]" />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search tracking ID, customer, product…"
                className={`${input} pl-9`}
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-[#E8DDD0] rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[980px]">
                <thead className="bg-[#FAF7F2] text-[11px] uppercase tracking-wider text-[#9E9088] border-b border-[#E8DDD0]">
                  <tr>
                    <th className="text-left font-semibold px-4 py-3">Order</th>
                    <th className="text-left font-semibold px-4 py-3">Customer</th>
                    <th className="text-left font-semibold px-4 py-3">Items</th>
                    <th className="text-left font-semibold px-4 py-3 w-56">Workshop</th>
                    <th className="text-left font-semibold px-4 py-3 w-44">Progress</th>
                    <th className="text-left font-semibold px-4 py-3">Target</th>
                    <th className="text-right font-semibold px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E9DF]">
                  {loading && orders.length === 0 ? (
                    [0, 1, 2, 3].map((i) => (
                      <tr key={i}>
                        <td colSpan={7} className="px-4 py-4">
                          <div className="h-10 bg-[#FAF7F2] rounded-lg animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-14 text-center text-[#9E9088]">
                        <Factory size={28} className="mx-auto mb-2 opacity-40" />
                        {q ? `No orders match “${q}”.` : "No orders in this view."}
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => {
                      const stage = o.currentStage || "order_received";
                      const sIdx = stageIndex(stage);
                      const rowBusy = busy === o._id;
                      const totalQty = o.items?.reduce((n, i) => n + (i.quantity || 0), 0) || 0;
                      const overdue = isOverdue(o);
                      return (
                        <tr key={o._id} className={`hover:bg-[#FCFAF7] ${rowBusy ? "opacity-60" : ""}`}>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <button onClick={() => openDrawer(o._id)} className="font-mono font-semibold text-[#4A6741] hover:underline">
                                {o.trackingCode}
                              </button>
                              <button onClick={() => copy(o.trackingCode, o._id)} className="p-1 text-[#B5ABA0] hover:text-[#1C1C1A]" aria-label="Copy tracking ID">
                                {copied === o._id ? <Check size={13} className="text-[#4A6741]" /> : <Copy size={13} />}
                              </button>
                            </div>
                            <span className="text-xs text-[#9E9088]">{fmtDate(o.createdAt)}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-medium truncate max-w-[180px]">{o.customerDetails?.companyName || o.customerDetails?.contactPerson || "—"}</p>
                            <p className="text-xs text-[#9E9088] truncate max-w-[180px]">
                              {o.customerDetails?.companyName ? o.customerDetails?.contactPerson : o.customerDetails?.email}
                            </p>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="truncate max-w-[200px]" title={o.items?.map((i) => `${i.quantity}× ${i.productName}`).join("\n")}>
                              {o.items?.[0]?.productName}
                            </p>
                            <p className="text-xs text-[#9E9088]">
                              {o.items?.length > 1 ? `+${o.items.length - 1} more · ` : ""}
                              {totalQty} pcs
                            </p>
                          </td>
                          <td className="px-4 py-3.5">
                            <select
                              value={o.assignedManufacturer?._id || ""}
                              disabled={rowBusy || sIdx >= stageIndex("dispatched")}
                              onChange={(e) =>
                                patchOrder(o._id, { assignedManufacturer: e.target.value || null }, e.target.value ? "Workshop assigned" : "Workshop removed")
                              }
                              className={`w-full text-xs rounded-lg px-2.5 py-2 border cursor-pointer disabled:cursor-default disabled:bg-[#FAF7F2] ${
                                o.assignedManufacturer ? "bg-white border-[#E8DDD0]" : "bg-rose-50 border-rose-200 text-rose-700"
                              }`}
                            >
                              <option value="">— Assign workshop —</option>
                              {manufacturers.map((m) => (
                                <option key={m._id} value={m._id} disabled={m.isBlocked}>
                                  {workshopLabel(m)}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${STAGE_TONE[stage]}`}>
                              {STAGE_INFO[stage]?.label}
                            </span>
                            <StageBar stage={stage} />
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            {o.targetCompletionDate ? (
                              <span className={overdue ? "text-rose-600 font-medium" : ""}>
                                {fmtDate(o.targetCompletionDate)}
                                {overdue && <span className="block text-[11px]">Overdue</span>}
                              </span>
                            ) : (
                              <span className="text-[#B5ABA0]">Not set</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              {stage === "packed" && (
                                <button onClick={() => openDispatch(o)} className={`${btnSmall} bg-[#4A6741] hover:bg-[#3d5636] text-white`}>
                                  <Truck size={14} /> Dispatch
                                </button>
                              )}
                              {stage === "dispatched" && (
                                <button onClick={() => markDelivered(o)} className={`${btnSmall} bg-emerald-600 hover:bg-emerald-700 text-white`}>
                                  <CheckCircle2 size={14} /> Delivered
                                </button>
                              )}
                              <button onClick={() => openDrawer(o._id)} className={`${btnSmall} border border-[#E8DDD0] hover:border-[#1C1C1A]/40 bg-white`}>
                                <Settings2 size={14} /> Manage
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPage={(p) => setParams({ page: p })}
              onLimit={(n) => setParams({ limit: n, page: 1 })}
            />
          </div>
        </>
      )}

      {tab === "workshops" && (
        <div className="bg-white border border-[#E8DDD0] rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[860px]">
              <thead className="bg-[#FAF7F2] text-[11px] uppercase tracking-wider text-[#9E9088] border-b border-[#E8DDD0]">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">Workshop</th>
                  <th className="text-left font-semibold px-4 py-3">Supervisor</th>
                  <th className="text-left font-semibold px-4 py-3">Account</th>
                  <th className="text-left font-semibold px-4 py-3">Active orders</th>
                  <th className="text-left font-semibold px-4 py-3">Last login</th>
                  <th className="text-right font-semibold px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E9DF]">
                {wsRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-14 text-center text-[#9E9088]">
                      {loading ? "Loading…" : "No workshops yet — click “Add workshop” to invite your first manufacturer."}
                    </td>
                  </tr>
                ) : (
                  wsRows.map((m) => {
                    const badge = ACCOUNT_BADGE[m.accountState] || ACCOUNT_BADGE.invited;
                    const rowBusy = busy === m._id;
                    return (
                      <tr key={m._id} className={`hover:bg-[#FCFAF7] ${rowBusy ? "opacity-60" : ""}`}>
                        <td className="px-4 py-3.5">
                          <p className="font-medium">{m.workshopDetails?.workshopName || "—"}</p>
                          <p className="text-xs text-[#9E9088]">
                            {[m.workshopDetails?.artisanCluster, m.workshopDetails?.specialization].filter(Boolean).join(" · ")}
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p>{m.firstName} {m.lastName}</p>
                          <p className="text-xs text-[#9E9088]">{m.email}{m.mobile ? ` · ${m.mobile}` : ""}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs px-2 py-1 rounded-full border ${badge.cls}`}>{badge.label}</span>
                          {m.accountState === "invited" && m.inviteTokenExpires && (
                            <p className="text-[11px] text-[#9E9088] mt-1">expires {fmtDateTime(m.inviteTokenExpires)}</p>
                          )}
                        </td>
                        <td className="px-4 py-3.5 font-semibold">{m.activeOrders}</td>
                        <td className="px-4 py-3.5 text-[#6B6560]">{m.lastLogin ? fmtDate(m.lastLogin) : "Never"}</td>
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            {!m.isBlocked && (
                              <button disabled={rowBusy} onClick={() => manufacturerAction(m, "resend_invite")} className={`${btnSmall} border border-[#E8DDD0] bg-white hover:bg-[#FAF7F2]`}>
                                <Send size={13} /> {m.accountState === "active" ? "Reset password" : "Resend invite"}
                              </button>
                            )}
                            {m.isBlocked ? (
                              <button disabled={rowBusy} onClick={() => manufacturerAction(m, "unblock")} className={`${btnSmall} border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}>
                                <Unlock size={13} /> Unblock
                              </button>
                            ) : (
                              <button disabled={rowBusy} onClick={() => manufacturerAction(m, "block")} className={`${btnSmall} border border-rose-200 bg-white text-rose-600 hover:bg-rose-50`}>
                                <Ban size={13} /> Block
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={wsPage} totalPages={wsTotalPages} total={manufacturers.length} limit={WS_PER_PAGE} onPage={setWorkshopPage} />
        </div>
      )}

      {drawerOrder && (
        <OrderModal
          key={drawerOrder._id}
          order={drawerOrder}
          manufacturers={manufacturers}
          busy={busy === drawerOrder._id}
          onClose={closeDrawer}
          onPatch={patchOrder}
          onDelivered={markDelivered}
          onDispatch={openDispatch}
        />
      )}

      {dispatchOrder && (
        <DispatchModal
          key={`d-${dispatchOrder._id}`}
          order={dispatchOrder}
          busy={busy === dispatchOrder._id}
          onClose={closeDispatch}
          onPatch={patchOrder}
        />
      )}

      {showAdd && (
        <Modal title="Add manufacturer workshop" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleCreateManufacturer} className="p-6 space-y-4">
            <p className="text-xs text-[#6B6560] bg-[#FAF7F2] border border-[#E8DDD0] rounded-lg p-3">
              We&apos;ll email the supervisor a secure link to set their own password. You&apos;ll also get the link to share on WhatsApp.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-xs text-[#6B6560] space-y-1">
                <span>First name *</span>
                <input required value={newMfr.firstName} onChange={(e) => setNewMfr({ ...newMfr, firstName: e.target.value })} className={input} />
              </label>
              <label className="text-xs text-[#6B6560] space-y-1">
                <span>Last name *</span>
                <input required value={newMfr.lastName} onChange={(e) => setNewMfr({ ...newMfr, lastName: e.target.value })} className={input} />
              </label>
            </div>
            <label className="block text-xs text-[#6B6560] space-y-1">
              <span>Login email *</span>
              <input type="email" required value={newMfr.email} onChange={(e) => setNewMfr({ ...newMfr, email: e.target.value })} className={input} />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-xs text-[#6B6560] space-y-1">
                <span>Mobile (for WhatsApp)</span>
                <input value={newMfr.mobile} onChange={(e) => setNewMfr({ ...newMfr, mobile: e.target.value })} className={input} placeholder="9876543210" />
              </label>
              <label className="text-xs text-[#6B6560] space-y-1">
                <span>Workshop name</span>
                <input value={newMfr.workshopName} onChange={(e) => setNewMfr({ ...newMfr, workshopName: e.target.value })} className={input} />
              </label>
              <label className="text-xs text-[#6B6560] space-y-1">
                <span>Cluster / location</span>
                <input value={newMfr.artisanCluster} onChange={(e) => setNewMfr({ ...newMfr, artisanCluster: e.target.value })} className={input} />
              </label>
              <label className="text-xs text-[#6B6560] space-y-1">
                <span>Specialization</span>
                <input value={newMfr.specialization} onChange={(e) => setNewMfr({ ...newMfr, specialization: e.target.value })} className={input} />
              </label>
            </div>
            {formError && <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3">{formError}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAdd(false)} className={btnGhost}>Cancel</button>
              <button type="submit" disabled={submitting} className={btnPrimary}>
                {submitting && <Loader2 size={15} className="animate-spin" />} Create &amp; send invite
              </button>
            </div>
          </form>
        </Modal>
      )}

      {inviteResult && (
        <Modal title={inviteResult.isResend ? "New link generated" : "Workshop created"} onClose={() => setInviteResult(null)}>
          <div className="p-6 space-y-4">
            <p className="text-sm text-[#6B6560]">{inviteResult.name} · {inviteResult.email}</p>
            <div
              className={`flex items-center gap-2 text-sm p-3 rounded-lg border ${
                inviteResult.emailSent ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-amber-50 border-amber-200 text-amber-800"
              }`}
            >
              {inviteResult.emailSent ? <Mail size={16} /> : <AlertTriangle size={16} />}
              {inviteResult.emailSent
                ? "Invite email sent. The link works once and is valid for 48 hours."
                : "Email could not be sent — share the link below. Valid for 48 hours."}
            </div>
            <div>
              <span className="text-xs text-[#6B6560] mb-1 block">Set-password link</span>
              <div className="flex gap-2">
                <input readOnly value={inviteResult.inviteUrl} onFocus={(e) => e.target.select()} className={`${input} font-mono text-xs`} />
                <button onClick={() => copy(inviteResult.inviteUrl, "invite")} className={btnGhost} aria-label="Copy link">
                  {copied === "invite" ? <Check size={15} className="text-[#4A6741]" /> : <Copy size={15} />}
                </button>
              </div>
              <p className="text-[11px] text-[#9E9088] mt-1.5">Treat this like a password — send it only to the supervisor.</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <a href={whatsappHref(inviteResult)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb757] text-white px-4 py-2 rounded-lg text-sm font-semibold">
                <MessageCircle size={16} /> Share on WhatsApp
              </a>
              <button onClick={() => setInviteResult(null)} className={btnGhost}>Done</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------------------------- Dispatch popup ---------------------------- */

function DispatchModal({ order, busy, onClose, onPatch }) {
  const dispatched = stageIndex(order.currentStage || "order_received") >= stageIndex("dispatched");
  const initialName = order.carrierDetails?.carrierName || "";
  const known = findCourier(initialName);
  const [courierKey, setCourierKey] = useState(known ? known.key : initialName ? "other" : "delhivery");
  const [otherName, setOtherName] = useState(known ? "" : initialName);
  const [awb, setAwb] = useState(order.carrierDetails?.trackingNumber || "");
  const [eta, setEta] = useState(order.carrierDetails?.estimatedDelivery || "");
  const [note, setNote] = useState("");
  const [customUrl, setCustomUrl] = useState(order.carrierDetails?.trackingUrl || "");
  const [editUrl, setEditUrl] = useState(false);

  const courier = COURIERS.find((c) => c.key === courierKey);
  const courierName = courierKey === "other" ? otherName.trim() : courier?.name || "";
  const isOwn = courierKey === "own";
  const autoUrl = buildTrackingUrl(courierKey === "other" ? "" : courierName, awb);
  const trackingUrl = editUrl ? customUrl.trim() : autoUrl;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    const ok = await onPatch(
      order._id,
      {
        carrierDetails: {
          carrierName: courierName,
          trackingNumber: isOwn ? awb.trim() || "Hand delivery" : awb.trim(),
          trackingUrl: isOwn ? "" : trackingUrl,
          estimatedDelivery: eta,
        },
        ...(dispatched ? {} : { currentStage: "dispatched", note }),
      },
      dispatched ? "Courier details updated" : "Marked as dispatched"
    );
    if (ok) onClose();
  };

  return (
    <Modal title={`${dispatched ? "Courier details" : "Dispatch order"} · ${order.trackingCode}`} onClose={onClose}>
      <form onSubmit={submit} className={`p-6 space-y-4 ${busy ? "opacity-60 pointer-events-none" : ""}`}>
        {!dispatched && stageIndex(order.currentStage) < stageIndex("packed") && (
          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex gap-2">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" /> The workshop has not marked this order as packed yet.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-xs text-[#6B6560] space-y-1">
            <span>Courier *</span>
            <select value={courierKey} onChange={(e) => setCourierKey(e.target.value)} className={input}>
              {COURIERS.map((c) => (
                <option key={c.key} value={c.key}>{c.name}</option>
              ))}
              <option value="other">Other…</option>
            </select>
          </label>
          {courierKey === "other" ? (
            <label className="text-xs text-[#6B6560] space-y-1">
              <span>Courier name *</span>
              <input required value={otherName} onChange={(e) => setOtherName(e.target.value)} className={input} placeholder="e.g. Gati" />
            </label>
          ) : (
            <label className="text-xs text-[#6B6560] space-y-1">
              <span>{isOwn ? "Vehicle / driver ref (optional)" : "AWB / tracking number *"}</span>
              <input
                required={!isOwn}
                value={awb}
                onChange={(e) => setAwb(e.target.value)}
                className={`${input} font-mono`}
                placeholder={isOwn ? "BR-09-1234" : "Printed on the courier receipt"}
              />
            </label>
          )}
          {courierKey === "other" && (
            <label className="text-xs text-[#6B6560] space-y-1 sm:col-span-2">
              <span>AWB / tracking number *</span>
              <input required value={awb} onChange={(e) => setAwb(e.target.value)} className={`${input} font-mono`} />
            </label>
          )}
        </div>

        {!isOwn && (
          <div className="rounded-lg border border-[#E8DDD0] bg-[#FAF7F2] p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#6B6560]">Customer tracking link</span>
              <button
                type="button"
                onClick={() => {
                  setCustomUrl(trackingUrl);
                  setEditUrl((v) => !v);
                }}
                className="text-xs text-[#4A6741] font-medium hover:underline"
              >
                {editUrl ? "Use automatic link" : "Edit manually"}
              </button>
            </div>
            {editUrl ? (
              <input type="url" value={customUrl} onChange={(e) => setCustomUrl(e.target.value)} className={`${input} text-xs`} placeholder="https://…" />
            ) : trackingUrl ? (
              <p className="text-xs font-mono text-[#1C1C1A] break-all">{trackingUrl}</p>
            ) : (
              <p className="text-xs text-[#9E9088]">Enter the AWB number — the link is created automatically.</p>
            )}
            {trackingUrl && (
              <a href={trackingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-[#4A6741] hover:underline">
                Test link <ExternalLink size={12} />
              </a>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-xs text-[#6B6560] space-y-1">
            <span>Estimated delivery</span>
            <input type="date" value={eta} onChange={(e) => setEta(e.target.value)} className={input} />
          </label>
          {!dispatched && (
            <label className="text-xs text-[#6B6560] space-y-1">
              <span>Note for customer</span>
              <input value={note} onChange={(e) => setNote(e.target.value)} className={input} placeholder="Optional" />
            </label>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[#F0E9DF]">
          <button type="button" onClick={onClose} className={btnGhost}>Cancel</button>
          <button type="submit" className={btnPrimary}>
            <Truck size={15} /> {dispatched ? "Save courier details" : "Dispatch & notify customer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ---------------------------- Manage popup ---------------------------- */

function OrderModal({ order, manufacturers, busy, onClose, onPatch, onDelivered, onDispatch }) {
  const stage = order.currentStage || "order_received";
  const sIdx = stageIndex(stage);
  const dispatched = sIdx >= stageIndex("dispatched");
  const [stageSel, setStageSel] = useState(stage);
  const [stageNote, setStageNote] = useState("");
  const history = [...(order.stageHistory || [])].reverse();
  const c = order.carrierDetails || {};

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const saveStage = async () => {
    if (stageSel === stage) return;
    if (stageSel === "dispatched") return onDispatch(order);
    if (stageIndex(stageSel) < sIdx && !window.confirm(`Move back to “${STAGE_INFO[stageSel].label}”? The customer will see this.`)) return;
    if (await onPatch(order._id, { currentStage: stageSel, note: stageNote }, `Stage set to ${STAGE_INFO[stageSel].label}`)) setStageNote("");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/40" onMouseDown={onClose}>
      <div
        className="w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-[#E8DDD0] flex flex-col overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Order ${order.trackingCode}`}
      >
        <header className="px-5 sm:px-6 py-4 border-b border-[#F0E9DF] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-mono font-semibold text-lg">{order.trackingCode}</p>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STAGE_TONE[stage]}`}>{STAGE_INFO[stage]?.label}</span>
              {isOverdue(order) && <span className="text-[11px] font-semibold text-rose-600">Overdue</span>}
            </div>
            <p className="text-xs text-[#9E9088]">Created {fmtDate(order.createdAt)} · {order.status}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href={`/track?code=${encodeURIComponent(order.trackingCode)}`} target="_blank" className={`${btnSmall} border border-[#E8DDD0] bg-white hover:bg-[#FAF7F2]`}>
              <Eye size={14} /> <span className="hidden sm:inline">Customer view</span>
            </Link>
            <button onClick={onClose} className="p-2 text-[#9E9088] hover:text-[#1C1C1A]" aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </header>

        <div className={`flex-1 overflow-y-auto p-5 sm:p-6 ${busy ? "opacity-60 pointer-events-none" : ""}`}>
          <StageBar stage={stage} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7 mt-6">
            <div className="space-y-7">
              <Section title="Customer">
                <div className="text-sm space-y-0.5">
                  <p className="font-medium">
                    {order.customerDetails?.contactPerson}
                    {order.customerDetails?.companyName ? ` · ${order.customerDetails.companyName}` : ""}
                  </p>
                  <p className="text-[#6B6560] break-words">{order.customerDetails?.email}</p>
                  <p className="text-[#6B6560]">{order.customerDetails?.phone}</p>
                  {order.customerDetails?.address && <p className="text-[#6B6560]">{order.customerDetails.address}</p>}
                </div>
              </Section>

              <Section title="Items">
                <ul className="divide-y divide-[#F0E9DF] border border-[#F0E9DF] rounded-lg">
                  {order.items?.map((i, idx) => (
                    <li key={idx} className="flex justify-between gap-3 px-3 py-2 text-sm">
                      <span>{i.productName}</span>
                      <span className="font-semibold shrink-0">{i.quantity} pcs</span>
                    </li>
                  ))}
                </ul>
                {order.additionalInfo && <p className="text-sm text-[#6B6560] whitespace-pre-line break-words">{order.additionalInfo}</p>}
                {order.customizationFileUrl && (
                  <a href={order.customizationFileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-[#4A6741] font-medium hover:underline">
                    <FileText size={14} /> Design file
                  </a>
                )}
              </Section>

              <Section title="Workshop & deadline">
                <div className="space-y-3">
                  <label className="block text-xs text-[#6B6560] space-y-1">
                    <span>Assigned workshop</span>
                    <select
                      value={order.assignedManufacturer?._id || ""}
                      disabled={dispatched}
                      onChange={(e) => onPatch(order._id, { assignedManufacturer: e.target.value || null }, e.target.value ? "Workshop assigned" : "Workshop removed")}
                      className={input}
                    >
                      <option value="">— Not assigned —</option>
                      {manufacturers.map((m) => (
                        <option key={m._id} value={m._id} disabled={m.isBlocked}>{workshopLabel(m)}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-xs text-[#6B6560] space-y-1">
                    <span>Target completion</span>
                    <input
                      type="date"
                      value={toDateInput(order.targetCompletionDate)}
                      onChange={(e) => onPatch(order._id, { targetCompletionDate: e.target.value || null }, "Target date updated")}
                      className={input}
                    />
                  </label>
                </div>
              </Section>
            </div>

            <div className="space-y-7">
              <Section title="Shipping">
                {c.trackingNumber ? (
                  <div className="rounded-lg border border-[#E8DDD0] p-3 text-sm space-y-1">
                    <p className="font-medium flex items-center gap-1.5">
                      <Truck size={14} className="text-[#4A6741]" /> {c.carrierName}
                    </p>
                    <p className="font-mono text-[#6B6560]">{c.trackingNumber}</p>
                    {c.estimatedDelivery && <p className="text-xs text-[#9E9088]">ETA {fmtDate(c.estimatedDelivery)}</p>}
                    {c.trackingUrl && (
                      <a href={c.trackingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-[#4A6741] hover:underline">
                        Open courier tracking <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-[#9E9088]">Not dispatched yet.</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {stage !== "delivered" && (
                    <button onClick={() => onDispatch(order)} className={btnPrimary}>
                      <Truck size={15} /> {dispatched ? "Edit courier" : "Dispatch order"}
                    </button>
                  )}
                  {stage === "dispatched" && (
                    <button onClick={() => onDelivered(order)} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      <CheckCircle2 size={15} /> Mark delivered
                    </button>
                  )}
                </div>
              </Section>

              <Section title={`Timeline (${history.length})`}>
                <ol className="relative border-l border-[#E8DDD0] ml-1.5 space-y-4">
                  {history.map((h, i) => (
                    <li key={i} className="ml-4">
                      <span className={`absolute -left-[5px] w-2.5 h-2.5 rounded-full mt-1.5 ${i === 0 ? "bg-[#4A6741]" : "bg-[#C8A97A]"}`} />
                      <p className="text-sm font-medium">{h.title}</p>
                      <p className="text-[11px] text-[#9E9088]">
                        {fmtDateTime(h.updatedAt)}
                        {h.actor && h.actor !== "system" ? ` · by ${h.actor === "manufacturer" ? "workshop" : "admin"}` : ""}
                      </p>
                      {h.note && <p className="text-sm text-[#6B6560] mt-0.5">{h.note}</p>}
                      {h.photoUrl && (
                        <a href={h.photoUrl} target="_blank" rel="noopener noreferrer">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={h.photoUrl} alt="Progress" className="mt-1.5 w-32 h-24 object-cover rounded-lg border border-[#E8DDD0]" />
                        </a>
                      )}
                    </li>
                  ))}
                </ol>
              </Section>

              <details className="rounded-lg border border-[#F0E9DF] px-3 py-2">
                <summary className="text-xs font-semibold text-[#9E9088] cursor-pointer select-none">Correct stage manually</summary>
                <div className="pt-3 space-y-2">
                  <p className="text-xs text-[#9E9088]">Workshops update their own stages. Use this only to fix a mistake.</p>
                  <div className="flex gap-2">
                    <select value={stageSel} onChange={(e) => setStageSel(e.target.value)} className={input}>
                      {STAGE_ORDER.map((s) => (
                        <option key={s} value={s}>{STAGE_INFO[s].label}</option>
                      ))}
                    </select>
                    <button onClick={saveStage} disabled={stageSel === stage} className={`${btnGhost} shrink-0`}>Update</button>
                  </div>
                  {stageSel !== stage && stageSel !== "dispatched" && (
                    <input value={stageNote} onChange={(e) => setStageNote(e.target.value)} placeholder="Note for the customer (optional)" className={input} />
                  )}
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminProductionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-[#9E9088]">Loading production…</div>}>
      <ProductionBoard />
    </Suspense>
  );
}

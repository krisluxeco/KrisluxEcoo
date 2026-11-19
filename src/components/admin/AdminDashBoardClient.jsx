"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  IndianRupee,
  ShoppingBag,
  MessageSquareText,
  Percent,
  Receipt,
  Boxes,
  UserPlus,
  Eye,
  Calendar,
  Loader2,
  AlertTriangle,
  Factory,
  Clock,
  CheckCircle2,
  ChevronRight,
  Table2,
  BarChart3,
  Inbox,
  Palette,
  Star,
  Users,
  FileText,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Design tokens — palette validated with the dataviz checker:         */
/* categorical (green, blue, orange, violet) passes CVD + contrast on  */
/* white; the 6-step green ordinal ramp passes the ordinal checks.     */
/* ------------------------------------------------------------------ */
const C = {
  s1: "#1e8a52", // green  — primary series
  s2: "#2a78d6", // blue
  s3: "#eb6834", // orange
  s4: "#6250d6", // violet
  prev: "#B5ABA0", // previous-period comparison (neutral)
  grid: "#F0E9DF",
  axis: "#9E9088",
  ink: "#1C1C1A",
  ink2: "#6B6560",
  ink3: "#9E9088",
  line: "#ECE6DF",
};
const ORDINAL = ["#6fb68b", "#4aa171", "#2e8b5a", "#1e7548", "#155f3a", "#0e4a2c"];
const HEAT = ["#F4EFE6", "#cfe8d8", "#9fd0b1", "#6fb68b", "#2e8b5a", "#155f3a"];
const serif = "var(--font-playfair), Georgia, serif";

const RANGE_PRESETS = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
  { key: "90d", label: "90D" },
  { key: "12m", label: "12M" },
  { key: "all", label: "All" },
];

/* ------------------------------ formatters ------------------------------ */
const inr = (n) => `₹${Math.round(n || 0).toLocaleString("en-IN")}`;
const inrShort = (n) => {
  const v = Math.abs(n || 0);
  if (v >= 1e7) return `₹${(n / 1e7).toFixed(1).replace(/\.0$/, "")}Cr`;
  if (v >= 1e5) return `₹${(n / 1e5).toFixed(1).replace(/\.0$/, "")}L`;
  if (v >= 1e3) return `₹${(n / 1e3).toFixed(1).replace(/\.0$/, "")}k`;
  return `₹${Math.round(n || 0)}`;
};
const num = (n) => (n || 0).toLocaleString("en-IN");
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

/* ------------------------------ primitives ------------------------------ */

function Delta({ value, suffix = "%", invert = false, hasPrev }) {
  if (!hasPrev) return null;
  if (value === null || value === undefined) {
    return <span className="text-[11px] font-medium text-[#9E9088]">new vs previous</span>;
  }
  const up = value > 0;
  const flat = value === 0;
  const good = flat ? null : invert ? !up : up;
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
        good === null ? "bg-[#F4EFE6] text-[#6B6560]" : good ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
      }`}
      aria-label={`${up ? "up" : flat ? "no change" : "down"} ${Math.abs(value)}${suffix} versus previous period`}
    >
      <Icon size={12} strokeWidth={2.5} />
      {Math.abs(value)}
      {suffix}
    </span>
  );
}

function Sparkline({ data, dataKey, color = C.s1 }) {
  if (!data?.length || data.every((d) => !d[dataKey])) return <div className="h-9" />;
  return (
    <div className="h-9 -mx-1" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 0, left: 2 }}>
          <defs>
            <linearGradient id={`sp-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.18} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.5} fill={`url(#sp-${dataKey})`} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function KpiTile({ icon: Icon, label, value, delta, deltaSuffix, hasPrev, spark, sparkKey, hint }) {
  return (
    <div className="bg-white border border-[#ECE6DF] rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[138px] hover:shadow-[0_6px_24px_-12px_rgba(28,28,26,0.18)] transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[12px] font-medium text-[#6B6560] leading-tight">{label}</p>
        <span className="p-1.5 rounded-lg bg-[#F4EFE6] text-[#4A6741]">
          <Icon size={15} />
        </span>
      </div>
      <div className="mt-2">
        <p className="text-[26px] leading-none font-semibold text-[#1C1C1A] tracking-tight tabular-nums" style={{ fontFamily: serif }}>
          {value}
        </p>
        <div className="mt-2 flex items-center gap-2 min-h-[20px]">
          <Delta value={delta} suffix={deltaSuffix} hasPrev={hasPrev} />
          {hint && <span className="text-[11px] text-[#9E9088]">{hint}</span>}
        </div>
      </div>
      {spark && <Sparkline data={spark} dataKey={sparkKey} />}
    </div>
  );
}

function Card({ title, subtitle, action, children, className = "", table }) {
  const [showTable, setShowTable] = useState(false);
  return (
    <section className={`bg-white border border-[#ECE6DF] rounded-2xl p-5 sm:p-6 flex flex-col ${className}`}>
      <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3 mb-4">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold text-[#1C1C1A]">{title}</h2>
          {subtitle && <p className="text-xs text-[#9E9088] mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
          {action}
          {table && (
            <button
              onClick={() => setShowTable((v) => !v)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6B6560] hover:text-[#1C1C1A] border border-[#ECE6DF] rounded-md px-2 py-1"
              aria-pressed={showTable}
            >
              {showTable ? <BarChart3 size={12} /> : <Table2 size={12} />}
              {showTable ? "Chart" : "Table"}
            </button>
          )}
        </div>
      </header>
      <div className="flex-1 min-h-0">
        {showTable && table ? (
          <div className="overflow-auto max-h-[300px] -mx-1">
            <table className="w-full text-xs">
              <thead className="text-[#9E9088] sticky top-0 bg-white">
                <tr>
                  {table.columns.map((c, i) => (
                    <th key={c} className={`font-semibold py-2 px-1 border-b border-[#ECE6DF] ${i ? "text-right" : "text-left"}`}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((r, ri) => (
                  <tr key={ri} className="border-b border-[#F4EFE6]">
                    {r.map((cell, ci) => (
                      <td key={ci} className={`py-1.5 px-1 tabular-nums ${ci ? "text-right" : "text-left text-[#1C1C1A]"}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

function Empty({ text = "No data for this period" }) {
  return <div className="h-full min-h-[160px] flex items-center justify-center text-xs text-[#9E9088]">{text}</div>;
}

function Legend({ items }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-1.5 text-[11px] text-[#6B6560]">
          <span className="inline-block w-3 h-[3px] rounded-full" style={{ background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

function ChartTooltip({ active, payload, label, format = num, names = {} }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1C1C1A] text-white rounded-lg px-3 py-2 shadow-xl text-xs min-w-[140px]">
      <p className="text-white/60 mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.stroke }} />
            {names[p.dataKey] || p.name}
          </span>
          <span className="font-semibold tabular-nums">{format(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

/** Ranked horizontal bars — one series, one color, value labelled at the end. */
function RankedBars({ rows, color = C.s1, format = num, labelKey, valueKey, empty }) {
  const max = Math.max(1, ...rows.map((r) => r[valueKey]));
  if (!rows.length || rows.every((r) => !r[valueKey])) return <Empty text={empty} />;
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r[labelKey]} className="group" title={`${r[labelKey]}: ${format(r[valueKey])}`}>
          <div className="flex items-baseline justify-between gap-3 text-xs mb-1">
            <span className="text-[#1C1C1A] truncate">{r[labelKey]}</span>
            <span className="text-[#6B6560] tabular-nums font-medium shrink-0">{format(r[valueKey])}</span>
          </div>
          <div className="h-2 bg-[#F6F2EC] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-500 group-hover:opacity-80"
              style={{ width: `${Math.max(2, (r[valueKey] / max) * 100)}%`, background: color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

const axisProps = { stroke: C.axis, fontSize: 11, tickLine: false, axisLine: false };

/* ------------------------------ main ------------------------------ */

export default function AdminDashBoardClient({ data }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [showCustom, setShowCustom] = useState(data.range.key === "custom");
  const [from, setFrom] = useState(data.range.from);
  const [to, setTo] = useState(data.range.to);

  const go = (params) => {
    const qs = new URLSearchParams(params).toString();
    startTransition(() => router.push(`${pathname}?${qs}`, { scroll: false }));
  };

  const { kpis, series, range } = data;
  const hasPrev = range.hasPrev;
  const s = series;
  const funnelMax = Math.max(1, data.funnel[0]?.value || 0);
  const heatMax = Math.max(1, ...data.heatmap.rows.flatMap((r) => r.cells));
  const trafficTotal = data.trafficSources.reduce((a, b) => a + b.value, 0);
  const TRAFFIC_COLORS = { direct: C.s1, instagram: C.s2, linkedin: C.s3, other: C.s4 };
  const att = data.attention;
  const attention = [
    { n: att.pendingQuotes, label: "quotes awaiting reply", href: "/admin/orders", icon: Inbox },
    { n: att.unassigned, label: "confirmed orders without a workshop", href: "/admin/production?view=unassigned", icon: Factory },
    { n: data.production.overdue, label: "overdue in production", href: "/admin/production?view=overdue", icon: AlertTriangle },
    { n: att.pendingDesigns, label: "custom design requests", href: "/admin/custom-designs", icon: Palette },
    { n: att.newLeads, label: "new B2B leads", href: "/admin/leads", icon: Users },
    { n: att.pendingReviews, label: "reviews to moderate", href: "/admin/reviews", icon: Star },
    { n: att.pendingCatalogs, label: "partner catalogues", href: "/admin/catalogs", icon: FileText },
  ].filter((a) => a.n > 0);

  const bucketWord = range.bucket === "hour" ? "hour" : range.bucket === "day" ? "day" : "month";

  return (
    <div className="w-full pb-16 text-[#1C1C1A]">
      {/* ---------------- Header + filters (one row) ---------------- */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold" style={{ fontFamily: serif }}>
            Business overview
          </h1>
          <p className="text-sm text-[#9E9088] mt-1 inline-flex items-center gap-1.5">
            <Calendar size={14} /> {range.label} · {fmtDate(range.from)} – {fmtDate(range.to)}
            {hasPrev && <span className="text-[#B5ABA0]">· compared with the previous {range.key === "custom" ? "period" : range.label.toLowerCase().replace("last ", "")}</span>}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isPending && <Loader2 size={16} className="animate-spin text-[#9E9088]" aria-label="Loading" />}
          <div className="inline-flex max-w-full overflow-x-auto bg-white border border-[#ECE6DF] rounded-xl p-1" role="group" aria-label="Date range">
            {RANGE_PRESETS.map((p) => (
              <button
                key={p.key}
                onClick={() => {
                  setShowCustom(false);
                  go({ range: p.key });
                }}
                aria-pressed={range.key === p.key}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  range.key === p.key ? "bg-[#1C1C1A] text-white" : "text-[#6B6560] hover:text-[#1C1C1A]"
                }`}
              >
                {p.label}
              </button>
            ))}
            <button
              onClick={() => setShowCustom((v) => !v)}
              aria-pressed={range.key === "custom"}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                range.key === "custom" ? "bg-[#1C1C1A] text-white" : "text-[#6B6560] hover:text-[#1C1C1A]"
              }`}
            >
              Custom
            </button>
          </div>
          {showCustom && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (from && to && from <= to) go({ range: "custom", from, to });
              }}
              className="inline-flex items-center gap-2 bg-white border border-[#ECE6DF] rounded-xl px-2 py-1"
            >
              <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} className="text-xs bg-transparent outline-none" aria-label="From date" />
              <span className="text-[#9E9088] text-xs">→</span>
              <input type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} className="text-xs bg-transparent outline-none" aria-label="To date" />
              <button type="submit" className="text-xs font-semibold bg-[#4A6741] text-white px-2.5 py-1 rounded-lg">Apply</button>
            </form>
          )}
        </div>
      </div>

      <div className={`space-y-5 transition-opacity ${isPending ? "opacity-60" : ""}`}>
        {/* ---------------- Needs attention ---------------- */}
        {attention.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attention.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="group inline-flex items-center gap-2 bg-white border border-[#ECE6DF] hover:border-[#C8A97A] rounded-full pl-2 pr-3 py-1.5 text-xs transition-colors"
              >
                <span className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full bg-[#1C1C1A] text-white text-[11px] font-semibold tabular-nums">
                  {a.n}
                </span>
                <a.icon size={13} className="text-[#9E9088]" />
                <span className="text-[#4A4540]">{a.label}</span>
                <ChevronRight size={13} className="text-[#B5ABA0] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        )}

        {/* ---------------- Hero + KPIs ---------------- */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <div className="relative overflow-hidden rounded-2xl bg-[#1C1C1A] text-white p-6 flex flex-col justify-between min-h-[220px]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#C8A97A]">Order value · {range.label}</p>
              <p className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums" style={{ fontFamily: serif }}>
                {inr(kpis.revenue.value)}
              </p>
              <div className="mt-3 flex items-center gap-2">
                {hasPrev && kpis.revenue.delta !== null && (
                  <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-md ${kpis.revenue.delta >= 0 ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-400/15 text-rose-300"}`}>
                    {kpis.revenue.delta >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                    {Math.abs(kpis.revenue.delta)}%
                  </span>
                )}
                <span className="text-xs text-white/50">from {num(kpis.orders.value)} confirmed orders</span>
              </div>
            </div>
            <div className="h-16 -mx-2 mt-4" aria-hidden="true">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={s} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C8A97A" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#C8A97A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="revenue" stroke="#C8A97A" strokeWidth={2} fill="url(#heroFill)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-white/35 mt-2">Estimated from confirmed orders (Approved → Delivered)</p>
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#4A6741]/40 blur-3xl pointer-events-none" />
          </div>

          <div className="xl:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiTile icon={ShoppingBag} label="Confirmed orders" value={num(kpis.orders.value)} delta={kpis.orders.delta} hasPrev={hasPrev} spark={s} sparkKey="orders" />
            <KpiTile icon={MessageSquareText} label="Enquiries (quotes)" value={num(kpis.enquiries.value)} delta={kpis.enquiries.delta} hasPrev={hasPrev} spark={s} sparkKey="enquiries" />
            <KpiTile icon={Percent} label="Quote → order conversion" value={`${kpis.conversion.value}%`} delta={kpis.conversion.delta} deltaSuffix=" pts" hasPrev={hasPrev} />
            <KpiTile icon={Receipt} label="Average order value" value={inrShort(kpis.aov.value)} delta={kpis.aov.delta} hasPrev={hasPrev} />
            <KpiTile icon={Boxes} label="Units ordered" value={num(kpis.units.value)} delta={kpis.units.delta} hasPrev={hasPrev} />
            <KpiTile icon={UserPlus} label="New customers" value={num(kpis.customers.value)} delta={kpis.customers.delta} hasPrev={hasPrev} hint={data.repeatCustomers ? `${data.repeatCustomers} repeat` : undefined} />
            <KpiTile icon={Eye} label="Unique visitors" value={num(kpis.visitors.value)} delta={kpis.visitors.delta} hasPrev={hasPrev} spark={s} sparkKey="unique" hint={`${num(kpis.visits.value)} visits`} />
            <KpiTile icon={Users} label="B2B leads" value={num(kpis.leads.value)} delta={kpis.leads.delta} hasPrev={hasPrev} hint={data.leadsConverted ? `${data.leadsConverted} converted` : undefined} />
          </div>
        </div>

        {/* ---------------- Revenue trend + funnel ---------------- */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card
            className="xl:col-span-2"
            title="Order value over time"
            subtitle={`Per ${bucketWord}${hasPrev ? ", with the previous period for comparison" : ""}`}
            action={<Legend items={[{ label: "This period", color: C.s1 }, ...(hasPrev ? [{ label: "Previous period", color: C.prev }] : [])]} />}
            table={{ columns: ["Period", "This period", ...(hasPrev ? ["Previous"] : [])], rows: s.map((r) => [r.label, inr(r.revenue), ...(hasPrev ? [inr(r.prevRevenue)] : [])]) }}
          >
            {s.every((r) => !r.revenue && !r.prevRevenue) ? (
              <Empty text="No confirmed orders in this period" />
            ) : (
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={s} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.s1} stopOpacity={0.16} />
                        <stop offset="100%" stopColor={C.s1} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke={C.grid} />
                    <XAxis dataKey="label" {...axisProps} minTickGap={24} />
                    <YAxis {...axisProps} width={56} tickFormatter={inrShort} />
                    <Tooltip
                      cursor={{ stroke: C.axis, strokeWidth: 1 }}
                      content={<ChartTooltip format={inr} names={{ revenue: "This period", prevRevenue: "Previous period" }} />}
                    />
                    {hasPrev && <Area type="monotone" dataKey="prevRevenue" stroke={C.prev} strokeWidth={2} fill="none" dot={false} activeDot={{ r: 4, stroke: "#fff", strokeWidth: 2 }} />}
                    <Area type="monotone" dataKey="revenue" stroke={C.s1} strokeWidth={2} fill="url(#revFill)" dot={false} activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          <Card
            title="Order funnel"
            subtitle="How far this period's enquiries got"
            table={{ columns: ["Stage", "Orders", "% of enquiries"], rows: data.funnel.map((f) => [f.step, num(f.value), `${Math.round((f.value / funnelMax) * 100)}%`]) }}
          >
            {data.funnel[0].value === 0 ? (
              <Empty text="No enquiries in this period" />
            ) : (
              <ol className="space-y-2.5">
                {data.funnel.map((f, i) => {
                  const pctOfTop = Math.round((f.value / funnelMax) * 100);
                  const prevStep = data.funnel[i - 1];
                  const stepConv = prevStep && prevStep.value ? Math.round((f.value / prevStep.value) * 100) : null;
                  return (
                    <li key={f.step} title={`${f.step}: ${f.value} (${pctOfTop}% of enquiries)`}>
                      <div className="flex items-baseline justify-between text-xs mb-1">
                        <span className="font-medium text-[#1C1C1A]">{f.step}</span>
                        <span className="tabular-nums text-[#6B6560]">
                          <strong className="text-[#1C1C1A]">{num(f.value)}</strong>
                          {stepConv !== null && <span className="ml-1.5 text-[#9E9088]">{stepConv}% of prev.</span>}
                        </span>
                      </div>
                      <div className="h-6 bg-[#F6F2EC] rounded-md overflow-hidden">
                        <div className="h-full rounded-md transition-[width] duration-500" style={{ width: `${Math.max(1.5, pctOfTop)}%`, background: ORDINAL[i] }} />
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </Card>
        </div>

        {/* ---------------- Enquiries vs orders + Traffic ---------------- */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Card
            title="Enquiries vs confirmed orders"
            subtitle={`Count per ${bucketWord}`}
            action={<Legend items={[{ label: "Enquiries", color: C.s2 }, { label: "Confirmed", color: C.s1 }]} />}
            table={{ columns: ["Period", "Enquiries", "Confirmed"], rows: s.map((r) => [r.label, num(r.enquiries), num(r.orders)]) }}
          >
            {s.every((r) => !r.enquiries) ? (
              <Empty />
            ) : (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={s} margin={{ top: 8, right: 8, bottom: 0, left: -12 }} barGap={2} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={C.grid} />
                    <XAxis dataKey="label" {...axisProps} minTickGap={20} />
                    <YAxis {...axisProps} allowDecimals={false} />
                    <Tooltip cursor={{ fill: "#F6F2EC" }} content={<ChartTooltip names={{ enquiries: "Enquiries", orders: "Confirmed" }} />} />
                    <Bar dataKey="enquiries" fill={C.s2} radius={[4, 4, 0, 0]} maxBarSize={18} />
                    <Bar dataKey="orders" fill={C.s1} radius={[4, 4, 0, 0]} maxBarSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          <Card
            title="Website traffic"
            subtitle={`Visits and unique visitors per ${bucketWord}`}
            action={<Legend items={[{ label: "Visits", color: C.s2 }, { label: "Unique visitors", color: C.s1 }]} />}
            table={{ columns: ["Period", "Visits", "Unique"], rows: s.map((r) => [r.label, num(r.visits), num(r.unique)]) }}
          >
            {s.every((r) => !r.visits) ? (
              <Empty text="No visits recorded in this period" />
            ) : (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={s} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                    <CartesianGrid vertical={false} stroke={C.grid} />
                    <XAxis dataKey="label" {...axisProps} minTickGap={20} />
                    <YAxis {...axisProps} allowDecimals={false} />
                    <Tooltip cursor={{ stroke: C.axis, strokeWidth: 1 }} content={<ChartTooltip names={{ visits: "Visits", unique: "Unique visitors" }} />} />
                    <Line type="monotone" dataKey="visits" stroke={C.s2} strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: "#fff", strokeWidth: 2 }} />
                    <Line type="monotone" dataKey="unique" stroke={C.s1} strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: "#fff", strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>

        {/* ---------------- Products / categories / status ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card title="Most requested products" subtitle="Units across all enquiries">
            <RankedBars rows={data.topProducts} labelKey="name" valueKey="units" format={(v) => `${num(v)} pcs`} color={C.s1} />
          </Card>
          <Card title="Order value by category" subtitle="Confirmed orders">
            <RankedBars rows={data.categoryRevenue} labelKey="category" valueKey="revenue" format={inrShort} color={C.s1} empty="No confirmed orders yet" />
          </Card>
          <Card title="Enquiries by status" subtitle="Where this period's enquiries are now">
            <RankedBars rows={data.statusBreakdown} labelKey="status" valueKey="count" color={C.s2} />
          </Card>
        </div>

        {/* ---------------- Heatmap + geography ---------------- */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          <Card
            className="xl:col-span-3"
            title="When enquiries arrive"
            subtitle="By day of week and time of day (India time)"
            table={{ columns: ["Day", ...data.heatmap.slots], rows: data.heatmap.rows.map((r) => [r.day, ...r.cells.map(num)]) }}
          >
            {heatMax <= 1 && data.heatmap.rows.every((r) => r.cells.every((c) => !c)) ? (
              <Empty />
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[440px]">
                  <div className="grid gap-[3px]" style={{ gridTemplateColumns: `44px repeat(${data.heatmap.slots.length}, minmax(0,1fr))` }}>
                    <span />
                    {data.heatmap.slots.map((sl) => (
                      <span key={sl} className="text-[10px] text-[#9E9088] text-center pb-1">{sl}</span>
                    ))}
                    {data.heatmap.rows.map((row) => (
                      <div key={row.day} className="contents">
                        <span className="text-[11px] text-[#6B6560] flex items-center">{row.day}</span>
                        {row.cells.map((v, ci) => {
                          const level = v === 0 ? 0 : Math.min(5, Math.ceil((v / heatMax) * 5));
                          return (
                            <div
                              key={ci}
                              title={`${row.day} ${data.heatmap.slots[ci]}: ${v} enquir${v === 1 ? "y" : "ies"}`}
                              className="h-8 rounded-[4px] hover:ring-2 hover:ring-[#1C1C1A]/30 transition-shadow"
                              style={{ background: HEAT[level] }}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-[#9E9088]">
                    Fewer
                    {HEAT.map((h) => (
                      <span key={h} className="w-4 h-3 rounded-[3px]" style={{ background: h }} />
                    ))}
                    More
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card className="xl:col-span-2" title="Enquiries by state" subtitle={data.geoUnknown ? `${data.geoUnknown} without a recognisable address` : "From customer addresses"}>
            <RankedBars rows={data.geography} labelKey="state" valueKey="count" color={C.s4} empty="No addresses to map yet" />
          </Card>
        </div>

        {/* ---------------- Production health ---------------- */}
        <Card
          title="Production health"
          subtitle="All open confirmed orders right now"
          action={
            <Link href="/admin/production" className="inline-flex items-center gap-1 text-xs font-semibold text-[#4A6741] hover:underline">
              Open board <ChevronRight size={13} />
            </Link>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 grid grid-cols-2 gap-3 content-start">
              {[
                { icon: Factory, label: "Open orders", value: num(data.production.open) },
                { icon: AlertTriangle, label: "Overdue", value: num(data.production.overdue), warn: data.production.overdue > 0 },
                { icon: Clock, label: "Avg. production time", value: data.production.avgProductionDays !== null ? `${data.production.avgProductionDays} d` : "—" },
                { icon: CheckCircle2, label: "Finished on time", value: data.production.onTimeRate !== null ? `${data.production.onTimeRate}%` : "—" },
              ].map((t) => (
                <div key={t.label} className={`rounded-xl border p-3.5 ${t.warn ? "border-rose-200 bg-rose-50/60" : "border-[#ECE6DF] bg-[#FCFAF7]"}`}>
                  <p className="text-[11px] text-[#6B6560] inline-flex items-center gap-1.5">
                    <t.icon size={13} className={t.warn ? "text-rose-600" : "text-[#9E9088]"} /> {t.label}
                  </p>
                  <p className={`mt-1.5 text-xl font-semibold tabular-nums ${t.warn ? "text-rose-700" : ""}`} style={{ fontFamily: serif }}>{t.value}</p>
                </div>
              ))}
              <p className="col-span-2 text-[10px] text-[#9E9088]">Time and on-time rate use orders packed in this period.</p>
            </div>
            <div className="lg:col-span-2">
              <p className="text-xs font-semibold text-[#6B6560] mb-2">Orders at each stage</p>
              {data.production.open === 0 ? (
                <Empty text="No open orders" />
              ) : (
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.production.pipeline} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }} barCategoryGap="22%">
                      <CartesianGrid horizontal={false} stroke={C.grid} />
                      <XAxis type="number" {...axisProps} allowDecimals={false} />
                      <YAxis type="category" dataKey="stage" {...axisProps} width={112} interval={0} tick={{ fontSize: 11, fill: C.ink2 }} />
                      <Tooltip cursor={{ fill: "#F6F2EC" }} content={<ChartTooltip names={{ count: "Orders" }} />} />
                      <Bar dataKey="count" fill={C.s1} radius={[0, 4, 4, 0]} maxBarSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-[#6B6560] mb-2">Workshop load</p>
              <RankedBars rows={data.workshopLoad} labelKey="name" valueKey="active" color={C.s1} format={(v) => `${v} active`} empty="No orders assigned" />
            </div>
          </div>
        </Card>

        {/* ---------------- Traffic sources / leads / recent ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card title="Where visitors come from" subtitle={`${num(trafficTotal)} visits`}>
            {trafficTotal === 0 ? (
              <Empty text="No visits recorded" />
            ) : (
              <>
                <div className="flex h-9 rounded-lg overflow-hidden gap-[2px] bg-white" role="img" aria-label="Share of visits by source">
                  {data.trafficSources
                    .filter((t) => t.value > 0)
                    .map((t) => (
                      <div
                        key={t.key}
                        title={`${t.label}: ${t.value} (${Math.round((t.value / trafficTotal) * 100)}%)`}
                        style={{ width: `${(t.value / trafficTotal) * 100}%`, background: TRAFFIC_COLORS[t.key] }}
                        className="h-full first:rounded-l-lg last:rounded-r-lg hover:opacity-85"
                      />
                    ))}
                </div>
                <ul className="mt-4 space-y-2">
                  {data.trafficSources.map((t) => (
                    <li key={t.key} className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-2 text-[#1C1C1A]">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ background: TRAFFIC_COLORS[t.key] }} />
                        {t.label}
                      </span>
                      <span className="tabular-nums text-[#6B6560]">
                        {num(t.value)} <span className="text-[#9E9088]">· {Math.round((t.value / trafficTotal) * 100)}%</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Card>

          <Card
            title="B2B leads by source"
            subtitle={`${num(kpis.leads.value)} leads in this period`}
            action={
              <Link href="/admin/leads" className="text-xs font-semibold text-[#4A6741] hover:underline inline-flex items-center gap-1">
                Leads <ChevronRight size={13} />
              </Link>
            }
          >
            <RankedBars rows={data.leadSources} labelKey="source" valueKey="count" color={C.s3} empty="No leads in this period" />
          </Card>

          <Card
            title="Latest enquiries"
            action={
              <Link href="/admin/orders" className="text-xs font-semibold text-[#4A6741] hover:underline inline-flex items-center gap-1">
                All <ChevronRight size={13} />
              </Link>
            }
          >
            {data.recent.length === 0 ? (
              <Empty text="No enquiries yet" />
            ) : (
              <ul className="divide-y divide-[#F4EFE6] -my-1">
                {data.recent.map((r) => (
                  <li key={r.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{r.name}</p>
                      <p className="text-[11px] text-[#9E9088] font-mono">
                        {r.code} · {fmtDate(r.createdAt)} · {num(r.units)} pcs
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full bg-[#F4EFE6] text-[#4A4540] shrink-0">{r.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* ---------------- Top customers ---------------- */}
        <Card title="Top customers" subtitle="By confirmed order value in this period">
          {data.topCustomers.length === 0 ? (
            <Empty text="No customers in this period" />
          ) : (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm min-w-[560px]">
                <thead className="text-[11px] uppercase tracking-wider text-[#9E9088]">
                  <tr className="border-b border-[#ECE6DF]">
                    <th className="text-left font-semibold py-2 px-1">Customer</th>
                    <th className="text-right font-semibold py-2 px-1">Enquiries</th>
                    <th className="text-right font-semibold py-2 px-1">Orders</th>
                    <th className="text-right font-semibold py-2 px-1">Order value</th>
                    <th className="text-right font-semibold py-2 px-1">Last enquiry</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topCustomers.map((c) => (
                    <tr key={`${c.name}-${c.last}`} className="border-b border-[#F4EFE6] last:border-0">
                      <td className="py-2.5 px-1">
                        <p className="font-medium">{c.name}</p>
                        {c.contact && c.contact !== c.name && <p className="text-[11px] text-[#9E9088]">{c.contact}</p>}
                      </td>
                      <td className="py-2.5 px-1 text-right tabular-nums">{num(c.enquiries)}</td>
                      <td className="py-2.5 px-1 text-right tabular-nums">{num(c.orders)}</td>
                      <td className="py-2.5 px-1 text-right tabular-nums font-semibold">{inr(c.revenue)}</td>
                      <td className="py-2.5 px-1 text-right text-[#6B6560]">{fmtDate(c.last)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

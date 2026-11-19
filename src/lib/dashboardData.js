import connectDb from "@/lib/db";
import Quote from "@/models/quote.model";
import User from "@/models/user.model";
import Product from "@/models/product.model"; // registers model for populate
import Visit from "@/models/visit.model";
import Lead from "@/models/Lead.model";
import CustomDesign from "@/models/customDesign.model";
import Review from "@/models/review.model";
import { Catalog } from "@/models/catalog.model";
import { PRODUCTION_STATUSES, STAGE_ORDER, STAGE_INFO, stageIndex } from "@/lib/trackingStages";
import { LOCATIONS } from "@/content/locations";

void Product;

/* ------------------------------ time (IST) ------------------------------ */
// All bucketing happens in India time, regardless of the server's timezone.
const IST_MS = 330 * 60 * 1000;
const DAY = 86400000;
const toIst = (d) => new Date(new Date(d).getTime() + IST_MS); // read with getUTC*
const fromIst = (y, m, d = 1, h = 0) => new Date(Date.UTC(y, m, d, h) - IST_MS);
const istMidnight = (date) => {
  const t = toIst(date);
  return fromIst(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate());
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const RANGES = {
  today: "Today",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "12m": "Last 12 months",
  all: "All time",
  custom: "Custom",
};

/** Resolves the URL params into current + previous periods and a bucket size. */
export async function resolveRange(params = {}) {
  const legacy = { today: "today", sevenDays: "7d", total: "all" };
  let key = params.range || legacy[params.filter] || "30d";
  if (!RANGES[key]) key = "30d";

  const now = new Date();
  const todayStart = istMidnight(now);
  let start;
  let end = new Date(todayStart.getTime() + DAY); // end of today (IST), exclusive

  if (key === "custom") {
    const f = params.from && new Date(`${params.from}T00:00:00+05:30`);
    const t = params.to && new Date(`${params.to}T00:00:00+05:30`);
    if (f && t && !Number.isNaN(f.getTime()) && !Number.isNaN(t.getTime()) && f <= t) {
      start = f;
      end = new Date(t.getTime() + DAY);
    } else {
      key = "30d";
    }
  }
  if (key === "today") start = todayStart;
  if (key === "7d") start = new Date(todayStart.getTime() - 6 * DAY);
  if (key === "30d") start = new Date(todayStart.getTime() - 29 * DAY);
  if (key === "90d") start = new Date(todayStart.getTime() - 89 * DAY);
  if (key === "12m") {
    const t = toIst(now);
    start = fromIst(t.getUTCFullYear(), t.getUTCMonth() - 11, 1);
  }
  if (key === "all") {
    await connectDb();
    const first = await Quote.findOne().sort({ createdAt: 1 }).select("createdAt").lean();
    const t = toIst(first?.createdAt || now);
    start = fromIst(t.getUTCFullYear(), t.getUTCMonth(), 1);
  }

  const span = end - start;
  const bucket = span <= 2 * DAY ? "hour" : span <= 92 * DAY ? "day" : "month";
  const hasPrev = key !== "all";
  return {
    key,
    label: key === "custom" ? `${params.from} → ${params.to}` : RANGES[key],
    start,
    end,
    prevStart: hasPrev ? new Date(start.getTime() - span) : null,
    prevEnd: hasPrev ? start : null,
    bucket,
    from: toIst(start).toISOString().slice(0, 10),
    to: toIst(new Date(end.getTime() - 1)).toISOString().slice(0, 10),
  };
}

/** Ordered bucket list covering [start, end). */
function makeBuckets(start, end, bucket) {
  const out = [];
  if (bucket === "hour") {
    for (let t = start.getTime(); t < end.getTime(); t += 3600000) {
      const h = toIst(t).getUTCHours();
      out.push({ start: t, end: t + 3600000, label: `${String(h).padStart(2, "0")}:00` });
    }
  } else if (bucket === "day") {
    for (let t = start.getTime(); t < end.getTime(); t += DAY) {
      const i = toIst(t);
      out.push({ start: t, end: t + DAY, label: `${i.getUTCDate()} ${MONTHS[i.getUTCMonth()]}` });
    }
  } else {
    let i = toIst(start);
    let y = i.getUTCFullYear();
    let m = i.getUTCMonth();
    while (fromIst(y, m, 1) < end) {
      const s = fromIst(y, m, 1).getTime();
      const e = fromIst(y, m + 1, 1).getTime();
      out.push({ start: s, end: e, label: `${MONTHS[m]} ${String(y).slice(2)}` });
      m += 1;
      if (m > 11) {
        m = 0;
        y += 1;
      }
    }
  }
  return out;
}

const bucketIndexer = (buckets) => (date) => {
  const t = new Date(date).getTime();
  let lo = 0;
  let hi = buckets.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (t < buckets[mid].start) hi = mid - 1;
    else if (t >= buckets[mid].end) lo = mid + 1;
    else return mid;
  }
  return -1;
};

/* ------------------------------ helpers ------------------------------ */

const STATUS_ORDER = ["Pending", "Quoted", "Sample Sent", "Approved", "In Production", "Shipped", "Delivered"];
const isConfirmed = (q) => PRODUCTION_STATUSES.includes(q.status);

const orderValue = (q) =>
  (q.items || []).reduce((sum, it) => {
    const unit = it.targetBudget || it.productId?.discountPrice || it.productId?.price || 0;
    return sum + unit * (it.quantity || 0);
  }, 0);

const pct = (cur, prev) => {
  if (prev === null || prev === undefined) return null;
  if (prev === 0) return cur === 0 ? 0 : null; // "new" — no meaningful %
  return Math.round(((cur - prev) / prev) * 1000) / 10;
};

// Map free-text addresses to a state using the location dictionary
const STATE_MATCHERS = LOCATIONS.map((l) => ({
  name: l.name,
  words: [l.name, ...l.cities].map((w) => w.toLowerCase().replace(/\s*\(.*?\)/, "")),
}));
const stateOf = (address = "") => {
  const a = ` ${address.toLowerCase()} `;
  for (const s of STATE_MATCHERS) if (s.words.some((w) => w.length > 2 && a.includes(w))) return s.name;
  return null;
};

function periodMetrics(quotes) {
  const confirmed = quotes.filter(isConfirmed);
  const revenue = confirmed.reduce((s, q) => s + orderValue(q), 0);
  const units = confirmed.reduce((s, q) => s + q.items.reduce((n, i) => n + (i.quantity || 0), 0), 0);
  const enquiries = quotes.length;
  return {
    revenue: Math.round(revenue),
    orders: confirmed.length,
    enquiries,
    conversion: enquiries ? Math.round((confirmed.length / enquiries) * 1000) / 10 : 0,
    aov: confirmed.length ? Math.round(revenue / confirmed.length) : 0,
    units,
  };
}

/* ------------------------------ main ------------------------------ */

export async function getDashboardData(params) {
  await connectDb();
  const r = await resolveRange(params);
  const { start, end, prevStart, prevEnd } = r;
  const inCur = (d) => d >= start && d < end;
  const windowStart = prevStart || start;

  const [quotesAll, newUsersCur, newUsersPrev, visitsCurAgg, visitsPrevAgg, leadsCur, leadsPrev, leadsBySource, pending] =
    await Promise.all([
      Quote.find({ createdAt: { $gte: windowStart, $lt: end } })
        .select("createdAt status items customerDetails userId currentStage stageHistory assignedManufacturer targetCompletionDate trackingCode")
        .populate("items.productId", "price discountPrice category name")
        .populate("assignedManufacturer", "workshopDetails firstName lastName")
        .lean(),
      User.countDocuments({ role: "user", createdAt: { $gte: start, $lt: end } }),
      prevStart ? User.countDocuments({ role: "user", createdAt: { $gte: prevStart, $lt: prevEnd } }) : null,
      Visit.aggregate([
        { $match: { createdAt: { $gte: start, $lt: end } } },
        { $group: { _id: null, total: { $sum: 1 }, ips: { $addToSet: "$ipAddress" } } },
        { $project: { total: 1, unique: { $size: "$ips" } } },
      ]),
      prevStart
        ? Visit.aggregate([
            { $match: { createdAt: { $gte: prevStart, $lt: prevEnd } } },
            { $group: { _id: null, total: { $sum: 1 }, ips: { $addToSet: "$ipAddress" } } },
            { $project: { total: 1, unique: { $size: "$ips" } } },
          ])
        : null,
      Lead.countDocuments({ createdAt: { $gte: start, $lt: end } }),
      prevStart ? Lead.countDocuments({ createdAt: { $gte: prevStart, $lt: prevEnd } }) : null,
      Lead.aggregate([
        { $match: { createdAt: { $gte: start, $lt: end } } },
        { $group: { _id: { source: "$source", status: "$status" }, n: { $sum: 1 } } },
      ]),
      Promise.all([
        Quote.countDocuments({ status: "Pending" }),
        CustomDesign.countDocuments({ status: "Pending" }),
        Review.countDocuments({ status: "pending" }),
        Lead.countDocuments({ status: "new" }),
        Catalog.countDocuments({ status: "Pending" }),
        Quote.countDocuments({
          status: { $in: PRODUCTION_STATUSES },
          assignedManufacturer: null,
          currentStage: { $nin: ["dispatched", "delivered"] },
        }),
      ]),
    ]);

  const cur = quotesAll.filter((q) => inCur(new Date(q.createdAt)));
  const prev = prevStart ? quotesAll.filter((q) => new Date(q.createdAt) < start) : null;

  const curM = periodMetrics(cur);
  const prevM = prev ? periodMetrics(prev) : null;
  const vCur = visitsCurAgg[0] || { total: 0, unique: 0 };
  const vPrev = visitsPrevAgg ? visitsPrevAgg[0] || { total: 0, unique: 0 } : null;

  /* ---------- time series ---------- */
  const buckets = makeBuckets(start, end, r.bucket);
  const idx = bucketIndexer(buckets);
  const series = buckets.map((b) => ({ label: b.label, revenue: 0, prevRevenue: null, enquiries: 0, orders: 0, visits: 0, unique: 0 }));

  for (const q of cur) {
    const i = idx(q.createdAt);
    if (i < 0) continue;
    series[i].enquiries += 1;
    if (isConfirmed(q)) {
      series[i].orders += 1;
      series[i].revenue += Math.round(orderValue(q));
    }
  }
  // Previous period aligned bucket-by-bucket (same offset from period start)
  if (prev && prevStart) {
    const shift = start - prevStart;
    for (const s of series) s.prevRevenue = 0;
    for (const q of prev) {
      if (!isConfirmed(q)) continue;
      const i = idx(new Date(new Date(q.createdAt).getTime() + shift));
      if (i >= 0) series[i].prevRevenue += Math.round(orderValue(q));
    }
  }

  const visitBuckets = await Visit.aggregate([
    { $match: { createdAt: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: {
          $dateToString: {
            date: "$createdAt",
            timezone: "Asia/Kolkata",
            format: r.bucket === "hour" ? "%Y-%m-%dT%H" : r.bucket === "day" ? "%Y-%m-%d" : "%Y-%m",
          },
        },
        total: { $sum: 1 },
        ips: { $addToSet: "$ipAddress" },
      },
    },
    { $project: { total: 1, unique: { $size: "$ips" } } },
  ]);
  const keyOf = (t) => {
    const d = toIst(t).toISOString();
    return r.bucket === "hour" ? d.slice(0, 13) : r.bucket === "day" ? d.slice(0, 10) : d.slice(0, 7);
  };
  const vMap = new Map(visitBuckets.map((v) => [v._id, v]));
  buckets.forEach((b, i) => {
    const v = vMap.get(keyOf(b.start));
    if (v) {
      series[i].visits = v.total;
      series[i].unique = v.unique;
    }
  });

  /* ---------- funnel (how far enquiries in this period got) ---------- */
  const reached = (q, status) => STATUS_ORDER.indexOf(q.status) >= STATUS_ORDER.indexOf(status);
  const live = cur.filter((q) => q.status !== "Rejected");
  const funnel = [
    { step: "Enquiries", value: cur.length },
    { step: "Quoted", value: live.filter((q) => reached(q, "Quoted")).length },
    { step: "Approved", value: live.filter((q) => reached(q, "Approved")).length },
    { step: "In production", value: live.filter((q) => reached(q, "In Production")).length },
    { step: "Shipped", value: live.filter((q) => reached(q, "Shipped")).length },
    { step: "Delivered", value: live.filter((q) => reached(q, "Delivered")).length },
  ];

  /* ---------- status breakdown ---------- */
  const statusCounts = {};
  for (const q of cur) statusCounts[q.status] = (statusCounts[q.status] || 0) + 1;
  const statusBreakdown = [...STATUS_ORDER, "Rejected"]
    .map((s) => ({ status: s, count: statusCounts[s] || 0 }))
    .filter((s) => s.count > 0);

  /* ---------- products & categories ---------- */
  const prodMap = new Map();
  const catMap = new Map();
  for (const q of cur) {
    const conf = isConfirmed(q);
    for (const it of q.items || []) {
      const name = it.productName || it.productId?.name || "Custom item";
      const p = prodMap.get(name) || { name, units: 0, enquiries: 0 };
      p.units += it.quantity || 0;
      p.enquiries += 1;
      prodMap.set(name, p);
      if (conf) {
        const cat = it.productId?.category || "Custom / other";
        const unit = it.targetBudget || it.productId?.discountPrice || it.productId?.price || 0;
        catMap.set(cat, (catMap.get(cat) || 0) + unit * (it.quantity || 0));
      }
    }
  }
  const topProducts = [...prodMap.values()].sort((a, b) => b.units - a.units).slice(0, 8);
  const categoryRevenue = [...catMap.entries()]
    .map(([category, revenue]) => ({ category, revenue: Math.round(revenue) }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  /* ---------- geography ---------- */
  const geoMap = new Map();
  let geoUnknown = 0;
  for (const q of cur) {
    const s = stateOf(q.customerDetails?.address);
    if (s) geoMap.set(s, (geoMap.get(s) || 0) + 1);
    else geoUnknown += 1;
  }
  const geography = [...geoMap.entries()].map(([state, count]) => ({ state, count })).sort((a, b) => b.count - a.count).slice(0, 8);

  /* ---------- heatmap: enquiries by weekday × time of day ---------- */
  const SLOTS = ["12–3a", "3–6a", "6–9a", "9–12p", "12–3p", "3–6p", "6–9p", "9–12a"];
  const heat = WEEKDAYS.map((d) => ({ day: d, cells: SLOTS.map(() => 0) }));
  for (const q of cur) {
    const t = toIst(q.createdAt);
    const wd = (t.getUTCDay() + 6) % 7; // Monday = 0
    heat[wd].cells[Math.floor(t.getUTCHours() / 3)] += 1;
  }

  /* ---------- customers ---------- */
  const custMap = new Map();
  for (const q of cur) {
    const key = (q.customerDetails?.email || "").toLowerCase() || String(q._id);
    const c = custMap.get(key) || {
      name: q.customerDetails?.companyName || q.customerDetails?.contactPerson || "—",
      contact: q.customerDetails?.contactPerson || "",
      enquiries: 0,
      orders: 0,
      revenue: 0,
      last: q.createdAt,
    };
    c.enquiries += 1;
    if (isConfirmed(q)) {
      c.orders += 1;
      c.revenue += orderValue(q);
    }
    if (new Date(q.createdAt) > new Date(c.last)) c.last = q.createdAt;
    custMap.set(key, c);
  }
  const topCustomers = [...custMap.values()]
    .map((c) => ({ ...c, revenue: Math.round(c.revenue) }))
    .sort((a, b) => b.revenue - a.revenue || b.enquiries - a.enquiries)
    .slice(0, 6);
  const repeatCustomers = [...custMap.values()].filter((c) => c.enquiries > 1).length;

  /* ---------- production health (all open orders, not range-bound) ---------- */
  const openOrders = await Quote.find({
    status: { $in: PRODUCTION_STATUSES },
    currentStage: { $nin: ["delivered"] },
  })
    .select("currentStage targetCompletionDate assignedManufacturer")
    .populate("assignedManufacturer", "workshopDetails firstName lastName")
    .lean();
  const todayStart = istMidnight(new Date());
  const pipeline = STAGE_ORDER.filter((s) => s !== "delivered").map((s) => ({
    stage: STAGE_INFO[s].label,
    count: openOrders.filter((o) => (o.currentStage || "order_received") === s).length,
  }));
  const overdue = openOrders.filter(
    (o) =>
      o.targetCompletionDate &&
      stageIndex(o.currentStage || "order_received") < stageIndex("packed") &&
      new Date(o.targetCompletionDate) < todayStart
  ).length;

  // Lead time & on-time rate for orders that finished production in this period
  const durations = [];
  let onTime = 0;
  let withTarget = 0;
  for (const q of quotesAll) {
    const hist = q.stageHistory || [];
    const packed = hist.find((h) => h.stage === "packed");
    if (!packed || !inCur(new Date(packed.updatedAt))) continue;
    const begin = hist.find((h) => h.stage === "stem_curing") || hist[0];
    if (begin) durations.push((new Date(packed.updatedAt) - new Date(begin.updatedAt)) / DAY);
    if (q.targetCompletionDate) {
      withTarget += 1;
      if (new Date(packed.updatedAt) <= new Date(new Date(q.targetCompletionDate).getTime() + DAY)) onTime += 1;
    }
  }
  const avgProductionDays = durations.length ? Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 10) / 10 : null;
  const onTimeRate = withTarget ? Math.round((onTime / withTarget) * 100) : null;

  // Workshop load
  const wsMap = new Map();
  for (const o of openOrders) {
    if (!o.assignedManufacturer) continue;
    const m = o.assignedManufacturer;
    const name = m.workshopDetails?.workshopName || `${m.firstName} ${m.lastName}`;
    wsMap.set(name, (wsMap.get(name) || 0) + 1);
  }
  const workshopLoad = [...wsMap.entries()].map(([name, active]) => ({ name, active })).sort((a, b) => b.active - a.active).slice(0, 6);

  /* ---------- traffic sources ---------- */
  const srcAgg = await Visit.aggregate([
    { $match: { createdAt: { $gte: start, $lt: end } } },
    { $group: { _id: "$source", n: { $sum: 1 } } },
  ]);
  const src = { instagram: 0, linkedin: 0, direct: 0, other: 0 };
  for (const s of srcAgg) src[s._id in src ? s._id : "other"] += s.n;
  const trafficSources = [
    { key: "direct", label: "Direct", value: src.direct },
    { key: "instagram", label: "Instagram", value: src.instagram },
    { key: "linkedin", label: "LinkedIn", value: src.linkedin },
    { key: "other", label: "Other", value: src.other },
  ];

  /* ---------- leads ---------- */
  const LEAD_SOURCES = { indiamart: "IndiaMART", exportindia: "ExportersIndia", website: "Website", other: "Other" };
  const leadSrc = {};
  const leadStatus = {};
  for (const l of leadsBySource) {
    const s = LEAD_SOURCES[l._id.source] ? l._id.source : "other";
    leadSrc[s] = (leadSrc[s] || 0) + l.n;
    leadStatus[l._id.status || "new"] = (leadStatus[l._id.status || "new"] || 0) + l.n;
  }
  const leadSources = Object.entries(LEAD_SOURCES)
    .map(([k, label]) => ({ source: label, count: leadSrc[k] || 0 }))
    .sort((a, b) => b.count - a.count);
  const leadsConverted = leadStatus.converted || 0;

  /* ---------- recent ---------- */
  const recent = await Quote.find()
    .sort({ createdAt: -1 })
    .limit(6)
    .select("trackingCode customerDetails.companyName customerDetails.contactPerson status createdAt items.quantity")
    .lean();

  const [pendingQuotes, pendingDesigns, pendingReviews, newLeads, pendingCatalogs, unassigned] = pending;

  return {
    range: { key: r.key, label: r.label, from: r.from, to: r.to, bucket: r.bucket, hasPrev: !!prevStart },
    kpis: {
      revenue: { value: curM.revenue, delta: pct(curM.revenue, prevM?.revenue) },
      orders: { value: curM.orders, delta: pct(curM.orders, prevM?.orders) },
      enquiries: { value: curM.enquiries, delta: pct(curM.enquiries, prevM?.enquiries) },
      conversion: { value: curM.conversion, delta: prevM ? Math.round((curM.conversion - prevM.conversion) * 10) / 10 : null },
      aov: { value: curM.aov, delta: pct(curM.aov, prevM?.aov) },
      units: { value: curM.units, delta: pct(curM.units, prevM?.units) },
      customers: { value: newUsersCur, delta: pct(newUsersCur, newUsersPrev) },
      visitors: { value: vCur.unique, delta: pct(vCur.unique, vPrev?.unique) },
      visits: { value: vCur.total, delta: pct(vCur.total, vPrev?.total) },
      leads: { value: leadsCur, delta: pct(leadsCur, leadsPrev) },
    },
    series,
    funnel,
    statusBreakdown,
    topProducts,
    categoryRevenue,
    geography,
    geoUnknown,
    heatmap: { slots: SLOTS, rows: heat },
    topCustomers: topCustomers.map((c) => ({ ...c, last: new Date(c.last).toISOString() })),
    repeatCustomers,
    production: { pipeline, open: openOrders.length, overdue, avgProductionDays, onTimeRate, unassigned },
    workshopLoad,
    trafficSources,
    leadSources,
    leadsConverted,
    attention: { pendingQuotes, pendingDesigns, pendingReviews, newLeads, pendingCatalogs, unassigned },
    recent: recent.map((q) => ({
      id: String(q._id),
      code: q.trackingCode || "—",
      name: q.customerDetails?.companyName || q.customerDetails?.contactPerson || "—",
      status: q.status,
      units: (q.items || []).reduce((n, i) => n + (i.quantity || 0), 0),
      createdAt: new Date(q.createdAt).toISOString(),
    })),
  };
}

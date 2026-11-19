// Single source of truth for the production / tracking pipeline.
// Safe to import from both client components and server routes (no Node APIs).

export const STAGE_ORDER = [
  "order_received",
  "stem_curing",
  "weaving",
  "quality_inspection",
  "packed",
  "dispatched",
  "delivered",
];

export const STAGE_INFO = {
  order_received: {
    label: "Order Verified",
    title: "Order Received & Verified",
    desc: "Order authenticated and registered into the artisan cooperative queue.",
  },
  stem_curing: {
    label: "Stem Curing",
    title: "Stem Harvesting & Sun Drying",
    desc: "Water hyacinth stalks harvested and sun-cured naturally below 10% moisture.",
  },
  weaving: {
    label: "Hand Weaving",
    title: "Artisan Hand-Weaving in Progress",
    desc: "Master weavers handcrafting your pieces with a traditional twill weave.",
  },
  quality_inspection: {
    label: "QC & Finishing",
    title: "Bio-Enzyme Finish & Quality Check",
    desc: "Organic mould protection applied, followed by dimensional inspection.",
  },
  packed: {
    label: "Packed",
    title: "Packed & Ready for Dispatch",
    desc: "Packed in zero-plastic kraft cartons, awaiting courier pickup.",
  },
  dispatched: {
    label: "Dispatched",
    title: "Dispatched — In Transit",
    desc: "Handed over to the courier and on its way to you.",
  },
  delivered: {
    label: "Delivered",
    title: "Delivered",
    desc: "Successfully delivered. Thank you for choosing KrisluxECO.",
  },
};

// Manufacturers may move an order forward one step at a time, up to "packed".
// Dispatch and delivery are controlled by the admin (they need courier details).
export const MANUFACTURER_LAST_STAGE = "packed";

// Stages that trigger a customer email.
export const NOTIFY_STAGES = ["stem_curing", "dispatched", "delivered"];

export const stageIndex = (stage) => STAGE_ORDER.indexOf(stage);

export const nextStage = (stage) => {
  const i = stageIndex(stage);
  return i >= 0 && i < STAGE_ORDER.length - 1 ? STAGE_ORDER[i + 1] : null;
};

export const isValidStage = (stage) => STAGE_ORDER.includes(stage);

/**
 * Order status that should accompany a stage.
 * Returns null when the stage doesn't imply a status change (order_received),
 * so commercial statuses like "Quoted" / "Approved" are left untouched.
 */
export const statusForStage = (stage) => {
  if (stage === "delivered") return "Delivered";
  if (stage === "dispatched") return "Shipped";
  if (["stem_curing", "weaving", "quality_inspection", "packed"].includes(stage)) return "In Production";
  return null;
};

export const progressPercent = (stage) => {
  const i = stageIndex(stage);
  if (i < 0) return 0;
  return Math.round(((i + 1) / STAGE_ORDER.length) * 100);
};

// Order lifecycle split:
//  - Sales (Orders & Quotes page): Pending → Quoted → Sample Sent → Approved / Rejected
//  - Production (Production page): Approved → In Production → Shipped → Delivered
export const SALES_STATUSES = ["Pending", "Quoted", "Sample Sent", "Approved", "Rejected"];
export const PRODUCTION_STATUSES = ["Approved", "In Production", "Shipped", "Delivered"];

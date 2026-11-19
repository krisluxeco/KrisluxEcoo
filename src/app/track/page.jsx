"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { STAGE_ORDER, STAGE_INFO, progressPercent } from "@/lib/trackingStages";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Leaf,
  Droplets,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const STAGE_ICONS = {
  order_received: Clock,
  stem_curing: Droplets,
  weaving: Sparkles,
  quality_inspection: ShieldCheck,
  packed: Package,
  dispatched: Truck,
  delivered: CheckCircle2,
};

const fmtDateTime = (d) =>
  new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";
  const [codeInput, setCodeInput] = useState(initialCode);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(() => !!initialCode);
  const [error, setError] = useState("");

  const searchTracking = async (codeToSearch) => {
    const code = (codeToSearch || codeInput).trim().toUpperCase();
    if (!code) return;
    window.history.replaceState(null, "", `/track?code=${encodeURIComponent(code)}`);

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(code)}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setTrackingData(data.tracking);
      } else {
        setError(data.message || "Tracking code not found. Please verify your ID.");
        setTrackingData(null);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialCode) return;
    let ignore = false;
    const fetchInitial = async () => {
      try {
        const res = await fetch(`/api/tracking/${encodeURIComponent(initialCode.trim())}`);
        const data = await res.json();
        if (!ignore) {
          if (res.ok && data.success) {
            setTrackingData(data.tracking);
          } else {
            setError(data.message || "Tracking code not found. Please verify your ID.");
            setTrackingData(null);
          }
        }
      } catch {
        if (!ignore) {
          setError("Network error. Please check your connection and try again.");
          setTrackingData(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchInitial();
    return () => {
      ignore = true;
    };
  }, [initialCode]);

  const currentStageIndex = trackingData
    ? STAGE_ORDER.indexOf(trackingData.currentStage)
    : 0;

  const progressPercentage = trackingData ? progressPercent(trackingData.currentStage) : 0;
  const isCancelled = trackingData?.status === "Rejected";
  const history = trackingData ? [...(trackingData.stageHistory || [])].reverse() : [];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141E17] pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4A6741]/10 text-[#4A6741] text-xs font-semibold">
            <Leaf size={14} />
            <span>Traceable Eco-Luxury Pipeline</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1C1A]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#7A7369] max-w-md mx-auto">
            Experience real-time transparency from wetland harvest to artisanal weaving and direct delivery.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="bg-white border border-[#EAE3D6] p-2.5 sm:p-3 rounded-2xl shadow-sm max-w-xl mx-auto flex items-center gap-2">
          <div className="pl-3 text-[#9E9088]">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Enter Tracking ID (e.g. KLX-7QH4M2XA)"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchTracking()}
            className="w-full bg-transparent outline-none text-sm font-mono text-[#1C1C1A] placeholder:text-[#9E9088]"
          />
          <button
            onClick={() => searchTracking()}
            disabled={loading || !codeInput.trim()}
            className="bg-[#1C1C1A] hover:bg-[#4A6741] text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer disabled:opacity-40 shrink-0"
          >
            {loading ? "Locating..." : "Track"}
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5"
          >
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Active Tracking Display */}
        {trackingData && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Top Status Card */}
            <div className="bg-white border border-[#EAE3D6] p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F4EFE6]">
                <div>
                  <span className="text-[11px] font-mono tracking-wider text-[#C29B5D] uppercase font-bold">
                    Tracking ID
                  </span>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-[#1C1C1A] tracking-wider mt-0.5">
                    {trackingData.trackingCode}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:text-right">
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full text-white ${isCancelled ? "bg-rose-600" : "bg-[#4A6741]"}`}>
                    {isCancelled ? "Cancelled" : STAGE_INFO[trackingData.currentStage]?.label || "In Production"}
                  </span>
                  {trackingData.targetCompletionDate && !["dispatched", "delivered"].includes(trackingData.currentStage) && !isCancelled && (
                    <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#EAE3D6] text-[#7A7369]">
                      Production target: {new Date(trackingData.targetCompletionDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  )}
                  {trackingData.carrierDetails?.estimatedDelivery && (
                    <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#EAE3D6] text-[#7A7369]">
                      Est. Delivery: {trackingData.carrierDetails.estimatedDelivery}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-[#7A7369]">
                  <span>Production Progress</span>
                  <span className="font-bold text-[#4A6741]">{progressPercentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#F4EFE6] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#4A6741] to-[#C29B5D] rounded-full"
                  />
                </div>
              </div>

              {/* Milestones Stepper */}
              <ol className="pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {STAGE_ORDER.map((stgKey, index) => {
                  const isCompleted = index <= currentStageIndex;
                  const isCurrent = index === currentStageIndex;
                  const info = STAGE_INFO[stgKey];
                  const Icon = STAGE_ICONS[stgKey];
                  const reachedAt = trackingData.stageHistory?.findLast?.((h) => h.stage === stgKey)?.updatedAt;

                  return (
                    <li
                      key={stgKey}
                      className={`p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? "bg-[#FAF8F5] border-[#4A6741] shadow-xs"
                          : isCompleted
                          ? "bg-white border-[#EAE3D6]"
                          : "bg-gray-50/50 border-gray-100 opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                            isCompleted ? "bg-[#4A6741] text-white" : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          <Icon size={14} />
                        </div>
                        <p className="text-xs font-bold text-[#1C1C1A] leading-tight">{info.label}</p>
                      </div>
                      <p className="text-[11px] text-[#7A7369] leading-relaxed">{info.desc}</p>
                      {isCompleted && reachedAt && (
                        <p className="text-[10px] font-mono text-[#4A6741] mt-2">
                          {new Date(reachedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>

            {isCancelled && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
                <AlertCircle size={16} className="shrink-0" />
                <span>This order has been cancelled. Please contact KrisluxECO if you have any questions.</span>
              </div>
            )}

            {/* Carrier & Shipment Dispatch Card (If Available) */}
            {trackingData.carrierDetails?.trackingNumber && (
              <div className="bg-gradient-to-r from-[#0D140F] to-[#1C261F] text-white p-6 sm:p-7 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#C29B5D]">
                    <Truck size={14} />
                    <span>LOGISTICS CARRIER ASSIGNED</span>
                  </div>
                  <h4 className="text-lg font-bold">
                    {trackingData.carrierDetails.carrierName || "National Express Logistics"} &bull;{" "}
                    <span className="font-mono text-white/90">
                      {trackingData.carrierDetails.trackingNumber}
                    </span>
                  </h4>
                  <p className="text-xs text-white/70">
                    Handed over for air/surface freight dispatch to your destination.
                  </p>
                </div>

                {trackingData.carrierDetails.trackingUrl && (
                  <a
                    href={trackingData.carrierDetails.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#C29B5D] text-[#0D140F] hover:bg-[#D4AD6F] transition-colors shrink-0 shadow-xs"
                  >
                    <span>Track on Courier Site</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            )}

            {/* Update Timeline */}
            {history.length > 0 && (
              <div className="bg-white border border-[#EAE3D6] p-6 rounded-2xl shadow-sm space-y-5">
                <h3 className="text-base font-semibold text-[#1C1C1A]" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                  Order Updates
                </h3>
                <ol className="relative border-l border-[#EAE3D6] ml-2 space-y-6">
                  {history.map((h, i) => (
                    <li key={i} className="ml-5">
                      <span
                        className={`absolute -left-[5px] w-2.5 h-2.5 rounded-full mt-1.5 ${i === 0 ? "bg-[#4A6741] ring-4 ring-[#4A6741]/15" : "bg-[#C29B5D]"}`}
                      />
                      <p className="text-sm font-semibold text-[#1C1C1A]">{h.title}</p>
                      <p className="text-[11px] font-mono text-[#9E9088] mt-0.5">{fmtDateTime(h.updatedAt)}</p>
                      {h.note && <p className="text-xs text-[#5C5650] mt-1.5 leading-relaxed">{h.note}</p>}
                      {h.photoUrl && (
                        <a href={h.photoUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={h.photoUrl} alt="Production progress" className="w-40 h-28 object-cover rounded-lg border border-[#EAE3D6]" />
                        </a>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Order Items Summary */}
            <div className="bg-white border border-[#EAE3D6] p-6 rounded-2xl shadow-sm space-y-4">
              <h3
                className="text-base font-semibold text-[#1C1C1A]"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Artifacts in Production
              </h3>
              <div className="divide-y divide-[#F4EFE6]">
                {trackingData.items?.map((item, i) => (
                  <div key={i} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#4A6741] flex items-center justify-center font-bold text-xs border border-[#EAE3D6]">
                        <Package size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1C1C1A]">
                          {item.productName}
                        </p>
                        <p className="text-[11px] text-[#7A7369]">
                          Handmade natural botanical weave
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-[#FAF7F2] text-[#1C1C1A]">
                      Qty: {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ground Truth Impact Badge */}
            <div className="p-4 rounded-xl bg-[#4A6741]/10 border border-[#4A6741]/20 flex items-center gap-3 text-xs text-[#2E4229]">
              <Leaf size={18} className="text-[#4A6741] shrink-0" />
              <span>
                <strong>Verified Eco-Impact:</strong> This batch utilizes ~100% natural sun-cured water hyacinth from Bihar river basins with zero toxic chemical dyes.
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center pt-20">
          <div className="h-8 w-48 bg-[#EAE3D6] rounded-xl animate-pulse" />
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, Truck, ExternalLink, ArrowRight } from "lucide-react";
import { STAGE_ORDER, STAGE_INFO, stageIndex, progressPercent } from "@/lib/trackingStages";

/** Compact live-tracking summary shown on each order in the customer's profile. */
export default function OrderTrackingStrip({ quote }) {
  const [copied, setCopied] = useState(false);
  if (!quote?.trackingCode) return null;

  const stage = quote.currentStage || "order_received";
  const idx = stageIndex(stage);
  const cancelled = quote.status === "Rejected";
  const latest = quote.stageHistory?.[quote.stageHistory.length - 1];
  const carrier = quote.carrierDetails;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(quote.trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <div className="mb-8 bg-[#FAF7F2] border border-[#ECE6DF] p-5 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-[#9E9088] uppercase tracking-widest font-bold">Tracking ID</span>
          <span className="font-mono font-bold text-sm text-[#1C1C1A] tracking-wider">{quote.trackingCode}</span>
          <button onClick={copy} className="p-1 text-[#9E9088] hover:text-[#1C1C1A]" aria-label="Copy tracking ID">
            {copied ? <Check size={13} className="text-[#4A6741]" /> : <Copy size={13} />}
          </button>
        </div>
        <Link
          href={`/track?code=${encodeURIComponent(quote.trackingCode)}`}
          className="text-[9px] font-bold text-[#4A6741] uppercase tracking-[0.2em] inline-flex items-center gap-1.5 hover:underline"
        >
          Live tracking <ArrowRight size={12} />
        </Link>
      </div>

      {cancelled ? (
        <p className="text-xs text-rose-700">This order has been cancelled.</p>
      ) : (
        <>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#1C1C1A]">{STAGE_INFO[stage]?.title}</span>
              <span className="text-[10px] font-mono text-[#4A6741] font-bold">{progressPercent(stage)}%</span>
            </div>
            <div className="flex items-center gap-1" aria-hidden="true">
              {STAGE_ORDER.map((s, i) => (
                <div
                  key={s}
                  title={STAGE_INFO[s].label}
                  className={`h-1.5 flex-1 rounded-full ${i <= idx ? "bg-[#4A6741]" : "bg-[#E8DDD0]"}`}
                />
              ))}
            </div>
            <div className="hidden sm:flex justify-between mt-1.5">
              {STAGE_ORDER.map((s, i) => (
                <span
                  key={s}
                  className={`text-[9px] uppercase tracking-wider flex-1 text-center ${i <= idx ? "text-[#4A6741] font-bold" : "text-[#B5ABA0]"}`}
                >
                  {STAGE_INFO[s].label}
                </span>
              ))}
            </div>
          </div>

          {latest && (
            <p className="text-xs text-[#6B6560]">
              Last update {new Date(latest.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              {latest.note ? ` — ${latest.note}` : ""}
            </p>
          )}

          {carrier?.trackingNumber && (
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#ECE6DF] px-4 py-3">
              <span className="text-xs text-[#1C1C1A] inline-flex items-center gap-2">
                <Truck size={14} className="text-[#4A6741]" />
                {carrier.carrierName || "Courier"} · <span className="font-mono">{carrier.trackingNumber}</span>
                {carrier.estimatedDelivery && <span className="text-[#9E9088]">· ETA {carrier.estimatedDelivery}</span>}
              </span>
              {carrier.trackingUrl && (
                <a
                  href={carrier.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#1C1C1A] inline-flex items-center gap-1 hover:text-[#4A6741]"
                >
                  Courier site <ExternalLink size={11} />
                </a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

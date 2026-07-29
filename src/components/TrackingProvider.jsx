"use client";

import { useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const TRACKING_INTERVAL = 30; // seconds

function TrackSource() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const trackSource = async () => {
      // Check if we've already tracked this session
      if (sessionStorage.getItem("tracked_visit")) return;

      let source = "direct";
      
      // Check URL for UTM parameters
      const utmSource = searchParams?.get("utm_source")?.toLowerCase();
      
      if (utmSource) {
        if (utmSource.includes("instagram") || utmSource.includes("ig")) source = "instagram";
        else if (utmSource.includes("linkedin") || utmSource.includes("li")) source = "linkedin";
        else source = "other";
      } else {
        // Fallback to referrer check
        const referrer = document.referrer.toLowerCase();
        if (referrer.includes("instagram.com")) source = "instagram";
        else if (referrer.includes("linkedin.com")) source = "linkedin";
        // if no referrer, it stays 'direct'
      }

      // Mark as tracked in this session immediately to prevent race conditions
      sessionStorage.setItem("tracked_visit", "true");
      sessionStorage.setItem("visit_source", source);

      try {
        await fetch("/api/analytics/track-source", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source }),
        });
      } catch (error) {
        console.error("Failed to track source", error);
      }
    };

    trackSource();
  }, [searchParams]);

  return null;
}

export default function TrackingProvider({ children }) {
  const { status } = useSession();

  // Active Time Tracking (For authenticated users)
  useEffect(() => {
    if (status !== "authenticated") return;

    const intervalId = setInterval(async () => {
      if (document.visibilityState === "visible") {
        try {
          await fetch("/api/user/track-time", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ seconds: TRACKING_INTERVAL }),
            keepalive: true 
          });
        } catch (error) {
          // Silent fail for analytics
        }
      }
    }, TRACKING_INTERVAL * 1000);

    return () => clearInterval(intervalId);
  }, [status]);

  return (
    <>
      <Suspense fallback={null}>
        <TrackSource />
      </Suspense>
      {children}
    </>
  );
}

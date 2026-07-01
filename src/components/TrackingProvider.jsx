"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

const TRACKING_INTERVAL = 30; // seconds

export default function TrackingProvider({ children }) {
  const { status } = useSession();

  useEffect(() => {
    // Only track authenticated users
    if (status !== "authenticated") return;

    const intervalId = setInterval(async () => {
      // Only track if document is visible (user is actively looking at the tab)
      if (document.visibilityState === "visible") {
        try {
          await fetch("/api/user/track-time", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ seconds: TRACKING_INTERVAL }),
            // keepalive ensures the request fires even if they are navigating away
            keepalive: true 
          });
        } catch (error) {
          // Silent fail for analytics
        }
      }
    }, TRACKING_INTERVAL * 1000);

    return () => clearInterval(intervalId);
  }, [status]);

  return <>{children}</>;
}

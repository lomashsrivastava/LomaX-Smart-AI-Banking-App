"use client";

import { useEffect } from "react";

/**
 * Registers the LomaX Service Worker for PWA offline support.
 * Placed in the root layout so it runs once per session.
 */
export function PWARegistration() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // Delay registration until after page load for performance
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.log("[LomaX PWA] Service Worker registered:", registration.scope);

          // Handle updates — notify user a refresh is available
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (!newWorker) return;
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                console.log("[LomaX PWA] New version available. Refresh to update.");
              }
            });
          });
        })
        .catch((error) => {
          console.error("[LomaX PWA] Service Worker registration failed:", error);
        });
    });
  }, []);

  return null;
}

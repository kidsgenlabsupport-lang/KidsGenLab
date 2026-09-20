"use client";

import { useEffect } from "react";

export function getActiveAffiliateRef(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("kidzmoney_ref") || sessionStorage.getItem("kidzmoney_ref");
}

export default function AffiliateTracker() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref") || params.get("aff") || params.get("affiliate") || params.get("creator") || params.get("utm_source");
      
      if (ref) {
        const cleanRef = ref.trim().toLowerCase();
        localStorage.setItem("kidzmoney_ref", cleanRef);
        sessionStorage.setItem("kidzmoney_ref", cleanRef);
        // Also set cookie for 30-day attribution window
        document.cookie = `kidzmoney_ref=${encodeURIComponent(cleanRef)};path=/;max-age=2592000;SameSite=Lax`;
        console.log("🔗 Affiliate / Creator referral tag captured:", cleanRef);
      }
    } catch (err) {
      console.warn("Affiliate tracker error:", err);
    }
  }, []);

  return null;
}

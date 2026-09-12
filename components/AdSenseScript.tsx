"use client";

import { useEffect } from "react";

const CONSENT_KEY = "miniHesapCerezTercihi";

export default function AdSenseScript() {
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
    if (!clientId) return;

    function load() {
      if (document.querySelector('script[data-minihesap-adsense="true"]')) return;

      const script = document.createElement("script");
      script.async = true;
      script.crossOrigin = "anonymous";
      script.dataset.minihesapAdsense = "true";
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      document.head.appendChild(script);
    }

    try {
      if (localStorage.getItem(CONSENT_KEY) === "kabul") load();
    } catch {
      return;
    }

    function onConsent(event: Event) {
      if ((event as CustomEvent<string>).detail === "kabul") load();
    }

    window.addEventListener("minihesap-cerez", onConsent);
    return () => window.removeEventListener("minihesap-cerez", onConsent);
  }, []);

  return null;
}
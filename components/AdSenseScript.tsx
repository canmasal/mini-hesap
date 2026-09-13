"use client";

import { useEffect } from "react";

import { ADSENSE_CLIENT_ID as clientId } from "@/lib/adsense";

const CONSENT_KEY = "miniHesapCerezTercihi";

export default function AdSenseScript() {
  useEffect(() => {

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
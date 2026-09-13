"use client";

import { useEffect } from "react";

const CONSENT_KEY = "miniHesapCerezTercihi";

/** Google Analytics 4 ölçüm kimliği; ortam değişkeniyle değiştirilebilir. */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-CLPRJW4PT";

type GtagWindow = typeof window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

/**
 * Google Analytics yalnızca ziyaretçi çerezleri kabul ettiğinde yüklenir.
 * Sayfa geçişleri GA4'ün "geliştirilmiş ölçüm" ayarındaki tarayıcı geçmişi
 * olaylarıyla otomatik izlenir.
 */
export default function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    function load() {
      if (document.querySelector('script[data-minihesap-ga="true"]')) return;

      const w = window as GtagWindow;
      w.dataLayer = w.dataLayer || [];
      w.gtag = function gtag() {
        // gtag, arguments nesnesinin kendisini bekler
        // eslint-disable-next-line prefer-rest-params
        w.dataLayer!.push(arguments);
      };
      w.gtag("js", new Date());
      w.gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });

      const script = document.createElement("script");
      script.async = true;
      script.dataset.minihesapGa = "true";
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);
    }

    try {
      if (localStorage.getItem(CONSENT_KEY) === "kabul") load();
    } catch {
      /* Site verisi engelliyse onay olayı beklenir */
    }

    function onConsent(event: Event) {
      if ((event as CustomEvent<string>).detail === "kabul") load();
    }

    window.addEventListener("minihesap-cerez", onConsent);
    return () => window.removeEventListener("minihesap-cerez", onConsent);
  }, []);

  return null;
}

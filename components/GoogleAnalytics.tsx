"use client";

import { useEffect } from "react";

const CONSENT_KEY = "miniHesapCerezTercihi";

/** Google Analytics 4 ölçüm kimliği; ortam değişkeniyle değiştirilebilir. */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-CLPRJW4PT";

/**
 * <head> içine konan Google etiketi (Consent Mode v2).
 *
 * Etiket her sayfada HTML'de bulunur; böylece Google'ın kurulum kontrolü
 * etiketi algılar. Onay varsayılan olarak "reddedildi" başlar: ziyaretçi
 * çerezleri kabul edene kadar analitik ve reklam çerezi yazılmaz. Daha önce
 * kabul etmiş ziyaretçide onay, etiket yüklenmeden hemen önce açılır.
 */
export function GoogleTagHead() {
  if (!GA_MEASUREMENT_ID) return null;

  const init = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
try {
  if (localStorage.getItem('${CONSENT_KEY}') === 'kabul') {
    gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted'
    });
  }
} catch (e) {}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');
`;

  return (
    <>
      {/* Google tag (gtag.js) */}
      <script dangerouslySetInnerHTML={{ __html: init }} />
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
    </>
  );
}

type GtagWindow = typeof window & { gtag?: (...args: unknown[]) => void };

/** Çerez bandındaki seçimi Google etiketine onay güncellemesi olarak iletir. */
export default function GoogleAnalytics() {
  useEffect(() => {
    function onConsent(event: Event) {
      const granted = (event as CustomEvent<string>).detail === "kabul";
      const value = granted ? "granted" : "denied";

      (window as GtagWindow).gtag?.("consent", "update", {
        ad_storage: value,
        ad_user_data: value,
        ad_personalization: value,
        analytics_storage: value,
      });
    }

    window.addEventListener("minihesap-cerez", onConsent);
    return () => window.removeEventListener("minihesap-cerez", onConsent);
  }, []);

  return null;
}

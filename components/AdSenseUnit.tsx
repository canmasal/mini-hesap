"use client";

import { useEffect, useRef } from "react";

import { ADSENSE_CLIENT_ID } from "@/lib/adsense";

export default function AdSenseUnit({ slot }: { slot: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    function pushAd() {
      if (!ref.current) return;
      try {
        const ads = (window as typeof window & { adsbygoogle?: unknown[] }).adsbygoogle || [];
        ads.push({});
        (window as typeof window & { adsbygoogle?: unknown[] }).adsbygoogle = ads;
      } catch {
        /* Reklam sağlayıcısı yüklenemezse sayfa akışı bozulmamalı. */
      }
    }

    /* Tarayıcı site verisini engellediğinde localStorage erişimi hata
       fırlatır; bu durumda onay beklenir, bileşen çökmez. */
    try {
      if (localStorage.getItem("miniHesapCerezTercihi") === "kabul") {
        window.setTimeout(pushAd, 250);
      }
    } catch {
      /* onay olayı beklenir */
    }

    function onConsent(event: Event) {
      if ((event as CustomEvent<string>).detail === "kabul") {
        window.setTimeout(pushAd, 250);
      }
    }

    window.addEventListener("minihesap-cerez", onConsent);
    return () => window.removeEventListener("minihesap-cerez", onConsent);
  }, []);

  return (
    <ins
      ref={ref as React.RefObject<HTMLModElement>}
      className="adsbygoogle"
      style={{ display: "block", minHeight: 90, width: "100%" }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
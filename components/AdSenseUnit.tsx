"use client";

import { useEffect, useRef } from "react";

import { ADSENSE_CLIENT_ID } from "@/lib/adsense";

const CONSENT_KEY = "miniHesapCerezTercihi";

type AdsWindow = typeof window & {
  adsbygoogle?: unknown[] & { requestNonPersonalizedAds?: number };
};

function hasConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY) === "kabul";
  } catch {
    return false;
  }
}

/**
 * Tek bir AdSense reklam birimi.
 *
 * Eskiden reklam yalnızca ziyaretçi çerez bandında "Tümünü kabul et" dedikten
 * sonra isteniyordu. Bandı kapatmayan ya da "Yalnızca zorunlu" diyen
 * ziyaretçilerin (çoğunluk) hiçbirine reklam gösterilmiyor, alanlar boş
 * kalıyordu. Artık reklam her ziyaretçi için istenir:
 *  - onay varsa kişiselleştirilmiş,
 *  - onay yoksa kişiselleştirilmemiş reklam (requestNonPersonalizedAds).
 * Google Consent Mode v2 sinyalleri (GoogleTagHead) ayrıca AdSense'e iletilir.
 */
export default function AdSenseUnit({ slot }: { slot: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.getAttribute("data-adsbygoogle-status")) return;

    try {
      const w = window as AdsWindow;
      const ads: NonNullable<AdsWindow["adsbygoogle"]> = w.adsbygoogle || [];
      w.adsbygoogle = ads;
      ads.requestNonPersonalizedAds = hasConsent() ? 0 : 1;
      ads.push({});
    } catch {
      /* Reklam sağlayıcısı yüklenemezse (reklam engelleyici vb.) sayfa akışı bozulmamalı. */
    }
  }, []);

  return (
    <ins
      ref={ref as React.RefObject<HTMLModElement>}
      className="adsbygoogle"
      style={{ display: "block", width: "100%" }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

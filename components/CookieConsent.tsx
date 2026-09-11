"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "miniHesapCerezTercihi";

type Choice = "kabul" | "reddet";

/**
 * Çerez onay bandı.
 *
 * Reklam ve ölçümleme script'leri yalnızca kullanıcı "kabul" dedikten
 * sonra yüklenmelidir. Tercih tarayıcıda saklanır; sunucuya gönderilmez.
 *
 * Seçimi başka bileşenlerin okuyabilmesi için "minihesap-cerez" adlı
 * bir CustomEvent yayınlanır.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) setVisible(true);
    } catch {
      /* Depolama kapalıysa bandı göstermeyelim, tekrar tekrar çıkmasın. */
    }
  }, []);

  function decide(choice: Choice) {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* Tercih saklanamasa da kullanıcıyı engellememeliyiz. */
    }

    window.dispatchEvent(
      new CustomEvent("minihesap-cerez", { detail: choice })
    );

    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Çerez tercihi"
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 300,
        maxWidth: 880,
        margin: "0 auto",
        padding: 18,
        borderRadius: "var(--r-md)",
        background: "#fff",
        border: "1px solid var(--line)",
        boxShadow: "0 18px 45px rgba(16, 35, 26, .18)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 14,
      }}
    >
      <p
        style={{
          flex: "1 1 320px",
          margin: 0,
          fontSize: 14,
          lineHeight: 1.65,
          color: "var(--ink-soft)",
        }}
      >
        Siteyi çalıştırmak için zorunlu çerezler kullanıyoruz. İzin
        verirseniz reklam ve ölçümleme çerezleri de kullanılır. Hesaplama
        araçlarına girdiğiniz veriler hiçbir durumda sunucuya gönderilmez.{" "}
        <Link href="/gizlilik" style={{ fontWeight: 700, textDecoration: "underline" }}>
          Gizlilik Politikası
        </Link>
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <button
          type="button"
          className="btn btn-outline"
          style={{ padding: "11px 18px", fontSize: 14 }}
          onClick={() => decide("reddet")}
        >
          Yalnızca zorunlu
        </button>

        <button
          type="button"
          className="btn btn-green"
          style={{ padding: "11px 18px", fontSize: 14 }}
          onClick={() => decide("kabul")}
        >
          Tümünü kabul et
        </button>
      </div>
    </div>
  );
}

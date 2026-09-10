"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Sayfa hatası:", error);
  }, [error]);

  return (
    <main className="page">
      <div className="container">
        <div className="section-head">
          <div style={{ fontSize: 60 }} aria-hidden="true">
            ⚠️
          </div>

          <p className="eyebrow">BİR SORUN OLUŞTU</p>
          <h1 style={{ marginTop: 6 }}>Sayfa yüklenemedi</h1>

          <p className="page-lead" style={{ margin: "14px auto 0" }}>
            Beklenmeyen bir hata oluştu. Tekrar denemek işe yaramazsa daha sonra
            ziyaret edebilir veya bize bildirebilirsiniz.
          </p>

          {error.digest && (
            <p style={{ color: "var(--muted)", fontSize: 13 }}>
              Hata kodu: <code>{error.digest}</code>
            </p>
          )}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
              marginTop: 22,
            }}
          >
            <button className="btn btn-green" type="button" onClick={reset}>
              Tekrar dene
            </button>
            <Link className="btn btn-outline" href="/">
              Ana sayfa
            </Link>
            <Link className="btn btn-outline" href="/iletisim">
              Hatayı bildir
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

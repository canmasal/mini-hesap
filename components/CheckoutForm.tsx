"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  productSlug: string;
  productTitle: string;
  price: number;
  paymentsEnabled: boolean;
};

export default function CheckoutForm({
  productSlug,
  productTitle,
  price,
  paymentsEnabled,
}: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!terms) {
      setError(
        "Ön bilgilendirme formu ve mesafeli satış sözleşmesini onaylamanız gerekir."
      );
      return;
    }

    setBusy(true);

    try {
      const res = await fetch("/api/siparis/olustur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug, fullName, email, phone, terms }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? "Sipariş oluşturulamadı.");
        setBusy(false);
        return;
      }

      const c = data.checkout;

      if (c?.kind === "redirect" || c?.kind === "test") {
        window.location.href = c.url;
        return;
      }

      if (c?.kind === "form") {
        /* Sağlayıcının kendi formu: sayfaya gömülüp otomatik gönderilir */
        const holder = document.createElement("div");
        holder.innerHTML = c.html;
        document.body.appendChild(holder);
        holder.querySelector("form")?.submit();
        return;
      }

      setError("Ödeme sayfası açılamadı.");
      setBusy(false);
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
      setBusy(false);
    }
  }

  if (!paymentsEnabled) {
    return (
      <div className="notice notice-warn" style={{ marginTop: 28 }}>
        <strong>Online ödeme henüz aktif değil.</strong> Bu ürünü satın almak
        için{" "}
        <Link href="/iletisim" style={{ fontWeight: 700 }}>
          iletişim sayfasından
        </Link>{" "}
        bize yazın; ödeme ve teslimat için size dönüş yapalım.
      </div>
    );
  }

  return (
    <form className="calc-box" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label className="field" htmlFor="co-name">
          Ad Soyad *
          <input
            id="co-name"
            value={fullName}
            autoComplete="name"
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Adınız Soyadınız"
            required
          />
        </label>

        <label className="field" htmlFor="co-mail">
          E-posta *
          <input
            id="co-mail"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@mail.com"
            required
          />
          <span className="field-hint">
            İndirme bağlantısı bu adrese gönderilir.
          </span>
        </label>
      </div>

      <label className="field" htmlFor="co-tel" style={{ marginTop: 18 }}>
        Telefon (isteğe bağlı)
        <input
          id="co-tel"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="05xx xxx xx xx"
        />
      </label>

      <div
        style={{
          marginTop: 22,
          padding: 16,
          borderRadius: "var(--r-md)",
          background: "var(--surface-mint)",
          border: "1px solid var(--brand-line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontWeight: 700 }}>{productTitle}</span>
        <strong style={{ fontSize: 22, color: "var(--brand-deep)" }}>
          {price.toLocaleString("tr-TR")} ₺
        </strong>
      </div>

      <label
        style={{
          display: "flex",
          gap: 10,
          marginTop: 18,
          fontSize: 14,
          lineHeight: 1.6,
          alignItems: "flex-start",
        }}
      >
        <input
          type="checkbox"
          checked={terms}
          onChange={(e) => setTerms(e.target.checked)}
          style={{ marginTop: 3 }}
        />
        <span>
          <Link
            href="/on-bilgilendirme"
            target="_blank"
            style={{ fontWeight: 700, textDecoration: "underline" }}
          >
            Ön Bilgilendirme Formu
          </Link>{" "}
          ve{" "}
          <Link
            href="/mesafeli-satis-sozlesmesi"
            target="_blank"
            style={{ fontWeight: 700, textDecoration: "underline" }}
          >
            Mesafeli Satış Sözleşmesi
          </Link>
          ’ni okudum ve onaylıyorum. Dijital ürün olduğu için indirme
          başladıktan sonra cayma hakkımın sona erdiğini kabul ediyorum.
        </span>
      </label>

      {error && (
        <div className="notice notice-warn" role="alert">
          {error}
        </div>
      )}

      <button
        className="btn btn-green"
        type="submit"
        disabled={busy}
        style={{ marginTop: 20, width: "100%", padding: 15, fontSize: 16 }}
      >
        {busy ? "Ödeme sayfası açılıyor..." : "Güvenli Ödemeye Geç →"}
      </button>

      <p className="field-hint" style={{ marginTop: 14 }}>
        Kart bilgileriniz MiniHesap sunucularına hiçbir zaman gelmez; ödeme
        sağlayıcının güvenli sayfasında girilir.
      </p>
    </form>
  );
}

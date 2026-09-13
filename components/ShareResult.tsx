"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hesaplama sonucunu kopyalama ve paylaşma çubuğu.
 *
 * Tek tek her hesaplayıcıya bağlanmak yerine, sayfadaki hesaplama kutusunu
 * izler: sonuç satırları oluştuğunda görünür, satırları "Etiket: Değer"
 * metnine çevirir. Ortak ResultRow bileşeni satırlarını data-share-row ile
 * işaretler; işaretsiz eski hesaplayıcılarda satır yapısından çıkarım yapılır.
 */
export default function ShareResult({
  toolTitle,
  path,
  targetId,
}: {
  toolTitle: string;
  /** Aracın site içi yolu, paylaşım metnine bağlantı olarak eklenir */
  path: string;
  /** İzlenecek hesaplama alanının id'si */
  targetId: string;
}) {
  const [lines, setLines] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [canNativeShare, setCanNativeShare] = useState(false);
  const statusTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && "share" in navigator);

    const root = document.getElementById(targetId);
    if (!root) return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setLines(extractLines(root)));
    };

    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [targetId]);

  useEffect(() => () => window.clearTimeout(statusTimer.current), []);

  if (lines.length === 0) return null;

  const url = `${window.location.origin}${path}`;
  const text = `${toolTitle} sonucum:\n${lines.join("\n")}\n\nSen de hesapla: ${url}`;

  function flash(message: string) {
    setStatus(message);
    window.clearTimeout(statusTimer.current);
    statusTimer.current = window.setTimeout(() => setStatus(""), 2500);
  }

  async function writeClipboard(value: string, done: string) {
    try {
      await navigator.clipboard.writeText(value);
      flash(done);
    } catch {
      /* Pano izni yoksa eski yöntemle kopyalanır */
      const area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      flash(ok ? done : "Kopyalanamadı, metni elle seçin.");
    }
  }

  const copy = () => writeClipboard(text, "Sonuç kopyalandı ✓");
  const copyLink = () => writeClipboard(url, "Bağlantı kopyalandı ✓");

  async function nativeShare() {
    try {
      await navigator.share({ title: `${toolTitle} sonucum`, text, url });
    } catch {
      /* Kullanıcı paylaşımı kapattıysa sessizce geçilir */
    }
  }

  return (
    <div className="share-result" aria-label="Sonucu paylaş">
      <p className="share-result__title">Sonucunu paylaş</p>

      <div className="share-result__actions">
        <button type="button" className="btn" onClick={copy}>
          📋 Sonucu Kopyala
        </button>

        <a
          className="btn"
          href={`https://wa.me/?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>

        <a
          className="btn"
          href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
            `${toolTitle} sonucum:\n${lines.join("\n")}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Telegram
        </a>

        <button type="button" className="btn" onClick={copyLink}>
          🔗 Bağlantıyı Kopyala
        </button>

        {canNativeShare && (
          <button type="button" className="btn" onClick={nativeShare}>
            Paylaş…
          </button>
        )}
      </div>

      <p className="share-result__status" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

/** Hesaplama alanındaki sonuç satırlarını "Etiket: Değer" metnine çevirir. */
function extractLines(root: HTMLElement): string[] {
  const clean = (value: string | null | undefined) =>
    (value ?? "").replace(/\s+/g, " ").trim();

  const marked = root.querySelectorAll<HTMLElement>("[data-share-row]");
  if (marked.length > 0) {
    return [...marked]
      .map((row) => {
        const label = clean(row.querySelector("[data-share-label]")?.textContent);
        const value = clean(row.querySelector("[data-share-value]")?.textContent);
        return label && value ? `${label}: ${value}` : "";
      })
      .filter(Boolean);
  }

  /* İşaretsiz satırlar: form ve açıklama alanları dışındaki her kalın
     değer, bulunduğu satırın geri kalan metniyle eşleştirilir. */
  const seen = new Set<string>();
  const result: string[] = [];

  root.querySelectorAll("strong").forEach((strong) => {
    if (strong.closest("label, button, summary, details, .notice, form, [data-share-ignore]")) return;

    const row = strong.parentElement;
    if (!row || row === root) return;

    const value = clean(strong.textContent);
    const label = clean(row.textContent?.replace(strong.textContent ?? "", ""));

    if (!value || !label || label.length > 80 || !/\d/.test(value)) return;

    const line = `${label}: ${value}`;
    if (!seen.has(line)) {
      seen.add(line);
      result.push(line);
    }
  });

  return result.slice(0, 12);
}

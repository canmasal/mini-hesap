"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "minihesap-sponsor-reklam-kapatildi";

export default function SponsorBanner() {
  const [visible, setVisible] = useState(false);
  const [imageMissing, setImageMissing] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem(STORAGE_KEY) !== "1");
  }, []);

  function close() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <section className="sponsor-banner" aria-label="Sponsor reklamı">
      <div className="container sponsor-banner-inner">
        <button type="button" className="sponsor-close" onClick={close} aria-label="Reklamı kapat">
          ×
        </button>
        {imageMissing ? (
          <Link className="sponsor-missing" href="/iletisim?konu=reklam">
            Reklam vermek için iletişime geçiniz
          </Link>
        ) : (
          <a href="https://wa.me/905355614330" target="_blank" rel="noopener noreferrer" className="sponsor-image-link">
            <Image
              src="/serdar-kurtoglu-reklam.png"
              alt="Serdar Kurtoğlu Elektrik ve Elektronik hizmetleri reklamı"
              width={1200}
              height={1200}
              priority
              onError={() => setImageMissing(true)}
            />
          </a>
        )}
      </div>
    </section>
  );
}
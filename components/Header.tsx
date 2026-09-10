"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hesaplamalar", label: "Hesaplamalar" },
  { href: "/borc-takip", label: "Borç Takip" },
  { href: "/on-muhasebe", label: "Ön Muhasebe" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  /* Sayfa değişince mobil menüyü kapat */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* Escape ile kapat */
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo" aria-label="MiniHesap ana sayfa">
          Mini<span>Hesap</span>
        </Link>

        <nav className="nav" aria-label="Ana menü">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link href="/hesaplamalar" className="btn btn-green">
            Hemen Hesapla
          </Link>

          <button
            type="button"
            className="nav-toggle"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          >
            <span className="nav-toggle-bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={open ? "mobile-nav is-open" : "mobile-nav"}
      >
        <div className="container">
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/hesaplamalar" className="btn btn-green">
            Hemen Hesapla
          </Link>
        </div>
      </div>
    </header>
  );
}

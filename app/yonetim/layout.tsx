import type { Metadata } from "next";

import "./yonetim.css";

/* Yönetim paneli arama motorlarına tamamen kapalıdır ve her istekte yeniden üretilir. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Yönetim",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <main className="admin">{children}</main>;
}

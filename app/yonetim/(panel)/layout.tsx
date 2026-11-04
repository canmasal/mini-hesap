import Link from "next/link";

import { logoutAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <>
      <nav className="admin-nav" aria-label="Yönetim menüsü">
        <Link href="/yonetim">Özet</Link>
        <Link href="/yonetim/dosya?yol=data%2Fparameters.ts">Resmî rakamlar</Link>
        <Link href="/yonetim/icerik">İçerik ve SEO</Link>
        <Link href="/yonetim/siparisler">Siparişler</Link>
        <Link href="/yonetim/talepler">Program talepleri</Link>
        <form action={logoutAction}>
          <button className="admin-btn ghost small" type="submit">Çıkış</button>
        </form>
      </nav>
      {children}
    </>
  );
}

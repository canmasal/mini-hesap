import { redirect } from "next/navigation";

import { loginAction } from "@/lib/admin/actions";
import { adminEnabled, isAdmin } from "@/lib/admin/auth";

const ERRORS: Record<string, string> = {
  sifre: "Şifre hatalı.",
  bekle: "Çok fazla hatalı deneme. 15 dakika sonra tekrar deneyin.",
  kapali: "Panel henüz etkin değil.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ hata?: string }>;
}) {
  if (await isAdmin()) redirect("/yonetim");
  const { hata } = await searchParams;

  return (
    <div className="admin-login">
      <h1>Yönetim paneli</h1>
      <p className="admin-lead">MiniHesap site yönetimi.</p>

      {!adminEnabled() ? (
        <div className="admin-alert warn">
          Panel kapalı. Vercel proje ayarlarında <code>ADMIN_PANEL_PASSWORD</code> ortam
          değişkenine en az 12 karakterlik bir şifre girip siteyi yeniden yayınlayın.
        </div>
      ) : (
        <form action={loginAction} className="admin-box">
          {hata && ERRORS[hata] && <div className="admin-alert err">{ERRORS[hata]}</div>}
          <label htmlFor="sifre">Şifre</label>
          <input id="sifre" name="sifre" type="password" autoComplete="current-password" required autoFocus />
          <button className="admin-btn" type="submit">Giriş yap</button>
        </form>
      )}
    </div>
  );
}

import Link from "next/link";

import { requireAdmin } from "@/lib/admin/auth";
import { EDITABLE_FILES, FILE_GROUPS } from "@/lib/admin/files";

export default async function AdminContentPage() {
  await requireAdmin();

  return (
    <>
      <h1>İçerik ve SEO</h1>
      <p className="admin-lead">
        Düzenlemek istediğiniz bölümü seçin. Formül ve tasarım kodu burada yer almaz; yalnızca metin
        ve rakamlar değiştirilir.
      </p>

      {FILE_GROUPS.map((group) => (
        <section key={group}>
          <h2>{group}</h2>
          <div className="admin-grid">
            {EDITABLE_FILES.filter((f) => f.group === group).map((f) => (
              <Link key={f.path} className="admin-tile" href={`/yonetim/dosya?yol=${encodeURIComponent(f.path)}`}>
                <strong>{f.title}</strong>
                <span>{f.description}</span>
                <span className="admin-code">{f.path}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

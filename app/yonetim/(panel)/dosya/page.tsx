import Link from "next/link";
import { notFound } from "next/navigation";

import FieldEditor, { type EditorField } from "@/components/admin/FieldEditor";
import { saveRawAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { findEditableFile, visibleFields } from "@/lib/admin/files";
import { githubEnabled, readRepoFile } from "@/lib/admin/github";
import { extractFields } from "@/lib/admin/literals";

export default async function AdminFilePage({
  searchParams,
}: {
  searchParams: Promise<{ yol?: string; mod?: string; hata?: string; kaydedildi?: string }>;
}) {
  await requireAdmin();
  const { yol = "", mod, hata, kaydedildi } = await searchParams;

  const file = findEditableFile(yol);
  if (!file) notFound();

  const advanced = mod === "gelismis";
  const base = `/yonetim/dosya?yol=${encodeURIComponent(file.path)}`;

  if (!githubEnabled()) {
    return (
      <>
        <h1>{file.title}</h1>
        <div className="admin-alert warn">
          Düzenleme için Vercel ortam değişkenlerine <code>GITHUB_TOKEN</code> eklenmeli.
        </div>
      </>
    );
  }

  let content = "";
  let sha = "";
  let loadError = "";
  try {
    const repoFile = await readRepoFile(file.path);
    content = repoFile.content;
    sha = repoFile.sha;
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Dosya okunamadı.";
  }

  const fields: EditorField[] = loadError
    ? []
    : visibleFields(file, extractFields(content)).map((f) => ({
        start: f.start,
        kind: f.kind,
        value: f.value,
        path: file.onlyUnder ? f.path.slice(1) : f.path,
        line: f.line,
        hint: f.hint,
        section: f.section,
      }));

  return (
    <>
      <p className="admin-field-hint" style={{ margin: 0 }}>
        <Link href="/yonetim/icerik">← İçerik ve SEO</Link> · {file.group}
      </p>
      <h1>{file.title}</h1>
      <p className="admin-lead">{file.description}</p>

      {kaydedildi && (
        <div className="admin-alert ok">
          Kaydedildi (commit {kaydedildi}). Site 1–2 dakika içinde yeniden yayınlanır; derleme hata
          verirse eski sürüm yayında kalır.
        </div>
      )}
      {hata && <div className="admin-alert err">{hata}</div>}
      {loadError && <div className="admin-alert err">{loadError}</div>}

      <div className="admin-toolbar">
        <Link className={`admin-btn ${advanced ? "ghost" : ""} small`} href={base}>Alanlar</Link>
        <Link className={`admin-btn ${advanced ? "" : "ghost"} small`} href={`${base}&mod=gelismis`}>
          Gelişmiş (tüm dosya)
        </Link>
      </div>

      {!loadError && !advanced && <FieldEditor key={sha} path={file.path} sha={sha} fields={fields} />}

      {!loadError && advanced && (
        <form action={saveRawAction}>
          <div className="admin-alert warn">
            Gelişmiş modda dosyanın tamamını düzenlersiniz (yeni rehber veya SSS eklemek gibi). Kod
            yapısını bozarsanız yeni sürüm derlenmez ve eski sürüm yayında kalır; hata için
            &quot;Özet&quot; sayfasındaki son değişikliklere bakın.
          </div>
          <input type="hidden" name="yol" value={file.path} />
          <input type="hidden" name="sha" value={sha} />
          <textarea
            name="icerik"
            className="admin-code"
            defaultValue={content}
            rows={32}
            spellCheck={false}
            aria-label="Dosya içeriği"
          />
          <div className="admin-savebar" style={{ marginTop: 12 }}>
            <input type="text" name="not" placeholder="Not (isteğe bağlı)" />
            <button className="admin-btn" type="submit">Kaydet ve yayınla</button>
          </div>
        </form>
      )}
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

import { saveFieldsAction } from "@/lib/admin/actions";

export type EditorField = {
  start: number;
  kind: "string" | "number" | "boolean";
  value: string;
  path: string[];
  line: number;
  hint: string;
  section: string;
};

function SaveButton({ count }: { count: number }) {
  const { pending } = useFormStatus();
  return (
    <button className="admin-btn" type="submit" disabled={pending || count === 0}>
      {pending ? "Kaydediliyor…" : `Kaydet ve yayınla (${count})`}
    </button>
  );
}

/** Ondalık sayıyı Türkçe okunuşla gösterir: 0.0325 → "%3,25 olabilir" ipucu */
function numberHint(raw: string) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return "";
  if (n > 0 && n < 1) return `oran ise %${(n * 100).toLocaleString("tr-TR", { maximumFractionDigits: 4 })}`;
  if (n >= 1000) return n.toLocaleString("tr-TR");
  return "";
}

export default function FieldEditor({
  path,
  sha,
  fields,
}: {
  path: string;
  sha: string;
  fields: EditorField[];
}) {
  const [values, setValues] = useState<Record<number, string>>({});
  const [query, setQuery] = useState("");

  const changed = useMemo(
    () => fields.filter((f) => values[f.start] !== undefined && values[f.start] !== f.value),
    [fields, values]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr-TR");
    if (!q) return fields;
    return fields.filter((f) =>
      `${f.path.join(" ")} ${f.value} ${f.hint} ${f.section}`.toLocaleLowerCase("tr-TR").includes(q)
    );
  }, [fields, query]);

  const payload = JSON.stringify(
    changed.map((f) => ({ start: f.start, kind: f.kind, original: f.value, value: values[f.start] }))
  );

  const set = (start: number, v: string) => setValues((prev) => ({ ...prev, [start]: v }));

  let lastSection = "";

  return (
    <form action={saveFieldsAction}>
      <input type="hidden" name="yol" value={path} />
      <input type="hidden" name="sha" value={sha} />
      <input type="hidden" name="degisiklikler" value={payload} />

      <div className="admin-toolbar">
        <input
          type="search"
          placeholder="Ara: alan adı veya mevcut değer (ör. kira, asgari, 31,23)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Alanlarda ara"
        />
        <span className="admin-field-hint">{visible.length} / {fields.length} alan</span>
      </div>

      <div className="admin-box">
        {visible.length === 0 && <p className="admin-lead">Eşleşen alan yok.</p>}
        {visible.map((f) => {
          const current = values[f.start] ?? f.value;
          const isChanged = current !== f.value;
          const showSection = f.section && f.section !== lastSection;
          lastSection = f.section;
          const id = `f${f.start}`;
          const long = f.kind === "string" && (f.value.length > 90 || f.value.includes("\n"));

          return (
            <div key={f.start}>
              {showSection && <div className="admin-section-title">{f.section}</div>}
              <div className={`admin-field${isChanged ? " changed" : ""}`}>
                <div className="admin-field-head">
                  <label htmlFor={id}>
                    <code>{f.path.join(" › ") || "değer"}</code>
                  </label>
                  <small>satır {f.line}</small>
                  {f.kind === "number" && <small>{numberHint(current)}</small>}
                  {isChanged && (
                    <button type="button" className="admin-btn ghost small" onClick={() => set(f.start, f.value)}>
                      Geri al
                    </button>
                  )}
                </div>
                {f.hint && <div className="admin-field-hint">{f.hint}</div>}

                {f.kind === "boolean" ? (
                  <label className="admin-check">
                    <input
                      id={id}
                      type="checkbox"
                      checked={current === "true"}
                      onChange={(e) => set(f.start, e.target.checked ? "true" : "false")}
                    />
                    {current === "true" ? "Evet (true)" : "Hayır (false)"}
                  </label>
                ) : long ? (
                  <textarea
                    id={id}
                    rows={Math.min(10, Math.max(3, Math.ceil(current.length / 110)))}
                    value={current}
                    onChange={(e) => set(f.start, e.target.value)}
                  />
                ) : (
                  <input
                    id={id}
                    type="text"
                    inputMode={f.kind === "number" ? "decimal" : undefined}
                    value={current}
                    onChange={(e) => set(f.start, e.target.value)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="admin-savebar">
        <span>{changed.length === 0 ? "Değişiklik yok" : `${changed.length} alan değişti`}</span>
        <input type="text" name="not" placeholder="Not (isteğe bağlı): ör. Aralık kira artış oranı, kaynak TÜİK" />
        <SaveButton count={changed.length} />
      </div>
    </form>
  );
}

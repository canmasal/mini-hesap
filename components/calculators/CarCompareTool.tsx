"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { CarVersion } from "@/data/cars/types";
import { carLabel, compareField, FIELD_GROUPS, formatField, isEmptyForBoth, score } from "@/lib/cars/compare";

type Tree = { brand: string; models: { model: string; versions: CarVersion[] }[] }[];

const monthLabel = (m?: string) => {
  if (!m) return "";
  const [y, mo] = m.split("-").map(Number);
  return new Date(y, mo - 1, 15).toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
};

function Picker({
  tree,
  value,
  onChange,
  title,
}: {
  tree: Tree;
  value: CarVersion | null;
  onChange: (c: CarVersion | null) => void;
  title: string;
}) {
  const [brand, setBrand] = useState(value?.brand ?? "");
  const [model, setModel] = useState(value?.model ?? "");

  /* Dışarıdan (adres veya takas) gelen seçim, marka/model kutularını da günceller */
  useEffect(() => {
    if (value) {
      setBrand(value.brand);
      setModel(value.model);
    }
  }, [value]);

  const models = tree.find((b) => b.brand === brand)?.models ?? [];
  const versions = models.find((m) => m.model === model)?.versions ?? [];

  return (
    <fieldset style={{ border: "1px solid var(--line)", borderRadius: 16, padding: 16, margin: 0, display: "grid", gap: 12 }}>
      <legend style={{ fontWeight: 800, padding: "0 6px" }}>{title}</legend>
      <label className="field">
        Marka
        <select
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
            setModel("");
            onChange(null);
          }}
        >
          <option value="">Marka seçin</option>
          {tree.map((b) => (
            <option key={b.brand} value={b.brand}>{b.brand}</option>
          ))}
        </select>
      </label>
      <label className="field">
        Model
        <select
          value={model}
          disabled={!brand}
          onChange={(e) => {
            const m = e.target.value;
            setModel(m);
            const list = models.find((x) => x.model === m)?.versions ?? [];
            onChange(list.length === 1 ? list[0] : null);
          }}
        >
          <option value="">Model seçin</option>
          {models.map((m) => (
            <option key={m.model} value={m.model}>{m.model}</option>
          ))}
        </select>
      </label>
      <label className="field">
        Versiyon
        <select
          value={value?.id ?? ""}
          disabled={!model}
          onChange={(e) => onChange(versions.find((v) => v.id === e.target.value) ?? null)}
        >
          <option value="">Versiyon seçin</option>
          {versions.map((v) => (
            <option key={v.id} value={v.id}>
              {v.version}
              {v.priceTl ? ` – ${v.priceTl.toLocaleString("tr-TR")} TL` : ""}
            </option>
          ))}
        </select>
      </label>
    </fieldset>
  );
}

export default function CarCompareTool({
  tree,
  initialA,
  initialB,
  syncUrl = true,
}: {
  tree: Tree;
  initialA?: CarVersion | null;
  initialB?: CarVersion | null;
  /** Ana araç sayfasında seçim adrese (?a=&b=) yazılır; hazır karşılaştırma sayfalarında yazılmaz */
  syncUrl?: boolean;
}) {
  const all = useMemo(() => tree.flatMap((b) => b.models.flatMap((m) => m.versions)), [tree]);
  const [a, setA] = useState<CarVersion | null>(initialA ?? null);
  const [b, setB] = useState<CarVersion | null>(initialB ?? null);

  /* Paylaşılan bağlantıdaki seçimi yükle */
  useEffect(() => {
    if (!syncUrl) return;
    try {
      const p = new URLSearchParams(window.location.search);
      const fa = all.find((c) => c.id === p.get("a"));
      const fb = all.find((c) => c.id === p.get("b"));
      if (fa) setA(fa);
      if (fb) setB(fb);
    } catch {
      /* adres okunamazsa boş başla */
    }
  }, [all, syncUrl]);

  /* Seçimi adrese yaz: sonuç bağlantıyla paylaşılabilsin */
  useEffect(() => {
    if (!syncUrl) return;
    try {
      const url = new URL(window.location.href);
      if (a) url.searchParams.set("a", a.id);
      else url.searchParams.delete("a");
      if (b) url.searchParams.set("b", b.id);
      else url.searchParams.delete("b");
      window.history.replaceState(null, "", url.toString());
    } catch {
      /* geçmiş API'si kapalıysa sessizce geç */
    }
  }, [a, b, syncUrl]);

  const result = a && b ? score(a, b) : null;

  return (
    <div className="calc-box">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        <Picker tree={tree} value={a} onChange={setA} title="1. araç" />
        <Picker tree={tree} value={b} onChange={setB} title="2. araç" />
      </div>
      {a && b && (
        <div style={{ marginTop: 12 }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: "9px 14px", fontSize: 14 }}
            onClick={() => {
              setA(b);
              setB(a);
            }}
          >
            ⇄ Yer değiştir
          </button>
        </div>
      )}

      {a && b && result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 14 }}>
          <div className="notice notice-ok">
            {result.aWins === result.bWins ? (
              <>İki araç karşılaştırılabilen özelliklerde <strong>berabere</strong> ({result.aWins} – {result.bWins}).</>
            ) : (
              <>
                <strong>{carLabel(result.aWins > result.bWins ? a : b)}</strong>, karşılaştırılabilen{" "}
                {result.aWins + result.bWins} özelliğin <strong>{Math.max(result.aWins, result.bWins)}</strong>{" "}
                tanesinde önde. Kazanan sayısı bir başlangıç noktasıdır; sizin için önemli olan satırlara bakın.
              </>
            )}
          </div>

          <div className="rates-table-wrap">
            <table className="rates-table car-compare-table">
              <thead>
                <tr>
                  <th scope="col">Özellik</th>
                  <th scope="col">{a.brand} {a.model}<br /><span style={{ fontWeight: 500, textTransform: "none" }}>{a.version}</span></th>
                  <th scope="col">{b.brand} {b.model}<br /><span style={{ fontWeight: 500, textTransform: "none" }}>{b.version}</span></th>
                </tr>
              </thead>
              {FIELD_GROUPS.map((group) => {
                const rows = group.fields.filter((f) => !isEmptyForBoth(f, a, b));
                if (!rows.length) return null;
                return (
                  <tbody key={group.title}>
                    <tr className="car-group-row">
                      <th scope="colgroup" colSpan={3}>{group.title}</th>
                    </tr>
                    {rows.map((f) => {
                      const r = compareField(f, a, b);
                      return (
                        <tr key={f.key}>
                          <th scope="row">{f.label}</th>
                          <td className={r === -1 ? "car-win" : undefined}>{formatField(f, a[f.key])}{r === -1 ? " ✓" : ""}</td>
                          <td className={r === 1 ? "car-win" : undefined}>{formatField(f, b[f.key])}{r === 1 ? " ✓" : ""}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                );
              })}
            </table>
          </div>

          <p className="field-hint" style={{ margin: 0 }}>
            Fiyatlar marka liste fiyatıdır ({monthLabel(a.priceMonth)}
            {b.priceMonth !== a.priceMonth ? ` / ${monthLabel(b.priceMonth)}` : ""}); kampanya, opsiyon ve bayi
            farkları dahil değildir. Tüketim değerleri WLTP karma çevrimine göredir. Boş (—) alanlar üreticinin
            bu versiyon için yayımladığı belgede yer almayan bilgilerdir.
          </p>
          <p className="field-hint" style={{ margin: 0 }}>
            Kaynaklar:{" "}
            {[...new Set([...a.sources, ...b.sources])].map((s, i) => (
              <span key={s}>
                {i > 0 && " · "}
                <a href={s} target="_blank" rel="noopener noreferrer nofollow">{new URL(s).hostname.replace(/^www\./, "")}</a>
              </span>
            ))}
          </p>
          <div className="notice">
            Yakıt, sigorta, MTV, bakım ve değer kaybıyla <strong>toplam sahip olma maliyetini</strong> de görmek için{" "}
            <Link href="/hesaplamalar/arac-karsilastirma" style={{ fontWeight: 700, textDecoration: "underline" }}>
              Araç Karşılaştırma (Toplam Maliyet)
            </Link>{" "}
            aracını kullanın.
          </div>
        </div>
      ) : (
        <div className="calc-hint">İki aracın marka, model ve versiyonunu seçin; teknik özellikleri ve fiyatları yan yana karşılaştıralım.</div>
      )}
    </div>
  );
}

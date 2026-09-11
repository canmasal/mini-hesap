"use client";

import { useMemo, useState } from "react";

import ResultRow, { money, percent } from "./ResultRow";

/**
 * Enflasyon / zam farkı hesaplama.
 *
 * Reel değişim = ((1 + nominal zam) / (1 + enflasyon) - 1) x 100
 * Yani zammınızın enflasyon karşısındaki gerçek karşılığı.
 */
export default function InflationCalculator() {
  const [oldAmount, setOldAmount] = useState("");
  const [mode, setMode] = useState<"yeni" | "oran">("yeni");
  const [newAmount, setNewAmount] = useState("");
  const [raiseRate, setRaiseRate] = useState("");
  const [inflation, setInflation] = useState("");

  const result = useMemo(() => {
    const base = Number(oldAmount);
    const inf = Number(inflation);

    if (
      !oldAmount ||
      !inflation ||
      !Number.isFinite(base) ||
      base <= 0 ||
      !Number.isFinite(inf) ||
      inf < -100
    ) {
      return null;
    }

    let current: number;

    if (mode === "yeni") {
      const entered = Number(newAmount);
      if (!newAmount || !Number.isFinite(entered) || entered < 0) return null;
      current = entered;
    } else {
      const entered = Number(raiseRate);
      if (!raiseRate || !Number.isFinite(entered)) return null;
      current = base * (1 + entered / 100);
    }

    const nominalChange = ((current - base) / base) * 100;

    /* Enflasyona birebir yetişmek için olması gereken tutar */
    const shouldBe = base * (1 + inf / 100);

    const realChange =
      ((1 + nominalChange / 100) / (1 + inf / 100) - 1) * 100;

    return {
      current,
      nominalChange,
      shouldBe,
      gap: current - shouldBe,
      realChange,
      /* Bugünkü tutarın eski dönem parasıyla karşılığı */
      realValue: current / (1 + inf / 100),
    };
  }, [oldAmount, mode, newAmount, raiseRate, inflation]);

  function handleClear() {
    setOldAmount("");
    setNewAmount("");
    setRaiseRate("");
    setInflation("");
    setMode("yeni");
  }

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Önceki Tutar (₺)
          <input
            type="number"
            min="0"
            step="0.01"
            value={oldAmount}
            onChange={(event) => setOldAmount(event.target.value)}
            placeholder="40000"
          />
          <span className="field-hint">Zam öncesi maaş, kira veya fiyat.</span>
        </label>

        <label className="field">
          Ne Girmek İstiyorsunuz?
          <select
            value={mode}
            onChange={(event) =>
              setMode(event.target.value as "yeni" | "oran")
            }
          >
            <option value="yeni">Yeni tutar</option>
            <option value="oran">Zam oranı (%)</option>
          </select>
        </label>

        {mode === "yeni" ? (
          <label className="field">
            Yeni Tutar (₺)
            <input
              type="number"
              min="0"
              step="0.01"
              value={newAmount}
              onChange={(event) => setNewAmount(event.target.value)}
              placeholder="52000"
            />
          </label>
        ) : (
          <label className="field">
            Zam Oranı (%)
            <input
              type="number"
              step="0.01"
              value={raiseRate}
              onChange={(event) => setRaiseRate(event.target.value)}
              placeholder="30"
            />
          </label>
        )}

        <label className="field">
          Dönem Enflasyonu (%)
          <input
            type="number"
            step="0.01"
            value={inflation}
            onChange={(event) => setInflation(event.target.value)}
            placeholder="38"
          />
          <span className="field-hint">
            Aynı dönemin TÜFE oranı (TÜİK verisi).
          </span>
        </label>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button
          type="button"
          className="btn btn-outline"
          style={{ borderRadius: 14 }}
          onClick={handleClear}
        >
          Temizle
        </button>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow
            label="Yeni Tutar"
            value={money(result.current)}
            hint={`Nominal değişim ${percent(result.nominalChange)}`}
          />

          <ResultRow
            label="Enflasyona Yetişmesi İçin Gereken"
            value={money(result.shouldBe)}
            hint="Alım gücünün aynı kalması için olması gereken tutar"
          />

          <ResultRow
            label={result.gap >= 0 ? "Enflasyon Üstü Kazanç" : "Enflasyon Altı Kayıp"}
            value={
              result.gap >= 0
                ? `+ ${money(result.gap)}`
                : `- ${money(Math.abs(result.gap))}`
            }
            tone={result.gap >= 0 ? "pos" : "neg"}
            highlight
          />

          <ResultRow
            label="Reel (Gerçek) Değişim"
            value={percent(result.realChange)}
            hint="Enflasyondan arındırılmış artış oranı"
            tone={result.realChange >= 0 ? "pos" : "neg"}
            highlight
          />

          <ResultRow
            label="Yeni Tutarın Eski Para Karşılığı"
            value={money(result.realValue)}
            hint="Bugünkü tutar, önceki dönemin alım gücüyle bu kadar eder"
          />

          <div
            className={
              result.realChange >= 0 ? "notice notice-ok" : "notice notice-warn"
            }
          >
            {result.realChange >= 0 ? (
              <>
                Zammınız enflasyonun <strong>üzerinde</strong>. Alım gücünüz{" "}
                <strong>{percent(Math.abs(result.realChange))}</strong> arttı.
              </>
            ) : (
              <>
                Zammınız enflasyonun <strong>altında</strong> kaldı. Alım
                gücünüz{" "}
                <strong>{percent(Math.abs(result.realChange))}</strong> azaldı;
                aynı parayla eskisi kadar mal alamıyorsunuz.
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="notice">
          Önceki tutarı, yeni tutarı (veya zam oranını) ve aynı dönemin
          enflasyon oranını girin. Zammınızın alım gücünüzü gerçekte artırıp
          artırmadığını hesaplayalım.
        </div>
      )}
    </div>
  );
}

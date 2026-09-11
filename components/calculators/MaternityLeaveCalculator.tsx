"use client";

import { useMemo, useState } from "react";

import ResultRow from "./ResultRow";

/**
 * Doğum izni, süt izni ve analık izni hesaplama (4857 sayılı İş Kanunu m.74).
 *
 * Temel kural: doğumdan önce 8 + sonra 8 = 16 hafta.
 * Çoğul gebelikte doğum öncesi 2 hafta eklenir (10 + 8 = 18 hafta).
 * İşçi isterse doğumdan önceki 3 haftaya kadar çalışabilir; çalışılan süre
 * doğum sonrasına aktarılır.
 */

const DAY = 86400000;

function parseDate(v: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  const t = Date.parse(`${v}T00:00:00`);
  return Number.isNaN(t) ? null : new Date(t);
}

function addDays(d: Date, n: number) {
  return new Date(d.getTime() + n * DAY);
}

function fmt(d: Date) {
  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function MaternityLeaveCalculator() {
  const [dueDate, setDueDate] = useState("");
  const [multiple, setMultiple] = useState(false);
  /** Doğum öncesi kaç haftayı çalışarak sonraya aktarıyor (en fazla 5) */
  const [transferred, setTransferred] = useState("0");
  const [childOrder, setChildOrder] = useState("1");

  const result = useMemo(() => {
    const birth = parseDate(dueDate);
    const t = Number(transferred);

    if (!birth || !Number.isFinite(t) || t < 0 || t > 5) return null;

    /* Doğum öncesi hak: normal 8, çoğul gebelikte 10 hafta */
    const preWeeksBase = multiple ? 10 : 8;
    const preWeeks = preWeeksBase - t;
    const postWeeks = 8 + t;

    const leaveStart = addDays(birth, -preWeeks * 7);
    const leaveEnd = addDays(birth, postWeeks * 7 - 1);

    /* Süt izni: doğum sonrası iznin bitiminden çocuk 1 yaşına gelene kadar */
    const nursingEnd = addDays(birth, 365);

    /* Yarım çalışma ödeneği süresi (ilk 60 / 120 / 180 gün) */
    const order = Number(childOrder);
    const halfTimeDays = order === 1 ? 60 : order === 2 ? 120 : 180;

    const unpaidEnd = addDays(leaveEnd, 6 * 30);

    return {
      preWeeks,
      postWeeks,
      totalWeeks: preWeeks + postWeeks,
      leaveStart,
      leaveEnd,
      nursingEnd,
      halfTimeDays,
      halfTimeEnd: addDays(leaveEnd, halfTimeDays),
      unpaidEnd,
    };
  }, [dueDate, multiple, transferred, childOrder]);

  function handleClear() {
    setDueDate("");
    setMultiple(false);
    setTransferred("0");
    setChildOrder("1");
  }

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Tahmini Doğum Tarihi
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>

        <label className="field">
          Gebelik Türü
          <select
            value={multiple ? "cogul" : "tekil"}
            onChange={(e) => setMultiple(e.target.value === "cogul")}
          >
            <option value="tekil">Tekil gebelik</option>
            <option value="cogul">Çoğul gebelik (ikiz ve üzeri)</option>
          </select>
        </label>

        <label className="field">
          Doğum Öncesi Çalışılan Hafta
          <select
            value={transferred}
            onChange={(e) => setTransferred(e.target.value)}
          >
            <option value="0">Çalışmayacağım (0 hafta)</option>
            <option value="1">1 hafta</option>
            <option value="2">2 hafta</option>
            <option value="3">3 hafta</option>
            <option value="4">4 hafta</option>
            <option value="5">5 hafta (en fazla)</option>
          </select>
          <span className="field-hint">
            Çalıştığınız süre doğum sonrası izne eklenir.
          </span>
        </label>

        <label className="field">
          Kaçıncı Çocuk
          <select
            value={childOrder}
            onChange={(e) => setChildOrder(e.target.value)}
          >
            <option value="1">Birinci çocuk</option>
            <option value="2">İkinci çocuk</option>
            <option value="3">Üçüncü ve sonrası</option>
          </select>
          <span className="field-hint">
            Yarım çalışma ödeneği süresini belirler.
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
            label="Doğum İzni Başlangıcı"
            value={fmt(result.leaveStart)}
            hint={`Doğumdan ${result.preWeeks} hafta önce`}
            highlight
          />

          <ResultRow
            label="Doğum İzni Bitişi"
            value={fmt(result.leaveEnd)}
            hint={`Doğumdan ${result.postWeeks} hafta sonra`}
            highlight
          />

          <ResultRow
            label="Toplam Ücretli Doğum İzni"
            value={`${result.totalWeeks} hafta`}
            hint={`${result.totalWeeks * 7} gün · SGK geçici iş göremezlik ödeneği alınır`}
          />

          <ResultRow
            label="Süt İzni Hakkı"
            value="Günde 1,5 saat"
            hint={`${fmt(result.nursingEnd)} tarihine kadar (çocuk 1 yaşına gelene dek)`}
          />

          <ResultRow
            label="Yarım Çalışma Ödeneği"
            value={`${result.halfTimeDays} gün`}
            hint={`Doğum izni bitiminden ${fmt(result.halfTimeEnd)} tarihine kadar talep edilebilir`}
          />

          <ResultRow
            label="Ücretsiz İzin Hakkı"
            value="6 aya kadar"
            hint={`Talep edilirse ${fmt(result.unpaidEnd)} tarihine kadar uzatılabilir`}
          />

          <div className="notice">
            <strong>Babalık izni:</strong> Eş için 5 gün ücretli izin hakkı
            vardır (İş Kanunu Ek Madde 2). Evlat edinmede de 3 yaşından küçük
            çocuk için 8 haftalık izin uygulanır.
          </div>
        </div>
      ) : (
        <div className="notice">
          Tahmini doğum tarihinizi girin. Doğum izni başlangıç-bitiş
          tarihlerinizi, süt izni sürenizi ve yarım çalışma ödeneği hakkınızı
          hesaplayalım.
        </div>
      )}
    </div>
  );
}

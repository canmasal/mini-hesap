"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/* =========================================================
   TİPLER
========================================================= */

type TransactionType = "Gelir" | "Gider";

type RecordRow = {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  counterparty: string;
  description: string;
  /** Kullanıcının girdiği tutar (KDV dahil veya hariç olabilir) */
  amount: number;
  /** Girilen tutarın KDV içerip içermediği */
  vatIncluded: boolean;
  vatRate: string;
  payment: string;
  documentType: string;
  documentNo: string;
  dueDate: string;
  /** Gelirde tahsil edildi, giderde ödendi anlamına gelir */
  settled: boolean;
};

/** Bir satırın matrah / KDV / brüt ayrıştırması */
type RowAmounts = {
  base: number;
  vat: number;
  gross: number;
};

/* =========================================================
   SABİTLER
========================================================= */

const FREE_ROW_LIMIT = 10;
const STORAGE_KEY = "miniHesapOnMuhasebeKayitlar";

const incomeCategories = [
  "Mal Satışı",
  "Hizmet Satışı",
  "E-Ticaret Satışı",
  "Proje / İş Geliri",
  "Danışmanlık Geliri",
  "Kira Geliri",
  "Komisyon Geliri",
  "Faiz / Finansman Geliri",
  "Diğer Faaliyet Geliri",
  "Diğer Gelir",
];

const expenseCategories = [
  "Mal / Ticari Mal Alımı",
  "Hammadde / Malzeme",
  "Üretim Gideri",
  "Taşeron / Dışarıdan Hizmet",
  "Kargo / Nakliye",
  "Kira",
  "Personel Ücretleri",
  "SGK / Prim",
  "Elektrik",
  "Su",
  "Doğalgaz",
  "Telefon",
  "İnternet",
  "Akaryakıt",
  "Araç Giderleri",
  "Bakım / Onarım",
  "Ofis / Kırtasiye",
  "Yazılım / Abonelik",
  "Reklam / Pazarlama",
  "Muhasebe / Mali Müşavir",
  "Banka Komisyonları",
  "Sigorta",
  "Vergi / Harç",
  "Seyahat / Konaklama",
  "Yemek / Temsil",
  "Hukuk / Danışmanlık",
  "Amortisman",
  "Finansman / Kredi Faizi",
  "Diğer Faaliyet Gideri",
  "Diğer Gider",
];

const paymentMethods = [
  "Banka",
  "Nakit",
  "Kredi Kartı",
  "Çek",
  "Senet",
  "Diğer",
];

const documentTypes = [
  "Fatura",
  "e-Arşiv Fatura",
  "e-Fatura",
  "Serbest Meslek Makbuzu",
  "Gider Pusulası",
  "Fiş",
  "Dekont",
  "Diğer",
];

const vatRates = ["0", "1", "10", "20"];

/* =========================================================
   YARDIMCILAR
========================================================= */

const money = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const percent = (value: number) =>
  `${new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)}%`;

const makeId = () =>
  `r${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

/**
 * Satırı matrah / KDV / brüt olarak ayrıştırır.
 * Kâr hesabı matrah üzerinden yapılır; KDV işletmenin geliri değildir.
 */
function amountsOf(row: RecordRow): RowAmounts {
  const rate = Number(row.vatRate) / 100;
  const entered = Number.isFinite(row.amount) ? row.amount : 0;

  if (entered <= 0) {
    return { base: 0, vat: 0, gross: 0 };
  }

  const base = row.vatIncluded ? entered / (1 + rate) : entered;
  const gross = row.vatIncluded ? entered : entered * (1 + rate);

  return { base, vat: gross - base, gross };
}

/** "2026-09-14" -> "2026-09" */
const monthKeyOf = (date: string) =>
  /^\d{4}-\d{2}/.test(date) ? date.slice(0, 7) : "";

const monthLabelOf = (key: string) => {
  const [year, month] = key.split("-");
  const names = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];

  return `${names[Number(month) - 1] ?? month} ${year}`;
};

/** İki tarih arasındaki tam gün farkı */
const daysBetween = (from: string, to: string) => {
  const a = Date.parse(`${from}T00:00:00`);
  const b = Date.parse(`${to}T00:00:00`);

  if (Number.isNaN(a) || Number.isNaN(b)) return null;

  return Math.round((b - a) / 86400000);
};

function emptyRow(type: TransactionType = "Gelir"): RecordRow {
  return {
    id: makeId(),
    date: "",
    type,
    category: type === "Gelir" ? incomeCategories[0] : expenseCategories[0],
    counterparty: "",
    description: "",
    amount: 0,
    vatIncluded: true,
    vatRate: "20",
    payment: "Banka",
    documentType: "Fatura",
    documentNo: "",
    dueDate: "",
    settled: true,
  };
}

/* =========================================================
   BİLEŞEN
========================================================= */

export default function OnMuhasebeDemo() {
  const [rows, setRows] = useState<RecordRow[]>(() => [
    emptyRow("Gelir"),
    emptyRow("Gider"),
    emptyRow("Gider"),
  ]);

  const [period, setPeriod] = useState("all");
  const [showPremium, setShowPremium] = useState(false);

  /* Kayıtlı veriyi ve bugünün tarihini yalnızca tarayıcıda oku
     (sunucu render'ı ile uyuşmazlık olmaması için) */
  const [loaded, setLoaded] = useState(false);
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));

    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved) as RecordRow[];

        if (Array.isArray(parsed) && parsed.length > 0) {
          setRows(parsed);
        }
      }
    } catch {
      /* Depolama kullanılamıyorsa araç boş tabloyla çalışmaya devam eder. */
    }

    setLoaded(true);
  }, []);

  /* Her değişiklikte kaydet — sayfa yenilenince veri kaybolmasın */
  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    } catch {
      /* Kota dolduysa sessizce devam et. */
    }
  }, [rows, loaded]);

  /* ---------------------------------------------------
     SATIR İŞLEMLERİ
  --------------------------------------------------- */

  function updateRow<K extends keyof RecordRow>(
    id: string,
    field: K,
    value: RecordRow[K]
  ) {
    setRows((current) =>
      current.map((row) => {
        if (row.id !== id) return row;

        /* Tür değişince kategori de o türün listesine geçmeli */
        if (field === "type") {
          const nextType = value as TransactionType;

          return {
            ...row,
            type: nextType,
            category:
              nextType === "Gelir"
                ? incomeCategories[0]
                : expenseCategories[0],
          };
        }

        return { ...row, [field]: value };
      })
    );
  }

  function addRow(type: TransactionType) {
    if (rows.length >= FREE_ROW_LIMIT) {
      setShowPremium(true);
      return;
    }

    setRows((current) => [...current, emptyRow(type)]);
  }

  function removeRow(id: string) {
    setRows((current) =>
      current.length === 1 ? current : current.filter((row) => row.id !== id)
    );
  }

  function resetAll() {
    if (!confirm("Tüm kayıtlar silinecek. Devam edilsin mi?")) return;

    setRows([emptyRow("Gelir"), emptyRow("Gider"), emptyRow("Gider")]);
    setPeriod("all");
  }

  /** Aracın ne yaptığını göstermek için gerçekçi örnek kayıtlar */
  function loadSample() {
    const now = new Date();
    const iso = (dayOffset: number) => {
      const d = new Date(now);
      d.setDate(d.getDate() + dayOffset);
      return d.toISOString().slice(0, 10);
    };

    setRows([
      {
        ...emptyRow("Gelir"),
        date: iso(-24),
        category: "Mal Satışı",
        counterparty: "Aydın Ticaret Ltd.",
        description: "Toptan ürün satışı",
        amount: 180000,
        vatRate: "20",
        documentType: "e-Fatura",
        documentNo: "SAT2026000141",
        dueDate: iso(-24),
        settled: true,
      },
      {
        ...emptyRow("Gelir"),
        date: iso(-12),
        category: "Hizmet Satışı",
        counterparty: "Beta Yazılım A.Ş.",
        description: "Aylık bakım hizmeti",
        amount: 96000,
        vatRate: "20",
        documentType: "e-Arşiv Fatura",
        documentNo: "SAT2026000158",
        dueDate: iso(18),
        settled: false,
      },
      {
        ...emptyRow("Gelir"),
        date: iso(-40),
        category: "Proje / İş Geliri",
        counterparty: "Cem Mühendislik",
        description: "Kurulum projesi 2. hakediş",
        amount: 145000,
        vatRate: "20",
        documentType: "e-Fatura",
        documentNo: "SAT2026000122",
        dueDate: iso(-9),
        settled: false,
      },
      {
        ...emptyRow("Gider"),
        date: iso(-26),
        category: "Mal / Ticari Mal Alımı",
        counterparty: "Deniz Toptan",
        description: "Ürün alımı",
        amount: 132000,
        vatRate: "20",
        documentType: "e-Fatura",
        documentNo: "ALS2026000318",
        dueDate: iso(-26),
        settled: true,
      },
      {
        ...emptyRow("Gider"),
        date: iso(-20),
        category: "Kira",
        counterparty: "Emlak Yönetim",
        description: "Ofis kirası",
        amount: 42000,
        vatRate: "20",
        documentType: "Fatura",
        documentNo: "KR2026-09",
        dueDate: iso(-20),
        settled: true,
      },
      {
        ...emptyRow("Gider"),
        date: iso(-18),
        category: "Personel Ücretleri",
        counterparty: "Personel",
        description: "Net maaş ödemeleri",
        amount: 118000,
        vatIncluded: false,
        vatRate: "0",
        documentType: "Diğer",
        documentNo: "",
        dueDate: iso(-18),
        settled: true,
      },
      {
        ...emptyRow("Gider"),
        date: iso(-6),
        category: "Reklam / Pazarlama",
        counterparty: "Ajans Medya",
        description: "Dijital reklam bütçesi",
        amount: 24000,
        vatRate: "20",
        documentType: "e-Arşiv Fatura",
        documentNo: "ALS2026000402",
        dueDate: iso(9),
        settled: false,
      },
    ]);

    setPeriod("all");
  }

  /* ---------------------------------------------------
     DÖNEM FİLTRESİ
  --------------------------------------------------- */

  const availableMonths = useMemo(() => {
    const keys = new Set<string>();

    rows.forEach((row) => {
      const key = monthKeyOf(row.date);
      if (key) keys.add(key);
    });

    return Array.from(keys).sort().reverse();
  }, [rows]);

  const visibleRows = useMemo(() => {
    if (period === "all") return rows;
    return rows.filter((row) => monthKeyOf(row.date) === period);
  }, [rows, period]);

  /* ---------------------------------------------------
     ANA HESAPLAMA
  --------------------------------------------------- */

  const totals = useMemo(() => {
    let incomeBase = 0;
    let incomeVat = 0;
    let incomeGross = 0;
    let expenseBase = 0;
    let expenseVat = 0;
    let expenseGross = 0;
    let cashIn = 0;
    let cashOut = 0;
    let receivables = 0;
    let payables = 0;

    visibleRows.forEach((row) => {
      const { base, vat, gross } = amountsOf(row);

      if (row.type === "Gelir") {
        incomeBase += base;
        incomeVat += vat;
        incomeGross += gross;

        if (row.settled) cashIn += gross;
        else receivables += gross;
      } else {
        expenseBase += base;
        expenseVat += vat;
        expenseGross += gross;

        if (row.settled) cashOut += gross;
        else payables += gross;
      }
    });

    /* Kâr, KDV hariç tutarlar (matrah) üzerinden hesaplanır */
    const netProfit = incomeBase - expenseBase;

    return {
      incomeBase,
      incomeVat,
      incomeGross,
      expenseBase,
      expenseVat,
      expenseGross,
      netProfit,
      margin: incomeBase > 0 ? (netProfit / incomeBase) * 100 : 0,
      /* Hesaplanan KDV - İndirilecek KDV */
      vatBalance: incomeVat - expenseVat,
      cashIn,
      cashOut,
      netCash: cashIn - cashOut,
      receivables,
      payables,
    };
  }, [visibleRows]);

  /* ---------------------------------------------------
     VADE YAŞLANDIRMA
  --------------------------------------------------- */

  const aging = useMemo(() => {
    const empty = {
      notDue: 0,
      d1: 0,
      d31: 0,
      d61: 0,
      d90: 0,
      noDueDate: 0,
      overdueTotal: 0,
    };

    const buckets = {
      receivable: { ...empty },
      payable: { ...empty },
    };

    if (!today) return buckets;

    visibleRows.forEach((row) => {
      if (row.settled) return;

      const { gross } = amountsOf(row);
      if (gross <= 0) return;

      const target =
        row.type === "Gelir" ? buckets.receivable : buckets.payable;

      if (!row.dueDate) {
        target.noDueDate += gross;
        return;
      }

      const late = daysBetween(row.dueDate, today);

      if (late === null || late <= 0) {
        target.notDue += gross;
        return;
      }

      target.overdueTotal += gross;

      if (late <= 30) target.d1 += gross;
      else if (late <= 60) target.d31 += gross;
      else if (late <= 90) target.d61 += gross;
      else target.d90 += gross;
    });

    return buckets;
  }, [visibleRows, today]);

  /* ---------------------------------------------------
     CARİ BAKİYELER
  --------------------------------------------------- */

  const counterpartyBalances = useMemo(() => {
    const map = new Map<string, { receivable: number; payable: number }>();

    visibleRows.forEach((row) => {
      const name = row.counterparty.trim();
      if (!name || row.settled) return;

      const { gross } = amountsOf(row);
      if (gross <= 0) return;

      const entry = map.get(name) ?? { receivable: 0, payable: 0 };

      if (row.type === "Gelir") entry.receivable += gross;
      else entry.payable += gross;

      map.set(name, entry);
    });

    return Array.from(map.entries())
      .map(([name, value]) => ({
        name,
        net: value.receivable - value.payable,
        ...value,
      }))
      .sort((a, b) => Math.abs(b.net) - Math.abs(a.net))
      .slice(0, 6);
  }, [visibleRows]);

  /* ---------------------------------------------------
     GİDER KATEGORİLERİ
  --------------------------------------------------- */

  const expenseByCategory = useMemo(() => {
    const map = new Map<string, number>();

    visibleRows.forEach((row) => {
      if (row.type !== "Gider") return;

      const { base } = amountsOf(row);
      if (base <= 0) return;

      map.set(row.category, (map.get(row.category) ?? 0) + base);
    });

    return Array.from(map.entries())
      .map(([name, value]) => ({
        name,
        value,
        share: totals.expenseBase > 0 ? (value / totals.expenseBase) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [visibleRows, totals.expenseBase]);

  /* ---------------------------------------------------
     VERİ KALİTESİ UYARILARI
  --------------------------------------------------- */

  const warnings = useMemo(() => {
    const list: string[] = [];
    const filled = visibleRows.filter((row) => row.amount > 0);

    const missingDate = filled.filter((row) => !row.date).length;
    if (missingDate > 0) {
      list.push(
        `${missingDate} kaydın tarihi boş — bu kayıtlar aylık dönem raporlarına girmez.`
      );
    }

    const invoiceNoMissing = filled.filter(
      (row) => row.documentType.includes("Fatura") && !row.documentNo.trim()
    ).length;
    if (invoiceNoMissing > 0) {
      list.push(
        `${invoiceNoMissing} fatura kaydında belge numarası yok — mali müşavir mutabakatında sorun çıkarır.`
      );
    }

    const noCounterparty = filled.filter(
      (row) => !row.settled && !row.counterparty.trim()
    ).length;
    if (noCounterparty > 0) {
      list.push(
        `${noCounterparty} açık kayıtta cari adı girilmemiş — alacak/borç takibi yapılamaz.`
      );
    }

    const noDueDate = filled.filter(
      (row) => !row.settled && !row.dueDate
    ).length;
    if (noDueDate > 0) {
      list.push(
        `${noDueDate} tahsil/ödeme bekleyen kayıtta vade tarihi yok — yaşlandırma dışında kalır.`
      );
    }

    if (aging.receivable.overdueTotal > 0) {
      list.push(
        `Vadesi geçmiş ${money(
          aging.receivable.overdueTotal
        )} tutarında tahsil edilmemiş alacağınız var.`
      );
    }

    return list;
  }, [visibleRows, aging]);

  /* ---------------------------------------------------
     CSV DIŞA AKTARIM
  --------------------------------------------------- */

  function exportCsv() {
    const header = [
      "Tarih",
      "Tür",
      "Kategori",
      "Cari",
      "Açıklama",
      "Matrah",
      "KDV Oranı",
      "KDV Tutarı",
      "Genel Toplam",
      "Ödeme Yöntemi",
      "Belge Türü",
      "Belge No",
      "Vade",
      "Durum",
    ];

    const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;

    const lines = visibleRows.map((row) => {
      const { base, vat, gross } = amountsOf(row);

      return [
        row.date,
        row.type,
        row.category,
        row.counterparty,
        row.description,
        base.toFixed(2),
        `%${row.vatRate}`,
        vat.toFixed(2),
        gross.toFixed(2),
        row.payment,
        row.documentType,
        row.documentNo,
        row.dueDate,
        row.settled
          ? row.type === "Gelir"
            ? "Tahsil Edildi"
            : "Ödendi"
          : "Bekliyor",
      ]
        .map((cell) => escape(String(cell)))
        .join(";");
    });

    /* BOM, Excel'in Türkçe karakterleri doğru açması için gerekli */
    const csv = `﻿${header.map(escape).join(";")}\n${lines.join("\n")}`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `minihesap-on-muhasebe-${
      period === "all" ? "tum-donemler" : period
    }.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  /* ---------------------------------------------------
     RENDER
  --------------------------------------------------- */

  const rowsLeft = Math.max(FREE_ROW_LIMIT - rows.length, 0);

  return (
    <section className="section" style={{ paddingTop: 5, paddingBottom: 30 }}>
      <div className="ledger-shell">
        <div className="ledger">
          {/* ===== BAŞLIK ve ARAÇ ÇUBUĞU ===== */}

          <div className="ledger-head">
            <div>
              <p className="eyebrow" style={{ margin: 0 }}>
                ÜCRETSİZ ARAÇ
              </p>

              <h2
                style={{
                  margin: "5px 0 4px",
                  fontSize: "clamp(22px, 3vw, 28px)",
                }}
              >
                Ön Muhasebe Takip
              </h2>

              <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>
                Gelir ve giderlerinizi KDV ayrıştırmalı kaydedin; kâr, KDV
                beyanı, nakit akışı ve cari bakiyeleriniz anlık hesaplansın.
              </p>
            </div>

            <div className="ledger-tools">
              <label className="visually-hidden" htmlFor="donem">
                Dönem seçin
              </label>

              <select
                id="donem"
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
              >
                <option value="all">Tüm dönemler</option>
                {availableMonths.map((key) => (
                  <option key={key} value={key}>
                    {monthLabelOf(key)}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="btn btn-outline"
                onClick={exportCsv}
              >
                ⬇ CSV indir
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={loadSample}
              >
                Örnek veri
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={resetAll}
              >
                Temizle
              </button>
            </div>
          </div>

          {/* ===== KPI PANELİ ===== */}

          <div className="kpi-grid">
            <Kpi
              label="Gelir (KDV hariç)"
              value={money(totals.incomeBase)}
              note={`KDV dahil ${money(totals.incomeGross)}`}
            />

            <Kpi
              label="Gider (KDV hariç)"
              value={money(totals.expenseBase)}
              note={`KDV dahil ${money(totals.expenseGross)}`}
            />

            <Kpi
              label="Net Kâr / Zarar"
              value={money(totals.netProfit)}
              note={`Kâr marjı ${percent(totals.margin)}`}
              tone={totals.netProfit >= 0 ? "pos" : "neg"}
            />

            <Kpi
              label={totals.vatBalance >= 0 ? "Ödenecek KDV" : "Devreden KDV"}
              value={money(Math.abs(totals.vatBalance))}
              note={`Hesaplanan ${money(totals.incomeVat)} − İndirilecek ${money(
                totals.expenseVat
              )}`}
              tone={totals.vatBalance > 0 ? "neg" : "pos"}
            />

            <Kpi
              label="Net Nakit Akışı"
              value={money(totals.netCash)}
              note={`Giren ${money(totals.cashIn)} · Çıkan ${money(
                totals.cashOut
              )}`}
              tone={totals.netCash >= 0 ? "pos" : "neg"}
            />

            <Kpi
              label="Tahsil Edilmemiş Alacak"
              value={money(totals.receivables)}
              note={
                today
                  ? `Vadesi geçen ${money(aging.receivable.overdueTotal)}`
                  : "Hesaplanıyor..."
              }
            />

            <Kpi
              label="Ödenmemiş Borç"
              value={money(totals.payables)}
              note={
                today
                  ? `Vadesi geçen ${money(aging.payable.overdueTotal)}`
                  : "Hesaplanıyor..."
              }
            />

            <Kpi
              label="Kayıt Sayısı"
              value={`${visibleRows.length}`}
              note={`Ücretsiz limit ${FREE_ROW_LIMIT} · kalan ${rowsLeft}`}
            />
          </div>

          {/* ===== UYARILAR ===== */}

          {warnings.length > 0 && (
            <div className="notice notice-warn" style={{ marginTop: 0 }}>
              <strong>Kontrol edilmesi gerekenler</strong>
              <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
                {warnings.map((item) => (
                  <li key={item} style={{ marginTop: 4 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ===== TABLO ===== */}

          {/* Kullanıcı tabloyu ilk gördüğünde ne yapacağını bilsin */}
          <ol className="ledger-guide">
            <li>
              <span>1</span> Tarihi, türü (gelir/gider) ve kategoriyi seçin
            </li>
            <li>
              <span>2</span> Tutarı yazıp <b>KDV dahil mi hariç mi</b>
              olduğunu seçin
            </li>
            <li>
              <span>3</span> Gri sütunlar otomatik dolar:{" "}
              <b>matrah, KDV ve genel toplam</b>
            </li>
            <li>
              <span>4</span> Tahsil/ödeme bekliyorsa <b>vade</b> girip durumu
              “Bekliyor” yapın
            </li>
          </ol>

          <div className="ledger-scroll" style={{ marginTop: 12 }}>
            <table className="ledger-table">
              <caption className="visually-hidden">
                Gelir ve gider kayıtları tablosu
              </caption>

              {/* Genişlikler en uzun içeriğe göre belirlendi.
                  table-layout: fixed olduğu için bu değerler birebir uygulanır. */}
              <colgroup>
                <col style={{ width: 138 }} /> {/* Tarih */}
                <col style={{ width: 92 }} /> {/* Tür */}
                <col style={{ width: 192 }} /> {/* Kategori */}
                <col style={{ width: 132 }} /> {/* Cari */}
                <col style={{ width: 150 }} /> {/* Açıklama */}
                <col style={{ width: 106 }} /> {/* Tutar */}
                <col style={{ width: 116 }} /> {/* Tutar Tipi */}
                <col style={{ width: 78 }} /> {/* KDV */}
                <col style={{ width: 106 }} /> {/* Matrah */}
                <col style={{ width: 106 }} /> {/* KDV Tutarı */}
                <col style={{ width: 118 }} /> {/* Genel Toplam */}
                <col style={{ width: 116 }} /> {/* Ödeme */}
                <col style={{ width: 182 }} /> {/* Belge */}
                <col style={{ width: 120 }} /> {/* Belge No */}
                <col style={{ width: 138 }} /> {/* Vade */}
                <col style={{ width: 130 }} /> {/* Durum */}
                <col style={{ width: 49 }} /> {/* Sil */}
              </colgroup>

              <thead>
                <tr>
                  <th scope="col" className="sticky-col">
                    Tarih
                  </th>
                  <th scope="col">Tür</th>
                  <th scope="col">Kategori</th>
                  <th scope="col">Cari</th>
                  <th scope="col">Açıklama</th>
                  <th scope="col" className="num-col">
                    Tutar
                  </th>
                  <th scope="col">Tutar Tipi</th>
                  <th scope="col">KDV</th>
                  <th scope="col" className="num-col">
                    Matrah
                  </th>
                  <th scope="col" className="num-col">
                    KDV Tutarı
                  </th>
                  <th scope="col" className="num-col">
                    Genel Toplam
                  </th>
                  <th scope="col">Ödeme</th>
                  <th scope="col">Belge</th>
                  <th scope="col">Belge No</th>
                  <th scope="col">Vade</th>
                  <th scope="col">Durum</th>
                  <th scope="col">
                    <span className="visually-hidden">Satırı sil</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleRows.map((row) => {
                  const { base, vat, gross } = amountsOf(row);
                  const categories =
                    row.type === "Gelir" ? incomeCategories : expenseCategories;

                  const late =
                    today && row.dueDate && !row.settled
                      ? daysBetween(row.dueDate, today)
                      : null;

                  return (
                    <tr
                      key={row.id}
                      className={
                        row.type === "Gelir" ? "row-income" : "row-expense"
                      }
                    >
                      <td className="sticky-col" data-label="Tarih">
                        <input
                          type="date"
                          aria-label="İşlem tarihi"
                          value={row.date}
                          onChange={(event) =>
                            updateRow(row.id, "date", event.target.value)
                          }
                        />
                      </td>

                      <td data-label="Tür">
                        <select
                          aria-label="İşlem türü"
                          value={row.type}
                          onChange={(event) =>
                            updateRow(
                              row.id,
                              "type",
                              event.target.value as TransactionType
                            )
                          }
                        >
                          <option value="Gelir">Gelir</option>
                          <option value="Gider">Gider</option>
                        </select>
                      </td>

                      <td data-label="Kategori">
                        <select
                          aria-label="Kategori"
                          value={row.category}
                          onChange={(event) =>
                            updateRow(row.id, "category", event.target.value)
                          }
                        >
                          {categories.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td data-label="Cari">
                        <input
                          aria-label="Cari / firma adı"
                          value={row.counterparty}
                          placeholder="Firma adı"
                          onChange={(event) =>
                            updateRow(
                              row.id,
                              "counterparty",
                              event.target.value
                            )
                          }
                        />
                      </td>

                      <td data-label="Açıklama">
                        <input
                          aria-label="Açıklama"
                          value={row.description}
                          placeholder="Açıklama"
                          onChange={(event) =>
                            updateRow(row.id, "description", event.target.value)
                          }
                        />
                      </td>

                      <td data-label="Tutar">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="num"
                          aria-label="Tutar"
                          value={row.amount || ""}
                          placeholder="0,00"
                          onChange={(event) =>
                            updateRow(
                              row.id,
                              "amount",
                              Math.max(0, Number(event.target.value) || 0)
                            )
                          }
                        />
                      </td>

                      <td data-label="Tutar Tipi">
                        <select
                          aria-label="Girilen tutar KDV dahil mi"
                          value={row.vatIncluded ? "dahil" : "haric"}
                          onChange={(event) =>
                            updateRow(
                              row.id,
                              "vatIncluded",
                              event.target.value === "dahil"
                            )
                          }
                        >
                          <option value="dahil">KDV dahil</option>
                          <option value="haric">KDV hariç</option>
                        </select>
                      </td>

                      <td data-label="KDV Oranı">
                        <select
                          aria-label="KDV oranı"
                          value={row.vatRate}
                          onChange={(event) =>
                            updateRow(row.id, "vatRate", event.target.value)
                          }
                        >
                          {vatRates.map((rate) => (
                            <option key={rate} value={rate}>
                              %{rate}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="calc-cell" data-label="Matrah">
                        {money(base)}
                      </td>

                      <td className="calc-cell" data-label="KDV Tutarı">
                        {money(vat)}
                      </td>

                      <td
                        className="calc-cell calc-total"
                        data-label="Genel Toplam"
                      >
                        {money(gross)}
                      </td>

                      <td data-label="Ödeme">
                        <select
                          aria-label="Ödeme yöntemi"
                          value={row.payment}
                          onChange={(event) =>
                            updateRow(row.id, "payment", event.target.value)
                          }
                        >
                          {paymentMethods.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td data-label="Belge">
                        <select
                          aria-label="Belge türü"
                          value={row.documentType}
                          onChange={(event) =>
                            updateRow(
                              row.id,
                              "documentType",
                              event.target.value
                            )
                          }
                        >
                          {documentTypes.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td data-label="Belge No">
                        <input
                          aria-label="Belge numarası"
                          value={row.documentNo}
                          placeholder="Belge no"
                          onChange={(event) =>
                            updateRow(row.id, "documentNo", event.target.value)
                          }
                        />
                      </td>

                      <td data-label="Vade">
                        <input
                          type="date"
                          aria-label="Vade tarihi"
                          value={row.dueDate}
                          onChange={(event) =>
                            updateRow(row.id, "dueDate", event.target.value)
                          }
                        />

                        {late !== null && late > 0 && (
                          <span
                            className="tag tag-late"
                            style={{ marginTop: 4, display: "inline-block" }}
                          >
                            {late} gün gecikmiş
                          </span>
                        )}
                      </td>

                      <td data-label="Durum">
                        <select
                          aria-label="Tahsilat / ödeme durumu"
                          value={row.settled ? "tamam" : "bekliyor"}
                          onChange={(event) =>
                            updateRow(
                              row.id,
                              "settled",
                              event.target.value === "tamam"
                            )
                          }
                        >
                          <option value="tamam">
                            {row.type === "Gelir" ? "Tahsil Edildi" : "Ödendi"}
                          </option>
                          <option value="bekliyor">Bekliyor</option>
                        </select>
                      </td>

                      <td className="cell-delete">
                        <button
                          type="button"
                          className="row-delete"
                          onClick={() => removeRow(row.id)}
                          aria-label="Satırı sil"
                          title="Satırı sil"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {visibleRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={17}
                      style={{ padding: 30, textAlign: "center" }}
                    >
                      Bu dönemde kayıt yok. Dönem filtresini değiştirin veya
                      yeni kayıt ekleyin.
                    </td>
                  </tr>
                )}
              </tbody>

              {/* Tablonun altında sabit duran dönem toplamı */}
              {visibleRows.length > 0 && (
                <tfoot>
                  <tr>
                    <td className="sticky-col" colSpan={8} data-label="Dönem">
                      {period === "all"
                        ? "TÜM DÖNEMLER TOPLAMI"
                        : `${monthLabelOf(period).toUpperCase()} TOPLAMI`}
                    </td>

                    <td data-label="Matrah">
                      {money(totals.incomeBase - totals.expenseBase)}
                    </td>

                    <td data-label="KDV">
                      {money(totals.incomeVat - totals.expenseVat)}
                    </td>

                    <td data-label="Genel Toplam">
                      {money(totals.incomeGross - totals.expenseGross)}
                    </td>

                    <td className="cell-empty" colSpan={6} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          <p className="scroll-hint">
            ← Tabloyu yana kaydırarak belge, vade ve durum sütunlarına
            ulaşabilirsiniz.
          </p>

          {/* ===== SATIR EKLEME ===== */}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 14,
              alignItems: "center",
            }}
          >
            <button
              type="button"
              className="btn btn-green"
              style={{ padding: "11px 18px", borderRadius: 12, fontSize: 14 }}
              onClick={() => addRow("Gelir")}
            >
              + Gelir Ekle
            </button>

            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: "11px 18px", borderRadius: 12, fontSize: 14 }}
              onClick={() => addRow("Gider")}
            >
              + Gider Ekle
            </button>

            <span style={{ color: "var(--muted)", fontSize: 13 }}>
              Kayıtlarınız yalnızca bu tarayıcıda saklanır, sunucuya
              gönderilmez.
            </span>
          </div>

          {/* ===== ANALİZ PANELLERİ ===== */}

          <div className="panel-grid">
            {/* KDV ÖZETİ */}
            <div className="panel">
              <h3>KDV Özeti</h3>
              <p className="panel-sub">
                Beyan döneminde ödenecek veya sonraki aya devreden tutar.
              </p>

              <div className="panel-row">
                <span>Hesaplanan KDV (satış)</span>
                <span className="amount">{money(totals.incomeVat)}</span>
              </div>

              <div className="panel-row">
                <span>İndirilecek KDV (alış)</span>
                <span className="amount">{money(totals.expenseVat)}</span>
              </div>

              <div className="panel-row">
                <strong>
                  {totals.vatBalance >= 0 ? "Ödenecek KDV" : "Devreden KDV"}
                </strong>
                <strong
                  className="amount"
                  style={{
                    color:
                      totals.vatBalance > 0
                        ? "var(--danger)"
                        : "var(--brand-deep)",
                  }}
                >
                  {money(Math.abs(totals.vatBalance))}
                </strong>
              </div>
            </div>

            {/* ALACAK YAŞLANDIRMA */}
            <div className="panel">
              <h3>Alacak Yaşlandırma</h3>
              <p className="panel-sub">
                Tahsil edilmemiş satışların vade durumu.
              </p>

              <AgingRows data={aging.receivable} />
            </div>

            {/* BORÇ YAŞLANDIRMA */}
            <div className="panel">
              <h3>Borç Yaşlandırma</h3>
              <p className="panel-sub">Ödenmemiş alımların vade durumu.</p>

              <AgingRows data={aging.payable} />
            </div>

            {/* CARİ BAKİYE */}
            <div className="panel">
              <h3>Cari Bakiyeler</h3>
              <p className="panel-sub">
                Açık kayıtlara göre net alacak (+) / borç (−).
              </p>

              {counterpartyBalances.length === 0 ? (
                <p style={{ color: "var(--muted)", fontSize: 13, margin: 0 }}>
                  Bekleyen kayıt yok.
                </p>
              ) : (
                counterpartyBalances.map((item) => (
                  <div className="panel-row" key={item.name}>
                    <span>{item.name}</span>
                    <span
                      className="amount"
                      style={{
                        color:
                          item.net >= 0
                            ? "var(--brand-deep)"
                            : "var(--danger)",
                      }}
                    >
                      {money(item.net)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* GİDER DAĞILIMI */}
            <div className="panel">
              <h3>Gider Dağılımı</h3>
              <p className="panel-sub">
                KDV hariç tutarlara göre en büyük gider kalemleri.
              </p>

              {expenseByCategory.length === 0 ? (
                <p style={{ color: "var(--muted)", fontSize: 13, margin: 0 }}>
                  Henüz gider kaydı yok.
                </p>
              ) : (
                expenseByCategory.map((item) => (
                  <div key={item.name} style={{ padding: "8px 0" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        fontSize: 13,
                      }}
                    >
                      <span>{item.name}</span>
                      <span className="amount">
                        {money(item.value)} · {percent(item.share)}
                      </span>
                    </div>

                    <div className="bar bar-warn">
                      <span style={{ width: `${Math.min(item.share, 100)}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* KÂRLILIK */}
            <div className="panel">
              <h3>Kârlılık</h3>
              <p className="panel-sub">
                Tüm oranlar KDV hariç (matrah) tutarlar üzerinden.
              </p>

              <div className="panel-row">
                <span>Net kâr / zarar</span>
                <span
                  className="amount"
                  style={{
                    color:
                      totals.netProfit >= 0
                        ? "var(--brand-deep)"
                        : "var(--danger)",
                  }}
                >
                  {money(totals.netProfit)}
                </span>
              </div>

              <div className="panel-row">
                <span>Kâr marjı</span>
                <span className="amount">{percent(totals.margin)}</span>
              </div>

              <div className="panel-row">
                <span>Gider / gelir oranı</span>
                <span className="amount">
                  {percent(
                    totals.incomeBase > 0
                      ? (totals.expenseBase / totals.incomeBase) * 100
                      : 0
                  )}
                </span>
              </div>

              <div className="panel-row">
                <span>Başabaş noktası</span>
                <span className="amount">{money(totals.expenseBase)}</span>
              </div>
            </div>
          </div>

          {/* ===== YASAL UYARI ===== */}

          <p className="notice">
            <strong>Bilgilendirme:</strong> Bu araç bir ön muhasebe takip
            yardımcısıdır; resmî defter, e-beyanname veya mali müşavir
            hizmetinin yerine geçmez. KDV tutarları girdiğiniz oranlara göre
            hesaplanır; tevkifat, istisna ve özel matrah durumları kapsam
            dışıdır. Beyan öncesinde mali müşavirinizle doğrulayın.
          </p>
        </div>
      </div>

      {/* ===== PREMIUM MODALI ===== */}

      {showPremium && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="premium-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "grid",
            placeItems: "center",
            padding: 20,
            background: "rgba(13, 27, 20, .55)",
          }}
          onClick={() => setShowPremium(false)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              maxWidth: 440,
              width: "100%",
              padding: 28,
              borderRadius: "var(--r-lg)",
              background: "#fff",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 46 }} aria-hidden="true">
              💎
            </div>

            <h3 id="premium-title" style={{ margin: "10px 0 8px" }}>
              Ücretsiz kayıt limitine ulaştınız
            </h3>

            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
              Ücretsiz sürümde {FREE_ROW_LIMIT} kayıt tutabilirsiniz.
              Profesyonel Excel sürümünde sınırsız kayıt, yıllık dashboard ve
              hazır raporlar yer alır.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                justifyContent: "center",
                marginTop: 18,
              }}
            >
              <Link className="btn btn-green" href="/premium/on-muhasebe">
                Premium&apos;u İncele
              </Link>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowPremium(false)}
              >
                Devam Et
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   ALT BİLEŞENLER
========================================================= */

function Kpi({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
  note?: string;
  tone?: "pos" | "neg";
}) {
  const toneClass = tone === "pos" ? "kpi kpi-pos" : tone === "neg" ? "kpi kpi-neg" : "kpi";

  return (
    <div className={toneClass}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {note && <div className="kpi-note">{note}</div>}
    </div>
  );
}

function AgingRows({
  data,
}: {
  data: {
    notDue: number;
    d1: number;
    d31: number;
    d61: number;
    d90: number;
    noDueDate: number;
  };
}) {
  const items = [
    { label: "Vadesi gelmemiş", value: data.notDue, tag: "tag-ok" },
    { label: "1 – 30 gün gecikmiş", value: data.d1, tag: "tag-wait" },
    { label: "31 – 60 gün gecikmiş", value: data.d31, tag: "tag-wait" },
    { label: "61 – 90 gün gecikmiş", value: data.d61, tag: "tag-late" },
    { label: "90+ gün gecikmiş", value: data.d90, tag: "tag-late" },
    { label: "Vade girilmemiş", value: data.noDueDate, tag: "tag-wait" },
  ].filter((item) => item.value > 0);

  if (items.length === 0) {
    return (
      <p style={{ color: "var(--muted)", fontSize: 13, margin: 0 }}>
        Bekleyen kayıt yok.
      </p>
    );
  }

  return (
    <>
      {items.map((item) => (
        <div className="panel-row" key={item.label}>
          <span className={`tag ${item.tag}`}>{item.label}</span>
          <span className="amount">{money(item.value)}</span>
        </div>
      ))}
    </>
  );
}

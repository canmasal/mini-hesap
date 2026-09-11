"use client";

import { useMemo, useState } from "react";

import ResultRow from "./ResultRow";

/**
 * Emeklilik / EYT tarihi hesaplama (4a - SSK).
 *
 * Mevzuat üç ana gruba ayrılır:
 *
 *  A) Sigorta girişi 08.09.1999 ve öncesi  -> EYT kapsamı, yaş şartı yok
 *  B) 09.09.1999 - 30.04.2008 arası        -> Kadın 58 / Erkek 60 + 7000 gün
 *  C) 01.05.2008 ve sonrası                -> Kadın 58 / Erkek 60 + 7200 gün
 *                                             (2036'dan itibaren kademeli artış)
 */

type Gender = "kadin" | "erkek";

const DAY = 86400000;

/** ISO tarihten Date; geçersizse null */
function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const time = Date.parse(`${value}T00:00:00`);
  return Number.isNaN(time) ? null : new Date(time);
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY);
}

function addYears(date: Date, years: number) {
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + years);
  return next;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/**
 * 01.05.2008 sonrası girişliler için kademeli yaş tablosu.
 * Prim günü hangi yılda tamamlanırsa o yılın yaş şartı uygulanır.
 */
function stagedAge(gender: Gender, completionYear: number) {
  const table: { until: number; kadin: number; erkek: number }[] = [
    { until: 2035, kadin: 58, erkek: 60 },
    { until: 2037, kadin: 59, erkek: 61 },
    { until: 2039, kadin: 60, erkek: 62 },
    { until: 2041, kadin: 61, erkek: 63 },
    { until: 2043, kadin: 62, erkek: 64 },
    { until: 2045, kadin: 63, erkek: 65 },
    { until: 2047, kadin: 64, erkek: 65 },
  ];

  const row = table.find((item) => completionYear <= item.until);

  if (!row) return gender === "kadin" ? 65 : 65;
  return gender === "kadin" ? row.kadin : row.erkek;
}

export default function RetirementCalculator() {
  const [gender, setGender] = useState<Gender>("erkek");
  const [birthDate, setBirthDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [premiumDays, setPremiumDays] = useState("");
  /** Ayda kaç gün prim ödemeye devam ediliyor (çalışmaya devam varsayımı) */
  const [monthlyDays, setMonthlyDays] = useState("30");

  const result = useMemo(() => {
    const birth = parseDate(birthDate);
    const start = parseDate(startDate);
    const days = Number(premiumDays);
    const perMonth = Number(monthlyDays);

    if (
      !birth ||
      !start ||
      !premiumDays ||
      !Number.isFinite(days) ||
      days < 0 ||
      !Number.isFinite(perMonth) ||
      perMonth < 0 ||
      perMonth > 30
    ) {
      return null;
    }

    if (start <= birth) return { error: "Sigorta başlangıcı doğum tarihinden sonra olmalı." } as const;

    const eytLimit = new Date("1999-09-08T00:00:00");
    const reformLimit = new Date("2008-05-01T00:00:00");

    const today = new Date();

    /* ---------- GRUP BELİRLEME ---------- */

    let group: "A" | "B" | "C";
    if (start <= eytLimit) group = "A";
    else if (start < reformLimit) group = "B";
    else group = "C";

    /* ---------- ŞARTLAR ---------- */

    /* Sigortalılık süresi şartı (yıl) */
    const serviceYears =
      group === "A" ? (gender === "kadin" ? 20 : 25) : 0;

    /* Prim gün şartı */
    const requiredDays =
      group === "A" ? 5000 : group === "B" ? 7000 : 7200;

    /* ---------- PRİM GÜNÜ TAMAMLAMA ---------- */

    const missingDays = Math.max(requiredDays - days, 0);

    /* Kalan primi ne zaman tamamlar? */
    let premiumDoneDate: Date | null = null;

    if (missingDays === 0) {
      premiumDoneDate = today;
    } else if (perMonth > 0) {
      const monthsNeeded = Math.ceil(missingDays / perMonth);
      premiumDoneDate = new Date(today);
      premiumDoneDate.setMonth(premiumDoneDate.getMonth() + monthsNeeded);
    }

    /* ---------- SİGORTALILIK SÜRESİ ---------- */

    const serviceDoneDate =
      serviceYears > 0 ? addYears(start, serviceYears) : start;

    /* ---------- YAŞ ŞARTI ---------- */

    let requiredAge: number | null = null;
    let ageDoneDate: Date | null = null;

    if (group === "B") {
      requiredAge = gender === "kadin" ? 58 : 60;
      ageDoneDate = addYears(birth, requiredAge);
    } else if (group === "C") {
      const completionYear = (premiumDoneDate ?? today).getFullYear();
      requiredAge = stagedAge(gender, completionYear);
      ageDoneDate = addYears(birth, requiredAge);
    }

    /* ---------- EMEKLİLİK TARİHİ ---------- */

    const candidates = [serviceDoneDate];
    if (premiumDoneDate) candidates.push(premiumDoneDate);
    if (ageDoneDate) candidates.push(ageDoneDate);

    const retirementDate = premiumDoneDate
      ? new Date(Math.max(...candidates.map((d) => d.getTime())))
      : null;

    const eligibleNow =
      retirementDate !== null && retirementDate.getTime() <= today.getTime();

    const remainingDays = retirementDate
      ? Math.max(Math.ceil((retirementDate.getTime() - today.getTime()) / DAY), 0)
      : null;

    /* Bugünkü sigortalılık süresi */
    const serviceElapsedYears = Math.floor(
      (today.getTime() - start.getTime()) / (DAY * 365.25)
    );

    return {
      group,
      serviceYears,
      serviceElapsedYears,
      requiredDays,
      missingDays,
      requiredAge,
      ageDoneDate,
      serviceDoneDate,
      premiumDoneDate,
      retirementDate,
      eligibleNow,
      remainingDays,
      currentAge: Math.floor(
        (today.getTime() - birth.getTime()) / (DAY * 365.25)
      ),
    };
  }, [gender, birthDate, startDate, premiumDays, monthlyDays]);

  function handleClear() {
    setGender("erkek");
    setBirthDate("");
    setStartDate("");
    setPremiumDays("");
    setMonthlyDays("30");
  }

  const groupLabel =
    result && !("error" in result)
      ? result.group === "A"
        ? "EYT kapsamı (08.09.1999 ve öncesi giriş)"
        : result.group === "B"
          ? "09.09.1999 – 30.04.2008 arası giriş"
          : "01.05.2008 ve sonrası giriş"
      : "";

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Cinsiyet
          <select
            value={gender}
            onChange={(event) => setGender(event.target.value as Gender)}
          >
            <option value="erkek">Erkek</option>
            <option value="kadin">Kadın</option>
          </select>
        </label>

        <label className="field">
          Doğum Tarihi
          <input
            type="date"
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
          />
        </label>

        <label className="field">
          Sigorta Başlangıç Tarihi
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
          <span className="field-hint">
            SGK&apos;daki ilk işe giriş bildirgenizin tarihi.
          </span>
        </label>

        <label className="field">
          Toplam Prim Gün Sayısı
          <input
            type="number"
            min="0"
            step="1"
            value={premiumDays}
            onChange={(event) => setPremiumDays(event.target.value)}
            placeholder="5400"
          />
          <span className="field-hint">
            e-Devlet &gt; SGK Tescil ve Hizmet Dökümü ekranında yazar.
          </span>
        </label>

        <label className="field">
          Aylık Eklenecek Prim Günü
          <input
            type="number"
            min="0"
            max="30"
            step="1"
            value={monthlyDays}
            onChange={(event) => setMonthlyDays(event.target.value)}
          />
          <span className="field-hint">
            Çalışmaya devam ediyorsanız 30. Çalışmıyorsanız 0 yazın.
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

      {result && "error" in result && (
        <div className="notice notice-warn">{result.error}</div>
      )}

      {result && !("error" in result) && (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow label="Tabi Olduğunuz Grup" value={groupLabel} />

          {result.eligibleNow ? (
            <div className="notice notice-ok">
              <strong>Emeklilik şartlarını sağlıyor görünüyorsunuz.</strong>{" "}
              SGK&apos;ya başvurarak tahsis talebinde bulunabilirsiniz.
            </div>
          ) : result.retirementDate ? (
            <ResultRow
              label="Tahmini Emeklilik Tarihi"
              value={formatDate(result.retirementDate)}
              hint={
                result.remainingDays !== null
                  ? `Yaklaşık ${Math.floor(
                      result.remainingDays / 365
                    )} yıl ${Math.floor(
                      (result.remainingDays % 365) / 30
                    )} ay kaldı`
                  : undefined
              }
              highlight
            />
          ) : (
            <div className="notice notice-warn">
              Aylık eklenecek prim günü 0 olduğu için prim şartının ne zaman
              tamamlanacağı hesaplanamıyor. Çalışmaya devam edecekseniz 30
              yazın.
            </div>
          )}

          <ResultRow
            label="Gereken Prim Günü"
            value={`${result.requiredDays.toLocaleString("tr-TR")} gün`}
            hint={
              result.missingDays > 0
                ? `${result.missingDays.toLocaleString("tr-TR")} gün eksik`
                : "Prim şartı tamamlandı"
            }
            tone={result.missingDays > 0 ? "neg" : "pos"}
          />

          {result.serviceYears > 0 && (
            <ResultRow
              label="Gereken Sigortalılık Süresi"
              value={`${result.serviceYears} yıl`}
              hint={`Şu an ${result.serviceElapsedYears} yıl · şart ${formatDate(
                result.serviceDoneDate
              )} tarihinde dolar`}
            />
          )}

          {result.requiredAge !== null && result.ageDoneDate ? (
            <ResultRow
              label="Gereken Yaş"
              value={`${result.requiredAge}`}
              hint={`Şu an ${result.currentAge} yaşındasınız · şart ${formatDate(
                result.ageDoneDate
              )} tarihinde dolar`}
            />
          ) : (
            <ResultRow
              label="Yaş Şartı"
              value="Yok"
              hint="EYT düzenlemesi ile bu grupta yaş şartı aranmıyor"
              tone="pos"
            />
          )}

          <div className="notice notice-warn">
            <strong>Önemli:</strong> Bu sonuç 4a (SSK) kapsamındaki genel
            kurallara göre hesaplanan bir <strong>tahmindir</strong>.
            08.09.1999 öncesi girişlilerde prim gün şartı giriş tarihine göre
            5.000 ile 5.975 gün arasında kademeli değişebilir; askerlik
            borçlanması, yurt dışı borçlanması, 4b/4c hizmetleri, engellilik ve
            ağır işler gibi durumlar sonucu değiştirir. Kesin bilgi için
            e-Devlet üzerinden SGK <em>Emeklilik Tahsis Talebi</em> ekranını
            kullanın veya SGK&apos;ya başvurun.
          </div>
        </div>
      )}

      {!result && (
        <div className="notice">
          Cinsiyetinizi, doğum tarihinizi, sigorta başlangıç tarihinizi ve
          toplam prim gün sayınızı girin. Hangi emeklilik grubuna girdiğinizi
          ve tahmini emeklilik tarihinizi hesaplayalım.
        </div>
      )}
    </div>
  );
}

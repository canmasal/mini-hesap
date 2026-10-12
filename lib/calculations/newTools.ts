/**
 * Yedi yeni aracın hesap motoru: kripto kâr/zarar, sosyal medya etkileşim
 * oranı, YouTube geliri, araç değer kaybı, elektrikli araç şarj maliyeti,
 * araç toplam sahip olma maliyeti karşılaştırması ve market birim fiyatı.
 *
 * Fonksiyonlar saf (yan etkisiz) tutuldu; bileşenler yalnızca girdi toplar
 * ve sonucu gösterir. Böylece formüller tek yerde test edilebilir.
 */

const round2 = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100;

/* ------------------------------------------------------------------ */
/* Kripto: ortalama maliyet ve kâr/zarar                               */
/* ------------------------------------------------------------------ */

export type CryptoBuy = { quantity: number; price: number };

export function cryptoPosition(input: {
  buys: CryptoBuy[];
  currentPrice: number;
  /** İşlem başına komisyon oranı (0,001 = %0,1) */
  feeRate: number;
  targetPrice?: number;
}) {
  const buys = input.buys.filter((b) => b.quantity > 0 && b.price > 0);
  const fee = Math.max(0, input.feeRate);
  const quantity = buys.reduce((s, b) => s + b.quantity, 0);
  if (!buys.length || quantity <= 0) return null;

  /* Alış komisyonu maliyete eklenir */
  const grossCost = buys.reduce((s, b) => s + b.quantity * b.price, 0);
  const buyFees = grossCost * fee;
  const totalCost = grossCost + buyFees;
  const averageCost = totalCost / quantity;

  const valueAt = (price: number) => {
    const gross = quantity * price;
    const sellFee = gross * fee;
    const net = gross - sellFee;
    const profit = net - totalCost;
    return {
      gross: round2(gross),
      sellFee: round2(sellFee),
      net: round2(net),
      profit: round2(profit),
      profitPercent: round2((profit / totalCost) * 100),
    };
  };

  /* Satış komisyonu düşüldükten sonra zararsız çıkış fiyatı */
  const breakEven = totalCost / (quantity * (1 - fee));

  return {
    quantity,
    grossCost: round2(grossCost),
    buyFees: round2(buyFees),
    totalCost: round2(totalCost),
    averageCost,
    breakEven,
    current: input.currentPrice > 0 ? valueAt(input.currentPrice) : null,
    target: input.targetPrice && input.targetPrice > 0 ? valueAt(input.targetPrice) : null,
  };
}

/* ------------------------------------------------------------------ */
/* Sosyal medya etkileşim oranı                                        */
/* ------------------------------------------------------------------ */

export function engagementRate(input: {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  followers: number;
  reach?: number;
  posts?: number;
}) {
  const interactions =
    Math.max(0, input.likes) +
    Math.max(0, input.comments) +
    Math.max(0, input.shares) +
    Math.max(0, input.saves);
  const posts = Math.max(1, Math.trunc(input.posts || 1));
  if (input.followers <= 0) return null;

  const perPost = interactions / posts;
  const byFollowers = (perPost / input.followers) * 100;
  const byReach = input.reach && input.reach > 0 ? (perPost / (input.reach / posts)) * 100 : null;

  /* Kaba yorum aralıkları; platforma ve hesap büyüklüğüne göre değişir */
  const level =
    byFollowers < 1 ? "Düşük" : byFollowers < 3 ? "Ortalama" : byFollowers < 6 ? "İyi" : "Çok yüksek";

  return {
    interactions,
    posts,
    perPost: round2(perPost),
    byFollowers: round2(byFollowers),
    byReach: byReach === null ? null : round2(byReach),
    level,
  };
}

/* ------------------------------------------------------------------ */
/* YouTube geliri                                                      */
/* ------------------------------------------------------------------ */

/** YouTube İş Ortağı Programı: uzun videoların reklam gelirinde içerik üreticisi payı */
export const YOUTUBE_CREATOR_SHARE = 0.55;

export function youtubeRevenue(
  input:
    | { mode: "rpm"; views: number; rpm: number }
    | { mode: "cpm"; views: number; cpm: number; monetizedRate: number },
) {
  if (input.views <= 0) return null;
  let monthly: number;
  let effectiveRpm: number;
  if (input.mode === "rpm") {
    if (input.rpm <= 0) return null;
    effectiveRpm = input.rpm;
    monthly = (input.views / 1000) * input.rpm;
  } else {
    if (input.cpm <= 0) return null;
    const monetized = Math.min(Math.max(input.monetizedRate, 0), 1);
    const monetizedViews = input.views * monetized;
    monthly = (monetizedViews / 1000) * input.cpm * YOUTUBE_CREATOR_SHARE;
    effectiveRpm = (monthly / input.views) * 1000;
  }
  return {
    monthly: round2(monthly),
    daily: round2(monthly / 30),
    yearly: round2(monthly * 12),
    perThousand: round2(effectiveRpm),
  };
}

/* ------------------------------------------------------------------ */
/* Araç değer kaybı (azalan bakiyeler)                                 */
/* ------------------------------------------------------------------ */

export function vehicleDepreciation(input: {
  price: number;
  /** İlk yıl kayıp oranı (0,2 = %20) */
  firstYearRate: number;
  /** Sonraki yıllar için yıllık kayıp oranı */
  yearlyRate: number;
  years: number;
}) {
  const years = Math.min(Math.max(Math.trunc(input.years), 1), 30);
  if (input.price <= 0) return null;
  const rows: { year: number; loss: number; value: number; totalLossPercent: number }[] = [];
  let value = input.price;
  for (let y = 1; y <= years; y += 1) {
    const rate = Math.min(Math.max(y === 1 ? input.firstYearRate : input.yearlyRate, 0), 0.95);
    const loss = value * rate;
    value -= loss;
    rows.push({
      year: y,
      loss: round2(loss),
      value: round2(value),
      totalLossPercent: round2(((input.price - value) / input.price) * 100),
    });
  }
  const totalLoss = input.price - value;
  return {
    rows,
    finalValue: round2(value),
    totalLoss: round2(totalLoss),
    totalLossPercent: round2((totalLoss / input.price) * 100),
    averageYearlyLoss: round2(totalLoss / years),
  };
}

/* ------------------------------------------------------------------ */
/* Elektrikli araç şarj maliyeti ve yakıtlı araçla karşılaştırma       */
/* ------------------------------------------------------------------ */

export function evChargingCost(input: {
  batteryKwh: number;
  /** kWh / 100 km */
  consumption: number;
  homePrice: number;
  fastPrice: number;
  /** Hızlı (DC) şarj payı, 0–1 */
  fastShare: number;
  /** Şarj kaybı, 0–1 (prizden çekilen enerjinin bataryaya ulaşmayan kısmı) */
  chargingLoss: number;
  yearlyKm: number;
  /** Karşılaştırılan yakıtlı araç: L / 100 km */
  fuelConsumption: number;
  fuelPrice: number;
}) {
  if (input.consumption <= 0 || input.homePrice <= 0 || input.yearlyKm <= 0) return null;
  const share = Math.min(Math.max(input.fastShare, 0), 1);
  const loss = Math.min(Math.max(input.chargingLoss, 0), 0.5);
  const fastPrice = input.fastPrice > 0 ? input.fastPrice : input.homePrice;
  const blendedPrice = input.homePrice * (1 - share) + fastPrice * share;

  /* Bataryaya giren 1 kWh için şebekeden 1 / (1 - kayıp) kWh çekilir */
  const gridPerKwh = 1 / (1 - loss);
  const evPer100 = input.consumption * gridPerKwh * blendedPrice;
  const fuelPer100 =
    input.fuelConsumption > 0 && input.fuelPrice > 0 ? input.fuelConsumption * input.fuelPrice : null;

  const evYearly = (evPer100 * input.yearlyKm) / 100;
  const fuelYearly = fuelPer100 === null ? null : (fuelPer100 * input.yearlyKm) / 100;

  return {
    range: input.batteryKwh > 0 ? round2((input.batteryKwh / input.consumption) * 100) : null,
    fullChargeHome: input.batteryKwh > 0 ? round2(input.batteryKwh * gridPerKwh * input.homePrice) : null,
    fullChargeFast: input.batteryKwh > 0 ? round2(input.batteryKwh * gridPerKwh * fastPrice) : null,
    blendedPrice: round2(blendedPrice),
    evPerKm: round2(evPer100 / 100),
    evPer100: round2(evPer100),
    fuelPer100: fuelPer100 === null ? null : round2(fuelPer100),
    evYearly: round2(evYearly),
    fuelYearly: fuelYearly === null ? null : round2(fuelYearly),
    yearlySaving: fuelYearly === null ? null : round2(fuelYearly - evYearly),
  };
}

/* ------------------------------------------------------------------ */
/* Araç karşılaştırma: toplam sahip olma maliyeti                      */
/* ------------------------------------------------------------------ */

export type VehicleInput = {
  name: string;
  price: number;
  /** 100 km'de tüketim (L veya kWh) */
  consumption: number;
  /** Litre veya kWh birim fiyatı */
  energyPrice: number;
  /** Yıllık sigorta + kasko */
  insurance: number;
  /** Yıllık MTV */
  tax: number;
  /** Yıllık bakım + lastik */
  maintenance: number;
  /** Elde tutma süresi sonunda satış değeri, alış fiyatına oranla (0–1) */
  resaleRate: number;
};

export function vehicleTco(v: VehicleInput, years: number, yearlyKm: number) {
  const y = Math.min(Math.max(Math.trunc(years), 1), 30);
  if (v.price <= 0 || yearlyKm <= 0) return null;
  const energyYearly = (v.consumption * v.energyPrice * yearlyKm) / 100;
  const runningYearly = energyYearly + v.insurance + v.tax + v.maintenance;
  const resale = v.price * Math.min(Math.max(v.resaleRate, 0), 1.5);
  const depreciation = v.price - resale;
  const total = depreciation + runningYearly * y;
  return {
    energyYearly: round2(energyYearly),
    runningYearly: round2(runningYearly),
    resale: round2(resale),
    depreciation: round2(depreciation),
    total: round2(total),
    monthly: round2(total / (y * 12)),
    perKm: round2(total / (y * yearlyKm)),
  };
}

/* ------------------------------------------------------------------ */
/* Market birim fiyat karşılaştırma                                    */
/* ------------------------------------------------------------------ */

export type UnitKind = "g" | "kg" | "ml" | "l" | "adet";

const UNIT_BASE: Record<UnitKind, { base: "kg" | "l" | "adet"; factor: number }> = {
  g: { base: "kg", factor: 0.001 },
  kg: { base: "kg", factor: 1 },
  ml: { base: "l", factor: 0.001 },
  l: { base: "l", factor: 1 },
  adet: { base: "adet", factor: 1 },
};

export type UnitItem = { name: string; price: number; amount: number; unit: UnitKind; packs?: number };

export function unitPrices(items: UnitItem[]) {
  const rows = items
    .map((item, index) => {
      const packs = Math.max(1, Math.trunc(item.packs || 1));
      if (item.price <= 0 || item.amount <= 0) return null;
      const { base, factor } = UNIT_BASE[item.unit];
      const baseAmount = item.amount * factor * packs;
      return {
        index,
        name: item.name || `Ürün ${index + 1}`,
        base,
        baseAmount,
        unitPrice: item.price / baseAmount,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  if (rows.length < 1) return null;

  /* Farklı ölçü türleri (kg ile litre gibi) birbiriyle kıyaslanmaz */
  const bases = new Set(rows.map((r) => r.base));
  const comparable = bases.size === 1;
  const sorted = [...rows].sort((a, b) => a.unitPrice - b.unitPrice);
  const cheapest = sorted[0];
  const priciest = sorted[sorted.length - 1];

  return {
    rows: rows.map((r) => ({
      ...r,
      unitPrice: round2(r.unitPrice),
      /* En ucuza göre ne kadar pahalı */
      overCheapestPercent: comparable ? round2(((r.unitPrice - cheapest.unitPrice) / cheapest.unitPrice) * 100) : null,
    })),
    comparable,
    cheapestIndex: comparable ? cheapest.index : null,
    savingPercent: comparable && rows.length > 1 ? round2(((priciest.unitPrice - cheapest.unitPrice) / priciest.unitPrice) * 100) : null,
  };
}

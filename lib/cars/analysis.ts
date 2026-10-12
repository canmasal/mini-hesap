/**
 * İki araç için veriden üretilen Türkçe değerlendirme metni.
 * Yalnızca iki araçta da bulunan alanlar yorumlanır; eksik veri için
 * cümle kurulmaz.
 */

import type { CarVersion } from "@/data/cars/types";

const n0 = (v: number) => v.toLocaleString("tr-TR", { maximumFractionDigits: 0 });
const n1 = (v: number) => v.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const name = (c: CarVersion) => `${c.brand} ${c.model}`;
const both = (a?: number, b?: number): a is number => typeof a === "number" && typeof b === "number";

export function pairAnalysis(a: CarVersion, b: CarVersion) {
  const out: { heading: string; text: string }[] = [];

  if (both(a.priceTl, b.priceTl)) {
    const diff = Math.abs(a.priceTl - b.priceTl!);
    const cheaper = a.priceTl <= b.priceTl! ? a : b;
    const pct = (diff / Math.max(a.priceTl, b.priceTl!)) * 100;
    out.push({
      heading: "Fiyat",
      text:
        diff === 0
          ? `İki aracın liste fiyatı aynı: ${n0(a.priceTl)} TL.`
          : `${name(cheaper)} (${cheaper.version}), ${n0(diff)} TL (%${n1(pct)}) daha uygun liste fiyatıyla öne çıkıyor. ${name(a)} ${n0(a.priceTl)} TL, ${name(b)} ${n0(b.priceTl!)} TL.`,
    });
  }

  const perf: string[] = [];
  if (both(a.powerHp, b.powerHp) && a.powerHp !== b.powerHp) {
    const s = a.powerHp > b.powerHp! ? a : b;
    const w = s === a ? b : a;
    perf.push(`${name(s)} ${s.powerHp} HP gücüyle, ${w.powerHp} HP olan ${name(w)} modeline göre ${s.powerHp! - w.powerHp!} HP daha güçlü.`);
  }
  if (both(a.torqueNm, b.torqueNm) && a.torqueNm !== b.torqueNm) {
    const s = a.torqueNm > b.torqueNm! ? a : b;
    perf.push(`Tork tarafında ${name(s)} ${s.torqueNm} Nm ile önde; bu, özellikle ara hızlanmalarda ve yüklü sürüşte fark yaratır.`);
  }
  if (both(a.accel, b.accel) && a.accel !== b.accel) {
    const s = a.accel < b.accel! ? a : b;
    perf.push(`0-100 km/s hızlanmayı ${name(s)} ${n1(s.accel!)} saniyede tamamlıyor (diğeri ${n1((s === a ? b : a).accel!)} sn).`);
  }
  if (perf.length) out.push({ heading: "Performans", text: perf.join(" ") });

  const eco: string[] = [];
  if (both(a.consumption, b.consumption) && a.consumption !== b.consumption) {
    const s = a.consumption < b.consumption! ? a : b;
    const w = s === a ? b : a;
    const yearly = ((w.consumption! - s.consumption!) * 15000) / 100;
    eco.push(`WLTP değerlerine göre ${name(s)} 100 km'de ${n1(s.consumption!)} L ile daha az yakıyor; yılda 15.000 km'de bu yaklaşık ${n0(yearly)} litre fark demek.`);
  }
  if (a.fuel === "Elektrik" || b.fuel === "Elektrik") {
    const ev = a.fuel === "Elektrik" ? a : b;
    if (ev.rangeKm) eco.push(`${name(ev)} elektrikli; WLTP menzili ${n0(ev.rangeKm)} km${ev.batteryKwh ? `, batarya kapasitesi ${n1(ev.batteryKwh)} kWh` : ""}. Evde şarj imkânınız varsa kilometre başı enerji maliyeti belirgin şekilde düşer.`);
  }
  if (eco.length) out.push({ heading: "Tüketim ve verimlilik", text: eco.join(" ") });

  const space: string[] = [];
  if (both(a.trunkL, b.trunkL) && a.trunkL !== b.trunkL) {
    const s = a.trunkL > b.trunkL! ? a : b;
    space.push(`Bagajda ${name(s)} ${s.trunkL} litre ile ${Math.abs(a.trunkL - b.trunkL!)} litre daha geniş.`);
  }
  if (both(a.lengthMm, b.lengthMm) && a.lengthMm !== b.lengthMm) {
    const l = a.lengthMm > b.lengthMm! ? a : b;
    space.push(`${name(l)} ${n0(Math.abs(a.lengthMm - b.lengthMm!))} mm daha uzun; şehir içi park kolaylığı isteyenler kısa olanı, iç hacim isteyenler uzun olanı tercih edebilir.`);
  }
  if (both(a.wheelbaseMm, b.wheelbaseMm) && a.wheelbaseMm !== b.wheelbaseMm) {
    const l = a.wheelbaseMm > b.wheelbaseMm! ? a : b;
    space.push(`Aks mesafesi daha uzun olan ${name(l)}, genellikle arka koltukta daha fazla diz mesafesi sunar.`);
  }
  if (space.length) out.push({ heading: "İç hacim ve ölçüler", text: space.join(" ") });

  return out;
}

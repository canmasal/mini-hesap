import type { Body, CarVersion } from "@/data/cars/types";
import { carPhoto } from "@/data/cars/images";

/*
 * Araç görseli. Lisansı doğrulanmış serbest fotoğraf (data/cars/images.ts)
 * varsa o, yoksa kasa tipine göre siteye özel yan profil çizimi gösterilir.
 * Çizim marka rengine boyanır; hiçbir üretici görseli kopyalanmaz.
 */

type Shape = {
  nose: number; tail: number; bottom: number; belt: number; roof: number;
  aBase: number; aTop: number; roofEnd: number; cBase: number; deck?: number;
  wheelR: number; wheelF: number; wheelB: number; open?: boolean;
};

const SHAPES: Record<Body, Shape> = {
  Hatchback:       { nose: 26, tail: 284, bottom: 100, belt: 66, roof: 36, aBase: 92, aTop: 124, roofEnd: 236, cBase: 270, wheelR: 19, wheelF: 76, wheelB: 236 },
  Sedan:           { nose: 18, tail: 302, bottom: 100, belt: 66, roof: 38, aBase: 94, aTop: 128, roofEnd: 208, cBase: 250, deck: 62, wheelR: 19, wheelF: 72, wheelB: 248 },
  "Station Wagon": { nose: 18, tail: 302, bottom: 100, belt: 66, roof: 37, aBase: 92, aTop: 126, roofEnd: 272, cBase: 296, wheelR: 19, wheelF: 72, wheelB: 248 },
  Crossover:       { nose: 22, tail: 292, bottom: 98, belt: 62, roof: 32, aBase: 92, aTop: 126, roofEnd: 228, cBase: 278, wheelR: 21, wheelF: 76, wheelB: 240 },
  SUV:             { nose: 20, tail: 296, bottom: 96, belt: 58, roof: 24, aBase: 90, aTop: 122, roofEnd: 262, cBase: 290, wheelR: 22, wheelF: 76, wheelB: 244 },
  MPV:             { nose: 22, tail: 292, bottom: 98, belt: 60, roof: 20, aBase: 74, aTop: 112, roofEnd: 278, cBase: 290, wheelR: 20, wheelF: 70, wheelB: 244 },
  Coupe:           { nose: 18, tail: 300, bottom: 100, belt: 66, roof: 40, aBase: 104, aTop: 142, roofEnd: 196, cBase: 262, deck: 64, wheelR: 19, wheelF: 72, wheelB: 248 },
  Cabrio:          { nose: 26, tail: 284, bottom: 100, belt: 66, roof: 44, aBase: 100, aTop: 122, roofEnd: 0, cBase: 0, wheelR: 19, wheelF: 76, wheelB: 236, open: true },
  "Pick-up":       { nose: 18, tail: 304, bottom: 94, belt: 58, roof: 26, aBase: 88, aTop: 118, roofEnd: 186, cBase: 194, deck: 58, wheelR: 23, wheelF: 72, wheelB: 252 },
};

/* Markaya sabit, sakin bir gövde rengi */
const BRAND_COLORS: Record<string, string> = {
  Renault: "#d9a520", Toyota: "#b42318", Togg: "#3b5bdb", Fiat: "#9f1239", Hyundai: "#1d4ed8",
  Volkswagen: "#1e3a8a", Kia: "#334155", "Škoda": "#15803d", Opel: "#a16207", Peugeot: "#1f2937",
  "Citroën": "#be123c", Nissan: "#6b7280", Ford: "#1e40af", Dacia: "#4d7c0f", MINI: "#0f766e",
  SEAT: "#b91c1c", CUPRA: "#92400e", MG: "#7f1d1d",
};

function Illustration({ body, color, title }: { body: Body; color: string; title: string }) {
  const s = SHAPES[body] ?? SHAPES.Hatchback;
  const deck = s.deck ?? s.belt;
  const lower = `M${s.nose},${s.bottom - 8} Q${s.nose - 2},${s.belt + 10} ${s.nose + 16},${s.belt + 4} L${s.aBase},${s.belt}`;
  const cabin = s.open
    ? `L${s.aTop},${s.roof} L${s.aTop + 6},${s.roof + 2} L${s.aBase + 34},${s.belt} L${s.tail - 20},${s.belt}`
    : `L${s.aTop},${s.roof} L${s.roofEnd},${s.roof} L${s.cBase},${deck}${s.deck ? ` L${s.tail - 8},${deck}` : ""}`;
  const rear = `Q${s.tail + 2},${deck + 2} ${s.tail},${deck + 16} L${s.tail},${s.bottom - 8} Q${s.tail},${s.bottom} ${s.tail - 8},${s.bottom} L${s.nose + 8},${s.bottom} Q${s.nose},${s.bottom} ${s.nose},${s.bottom - 8} Z`;
  const glass = s.open
    ? `M${s.aTop + 2},${s.roof + 4} L${s.aTop + 5},${s.roof + 5} L${s.aBase + 30},${s.belt - 2} L${s.aBase + 12},${s.belt - 2} Z`
    : `M${s.aBase + 10},${s.belt - 3} L${s.aTop + 4},${s.roof + 5} L${s.roofEnd - 2},${s.roof + 5} L${s.cBase - 9},${(s.deck ?? s.belt) - 3} Z`;
  const pillarX = s.open ? 0 : Math.round(s.aTop + (s.roofEnd - s.aTop) * 0.48);
  const wheel = (cx: number) => (
    <g key={cx}>
      <circle cx={cx} cy={s.bottom} r={s.wheelR + 5} fill="var(--car-arch, #eef3f0)" />
      <circle cx={cx} cy={s.bottom} r={s.wheelR} fill="#1f2a24" />
      <circle cx={cx} cy={s.bottom} r={s.wheelR * 0.55} fill="#c9d3cd" />
      <circle cx={cx} cy={s.bottom} r={s.wheelR * 0.18} fill="#1f2a24" />
    </g>
  );
  return (
    <svg viewBox="0 0 320 132" role="img" aria-label={title} className="car-illus">
      <ellipse cx="160" cy={s.bottom + s.wheelR + 4} rx="140" ry="6" fill="rgba(16,35,26,.10)" />
      <path d={`${lower} ${cabin} ${rear}`} fill={color} stroke={color} strokeWidth="4" strokeLinejoin="round" />
      <path d={glass} fill="#dbe7f0" />
      {pillarX > 0 && <rect x={pillarX - 3} y={s.roof + 4} width="6" height={s.belt - s.roof} fill={color} />}
      <path d={`M${s.nose + 20},${s.belt + 12} L${s.tail - 14},${s.belt + 12}`} stroke="rgba(255,255,255,.28)" strokeWidth="2" />
      <rect x={s.nose + 2} y={s.belt + 8} width="12" height="6" rx="3" fill="#fde68a" />
      <rect x={s.tail - 10} y={deck + 8} width="9" height="7" rx="3" fill="#ef4444" />
      {[s.wheelF, s.wheelB].map(wheel)}
    </svg>
  );
}

export default function CarVisual({ car }: { car: CarVersion }) {
  const name = `${car.brand} ${car.model}`;
  const photo = carPhoto(car.brand, car.model);
  if (photo) {
    return (
      <figure className="car-visual car-visual-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.src} alt={name} loading="lazy" decoding="async" />
        <figcaption>
          <a href={photo.page} target="_blank" rel="noopener noreferrer nofollow">
            {photo.author} · {photo.license}
          </a>
        </figcaption>
      </figure>
    );
  }
  return (
    <figure className="car-visual">
      <Illustration body={car.body} color={BRAND_COLORS[car.brand] ?? "#475569"} title={`${name} (${car.body.toLocaleLowerCase("tr-TR")} kasa, temsilî çizim)`} />
      <figcaption>Temsilî {car.body.toLocaleLowerCase("tr-TR")} çizimi</figcaption>
    </figure>
  );
}

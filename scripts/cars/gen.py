import re, sys, json, unicodedata

src, out = sys.argv[1], sys.argv[2]

BODY = {
 "Peugeot": {"Rifter":"MPV","e-208":"Hatchback","e-2008":"SUV","2008":"SUV","308":"Hatchback","408":"Crossover","Traveller":"MPV","3008":"SUV","e-3008":"SUV","5008":"SUV","e-5008":"SUV"},
 "Opel": {"Corsa":"Hatchback","Corsa Electric":"Hatchback","Combo":"MPV","Combo Electric":"MPV","Frontera":"SUV","Frontera Electric":"SUV","Mokka":"Crossover","Mokka GSE":"Crossover","Astra":"Hatchback","Grandland":"SUV","Grandland Electric":"SUV","Zafira":"MPV"},
 "Citroën": {"ë-C3":"Hatchback","Berlingo":"MPV","ë-C3 Aircross":"SUV","C4":"Hatchback","C4 X":"Sedan","ë-C4":"Hatchback","ë-C4 X":"Sedan","C3 Aircross":"SUV","C5 Aircross":"SUV","ë-C5 Aircross":"SUV","Spacetourer":"MPV"},
 "Kia": {"Picanto":"Hatchback","EV2":"Crossover","Stonic":"Crossover","XCeed":"Crossover","Sportage":"SUV","Niro EV":"Crossover","Seltos":"SUV","EV3":"SUV","EV6":"Crossover","Sorento":"SUV","EV9":"SUV"},
 "Škoda": {"Fabia":"Hatchback","Kamiq":"Crossover","Scala":"Hatchback","Octavia":"Sedan","Octavia Combi":"Station Wagon","Elroq":"SUV","Karoq":"SUV","Superb":"Sedan","Superb Combi":"Station Wagon","Kodiaq":"SUV","Enyaq":"SUV","Enyaq Coupé":"SUV"},
 "Dacia": {"Logan":"Sedan","Sandero":"Hatchback","Jogger":"MPV","Sandero Stepway":"Crossover"},
 "Volkswagen": {"Taigo":"Crossover","Golf":"Hatchback","T-Cross":"Crossover","T-Roc":"SUV","ID.4":"SUV","Tayron":"SUV","Tiguan":"SUV","Passat":"Station Wagon","ID.7":"Sedan","Golf GTI":"Hatchback","Golf R":"Hatchback","Touareg":"SUV"},
 "Hyundai": {"Inster":"Crossover","Bayon":"Crossover","Ioniq 3":"Crossover","i30":"Hatchback","Kona":"SUV","Kona Electric":"SUV","Staria":"MPV","Tucson":"SUV","Ioniq 6":"Sedan","Ioniq 5":"SUV","Ioniq 9":"SUV","Santa Fe":"SUV"},
 "Nissan": {"Juke":"Crossover","Qashqai":"SUV","Townstar Combi":"MPV","X-Trail":"SUV"},
 "Ford": {"Puma":"Crossover","Puma Gen-E":"Crossover","Explorer":"SUV","Kuga":"SUV","Tourneo Courier":"MPV","Capri":"SUV","Focus Sedan":"Sedan"},
 "MG": {"ZS":"SUV","HS":"SUV","MG7":"Sedan"},
 "SEAT": {"Ibiza":"Hatchback","Arona":"Crossover","Leon":"Hatchback","Ateca":"SUV"},
 "CUPRA": {"Leon":"Hatchback","Formentor":"Crossover","Terramar":"SUV"},
 "MINI": {"Cooper 5 Kapı":"Hatchback","Cooper 3 Kapı":"Hatchback","Cooper S 3 Kapı":"Hatchback","Cooper S Cabrio":"Cabrio","John Cooper Works":"Hatchback","John Cooper Works Cabrio":"Cabrio","Countryman C":"SUV","Countryman S ALL4":"SUV","JCW Countryman ALL4":"SUV","Countryman E":"SUV","Countryman SE ALL4":"SUV"},
}
SLUG = {"Škoda":"skoda","Citroën":"citroen"}
STELLANTIS = {"Peugeot","Opel","Citroën"}

def slug(s):
    s = s.replace("ı","i").replace("ë","e").replace("İ","i")
    s = unicodedata.normalize("NFKD", s).encode("ascii","ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+","-",s).strip("-")

def ts(v):
    return json.dumps(v, ensure_ascii=False)

rows, seen, ids = [], set(), set()
for line in open(src, encoding="utf-8"):
    line = line.strip()
    if not line: continue
    brand, model, trim, fuel, gear, eng, hp, price = line.split(";")
    body = BODY[brand][model]
    t = re.sub(r"^Yeni\s+", "", trim)
    t = re.sub(r"^" + re.escape(model) + r"\s+", "", t, flags=re.I)
    t = re.sub(r"\bALLURE\b", "Allure", t).replace("hp*", " HP").replace("hp", " HP").replace("145*", "145")
    t = re.sub(r"\s+", " ", t).strip()
    if brand == "Škoda" and eng:
        tech = {"Benzin": "TSI", "Hafif Hibrit": "e-TEC", "Dizel": "TDI"}[fuel]
        t = f"{eng} {tech} {hp} PS DSG {t}"
    up = t.upper()
    rec = {"id": "", "brand": brand, "model": model, "version": t, "year": 2026, "body": body}
    if fuel == "Hibrit" and brand in STELLANTIS: fuel = "Hafif Hibrit"
    rec["fuel"] = fuel
    if hp: rec["powerHp"] = int(hp)
    else:
        m = re.search(r"(\d+(?:,\d+)?)\s*kW", t)
        if m: rec["powerHp"] = round(float(m.group(1).replace(",", ".")) * 1.35962)
    if fuel == "Elektrik":
        rec["transmission"] = "Tek vitesli otomatik"
    elif "EDCS6" in up or "E-DCT6" in up:
        rec["transmission"] = "e-DCS6 (çift kavramalı otomatik)"; rec["gears"] = 6
    elif "EAT8" in up or "AT8" in up:
        rec["transmission"] = "8 ileri otomatik"; rec["gears"] = 8
    elif gear == "DSG": rec["transmission"] = "DSG (çift kavramalı otomatik)"
    elif gear == "DCT" or " DCT" in up: rec["transmission"] = "DCT (çift kavramalı otomatik)"
    elif gear == "AMT": rec["transmission"] = "AMT (yarı otomatik)"
    elif "E-POWER" in up: rec["transmission"] = "Tek vitesli otomatik (e-POWER)"
    elif gear == "Manuel":
        rec["transmission"] = "Manuel"
        if "MT6" in up or "6MT" in up or "6 İLERI" in up or "6 İLERİ" in up: rec["gears"] = 6
    elif gear == "Otomatik": rec["transmission"] = "Otomatik"
    if re.search(r"4X4|AWD|4MOTION|ALL4", up) or "ALL4" in model.upper() or model == "Golf R":
        rec["drive"] = "Dört çeker"
    m = re.search(r"(\d+)\s*kWh", t)
    if m: rec["batteryKwh"] = int(m.group(1))
    m = re.search(r"(\d)\s*(?:koltuk|Koltuk)", t)
    if m: rec["seats"] = int(m.group(1))
    elif "8+1" in t: rec["seats"] = 9
    rec["priceTl"] = int(price); rec["priceMonth"] = "2026-10"
    key = (brand, model, t, fuel, eng, hp)
    if key in seen: continue
    seen.add(key)
    base = slug(f"{brand} {model} {t}")
    i, cid = 2, base
    while cid in ids: cid = f"{base}-{i}"; i += 1
    ids.add(cid); rec["id"] = cid
    rec["_eng"] = eng
    rows.append(rec)

order = ["id","brand","model","version","year","body","fuel","powerHp","transmission","gears","drive","batteryKwh","seats","priceTl","priceMonth"]
brands = []
for r in rows:
    if r["brand"] not in brands: brands.append(r["brand"])

lines = ['import type { CarVersion } from "./types";', "",
 "/*",
 " * Ekim 2026 liste fiyatları (kampanyasız, ÖTV ve KDV dahil) — araclo.com marka",
 " * fiyat listelerinden. Bu dosyadaki kayıtlar fiyat, yakıt, güç ve şanzıman",
 " * bilgisini taşır; ölçü, tüketim ve performans verileri üretici teknik",
 " * belgelerinden doğrulandıkça markanın kendi dosyasına taşınır. Ticari",
 " * araçlar (panelvan, kamyonet, minibüs) kapsam dışıdır. kW olarak verilen",
 " * elektrik motoru güçleri 1 kW = 1,36 PS ile çevrilmiştir.",
 " */", "", 'const M = "2026-10";', "",
 "const src = (slug: string) => [`https://www.araclo.com/${slug}-sifir-arac-fiyatlari`] as const;", ""]
for b in brands:
    var = slug(b).replace("-", "_")
    lines.append(f"const {var}Src = src({ts(SLUG.get(b, slug(b)))});")
lines.append("")
lines.append("export const catalog: CarVersion[] = [")
for b in brands:
    var = slug(b).replace("-", "_")
    lines.append(f"  /* {b} */")
    for r in [x for x in rows if x["brand"] == b]:
        parts = []
        for k in order:
            if k not in r: continue
            if k == "priceMonth": parts.append("priceMonth: M"); continue
            v = r[k]
            parts.append(f"{k}: {ts(v) if not isinstance(v, int) else (format(v, '_') if v >= 10000 else v)}")
        parts.append(f"sources: {var}Src")
        lines.append("  { " + ", ".join(parts) + " },")
lines.append("];")
open(out, "w", encoding="utf-8").write("\n".join(lines) + "\n")
from collections import Counter
print(len(rows), "versions", len({(r['brand'], r['model']) for r in rows}), "models", Counter(r['brand'] for r in rows))

# Araç fiyat kataloğu

`araclo.csv` → `data/cars/catalog.ts` (Renault, Toyota, Togg, Fiat ve Hyundai i20 hariç; onlar kendi dosyalarında).

Satır biçimi: `marka;model;versiyon;yakıt;şanzıman(Manuel|Otomatik|DSG|DCT|AMT);motor_l;beygir;liste_fiyatı_tl`
Kaynak: https://www.araclo.com/sifir-arac-fiyatlari (marka sayfaları: `/sifir-arac-fiyatlari/ekim-2026-<marka>-sifir-arac-fiyatlari`).
Ticari araçlar (Van, Cargo, Kamyonet, Minibüs, Ami) eklenmez. Fiyat = indirimsiz liste fiyatı.

Yeniden üretmek için:

    python3 -I scripts/cars/gen.py scripts/cars/araclo.csv data/cars/catalog.ts

Yeni modelin kasa tipini `gen.py` içindeki `BODY` sözlüğüne ekleyin. Ay değişince `gen.py` içindeki "2026-10" değerini güncelleyin.
Mevcut kimlikler (`id`) `data/cars/pairs.ts` içinde kullanılıyor; versiyon adını değiştirmek kimliği değiştirir, çiftleri kontrol edin.

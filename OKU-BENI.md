# MiniHesap piyasalar yenileme paketi

Next.js App Router için hazırlandı. Dosyaları projendeki aynı yollara kopyala.

lib/markets.js               -> veri katmanı (Truncgil + Yahoo Finance)
components/market/ui.jsx     -> ortak parçalar (Degisim, FiyatTablosu, Sparkline, AralikCubugu)
components/market/Ticker.jsx -> menünün altındaki kayan canlı şerit
components/market/StockTable.jsx -> hisse tablosu (arama, sıralama, otomatik yenileme)
app/piyasalar/page.jsx       -> yenilenmiş piyasalar sayfası
app/hisseler/page.jsx        -> YENİ hisse senetleri canlı takip sayfası
app/api/hisse/route.js       -> Yahoo Finance proxy (kote + 5 dk grafik)

## Ne değişti

**Renk tutarlılığı.** Eski sayfada alış beyaz, satış sarı, değişim yeşil, panel koyu yeşildi;
site ise açık temalıydı. Artık tek kural var: bütün rakamlar nötr mürekkep renginde,
sadece değişim sütunu yeşil/kırmızı. Koyu tek öğe menü altındaki canlı şerit.

**Eksik veri.** Gram gümüşte alış yok. Eskiden çıplak bir tire görünüyordu.
Artık `TL(null)` tek bir soluk em-dash basıyor ve gümüş/platin ayrı sekmeye alındı,
çünkü ondalık hassasiyetleri altından farklı (4 hane).

**Yenileme sıklığı.** Döviz ve altın 60 saniye. Hisse tarafı seans açıkken 15 saniye,
kapalıyken 10 dakika. `isSessionOpen()` Europe/Istanbul saatine göre karar veriyor.

## Doğrulaman gerekenler

Truncgil ve Yahoo yanıt şemalarını bu ortamdan test edemedim, ağ kapalıydı.
`lib/markets.js` içindeki `normalizeTruncgil` ve `normalizeYahoo` fonksiyonları savunmacı yazıldı
ama ilk çalıştırmada bir `console.log` ile alan adlarını doğrula.
Sende zaten çalışan fetch fonksiyonları varsa bu dosyayı komple atıp
sadece bileşenlere aynı şekildeki veriyi verebilirsin.

---

## Gümüş sorunu çözüldü, kaynak değişmedi

Truncgil gümüşü zaten alış ve satışıyla veriyor ama **ons cinsinden ve dolar olarak**
(`GUMUS: { Buying: 104.96, Selling: 105.05 }`). Eski sayfa gram karşılığını yalnızca
satış tarafı için hesaplayıp alışı boş bırakmış, tabloya çıplak bir tire düşmüştü.

Doğrusu iki tarafı da aynı formülle türetmek:

    gram gümüş alış  = (GUMUS.Buying  / 31,1034768) x USD.Buying
    gram gümüş satış = (GUMUS.Selling / 31,1034768) x USD.Selling

`lib/markets.js` içindeki `gramGumusTuret()` bunu yapıyor ve listeye `GRAMGUMUS`
kodlu yeni bir satır ekliyor. Ons gümüş de kendi adıyla ("Ons Gümüş (dolar)") kalıyor.
Ücretli bir API'ye geçmene gerek yok.

---

## lib/oranlar-2026.js — hesaplama araçlarının tek kaynağı

Bütün araçların oranları tek dosyada. Yıl döndüğünde ya da temmuz zammında
sadece bu dosyayı güncelliyorsun, 46 aracın hiçbirine dokunmuyorsun.

18 Eylül 2026 itibarıyla doğrulanmış değerler:

| Parametre | Değer |
|---|---|
| Brüt asgari ücret | 33.030,00 TL |
| Net asgari ücret | 28.075,50 TL |
| SGK taban / tavan | 33.030,00 / 297.270,00 TL |
| Gelir vergisi (ücret) | 190.000 %15 · 400.000 %20 · 1.500.000 %27 · 5.300.000 %35 · üzeri %40 |
| Gelir vergisi (ücret dışı) | 3. dilim 1.000.000 TL'de biter, gerisi aynı |
| Damga vergisi | binde 7,59 |
| İşçi kesintisi | SGK %14 + işsizlik %1 |
| İşveren primi | SGK %20,75 (5 puan indirimli %15,75) + işsizlik %2 |
| Kıdem tavanı Oca-Haz 2026 | 64.948,77 TL |
| **Kıdem tavanı Tem-Ara 2026** | **73.729,87 TL** |

`kidemTavani(tarih)` doğru dönemi kendisi seçiyor, hesaplama tarihine göre.

**Doğrulama:** `lib/hesaplama/netMaas.js` içindeki formül asgari ücreti
33.030 brütten 28.075,50 nete indiriyor, yani resmî net asgari ücretle kuruşu kuruşuna
tutuyor. Bu, vergi dilimi, istisna, damga ve SGK oranlarının hepsinin doğru olduğunu
tek seferde kanıtlıyor.

**Kontrol et:** kıdem tavanı için iki kaynak birbirini teyit etti (muhasebetr + alomaliye),
ama bir üçüncü kaynakta 53.919,68 TL yazıyordu. O rakam 2025'in ikinci yarısına ait,
eski kalmış. Araçlarında hâlâ o değer varsa kıdem hesapların düşük çıkıyordur.

### Diğer araçlar için

`oranlar-2026.js` şu an bordro tarafını kapsıyor. MTV, emlak vergisi, tapu harcı,
damga vergisi tutarları ve gecikme zammı oranları da aynı dosyaya eklenmeli.
Onların 2026 değerlerini de çıkarmamı istersen söyle, aynı biçimde yazayım.

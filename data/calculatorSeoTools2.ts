/**
 * İkinci araç grubunun SEO içerikleri: VKİ, gebelik haftası, kalori,
 * netten brüte maaş, vize-final, tapu harcı, kâr marjı.
 */

import type { ToolSeo } from "@/data/calculatorSeo";
import { MINIMUM_WAGE, PARAMETERS_YEAR as Y, tl } from "@/data/parameters";

export const toolSeoBatch2: Record<string, ToolSeo> = {
  /* ======================== VKİ ======================== */
  "vucut-kitle-indeksi": {
    title: "VKİ Hesaplama | Vücut Kitle İndeksi, İdeal Kilo",
    description:
      "Vücut kitle indeksi (VKİ/BMI) hesaplama: boy ve kilonuzu girin, VKİ değerinizi, zayıf-normal-obez sınıfınızı ve boyunuza göre ideal kilo aralığınızı öğrenin.",
    intro:
      "Vücut kitle indeksi (VKİ), kilonuzun boyunuza göre sağlıklı aralıkta olup olmadığını gösteren en yaygın ölçüttür. Hesaplayıcı VKİ değerinizi, Dünya Sağlık Örgütü sınıflamasındaki yerinizi ve boyunuza uygun ideal kilo aralığını gösterir.",
    howItWorks: [
      "Boyunuzu santimetre olarak girin.",
      "Kilonuzu kilogram olarak girin.",
      "VKİ değeriniz, sınıfınız ve ideal kilo aralığınız anında hesaplanır.",
    ],
    sections: [
      {
        heading: "VKİ nasıl hesaplanır?",
        body: [
          "VKİ = <strong>Kilo (kg) ÷ Boy² (m)</strong>",
          "Örnek: 1,70 m boyunda ve 72 kg ağırlığındaki biri için VKİ = 72 ÷ (1,70 × 1,70) = 72 ÷ 2,89 = <strong>24,9</strong>. Bu değer normal aralığın üst sınırındadır.",
        ],
      },
      {
        heading: "VKİ değerleri ne anlama gelir?",
        body: [
          "Dünya Sağlık Örgütü'nün yetişkinler için sınıflaması:",
          "- 18,5'in altı: <strong>Zayıf</strong>",
          "- 18,5 – 24,9: <strong>Normal kilolu</strong>",
          "- 25 – 29,9: <strong>Fazla kilolu</strong>",
          "- 30 – 34,9: <strong>Obez (1. derece)</strong>",
          "- 35 – 39,9: <strong>Obez (2. derece)</strong>",
          "- 40 ve üzeri: <strong>Obez (3. derece)</strong>",
        ],
      },
      {
        heading: "Boya göre ideal kilo aralığı",
        body: [
          "İdeal kilo aralığı, VKİ'nin 18,5 ile 24,9 arasında kaldığı kilolardır:",
          "- 155 cm: 44,4 – 59,8 kg",
          "- 160 cm: 47,4 – 63,7 kg",
          "- 165 cm: 50,4 – 67,8 kg",
          "- 170 cm: 53,5 – 72,0 kg",
          "- 175 cm: 56,7 – 76,3 kg",
          "- 180 cm: 59,9 – 80,7 kg",
          "- 185 cm: 63,3 – 85,2 kg",
        ],
      },
      {
        heading: "VKİ'nin sınırları",
        body: [
          "VKİ kas ve yağ ayrımı yapmaz; kaslı sporcularda fazla kilolu, yaşlılarda ise olduğundan düşük sonuç verebilir. Bel çevresi de önemli bir göstergedir: kadınlarda 88 cm, erkeklerde 102 cm üzeri bel çevresi artmış sağlık riskine işaret eder.",
          "Çocuk ve ergenlerde yaşa ve cinsiyete göre persentil tabloları kullanılır; gebelikte VKİ ile değerlendirme yapılmaz.",
        ],
      },
    ],
    faqs: [
      { question: "Normal VKİ değeri kaçtır?", answer: "Yetişkinlerde 18,5 ile 24,9 arasındaki VKİ değerleri normal kabul edilir." },
      { question: "170 cm için ideal kilo kaç?", answer: "170 cm boy için VKİ'nin normal aralıkta kaldığı kilo yaklaşık 53,5 – 72 kg arasıdır." },
      { question: "VKİ 30 obez mi?", answer: "Evet. Dünya Sağlık Örgütü sınıflamasına göre VKİ 30 ve üzeri obezite olarak değerlendirilir." },
    ],
  },

  /* ======================== GEBELİK ======================== */
  "gebelik-haftasi": {
    title: "Gebelik Haftası Hesaplama | Tahmini Doğum Tarihi",
    description:
      "Gebelik haftası hesaplama: son adet tarihinizi girin; kaçıncı haftada olduğunuzu, tahmini doğum tarihinizi ve trimester dönemlerinizi hemen öğrenin.",
    intro:
      "Gebelik haftası hesaplayıcısı, son adet tarihinizin ilk gününe göre kaç haftalık gebe olduğunuzu ve bebeğinizin tahmini doğum tarihini hesaplar. Adet döngünüz 28 günden farklıysa sonuç buna göre düzeltilir.",
    howItWorks: [
      "Son adet tarihinizin ilk gününü seçin.",
      "Adet döngünüz 28 günden farklıysa ortalama döngü sürenizi yazın.",
      "Gebelik haftanız, tahmini doğum tarihiniz ve trimester tarihleri görünür.",
    ],
    sections: [
      {
        heading: "Tahmini doğum tarihi nasıl hesaplanır?",
        body: [
          "Doktorların da kullandığı <strong>Naegele kuralına</strong> göre tahmini doğum tarihi, son adet tarihinin ilk gününe <strong>280 gün (40 hafta)</strong> eklenerek bulunur.",
          "Pratik yol: son adet tarihine 7 gün ekleyin, 3 ay geri gidin ve bir yıl ekleyin. Örneğin son adet tarihi 10 Mart ise tahmini doğum 17 Aralık civarıdır.",
          "Adet döngüsü 28 günden uzun veya kısaysa aradaki fark kadar tarih ileri veya geri kaydırılır.",
        ],
      },
      {
        heading: "Gebelik haftaları neden son adetten sayılır?",
        body: [
          "Döllenme günü genellikle kesin bilinmediği için gebelik süresi son adet tarihinden başlatılır. Bu nedenle ilk iki hafta aslında gebelik öncesi döneme denk gelir; döllenme ortalama 2. haftanın sonunda gerçekleşir.",
        ],
      },
      {
        heading: "Trimester dönemleri",
        body: [
          "- <strong>1. trimester:</strong> 1 – 13. haftalar. Organ gelişiminin başladığı dönemdir.",
          "- <strong>2. trimester:</strong> 14 – 27. haftalar. Bebeğin hareketleri hissedilmeye başlar.",
          "- <strong>3. trimester:</strong> 28. haftadan doğuma kadar. Bebek hızla kilo alır.",
          "38 ile 42. haftalar arasındaki doğumlar zamanında doğum kabul edilir; 37. haftadan önceki doğumlar erken doğumdur.",
        ],
      },
    ],
    faqs: [
      { question: "Tahmini doğum tarihi kesin midir?", answer: "Hayır. Bebeklerin yalnızca küçük bir kısmı tam tahmini tarihte doğar. Kesin gebelik yaşı ilk trimesterde yapılan ultrason ölçümüyle belirlenir." },
      { question: "Gebelik kaç hafta sürer?", answer: "Son adet tarihinden itibaren ortalama 40 hafta (280 gün) sürer. 38–42. haftalar arasındaki doğumlar zamanında kabul edilir." },
      { question: "Hangi haftada kaç aylık gebeyim?", answer: "Kabaca 4,3 hafta bir aya denk gelir: 13. hafta yaklaşık 3 ay, 26. hafta 6 ay, 40. hafta 9 aydır." },
    ],
  },

  /* ======================== KALORİ ======================== */
  "kalori-ihtiyaci": {
    title: "Günlük Kalori İhtiyacı Hesaplama | BMH ve Makro",
    description:
      "Günlük kalori ihtiyacı hesaplama: yaş, boy, kilo ve aktivitenize göre bazal metabolizmanızı, kilo verme kalorinizi ve makro besin miktarlarınızı bulun.",
    intro:
      "Kalori hesaplayıcı, bazal metabolizma hızınızı Mifflin–St Jeor denklemiyle hesaplar ve aktivite düzeyinize göre günlük enerji ihtiyacınızı bulur. Kilo vermek, korumak veya almak hedefinize göre günlük kalori ve makro besin miktarlarınızı gösterir.",
    howItWorks: [
      "Cinsiyet, yaş, boy ve kilonuzu girin.",
      "Aktivite düzeyinizi ve hedefinizi seçin.",
      "Günlük kaloriniz, bazal metabolizmanız ve makro dağılımınız hesaplanır.",
    ],
    sections: [
      {
        heading: "Bazal metabolizma hızı (BMH) formülü",
        body: [
          "Mifflin–St Jeor denklemi günümüzde en doğru kabul edilen BMH formülüdür:",
          "- <strong>Erkek:</strong> 10 × kilo + 6,25 × boy − 5 × yaş + 5",
          "- <strong>Kadın:</strong> 10 × kilo + 6,25 × boy − 5 × yaş − 161",
          "Örnek: 30 yaşında, 165 cm, 65 kg bir kadın için BMH = 650 + 1.031,25 − 150 − 161 = <strong>1.370 kcal</strong>.",
        ],
      },
      {
        heading: "Aktivite katsayıları",
        body: [
          "Günlük ihtiyaç = BMH × aktivite katsayısı",
          "- Hareketsiz: 1,2",
          "- Az hareketli (haftada 1–3 gün spor): 1,375",
          "- Orta hareketli (haftada 3–5 gün): 1,55",
          "- Çok hareketli (haftada 6–7 gün): 1,725",
          "- Aşırı hareketli: 1,9",
          "Örnekteki kadın az hareketliyse kilo korumak için günlük ihtiyacı 1.370 × 1,375 ≈ <strong>1.884 kcal</strong>'dir.",
        ],
      },
      {
        heading: "Kilo vermek için kaç kalori almalıyım?",
        body: [
          "Yaklaşık 1 kg yağ 7.700 kcal enerjiye denk gelir. Günlük ihtiyacınızdan 500 kcal eksik almak haftada yaklaşık 0,5 kg kayıp sağlar.",
          "Kadınlarda 1.200, erkeklerde 1.500 kcal'nin altındaki diyetler yalnızca uzman gözetiminde uygulanmalıdır; hesaplayıcı hedefi bu sınırların altına düşürmez.",
        ],
      },
      {
        heading: "Makro besin dağılımı",
        body: [
          "Protein ve karbonhidrat gram başına 4 kcal, yağ 9 kcal enerji verir. Hesaplayıcı kilo başına 1,8 g protein, kalorinin %25'i kadar yağ ve kalan enerjiyi karbonhidrat olarak dağıtır; bu dağılım düzenli egzersiz yapan yetişkinler için yaygın bir başlangıç noktasıdır.",
        ],
      },
    ],
    faqs: [
      { question: "Günlük kaç kalori almalıyım?", answer: "Yetişkin kadınlarda ortalama 1.800–2.200, erkeklerde 2.200–2.800 kcal'dir; ancak yaş, boy, kilo ve aktiviteye göre değiştiği için hesaplayıcıyla kişisel değerinizi bulun." },
      { question: "Bazal metabolizma hızı nedir?", answer: "Vücudun hiç hareket etmeden, yalnızca yaşamsal işlevleri sürdürmek için harcadığı günlük enerjidir." },
      { question: "Haftada kaç kilo vermek sağlıklıdır?", answer: "Genellikle haftada 0,5–1 kg kayıp sağlıklı ve sürdürülebilir kabul edilir." },
    ],
  },

  /* ======================== NETTEN BRÜTE ======================== */
  "netten-brute-maas": {
    title: `Netten Brüte Maaş Hesaplama ${Y} | Brüt Maaş`,
    description: `Netten brüte maaş hesaplama ${Y}: istediğiniz net maaşı girin; işverenin ödemesi gereken brüt ücreti, SGK ve vergi kesintilerini anında görün.`,
    intro:
      "Netten brüte maaş hesaplayıcısı, iş görüşmesinde konuşulan veya elinize geçmesini istediğiniz net tutarın bordroda hangi brüt ücrete karşılık geldiğini bulur. Hesap, brütten nete hesapla aynı güncel vergi dilimlerini, asgari ücret istisnalarını ve SGK tavanını kullanır.",
    howItWorks: [
      "Elinize geçmesini istediğiniz net maaşı yazın.",
      "Hesaplama ayını seçin; yıl içinde vergi dilimi değişir.",
      "Ocak dışındaki aylar için önceki kümülatif vergi matrahınızı girin.",
    ],
    sections: [
      {
        heading: "Netten brüte hesap neden doğrudan yapılamaz?",
        body: [
          "Gelir vergisi kademeli olduğu ve asgari ücret istisnası uygulandığı için net ile brüt arasında sabit bir oran yoktur. Bu yüzden hesaplayıcı, istenen neti veren brütü deneme yoluyla bulur ve brütten nete hesapla birebir tutarlı sonuç verir.",
          `Örnek: ${Y} ocak ayında net ${tl(MINIMUM_WAGE.net)} alan birinin brüt ücreti ${tl(MINIMUM_WAGE.gross)}'dir (asgari ücret).`,
        ],
      },
      {
        heading: "Aynı net maaş yıl içinde neden daha yüksek brüt gerektirir?",
        body: [
          "Kümülatif vergi matrahı biriktikçe üst vergi dilimine geçilir. Net maaşın sabit kalması isteniyorsa, işverenin yılın ikinci yarısında daha yüksek brüt ödemesi gerekir. Bu nedenle net maaş üzerinden anlaşmalarda brüt ücret aydan aya değişebilir.",
        ],
      },
      {
        heading: "İş görüşmesinde brüt mü net mi konuşmalı?",
        body: [
          "Sözleşmeler ve bordro brüt ücret üzerinden düzenlenir. Net maaşta anlaştıysanız bunun sözleşmeye yazılmasını isteyin; aksi hâlde vergi dilimi değiştiğinde eline geçen tutar düşebilir.",
        ],
      },
    ],
    faqs: [
      { question: "Netten brüte nasıl hesaplanır?", answer: "Vergi kademeli olduğu için basit bir çarpanla hesaplanamaz. İstenen neti veren brüt tutar, brütten nete hesap tersine çözülerek bulunur." },
      { question: `${Y} net asgari ücretin brütü ne kadar?`, answer: `Net ${tl(MINIMUM_WAGE.net)} asgari ücretin brütü ${tl(MINIMUM_WAGE.gross)}'dir.` },
      { question: "Net maaşım yıl içinde neden düşüyor?", answer: "Kümülatif vergi matrahı üst dilime geçtiğinde gelir vergisi artar ve aynı brüt maaşın neti azalır." },
    ],
  },

  /* ======================== VİZE FİNAL ======================== */
  "vize-final-ortalama": {
    title: "Vize Final Hesaplama | Finalden Kaç Almalıyım?",
    description:
      "Vize final hesaplama: vize notu ve ağırlığını girin; dersi geçmek için finalden kaç almanız gerektiğini veya dönem sonu ortalamanızı görün.",
    intro:
      "Vize–final hesaplayıcı, üniversitede dönem sonu ortalamanızı ve dersi geçmek için finalden almanız gereken en düşük notu hesaplar. Vize ağırlığı, geçme ortalaması ve final alt sınırı üniversiteden üniversiteye değiştiği için hepsini kendiniz ayarlayabilirsiniz.",
    howItWorks: [
      "Vize notunuzu girin.",
      "Vize ağırlığını, geçme ortalamasını ve final alt sınırını ders izlencesine göre ayarlayın.",
      "Final notunu boş bırakırsanız gereken final notu, doldurursanız ortalamanız hesaplanır.",
    ],
    sections: [
      {
        heading: "Vize final ortalaması formülü",
        body: [
          "Ortalama = Vize × vize ağırlığı + Final × final ağırlığı",
          "Örnek (vize %40, final %60): Vize 45, final 60 → 45 × 0,40 + 60 × 0,60 = 18 + 36 = <strong>54</strong>.",
        ],
      },
      {
        heading: "Finalden kaç almalıyım?",
        body: [
          "Gereken final = (Geçme ortalaması − Vize × vize ağırlığı) ÷ Final ağırlığı",
          "Örnek: Vize 45, vize ağırlığı %40, geçme ortalaması 50 → (50 − 18) ÷ 0,60 = <strong>53,3</strong>.",
          "Üniversiteniz finalden en az 50 almayı şart koşuyorsa, ortalama tutsa bile finalin 50'nin altında kalması dersten kalmanıza yol açar.",
        ],
      },
      {
        heading: "Harf notu ve bağıl değerlendirme",
        body: [
          "Birçok üniversitede ortalama doğrudan harf notuna çevrilmez; sınıfın başarı dağılımına göre bağıl değerlendirme yapılır. Bu yüzden aynı ortalama farklı derslerde farklı harf notuna denk gelebilir. Kesin geçme koşulları için bölümünüzün yönetmeliğine bakın.",
        ],
      },
    ],
    faqs: [
      { question: "Vize 40 final 60 hesabı nasıl yapılır?", answer: "Vize notu 0,40 ile, final notu 0,60 ile çarpılıp toplanır. Örneğin vize 50, final 70 ise ortalama 20 + 42 = 62 olur." },
      { question: "Vize 30 aldım, finalden kaç almalıyım?", answer: "Vize %40 ağırlıklı ve geçme ortalaması 50 ise (50 − 12) ÷ 0,60 = 63,3 almanız gerekir." },
      { question: "Final alt sınırı ne demek?", answer: "Ortalamanız tutsa bile finalden belirli bir notun (genellikle 45 veya 50) altında alırsanız dersten kalmanızdır." },
    ],
  },

  /* ======================== TAPU HARCI ======================== */
  "tapu-harci": {
    title: `Tapu Harcı Hesaplama ${Y} | Alıcı ve Satıcı Payı`,
    description: `Tapu harcı hesaplama ${Y}: satış bedelini girin, alıcı ve satıcının ödeyeceği %2'lik harcı, toplam %4 tapu harcını ve döner sermaye dahil tapu masrafını görün.`,
    intro:
      "Tapu harcı hesaplayıcısı, konut veya işyeri alım satımında tapuda ödenecek harcı ve toplam masrafı hesaplar. Harcın yasal paylaşımına veya tamamının alıcı tarafından ödenmesine göre iki senaryoyu karşılaştırabilirsiniz.",
    howItWorks: [
      "Tapuda beyan edilecek satış bedelini girin.",
      "Harcın yasal paylaşımla mı yoksa tamamen alıcı tarafından mı ödeneceğini seçin.",
      "İlinize göre döner sermaye ücretini düzenleyin.",
    ],
    sections: [
      {
        heading: "Tapu harcı nasıl hesaplanır?",
        body: [
          "Satışta tapu harcı, beyan edilen satış bedeli üzerinden <strong>alıcıdan binde 20 (%2)</strong> ve <strong>satıcıdan binde 20 (%2)</strong> olmak üzere toplam <strong>%4</strong> olarak alınır.",
          "Örnek: 3.000.000 TL'lik konutta alıcı 60.000 TL, satıcı 60.000 TL harç öder; toplam tapu harcı 120.000 TL'dir.",
          "Uygulamada harcın tamamının alıcı tarafından ödenmesi yaygındır; bu tamamen tarafların anlaşmasına bağlıdır.",
        ],
      },
      {
        heading: "Düşük bedel beyanının riskleri",
        body: [
          "Tapuda gerçek satış bedelinden düşük değer yazmak harç tasarrufu gibi görünse de sonradan tespit edildiğinde eksik harç, vergi ziyaı cezası ve gecikme faizi ile birlikte tahsil edilir. Ayrıca satıcı açısından değer artış kazancı vergisi, alıcı açısından ise ileride satarken kazanç hesabı olumsuz etkilenir.",
        ],
      },
      {
        heading: "Tapu dışındaki masraflar",
        body: [
          "- <strong>Döner sermaye ücreti:</strong> tapu işlemi hizmet bedeli; il ve işlem türüne göre değişir.",
          "- <strong>DASK:</strong> zorunlu deprem sigortası; tapu işleminden önce yaptırılmalıdır.",
          "- <strong>Ekspertiz:</strong> kredi kullanılıyorsa banka tarafından istenir.",
          "- <strong>Emlakçı komisyonu:</strong> genellikle satış bedelinin %2'si + KDV (alıcı ve satıcıdan ayrı).",
        ],
      },
    ],
    faqs: [
      { question: "Tapu harcını kim öder?", answer: "Kanuna göre alıcı ve satıcı %2'şer öder. Taraflar harcın tamamının alıcı tarafından ödenmesi konusunda anlaşabilir." },
      { question: "Tapu harcı yüzde kaç?", answer: "Satışta toplam %4'tür: alıcıdan %2, satıcıdan %2." },
      { question: "Tapu harcı neye göre hesaplanır?", answer: "Tapuda beyan edilen gerçek satış bedeli üzerinden hesaplanır; bu bedel gerçek değerin altında olamaz." },
    ],
  },

  /* ======================== KÂR MARJI ======================== */
  "kar-marji": {
    title: "Kâr Marjı Hesaplama | Kâr Oranı ve Satış Fiyatı",
    description:
      "Kâr marjı hesaplama: maliyet ve satış fiyatıyla kâr marjınızı ve kâr oranınızı bulun; hedef marjınıza göre KDV dahil satış fiyatınızı hesaplayın.",
    intro:
      "Kâr marjı hesaplayıcısı, ürün veya hizmetinizin satış fiyatından ne kadar kâr ettiğinizi hem kâr marjı hem kâr oranı olarak gösterir. Hedef bir kâr marjınız varsa, maliyete göre olması gereken satış fiyatını KDV dahil olarak hesaplar.",
    howItWorks: [
      "Hesaplama türünü seçin: fiyattan marj bulma veya hedef marjdan fiyat bulma.",
      "KDV hariç birim maliyetinizi girin.",
      "Satış fiyatınızı veya hedef kâr marjınızı girin ve KDV oranını seçin.",
    ],
    sections: [
      {
        heading: "Kâr marjı ve kâr oranı farkı",
        body: [
          "- <strong>Kâr marjı</strong> = Kâr ÷ Satış fiyatı × 100",
          "- <strong>Kâr oranı (markup)</strong> = Kâr ÷ Maliyet × 100",
          "Örnek: Maliyeti 700 TL olan ürün 1.000 TL'ye satılıyorsa kâr 300 TL'dir. Kâr marjı 300 ÷ 1.000 = <strong>%30</strong>, kâr oranı 300 ÷ 700 = <strong>%42,9</strong>'dur.",
          "İkisini karıştırmak fiyatlamada en sık yapılan hatadır: maliyete %30 eklemek %30 kâr marjı sağlamaz.",
        ],
      },
      {
        heading: "Hedef kâr marjına göre satış fiyatı",
        body: [
          "Satış fiyatı = Maliyet ÷ (1 − Hedef marj)",
          "Örnek: 700 TL maliyetli üründe %30 marj için satış fiyatı 700 ÷ 0,70 = <strong>1.000 TL</strong>'dir. Maliyete %30 eklenseydi fiyat 910 TL olur ve gerçek marj yalnızca %23 kalırdı.",
        ],
      },
      {
        heading: "KDV ve komisyonları unutmayın",
        body: [
          "Kâr marjı KDV hariç tutarlar üzerinden hesaplanmalıdır; KDV işletmenin geliri değildir. Pazaryeri komisyonu, kargo ve ödeme altyapısı kesintileri de maliyete eklenmelidir; aksi hâlde kâğıt üzerindeki marj gerçekleşmez.",
        ],
      },
    ],
    faqs: [
      { question: "Kâr marjı nasıl hesaplanır?", answer: "Satış fiyatından maliyet çıkarılır, sonuç satış fiyatına bölünüp 100 ile çarpılır." },
      { question: "%30 kâr marjı için maliyete yüzde kaç eklenmeli?", answer: "Maliyete yaklaşık %42,9 eklenmelidir. Formül: satış fiyatı = maliyet ÷ 0,70." },
      { question: "İyi bir kâr marjı kaçtır?", answer: "Sektöre göre değişir: perakendede %5–15, e-ticarette %20–40, yazılım ve hizmet işlerinde daha yüksek marjlar görülür." },
    ],
  },
};

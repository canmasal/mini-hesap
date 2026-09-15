/**
 * Finans ve günlük hesaplama rehberleri: yüzde, indirim, kira artışı,
 * yaş, mevduat, taksit maliyeti, enflasyon, yakıt, BES, kredi.
 *
 * Faiz, stopaj ve katkı oranları sık değiştiği için örneklerde kullanılan
 * oranlar açıkça örnek olarak belirtilir.
 */

import type { Guide } from "@/data/guides";

export const finansGuides: Guide[] = [
  /* =======================================================
     YÜZDE
  ======================================================= */
  {
    slug: "yuzde-hesaplama-nasil-yapilir",
    title: "Yüzde Hesaplama Nasıl Yapılır?",
    metaTitle: "Yüzde Hesaplama Nasıl Yapılır? Formüller",
    description:
      "Bir sayının yüzdesi, yüzde artış ve azalış, iki sayı arasındaki yüzde fark. Akılda kalan formüller ve günlük hayattan örnekler.",
    category: "Günlük",
    icon: "%",
    published: "2026-09-13",
    updated: "2026-09-13",
    readingMinutes: 4,
    tool: { slug: "yuzde", label: "Yüzde Hesaplama" },
    intro:
      "Yüzde, bir miktarın 100 üzerinden ne kadarına karşılık geldiğini gösterir. Zam, indirim, faiz, vergi ve not ortalaması gibi günlük hesapların neredeyse hepsi dört temel yüzde formülüne dayanır. Bu rehberde dördünü de örnekle anlatıyoruz.",
    sections: [
      {
        heading: "1. Bir sayının yüzdesi",
        body: [
          "Sonuç = Sayı × Yüzde ÷ 100",
          "Örnek: 2.500 TL'nin %18'i = 2.500 × 18 ÷ 100 = <strong>450 TL</strong>",
          "Pratik yol: %10'u bulmak için sayıyı 10'a bölün, sonra katlayın. 2.500'ün %10'u 250 ise %20'si 500, %5'i 125'tir.",
        ],
      },
      {
        heading: "2. Yüzde artış",
        body: [
          "Yeni değer = Eski değer × (1 + Yüzde ÷ 100)",
          "Örnek: 30.000 TL maaşa %25 zam: 30.000 × 1,25 = <strong>37.500 TL</strong>",
        ],
      },
      {
        heading: "3. Yüzde azalış",
        body: [
          "Yeni değer = Eski değer × (1 − Yüzde ÷ 100)",
          "Örnek: 1.200 TL'lik ürüne %15 indirim: 1.200 × 0,85 = <strong>1.020 TL</strong>",
        ],
      },
      {
        heading: "4. İki sayı arasındaki yüzde değişim",
        body: [
          "Değişim (%) = (Yeni − Eski) ÷ Eski × 100",
          "Örnek: Fiyat 80 TL'den 100 TL'ye çıktıysa: (100 − 80) ÷ 80 × 100 = <strong>%25 artış</strong>",
          "Dikkat: Aynı fiyat 100'den 80'e düşerse değişim %25 değil, (80 − 100) ÷ 100 × 100 = <strong>%20 azalış</strong> olur. Referans alınan sayı değiştiği için oran da değişir.",
        ],
      },
      {
        heading: "Sık yapılan hata: yüzde ile yüzde puanı karıştırmak",
        body: [
          "Bir faiz oranı %40'tan %50'ye çıktığında artış <strong>10 yüzde puanıdır</strong>, ama oransal olarak <strong>%25 artıştır</strong>. Haberlerde ve kredi tekliflerinde bu ikisi sık karıştırılır.",
        ],
      },
    ],
    faqs: [
      {
        question: "%20 zam sonrası %20 indirim eski fiyata döndürür mü?",
        answer:
          "Hayır. 100 TL'ye %20 zam 120 TL yapar; 120 TL'ye %20 indirim 96 TL yapar. İkinci işlem daha büyük bir sayı üzerinden yapıldığı için eski fiyata dönülmez.",
      },
      {
        question: "Bir sayı diğerinin yüzde kaçıdır?",
        answer:
          "Parça ÷ Bütün × 100 formülü kullanılır. Örneğin 45, 180'in 45 ÷ 180 × 100 = %25'idir.",
      },
    ],
    related: ["indirim-hesaplama-nasil-yapilir", "kdv-nedir-nasil-hesaplanir"],
  },

  /* =======================================================
     İNDİRİM
  ======================================================= */
  {
    slug: "indirim-hesaplama-nasil-yapilir",
    title: "İndirim Hesaplama: Gerçek İndirim Oranı Nasıl Bulunur?",
    metaTitle: "İndirim Hesaplama Nasıl Yapılır?",
    description:
      "İndirimli fiyatın bulunması, ardışık indirimlerin gerçek oranı, 'ikinci ürün yarı fiyatına' kampanyalarının hesabı ve sahte indirimi fark etme.",
    category: "Günlük",
    icon: "🏷️",
    published: "2026-09-13",
    updated: "2026-09-13",
    readingMinutes: 4,
    tool: { slug: "indirim", label: "İndirim Hesaplama" },
    intro:
      "Kampanyalarda yazan indirim oranı ile gerçekte ödediğiniz tutar her zaman aynı hikâyeyi anlatmaz. Özellikle üst üste uygulanan indirimler ve adet kampanyaları, göründüğünden daha düşük bir tasarruf sağlar. Doğru hesabı birkaç basit formülle yapabilirsiniz.",
    sections: [
      {
        heading: "İndirimli fiyat",
        body: [
          "İndirimli fiyat = Liste fiyatı × (1 − İndirim oranı ÷ 100)",
          "Örnek: 2.400 TL'lik ürüne %30 indirim: 2.400 × 0,70 = <strong>1.680 TL</strong>. Tasarruf 720 TL'dir.",
        ],
      },
      {
        heading: "Ardışık indirimler toplanmaz",
        body: [
          "\"%20 indirim + sepette %10 ek indirim\" toplam %30 indirim demek değildir. İkinci indirim, zaten indirilmiş fiyat üzerinden uygulanır.",
          "Gerçek oran = 1 − (1 − 0,20) × (1 − 0,10) = 1 − 0,72 = <strong>%28</strong>",
          "Örnek: 1.000 TL'lik üründe önce %20 ile 800 TL'ye, sonra %10 ile <strong>720 TL</strong>'ye inilir. %30 olsaydı 700 TL ödenirdi.",
        ],
      },
      {
        heading: "Adet kampanyalarının gerçek oranı",
        body: [
          "- <strong>\"2. ürün %50 indirimli\":</strong> iki ürün için 1,5 ürün parası ödenir. Toplam indirim <strong>%25</strong>'tir.",
          "- <strong>\"3 al 2 öde\":</strong> üç ürün için iki ürün parası ödenir. Toplam indirim yaklaşık <strong>%33</strong>'tür.",
          "- <strong>\"2. ürün 1 TL\":</strong> iki ürün için yaklaşık bir ürün parası ödenir; indirim %50'ye yakındır.",
          "Bu kampanyalar yalnızca ikinci ürüne gerçekten ihtiyacınız varsa tasarruftur.",
        ],
      },
      {
        heading: "Sahte indirimi fark etmek",
        body: [
          "Kampanyadan birkaç hafta önce fiyatı yükseltip sonra \"indirim\" yazmak sık rastlanan bir yöntemdir. Mevzuata göre indirimli satışlarda, indirimden önceki <strong>son 30 gün içindeki en düşük fiyat</strong> referans alınmalıdır.",
          "Fiyat takip siteleri ve ürünün geçmiş fiyat grafikleri, gerçek indirimi görmenin en güvenilir yoludur.",
        ],
      },
    ],
    faqs: [
      {
        question: "İndirim oranını nasıl bulurum?",
        answer:
          "(Eski fiyat − Yeni fiyat) ÷ Eski fiyat × 100. Örneğin 500 TL'den 400 TL'ye inen üründe indirim (500 − 400) ÷ 500 × 100 = %20'dir.",
      },
      {
        question: "Kredi kartı taksit kampanyası indirim sayılır mı?",
        answer:
          "Faizsiz taksit, peşin fiyatına ödeme imkânıdır; indirim değildir. Ancak paranın zaman değeri düşünüldüğünde, yüksek enflasyonlu dönemlerde faizsiz taksit gerçek bir avantaj sağlar.",
      },
    ],
    related: ["yuzde-hesaplama-nasil-yapilir", "taksitli-alisveris-gercek-maliyeti"],
  },

  /* =======================================================
     KİRA ARTIŞI
  ======================================================= */
  {
    slug: "kira-artis-orani-nasil-hesaplanir",
    title: "Kira Artış Oranı Nasıl Hesaplanır?",
    metaTitle: "Kira Artışı Nasıl Hesaplanır? 2026 Rehber",
    description:
      "Kira artışında yasal üst sınır, 12 aylık TÜFE ortalamasının kullanımı, 5 yıllık kira süresi sonrası durum ve örnek hesaplama.",
    category: "Günlük",
    icon: "🏠",
    published: "2026-09-13",
    updated: "2026-09-13",
    readingMinutes: 5,
    tool: { slug: "kira-artisi", label: "Kira Artışı Hesaplama" },
    intro:
      "Konut ve çatılı işyeri kiralarında yenilenen kira yılı için yapılacak artış, yasal olarak bir üst sınıra bağlıdır. Bu sınır, TÜİK'in açıkladığı tüketici fiyatları endeksinin (TÜFE) <strong>son 12 aylık ortalamasıdır</strong>. Taraflar daha düşük bir oranda anlaşabilir, ancak daha yüksek bir oran geçerli olmaz.",
    sections: [
      {
        heading: "Hangi oran kullanılır?",
        body: [
          "Kira artışında kullanılan oran, kira döneminin yenilendiği aydan önceki <strong>son 12 ayın TÜFE ortalamasıdır</strong>. Bu oran her ay TÜİK enflasyon verisiyle birlikte açıklanır.",
          "Örneğin kira sözleşmeniz eylül ayında yenileniyorsa, ağustos ayı enflasyon verisiyle açıklanan 12 aylık ortalama değişim oranı esas alınır.",
          "Aylık veya yıllık enflasyon ile 12 aylık ortalama farklı sayılardır. Kira artışında <strong>12 aylık ortalama</strong> kullanılır.",
        ],
      },
      {
        heading: "Örnek hesaplama",
        body: [
          "Aylık kirası 20.000 TL olan bir konutta, yenileme ayında açıklanan 12 aylık TÜFE ortalamasının örnek olarak %35 olduğunu varsayalım:",
          "- Artış tutarı: 20.000 × %35 = 7.000 TL",
          "- Yeni kira: <strong>en fazla 27.000 TL</strong>",
          "Ev sahibi ve kiracı örneğin %25'te anlaşırsa yeni kira 25.000 TL olur. Bu tamamen geçerlidir.",
        ],
      },
      {
        heading: "5 yıldan sonra ne olur?",
        body: [
          "Kira süresi <strong>5 yılı doldurduktan</strong> sonra, yeni kira bedeli TÜFE sınırıyla bağlı kalmaksızın; emsal kira bedelleri, konutun durumu ve TÜFE dikkate alınarak hakkaniyete göre belirlenebilir.",
          "Taraflar anlaşamazsa, kira tespit davasıyla yeni bedeli sulh hukuk mahkemesi belirler. Bu dava öncesinde zorunlu arabuluculuk aşaması vardır.",
        ],
      },
      {
        heading: "Pratik öneriler",
        body: [
          "- Artışı yazılı yapın; ödeme açıklamasında dönemi belirtin.",
          "- Kira ödemelerini banka veya PTT üzerinden yapın; elden ödeme ispatta sorun çıkarır.",
          "- Yasal sınırın üzerindeki bir artışı kabul etmek zorunda değilsiniz. Fazla ödenen tutarın iadesi talep edilebilir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Ev sahibi yasal sınırın üzerinde zam isteyebilir mi?",
        answer:
          "Kira süresi 5 yılı doldurmadıysa, yenilenen kira yılı için yapılacak artış 12 aylık TÜFE ortalamasını geçemez. Daha yüksek artış talebini kabul etmek zorunda değilsiniz.",
      },
      {
        question: "İşyeri kiralarında da aynı sınır geçerli mi?",
        answer:
          "Evet. Yasal sınır konut ve çatılı işyeri kiraları için birlikte uygulanır.",
      },
      {
        question: "Kira artışı hangi aydan itibaren başlar?",
        answer:
          "Sözleşmenin yenilendiği tarihten itibaren başlar. Genellikle sözleşmenin imzalandığı ayın yıldönümüdür.",
      },
    ],
    related: ["enflasyon-ve-zam-farki-hesaplama", "yuzde-hesaplama-nasil-yapilir"],
  },

  /* =======================================================
     YAŞ
  ======================================================= */
  {
    slug: "yas-hesaplama-nasil-yapilir",
    title: "Yaş Hesaplama: Yıl, Ay ve Gün Olarak Tam Yaş",
    metaTitle: "Yaş Hesaplama Nasıl Yapılır? Yıl, Ay, Gün",
    description:
      "Doğum tarihinden bugüne tam yaşın yıl, ay ve gün olarak bulunması, artık yılların etkisi ve resmî işlemlerde yaşın nasıl sayıldığı.",
    category: "Günlük",
    icon: "🎂",
    published: "2026-09-13",
    updated: "2026-09-13",
    readingMinutes: 3,
    tool: { slug: "yas", label: "Yaş Hesaplama" },
    intro:
      "Yaş hesaplamak basit görünür, ancak yıl, ay ve gün olarak tam yaşı bulurken ayların farklı gün sayıları ve artık yıllar işi karıştırır. Emeklilik, okul kaydı, ehliyet ve sigorta gibi işlemlerde tam yaş önem taşır.",
    sections: [
      {
        heading: "Adım adım tam yaş",
        body: [
          "Tam yaş üç adımda bulunur:",
          "- Önce doğum gününüzün bu yıl gelip gelmediğine bakarak <strong>tam yılı</strong> bulun.",
          "- Son doğum gününüzden bu yana geçen <strong>tam ayları</strong> sayın.",
          "- Son ay dönümünden bugüne kalan <strong>günleri</strong> ekleyin.",
          "Örnek: 15 Mart 1990 doğumlu biri, 13 Eylül 2026 tarihinde:",
          "- 15 Mart 2026'da 36 yaşını doldurmuştur.",
          "- 15 Mart'tan 15 Ağustos'a 5 tam ay geçmiştir.",
          "- 15 Ağustos'tan 13 Eylül'e 29 gün vardır.",
          "Sonuç: <strong>36 yıl 5 ay 29 gün</strong>",
        ],
      },
      {
        heading: "Toplam gün ve artık yıllar",
        body: [
          "Toplam yaşanan gün hesabında 4 yılda bir gelen <strong>29 Şubat</strong> günleri de sayılır.",
          "Aynı örnekte 1990 ile 2026 arasında 9 artık yıl vardır. Toplam gün: 36 × 365 + 9 + 182 = <strong>13.331 gün</strong>.",
        ],
      },
      {
        heading: "29 Şubat doğumlular",
        body: [
          "Artık yılda doğanlar, artık olmayan yıllarda yaş gününü hukuken genellikle <strong>1 Mart</strong> itibarıyla doldurmuş sayılır. Resmî bir işlemde tarih kritikse ilgili kurumun uygulamasını teyit edin.",
        ],
      },
      {
        heading: "Resmî işlemlerde yaş",
        body: [
          "- <strong>Emeklilik:</strong> yaş şartı, doğum tarihinin gün ve ay olarak doldurulmasıyla sağlanır.",
          "- <strong>Okula başlama:</strong> eylül sonu itibarıyla ay cinsinden yaş esas alınır.",
          "- <strong>Nüfus kaydında yalnız yıl varsa:</strong> doğum tarihi 1 Temmuz kabul edilir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Nüfusta doğum günüm yazmıyorsa yaşım nasıl hesaplanır?",
        answer:
          "Nüfus kaydında yalnızca doğum yılı varsa doğum tarihi o yılın 1 Temmuz'u kabul edilir.",
      },
      {
        question: "Yaşımı gün olarak nasıl hesaplarım?",
        answer:
          "Tam yıl sayısını 365 ile çarpın, aradaki artık yıl sayısını ekleyin, ardından son doğum gününüzden bugüne geçen günleri ekleyin. Hesaplama aracımız bunu otomatik yapar.",
      },
    ],
    related: ["emeklilik-ne-zaman-eyt-sartlari", "yuzde-hesaplama-nasil-yapilir"],
  },

  /* =======================================================
     MEVDUAT
  ======================================================= */
  {
    slug: "vadeli-mevduat-getirisi-nasil-hesaplanir",
    title: "Vadeli Mevduat Getirisi Nasıl Hesaplanır?",
    metaTitle: "Vadeli Mevduat Faizi Nasıl Hesaplanır?",
    description:
      "Mevduat faizinin gün bazında hesaplanması, stopaj kesintisi, net getiri, vade yenilemenin etkisi ve enflasyona göre reel getiri. Örnekli anlatım.",
    category: "Finans",
    icon: "🏦",
    published: "2026-09-13",
    updated: "2026-09-15",
    readingMinutes: 5,
    tool: { slug: "mevduat", label: "Vadeli Mevduat Getirisi" },
    intro:
      "Bankaların ilan ettiği mevduat faizi yıllık brüt orandır. Hesabınıza yatan tutar ise vade gün sayısına göre orantılanmış ve stopaj vergisi düşülmüş net getiridir. Paranızın gerçekten değer kazanıp kazanmadığını görmek için bir adım daha ileri gidip enflasyonla karşılaştırmak gerekir.",
    sections: [
      {
        heading: "Brüt getiri formülü",
        body: [
          "Brüt getiri = Anapara × Yıllık faiz oranı × Vade (gün) ÷ 365",
          "Örnek: 100.000 TL, yıllık örnek faiz %40, 32 günlük vade:",
          "- 100.000 × 0,40 × 32 ÷ 365 = <strong>3.506,85 TL brüt</strong>",
        ],
      },
      {
        heading: "Stopaj ve net getiri",
        body: [
          "Mevduat faiz gelirinden kaynakta <strong>stopaj</strong> adı verilen vergi kesilir. TL mevduatta güncel oranlar (11444 sayılı Cumhurbaşkanı Kararı ile 31.12.2026'ya kadar):",
          "- Vadesiz ve 6 aya kadar vadeli: <strong>%17,5</strong>",
          "- 1 yıla kadar vadeli: <strong>%15</strong>",
          "- 1 yıldan uzun vadeli: <strong>%10</strong>",
          "Örnekteki 32 günlük vade 6 ayın altında olduğu için %17,5 uygulanır:",
          "- Stopaj: 3.506,85 × %17,5 = 613,70 TL",
          "- Net getiri: <strong>2.893,15 TL</strong>",
          "- Vade sonu toplam: 102.893,15 TL",
        ],
      },
      {
        heading: "Vadeyi yenilemenin etkisi",
        body: [
          "Vade sonunda anapara ve net faiz birlikte yeniden vadeye bağlanırsa faiz, faizin üzerinden de işler. Buna <strong>bileşik getiri</strong> denir.",
          "Kısa vadeleri düzenli yenilemek, aynı yıllık oranla tek seferde bir yıllık vadeye bağlamaktan daha fazla getiri sağlar; ancak her yenilemede faiz oranının değişebileceğini unutmayın.",
        ],
      },
      {
        heading: "Reel getiri: asıl soru",
        body: [
          "Net getiri enflasyonun altında kalıyorsa, hesaptaki TL artsa da paranızın satın alma gücü azalır.",
          "Reel getiri = (1 + Net getiri oranı) ÷ (1 + Enflasyon oranı) − 1",
          "Örnek: Yıllık net getiri %34, yıllık enflasyon %30 ise reel getiri (1,34 ÷ 1,30) − 1 ≈ <strong>%3</strong> olur.",
        ],
      },
    ],
    faqs: [
      {
        question: "Mevduat faizi günlük mü hesaplanır?",
        answer:
          "Faiz gün bazında işler ancak vade sonunda toplu ödenir. Vadeyi bozarsanız genellikle faiz getirisini kaybedersiniz. Günlük faiz ödeyen hesaplar ise farklı bir üründür.",
      },
      {
        question: "Stopaj oranı neden değişiyor?",
        answer:
          "Stopaj oranları ekonomi politikası kapsamında Cumhurbaşkanı kararıyla belirlenir ve dönem dönem güncellenir. Hesap yaparken bankanızın uyguladığı güncel oranı kontrol edin.",
      },
      {
        question: "Mevduat sigortası var mı?",
        answer:
          "Evet. Gerçek kişilere ait mevduat, TMSF güvencesi altında belirli bir tutara kadar sigortalıdır. Güncel limiti TMSF'nin sitesinden öğrenebilirsiniz.",
      },
    ],
    related: ["enflasyon-ve-zam-farki-hesaplama", "bes-birikim-ve-devlet-katkisi"],
  },

  /* =======================================================
     TAKSİT MALİYETİ
  ======================================================= */
  {
    slug: "taksitli-alisveris-gercek-maliyeti",
    title: "Taksitli Alışverişin Gerçek Maliyeti Nasıl Hesaplanır?",
    metaTitle: "Taksitli Alışverişin Gerçek Maliyeti",
    description:
      "Peşin fiyat ile taksitli fiyat arasındaki vade farkının gerçek aylık faiz oranına çevrilmesi, faizsiz taksitin avantajı ve karar vermek için pratik yöntem.",
    category: "Finans",
    icon: "💳",
    published: "2026-09-13",
    updated: "2026-09-13",
    readingMinutes: 5,
    tool: { slug: "taksit-maliyeti", label: "Taksitli Alışveriş Maliyeti" },
    intro:
      "\"12 taksitte sadece %10 fark\" kulağa küçük gelir. Ancak bu fark bir yıla yayıldığında ve her ay borcun bir kısmı ödendiğinde, gerçek faiz oranı yazılan yüzdenin neredeyse iki katına çıkar. Taksit teklifini doğru değerlendirmek için vade farkını faiz oranına çevirmek gerekir.",
    sections: [
      {
        heading: "Vade farkı ne kadar?",
        body: [
          "Örnek: Peşin fiyatı 30.000 TL olan bir ürün 12 × 2.750 TL taksitle satılıyor.",
          "- Taksitli toplam: 12 × 2.750 = 33.000 TL",
          "- Vade farkı: 33.000 − 30.000 = <strong>3.000 TL (%10)</strong>",
        ],
      },
      {
        heading: "Neden gerçek oran daha yüksek?",
        body: [
          "Taksitlerde borcun tamamını bir yıl boyunca kullanmazsınız; her ay bir kısmını geri ödersiniz. Ortalama borç, başlangıç borcunun yaklaşık yarısıdır.",
          "Bu yüzden 3.000 TL'lik fark aslında daha küçük bir ortalama borç için ödenir. Aynı örnekte gerçek faiz <strong>aylık yaklaşık %1,5</strong>, yıllık bileşik olarak yaklaşık <strong>%19,6</strong>'dır.",
          "Hesaplama aracımız, taksit tutarından geriye doğru bu aylık gerçek oranı bulur.",
        ],
      },
      {
        heading: "Karar vermenin pratik yolu",
        body: [
          "Taksitli seçeneğin gerçek faiz oranını, peşin ödeyeceğiniz paranın alternatif getirisiyle karşılaştırın:",
          "- Paranızı mevduatta tutarak taksitlerin gerçek faizinden <strong>daha yüksek net getiri</strong> elde edebiliyorsanız taksit mantıklıdır.",
          "- Taksitin gerçek faizi mevduat getirisinden <strong>yüksekse</strong> peşin almak daha kârlıdır.",
          "- Faizsiz taksit (peşin fiyatına taksit), enflasyon ortamında neredeyse her zaman avantajlıdır; çünkü ödediğiniz son taksitler zamanla değer kaybeden parayla ödenir.",
        ],
      },
      {
        heading: "Gizli maliyetler",
        body: [
          "- Kredi kartı ile yapılan taksitli işlemlerde işlem ücreti veya komisyon olup olmadığını kontrol edin.",
          "- Taksit sayısı arttıkça aylık tutar düşer ama toplam maliyet artar.",
          "- Kredi kartında toplam taksitli harcama, kart limitini aylar boyunca meşgul eder.",
        ],
      },
    ],
    faqs: [
      {
        question: "%10 vade farkı yıllık %10 faiz demek mi?",
        answer:
          "Hayır. Borç her ay azaldığı için 12 aylık %10 fark, yıllık yaklaşık %19–20 gerçek faize karşılık gelir.",
      },
      {
        question: "Faizsiz taksit gerçekten avantajlı mı?",
        answer:
          "Peşin fiyatına taksit yapılıyorsa evet. Parayı peşin ödemek yerine hesabınızda tutup getiri elde edebilir veya enflasyon karşısında sonraki taksitleri daha az değerli parayla ödersiniz.",
      },
    ],
    related: ["kredi-taksiti-nasil-hesaplanir", "vadeli-mevduat-getirisi-nasil-hesaplanir"],
  },

  /* =======================================================
     ENFLASYON / ZAM FARKI
  ======================================================= */
  {
    slug: "enflasyon-ve-zam-farki-hesaplama",
    title: "Enflasyon ve Zam Farkı: Maaşım Gerçekten Arttı mı?",
    metaTitle: "Enflasyon ve Zam Farkı Hesaplama Rehberi",
    description:
      "Nominal zam ile reel zam arasındaki fark, maaşın satın alma gücünü korumak için gereken zam oranı ve enflasyon farkının hesaplanması.",
    category: "Finans",
    icon: "📈",
    published: "2026-09-13",
    updated: "2026-09-13",
    readingMinutes: 4,
    tool: { slug: "enflasyon", label: "Enflasyon / Zam Farkı" },
    intro:
      "Maaşınıza %20 zam geldiğinde ama fiyatlar %30 arttığında, bordronuzdaki rakam büyüse de alabildiğiniz ürün miktarı azalır. Zammın gerçek anlamını görmek için nominal artışı enflasyonla karşılaştırmak, yani reel artışı hesaplamak gerekir.",
    sections: [
      {
        heading: "Nominal ve reel artış",
        body: [
          "- <strong>Nominal artış:</strong> maaşınızın TL olarak ne kadar arttığıdır.",
          "- <strong>Reel artış:</strong> enflasyondan arındırılmış, yani satın alma gücünüzdeki gerçek değişimdir.",
          "Reel artış = (1 + Zam oranı) ÷ (1 + Enflasyon oranı) − 1",
        ],
      },
      {
        heading: "Örnek",
        body: [
          "Maaş 50.000 TL'den 60.000 TL'ye çıktı (%20 zam); aynı dönemde enflasyon %30 oldu.",
          "- Reel değişim: 1,20 ÷ 1,30 − 1 ≈ <strong>−%7,7</strong>",
          "- Yani zamlı maaşınız, bir yıl önceki 50.000 TL'nin yaklaşık 46.150 TL'lik alım gücüne denk gelir.",
          "Dikkat: Reel değişim, zam oranından enflasyonu çıkararak bulunmaz. %20 − %30 = −%10 hesabı yaklaşık bir sonuç verir ve oranlar yükseldikçe hata büyür.",
        ],
      },
      {
        heading: "Alım gücünü korumak için gereken zam",
        body: [
          "Maaşın alım gücünü korumak için zam oranının en az enflasyon oranına eşit olması gerekir.",
          "Gereken maaş = Eski maaş × (1 + Enflasyon oranı)",
          "Örnekte 50.000 × 1,30 = <strong>65.000 TL</strong>. 60.000 TL'lik zamlı maaş, alım gücünü korumak için 5.000 TL eksiktir.",
        ],
      },
      {
        heading: "Hangi enflasyon oranını kullanmalı?",
        body: [
          "Genellikle TÜİK'in açıkladığı yıllık TÜFE kullanılır. Ancak kişisel harcama sepetiniz (kira, gıda, ulaşım ağırlığı) ortalamadan farklıysa, hissettiğiniz enflasyon da farklı olabilir.",
          "Zam dönemini ve enflasyon dönemini aynı tarih aralığına denk getirin; aksi takdirde karşılaştırma yanıltıcı olur.",
        ],
      },
    ],
    faqs: [
      {
        question: "Enflasyon farkı nasıl hesaplanır?",
        answer:
          "Gerçekleşen enflasyon ile yapılan zam arasındaki farkın maaşa etkisidir. Eski maaş × (1 + enflasyon) ile zamlı maaş arasındaki fark, alım gücünü korumak için gereken ek tutarı verir.",
      },
      {
        question: "Zam oranından enflasyonu çıkarmak neden yanlış?",
        answer:
          "Çıkarma yöntemi yaklaşık bir sonuç verir. Doğru formül bölmedir: (1 + zam) ÷ (1 + enflasyon) − 1. Oranlar yükseldikçe iki yöntem arasındaki fark büyür.",
      },
    ],
    related: ["kira-artis-orani-nasil-hesaplanir", "brutten-nete-maas-hesaplama"],
  },

  /* =======================================================
     YAKIT MALİYETİ
  ======================================================= */
  {
    slug: "yakit-maliyeti-nasil-hesaplanir",
    title: "Yakıt ve Yol Maliyeti Nasıl Hesaplanır?",
    metaTitle: "Yakıt Maliyeti Hesaplama: 100 km Masrafı",
    description:
      "Araç tüketimi, mesafe ve yakıt fiyatıyla yolculuk maliyetinin hesaplanması, gidiş-dönüş, otoyol ve köprü ücretleri ve masrafın kişi başı paylaşımı.",
    category: "Günlük",
    icon: "⛽",
    published: "2026-09-13",
    updated: "2026-09-13",
    readingMinutes: 3,
    tool: { slug: "yakit-maliyeti", label: "Yakıt ve Yol Maliyeti" },
    intro:
      "Bir yolculuğun yakıt maliyetini bilmek; tatil bütçesi yapmak, araçla mı uçakla mı gideceğine karar vermek ya da masrafı yol arkadaşlarıyla adil paylaşmak için gereklidir. Hesap için üç bilgi yeterlidir: mesafe, aracınızın 100 km'de yaktığı yakıt ve litre fiyatı.",
    sections: [
      {
        heading: "Formül",
        body: [
          "Yakıt miktarı (litre) = Mesafe (km) × 100 km'deki tüketim ÷ 100",
          "Yakıt maliyeti = Yakıt miktarı × Litre fiyatı",
          "Örnek: 450 km yol, 100 km'de 6,5 litre tüketim, örnek litre fiyatı 45 TL:",
          "- Yakıt: 450 × 6,5 ÷ 100 = 29,25 litre",
          "- Maliyet: 29,25 × 45 = <strong>1.316,25 TL</strong>",
          "- Gidiş-dönüş: <strong>2.632,50 TL</strong>",
        ],
      },
      {
        heading: "Gerçek tüketim neden farklı çıkar?",
        body: [
          "Araç kataloglarındaki tüketim değerleri ideal koşullarda ölçülür. Gerçek tüketimi artıran başlıca etkenler:",
          "- Yüksek hız (özellikle 110 km/s üzeri)",
          "- Klima kullanımı ve ağır yük",
          "- Şehir içi dur-kalk trafik",
          "- Düşük lastik basıncı",
          "En doğru sonuç için aracınızın yol bilgisayarındaki ortalama tüketimi kullanın ya da bir depo doldurup gidilen kilometreye bölerek kendi ortalamanızı bulun.",
        ],
      },
      {
        heading: "Toplam yol maliyeti",
        body: [
          "Yakıta ek olarak yol maliyetine şunları ekleyin:",
          "- Otoyol ve köprü geçiş ücretleri",
          "- Otopark ücretleri",
          "Masrafı paylaşırken toplam maliyeti araçtaki kişi sayısına bölün. Örnekteki gidiş-dönüş 2.632,50 TL, 4 kişi için kişi başı yaklaşık <strong>658 TL</strong>'dir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Aracımın gerçek yakıt tüketimini nasıl bulurum?",
        answer:
          "Depoyu tamamen doldurup kilometre sayacını sıfırlayın. Bir sonraki dolumda aldığınız litreyi gidilen kilometreye bölüp 100 ile çarpın; sonuç 100 km'deki gerçek tüketiminizdir.",
      },
      {
        question: "Dizel mi benzinli mi daha ekonomik?",
        answer:
          "Dizel araçlar genellikle 100 km'de daha az yakıt tüketir. Ancak yıllık kilometreniz düşükse aradaki fiyat ve bakım farkı bu avantajı ortadan kaldırabilir. İki aracın tüketim ve litre fiyatlarıyla aynı mesafe için hesap yaparak karşılaştırın.",
      },
    ],
    related: ["yuzde-hesaplama-nasil-yapilir", "enflasyon-ve-zam-farki-hesaplama"],
  },

  /* =======================================================
     BES
  ======================================================= */
  {
    slug: "bes-birikim-ve-devlet-katkisi",
    title: "BES Birikimi ve Devlet Katkısı Nasıl Hesaplanır?",
    metaTitle: "BES Devlet Katkısı ve Birikim Rehberi",
    description:
      "Bireysel emeklilik sisteminde devlet katkısının hesaplanması, 3-6-10 yıl hak kazanma oranları, emeklilik şartları ve birikimi etkileyen faktörler.",
    category: "Finans",
    icon: "🪙",
    published: "2026-09-13",
    updated: "2026-09-15",
    readingMinutes: 6,
    tool: { slug: "bes", label: "BES Birikim Hesaplama" },
    intro:
      "Bireysel Emeklilik Sistemi'nde (BES) ödediğiniz katkı paylarına devlet ayrıca katkı ekler. Ancak bu katkının tamamına hemen sahip olmazsınız; sistemde kaldığınız süre arttıkça hak kazandığınız oran yükselir. Birikiminizi doğru tahmin etmek için katkı payı, devlet katkısı, fon getirisi ve süreyi birlikte düşünmek gerekir.",
    sections: [
      {
        heading: "Devlet katkısı nasıl işler?",
        body: [
          "Devlet, ödediğiniz katkı payının belirli bir yüzdesi kadar katkıyı hesabınıza ayrıca yatırır. <strong>1 Ocak 2026'dan itibaren bu oran %20'dir</strong> (10811 sayılı Cumhurbaşkanı Kararı; önceden %30'du).",
          "Yıllık devlet katkısı, brüt asgari ücretin yıllık toplamının %20'sini aşamaz. 2026'da bu üst sınır <strong>79.272 TL</strong>'dir; yani yıllık 396.360 TL'yi aşan katkı paylarına devlet katkısı işlemez.",
          "Örnek: Aylık 2.000 TL katkı payı ödeyen bir katılımcı için:",
          "- Aylık devlet katkısı: 2.000 × %20 = 400 TL",
          "- Yıllık devlet katkısı: 400 × 12 = <strong>4.800 TL</strong>",
          "Devlet katkısı ayrı bir hesapta tutulur ve kendi fonlarında değerlendirilir.",
        ],
      },
      {
        heading: "Hak kazanma oranları",
        body: [
          "Sistemden ayrıldığınızda devlet katkısının ne kadarını alacağınız, sistemde kaldığınız süreye bağlıdır:",
          "- 3 yıldan az: <strong>%0</strong>",
          "- 3 – 6 yıl: <strong>%15</strong>",
          "- 6 – 10 yıl: <strong>%35</strong>",
          "- 10 yıl ve üzeri: <strong>%60</strong>",
          "- Emeklilik hakkı kazanılması (10 yıl + 56 yaş), vefat veya maluliyet: <strong>%100</strong>",
          "Bu nedenle BES'ten erken ayrılmak, devlet katkısının büyük bölümünü kaybetmek demektir.",
        ],
      },
      {
        heading: "Birikimi belirleyen faktörler",
        body: [
          "- <strong>Süre:</strong> bileşik getiri nedeniyle en güçlü etkendir; ilk yıllarda başlamak farkı katlar.",
          "- <strong>Fon seçimi:</strong> hisse ağırlıklı fonlar uzun vadede yüksek getiri potansiyeli taşır, kısa vadede dalgalanır.",
          "- <strong>Fon işletim gideri:</strong> her yıl birikimden düşülen yönetim ücretidir; düşük maliyetli fonlar uzun vadede ciddi fark yaratır.",
          "- <strong>Düzenli ödeme:</strong> ara verilen dönemlerde devlet katkısı da işlemez.",
        ],
      },
      {
        heading: "Emeklilik ve vergi",
        body: [
          "BES'ten emekli olabilmek için sistemde <strong>en az 10 yıl</strong> kalmak ve <strong>56 yaşını</strong> doldurmak gerekir.",
          "Sistemden ayrılışta yalnızca <strong>getiri kısmından</strong> stopaj kesilir; ödediğiniz ana para vergilendirilmez. Stopaj oranı, sistemde kalma süresine ve ayrılış nedenine göre değişir ve emeklilikte en düşük seviyededir.",
        ],
      },
    ],
    faqs: [
      {
        question: "BES'ten 3 yıl dolmadan çıkarsam ne olur?",
        answer:
          "Kendi ödediğiniz katkı payları ve bunların getirisi size ödenir (getiriden stopaj kesilir), ancak devlet katkısının hiçbir kısmına hak kazanamazsınız.",
      },
      {
        question: "Otomatik katılımda devlet katkısı var mı?",
        answer:
          "Evet. Otomatik katılım sisteminde de devlet katkısı uygulanır. Ayrıca otomatik katılımda sistemde kalanlara ek teşvikler öngörülebilmektedir; güncel şartları EGM'den kontrol edin.",
      },
      {
        question: "Devlet katkısını istediğim zaman çekebilir miyim?",
        answer:
          "Hayır. Devlet katkısı yalnızca sistemden ayrılırken, sistemde kaldığınız süreye göre hak kazandığınız oranda ödenir.",
      },
    ],
    related: ["emeklilik-ne-zaman-eyt-sartlari", "vadeli-mevduat-getirisi-nasil-hesaplanir"],
  },

  /* =======================================================
     KREDİ TAKSİTİ
  ======================================================= */
  {
    slug: "kredi-taksiti-nasil-hesaplanir",
    title: "Kredi Taksiti Nasıl Hesaplanır?",
    metaTitle: "Kredi Taksiti Nasıl Hesaplanır? KKDF, BSMV",
    description:
      "İhtiyaç kredisi taksit formülü, KKDF ve BSMV'nin faize etkisi, toplam geri ödeme, erken kapamada faiz indirimi ve erken ödeme tazminatı.",
    category: "Finans",
    icon: "🏧",
    published: "2026-09-13",
    updated: "2026-09-13",
    readingMinutes: 6,
    tool: { slug: "kredi-borc", label: "Kredi / Banka Borç Hesaplama" },
    intro:
      "Banka reklamlarında gördüğünüz faiz oranı, ödeyeceğiniz taksiti tek başına belirlemez. İhtiyaç kredilerinde faizin üzerine vergi ve fon kesintileri eklenir; taksit tutarı da her ay eşit kalacak şekilde özel bir formülle hesaplanır. Toplam maliyeti görmek için bu adımları bilmek gerekir.",
    sections: [
      {
        heading: "Eşit taksit formülü",
        body: [
          "Bankalar genellikle her ay aynı tutarın ödendiği <strong>eşit taksitli</strong> geri ödeme planı uygular:",
          "Taksit = Kredi × r × (1 + r)<sup>n</sup> ÷ ((1 + r)<sup>n</sup> − 1)",
          "Burada r aylık faiz oranı (vergiler dahil), n ise taksit sayısıdır.",
          "Örnek: 100.000 TL, 12 ay, vergiler dahil örnek aylık faiz %3:",
          "- Aylık taksit: ≈ <strong>10.046 TL</strong>",
          "- Toplam geri ödeme: ≈ 120.554 TL",
          "- Toplam faiz ve vergi: ≈ <strong>20.554 TL</strong>",
        ],
      },
      {
        heading: "KKDF ve BSMV",
        body: [
          "Bireysel ihtiyaç ve taşıt kredilerinde faiz tutarı üzerinden iki kesinti eklenir:",
          "- <strong>KKDF</strong> (Kaynak Kullanımını Destekleme Fonu): faizin %15'i",
          "- <strong>BSMV</strong> (Banka ve Sigorta Muameleleri Vergisi): faizin %15'i",
          "Bu yüzden vergiler dahil aylık oran, akdi faizin yaklaşık <strong>1,3 katıdır</strong>. Örneğin akdi aylık faiz %2,5 ise vergiler dahil oran yaklaşık %3,25 olur.",
          "<strong>Konut kredilerinde</strong> KKDF ve BSMV uygulanmaz; bu nedenle aynı akdi faizle konut kredisinin maliyeti daha düşüktür.",
        ],
      },
      {
        heading: "Toplam maliyet ve yıllık maliyet oranı",
        body: [
          "Taksit dışında kredi tahsis ücreti ve sigorta gibi masraflar da olabilir. Bankalar, tüm bu maliyetleri içeren <strong>yıllık maliyet oranını</strong> sözleşme öncesi bilgi formunda göstermek zorundadır.",
          "Kredi tekliflerini karşılaştırırken aylık faiz yerine yıllık maliyet oranını ve toplam geri ödeme tutarını karşılaştırın.",
        ],
      },
      {
        heading: "Erken kapama",
        body: [
          "Tüketici kredisini vadesinden önce kapatırsanız, kalan süreye ait faiz ve buna bağlı vergiler alınmaz; yalnızca kalan anaparayı ve o güne kadar işleyen faizi ödersiniz.",
          "Sabit faizli <strong>konut kredilerinde</strong> banka erken ödeme tazminatı isteyebilir: kalan vade 36 ay veya daha kısaysa kalan anaparanın <strong>%1'i</strong>, daha uzunsa <strong>%2'si</strong>.",
          "Faizlerin düştüğü dönemlerde erken kapatıp daha düşük faizle yeniden kredi kullanmak (yapılandırma), bu tazminat hesaba katıldığında bile kârlı olabilir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kredi faizine neden %30 ekleniyor?",
        answer:
          "İhtiyaç ve taşıt kredilerinde faiz tutarı üzerinden %15 KKDF ve %15 BSMV alınır. Toplamda faiz yükü yaklaşık 1,3 katına çıkar. Konut kredilerinde bu kesintiler yoktur.",
      },
      {
        question: "Kredimi erken kapatırsam ceza öder miyim?",
        answer:
          "İhtiyaç kredilerinde erken kapama cezası alınmaz; kalan faiz de silinir. Sabit faizli konut kredilerinde ise kalan vadeye göre kalan anaparanın %1'i veya %2'si kadar erken ödeme tazminatı alınabilir.",
      },
      {
        question: "Taksitlerin ilk aylarında neden daha çok faiz ödüyorum?",
        answer:
          "Eşit taksitli planda faiz kalan anapara üzerinden hesaplanır. İlk aylarda anapara yüksek olduğundan taksitin büyük kısmı faizdir; zamanla anapara payı artar.",
      },
    ],
    related: ["taksitli-alisveris-gercek-maliyeti", "konut-kredisi-masraflari"],
  },
];

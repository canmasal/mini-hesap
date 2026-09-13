/**
 * Hesaplama sayfalarının altındaki uzun açıklama içerikleri.
 *
 * - newToolSeo: yeni araçların tam SEO içeriği (başlık, açıklama, adımlar,
 *   açıklama bölümleri ve SSS).
 * - toolSections: mevcut araçların sayfasına eklenen "Formülü nedir?"
 *   türünden açıklama bölümleri.
 *
 * Bölüm gövdesinde "- " ile başlayan satırlar madde listesi olur;
 * <strong> etiketi kullanılabilir.
 */

export type SeoSection = { heading: string; body: string[] };

export type ToolSeo = {
  title: string;
  description: string;
  intro: string;
  howItWorks: string[];
  sections?: SeoSection[];
  faqs: { question: string; answer: string }[];
};

const netFormula = (penalty: number) =>
  `Net = Doğru − (Yanlış ÷ ${penalty}). Yani ${penalty} yanlış cevap 1 doğru cevabı götürür; boş bırakılan sorular nete etki etmez.`;

export const newToolSeo: Record<string, ToolSeo> = {
  /* ======================== TYT ======================== */
  "tyt-net": {
    title: "TYT Net Hesaplama 2026 | Doğru Yanlış ile Net ve OBP",
    description:
      "TYT net hesaplama aracı: Türkçe, sosyal, temel matematik ve fen doğru-yanlış sayılarını girin, netinizi ve diploma notunuzla OBP katkınızı anında görün.",
    intro:
      "TYT net hesaplama aracı, Temel Yeterlilik Testi'nde her ders için doğru ve yanlış sayınızı girerek netinizi saniyeler içinde hesaplar. Diploma notunuzu da eklerseniz Ortaöğretim Başarı Puanı'nın (OBP) yerleştirme puanınıza katkısını görürsünüz.",
    howItWorks: [
      "Her ders için doğru ve yanlış sayınızı yazın; boşları boş bırakın.",
      "Ders netleri ve toplam net anında hesaplanır.",
      "İsterseniz diploma notunuzu girerek OBP katkınızı görün.",
      "Sonucu kopyalayın veya WhatsApp üzerinden paylaşın.",
    ],
    sections: [
      {
        heading: "TYT neti nasıl hesaplanır?",
        body: [
          netFormula(4),
          "Örnek: Türkçe testinde 32 doğru ve 8 yanlışınız varsa neti 32 − (8 ÷ 4) = <strong>30</strong> olur.",
          "Toplam net, dört testin netlerinin toplamıdır. Bir testte net sıfırın altına düşmez.",
        ],
      },
      {
        heading: "TYT soru dağılımı",
        body: [
          "TYT toplam <strong>120 sorudan</strong> oluşur:",
          "- Türkçe: 40 soru",
          "- Sosyal Bilimler: 20 soru (tarih, coğrafya, felsefe, din kültürü)",
          "- Temel Matematik: 40 soru",
          "- Fen Bilimleri: 20 soru (fizik, kimya, biyoloji)",
        ],
      },
      {
        heading: "OBP puanınıza nasıl eklenir?",
        body: [
          "Diploma notunuz 5 ile çarpılarak <strong>OBP</strong> bulunur. Örneğin 85 diploma notu 425 OBP demektir.",
          "OBP'nin <strong>0,12</strong> katı yerleştirme puanınıza eklenir: 425 × 0,12 = <strong>51 puan</strong>. Bir önceki yıl bir programa yerleşmiş adaylarda bu katsayı 0,06'ya düşer.",
          "Bu yüzden diploma notundaki birkaç puanlık fark bile sıralamanızı etkileyebilir.",
        ],
      },
      {
        heading: "Net ile puan arasındaki fark",
        body: [
          "TYT puanı netlerden doğrudan hesaplanmaz. ÖSYM, her testin o yılki ortalama ve standart sapmasını kullanarak <strong>standart puan</strong> üretir. Aynı net, zor geçen bir yılda daha yüksek puana karşılık gelir.",
          "Bu nedenle net hesaplaması kesindir, puan ise ancak sınav sonrası açıklanan verilerle netleşir.",
        ],
      },
    ],
    faqs: [
      {
        question: "TYT'de kaç yanlış bir doğruyu götürür?",
        answer: "TYT'de 4 yanlış cevap 1 doğru cevabı götürür. Boş bırakılan sorular neti etkilemez.",
      },
      {
        question: "TYT toplam kaç soru?",
        answer:
          "Toplam 120 soru: Türkçe 40, Sosyal Bilimler 20, Temel Matematik 40 ve Fen Bilimleri 20.",
      },
      {
        question: "OBP yerleştirme puanına ne kadar katkı sağlar?",
        answer:
          "Diploma notu × 5 ile bulunan OBP'nin 0,12 katı eklenir; en fazla 60 puandır. Önceki yıl bir programa yerleşenlerde katsayı 0,06'dır.",
      },
    ],
  },

  /* ======================== AYT ======================== */
  "ayt-net": {
    title: "AYT Net Hesaplama 2026 | SAY, EA ve SÖZ Netleri",
    description:
      "AYT net hesaplama: matematik, fizik, kimya, biyoloji, edebiyat ve sosyal testlerinde doğru-yanlış girin; sayısal, eşit ağırlık ve sözel netlerinizi görün.",
    intro:
      "AYT net hesaplama aracı, Alan Yeterlilik Testleri'ndeki her ders için netinizi bulur ve bu netleri puan türlerine göre gruplar. Böylece hedeflediğiniz sayısal, eşit ağırlık veya sözel bölümler için hangi testlere odaklanmanız gerektiğini görebilirsiniz.",
    howItWorks: [
      "Girdiğiniz derslerin doğru ve yanlış sayılarını yazın; girmediğiniz testleri boş bırakın.",
      "Ders netleri ve puan türü toplamları anında hesaplanır.",
      "Diploma notunuzu ekleyerek OBP katkınızı görün.",
      "Sonucu kopyalayın veya paylaşın.",
    ],
    sections: [
      {
        heading: "AYT neti nasıl hesaplanır?",
        body: [
          netFormula(4),
          "Örnek: Matematik testinde 28 doğru ve 6 yanlış → 28 − 1,5 = <strong>26,5 net</strong>.",
        ],
      },
      {
        heading: "Hangi dersler hangi puan türüne girer?",
        body: [
          "- <strong>Sayısal (SAY):</strong> Matematik, Fizik, Kimya, Biyoloji",
          "- <strong>Eşit Ağırlık (EA):</strong> Matematik, Türk Dili ve Edebiyatı, Tarih-1, Coğrafya-1",
          "- <strong>Sözel (SÖZ):</strong> Edebiyat, Tarih-1, Coğrafya-1, Tarih-2, Coğrafya-2, Felsefe Grubu, Din Kültürü",
          "Yerleştirme puanı hesaplanırken TYT'nin katkısı %40, ilgili AYT testlerinin katkısı %60'tır.",
        ],
      },
      {
        heading: "AYT soru dağılımı",
        body: [
          "- Matematik: 40 soru",
          "- Fen Bilimleri: 40 soru (Fizik 14, Kimya 13, Biyoloji 13)",
          "- Türk Dili ve Edebiyatı–Sosyal Bilimler-1: 40 soru (Edebiyat 24, Tarih-1 10, Coğrafya-1 6)",
          "- Sosyal Bilimler-2: 46 soru (Tarih-2 11, Coğrafya-2 11, Felsefe Grubu 12, Din Kültürü veya ek felsefe 6)",
        ],
      },
    ],
    faqs: [
      {
        question: "AYT'de tüm testlere girmek zorunlu mu?",
        answer:
          "Hayır. Aday, hedeflediği puan türüne göre ilgili testleri cevaplar. Sayısal bölüm hedefleyen bir aday genellikle yalnızca matematik ve fen testlerini çözer.",
      },
      {
        question: "AYT'de kaç yanlış bir doğruyu götürür?",
        answer: "AYT'de de 4 yanlış 1 doğruyu götürür.",
      },
      {
        question: "Eşit ağırlık puanına hangi netler girer?",
        answer:
          "Matematik, Türk Dili ve Edebiyatı, Tarih-1 ve Coğrafya-1 netleri eşit ağırlık puanını belirler.",
      },
    ],
  },

  /* ======================== LGS ======================== */
  "lgs-puan": {
    title: "LGS Puan Hesaplama 2026 | Net, Ağırlıklı Net ve Tahmini Puan",
    description:
      "LGS net ve puan hesaplama: ders bazında doğru-yanlış girin, 3 yanlış 1 doğru kuralıyla netinizi, katsayılı ağırlıklı netinizi ve tahmini LGS puanınızı görün.",
    intro:
      "LGS puan hesaplama aracı, Liselere Geçiş Sistemi sınavındaki altı dersin doğru ve yanlış sayılarından netinizi, ders katsayılarına göre ağırlıklı netinizi ve kaba bir puan tahminini hesaplar.",
    howItWorks: [
      "Altı dersin doğru ve yanlış sayılarını girin.",
      "Ders netleri, toplam net ve ağırlıklı net anında hesaplanır.",
      "Tahmini puanınızı kaba bir karşılaştırma için kullanın.",
      "Sonucu kopyalayın veya velinize WhatsApp'tan gönderin.",
    ],
    sections: [
      {
        heading: "LGS neti nasıl hesaplanır?",
        body: [
          netFormula(3),
          "Örnek: Matematikte 15 doğru ve 3 yanlış → 15 − 1 = <strong>14 net</strong>.",
        ],
      },
      {
        heading: "Ders katsayıları ve ağırlıklı net",
        body: [
          "LGS'de dersler puana eşit etki etmez:",
          "- Türkçe, Matematik, Fen Bilimleri: katsayı <strong>4</strong>",
          "- T.C. İnkılap Tarihi, Din Kültürü, Yabancı Dil: katsayı <strong>1</strong>",
          "Ağırlıklı net = (Türkçe + Matematik + Fen netleri) × 4 + (İnkılap + Din + Yabancı Dil netleri). En yüksek ağırlıklı net <strong>270</strong>'tir.",
          "Bu yüzden katsayısı 4 olan derslerdeki 1 net, diğer derslerdeki 4 nete denktir.",
        ],
      },
      {
        heading: "LGS puanı neden kesin hesaplanamaz?",
        body: [
          "LGS puanı 100 ile 500 arasındadır ve MEB tarafından her dersin o yılki ortalaması ile standart sapması kullanılarak <strong>standart puan</strong> yöntemiyle hesaplanır.",
          "Aracımızdaki tahmin, ağırlıklı neti 100–500 aralığına doğrusal olarak yerleştirir. Tüm soruları doğru yapan 500, hiç net yapamayan 100 puan alır. Gerçek puan sınavın zorluğuna göre bu tahminden sapabilir; tercih yaparken yüzdelik dilimleri esas alın.",
        ],
      },
      {
        heading: "Sınav yapısı",
        body: [
          "LGS iki oturumda toplam <strong>90 sorudur</strong>:",
          "- Sözel oturum: Türkçe 20, İnkılap Tarihi 10, Din Kültürü 10, Yabancı Dil 10",
          "- Sayısal oturum: Matematik 20, Fen Bilimleri 20",
        ],
      },
    ],
    faqs: [
      {
        question: "LGS'de kaç yanlış bir doğruyu götürür?",
        answer: "LGS'de 3 yanlış cevap 1 doğru cevabı götürür.",
      },
      {
        question: "LGS'de hangi derslerin katsayısı yüksek?",
        answer:
          "Türkçe, Matematik ve Fen Bilimleri 4 katsayılıdır. İnkılap Tarihi, Din Kültürü ve Yabancı Dil 1 katsayılıdır.",
      },
      {
        question: "Tahmini puan gerçek puanla aynı mı olur?",
        answer:
          "Hayır. Gerçek puan standart puan yöntemiyle hesaplanır ve sınavın zorluğuna göre değişir. Tahmin, kendi netlerinizi karşılaştırmanız için kaba bir göstergedir.",
      },
    ],
  },

  /* ======================== KPSS ======================== */
  "kpss-net": {
    title: "KPSS Net Hesaplama 2026 | Genel Yetenek ve Genel Kültür",
    description:
      "KPSS net hesaplama: Türkçe, matematik, tarih, coğrafya, vatandaşlık ve güncel bilgiler doğru-yanlış girin; GY ve GK netlerinizi anında görün.",
    intro:
      "KPSS net hesaplama aracı, Genel Yetenek ve Genel Kültür oturumlarındaki her ders için netinizi ve oturum toplamlarını hesaplar. Lisans, önlisans ve ortaöğretim düzeyindeki adaylar aynı soru yapısını kullanır.",
    howItWorks: [
      "Her dersin doğru ve yanlış sayısını girin.",
      "Ders netleri, Genel Yetenek ve Genel Kültür toplamları anında görünür.",
      "Sonucu kopyalayın veya paylaşın.",
    ],
    sections: [
      {
        heading: "KPSS neti nasıl hesaplanır?",
        body: [
          netFormula(4),
          "Örnek: Tarih testinde 20 doğru ve 4 yanlış → 20 − 1 = <strong>19 net</strong>.",
        ],
      },
      {
        heading: "Genel Yetenek – Genel Kültür soru dağılımı",
        body: [
          "- <strong>Genel Yetenek (60 soru):</strong> Türkçe 30, Matematik 30",
          "- <strong>Genel Kültür (60 soru):</strong> Tarih 27, Coğrafya 18, Vatandaşlık 9, Güncel Bilgiler 6",
        ],
      },
      {
        heading: "Puan türleri",
        body: [
          "Lisans mezunları için P3, önlisans mezunları için P93, ortaöğretim mezunları için P94 puan türü kullanılır. Bu puan türlerinde Genel Yetenek ve Genel Kültür testlerinin ağırlıkları farklıdır.",
          "Puanlar ÖSYM tarafından standart puan yöntemiyle hesaplandığından, net hesabı kesin; puan ise sınav sonuçlarıyla birlikte netleşir.",
        ],
      },
    ],
    faqs: [
      {
        question: "KPSS'de kaç yanlış bir doğruyu götürür?",
        answer: "KPSS Genel Yetenek ve Genel Kültür testlerinde 4 yanlış 1 doğruyu götürür.",
      },
      {
        question: "KPSS Genel Kültür'de kaç tarih sorusu var?",
        answer: "Genel Kültür testinde 27 tarih, 18 coğrafya, 9 vatandaşlık ve 6 güncel bilgiler sorusu bulunur.",
      },
    ],
  },

  /* ======================== ALES ======================== */
  "ales-net": {
    title: "ALES Net Hesaplama | Sayısal ve Sözel Net",
    description:
      "ALES net hesaplama: sayısal ve sözel testlerinde doğru-yanlış sayılarınızı girin, netlerinizi anında görün. Puan türleri ve ağırlıklar hakkında bilgi.",
    intro:
      "ALES net hesaplama aracı, Akademik Personel ve Lisansüstü Eğitimi Giriş Sınavı'nın sayısal ve sözel testlerindeki netlerinizi hesaplar. Yüksek lisans, doktora ve akademik kadro başvurularında kullanılan puanınızı tahmin etmeden önce netlerinizi görmek için idealdir.",
    howItWorks: [
      "Sayısal ve sözel testlerdeki doğru ve yanlış sayılarınızı girin.",
      "Test netleri ve toplam net anında hesaplanır.",
      "Sonucu kopyalayın veya paylaşın.",
    ],
    sections: [
      {
        heading: "ALES neti nasıl hesaplanır?",
        body: [netFormula(4), "Sınav 50 sayısal ve 50 sözel olmak üzere 100 sorudan oluşur."],
      },
      {
        heading: "ALES puan türleri",
        body: [
          "- <strong>Sayısal:</strong> sayısal test %75, sözel test %25 ağırlıklı",
          "- <strong>Sözel:</strong> sözel test %75, sayısal test %25 ağırlıklı",
          "- <strong>Eşit Ağırlık:</strong> iki test %50 – %50",
          "Başvuracağınız programın hangi puan türünü istediğini kontrol edin. ALES sonuçları 5 yıl geçerlidir.",
        ],
      },
    ],
    faqs: [
      {
        question: "ALES'te yanlışlar doğruyu götürür mü?",
        answer: "Evet, ALES'te 4 yanlış 1 doğruyu götürür.",
      },
      {
        question: "ALES puanı kaç yıl geçerli?",
        answer: "ALES sonuç belgesi, açıklandığı tarihten itibaren 5 yıl geçerlidir.",
      },
    ],
  },

  /* ======================== DGS ======================== */
  "dgs-net": {
    title: "DGS Net Hesaplama | Dikey Geçiş Sayısal ve Sözel Net",
    description:
      "DGS net hesaplama: sayısal ve sözel testlerinde doğru-yanlış sayılarınızı girin, dikey geçiş netlerinizi anında hesaplayın.",
    intro:
      "DGS net hesaplama aracı, önlisanstan lisansa geçiş için yapılan Dikey Geçiş Sınavı'nın sayısal ve sözel testlerindeki netlerinizi hesaplar.",
    howItWorks: [
      "Sayısal ve sözel doğru-yanlış sayılarınızı girin.",
      "Netleriniz anında hesaplanır.",
      "Sonucu kopyalayın veya paylaşın.",
    ],
    sections: [
      {
        heading: "DGS neti nasıl hesaplanır?",
        body: [netFormula(4), "Sınav 50 sayısal ve 50 sözel olmak üzere 100 sorudan oluşur."],
      },
      {
        heading: "DGS puanını neler belirler?",
        body: [
          "DGS puanı sayısal, sözel ve eşit ağırlık türlerinde hesaplanır. Puana test netlerinin standart puanlarının yanı sıra önlisans mezuniyet başarınızdan gelen <strong>Önlisans Başarı Puanı (ÖBP)</strong> da eklenir.",
          "Bu yüzden önlisans not ortalamanız, DGS'deki netleriniz kadar önemlidir.",
        ],
      },
    ],
    faqs: [
      {
        question: "DGS'de kaç yanlış bir doğruyu götürür?",
        answer: "DGS'de 4 yanlış 1 doğruyu götürür.",
      },
      {
        question: "DGS'ye önlisans ortalaması etki eder mi?",
        answer: "Evet. Önlisans mezuniyet başarınızdan hesaplanan ÖBP, DGS puanınıza eklenir.",
      },
    ],
  },

  /* ======================== YDS ======================== */
  "yds-puan": {
    title: "YDS Puan Hesaplama | Doğru Sayısından YDS Puanı ve Seviye",
    description:
      "YDS puan hesaplama: doğru sayınızı girin, her doğrunun 1,25 puan olduğu sistemde YDS puanınızı ve seviyenizi anında öğrenin.",
    intro:
      "YDS puan hesaplama aracı, Yabancı Dil Bilgisi Seviye Tespit Sınavı'ndaki doğru sayınızdan puanınızı hesaplar. YDS'de yanlış cevaplar doğruları götürmez; bu nedenle hesaplama doğrudan doğru sayısına dayanır.",
    howItWorks: [
      "Doğru sayınızı girin (yanlış sayısını girmeniz sonucu değiştirmez).",
      "YDS puanınız anında hesaplanır.",
      "Sonucu kopyalayın veya paylaşın.",
    ],
    sections: [
      {
        heading: "YDS puanı nasıl hesaplanır?",
        body: [
          "YDS <strong>80 sorudan</strong> oluşur ve her doğru cevap <strong>1,25 puan</strong> değerindedir.",
          "YDS puanı = Doğru sayısı × 1,25",
          "Örnek: 64 doğru × 1,25 = <strong>80 puan</strong>. Yanlış cevaplar puanı düşürmez, bu yüzden boş bırakmak yerine tahmin yürütmek avantajlıdır.",
        ],
      },
      {
        heading: "YDS puan seviyeleri",
        body: [
          "- 90 – 100: A seviyesi",
          "- 80 – 89: B seviyesi",
          "- 70 – 79: C seviyesi",
          "- 60 – 69: D seviyesi",
          "- 50 – 59: E seviyesi",
          "Akademik kadro, yurt dışı görevlendirme ve dil tazminatı gibi başvurularda istenen seviyeler farklıdır. YDS sonuçları 5 yıl geçerlidir.",
        ],
      },
    ],
    faqs: [
      {
        question: "YDS'de yanlışlar doğruyu götürür mü?",
        answer: "Hayır. YDS'de yanlış cevaplar doğruları götürmez; puan yalnızca doğru sayısıyla hesaplanır.",
      },
      {
        question: "YDS'de 80 puan için kaç doğru gerekir?",
        answer: "Her doğru 1,25 puan olduğundan 80 puan için 64 doğru gerekir.",
      },
    ],
  },
};

/** Mevcut araç sayfalarına eklenen uzun açıklama bölümleri. */
export const toolSections: Record<string, SeoSection[]> = {
  kdv: [
    {
      heading: "KDV hesaplama formülü nedir?",
      body: [
        "<strong>KDV hariç tutardan KDV dahil tutara:</strong> KDV dahil = Tutar × (1 + KDV oranı)",
        "Örnek: 10.000 TL + %20 KDV → 10.000 × 1,20 = <strong>12.000 TL</strong> (KDV tutarı 2.000 TL)",
        "<strong>KDV dahil tutardan KDV hariç tutara:</strong> KDV hariç = Tutar ÷ (1 + KDV oranı)",
        "Örnek: 12.000 TL KDV dahil → 12.000 ÷ 1,20 = <strong>10.000 TL</strong>",
        "Sık yapılan hata: KDV dahil tutardan %20 düşmek. 12.000 × 0,80 = 9.600 TL yanlış sonuçtur; doğru yöntem 1,20'ye bölmektir.",
      ],
    },
    {
      heading: "Güncel KDV oranları",
      body: [
        "- <strong>%20</strong> — genel oran; çoğu mal ve hizmet",
        "- <strong>%10</strong> — bazı gıda ürünleri, lokanta ve konaklama hizmetleri gibi kalemler",
        "- <strong>%1</strong> — temel gıda ürünlerinin bir kısmı, gazete ve bazı konut teslimleri gibi kalemler",
        "Hangi oranın uygulanacağı ürün veya hizmetin türüne göre mevzuatta belirlenir. Faturadaki oranı esas alın.",
      ],
    },
    {
      heading: "KDV kimi ilgilendirir?",
      body: [
        "KDV'yi son tüketici öder; işletme tahsil ettiği KDV'den kendi alışlarında ödediği KDV'yi düşerek farkı vergi dairesine yatırır. Bu nedenle fatura keserken KDV hariç ve dahil tutarları doğru ayırmak, hem teklif hazırlarken hem de beyanname dönemi öncesinde önemlidir.",
      ],
    },
  ],

  yuzde: [
    {
      heading: "Yüzde hesaplama formülleri",
      body: [
        "- <strong>Bir sayının yüzdesi:</strong> Sayı × Yüzde ÷ 100 → 2.500'ün %18'i = 450",
        "- <strong>A sayısı B'nin yüzde kaçı:</strong> A ÷ B × 100 → 45, 180'in %25'i",
        "- <strong>Yüzde artış:</strong> Eski × (1 + Oran ÷ 100) → 30.000'e %25 zam = 37.500",
        "- <strong>Yüzde azalış:</strong> Eski × (1 − Oran ÷ 100) → 1.200'e %15 indirim = 1.020",
        "- <strong>Yüzde değişim:</strong> (Yeni − Eski) ÷ Eski × 100 → 80'den 100'e %25 artış",
      ],
    },
    {
      heading: "Zihinden yüzde hesaplamanın pratik yolu",
      body: [
        "Önce %10'u bulun: sayıyı 10'a bölmek yeterlidir. Ardından katlayın veya bölün.",
        "Örnek: 640'ın %15'i → %10'u 64, %5'i 32; toplam <strong>96</strong>.",
        "Unutmayın: %20 zamdan sonra %20 indirim eski fiyata döndürmez. 100 → 120 → 96 olur, çünkü ikinci işlem daha büyük bir sayı üzerinden yapılır.",
      ],
    },
  ],

  "net-maas": [
    {
      heading: "Brüt maaştan net maaş nasıl hesaplanır?",
      body: [
        "Net maaş, brüt maaştan çalışan payı kesintilerin düşülmesiyle bulunur:",
        "- <strong>SGK primi (işçi payı):</strong> brüt ücretin %14'ü",
        "- <strong>İşsizlik sigortası (işçi payı):</strong> brüt ücretin %1'i",
        "- <strong>Gelir vergisi:</strong> (brüt − SGK − işsizlik) matrahı üzerinden, yıl içindeki kümülatif matraha göre %15'ten %35'e kadar artan dilimlerle",
        "- <strong>Damga vergisi:</strong> brüt ücretin binde 7,59'u",
        "Asgari ücrete isabet eden gelir vergisi ve damga vergisi istisna tutulur; bu istisna tüm çalışanların maaşından düşülür.",
      ],
    },
    {
      heading: "Net maaş neden yıl içinde azalır?",
      body: [
        "Gelir vergisi kümülatif hesaplanır: ocak ayından itibaren matrahlarınız toplanır ve toplam belirli eşikleri aştığında bir üst vergi dilimine geçersiniz. Bu yüzden brüt maaşınız değişmese bile yılın ilerleyen aylarında net maaşınız düşebilir.",
        "Aracımıza hesaplama ayını ve önceki kümülatif matrahınızı girerek bu etkiyi görebilirsiniz.",
      ],
    },
  ],
};

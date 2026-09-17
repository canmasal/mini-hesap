/**
 * Sağlık rehberleri: ideal kilo ve adet döngüsü.
 *
 * Tıbbi tavsiye vermez; hesaplama mantığını ve rakamların ne anlama geldiğini
 * anlatır, hekime başvurulması gereken durumları açıkça belirtir.
 */

import type { Guide } from "@/data/guides";

export const saglikGuides: Guide[] = [
  /* =======================================================
     İDEAL KİLO
  ======================================================= */
  {
    slug: "ideal-kilo-nasil-hesaplanir",
    title: "İdeal Kilo Nasıl Hesaplanır?",
    metaTitle: "İdeal Kilo Hesaplama | Formüller ve Sağlıklı Aralık",
    description:
      "Devine, Robinson, Miller ve Hamwi formülleri, VKİ'ye dayalı sağlıklı kilo aralığı, bel çevresi ölçütü ve formüllerin kimlerde yanıltıcı olduğu.",
    category: "Sağlık",
    icon: "⚖️",
    published: "2026-09-16",
    updated: "2026-09-16",
    readingMinutes: 5,
    tool: { slug: "ideal-kilo", label: "İdeal Kilo Hesaplama" },
    intro:
      "İdeal kilo sorusunun tek bir cevabı yoktur. Klinikte kullanılan formüller aynı boy için birkaç kilo farklı sonuç verir; üstelik hiçbiri kas kütlesini ve vücut yapısını hesaba katmaz. Bu rehberde formülleri, sağlıklı kilo aralığının nasıl bulunduğunu ve rakamların ne zaman yanıltıcı olduğunu anlatıyoruz.",
    sections: [
      {
        heading: "Sağlıklı kilo aralığı: en kullanışlı ölçüt",
        body: [
          "Dünya Sağlık Örgütü sağlıklı kiloyu tek bir sayıyla değil, vücut kitle indeksinin 18,5 – 24,9 arasında kaldığı bir aralıkla tanımlar.",
          "Alt sınır = <strong>18,5 × Boy² (m)</strong> · Üst sınır = <strong>24,9 × Boy² (m)</strong>",
          "Örnek: 1,65 m boyundaki biri için aralık 50,4 kg – 67,8 kg'dır. Bu aralığın neresinde olduğunuz kişisel yapınıza bağlıdır.",
        ],
      },
      {
        heading: "Klasik ideal kilo formülleri",
        body: [
          "Formüllerin tamamı 152,4 cm taban alır ve bu boyun üzerindeki her 2,54 cm için sabit bir kilo ekler:",
          "- <strong>Devine (1974):</strong> Erkek 50 + 2,3/inç · Kadın 45,5 + 2,3/inç. İlaç dozu hesaplarında standart kabul edilir.",
          "- <strong>Robinson (1983):</strong> Erkek 52 + 1,9/inç · Kadın 49 + 1,7/inç",
          "- <strong>Miller (1983):</strong> Erkek 56,2 + 1,41/inç · Kadın 53,1 + 1,36/inç",
          "- <strong>Hamwi (1964):</strong> Erkek 48 + 2,7/inç · Kadın 45,5 + 2,2/inç. Uzun boylularda en yüksek sonucu verir.",
          "Dördünün ortalamasını almak, tek bir formüle bağlı kalmaktan daha dengeli bir tahmin sağlar.",
        ],
      },
      {
        heading: "Formüller kimde yanıltıcı olur?",
        body: [
          "<strong>Sporcularda:</strong> Kas yağdan ağırdır. Düzenli antrenman yapan biri formülün üzerinde çıkar; bu fazla kilo değil kas kütlesidir.",
          "<strong>Yaşlılarda:</strong> Yaşla birlikte kas kaybı olur. Kilo aynı kalsa bile yağ oranı arttığı için formül gerçek durumu göstermez.",
          "<strong>Çocuk ve ergenlerde:</strong> Bu formüller yetişkinler içindir. Çocuklarda yaşa ve cinsiyete göre persentil eğrileri kullanılır.",
          "<strong>Gebelikte:</strong> Kilo hedefi gebelik öncesi VKİ'ye göre hekim tarafından belirlenir; ideal kilo formülü kullanılmaz.",
        ],
      },
      {
        heading: "Bel çevresi de en az kilo kadar önemli",
        body: [
          "Yağın nerede toplandığı, toplam kilodan daha belirleyici olabilir. Karın bölgesindeki yağlanma metabolik hastalık riskini artırır.",
          "Risk eşiği kadınlarda <strong>88 cm</strong>, erkeklerde <strong>102 cm</strong> bel çevresidir. Normal kiloda olup bel çevresi yüksek olan kişiler de risk altındadır.",
          "Ölçüm, en alt kaburga ile kalça kemiği arasındaki en dar noktadan, nefes verirken yapılır.",
        ],
      },
      {
        heading: "Hedef koyarken",
        body: [
          "Haftada 0,5 – 1 kg kayıp güvenli kabul edilir. Daha hızlı kayıplarda kas kaybı ve kaybedilen kilonun geri alınma ihtimali artar.",
          "Fazla kilosu olan kişilerde mevcut kilonun %5 – 10'unu vermek bile kan basıncı, kan şekeri ve kolesterolde belirgin iyileşme sağlar; ideal kiloya ulaşmak şart değildir.",
          "Kronik hastalığı olanlar, ilaç kullananlar ve gebeler beslenme değişikliği öncesi hekime danışmalıdır.",
        ],
      },
    ],
    faqs: [
      {
        question: "İdeal kilomun altındayım, sorun mu?",
        answer:
          "VKİ'niz 18,5'in altındaysa zayıf sınıfına girersiniz; bu durum bağışıklık, kemik sağlığı ve hormon dengesi açısından risk taşır. Nedeni araştırılmalıdır.",
      },
      {
        question: "Kadın ve erkek için ideal kilo neden farklı?",
        answer:
          "Erkeklerde kas ve kemik kütlesi oranı daha yüksek, vücut yağ yüzdesi daha düşüktür. Formüller bu farkı sabit katsayılarla yansıtır.",
      },
      {
        question: "İdeal kiloya ulaşmak şart mı?",
        answer:
          "Hayır. Sağlık göstergeleri açısından önemli olan, sağlıklı aralığa yaklaşmak ve bel çevresini düşürmektir. %5 – 10'luk bir kayıp bile ölçülebilir fayda sağlar.",
      },
    ],
    related: ["adet-dongusu-nasil-hesaplanir"],
  },

  /* =======================================================
     ADET DÖNGÜSÜ
  ======================================================= */
  {
    slug: "adet-dongusu-nasil-hesaplanir",
    title: "Adet Döngüsü ve Yumurtlama Günü Nasıl Hesaplanır?",
    metaTitle: "Adet Günü Hesaplama | Döngü ve Yumurtlama",
    description:
      "Döngü uzunluğu nasıl ölçülür, yumurtlama günü ve doğurgan dönem nasıl bulunur, gecikme ne zaman normaldir ve hangi durumlarda hekime başvurulmalı.",
    category: "Sağlık",
    icon: "🗓️",
    published: "2026-09-16",
    updated: "2026-09-16",
    readingMinutes: 5,
    tool: { slug: "adet-takvimi", label: "Adet Günü Hesaplama" },
    intro:
      "Adet döngüsünü takip etmek, bir sonraki reglin ne zaman geleceğini bilmenin ötesinde işe yarar: yumurtlama gününü, doğurgan dönemi ve döngü düzensizliklerini fark etmenizi sağlar. Hesap iki bilgiye dayanır: son adetin ilk günü ve döngü uzunluğu.",
    sections: [
      {
        heading: "Döngü uzunluğu nedir?",
        body: [
          "Döngü, bir adetin <strong>ilk gününden</strong> bir sonraki adetin ilk gününe kadar geçen süredir. Adetin bittiği gün hesaba katılmaz.",
          "Normal aralık <strong>21 – 35 gün</strong>tür; 28 gün yalnızca ortalamadır ve herkeste görülmez.",
          "Kendi ortalamanızı bulmak için son üç ayın döngü uzunluklarını toplayıp üçe bölün.",
        ],
      },
      {
        heading: "Yumurtlama günü nasıl bulunur?",
        body: [
          "Döngünün ikinci yarısı (luteal faz) kişiden kişiye pek değişmez ve yaklaşık 14 gün sürer. Bu nedenle yumurtlama, <strong>bir sonraki adetten 14 gün geriye sayılarak</strong> tahmin edilir.",
          "Yumurtlama = <strong>Sonraki adet tarihi − 14 gün</strong>",
          "Örnek: 30 günlük döngüde son adet 5 Nisan'da başladıysa sonraki adet 5 Mayıs, yumurtlama 21 Nisan civarındadır. Görüldüğü gibi yumurtlama, döngünün tam ortası olmak zorunda değildir.",
        ],
      },
      {
        heading: "Doğurgan dönem neden 6 gün?",
        body: [
          "Yumurta, atıldıktan sonra yaklaşık 12 – 24 saat döllenebilir. Ancak sperm kadın vücudunda <strong>5 güne kadar</strong> canlı kalabilir.",
          "Bu yüzden doğurgan pencere yumurtlamadan 5 gün önce başlar ve yumurtlama gününde biter. Gebelik ihtimali, yumurtlamadan önceki iki günde en yüksektir.",
          "Gebelik planlamıyorsanız: takvim yöntemi güvenilir bir korunma yolu değildir. Yumurtlama stres, hastalık veya seyahat nedeniyle kolayca kayabilir.",
        ],
      },
      {
        heading: "Adet gecikmesi",
        body: [
          "Düzenli döngüsü olanlarda birkaç günlük sapma normaldir. Gecikmenin en sık nedenleri: stres, yoğun egzersiz, hızlı kilo değişimi, hastalık, uyku düzeninin bozulması ve seyahat.",
          "Cinsel aktivite varsa gebelik testi, beklenen adet tarihinden <strong>birkaç gün sonra</strong> yapıldığında daha güvenilir sonuç verir; çok erken yapılan test yanlış negatif verebilir.",
          "Doğum kontrol hapına başlama veya bırakma dönemlerinde döngünün oturması birkaç ay alabilir.",
        ],
      },
      {
        heading: "Hekime ne zaman başvurmalı?",
        body: [
          "- Döngü sürekli 21 günden kısa ya da 35 günden uzunsa",
          "- Kanama 7 günden uzun sürüyorsa veya saatte bir ped değiştirecek kadar yoğunsa",
          "- Üç ay üst üste adet görülmüyorsa (gebelik dışı)",
          "- Adetler arasında kanama varsa",
          "- Günlük hayatı engelleyen şiddetli ağrı varsa",
          "Bu belirtiler tiroid sorunları, polikistik over sendromu, miyom gibi tedavi edilebilir durumların işareti olabilir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Adet döngüsünün kaçıncı günündeyim?",
        answer:
          "Son adetinizin başladığı gün döngünün 1. günüdür. Bugünün tarihinden o günü çıkarıp 1 eklerseniz kaçıncı günde olduğunuzu bulursunuz.",
      },
      {
        question: "Düzensiz döngüde yumurtlama hesaplanabilir mi?",
        answer:
          "Takvim tahmini güvenilirliğini kaybeder. Bu durumda yumurtlama testleri, bazal vücut sıcaklığı takibi veya akıntı değişiminin izlenmesi daha yol göstericidir.",
      },
      {
        question: "Adet sırasında gebe kalınır mı?",
        answer:
          "İhtimal düşüktür ama sıfır değildir. Döngüsü kısa olan kişilerde yumurtlama erken gerçekleşebilir ve spermin 5 güne kadar canlı kalması nedeniyle adetin son günlerindeki ilişki gebelikle sonuçlanabilir.",
      },
      {
        question: "Döngü uzunluğu neden her ay değişiyor?",
        answer:
          "Yumurtlamanın zamanı dış etkenlerden etkilenir; luteal faz ise sabit kalır. Bu nedenle döngüdeki oynama çoğunlukla yumurtlamanın erken veya geç gerçekleşmesinden kaynaklanır.",
      },
    ],
    related: ["ideal-kilo-nasil-hesaplanir"],
  },
];

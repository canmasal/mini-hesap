/**
 * Engelli hakları rehberleri: %90 engelli raporuyla ÖTV istisnalı araç alımı.
 *
 * Tutar sınırı ve süreler data/parameters.ts'teki DISABLED_VEHICLE'dan gelir;
 * her yıl başında yayımlanan ÖTV tebliğiyle yalnızca orası güncellenir.
 */

import type { Guide } from "@/data/guides";
import { MTV_YEAR } from "@/data/mtv";
import { DISABLED_VEHICLE as DV, tl } from "@/data/parameters";

const pct = (rate: number) => `%${(rate * 100).toLocaleString("tr-TR")}`;

/* Örnek: vergisiz fiyatı 1.400.000 TL, ÖTV oranı %60 olan bir otomobil */
const example = (() => {
  const net = 1400000;
  const otvRate = 0.6;
  const kdvRate = 0.2;
  const otv = net * otvRate;
  const normal = (net + otv) * (1 + kdvRate);
  /* İstisnada ÖTV hesaplanmaz; KDV matrahına da ÖTV girmez */
  const exempt = net * (1 + kdvRate);
  return { net, otvRate, otv, normal, exempt, saving: normal - exempt };
})();

export const engelliGuides: Guide[] = [
  {
    slug: "yuzde-90-engelli-raporu-ile-arac-nasil-alinir",
    title: `%90 Engelli Raporu ile Araç Nasıl Alınır? ${DV.year} ÖTV İstisnası`,
    metaTitle: `%90 Engelli Raporu ile ÖTV'siz Araç ${DV.year}`,
    description: `%90 engelli raporuyla ÖTV'siz araç alımı ${DV.year}: ${tl(DV.priceLimit)} üst sınır, ${pct(DV.minLocalContent)} yerli katkı, ${DV.reuseYears} yıl kuralı, satış yasağı ve adım adım başvuru.`,
    category: "Vergi",
    icon: "♿",
    published: "2026-09-18",
    updated: "2026-09-18",
    readingMinutes: 7,
    tool: { slug: "mtv", label: "MTV Hesaplama" },
    intro: `Engel oranı ${pct(DV.severeDisabilityRate)} ve üzerinde olan kişiler, sıfır aracı özel tüketim vergisi (ÖTV) ödemeden satın alabilir. ÖTV, bir otomobilin fiyatının önemli bir kısmını oluşturduğu için bu istisna yüz binlerce liralık bir fark yaratır. Bu rehberde ${DV.year} yılı şartlarını, fiyat sınırını ve aracı alırken izlemeniz gereken adımları anlatıyoruz.`,
    sections: [
      {
        heading: "Kimler ÖTV'siz araç alabilir?",
        body: [
          `ÖTV istisnası iki gruba tanınır ve şartları farklıdır:`,
          `- <strong>Engel oranı ${pct(DV.severeDisabilityRate)} ve üzeri olanlar:</strong> Engelin türü önemli değildir. Araçta özel tertibat (engelliye uygun donanım) yaptırma ve aracı bizzat kullanma şartı aranmaz.`,
          `- <strong>Engel oranı ${pct(DV.severeDisabilityRate)}'ın altında olanlar:</strong> Yalnızca mevzuatta sayılan ortopedik engeli bulunanlar yararlanabilir. Aracı bizzat kullanmaları ve engellerine uygun özel tertibat yaptırmaları gerekir.`,
          "Çocuklar için verilen ÇÖZGER raporlarında \"özel koşul gereksinimi vardır\" (ÖKGV) ibaresi bulunan çocuklar da %90 ve üzeri engelli gibi değerlendirilir.",
        ],
      },
      {
        heading: `${DV.year} fiyat üst sınırı: ${tl(DV.priceLimit)}`,
        body: [
          `ÖTV istisnasıyla alınabilecek aracın, istisna uygulanmasaydı ödenecek fiyatı, yani <strong>ÖTV ve KDV dâhil satış bedeli</strong> ${DV.year} yılı için en fazla <strong>${tl(DV.priceLimit)}</strong> olabilir. Sınır ${DV.year - 1} yılında ${tl(DV.previousLimit)} idi ve her yıl yeniden değerleme oranında artırılır.`,
          "Sınır, aracın ÖTV'siz fiyatına değil vergiler dâhil normal liste fiyatına uygulanır. Bayide gördüğünüz etiket fiyatı sınırı aşıyorsa o araç istisnayla alınamaz.",
          `Dayanak: ÖTV Kanunu md. 7/2 ve 31.12.2025 tarihli Resmî Gazete'de yayımlanan 16 Seri No.lu ÖTV (II) Sayılı Liste Uygulama Genel Tebliği.`,
        ],
      },
      {
        heading: "Ne kadar tasarruf edilir? Örnek hesaplama",
        body: [
          `Vergisiz fiyatı ${tl(example.net)}, ÖTV oranı ${pct(example.otvRate)} olan bir otomobil düşünelim:`,
          `- Normal fiyat: (${tl(example.net)} + ${tl(example.otv)} ÖTV) × 1,20 KDV = <strong>${tl(example.normal)}</strong>`,
          `- Engelli fiyatı: ${tl(example.net)} × 1,20 KDV = <strong>${tl(example.exempt)}</strong>`,
          `- Tasarruf: <strong>${tl(example.saving)}</strong>`,
          "ÖTV ödenmediği için KDV de daha düşük bir tutar üzerinden hesaplanır; tasarruf bu yüzden ÖTV tutarından da fazladır. KDV istisnası yoktur, KDV her durumda ödenir.",
          "ÖTV oranı aracın vergisiz fiyatına ve motor hacmine göre değiştiği için gerçek tasarruf modele göre farklı olur.",
        ],
      },
      {
        heading: "Aracın taşıması gereken şartlar",
        body: [
          `- <strong>Yerli katkı:</strong> Aracın yerli katkı oranı en az ${pct(DV.minLocalContent)} olmalıdır. Bu şart ithal modellerin büyük kısmını fiilen dışarıda bırakır; hangi modellerin uygun olduğunu bayiden öğrenebilirsiniz.`,
          "- <strong>Sıfır araç:</strong> İstisna aracın ilk iktisabında, yani bayiden sıfır olarak alınırken uygulanır. İkinci el araç ÖTV istisnasıyla alınamaz.",
          "- <strong>Motor hacmi:</strong> %90 ve üzeri engellilerde ayrıca motor hacmi sınırı yoktur; fiyat sınırı ve yerli katkı şartı belirleyicidir.",
          "- <strong>Araç türü:</strong> Otomobil, arazi taşıtı, panelvan ve bazı hafif ticari araçlar ile motosikletler kapsamdadır.",
        ],
      },
      {
        heading: `${DV.reuseYears} yılda bir hak ve 5 yıl satış yasağı`,
        body: [
          `- <strong>Yeniden yararlanma:</strong> 27 Aralık 2024'ten itibaren ÖTV istisnasından <strong>${DV.reuseYears} yılda bir</strong> yararlanılabilir. Önceden bu süre 5 yıldı.`,
          `- <strong>Satış ve devir:</strong> Araç, alındığı tarihten itibaren <strong>${DV.saleLockYears} yıl</strong> dolmadan, istisna nedeniyle ödenmeyen ÖTV ödenmeden satılamaz, devredilemez, hibe edilemez ve vekâletle başkasına kullandırılamaz. Özel tertibatlı araçlarda tertibat da sökülemez.`,
          `- Süre dolmadan satmak isterseniz ödenmeyen ÖTV'yi gecikme faiziyle birlikte ödemeniz gerekir.`,
          `- Satış yasağının ${DV.reuseYears} yıla çıkarılmasına ilişkin idari düzenlemenin yürütmesi Danıştay tarafından Kasım 2025'te durdurulmuştur; dava sürdüğü için satış yapmadan önce vergi dairenizden güncel durumu teyit edin.`,
        ],
      },
      {
        heading: "Aracı kim kullanabilir?",
        body: [
          `Engel oranı ${pct(DV.severeDisabilityRate)} ve üzeri olanlarda aracı engelli kişinin bizzat kullanması şartı yoktur. Araç engelli adına tescil edilir; aile üyeleri veya bakımını üstlenen kişiler, engellinin ihtiyaçları için aracı kullanabilir.`,
          "Ancak aracı vekâletname ile başkasına devretmek, kiraya vermek ya da ticari amaçla kullandırmak satış yasağı kapsamındadır ve ÖTV'nin geri istenmesine yol açar.",
          "Vesayet altındaki engelliler adına işlemler vasi tarafından yürütülür; vasinin satış gibi işlemler için sulh hukuk mahkemesinden izin alması gerekebilir.",
        ],
      },
      {
        heading: "Adım adım ÖTV'siz araç alımı",
        body: [
          `- <strong>1. Sağlık kurulu raporunu alın:</strong> Tam teşekküllü bir hastaneden, engel oranının ${pct(DV.severeDisabilityRate)} veya üzeri olduğunu gösteren erişkin sağlık kurulu raporu (çocuklar için ÇÖZGER raporu) alın. Raporun geçerlilik süresinin dolmamış olmasına dikkat edin.`,
          "- <strong>2. Uygun modeli seçin:</strong> Bayiden, ÖTV ve KDV dâhil fiyatı sınırın altında kalan ve yerli katkı şartını sağlayan modellerin listesini isteyin.",
          "- <strong>3. Bayiye başvurun:</strong> Raporunuz, kimliğiniz ve varsa vasi belgesiyle bayiye başvurun. Bayi, satış öncesinde raporunuzu ve son yıllarda istisnadan yararlanıp yararlanmadığınızı sistem üzerinden kontrol eder.",
          "- <strong>4. Fatura ve tescil:</strong> Bayi ÖTV'siz fatura düzenler. Araç noterde ya da tescil kuruluşunda engelli adına tescil edilir; ruhsata satış kısıtlaması işlenir.",
          "- <strong>5. MTV muafiyeti için başvurun:</strong> Aracın motorlu taşıtlar vergisinden muaf tutulması için bağlı olduğunuz vergi dairesine raporunuzla başvurun.",
        ],
      },
      {
        heading: "MTV muafiyeti",
        body: [
          "Engelliler adına kayıtlı ve istisna kapsamında alınan bir taşıt için motorlu taşıtlar vergisi ödenmez. Muafiyet birden fazla araç için kullanılamaz ve kendiliğinden işlemez; vergi dairesine başvurmanız gerekir.",
          "Muafiyetin kapsamı dışında kalan başka bir aracınız varsa MTV tutarını hesaplamak için MTV hesaplama aracını kullanabilirsiniz.",
        ],
      },
    ],
    faqs: [
      {
        question: `${DV.year} engelli araç ÖTV muafiyeti üst sınırı ne kadar?`,
        answer: `${DV.year} yılı için ÖTV ve KDV dâhil satış bedeli en fazla ${tl(DV.priceLimit)} olan araçlar istisnayla alınabilir.`,
      },
      {
        question: "%90 engelli raporu olan kişi aracı kendisi kullanmak zorunda mı?",
        answer: `Hayır. Engel oranı ${pct(DV.severeDisabilityRate)} ve üzeri olanlarda bizzat kullanma ve özel tertibat şartı aranmaz; araç engelli adına tescil edilir ve yakınları tarafından engellinin ihtiyaçları için kullanılabilir.`,
      },
      {
        question: "ÖTV'siz alınan araç kaç yıl sonra satılabilir?",
        answer: `Kanundaki süre ${DV.saleLockYears} yıldır. Bu süre dolmadan satış yapılırsa ödenmeyen ÖTV gecikme faiziyle birlikte ödenir. Sürenin ${DV.reuseYears} yıla çıkarılmasına ilişkin düzenleme Danıştay'ın yürütmeyi durdurma kararıyla askıdadır.`,
      },
      {
        question: "Ne kadar sürede bir ÖTV'siz araç alınabilir?",
        answer: `27 Aralık 2024'ten itibaren ${DV.reuseYears} yılda bir defa ÖTV istisnasından yararlanılabilir.`,
      },
      {
        question: "Engelli araç alımında KDV de ödenmez mi?",
        answer:
          "Hayır. İstisna yalnızca ÖTV'yi kapsar, KDV ödenir. Ancak ÖTV hesaplanmadığı için KDV daha düşük bir tutar üzerinden hesaplanır.",
      },
      {
        question: "İkinci el araç ÖTV'siz alınabilir mi?",
        answer: "Hayır. İstisna yalnızca aracın ilk iktisabında, yani sıfır araç alımında uygulanır.",
      },
    ],
    related: [`mtv-${MTV_YEAR}-nasil-hesaplanir`, "kredi-taksiti-nasil-hesaplanir", "konut-kredisi-masraflari"],
  },
];

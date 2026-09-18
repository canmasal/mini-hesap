/**
 * Vergi araçlarının SEO içerikleri: kira geliri vergisi, emlak vergisi,
 * damga vergisi. Rakamlar data/parameters.ts dosyasından gelir.
 */

import type { ToolSeo } from "@/data/calculatorSeo";
import { MTV_YEAR, TARIFF_I, TARIFF_IA } from "@/data/mtv";
import {
  PARAMETERS_YEAR as Y,
  PROPERTY_TAX,
  RENTAL_INCOME,
  STAMP_TAX,
  tl,
} from "@/data/parameters";

const binde = (rate: number) => `binde ${(rate * 1000).toLocaleString("tr-TR")}`;

export const toolSeoVergi: Record<string, ToolSeo> = {
  /* ==================== KİRA GELİRİ VERGİSİ ==================== */
  "kira-geliri-vergisi": {
    title: `Kira Geliri Vergisi Hesaplama ${Y} | GMSİ`,
    description: `Kira geliri vergisi hesaplama ${Y}: ${tl(
      RENTAL_INCOME.exemption,
    )} mesken istisnası ve götürü giderle ödeyeceğiniz vergiyi ve net kira gelirinizi bulun.`,
    intro: `Konut veya işyeri kiraya verenler, yıllık kira gelirleri için gayrimenkul sermaye iradı (GMSİ) beyannamesi verir. ${Y} yılında mesken kira gelirinin ${tl(
      RENTAL_INCOME.exemption,
    )} tutarındaki kısmı gelir vergisinden istisnadır. Hesaplayıcı istisnayı, gider indirimini ve vergi dilimlerini birlikte uygulayarak ödeyeceğiniz vergiyi gösterir.`,
    howItWorks: [
      "Kira türünü seçin: konut (mesken) ya da işyeri.",
      "Aylık kira tutarını ve kaç ay kira aldığınızı girin.",
      "Götürü gider (%15) veya belgeli gerçek gider yöntemini seçin.",
      "İstisna, gider ve vergi dilimleri düşülerek ödeyeceğiniz vergi hesaplanır.",
    ],
    sections: [
      {
        heading: "Kira geliri vergisi nasıl hesaplanır?",
        body: [
          "Hesap dört adımdan oluşur:",
          "- <strong>1. Brüt kira geliri:</strong> Yıl içinde tahsil edilen toplam kira.",
          `- <strong>2. İstisna:</strong> Mesken kirasında ${tl(RENTAL_INCOME.exemption)} düşülür (işyerinde istisna yoktur).`,
          "- <strong>3. Gider:</strong> Kalan tutardan götürü %15 veya belgeli gerçek giderler indirilir.",
          "- <strong>4. Vergi:</strong> Kalan matraha gelir vergisi tarifesi uygulanır.",
          `Örnek: Aylık 25.000 TL konut kirası alan biri yılda 300.000 TL gelir elde eder. İstisna sonrası ${tl(
            300000 - RENTAL_INCOME.exemption,
          )}, götürü gider sonrası matrah ${tl(
            (300000 - RENTAL_INCOME.exemption) * 0.85,
          )} olur ve vergi bu matrah üzerinden hesaplanır.`,
        ],
      },
      {
        heading: "Mesken istisnasından kimler yararlanamaz?",
        body: [
          "- Ticari, zirai veya mesleki kazancını yıllık beyanname ile bildirmek zorunda olanlar",
          "- İstisna haddinin üzerinde kira geliri elde edip beyan etmeyenler veya eksik beyan edenler",
          `- Beyanı gerekmeyen gelirler hariç toplam brüt geliri ${tl(
            RENTAL_INCOME.exemptionIncomeLimit,
          )} tutarını aşanlar`,
          "İstisna konut başına değil kişi başına uygulanır: iki konutu olan biri toplam gelirinden yalnızca bir kez istisna düşer. Konut eşler arasında paylı ise her ortak kendi payı için ayrı ayrı yararlanır.",
        ],
      },
      {
        heading: "Götürü gider mi, gerçek gider mi?",
        body: [
          "<strong>Götürü gider:</strong> Belge aranmaz, istisna sonrası tutarın %15'i doğrudan indirilir. Hakkını kiraya verenler bu yöntemi seçemez. Götürü yöntemi seçen mükellef iki yıl geçmeden gerçek gider yöntemine dönemez.",
          "<strong>Gerçek gider:</strong> Aidat, sigorta, bakım-onarım, emlak vergisi, amortisman gibi belgeli giderler indirilir. Giderleri yüksek olan taşınmazlarda daha avantajlıdır; belgelerin beş yıl saklanması gerekir.",
          "1.1.2025 tarihinden itibaren <strong>konutlarda</strong> konut kredisi faizi gerçek gider olarak indirilemez.",
        ],
      },
      {
        heading: "İşyeri kirasında stopaj",
        body: [
          `İşyeri kirasında kiracı, ödeme sırasında %${
            RENTAL_INCOME.workplaceWithholding * 100
          } oranında stopaj keser ve vergi dairesine yatırır. Yıllık brüt kira ${tl(
            RENTAL_INCOME.workplaceDeclarationLimit,
          )} tutarını aşmıyorsa beyanname verilmez; aşıyorsa beyan edilir ve yıl içinde kesilen stopaj hesaplanan vergiden mahsup edilir.`,
          `Stopaj yapılmayan (basit usul mükellefe kiralanan) işyerlerinde beyan sınırı ${tl(
            RENTAL_INCOME.workplaceNoWithholdingLimit,
          )} tutarındadır.`,
        ],
      },
    ],
    faqs: [
      {
        question: `${Y} kira geliri istisnası ne kadar?`,
        answer: `${Y} takvim yılında elde edilen mesken kira gelirlerinde istisna ${tl(
          RENTAL_INCOME.exemption,
        )} tutarındadır. Bu tutarın altında konut kira geliri elde edenler beyanname vermez.`,
      },
      {
        question: "Kira geliri beyannamesi ne zaman verilir?",
        answer:
          "Bir takvim yılında elde edilen kira gelirleri, izleyen yılın mart ayında beyan edilir. Vergi mart ve temmuz olmak üzere iki eşit taksitte ödenir.",
      },
      {
        question: "Kirayı elden aldım, yine de beyan etmem gerekir mi?",
        answer:
          "Evet. Kira geliri tahsil edildiği yılın geliri sayılır ve ödeme şekli beyan yükümlülüğünü değiştirmez. Ayrıca konutlarda aylık 500 TL ve üzeri kiraların banka veya PTT üzerinden tahsil edilmesi zorunludur; aksi halde ceza uygulanır.",
      },
      {
        question: "Boş kalan aylar için vergi öder miyim?",
        answer:
          "Hayır. Vergi yalnızca fiilen tahsil edilen kira üzerinden hesaplanır. Hesaplayıcıda kaç ay kira aldığınızı girerek boş dönemleri hesap dışında tutabilirsiniz.",
      },
    ],
  },

  /* ==================== EMLAK VERGİSİ ==================== */
  "emlak-vergisi": {
    title: `Emlak Vergisi Hesaplama ${Y} | Konut ve İşyeri`,
    description: `Emlak vergisi hesaplama ${Y}: konut, işyeri, arsa ve arazi için yıllık vergiyi, kültür payını ve taksit tutarlarını güncel oranlarla hesaplayın.`,
    intro: `Emlak vergisi, taşınmazın belediye tarafından belirlenen vergi değeri üzerinden her yıl ödenir. Oran taşınmazın türüne ve büyükşehir belediyesi sınırları içinde olup olmamasına göre değişir. Hesaplayıcı ${Y} oranlarıyla yıllık vergiyi ve iki taksit tutarını gösterir.`,
    howItWorks: [
      "Belediyenin bildirdiği emlak vergi değerini girin (satış fiyatı değil).",
      "Taşınmaz türünü seçin: konut, işyeri, arsa veya arazi.",
      "Büyükşehir belediyesi sınırları içinde olup olmadığını işaretleyin.",
      "Yıllık vergi, kültür varlıkları katkı payı ve taksit tutarı hesaplanır.",
    ],
    sections: [
      {
        heading: "Emlak vergisi oranları",
        body: [
          "Vergi = <strong>Emlak vergi değeri × Oran</strong>. Büyükşehir belediyesi sınırları içinde oranlar iki kat uygulanır:",
          `- Konut (mesken): ${binde(PROPERTY_TAX.rates.mesken.normal)} — büyükşehirde ${binde(
            PROPERTY_TAX.rates.mesken.metropolitan,
          )}`,
          `- İşyeri: ${binde(PROPERTY_TAX.rates.isyeri.normal)} — büyükşehirde ${binde(
            PROPERTY_TAX.rates.isyeri.metropolitan,
          )}`,
          `- Arsa: ${binde(PROPERTY_TAX.rates.arsa.normal)} — büyükşehirde ${binde(
            PROPERTY_TAX.rates.arsa.metropolitan,
          )}`,
          `- Arazi: ${binde(PROPERTY_TAX.rates.arazi.normal)} — büyükşehirde ${binde(
            PROPERTY_TAX.rates.arazi.metropolitan,
          )}`,
          "Ayrıca tahakkuk eden verginin %10'u kadar taşınmaz kültür varlıklarının korunmasına katkı payı alınır.",
        ],
      },
      {
        heading: "Emlak vergi değeri nedir?",
        body: [
          "Emlak vergi değeri, taşınmazın satış fiyatı değildir. Bina için arsa payı ile binanın metrekare normal inşaat maliyet bedeli, arsa için ise takdir komisyonlarınca belirlenen asgari metrekare birim değeri esas alınarak belediyece hesaplanır.",
          "Değerinizi belediyenizin e-belediye sayfasından veya emlak servisinden öğrenebilirsiniz.",
        ],
      },
      {
        heading: "Ödeme zamanı ve indirimli oran",
        body: [
          `${PROPERTY_TAX.installments}`,
          `Türkiye'de brüt ${PROPERTY_TAX.reducedRateMaxArea} m²'yi geçmeyen tek konutu olan şu kişiler indirimli (sıfır) orandan yararlanır: engelliler, hiçbir geliri olmadığını belgeleyenler, geliri münhasıran SGK'dan aldığı emekli, dul, yetim veya malullük aylığından ibaret olanlar, gaziler ile şehitlerin dul ve yetimleri.`,
          "Muafiyet kendiliğinden uygulanmaz; belediyeye taahhüt belgesi ile başvurmak gerekir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Emlak vergisi ne zaman ödenir?",
        answer:
          "Yılda iki taksitte ödenir. Birinci taksit mart, nisan ve mayıs aylarında (son gün 31 mayıs), ikinci taksit kasım ayında (son gün 30 kasım) ödenir.",
      },
      {
        question: "Evi satarsam emlak vergisini kim öder?",
        answer:
          "Satış yılının vergisinden satıcı sorumludur; vergi mükellefiyeti izleyen yılın başında alıcıya geçer. Devir sırasında belediyeden alınan borcu yoktur yazısı istenir.",
      },
      {
        question: "Emekliyim, emlak vergisi öder miyim?",
        answer:
          `Geliriniz yalnızca SGK'dan aldığınız emekli aylığından ibaretse ve Türkiye'de brüt ${PROPERTY_TAX.reducedRateMaxArea} m²'yi geçmeyen tek konutunuz varsa indirimli (sıfır) orandan yararlanabilirsiniz. Belediyeye başvurmanız gerekir.`,
      },
      {
        question: "Emlak vergisini geç ödersem ne olur?",
        answer:
          "Süresinde ödenmeyen taksitler için gecikme zammı işler. Borç, tapu devri gibi işlemlerde de karşınıza çıkar; taksiti kaçırdıysanız en kısa sürede ödemek maliyeti azaltır.",
      },
    ],
  },

  /* ==================== DAMGA VERGİSİ ==================== */
  "damga-vergisi": {
    title: `Damga Vergisi Hesaplama ${Y} | Sözleşme ve Kira`,
    description: `${Y} damga vergisi hesaplama: sözleşmelerde ${binde(
      STAMP_TAX.contract,
    )}, kira sözleşmelerinde ${binde(
      STAMP_TAX.rentContract,
    )} oranıyla ödenecek vergiyi ve taraf başına düşen tutarı hesaplayın.`,
    intro: `Damga vergisi, belli bir parayı içeren sözleşme, taahhütname, bordro gibi kâğıtlardan alınır. Oran kâğıdın türüne göre değişir ve her bir kâğıt için ${Y} yılında ${tl(
      STAMP_TAX.maximum,
    )} tutarındaki azami sınır aşılamaz.`,
    howItWorks: [
      "Kâğıt türünü seçin (sözleşme, kira sözleşmesi, bordro).",
      "Sözleşme bedelini girin; kira sözleşmesinde aylık kira ve süreyi yazın.",
      "Vergiyi kaç tarafın paylaşacağını belirtin.",
      "Ödenecek damga vergisi ve taraf başına düşen tutar hesaplanır.",
    ],
    sections: [
      {
        heading: "Damga vergisi oranları",
        body: [
          `- Belli parayı ihtiva eden sözleşme, taahhütname, temlikname: <strong>${binde(
            STAMP_TAX.contract,
          )}</strong>`,
          `- Kira sözleşmesi (kefilsiz): <strong>${binde(STAMP_TAX.rentContract)}</strong>`,
          `- Adi kefilli kira sözleşmesi: <strong>${binde(STAMP_TAX.rentWithSurety)}</strong>`,
          `- Müteselsil kefilli kira sözleşmesi: <strong>${binde(STAMP_TAX.rentWithJointSurety)}</strong>`,
          `- Ücret ödemesi (bordro): <strong>${binde(STAMP_TAX.payroll)}</strong>`,
          `Her bir kâğıttan alınacak damga vergisi ${Y} yılında en fazla ${tl(STAMP_TAX.maximum)} olabilir.`,
        ],
      },
      {
        heading: "Kira sözleşmesinde matrah nasıl bulunur?",
        body: [
          "Kira sözleşmelerinde vergi, aylık kira üzerinden değil <strong>sözleşme süresi boyunca ödenecek toplam kira</strong> üzerinden hesaplanır.",
          `Örnek: Aylık 25.000 TL bedelle 12 aylık konut kirası sözleşmesinde matrah 300.000 TL, damga vergisi 300.000 × ${
            STAMP_TAX.rentContract
          } = <strong>${tl(300000 * STAMP_TAX.rentContract)}</strong> olur.`,
          "Kefil varsa oran yükselir; kefaletin türü (adi veya müteselsil) sözleşmede açıkça yazmalıdır.",
        ],
      },
      {
        heading: "Vergiyi kim öder, ne zaman ödenir?",
        body: [
          "Kâğıdı imzalayan taraflar damga vergisinden müteselsilen sorumludur; aralarında paylaşımı serbestçe kararlaştırabilirler. Uygulamada sözleşmeye bir hüküm konularak taraflardan biri üstlenir.",
          "Sürekli damga vergisi mükellefiyeti olanlar (şirketler) kâğıdı düzenledikleri ayı izleyen ayın 26'sına kadar beyan edip öder. Diğerleri kâğıdın düzenlendiği tarihten itibaren 15 gün içinde vergi dairesine beyan eder.",
          "Nüsha sayısı önemlidir: her nüsha için ayrı damga vergisi doğar. Tek nüsha düzenleyip taraflara fotokopi vermek maliyeti düşürür.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kira sözleşmesinde damga vergisi var mı?",
        answer: `Evet. Kira sözleşmesi belli parayı ihtiva eden bir kâğıt olduğu için ${binde(
          STAMP_TAX.rentContract,
        )} oranında damga vergisine tabidir. Matrah, sözleşme süresi boyunca ödenecek toplam kiradır.`,
      },
      {
        question: "Damga vergisini kiracı mı ev sahibi mi öder?",
        answer:
          "Kanun her iki tarafı da müteselsilen sorumlu tutar. Kim ödeyecekse sözleşmede açıkça yazılması, sonradan çıkacak anlaşmazlığı önler.",
      },
      {
        question: "Maaş bordrosunda damga vergisi ne kadar?",
        answer: `Ücret ödemelerinde damga vergisi ${binde(
          STAMP_TAX.payroll,
        )} oranındadır. Asgari ücret tutarına isabet eden kısmı istisnadır; bu istisna tüm çalışanlara uygulanır.`,
      },
      {
        question: "Damga vergisinin üst sınırı var mı?",
        answer: `Evet. Nispi damga vergisi her bir kâğıt için ${Y} yılında en fazla ${tl(
          STAMP_TAX.maximum,
        )} olabilir. Bu tutarın üzerindeki sözleşmelerde vergi azami tutarda sabitlenir.`,
      },
    ],
  },
  /* ==================== MTV ==================== */
  mtv: {
    title: `MTV Hesaplama ${MTV_YEAR} | Motorlu Taşıtlar Vergisi`,
    description: `${MTV_YEAR} MTV hesaplama: motor hacmi, model yılı ve taşıt değerine göre motorlu taşıtlar vergisini ve ocak-temmuz taksit tutarlarını öğrenin.`,
    intro: `Motorlu taşıtlar vergisi, taşıtın motor silindir hacmi ve yaşına göre her yıl ocak ve temmuz aylarında iki taksitte ödenir. 1.1.2018 ve sonrasında tescil edilen otomobillerde taşıt değeri de vergiyi etkiler. Hesaplayıcı ${MTV_YEAR} tarifeleriyle yıllık vergiyi ve taksitleri gösterir.`,
    howItWorks: [
      "Taşıt türünü seçin: otomobil veya motosiklet.",
      "Ruhsatta yazan motor silindir hacmini (cm³) girin.",
      "Model yılını yazın; taşıt model yılında bir yaşında sayılır.",
      "Otomobilde tescil tarihini ve gerekiyorsa taşıt değerini belirtin.",
    ],
    sections: [
      {
        heading: "MTV nasıl hesaplanır?",
        body: [
          "MTV, gelire veya kullanıma göre değil <strong>tarifeye</strong> göre belirlenir. Vergiyi üç şey belirler:",
          "- <strong>Motor silindir hacmi:</strong> Ruhsatta yazan cm³ değeri.",
          "- <strong>Yaş:</strong> Taşıt, tescil belgesindeki model yılında bir yaşında kabul edilir (197 sayılı Kanun md. 11). Yaş = İçinde bulunulan yıl − Model yılı + 1.",
          "- <strong>Taşıt değeri:</strong> Yalnızca 1.1.2018 ve sonrasında tescil edilen otomobillerde dikkate alınır.",
          `Örnek: 2018 model, 1598 cm³ bir otomobilin ${MTV_YEAR} yılındaki yaşı ${MTV_YEAR} − 2018 + 1 = 9'dur; 7–11 yaş grubuna girer.`,
        ],
      },
      {
        heading: "İki ayrı tarife: (I) ve (I/A)",
        body: [
          "<strong>(I) sayılı tarife</strong> 1.1.2018 ve sonrasında kayıt ve tescil edilen otomobillere uygulanır. Bu tarifede aynı motor hacmi ve yaş için taşıt değerine göre iki ya da üç farklı tutar vardır.",
          "<strong>(I/A) sayılı tarife</strong> 31.12.2017 ve öncesinde tescil edilmiş otomobiller içindir; taşıt değeri kriteri yoktur, yalnızca motor hacmi ve yaş bakılır.",
          "İki tarifenin tutarları farklıdır: eski tescilli araçlar genellikle daha düşük vergi öder. Hesaplayıcıda tescil tarihini doğru seçmek bu yüzden önemlidir.",
        ],
      },
      {
        heading: `${MTV_YEAR} yaş grupları`,
        body: [
          `${MTV_YEAR} yılında hangi model yılının hangi gruba girdiği:`,
          `- 1 – 3 yaş: ${MTV_YEAR}, ${MTV_YEAR - 1}, ${MTV_YEAR - 2} model`,
          `- 4 – 6 yaş: ${MTV_YEAR - 3}, ${MTV_YEAR - 4}, ${MTV_YEAR - 5} model`,
          `- 7 – 11 yaş: ${MTV_YEAR - 6} – ${MTV_YEAR - 10} model`,
          `- 12 – 15 yaş: ${MTV_YEAR - 11} – ${MTV_YEAR - 14} model`,
          `- 16 yaş ve üzeri: ${MTV_YEAR - 15} ve öncesi model`,
          "Yaş grubu değiştiğinde yeni tutar, takip eden yılın başından itibaren uygulanır; yıl içinde taksit değişmez.",
        ],
      },
      {
        heading: "En çok kullanılan tutarlar",
        body: [
          `${MTV_YEAR} yılında 1301–1600 cm³ otomobiller için (I) sayılı tarifenin en düşük değer diliminde yıllık vergi: 1–3 yaş ${TARIFF_I[1].brackets[0].amounts[0].toLocaleString("tr-TR")} TL, 7–11 yaş ${TARIFF_I[1].brackets[0].amounts[2].toLocaleString("tr-TR")} TL.`,
          `Aynı motor hacmindeki 2018 öncesi tescilli araçlarda (I/A tarifesi): 12–15 yaş ${TARIFF_IA[1].amounts[3].toLocaleString("tr-TR")} TL, 16 yaş ve üzeri ${TARIFF_IA[1].amounts[4].toLocaleString("tr-TR")} TL.`,
          "Tutarlar her yıl yeniden değerleme oranında artırılır.",
        ],
      },
    ],
    faqs: [
      {
        question: "MTV ne zaman ödenir?",
        answer:
          "Motorlu taşıtlar vergisi her yıl ocak ve temmuz aylarında iki eşit taksitte ödenir. İsteyen yıllık tutarın tamamını ocak döneminde tek seferde ödeyebilir.",
      },
      {
        question: "MTV'de yaş nasıl hesaplanır?",
        answer:
          "Taşıt, ruhsatındaki model yılında bir yaşında kabul edilir ve her takvim yılı başında bir yaş büyür. Aracı yıl içinde hangi ayda aldığınız yaşı etkilemez.",
      },
      {
        question: "Aracı yıl içinde satarsam MTV'yi kim öder?",
        answer:
          "Satıştan önce doğmuş ve ödenmemiş MTV borcundan satıcı sorumludur; devir sırasında borcu yoktur belgesi istenir. Devirden sonraki dönemlerin vergisi yeni malike aittir.",
      },
      {
        question: "MTV'yi geç ödersem ne olur?",
        answer:
          "Süresinde ödenmeyen MTV için gecikme zammı işler. Ayrıca MTV borcu olan taşıtlar fenni muayene yaptıramaz ve satış, devir işlemi yapılamaz.",
      },
      {
        question: "Elektrikli araçta MTV nasıl hesaplanır?",
        answer:
          "Elektrikli otomobillerde motor gücü (kW) esas alınan ayrı bir tarife uygulanır; bu hesaplayıcı içten yanmalı motorlu taşıtlar içindir. Elektrikli aracınızın tutarı için Dijital Vergi Dairesi sorgulamasını kullanın.",
      },
    ],
  },
};

/**
 * Vergi rehberleri: kira geliri, emlak vergisi, damga vergisi, MTV.
 *
 * Rakamlar data/parameters.ts ve data/mtv.ts dosyalarından gelir; tebliğ
 * değiştiğinde tek yerden güncellenir.
 */

import type { Guide } from "@/data/guides";
import { MTV_YEAR, TARIFF_I, TARIFF_IA } from "@/data/mtv";
import {
  PARAMETERS_YEAR as Y,
  PROPERTY_TAX,
  RENTAL_INCOME,
  STAMP_TAX,
  tl,
} from "@/data/parameters";

const binde = (rate: number) => `binde ${(rate * 1000).toLocaleString("tr-TR")}`;
const trl = (value: number) => value.toLocaleString("tr-TR");

export const vergiGuides: Guide[] = [
  /* =======================================================
     KİRA GELİRİ VERGİSİ
  ======================================================= */
  {
    slug: `kira-geliri-vergisi-${Y}-nasil-hesaplanir`,
    title: "Kira Geliri Vergisi Nasıl Hesaplanır?",
    metaTitle: `Kira Geliri Vergisi ${Y}: İstisna ve Beyan`,
    description: `${Y} kira geliri vergisi: mesken istisnası ${tl(
      RENTAL_INCOME.exemption,
    )}, götürü gider %15, işyeri stopajı ve beyan sınırları. Örnek hesaplamalarla adım adım.`,
    category: "Vergi",
    icon: "🏘️",
    published: "2026-09-16",
    updated: "2026-09-16",
    readingMinutes: 7,
    tool: { slug: "kira-geliri-vergisi", label: "Kira Geliri Vergisi Hesaplama" },
    intro: `Kira geliri, vergi dilinde gayrimenkul sermaye iradı (GMSİ) olarak adlandırılır ve her yıl mart ayında beyan edilir. Konut kiralarında ${Y} yılı için ${tl(
      RENTAL_INCOME.exemption,
    )} tutarında istisna vardır; bu tutarın altında kalan konut kirası beyan edilmez. Bu rehberde istisnayı, gider yöntemlerini ve işyeri kirasındaki stopaj mahsubunu örneklerle anlatıyoruz.`,
    sections: [
      {
        heading: "Hesap dört adımda yapılır",
        body: [
          "- <strong>1. Brüt kira:</strong> Yıl içinde fiilen tahsil edilen toplam kira.",
          `- <strong>2. İstisna:</strong> Mesken kirasında ${tl(RENTAL_INCOME.exemption)} düşülür. İşyeri kirasında istisna yoktur.`,
          "- <strong>3. Gider:</strong> Götürü (%15) veya belgeli gerçek gider indirilir.",
          "- <strong>4. Tarife:</strong> Kalan matraha gelir vergisi tarifesi uygulanır.",
        ],
      },
      {
        heading: "Örnek: aylık 25.000 TL konut kirası",
        body: [
          "Yıllık brüt kira: 25.000 × 12 = <strong>300.000 TL</strong>",
          `İstisna düşülür: 300.000 − ${trl(RENTAL_INCOME.exemption)} = <strong>${trl(
            300000 - RENTAL_INCOME.exemption,
          )} TL</strong>`,
          `Götürü gider (%15): ${trl(300000 - RENTAL_INCOME.exemption)} × 0,15 = ${trl(
            Math.round((300000 - RENTAL_INCOME.exemption) * 0.15),
          )} TL`,
          `Vergi matrahı: <strong>${trl(
            Math.round((300000 - RENTAL_INCOME.exemption) * 0.85),
          )} TL</strong>. Vergi, bu matraha tarife uygulanarak bulunur.`,
          "Hesabın tamamını otomatik yapmak için sayfanın üstündeki hesaplayıcıyı kullanabilirsiniz.",
        ],
      },
      {
        heading: "İstisnadan kimler yararlanamaz?",
        body: [
          "- Ticari, zirai veya mesleki kazancı nedeniyle yıllık beyanname verenler",
          "- Kira gelirini hiç beyan etmeyen ya da eksik beyan edenler",
          `- Beyanı gerekmeyen gelirler hariç toplam brüt geliri ${tl(
            RENTAL_INCOME.exemptionIncomeLimit,
          )} tutarını aşanlar`,
          "İstisna kişi başına uygulanır, konut başına değil. İki konutunuz varsa toplam gelirinizden bir kez düşersiniz. Konut eşler arasında paylıysa her ortak kendi payı için ayrı ayrı yararlanır.",
        ],
      },
      {
        heading: "Götürü gider mi gerçek gider mi seçmeli?",
        body: [
          "Götürü gider belge istemez ve istisna sonrası tutarın %15'ini indirir. Kolaydır ama bir kez seçildiğinde iki yıl geçmeden gerçek gidere dönülemez. Hak kiraya verenler (marka, telif vb.) götürü gideri seçemez.",
          "Gerçek giderde aidat, sigorta primi, bakım-onarım, emlak vergisi ve amortisman gibi belgeli harcamalar indirilir. Yeni alınmış ya da tadilat görmüş bir konutta gerçek gider genellikle daha avantajlıdır; belgeleri beş yıl saklamak gerekir.",
          "Önemli değişiklik: 1.1.2025 tarihinden itibaren <strong>konutlarda</strong> konut kredisi faizi gerçek gider olarak indirilemiyor.",
        ],
      },
      {
        heading: "İşyeri kirasında stopaj ve beyan sınırı",
        body: [
          `İşyeri kiralarında kiracı, ödeme sırasında %${
            RENTAL_INCOME.workplaceWithholding * 100
          } stopaj keserek vergi dairesine yatırır. Yıllık brüt kira ${tl(
            RENTAL_INCOME.workplaceDeclarationLimit,
          )} tutarını aşmıyorsa beyanname verilmez; kesilen stopaj nihai vergi olur.`,
          `Sınır aşılırsa kira beyan edilir ve yıl içinde kesilen stopaj, hesaplanan vergiden mahsup edilir. Stopaj yapılmayan işyeri kiralarında beyan sınırı ${tl(
            RENTAL_INCOME.workplaceNoWithholdingLimit,
          )} tutarındadır.`,
        ],
      },
      {
        heading: "Beyan ve ödeme takvimi",
        body: [
          "Bir yılda elde edilen kira geliri, izleyen yılın <strong>mart</strong> ayında beyan edilir. Vergi <strong>mart</strong> ve <strong>temmuz</strong> olmak üzere iki eşit taksitte ödenir.",
          "Beyanname Dijital Vergi Dairesi üzerinden hazır beyan sistemiyle birkaç dakikada verilebilir.",
          "Konut kiralarında aylık 500 TL ve üzeri tahsilatların banka veya PTT üzerinden yapılması zorunludur; elden tahsilat özel usulsüzlük cezasına yol açar.",
        ],
      },
    ],
    faqs: [
      {
        question: `${Y} yılında kira geliri istisnası ne kadar?`,
        answer: `Mesken kira gelirlerinde istisna ${tl(
          RENTAL_INCOME.exemption,
        )} tutarındadır. Yıllık konut kira geliri bu tutarın altında kalanlar beyanname vermez.`,
      },
      {
        question: "Kira gelirimi beyan etmezsem ne olur?",
        answer:
          "Beyan edilmeyen kira geliri tespit edilirse vergi aslı, vergi ziyaı cezası ve gecikme faizi birlikte istenir. Ayrıca istisnadan yararlanma hakkınız kaybolur.",
      },
      {
        question: "Eşimle ortak evimizin kirasını kim beyan eder?",
        answer:
          "Her ortak kendi hissesine düşen kira gelirini ayrı ayrı beyan eder ve her biri istisnadan ayrı yararlanır. Bu, tek kişi üzerinden beyana göre genellikle daha az vergi doğurur.",
      },
      {
        question: "Kiracı kirayı ödemedi, yine de vergi öder miyim?",
        answer:
          "Hayır. Kira geliri tahsil esasına tabidir; tahsil edilmeyen kira o yılın geliri sayılmaz. Sonradan tahsil edilirse tahsil edildiği yılın geliri olarak beyan edilir.",
      },
    ],
    related: ["emlak-vergisi-nasil-hesaplanir", "damga-vergisi-nedir-nasil-hesaplanir"],
  },

  /* =======================================================
     EMLAK VERGİSİ
  ======================================================= */
  {
    slug: "emlak-vergisi-nasil-hesaplanir",
    title: "Emlak Vergisi Nasıl Hesaplanır?",
    metaTitle: `Emlak Vergisi Nasıl Hesaplanır? ${Y} Oranları`,
    description: `${Y} emlak vergisi oranları, emlak vergi değeri, büyükşehir farkı, kültür varlıkları katkı payı, ödeme taksitleri ve emekliye sıfır oran şartları.`,
    category: "Vergi",
    icon: "🏠",
    published: "2026-09-16",
    updated: "2026-09-16",
    readingMinutes: 6,
    tool: { slug: "emlak-vergisi", label: "Emlak Vergisi Hesaplama" },
    intro:
      "Emlak vergisi, sahip olduğunuz konut, işyeri, arsa veya arazi için belediyeye her yıl ödediğiniz vergidir. Tutarı belirleyen iki şey vardır: belediyenin hesapladığı emlak vergi değeri ve taşınmazın türüne göre değişen oran. Büyükşehir belediyesi sınırları içindeki taşınmazlarda oranlar iki kat uygulanır.",
    sections: [
      {
        heading: "Formül ve oranlar",
        body: [
          "Emlak vergisi = <strong>Emlak vergi değeri × Oran</strong>",
          `- Konut: ${binde(PROPERTY_TAX.rates.mesken.normal)}, büyükşehirde ${binde(
            PROPERTY_TAX.rates.mesken.metropolitan,
          )}`,
          `- İşyeri: ${binde(PROPERTY_TAX.rates.isyeri.normal)}, büyükşehirde ${binde(
            PROPERTY_TAX.rates.isyeri.metropolitan,
          )}`,
          `- Arsa: ${binde(PROPERTY_TAX.rates.arsa.normal)}, büyükşehirde ${binde(
            PROPERTY_TAX.rates.arsa.metropolitan,
          )}`,
          `- Arazi: ${binde(PROPERTY_TAX.rates.arazi.normal)}, büyükşehirde ${binde(
            PROPERTY_TAX.rates.arazi.metropolitan,
          )}`,
          "Hesaplanan verginin %10'u kadar da taşınmaz kültür varlıklarının korunmasına katkı payı alınır.",
        ],
      },
      {
        heading: "Örnek hesap",
        body: [
          "Büyükşehirde, emlak vergi değeri 3.500.000 TL olan bir konut:",
          "Vergi = 3.500.000 × 0,002 = <strong>7.000 TL</strong>",
          "Kültür payı = 7.000 × %10 = 700 TL",
          "Yıllık toplam = <strong>7.700 TL</strong>, taksit başına 3.850 TL.",
        ],
      },
      {
        heading: "Emlak vergi değeri satış fiyatı değildir",
        body: [
          "Emlak vergi değeri, belediyenin arsa birim değeri ve binanın metrekare inşaat maliyetine göre hesapladığı resmî değerdir; piyasa satış fiyatından genellikle düşüktür.",
          "Değerinizi belediyenizin e-belediye sayfasından veya emlak servisinden öğrenebilirsiniz. Tapu harcı gibi işlemlerde ise beyan edilen satış bedeli esas alınır; ikisi farklı kavramlardır.",
        ],
      },
      {
        heading: "Kimler emlak vergisi ödemez?",
        body: [
          `Türkiye'de brüt ${PROPERTY_TAX.reducedRateMaxArea} m²'yi geçmeyen tek konutu olanlardan şu kişiler indirimli (sıfır) orandan yararlanır:`,
          "- Engelliler",
          "- Hiçbir geliri olmadığını belgeleyenler",
          "- Geliri yalnızca SGK'dan aldığı emekli, dul, yetim veya malullük aylığından ibaret olanlar",
          "- Gaziler ile şehitlerin dul ve yetimleri",
          "Muafiyet kendiliğinden işlemez; belediyeye taahhüt belgesiyle başvurmak gerekir. Kira geliri veya ikinci bir konut varsa hak kaybolur.",
        ],
      },
      {
        heading: "Ödeme zamanı",
        body: [
          `${PROPERTY_TAX.installments} Birinci taksitin son günü 31 mayıs, ikinci taksitin son günü 30 kasımdır.`,
          "Ödeme belediyenin veznesi, internet sitesi, e-Devlet veya anlaşmalı bankalar üzerinden yapılabilir. Geciken taksitlere gecikme zammı işler ve borç, tapu devrinde karşınıza çıkar.",
        ],
      },
    ],
    faqs: [
      {
        question: "Emlak vergisini kim öder, kiracı mı ev sahibi mi?",
        answer:
          "Emlak vergisinin mükellefi taşınmazın malikidir. Kiracı bu vergiden sorumlu değildir; ancak işyeri kiralarında sözleşmeye konulan hükümle kiracının ödemesi kararlaştırılabilir.",
      },
      {
        question: "Yeni ev aldım, emlak vergisi beyannamesi vermeli miyim?",
        answer:
          "Evet. Taşınmazı edindiğiniz yılın sonuna kadar (yılın son üç ayında aldıysanız üç ay içinde) ilgili belediyeye emlak vergisi bildirimi verilmesi gerekir.",
      },
      {
        question: "Emlak vergisi her yıl artıyor mu?",
        answer:
          "Evet. Vergi değeri her yıl yeniden değerleme oranına göre artırılır; bu nedenle ödenen tutar da artar. Dört yılda bir yapılan takdir işlemlerinde artış daha belirgin olabilir.",
      },
    ],
    related: [`kira-geliri-vergisi-${Y}-nasil-hesaplanir`, "damga-vergisi-nedir-nasil-hesaplanir"],
  },

  /* =======================================================
     DAMGA VERGİSİ
  ======================================================= */
  {
    slug: "damga-vergisi-nedir-nasil-hesaplanir",
    title: "Damga Vergisi Nedir, Nasıl Hesaplanır?",
    metaTitle: `Damga Vergisi Nedir, Nasıl Hesaplanır? ${Y}`,
    description: `${Y} damga vergisi oranları: sözleşmelerde ${binde(
      STAMP_TAX.contract,
    )}, kira sözleşmesinde ${binde(
      STAMP_TAX.rentContract,
    )}, bordroda ${binde(STAMP_TAX.payroll)}. Matrah, nüsha ve azami tutar kuralları.`,
    category: "Vergi",
    icon: "🧾",
    published: "2026-09-16",
    updated: "2026-09-16",
    readingMinutes: 5,
    tool: { slug: "damga-vergisi", label: "Damga Vergisi Hesaplama" },
    intro: `Damga vergisi, imzalanan kâğıdın kendisinden alınan bir vergidir. Sözleşme, taahhütname, bordro gibi belli bir parayı içeren kâğıtlar nispi oranla vergilendirilir ve ${Y} yılında her bir kâğıt için vergi ${tl(
      STAMP_TAX.maximum,
    )} tutarını aşamaz.`,
    sections: [
      {
        heading: `${Y} damga vergisi oranları`,
        body: [
          `- Belli parayı ihtiva eden sözleşme ve taahhütname: <strong>${binde(STAMP_TAX.contract)}</strong>`,
          `- Kira sözleşmesi (kefilsiz): <strong>${binde(STAMP_TAX.rentContract)}</strong>`,
          `- Adi kefilli kira sözleşmesi: <strong>${binde(STAMP_TAX.rentWithSurety)}</strong>`,
          `- Müteselsil kefilli kira sözleşmesi: <strong>${binde(STAMP_TAX.rentWithJointSurety)}</strong>`,
          `- Ücret ödemeleri (bordro): <strong>${binde(STAMP_TAX.payroll)}</strong>`,
          `Azami tutar: ${tl(STAMP_TAX.maximum)} (her bir kâğıt için).`,
        ],
      },
      {
        heading: "Kira sözleşmesinde matrah toplam kiradır",
        body: [
          "Kira sözleşmelerinde vergi aylık kira üzerinden değil, sözleşme süresince ödenecek toplam kira üzerinden hesaplanır.",
          `Örnek: Aylık 25.000 TL, 12 aylık konut kirası → matrah 300.000 TL → damga vergisi 300.000 × ${
            STAMP_TAX.rentContract
          } = <strong>${tl(300000 * STAMP_TAX.rentContract)}</strong>`,
          "Kefil eklenirse oran yükselir; kefaletin adi mi müteselsil mi olduğu sözleşmede açıkça yazılmalıdır.",
        ],
      },
      {
        heading: "Nüsha sayısı maliyeti artırır",
        body: [
          "Damga vergisi her nüsha için ayrı ayrı doğar. İki nüsha imzalanan bir sözleşmede vergi iki kat ödenir.",
          "Pratik çözüm: tek nüsha düzenleyip taraflara fotokopi veya taranmış örnek vermek. Fotokopi ve suretler damga vergisine tabi değildir.",
        ],
      },
      {
        heading: "Kim, ne zaman öder?",
        body: [
          "Kâğıdı imzalayan taraflar vergiden müteselsilen sorumludur; aralarında kimin ödeyeceğini serbestçe kararlaştırabilirler.",
          "Sürekli damga vergisi mükellefiyeti olan şirketler, kâğıdı düzenledikleri ayı izleyen ayın 26'sına kadar beyan edip öder. Diğerleri düzenleme tarihinden itibaren 15 gün içinde beyan eder.",
          "Ücret bordrolarında asgari ücrete isabet eden damga vergisi istisnadır; bu istisna tüm çalışanlara uygulanır.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kira sözleşmesinin damga vergisini kim öder?",
        answer:
          "Kanunen kiracı ve kiraya veren birlikte sorumludur. Uygulamada sözleşmeye konulan bir madde ile taraflardan biri üstlenir; sözleşmede hüküm yoksa vergi dairesi iki taraftan da isteyebilir.",
      },
      {
        question: "Her sözleşmede damga vergisi var mı?",
        answer:
          "Hayır. Vergi, belli bir parayı içeren kâğıtlardan alınır. Tutar içermeyen sözleşmelerde nispi damga vergisi doğmaz. Ayrıca kanunda sayılan bazı kâğıtlar (ör. bazı kamu ihale ve teşvik belgeleri) istisnadır.",
      },
      {
        question: "Damga vergisini ödemezsem ne olur?",
        answer:
          "Vergi aslına ek olarak vergi ziyaı cezası ve gecikme faizi uygulanır. Kâğıt bir ihtilafta delil olarak kullanıldığında eksik damga vergisi ortaya çıkar ve cezalı tarhiyat yapılır.",
      },
    ],
    related: [`kira-geliri-vergisi-${Y}-nasil-hesaplanir`, "emlak-vergisi-nasil-hesaplanir"],
  },

  /* =======================================================
     MTV
  ======================================================= */
  {
    slug: `mtv-${MTV_YEAR}-nasil-hesaplanir`,
    title: "MTV Nasıl Hesaplanır?",
    metaTitle: `MTV Nasıl Hesaplanır? ${MTV_YEAR} Tarifesi`,
    description: `${MTV_YEAR} motorlu taşıtlar vergisi: yaş nasıl hesaplanır, (I) ve (I/A) tarifesi farkı, taşıt değeri dilimleri ve ocak-temmuz ödeme takvimi.`,
    category: "Vergi",
    icon: "🚗",
    published: "2026-09-16",
    updated: "2026-09-16",
    readingMinutes: 6,
    tool: { slug: "mtv", label: "MTV Hesaplama" },
    intro: `Motorlu taşıtlar vergisi, aracın ne kadar kullanıldığına değil motor silindir hacmine, yaşına ve 2018 sonrası tescillerde taşıt değerine göre belirlenir. ${MTV_YEAR} tutarları, MTV Genel Tebliği Seri No: 58 ile yeniden değerleme oranında artırılarak yayımlanmıştır.`,
    sections: [
      {
        heading: "MTV yaşı: model yılında bir yaşındasınız",
        body: [
          "197 sayılı Kanuna göre taşıt, ruhsatındaki model yılında <strong>bir yaşında</strong> kabul edilir ve her takvim yılı başında bir yaş büyür.",
          "<strong>Yaş = İçinde bulunulan yıl − Model yılı + 1</strong>",
          `Örnek: 2018 model bir otomobil ${MTV_YEAR} yılında ${MTV_YEAR} − 2018 + 1 = <strong>${
            MTV_YEAR - 2018 + 1
          } yaşındadır</strong> ve 7–11 yaş grubuna girer.`,
          "Aracı yıl içinde hangi ayda aldığınız yaşı etkilemez; tescil tarihi yalnızca hangi tarifenin uygulanacağını belirler.",
        ],
      },
      {
        heading: `${MTV_YEAR} yaş grupları`,
        body: [
          `- 1 – 3 yaş: ${MTV_YEAR}, ${MTV_YEAR - 1}, ${MTV_YEAR - 2} model`,
          `- 4 – 6 yaş: ${MTV_YEAR - 3}, ${MTV_YEAR - 4}, ${MTV_YEAR - 5} model`,
          `- 7 – 11 yaş: ${MTV_YEAR - 6} – ${MTV_YEAR - 10} model`,
          `- 12 – 15 yaş: ${MTV_YEAR - 11} – ${MTV_YEAR - 14} model`,
          `- 16 yaş ve üzeri: ${MTV_YEAR - 15} ve öncesi model`,
        ],
      },
      {
        heading: "İki tarife arasındaki fark",
        body: [
          "<strong>(I) sayılı tarife</strong> 1.1.2018 ve sonrasında tescil edilen otomobillere uygulanır. Burada motor hacmi ve yaşın yanında taşıt değeri de dikkate alınır; aynı araç için değer dilimine göre farklı tutarlar vardır.",
          "<strong>(I/A) sayılı tarife</strong> 31.12.2017 ve öncesinde tescil edilmiş otomobiller içindir ve taşıt değerine bakmaz.",
          `Fark somut: 1801–2000 cm³, 7–11 yaş bir araçta (I/A) tarifesinde yıllık vergi ${trl(
            TARIFF_IA[3].amounts[2],
          )} TL iken, (I) sayılı tarifenin en düşük değer diliminde ${trl(
            TARIFF_I[3].brackets[0].amounts[2],
          )} TL'dir. Küçük motor hacimlerinde iki tarife aynı tutarda buluşabilir.`,
        ],
      },
      {
        heading: "Ödeme takvimi",
        body: [
          "MTV her yıl <strong>ocak</strong> ve <strong>temmuz</strong> aylarında iki eşit taksitte ödenir. Tamamını ocak ayında tek seferde ödemek de mümkündür.",
          "Yıl içinde ilk defa tescil edilen taşıtlarda: yılın ilk altı ayında tescil edilirse yıllık verginin tamamı, son altı ayında tescil edilirse yarısı, tescilden itibaren bir ay içinde ödenir.",
          "Ödeme Dijital Vergi Dairesi, GİB Mobil, e-Devlet ve anlaşmalı bankalar üzerinden yapılabilir.",
        ],
      },
      {
        heading: "Ödenmezse ne olur?",
        body: [
          "Süresinde ödenmeyen MTV için gecikme zammı işler. Ayrıca MTV borcu olan taşıtlar <strong>fenni muayene yaptıramaz</strong> ve <strong>satış, devir işlemi yapılamaz</strong>.",
          "Aracı satmadan önce borcun kapatılması gerekir; devirde borcu yoktur belgesi istenir.",
        ],
      },
    ],
    faqs: [
      {
        question: `${MTV_YEAR} MTV zammı ne kadar oldu?`,
        answer: `${MTV_YEAR} yılı MTV tutarları yeniden değerleme oranında, %18,95 artırılarak uygulanmaktadır. Tarife, MTV Genel Tebliği Seri No: 58 ile yayımlanmıştır.`,
      },
      {
        question: "İkinci el araç aldım, MTV'yi kim öder?",
        answer:
          "Devirden önce doğmuş ve ödenmemiş MTV borcundan satıcı sorumludur; devir sırasında bu borcun kapatılmış olması gerekir. Devirden sonraki dönemler yeni malike aittir.",
      },
      {
        question: "Aracım hurdaya ayrıldı, MTV ödemeye devam eder miyim?",
        answer:
          "Hayır. Trafik tescil kaydı silinen (hurdaya ayrılan) taşıtlar için mükellefiyet, kaydın silindiği tarihi takip eden dönemden itibaren sona erer. Kayıt silinmeden vergi işlemeye devam eder.",
      },
      {
        question: "Engelli aracında MTV var mı?",
        answer:
          "Engellilik derecesi %90 ve üzeri olanların adlarına tescilli taşıtlar ile %90'ın altında olup özel tertibatlı araç kullananların taşıtları, şartları sağladığında MTV'den istisnadır. İstisna için vergi dairesine başvuru gerekir.",
      },
    ],
    related: ["emlak-vergisi-nasil-hesaplanir", "damga-vergisi-nedir-nasil-hesaplanir"],
  },
];

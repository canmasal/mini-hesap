import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Link from "next/link";

import {
  calculators,
  getRelatedCalculators,
} from "@/data/calculators";

import AdSlot from "@/components/AdSlot";
import Breadcrumb from "@/components/Breadcrumb";
import CalculatorCard from "@/components/CalculatorCard";
import { guidesForTool } from "@/data/guides";

import NetSalaryCalculator from "@/components/calculators/NetSalaryCalculator";
import PercentCalculator from "@/components/calculators/PercentCalculator";
import KdvCalculator from "@/components/calculators/KdvCalculator";
import DiscountCalculator from "@/components/calculators/DiscountCalculator";
import RentIncreaseCalculator from "@/components/calculators/RentIncreaseCalculator";
import OvertimeCalculator from "@/components/calculators/OvertimeCalculator";
import SeveranceCalculator from "@/components/calculators/SeveranceCalculator";
import NoticeCalculator from "@/components/calculators/NoticeCalculator";
import KidemIhbarCalculator from "@/components/calculators/KidemIhbarCalculator";
import AgeCalculator from "@/components/calculators/AgeCalculator";
import AnnualLeaveCalculator from "@/components/calculators/AnnualLeaveCalculator";
import BankLoanCalculator from "@/components/calculators/BankLoanCalculator";
import RetirementCalculator from "@/components/calculators/RetirementCalculator";
import DepositCalculator from "@/components/calculators/DepositCalculator";
import InstallmentCostCalculator from "@/components/calculators/InstallmentCostCalculator";
import InflationCalculator from "@/components/calculators/InflationCalculator";
import MaternityLeaveCalculator from "@/components/calculators/MaternityLeaveCalculator";
import UnemploymentCalculator from "@/components/calculators/UnemploymentCalculator";
import HomeLoanCostCalculator from "@/components/calculators/HomeLoanCostCalculator";
import FuelCostCalculator from "@/components/calculators/FuelCostCalculator";
import PensionFundCalculator from "@/components/calculators/PensionFundCalculator";

/* =========================================================
   HESAPLAMA BİLEŞENLERİ
========================================================= */

const componentMap: Record<string, ComponentType> = {
  "net-maas": NetSalaryCalculator,
  yuzde: PercentCalculator,
  kdv: KdvCalculator,
  indirim: DiscountCalculator,
  "kira-artisi": RentIncreaseCalculator,
  "fazla-mesai": OvertimeCalculator,
  kidem: SeveranceCalculator,
  ihbar: NoticeCalculator,
  "kidem-ihbar": KidemIhbarCalculator,
  yas: AgeCalculator,
  "yillik-izin": AnnualLeaveCalculator,
  "kredi-borc": BankLoanCalculator,
  emeklilik: RetirementCalculator,
  mevduat: DepositCalculator,
  "taksit-maliyeti": InstallmentCostCalculator,
  enflasyon: InflationCalculator,
  "dogum-izni": MaternityLeaveCalculator,
  "issizlik-maasi": UnemploymentCalculator,
  "konut-kredisi": HomeLoanCostCalculator,
  "yakit-maliyeti": FuelCostCalculator,
  bes: PensionFundCalculator,
};

/* =========================================================
   SEO TİPLERİ
========================================================= */

type FaqItem = {
  question: string;
  answer: string;
};

type SeoContent = {
  title: string;
  description: string;
  intro: string;
  howItWorks: string[];
  faqs: FaqItem[];
};

/* =========================================================
   SEO İÇERİKLERİ
========================================================= */

const seoContents: Record<string, SeoContent> = {
  /* =======================================================
     NET MAAŞ
  ======================================================= */

  "net-maas": {
    title:
      "Net Maaş Hesaplama 2026 | Brüt Maaştan Net Maaş",
    description:
      "2026 net maaş hesaplama aracı ile brüt maaşınızı girerek tahmini net maaşınızı ve kesinti detaylarını hesaplayın.",
    intro:
      "Net maaş hesaplama aracımız, brüt ücretiniz üzerinden temel kesinti kalemlerini dikkate alarak tahmini net maaşınızı görmenizi sağlar.",
    howItWorks: [
      "Brüt maaşınızı girin.",
      "Hesaplama ayını seçin.",
      "Varsa önceki kümülatif vergi matrahınızı girin.",
      "Hesapla butonuna basarak sonucu görüntüleyin.",
    ],
    faqs: [
      {
        question:
          "Brüt maaş ile net maaş arasındaki fark nedir?",
        answer:
          "Brüt maaş kesintiler uygulanmadan önceki ücret tutarıdır. Net maaş ise ilgili kesintiler ve istisnalar sonrasında çalışanın eline geçen tutardır.",
      },
      {
        question:
          "Kümülatif vergi matrahı neden önemlidir?",
        answer:
          "Yıl içinde biriken kümülatif vergi matrahı, gelir vergisinin hangi dilimlerden hesaplanacağını etkileyebilir.",
      },
      {
        question:
          "Net maaş her ay aynı olur mu?",
        answer:
          "Vergi dilimi, prim, ikramiye ve diğer ücret unsurları nedeniyle aylık net maaş değişebilir.",
      },
    ],
  },

  /* =======================================================
     YÜZDE
  ======================================================= */

  yuzde: {
    title:
      "Yüzde Hesaplama | Yüzde Artış ve Azalış Hesapla",
    description:
      "Yüzde hesaplama aracı ile bir sayının yüzdesini, yüzde artışını ve yüzde azalışını hızlıca hesaplayın.",
    intro:
      "Yüzde hesaplama aracıyla günlük hayatta sık kullanılan yüzde işlemlerini hızlı ve anlaşılır şekilde yapabilirsiniz.",
    howItWorks: [
      "Ana tutarı girin.",
      "Yüzde oranını girin.",
      "Yüzde tutarını görüntüleyin.",
      "Artış veya azalış sonucunu inceleyin.",
    ],
    faqs: [
      {
        question:
          "Bir sayının yüzdesi nasıl hesaplanır?",
        answer:
          "Ana tutar yüzde oranıyla çarpılır ve 100'e bölünür.",
      },
      {
        question:
          "Yüzde artış nasıl hesaplanır?",
        answer:
          "Ana tutarın ilgili yüzde oranındaki artış miktarı bulunur ve ana tutara eklenir.",
      },
      {
        question:
          "Yüzde azalış nasıl hesaplanır?",
        answer:
          "Ana tutarın ilgili yüzde oranındaki azalış miktarı bulunur ve ana tutardan çıkarılır.",
      },
    ],
  },

  /* =======================================================
     KDV
  ======================================================= */

  kdv: {
    title:
      "KDV Hesaplama 2026 | KDV Dahil ve Hariç Hesapla",
    description:
      "KDV hesaplama aracı ile KDV dahil ve KDV hariç tutarı, KDV miktarını ve genel toplamı hesaplayın.",
    intro:
      "KDV hesaplama aracımız ile bir tutarın KDV dahil veya KDV hariç karşılığını kolayca hesaplayabilirsiniz.",
    howItWorks: [
      "Tutarı girin.",
      "KDV oranını seçin.",
      "Tutarın KDV dahil veya hariç olduğunu seçin.",
      "KDV ve genel toplamı görüntüleyin.",
    ],
    faqs: [
      {
        question:
          "KDV dahil tutardan KDV hariç tutar nasıl bulunur?",
        answer:
          "KDV dahil toplam, seçilen KDV oranı kullanılarak ters hesaplama ile KDV hariç tutara ve KDV miktarına ayrılır.",
      },
      {
        question:
          "1000 TL'nin %20 KDV'si kaç TL'dir?",
        answer:
          "1000 TL'nin %20 KDV'si 200 TL'dir. KDV dahil toplam 1200 TL olur.",
      },
      {
        question:
          "KDV oranı neden ürüne göre değişebilir?",
        answer:
          "Uygulanan KDV oranı ürün veya hizmetin tabi olduğu mevzuata göre değişebilir.",
      },
    ],
  },

  /* =======================================================
     İNDİRİM
  ======================================================= */

  indirim: {
    title:
      "İndirim Hesaplama | İndirimli Fiyat Hesapla",
    description:
      "İndirim hesaplama aracı ile indirim oranını, indirim tutarını ve indirim sonrası fiyatı hesaplayın.",
    intro:
      "Normal fiyatı ve indirim oranını girerek indirim miktarını ve ödenecek son fiyatı kolayca bulabilirsiniz.",
    howItWorks: [
      "Normal fiyatı girin.",
      "İndirim oranını yüzde olarak yazın.",
      "İndirim tutarını görüntüleyin.",
      "İndirimli fiyatı görüntüleyin.",
    ],
    faqs: [
      {
        question:
          "%20 indirim nasıl hesaplanır?",
        answer:
          "Normal fiyatın %20'si indirim miktarıdır ve normal fiyattan çıkarıldığında indirimli fiyat bulunur.",
      },
      {
        question:
          "İndirim tutarı nedir?",
        answer:
          "Normal fiyat üzerinden uygulanan indirim oranının parasal karşılığıdır.",
      },
      {
        question:
          "İndirimli fiyat nasıl bulunur?",
        answer:
          "Normal fiyattan hesaplanan indirim miktarı çıkarılır.",
      },
    ],
  },

  /* =======================================================
     KİRA
  ======================================================= */

  "kira-artisi": {
    title:
      "Kira Artış Hesaplama 2026 | Yeni Kira Hesapla",
    description:
      "Kira artış hesaplama aracı ile mevcut kira ve girdiğiniz artış oranına göre yeni kira tutarını hesaplayın.",
    intro:
      "Mevcut kira tutarı ve artış oranını girerek yeni aylık kira tutarını ve yıllık farkı hesaplayabilirsiniz.",
    howItWorks: [
      "Mevcut kira tutarını girin.",
      "Artış oranını yüzde olarak yazın.",
      "Yeni kira tutarını görüntüleyin.",
      "Yıllık farkı inceleyin.",
    ],
    faqs: [
      {
        question:
          "Kira artışı nasıl hesaplanır?",
        answer:
          "Mevcut kira tutarına seçilen artış oranına göre hesaplanan artış miktarı eklenir.",
      },
      {
        question:
          "Kira artış oranı her zaman aynı mıdır?",
        answer:
          "Hayır. Uygulanabilecek oran dönemsel yasal düzenlemelere ve sözleşme koşullarına göre değişebilir.",
      },
      {
        question:
          "Yıllık kira farkı nasıl hesaplanır?",
        answer:
          "Aylık artış tutarı 12 ay üzerinden hesaplanır.",
      },
    ],
  },

  /* =======================================================
     FAZLA MESAİ
  ======================================================= */

  "fazla-mesai": {
    title:
      "Fazla Mesai Hesaplama | Fazla Mesai Ücreti",
    description:
      "Fazla mesai hesaplama aracı ile aylık brüt ücret, mesai saati ve katsayı üzerinden tahmini fazla mesai ücretini hesaplayın.",
    intro:
      "Aylık brüt ücretinizi, fazla mesai saatinizi ve katsayıyı girerek temel fazla mesai tutarını hesaplayabilirsiniz.",
    howItWorks: [
      "Aylık brüt maaşı girin.",
      "Fazla mesai saatini girin.",
      "Mesai katsayısını seçin.",
      "Tahmini fazla mesai tutarını görüntüleyin.",
    ],
    faqs: [
      {
        question:
          "Fazla mesai ücreti nasıl hesaplanır?",
        answer:
          "Temel hesaplamada saatlik ücret bulunur, ilgili katsayı uygulanır ve fazla mesai saatiyle çarpılır.",
      },
      {
        question:
          "1,5 kat fazla mesai ne demektir?",
        answer:
          "Temel saatlik ücretin 1,5 katı üzerinden hesaplama yapılması anlamına gelir.",
      },
      {
        question:
          "Fazla mesai sonucu net midir?",
        answer:
          "Bu araç temel brüt tutarı hesaplar. Vergi ve diğer bordro kesintileri ayrıca değerlendirilmelidir.",
      },
    ],
  },

  /* =======================================================
     KIDEM
  ======================================================= */

  kidem: {
    title:
      "Kıdem Tazminatı Hesaplama 2026",
    description:
      "Kıdem tazminatı hesaplama aracı ile işe giriş ve çıkış tarihleri, brüt ücret ve düzenli yan haklara göre tahmini kıdem tazminatınızı hesaplayın.",
    intro:
      "Kıdem hesabında çalışma süresi, kıdeme esas ücret, düzenli yan haklar ve ilgili dönemdeki kıdem tazminatı tavanı önemlidir.",
    howItWorks: [
      "Son brüt ücretinizi girin.",
      "İşe giriş ve çıkış tarihlerini seçin.",
      "Varsa düzenli yan haklarınızı girin.",
      "Çalışma süresini yıl, ay ve gün olarak görüntüleyin.",
      "Kıdem tazminatı detaylarını inceleyin.",
    ],
    faqs: [
      {
        question:
          "Kıdem tazminatı nasıl hesaplanır?",
        answer:
          "Temel hesaplamada kıdeme esas ücret ve hizmet süresi dikkate alınır. Her tam yıl için 30 günlük ücret esas alınır ve artan süre orantılı hesaplanır.",
      },
      {
        question:
          "Kıdem tazminatı tavanı nedir?",
        answer:
          "Kıdem tazminatına esas alınabilecek ücretin ilgili dönem için belirlenen yasal üst sınırıdır.",
      },
      {
        question:
          "Yol ve yemek yardımı kıdem hesabına dahil edilir mi?",
        answer:
          "Düzenli olarak sağlanan ve para veya para ile ölçülebilen bazı menfaatler koşullarına göre hesaba dahil edilebilir.",
      },
    ],
  },

  /* =======================================================
     İHBAR
  ======================================================= */

  ihbar: {
    title:
      "İhbar Tazminatı Hesaplama 2026",
    description:
      "İhbar tazminatı hesaplama aracı ile çalışma süresine göre ihbar süresini ve tahmini ihbar tazminatını hesaplayın.",
    intro:
      "Hizmet sürenizi ve ücret bilgilerinizi girerek temel ihbar sürenizi ve tahmini ihbar tazminatınızı hesaplayabilirsiniz.",
    howItWorks: [
      "Brüt ücretinizi girin.",
      "İşe giriş ve çıkış tarihlerini seçin.",
      "Varsa düzenli yan haklarınızı girin.",
      "İhbar süresini otomatik olarak görüntüleyin.",
      "Tahmini tazminat tutarını inceleyin.",
    ],
    faqs: [
      {
        question:
          "İhbar süresi nasıl belirlenir?",
        answer:
          "Belirsiz süreli iş sözleşmelerinde hizmet süresine göre kanuni bildirim süreleri uygulanır.",
      },
      {
        question:
          "En uzun kanuni ihbar süresi kaç haftadır?",
        answer:
          "Üç yıldan fazla hizmet süresinde kanuni bildirim süresi 8 haftadır.",
      },
      {
        question:
          "İhbar tazminatı vergilendirilir mi?",
        answer:
          "İhbar tazminatı ücret niteliğinde değerlendirilebildiğinden ilgili vergi ve kesintiler ödeme koşullarına göre değişebilir.",
      },
    ],
  },

  /* =======================================================
     KIDEM + İHBAR
  ======================================================= */

  "kidem-ihbar": {
    title:
      "Kıdem ve İhbar Tazminatı Hesaplama 2026",
    description:
      "Kıdem ve ihbar tazminatınızı tek ekranda hesaplayın. Çalışma süresi, kıdeme esas ücret, ihbar süresi ve toplam tahmini tazminatı görün.",
    intro:
      "Kıdem + İhbar hesaplama aracımız, iki tazminatı aynı ekranda ayrı ayrı değerlendirmenize yardımcı olur.",
    howItWorks: [
      "Son brüt ücretinizi girin.",
      "İşe giriş ve çıkış tarihlerini seçin.",
      "Varsa düzenli yan hakları girin.",
      "Gerekliyse kümülatif vergi matrahını girin.",
      "Kıdem, ihbar ve toplam sonuçları görüntüleyin.",
    ],
    faqs: [
      {
        question:
          "Kıdem ve ihbar tazminatı aynı şey midir?",
        answer:
          "Hayır. Kıdem ve ihbar tazminatlarının şartları ve hesaplama yöntemleri farklıdır.",
      },
      {
        question:
          "Kıdem ve ihbar aynı anda alınabilir mi?",
        answer:
          "Somut fesih şekline ve hukuki şartlara göre her iki tazminata da hak kazanılması mümkün olabilir.",
      },
      {
        question:
          "Toplam tazminat nasıl hesaplanır?",
        answer:
          "Kıdem ve ihbar tutarları ayrı hesaplanır ve ilgili kesintiler dikkate alınarak toplam sonuç gösterilebilir.",
      },
    ],
  },

  /* =======================================================
     YAŞ
  ======================================================= */

  yas: {
    title:
      "Yaş Hesaplama 2026 | Doğum Tarihine Göre Yaşını Hesapla",
    description:
      "Yaş hesaplama aracı ile doğum tarihinizi girerek yaşınızı yıl, ay ve gün olarak hesaplayın. Bir sonraki doğum gününüze kalan süreyi görün.",
    intro:
      "Yaş hesaplama aracımız, doğum tarihi ile seçilen hesaplama tarihi arasındaki süreyi yıl, ay ve gün olarak gösterir.",
    howItWorks: [
      "Doğum tarihinizi girin.",
      "Hesaplama tarihini seçin.",
      "Yaşınızı yıl, ay ve gün olarak görüntüleyin.",
      "Bir sonraki doğum gününüze kalan süreyi inceleyin.",
    ],
    faqs: [
      {
        question:
          "Yaş nasıl hesaplanır?",
        answer:
          "Yaş, doğum tarihi ile hesaplama tarihi arasındaki takvim farkına göre yıl, ay ve gün şeklinde hesaplanır.",
      },
      {
        question:
          "Yaşımı toplam gün olarak görebilir miyim?",
        answer:
          "Evet. Araç doğum tarihinden hesaplama tarihine kadar geçen toplam gün sayısını da gösterir.",
      },
      {
        question:
          "Bir sonraki doğum günümü hesaplayabilir miyim?",
        answer:
          "Evet. Sonuç bölümünde bir sonraki doğum gününüz ve kalan gün sayısı gösterilir.",
      },
    ],
  },

  /* =======================================================
     YILLIK İZİN
  ======================================================= */

  "yillik-izin": {
    title:
      "Yıllık İzin Hesaplama 2026 | Yıllık Ücretli İzin Hesapla",
    description:
      "Yıllık izin hesaplama aracı ile işe giriş tarihinize, hizmet sürenize ve yaşınıza göre yıllık ücretli izin hakkınızı hesaplayın.",
    intro:
      "Yıllık izin hesaplama aracımız, işe giriş tarihi ve hesaplama tarihine göre çalışma sürenizi belirleyerek temel yıllık ücretli izin hakkınızı hesaplamanıza yardımcı olur.",
    howItWorks: [
      "İşe giriş tarihinizi girin.",
      "Hesaplama tarihini seçin.",
      "Doğum tarihinizi girin.",
      "Kullanmış olduğunuz izin gününü girin.",
      "Toplam yıllık izin hakkınızı ve kalan izin gününüzü görüntüleyin.",
    ],
    faqs: [
      {
        question:
          "Yıllık izne ne zaman hak kazanılır?",
        answer:
          "Aynı işverene bağlı çalışma süresinin en az bir yılı doldurulmasıyla yıllık ücretli izin hakkı doğar.",
      },
      {
        question:
          "Yıllık izin süresi kaç gündür?",
        answer:
          "Temel yasal süreler hizmet süresine göre değişir. 1 ila 5 yıl arasında 14 gün, 5 yıldan fazla 15 yıldan az hizmette 20 gün, 15 yıl ve üzeri hizmette 26 gün asgari süredir.",
      },
      {
        question:
          "50 yaş ve üzerindeki çalışanların yıllık izni kaç gündür?",
        answer:
          "50 yaş ve üzerindeki çalışanlar için yıllık ücretli izin süresi 20 günden az olamaz.",
      },
      {
        question:
          "18 yaş ve altındaki çalışanların yıllık izni kaç gündür?",
        answer:
          "18 yaş ve daha küçük yaştaki çalışanlarda yıllık ücretli izin süresi 20 günden az olamaz.",
      },
    ],
  },

  /* =======================================================
     KREDİ / BANKA BORÇ
  ======================================================= */

  "kredi-borc": {
    title:
      "Kredi ve Banka Borç Hesaplama 2026 | Aylık Taksit ve Geri Ödeme",
    description:
      "Kredi borç hesaplama aracı ile kredi tutarı, aylık faiz ve vade bilgilerine göre aylık taksit, toplam faiz, toplam geri ödeme ve ödeme planını hesaplayın.",
    intro:
      "Kredi ve banka borç hesaplama aracımız, girdiğiniz kredi tutarı, aylık faiz oranı ve vade bilgilerine göre temel bir eşit taksitli ödeme planı oluşturur.",
    howItWorks: [
      "Kredi türünü seçin.",
      "Kredi tutarını girin.",
      "Aylık faiz oranını girin.",
      "Vade süresini ay olarak belirleyin.",
      "Başlangıç tarihini seçin.",
      "Aylık taksit ve ayrıntılı ödeme planını görüntüleyin.",
    ],
    faqs: [
      {
        question:
          "Kredi aylık taksiti nasıl hesaplanır?",
        answer:
          "Aylık taksit, kredi anaparası, aylık faiz oranı ve vade kullanılarak eşit taksitli temel amortisman yöntemiyle hesaplanır.",
      },
      {
        question:
          "Toplam geri ödeme nedir?",
        answer:
          "Kredi süresince ödenen tüm taksitlerin toplamıdır.",
      },
      {
        question:
          "Toplam faiz nasıl hesaplanır?",
        answer:
          "Temel hesaplamada toplam geri ödemeden kredi anaparası çıkarılarak toplam faiz bulunur.",
      },
      {
        question:
          "Bu hesaplama bankanın kesin ödeme planı mıdır?",
        answer:
          "Hayır. Sonuç, kullanıcının girdiği faiz oranına göre oluşturulan temel bir ödeme planıdır. Bankaya göre uygulanabilecek diğer maliyetler ayrıca değişebilir.",
      },
    ],
  },
};

/* =======================================================
   EMEKLİLİK / EYT
======================================================= */

seoContents.emeklilik = {
  title: "Emeklilik Hesaplama 2026 | EYT ve Emeklilik Yaşı",
  description:
    "Sigorta başlangıç tarihi, prim gün sayısı ve yaşınıza göre emeklilik tarihinizi hesaplayın. EYT kapsamında mısınız, kaç gün priminiz eksik öğrenin.",
  intro:
    "Emeklilik hesaplama aracımız, sigorta başlangıç tarihinize göre hangi emeklilik grubuna girdiğinizi belirler; gereken prim günü, sigortalılık süresi ve yaş şartlarını karşılaştırarak tahmini emeklilik tarihinizi gösterir.",
  howItWorks: [
    "Cinsiyetinizi ve doğum tarihinizi girin.",
    "SGK ilk işe giriş (sigorta başlangıç) tarihinizi yazın.",
    "e-Devlet'teki toplam prim gün sayınızı girin.",
    "Çalışmaya devam ediyorsanız aylık eklenecek prim gününü 30 bırakın.",
  ],
  faqs: [
    {
      question: "EYT kapsamında mıyım?",
      answer:
        "Sigorta başlangıç tarihiniz 08.09.1999 ve öncesi ise EYT kapsamındasınız; bu grupta yaş şartı aranmaz, yalnızca sigortalılık süresi (kadınlarda 20, erkeklerde 25 yıl) ve prim gün şartı aranır.",
    },
    {
      question: "Kaç prim günü ile emekli olunur?",
      answer:
        "08.09.1999 öncesi girişlilerde giriş tarihine göre kademeli olarak 5.000 ile 5.975 gün arasında değişir. 09.09.1999 – 30.04.2008 arası girişlilerde 7.000 gün, 01.05.2008 sonrası girişlilerde 7.200 gün gerekir.",
    },
    {
      question: "2008 sonrası sigortalıların emeklilik yaşı kaç?",
      answer:
        "Temel şart kadınlarda 58, erkeklerde 60 yaştır. Ancak 2036 yılından itibaren bu yaş kademeli olarak artar ve 2048'den sonra her iki cinsiyet için 65'e çıkar. Prim gününüzü hangi yılda tamamladığınız hangi yaş şartına tabi olacağınızı belirler.",
    },
    {
      question: "Askerlik borçlanması emeklilik tarihini değiştirir mi?",
      answer:
        "Evet. Askerlik borçlanması prim gün sayınızı artırır ve bazı durumlarda sigorta başlangıç tarihinizi öne çekerek daha avantajlı bir gruba girmenizi sağlayabilir. Bu araç borçlanmaları hesaba katmaz.",
    },
    {
      question: "Bu hesaplama SGK için bağlayıcı mıdır?",
      answer:
        "Hayır. Sonuç 4a (SSK) genel kurallarına göre üretilen bir tahmindir. Kesin emeklilik tarihiniz için e-Devlet üzerinden SGK Emeklilik Tahsis Talebi ekranını kullanın veya SGK'ya başvurun.",
    },
  ],
};

/* =======================================================
   VADELİ MEVDUAT
======================================================= */

seoContents.mevduat = {
  title: "Vadeli Mevduat Hesaplama 2026 | Net Faiz Getirisi",
  description:
    "Anapara, yıllık faiz oranı ve vadeye göre stopaj düşülmüş net mevduat getirinizi ve vade sonu toplam tutarınızı hesaplayın.",
  intro:
    "Vadeli mevduat hesaplama aracıyla bankanın ilan ettiği brüt faiz oranının stopaj kesintisinden sonra elinize ne kadar geçeceğini görebilir, farklı vadeleri karşılaştırabilirsiniz.",
  howItWorks: [
    "Yatıracağınız anapara tutarını girin.",
    "Bankanın verdiği yıllık brüt faiz oranını yazın.",
    "Vade süresini gün olarak girin (32, 92, 180 gibi).",
    "Stopaj oranını girin ve net getirinizi görüntüleyin.",
  ],
  faqs: [
    {
      question: "Mevduat faizi nasıl hesaplanır?",
      answer:
        "Brüt faiz, anaparanın yıllık faiz oranıyla çarpılıp vade gününün 365'e bölünmesiyle bulunur. Örneğin 100.000 TL, yıllık %45 faiz ve 32 gün vade için brüt faiz yaklaşık 3.945 TL olur.",
    },
    {
      question: "Mevduat stopajı ne kadar?",
      answer:
        "Stopaj yalnızca faiz getirisi üzerinden kesilir, anaparadan kesinti yapılmaz. Oran vade süresine ve mevduat türüne göre değişebildiği için güncel oranı bankanızdan teyit etmeniz gerekir.",
    },
    {
      question: "Vade sonunda elime ne kadar geçer?",
      answer:
        "Anaparanız ile stopaj düşüldükten sonraki net faiz getirinizin toplamı elinize geçer. Araç bu tutarı 'Vade Sonu Toplam' satırında gösterir.",
    },
    {
      question: "Kısa vade mi uzun vade mi daha avantajlı?",
      answer:
        "Faiz oranı aynıysa vadeyi yenileyerek bileşik getiri elde etmek toplam kazancı artırır. Araçtaki 'Yıllık Net Bileşik Getiri' satırı, aynı oranla yenilendiği varsayımıyla yıllık karşılığı gösterir.",
    },
  ],
};

/* =======================================================
   TAKSİTLİ ALIŞVERİŞ MALİYETİ
======================================================= */

seoContents["taksit-maliyeti"] = {
  title: "Taksitli Alışveriş Maliyeti | Taksit Farkı Hesaplama",
  description:
    "Taksitli fiyat ile peşin fiyat arasındaki farkı ve bu farkın gizli aylık ve yıllık faiz karşılığını hesaplayın. Taksit gerçekten farksız mı öğrenin.",
  intro:
    "“Taksit farkı yok” denilen kampanyalarda bile peşin fiyatla taksitli toplam arasında fark olabilir. Bu araç aradaki farkı lira olarak gösterir ve bu farkın hangi faiz oranına denk geldiğini hesaplar.",
  howItWorks: [
    "Ürünün peşin (tek çekim) fiyatını girin.",
    "Taksit sayısını yazın.",
    "Aylık taksit tutarını veya taksitli toplam fiyatı girin.",
    "Fark tutarını ve gizli faiz oranını görüntüleyin.",
  ],
  faqs: [
    {
      question: "Taksit farkı nasıl hesaplanır?",
      answer:
        "Aylık taksit tutarı taksit sayısıyla çarpılarak toplam ödeme bulunur; bu tutardan peşin fiyat çıkarıldığında taksit farkı ortaya çıkar.",
    },
    {
      question: "Gizli faiz ne demek?",
      answer:
        "Taksitli ödeme planının, aynı parayı borç almışsınız gibi düşünüldüğünde karşılık geldiği faiz oranıdır. İç verim oranı (IRR) yöntemiyle hesaplanır ve ödemelerin zamana yayılmasını da dikkate alır.",
    },
    {
      question: "Taksit farkı yoksa peşin mi almalıyım?",
      answer:
        "Gerçekten fark yoksa taksitle almak genelde avantajlıdır; paranız elinizde kalır ve enflasyon karşısında taksitlerin reel değeri düşer. Fark varsa, bu farkın yıllık maliyetini mevduat getirinizle karşılaştırın.",
    },
    {
      question: "Kredi kartı taksiti kredi sayılır mı?",
      answer:
        "Taksitli alışveriş bir tüketici finansmanıdır ve kart limitinizi kullanır. Taksit farkı içeriyorsa ekonomik olarak kredi kullanmaktan farksızdır.",
    },
  ],
};

/* =======================================================
   ENFLASYON / ZAM FARKI
======================================================= */

seoContents.enflasyon = {
  title: "Enflasyon ve Zam Farkı Hesaplama | Reel Artış",
  description:
    "Aldığınız zammın enflasyon karşısındaki gerçek değerini hesaplayın. Alım gücü kaybınızı, reel artış oranını ve olması gereken tutarı görün.",
  intro:
    "Nominal zam oranı tek başına alım gücünüzün arttığını göstermez. Bu araç, zammınızı aynı dönemin enflasyonuyla karşılaştırarak reel (gerçek) değişimi ve alım gücü farkınızı hesaplar.",
  howItWorks: [
    "Zam öncesi tutarı girin (maaş, kira veya fiyat).",
    "Yeni tutarı veya zam oranını yazın.",
    "Aynı dönemin TÜFE enflasyon oranını girin.",
    "Reel artışınızı ve alım gücü farkınızı görüntüleyin.",
  ],
  faqs: [
    {
      question: "Reel artış nasıl hesaplanır?",
      answer:
        "Reel artış, (1 + zam oranı) bölü (1 + enflasyon oranı) işleminin sonucundan 1 çıkarılarak bulunur. Zammı enflasyondan düz çıkarmak matematiksel olarak yanlış sonuç verir.",
    },
    {
      question: "Enflasyonun altında zam ne anlama gelir?",
      answer:
        "Nominal olarak daha çok para alsanız da aynı parayla eskisi kadar mal ve hizmet alamazsınız; alım gücünüz azalmış demektir.",
    },
    {
      question: "Kira artışında hangi oran kullanılır?",
      answer:
        "Konut kiralarında yasal üst sınır, bir önceki kira yılına ait tüketici fiyat endeksinin on iki aylık ortalamalara göre değişim oranıdır. Güncel oranı TÜİK verilerinden kontrol edin.",
    },
    {
      question: "Maaşımın enflasyona yetişmesi için ne kadar zam almalıyım?",
      answer:
        "Alım gücünüzün aynı kalması için en az enflasyon oranı kadar zam almanız gerekir. Araç bu tutarı 'Enflasyona Yetişmesi İçin Gereken' satırında gösterir.",
    },
  ],
};

/* =======================================================
   DOĞUM VE SÜT İZNİ
======================================================= */

seoContents["dogum-izni"] = {
  title: "Doğum İzni Hesaplama 2026 | Süt İzni ve Analık İzni",
  description:
    "Doğum izni başlangıç ve bitiş tarihlerinizi, süt izni sürenizi, yarım çalışma ödeneği ve ücretsiz izin hakkınızı hesaplayın.",
  intro:
    "Doğum izni hesaplama aracı, 4857 sayılı İş Kanunu'nun 74. maddesine göre doğum öncesi ve sonrası izin sürelerinizi tarih tarih gösterir; süt izni ve yarım çalışma ödeneği haklarınızı da hatırlatır.",
  howItWorks: [
    "Tahmini doğum tarihinizi girin.",
    "Tekil mi çoğul mu gebelik olduğunu seçin.",
    "Doğum öncesi çalışmayı düşündüğünüz hafta sayısını belirtin.",
    "Kaçıncı çocuğunuz olduğunu seçip sonuçları görüntüleyin.",
  ],
  faqs: [
    {
      question: "Doğum izni kaç hafta?",
      answer:
        "Kadın işçiye doğumdan önce 8, doğumdan sonra 8 hafta olmak üzere toplam 16 hafta ücretli izin verilir. Çoğul gebelikte doğum öncesi süreye 2 hafta eklenir ve toplam 18 haftaya çıkar.",
    },
    {
      question: "Doğumdan önce çalışırsam iznim uzar mı?",
      answer:
        "Evet. Sağlık durumunuz uygunsa ve hekim onay verirse doğumdan önceki 3 haftaya kadar çalışabilirsiniz. Çalıştığınız süre doğum sonrası izninize eklenir.",
    },
    {
      question: "Süt izni ne kadar ve nasıl kullanılır?",
      answer:
        "Çocuk bir yaşını doldurana kadar günde toplam 1,5 saat süt izni hakkınız vardır. Bu sürenin hangi saatlerde ve kaça bölünerek kullanılacağını işçi kendisi belirler; izin süresi günlük çalışma süresinden sayılır.",
    },
    {
      question: "Yarım çalışma ödeneği nedir?",
      answer:
        "Doğum izni bittikten sonra haftalık çalışma süresinin yarısı kadar ücretsiz izin kullanabilirsiniz; bu dönemde İŞKUR yarım çalışma ödeneği öder. Süre birinci çocukta 60, ikincide 120, üçüncü ve sonrasında 180 gündür.",
    },
    {
      question: "Babalık izni kaç gün?",
      answer:
        "Eşi doğum yapan işçiye 5 gün ücretli izin verilir. Bu hak İş Kanunu Ek Madde 2 ile düzenlenmiştir.",
    },
    {
      question: "Doğum izninde maaşımı kim öder?",
      answer:
        "Doğum izni süresince SGK tarafından geçici iş göremezlik ödeneği (analık ödeneği) ödenir. Ödenek, son bir yıldaki prime esas kazancınızın günlük ortalamasının üçte ikisi oranındadır.",
    },
  ],
};

/* =======================================================
   İŞSİZLİK MAAŞI
======================================================= */

seoContents["issizlik-maasi"] = {
  title: "İşsizlik Maaşı Hesaplama 2026 | İşsizlik Ödeneği",
  description:
    "Son 4 ayın ortalama brüt ücreti ve prim gün sayınıza göre aylık net işsizlik maaşınızı ve kaç ay boyunca alacağınızı hesaplayın.",
  intro:
    "İşsizlik maaşı hesaplama aracı, İŞKUR tarafından ödenen işsizlik ödeneğinin aylık net tutarını ve ödeme süresini prim gün sayınıza göre hesaplar.",
  howItWorks: [
    "Son 4 ayın ortalama brüt ücretini girin.",
    "Son 3 yıldaki prim gün sayınızı yazın.",
    "Son 120 gün kesintisiz çalışıp çalışmadığınızı seçin.",
    "Net ödenek tutarınızı ve süresini görüntüleyin.",
  ],
  faqs: [
    {
      question: "İşsizlik maaşı almanın şartları neler?",
      answer:
        "İş sözleşmesinin kendi isteğiniz dışında sona ermesi, son 120 gün hizmet akdine tabi kesintisiz çalışmış olmak ve son 3 yılda en az 600 gün işsizlik sigortası primi ödemiş olmak gerekir.",
    },
    {
      question: "İşsizlik maaşı ne kadar?",
      answer:
        "Son 4 aylık prime esas kazancınızın günlük ortalamasının %40'ıdır. Ancak hesaplanan tutar, brüt asgari ücretin %80'ini geçemez.",
    },
    {
      question: "Kaç ay işsizlik maaşı alınır?",
      answer:
        "600 gün primi olan 180 gün, 900 gün primi olan 240 gün, 1080 gün ve üzeri primi olan 300 gün ödenek alır.",
    },
    {
      question: "İstifa edersem işsizlik maaşı alabilir miyim?",
      answer:
        "Kural olarak hayır. İşsizlik ödeneği, iş sözleşmesinin işçinin kendi isteği dışında sona ermesi hâlinde bağlanır. Haklı nedenle fesih gibi istisnai durumlarda hak doğabilir.",
    },
    {
      question: "Başvuru süresi ne kadar?",
      answer:
        "İş sözleşmesinin sona erdiği tarihten itibaren 30 gün içinde İŞKUR'a başvurmanız gerekir. e-Devlet üzerinden de başvuru yapılabilir.",
    },
    {
      question: "İşsizlik maaşından kesinti yapılır mı?",
      answer:
        "Ödenekten yalnızca damga vergisi kesilir. Gelir vergisi ve SGK primi kesintisi yapılmaz. Ayrıca ödenek aldığınız sürece genel sağlık sigortanız İŞKUR tarafından karşılanır.",
    },
  ],
};

/* =======================================================
   KONUT KREDİSİ VE MASRAFLAR
======================================================= */

seoContents["konut-kredisi"] = {
  title: "Konut Kredisi Hesaplama 2026 | Tapu Harcı ve Masraflar",
  description:
    "Konut kredisi taksitinizi ve tapu harcı, ekspertiz, DASK, sigorta gibi tüm alım masraflarını hesaplayarak evin size gerçek maliyetini görün.",
  intro:
    "Ev alırken sadece taksit değil, tapu harcından sigortaya kadar birçok masraf ortaya çıkar. Bu araç bunların tamamını hesaba katarak tapuda hazır bulundurmanız gereken nakdi ve evin toplam maliyetini gösterir.",
  howItWorks: [
    "Konut fiyatını ve peşinatınızı girin.",
    "Bankanızın aylık faiz oranını ve vadeyi yazın.",
    "Masraf kalemlerini kendi durumunuza göre düzenleyin.",
    "Toplam nakit ihtiyacınızı ve gerçek maliyeti görüntüleyin.",
  ],
  faqs: [
    {
      question: "Ev alırken tapu harcı ne kadar?",
      answer:
        "Tapu harcı, satış bedeli üzerinden toplam %4'tür. Kanunen alıcı ve satıcı %2'şer öder, ancak uygulamada çoğu zaman tamamı alıcıya bırakılır. Hesaplamada bu oranı kendi anlaşmanıza göre değiştirebilirsiniz.",
    },
    {
      question: "Kredi tahsis ücreti ne kadar olabilir?",
      answer:
        "Bankalar konut kredilerinde kredi tutarının binde 5'ini aşmayacak şekilde tahsis ücreti alabilir. Bu üst sınır mevzuatla belirlenmiştir.",
    },
    {
      question: "DASK zorunlu mu?",
      answer:
        "Evet. Zorunlu Deprem Sigortası, tapu işlemleri ve konut kredisi kullanımı için zorunludur. Konut sigortası ise zorunlu değildir ancak bankalar genelde kredi şartı olarak talep eder.",
    },
    {
      question: "Ekspertiz ücreti neden alınır?",
      answer:
        "Banka, kredi verdiği konutun gerçek piyasa değerini bağımsız bir değerleme şirketine tespit ettirir. Ekspertiz raporu kredi tutarının üst sınırını belirler ve ücreti genelde alıcıdan tahsil edilir.",
    },
    {
      question: "Konut kredisinde en fazla ne kadar kredi çekilebilir?",
      answer:
        "Konutun ekspertiz değerine göre belirlenen kredi/değer oranı sınırlar. Oran konutun değerine ve mevzuata göre değişir; bu nedenle peşinat oranınızı ekspertiz sonrasına göre planlamak gerekir.",
    },
  ],
};

/* =======================================================
   YAKIT VE YOL MALİYETİ
======================================================= */

seoContents["yakit-maliyeti"] = {
  title: "Yakıt Hesaplama | Yol ve Km Maliyeti Hesaplama",
  description:
    "Mesafe, ortalama tüketim ve yakıt fiyatına göre yolculuk maliyetinizi, kişi başı tutarı ve aylık yol giderinizi hesaplayın.",
  intro:
    "Yakıt maliyeti hesaplama aracı, gideceğiniz mesafe ve aracınızın ortalama tüketimi üzerinden yolculuğun size kaça mal olacağını gösterir; maliyeti yol arkadaşlarınızla bölüşmenizi kolaylaştırır.",
  howItWorks: [
    "Tek yön mesafeyi kilometre olarak girin.",
    "Aracınızın 100 kilometrede kaç litre yaktığını yazın.",
    "Güncel yakıt litre fiyatını girin.",
    "Gidiş-dönüş, kişi sayısı ve geçiş ücretlerini belirtin.",
  ],
  faqs: [
    {
      question: "Yakıt tüketimi nasıl hesaplanır?",
      answer:
        "Gidilen mesafe, aracın 100 kilometredeki ortalama tüketimiyle çarpılır ve 100'e bölünür. Çıkan litre miktarı güncel yakıt fiyatıyla çarpılarak maliyet bulunur.",
    },
    {
      question: "Aracımın ortalama tüketimini nereden öğrenirim?",
      answer:
        "Çoğu aracın gösterge panelinde ortalama tüketim bilgisi bulunur. Alternatif olarak, depoyu tam doldurup belirli bir mesafe sonrasında tekrar doldurarak harcanan litreyi kilometreye bölebilirsiniz.",
    },
    {
      question: "Şehir içi ve şehir dışı tüketim neden farklı?",
      answer:
        "Şehir içinde sık dur-kalk, rölanti ve düşük vites kullanımı tüketimi artırır. Şehir dışında sabit hızda seyir tüketimi düşürür. Uzun yol hesabı yaparken şehir dışı ortalamayı kullanmak daha doğru sonuç verir.",
    },
    {
      question: "Aracın gerçek kilometre maliyeti sadece yakıt mı?",
      answer:
        "Hayır. Lastik, periyodik bakım, sigorta, MTV, muayene ve değer kaybı da kilometre başına maliyete eklenir. Bu kalemler toplamda genellikle yakıt gideri kadar tutar.",
    },
  ],
};

/* =======================================================
   BES
======================================================= */

seoContents.bes = {
  title: "BES Hesaplama 2026 | Devlet Katkılı Birikim Hesaplama",
  description:
    "Aylık katkı payı, süre ve getiri beklentinize göre devlet katkısı dâhil toplam BES birikiminizi ve hak ediş oranınızı hesaplayın.",
  intro:
    "BES hesaplama aracı, bireysel emeklilik sisteminde biriktireceğiniz tutarı devlet katkısıyla birlikte gösterir ve kaç yıl kalırsanız devlet katkısının ne kadarına hak kazanacağınızı hesaplar.",
  howItWorks: [
    "Aylık ödeyeceğiniz katkı payını girin.",
    "Sistemde kalmayı planladığınız süreyi yazın.",
    "Yıllık getiri beklentinizi belirtin.",
    "Emeklilik hakkı kazanıp kazanmayacağınızı seçin.",
  ],
  faqs: [
    {
      question: "BES devlet katkısı ne kadar?",
      answer:
        "Ödediğiniz katkı payının %30'u kadar devlet katkısı hesabınıza eklenir. Bir takvim yılında alınabilecek toplam devlet katkısı, o yılın brüt asgari ücretinin yıllık toplamını aşamaz.",
    },
    {
      question: "Devlet katkısının tamamını ne zaman alırım?",
      answer:
        "Hak ediş kademelidir: 3 yıl sonunda %15'i, 6 yıl sonunda %35'i, 10 yıl sonunda %60'ı hak edilir. 56 yaşını doldurup en az 10 yıl sistemde kalarak emekli olduğunuzda devlet katkısının tamamını alırsınız.",
    },
    {
      question: "BES'ten erken çıkarsam ne olur?",
      answer:
        "Kendi katkı paylarınızı ve getirilerini alırsınız, ancak hak etmediğiniz devlet katkısı kısmı devlete geri döner. Ayrıca sistemde kalış sürenize göre stopaj kesintisi uygulanır.",
    },
    {
      question: "BES ile mevduat arasındaki fark nedir?",
      answer:
        "Mevduatta faiz oranı baştan bellidir ve getiriniz garantilidir. BES'te getiri seçtiğiniz fonun performansına bağlıdır, garanti yoktur; buna karşılık %30 devlet katkısı ve uzun vadeli birikim disiplini avantajı sağlar.",
    },
    {
      question: "BES kesintileri nelerdir?",
      answer:
        "Fon toplam gider kesintisi ve bazı sözleşmelerde giriş aidatı uygulanır. Bu araç kesintileri hesaba katmaz; net getirinizi görmek için sözleşmenizdeki oranları emeklilik şirketinizden teyit edin.",
    },
  ],
};

/* =========================================================
   JSON-LD
========================================================= */

function JsonLd({
  calculator,
  seo,
  slug,
}: {
  calculator: (typeof calculators)[number];
  seo: SeoContent;
  slug: string;
}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const pageUrl =
    `${baseUrl}/hesaplamalar/${slug}`;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: seo.title,
    description: seo.description,
    url: pageUrl,
    inLanguage: "tr-TR",

    isPartOf: {
      "@type": "WebSite",
      name: "MiniHesap",
      url: baseUrl,
    },

    about: {
      "@type": "Thing",
      name: calculator.title,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: seo.faqs.map(
      (faq) => ({
        "@type": "Question",

        name: faq.question,

        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })
    ),
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: calculator.title,
    url: pageUrl,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    inLanguage: "tr-TR",
    description: seo.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              webPageSchema
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              appSchema
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              faqSchema
            ),
        }}
      />
    </>
  );
}

/* =========================================================
   STATIC PARAMS
========================================================= */

export function generateStaticParams() {
  return calculators.map(
    (calculator) => ({
      slug: calculator.slug,
    })
  );
}

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}): Promise<Metadata> {
  const { slug } =
    await params;

  const calculator =
    calculators.find(
      (item) =>
        item.slug === slug
    );

  const seo =
    seoContents[slug];

  if (
    !calculator ||
    !seo
  ) {
    return {
      title:
        "MiniHesap | Hesaplama Araçları",

      description:
        "MiniHesap hesaplama araçları.",
    };
  }

  return {
    title: seo.title,

    description:
      seo.description,

    alternates: {
      canonical:
        `/hesaplamalar/${slug}`,
    },

    openGraph: {
      title: seo.title,

      description:
        seo.description,

      type: "website",

      locale:
        "tr_TR",

      siteName:
        "MiniHesap",

      url:
        `/hesaplamalar/${slug}`,
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        seo.title,

      description:
        seo.description,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

/* =========================================================
   SAYFA
========================================================= */

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } =
    await params;

  const calculator =
    calculators.find(
      (item) =>
        item.slug === slug
    );

  const Calculator =
    componentMap[slug];

  const seo =
    seoContents[slug];

  if (
    !calculator ||
    !Calculator ||
    !seo
  ) {
    notFound();
  }

  const related =
    getRelatedCalculators(slug);

  /* Bu araca ait rehber yazilari */
  const toolGuides = guidesForTool(slug);

  return (
    <main className="page">

      {/* ===================================================
          JSON-LD
      =================================================== */}

      <JsonLd
        calculator={
          calculator
        }
        seo={seo}
        slug={slug}
      />

      {/* ===================================================
          HESAPLAMA ALANI
      =================================================== */}

      <div className="container">

        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Hesaplamalar", href: "/hesaplamalar" },
            { label: calculator.title },
          ]}
        />

        <h1>
          <span aria-hidden="true">
            {calculator.icon}
          </span>{" "}
          {calculator.title}
        </h1>

        <p className="page-lead">
          {
            calculator.description
          }
        </p>

        <Calculator />

        {toolGuides.length > 0 && (
          <div className="notice notice-ok">
            <strong>Konuyu daha iyi anlamak ister misiniz?</strong>{" "}
            {toolGuides.map((g, i) => (
              <span key={g.slug}>
                {i > 0 && " · "}
                <Link
                  href={`/rehber/${g.slug}`}
                  style={{ fontWeight: 700, textDecoration: "underline" }}
                >
                  {g.title}
                </Link>
              </span>
            ))}
          </div>
        )}

        <p className="notice notice-warn">
          <strong>Bilgilendirme:</strong> Buradaki sonuçlar girdiğiniz
          verilere göre üretilen <strong>tahmini</strong> değerlerdir; resmî
          bordro, banka veya kurum hesaplaması yerine geçmez. Kesin tutarlar
          için işvereninize, bankanıza veya mali müşavirinize danışın.
        </p>

        <div style={{ marginTop: 24 }}>
          <AdSlot position="middle" />
        </div>

      </div>

      {/* ===================================================
          SEO İÇERİĞİ
      =================================================== */}

      <section
        className="section"
        style={{
          paddingTop: 45,
        }}
      >
        <div className="container">

          <div
            style={{
              maxWidth: 850,
              margin: "0 auto",
            }}
          >

            {/* =================================================
                GİRİŞ
            ================================================= */}

            <article
              style={{
                padding: 25,
                borderRadius: 22,
                background:
                  "white",
                border:
                  "1px solid #dce7df",
              }}
            >

              <div className="eyebrow">
                {
                  calculator.title.toUpperCase()
                }
              </div>

              <h2
                style={{
                  margin:
                    "8px 0 15px",
                  fontSize: 30,
                }}
              >
                {seo.title}
              </h2>

              <p
                style={{
                  margin: 0,
                  color:
                    "#617066",
                  lineHeight: 1.8,
                }}
              >
                {seo.intro}
              </p>

            </article>

            {/* =================================================
                NASIL HESAPLANIR
            ================================================= */}

            <article
              style={{
                marginTop: 20,
                padding: 25,
                borderRadius: 22,
                background:
                  "white",
                border:
                  "1px solid #dce7df",
              }}
            >

              <h2
                style={{
                  marginTop: 0,
                  fontSize: 26,
                }}
              >
                Nasıl Hesaplanır?
              </h2>

              <div
                style={{
                  display:
                    "grid",
                  gap: 12,
                }}
              >

                {seo.howItWorks.map(
                  (
                    step,
                    index
                  ) => (
                    <div
                      key={step}
                      style={{
                        display:
                          "flex",
                        gap: 14,
                        alignItems:
                          "flex-start",
                        padding:
                          14,
                        borderRadius:
                          15,
                        background:
                          "#f8faf9",
                        border:
                          "1px solid #e5eee8",
                      }}
                    >

                      <div
                        style={{
                          minWidth:
                            32,
                          width:
                            32,
                          height:
                            32,
                          borderRadius:
                            "50%",
                          display:
                            "grid",
                          placeItems:
                            "center",
                          background:
                            "#dcfce7",
                          color:
                            "#15803d",
                          fontWeight:
                            900,
                        }}
                      >
                        {index + 1}
                      </div>

                      <div
                        style={{
                          paddingTop:
                            5,
                          color:
                            "#405248",
                          lineHeight:
                            1.6,
                        }}
                      >
                        {step}
                      </div>

                    </div>
                  )
                )}

              </div>

            </article>

            {/* =================================================
                SSS
            ================================================= */}

            <article
              style={{
                marginTop: 20,
              }}
            >

              <div
                className="eyebrow"
                style={{
                  marginBottom: 7,
                }}
              >
                SIK SORULAN SORULAR
              </div>

              <h2
                style={{
                  margin:
                    "0 0 18px",
                  fontSize: 30,
                }}
              >
                Sık Sorulan Sorular
              </h2>

              <div
                style={{
                  display:
                    "grid",
                  gap: 12,
                }}
              >

                {seo.faqs.map(
                  (faq) => (
                    <details
                      key={
                        faq.question
                      }
                      style={{
                        background:
                          "white",
                        border:
                          "1px solid #dce7df",
                        borderRadius:
                          18,
                        padding:
                          "17px 20px",
                      }}
                    >

                      <summary
                        style={{
                          cursor:
                            "pointer",
                          fontWeight:
                            800,
                          lineHeight:
                            1.5,
                        }}
                      >
                        {
                          faq.question
                        }
                      </summary>

                      <p
                        style={{
                          color:
                            "#617066",
                          lineHeight:
                            1.7,
                          margin:
                            "12px 0 0",
                        }}
                      >
                        {
                          faq.answer
                        }
                      </p>

                    </details>
                  )
                )}

              </div>

            </article>

          </div>

        </div>
      </section>

      {/* ===================================================
          İLGİLİ HESAPLAMALAR
      =================================================== */}

      {related.length > 0 && (
        <section
          className="section"
          style={{ paddingTop: 10 }}
        >
          <div className="container">

            <div className="section-head">
              <p className="eyebrow">DEVAM EDİN</p>
              <h2>İlgili Hesaplama Araçları</h2>
            </div>

            <div className="cards">
              {related.map((item) => (
                <CalculatorCard
                  key={item.slug}
                  href={`/hesaplamalar/${item.slug}`}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>

            <div
              style={{
                marginTop: 30,
                textAlign: "center",
              }}
            >
              <Link
                className="btn btn-outline"
                href="/hesaplamalar"
              >
                ← Tüm hesaplama araçlarını gör
              </Link>
            </div>

          </div>
        </section>
      )}

      <div className="container">
        <AdSlot position="bottom" />
      </div>

    </main>
  );
}
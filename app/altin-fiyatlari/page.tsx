import type { Metadata } from "next";

import MarketPage from "@/components/market/MarketPage";
import { fetchMarket } from "@/lib/market";

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: "Canlı Altın Fiyatları: Gram, Çeyrek Altın Bugün | MiniHesap" },
  description:
    "Gram altın, çeyrek, yarım, tam ve Cumhuriyet altını canlı alış satış fiyatları. 22, 18, 14 ayar ve gümüş; dakikada bir güncellenen tablo ve altın hesaplama.",
  alternates: { canonical: "/altin-fiyatlari" },
};

export default async function GoldPricesPage() {
  return <MarketPage kind="gold" data={await fetchMarket()} />;
}

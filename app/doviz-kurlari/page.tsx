import type { Metadata } from "next";

import MarketPage from "@/components/market/MarketPage";
import { fetchMarket } from "@/lib/market";

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: "Canlı Döviz Kurları: Dolar, Euro Kaç TL? | MiniHesap" },
  description:
    "Dolar, euro, sterlin, frank ve diğer yabancı paraların canlı alış satış kurları. Dakikada bir güncellenen döviz tablosu ve TL çevirici.",
  alternates: { canonical: "/doviz-kurlari" },
};

export default async function CurrencyRatesPage() {
  return <MarketPage kind="currency" data={await fetchMarket()} />;
}

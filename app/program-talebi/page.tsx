import type { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumb";
import ProgramRequestForm from "@/components/ProgramRequestForm";

export const metadata: Metadata = {
  title: "Program Talebi | AI Ürün Danışmanı",
  description: "İhtiyacınız olan programı doğal dille anlatın. MiniHesap AI ürün danışmanı talebinizi özetlesin, ek soruları belirlesin ve ekibimize bildirsin.",
  alternates: { canonical: "/program-talebi" },
};

export default function ProgramRequestPage() {
  return (
    <main className="page">
      <div className="container">
        <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: "Program Talebi" }]} />
        <p className="eyebrow">MİNİHESAP AI ÜRÜN DANIŞMANI</p>
        <h1>İstediğiniz programı anlatın</h1>
        <p className="page-lead">
          İhtiyacınızı günlük konuşma diliyle yazın. AI destekli danışmanımız fikrinizi özetlesin, eksik noktaları çıkarsın ve ekibimize inceleme bildirimi oluştursun.
        </p>
        <div className="notice" style={{ marginTop: 24 }}>
          AI çıktısı ön değerlendirmedir. Son karar ve geliştirme kapsamı ekibimizin incelemesinden sonra belirlenir.
        </div>
        <ProgramRequestForm />
      </div>
    </main>
  );
}
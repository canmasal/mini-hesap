import { redirect } from "next/navigation";

/**
 * /hisseler ayrı bir sayfa değil.
 *
 * Canlı hisse takibi /borsa sayfasında duruyor ve veriyi lib/stocks.ts üzerinden
 * Yahoo v8 chart ucundan alıyor. Buradaki eski sürüm Yahoo v7 quote ucuna
 * bağlıydı, o uç artık Unauthorized dönüyor. Adres elde kalmasın diye
 * yönlendirme bırakıldı.
 */
export default function HisselerPage() {
  redirect("/borsa");
}

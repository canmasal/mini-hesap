import Link from "next/link";

import { carTree } from "@/data/cars";
import { carPairs } from "@/data/cars/pairs";
import CarCompareTool from "./CarCompareTool";

/** Sunucuda ağacı kurar, istemci bileşenine verir; altında hazır karşılaştırmalar listelenir. */
export default function CarCompare() {
  const pairs = carPairs();
  return (
    <>
      <CarCompareTool tree={carTree()} />
      {pairs.length > 0 && (
        <div className="notice" style={{ marginTop: 18 }}>
          <strong>Popüler karşılaştırmalar:</strong>{" "}
          {pairs.map((p, i) => (
            <span key={p.slug}>
              {i > 0 && " · "}
              <Link href={`/araba-karsilastirma/${p.slug}`} style={{ textDecoration: "underline" }}>
                {p.a.brand} {p.a.model} – {p.b.brand} {p.b.model}
              </Link>
            </span>
          ))}
        </div>
      )}
    </>
  );
}

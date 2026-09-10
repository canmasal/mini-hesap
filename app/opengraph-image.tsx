import { ImageResponse } from "next/og";

export const alt = "MiniHesap | Online Hesaplama Araçları";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 80px",
          background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 55%, #dcfce7 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontWeight: 800,
            color: "#16a34a",
            letterSpacing: 2,
          }}
        >
          MİNİHESAP
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 74,
            fontWeight: 800,
            color: "#10231a",
            lineHeight: 1.1,
          }}
        >
          Hayatını Kolaylaştıran
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 74,
            fontWeight: 800,
            color: "#16a34a",
            lineHeight: 1.1,
          }}
        >
          Hesaplamalar Tek Yerde
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 30,
            color: "#617066",
          }}
        >
          Net maaş · Kıdem · İhbar · KDV · Kredi · Yıllık izin
        </div>
      </div>
    ),
    size
  );
}

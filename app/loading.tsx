export default function Loading() {
  return (
    <main className="page" aria-busy="true">
      <div className="container">
        <span className="visually-hidden" role="status">
          Sayfa yükleniyor
        </span>

        <div className="skeleton" style={{ width: 180, height: 16 }} />
        <div
          className="skeleton"
          style={{ width: "min(520px, 90%)", height: 44, marginTop: 18 }}
        />
        <div
          className="skeleton"
          style={{ width: "min(680px, 100%)", height: 18, marginTop: 16 }}
        />

        <div className="skeleton" style={{ height: 320, marginTop: 34, borderRadius: 28 }} />
      </div>
    </main>
  );
}

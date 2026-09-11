using System.Data;
using Microsoft.Data.Sqlite;

namespace MiniHesap;

/// <summary>
/// Veritabanı katmanı. Tek dosyalık SQLite; programın yanında durur,
/// kurulum veya sunucu gerektirmez.
/// </summary>
public static class Db
{
    public static string DbPath { get; private set; } = "";
    private static string _connStr = "";

    public static SqliteConnection Open()
    {
        var c = new SqliteConnection(_connStr);
        c.Open();
        using (var pragma = c.CreateCommand())
        {
            pragma.CommandText = "PRAGMA foreign_keys = ON;";
            pragma.ExecuteNonQuery();
        }
        return c;
    }

    public static void Initialize(string folder)
    {
        DbPath = Path.Combine(folder, "MiniHesapIsletme.db");
        _connStr = new SqliteConnectionStringBuilder { DataSource = DbPath }.ToString();

        bool fresh = !File.Exists(DbPath);

        using var c = Open();
        Exec(c, @"
CREATE TABLE IF NOT EXISTS Ayarlar (
    Id              INTEGER PRIMARY KEY CHECK (Id = 1),
    FirmaAdi        TEXT NOT NULL DEFAULT '',
    VergiDairesi    TEXT NOT NULL DEFAULT '',
    VergiNo         TEXT NOT NULL DEFAULT '',
    Telefon         TEXT NOT NULL DEFAULT '',
    Eposta          TEXT NOT NULL DEFAULT '',
    VarsayilanKdv   REAL NOT NULL DEFAULT 0.20
);

CREATE TABLE IF NOT EXISTS Cariler (
    CariId          INTEGER PRIMARY KEY AUTOINCREMENT,
    CariKodu        TEXT NOT NULL UNIQUE,
    Unvan           TEXT NOT NULL,
    Tip             TEXT NOT NULL DEFAULT 'Müşteri',
    VergiNo         TEXT NOT NULL DEFAULT '',
    Telefon         TEXT NOT NULL DEFAULT '',
    Eposta          TEXT NOT NULL DEFAULT '',
    AcilisBakiyesi  REAL NOT NULL DEFAULT 0,
    Aktif           INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS Urunler (
    UrunId          INTEGER PRIMARY KEY AUTOINCREMENT,
    UrunKodu        TEXT NOT NULL UNIQUE,
    UrunAdi         TEXT NOT NULL,
    Birim           TEXT NOT NULL DEFAULT 'Adet',
    AlisFiyati      REAL NOT NULL DEFAULT 0,
    SatisFiyati     REAL NOT NULL DEFAULT 0,
    KdvOrani        REAL NOT NULL DEFAULT 0.20,
    AcilisStogu     REAL NOT NULL DEFAULT 0,
    KritikStok      REAL NOT NULL DEFAULT 0,
    Aktif           INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS Hareketler (
    HareketId       INTEGER PRIMARY KEY AUTOINCREMENT,
    Tarih           TEXT NOT NULL,
    Tip             TEXT NOT NULL,
    CariId          INTEGER REFERENCES Cariler(CariId),
    UrunId          INTEGER REFERENCES Urunler(UrunId),
    Miktar          REAL NOT NULL DEFAULT 0,
    BirimFiyat      REAL NOT NULL DEFAULT 0,
    KdvOrani        REAL NOT NULL DEFAULT 0.20,
    Odeme           TEXT NOT NULL DEFAULT 'Banka',
    BelgeTuru       TEXT NOT NULL DEFAULT 'Fatura',
    BelgeNo         TEXT NOT NULL DEFAULT '',
    VadeTarihi      TEXT,
    Tahsil          INTEGER NOT NULL DEFAULT 1,
    Aciklama        TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS ixHarTarih ON Hareketler(Tarih);
CREATE INDEX IF NOT EXISTS ixHarCari  ON Hareketler(CariId);
CREATE INDEX IF NOT EXISTS ixHarUrun  ON Hareketler(UrunId);
");

        Exec(c, "INSERT OR IGNORE INTO Ayarlar (Id, FirmaAdi) VALUES (1, 'Firmanız');");

        if (fresh) SeedDemo(c);
    }

    private static void SeedDemo(SqliteConnection c)
    {
        Exec(c, @"
INSERT INTO Cariler (CariKodu, Unvan, Tip, VergiNo, Telefon, Eposta) VALUES
 ('C001','Aydın Ticaret Ltd. Şti.','Müşteri','1234567890','0212 000 00 00','info@aydinticaret.com'),
 ('C002','Beta Yazılım A.Ş.','Müşteri','2345678901','0216 000 00 00','muhasebe@betayazilim.com'),
 ('C003','Deniz Toptan Gıda','Tedarikçi','3456789012','0232 000 00 00','siparis@deniztoptan.com');

INSERT INTO Urunler (UrunKodu, UrunAdi, Birim, AlisFiyati, SatisFiyati, KdvOrani, AcilisStogu, KritikStok) VALUES
 ('U001','A Serisi Ürün','Adet',850,1200,0.20,100,20),
 ('U002','B Serisi Ürün','Adet',420,650,0.20,250,50),
 ('U003','Aylık Bakım Hizmeti','Ay',0,8000,0.20,0,0);
");

        string t(int d) => DateTime.Today.AddDays(d).ToString("yyyy-MM-dd");

        Exec(c, $@"
INSERT INTO Hareketler (Tarih,Tip,CariId,UrunId,Miktar,BirimFiyat,KdvOrani,Odeme,BelgeTuru,BelgeNo,VadeTarihi,Tahsil,Aciklama) VALUES
 ('{t(-24)}','Satış',1,1,40,1200,0.20,'Banka','e-Fatura','SAT2026000141','{t(-24)}',1,'Toptan ürün satışı'),
 ('{t(-12)}','Satış',2,3,1,8000,0.20,'Açık Hesap','e-Arşiv Fatura','SAT2026000158','{t(18)}',0,'Aylık bakım hizmeti'),
 ('{t(-40)}','Satış',1,2,120,650,0.20,'Açık Hesap','e-Fatura','SAT2026000122','{t(-9)}',0,'Proje teslimatı'),
 ('{t(-26)}','Alış',3,1,60,850,0.20,'Banka','e-Fatura','ALS2026000318','{t(-26)}',1,'Stok alımı'),
 ('{t(-6)}','Alış',3,2,90,420,0.20,'Açık Hesap','e-Fatura','ALS2026000402','{t(9)}',0,'Stok alımı');
");
    }

    public static void Exec(SqliteConnection c, string sql)
    {
        using var cmd = c.CreateCommand();
        cmd.CommandText = sql;
        cmd.ExecuteNonQuery();
    }

    public static int Exec(string sql, params (string, object)[] ps)
    {
        using var c = Open();
        using var cmd = c.CreateCommand();
        cmd.CommandText = sql;
        foreach (var (k, v) in ps) cmd.Parameters.AddWithValue(k, v ?? DBNull.Value);
        return cmd.ExecuteNonQuery();
    }

    public static object Scalar(string sql, params (string, object)[] ps)
    {
        using var c = Open();
        using var cmd = c.CreateCommand();
        cmd.CommandText = sql;
        foreach (var (k, v) in ps) cmd.Parameters.AddWithValue(k, v ?? DBNull.Value);
        return cmd.ExecuteScalar();
    }

    public static double Num(string sql, params (string, object)[] ps)
    {
        var o = Scalar(sql, ps);
        if (o == null || o == DBNull.Value) return 0;
        return Convert.ToDouble(o);
    }

    public static DataTable Table(string sql, params (string, object)[] ps)
    {
        using var c = Open();
        using var cmd = c.CreateCommand();
        cmd.CommandText = sql;
        foreach (var (k, v) in ps) cmd.Parameters.AddWithValue(k, v ?? DBNull.Value);

        using var r = cmd.ExecuteReader();
        var dt = new DataTable();
        dt.Load(r);
        return dt;
    }
}

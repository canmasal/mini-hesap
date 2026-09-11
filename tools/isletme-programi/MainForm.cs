using System.Data;
using System.Drawing;
using System.Globalization;
using System.Windows.Forms;

namespace MiniHesap;

public class MainForm : Form
{
    private readonly TabControl _tabs = new();
    private readonly FlowLayoutPanel _kpiFlow = new();
    private readonly DataGridView _gCari = new();
    private readonly DataGridView _gUrun = new();
    private readonly DataGridView _gHar = new();
    private readonly DataGridView _gStok = new();
    private readonly DataGridView _gEkstre = new();
    private readonly Label _status = new();

    private static readonly CultureInfo TR = new("tr-TR");

    private static string Money(double v) => v.ToString("#,##0.00 ₺", TR);
    private static string Pct(double v) => v.ToString("0.0", TR) + "%";
    private static string Int0(double v) => v.ToString("#,##0", TR);

    public MainForm()
    {
        Text = "MiniHesap İşletme  —  minihesap.net";
        StartPosition = FormStartPosition.CenterScreen;
        MinimumSize = new Size(1100, 680);
        Size = new Size(1280, 800);
        BackColor = Theme.Bg;
        Font = Theme.Body;
        AutoScaleMode = AutoScaleMode.Dpi;

        BuildHeader();
        BuildTabs();
        BuildStatus();

        RefreshAll();
    }

    // -----------------------------------------------------
    // ÜST BAŞLIK
    // -----------------------------------------------------
    private void BuildHeader()
    {
        var header = new Panel { Dock = DockStyle.Top, Height = 62, BackColor = Theme.Brand };

        var title = new Label
        {
            Text = "MiniHesap İşletme",
            Font = Theme.H1,
            ForeColor = Color.White,
            AutoSize = true,
            Location = new Point(18, 15),
        };

        var sub = new Label
        {
            Text = "Cari · Ürün · Stok · Fatura · Raporlama",
            Font = Theme.Small,
            ForeColor = Color.FromArgb(220, 252, 231),
            AutoSize = true,
            Location = new Point(20, 40),
        };

        header.Controls.Add(sub);
        header.Controls.Add(title);
        Controls.Add(header);
    }

    private void BuildStatus()
    {
        var bar = new Panel { Dock = DockStyle.Bottom, Height = 28, BackColor = Color.White };
        _status.Dock = DockStyle.Fill;
        _status.TextAlign = ContentAlignment.MiddleLeft;
        _status.Font = Theme.Small;
        _status.ForeColor = Theme.Muted;
        _status.Padding = new Padding(10, 0, 0, 0);
        bar.Controls.Add(_status);
        Controls.Add(bar);
    }

    // -----------------------------------------------------
    // SEKMELER
    // -----------------------------------------------------
    private void BuildTabs()
    {
        _tabs.Dock = DockStyle.Fill;
        _tabs.Font = Theme.H2;
        _tabs.Padding = new Point(16, 8);

        _tabs.TabPages.Add(MakeDashboardTab());
        _tabs.TabPages.Add(MakeGridTab("Cariler", _gCari,
            ("Yeni Cari", CariEkle), ("Düzenle", CariDuzenle), ("Sil", CariSil)));
        _tabs.TabPages.Add(MakeGridTab("Ürünler", _gUrun,
            ("Yeni Ürün", UrunEkle), ("Düzenle", UrunDuzenle), ("Sil", UrunSil)));
        _tabs.TabPages.Add(MakeGridTab("Hareketler", _gHar,
            ("Yeni Hareket", HareketEkle), ("Düzenle", HareketDuzenle), ("Sil", HareketSil)));
        _tabs.TabPages.Add(MakeGridTab("Stok Durumu", _gStok));
        _tabs.TabPages.Add(MakeGridTab("Cari Ekstre", _gEkstre));

        Controls.Add(_tabs);
        _tabs.BringToFront();
    }

    private TabPage MakeDashboardTab()
    {
        var page = new TabPage("Panel") { BackColor = Theme.Bg, Padding = new Padding(14) };

        _kpiFlow.Dock = DockStyle.Fill;
        _kpiFlow.AutoScroll = true;
        _kpiFlow.Padding = new Padding(6);

        var toolbar = new FlowLayoutPanel { Dock = DockStyle.Top, Height = 46, BackColor = Theme.Bg };
        var refresh = Theme.PrimaryButton("Yenile");
        refresh.Click += (s, e) => RefreshAll();
        var export = Theme.GhostButton("Excel'e Aktar (CSV)");
        export.Click += (s, e) => ExportCsv();
        toolbar.Controls.Add(refresh);
        toolbar.Controls.Add(export);

        page.Controls.Add(_kpiFlow);
        page.Controls.Add(toolbar);
        return page;
    }

    private TabPage MakeGridTab(string name, DataGridView grid,
        params (string, Action)[] actions)
    {
        var page = new TabPage(name) { BackColor = Theme.Bg, Padding = new Padding(14) };
        Theme.StyleGrid(grid);

        var host = new Panel { Dock = DockStyle.Fill, BackColor = Theme.Surface, Padding = new Padding(1) };
        host.Controls.Add(grid);

        if (actions.Length > 0)
        {
            var bar = new FlowLayoutPanel { Dock = DockStyle.Top, Height = 46, BackColor = Theme.Bg };
            for (int i = 0; i < actions.Length; i++)
            {
                var (text, act) = actions[i];
                var b = i == 0 ? Theme.PrimaryButton(text) : Theme.GhostButton(text);
                if (text == "Sil") b.ForeColor = Theme.Danger;
                b.Click += (s, e) => { act(); RefreshAll(); };
                bar.Controls.Add(b);
            }
            page.Controls.Add(host);
            page.Controls.Add(bar);
        }
        else
        {
            page.Controls.Add(host);
        }

        return page;
    }

    // -----------------------------------------------------
    // VERİ YENİLEME
    // -----------------------------------------------------
    private void RefreshAll()
    {
        LoadGrids();
        LoadDashboard();
        _status.Text = $"Veritabanı: {Db.DbPath}     |     Son yenileme: {DateTime.Now:HH:mm:ss}";
    }

    private void LoadGrids()
    {
        _gCari.DataSource = Db.Table(@"
SELECT CariId AS 'Id', CariKodu AS 'Kod', Unvan, Tip,
       VergiNo AS 'Vergi No', Telefon, Eposta AS 'E-posta',
       AcilisBakiyesi AS 'Açılış',
       CASE Aktif WHEN 1 THEN 'Aktif' ELSE 'Pasif' END AS 'Durum'
FROM Cariler ORDER BY CariKodu");

        _gUrun.DataSource = Db.Table(@"
SELECT UrunId AS 'Id', UrunKodu AS 'Kod', UrunAdi AS 'Ürün', Birim,
       AlisFiyati AS 'Alış', SatisFiyati AS 'Satış',
       KdvOrani AS 'KDV', AcilisStogu AS 'Açılış Stok', KritikStok AS 'Kritik',
       CASE Aktif WHEN 1 THEN 'Aktif' ELSE 'Pasif' END AS 'Durum'
FROM Urunler ORDER BY UrunKodu");

        _gHar.DataSource = Db.Table(@"
SELECT h.HareketId AS 'Id', h.Tarih, h.Tip,
       c.Unvan AS 'Cari', u.UrunAdi AS 'Ürün',
       h.Miktar, h.BirimFiyat AS 'Birim Fiyat',
       ROUND(h.Miktar * h.BirimFiyat, 2) AS 'Matrah',
       ROUND(h.Miktar * h.BirimFiyat * h.KdvOrani, 2) AS 'KDV',
       ROUND(h.Miktar * h.BirimFiyat * (1 + h.KdvOrani), 2) AS 'Toplam',
       h.BelgeNo AS 'Belge No', h.VadeTarihi AS 'Vade',
       CASE h.Tahsil WHEN 1 THEN 'Tamam' ELSE 'Bekliyor' END AS 'Durum'
FROM Hareketler h
LEFT JOIN Cariler c ON c.CariId = h.CariId
LEFT JOIN Urunler u ON u.UrunId = h.UrunId
ORDER BY h.Tarih DESC, h.HareketId DESC");

        _gStok.DataSource = Db.Table(@"
SELECT u.UrunKodu AS 'Kod', u.UrunAdi AS 'Ürün', u.Birim,
       u.AcilisStogu AS 'Açılış',
       IFNULL((SELECT SUM(Miktar) FROM Hareketler WHERE UrunId=u.UrunId AND Tip='Alış'),0) AS 'Giren',
       IFNULL((SELECT SUM(Miktar) FROM Hareketler WHERE UrunId=u.UrunId AND Tip='Satış'),0) AS 'Çıkan',
       u.AcilisStogu
         + IFNULL((SELECT SUM(Miktar) FROM Hareketler WHERE UrunId=u.UrunId AND Tip='Alış'),0)
         - IFNULL((SELECT SUM(Miktar) FROM Hareketler WHERE UrunId=u.UrunId AND Tip='Satış'),0) AS 'Kalan',
       u.KritikStok AS 'Kritik',
       CASE
         WHEN u.AcilisStogu
              + IFNULL((SELECT SUM(Miktar) FROM Hareketler WHERE UrunId=u.UrunId AND Tip='Alış'),0)
              - IFNULL((SELECT SUM(Miktar) FROM Hareketler WHERE UrunId=u.UrunId AND Tip='Satış'),0) <= 0
           THEN 'STOK YOK'
         WHEN u.AcilisStogu
              + IFNULL((SELECT SUM(Miktar) FROM Hareketler WHERE UrunId=u.UrunId AND Tip='Alış'),0)
              - IFNULL((SELECT SUM(Miktar) FROM Hareketler WHERE UrunId=u.UrunId AND Tip='Satış'),0) <= u.KritikStok
           THEN 'KRİTİK'
         ELSE 'Yeterli'
       END AS 'Durum'
FROM Urunler u WHERE u.Aktif = 1 ORDER BY u.UrunKodu");

        _gEkstre.DataSource = Db.Table(@"
SELECT c.CariKodu AS 'Kod', c.Unvan, c.Tip,
       c.AcilisBakiyesi AS 'Açılış',
       IFNULL((SELECT SUM(Miktar*BirimFiyat*(1+KdvOrani)) FROM Hareketler WHERE CariId=c.CariId AND Tip='Satış'),0) AS 'Satış',
       IFNULL((SELECT SUM(Miktar*BirimFiyat*(1+KdvOrani)) FROM Hareketler WHERE CariId=c.CariId AND Tip='Alış'),0) AS 'Alış',
       ROUND(c.AcilisBakiyesi
         + IFNULL((SELECT SUM(Miktar*BirimFiyat*(1+KdvOrani)) FROM Hareketler WHERE CariId=c.CariId AND Tip='Satış'),0)
         - IFNULL((SELECT SUM(Miktar*BirimFiyat*(1+KdvOrani)) FROM Hareketler WHERE CariId=c.CariId AND Tip='Alış'),0), 2) AS 'Bakiye',
       IFNULL((SELECT SUM(Miktar*BirimFiyat*(1+KdvOrani)) FROM Hareketler WHERE CariId=c.CariId AND Tip='Satış' AND Tahsil=0),0) AS 'Açık Alacak'
FROM Cariler c WHERE c.Aktif = 1 ORDER BY c.CariKodu");

        HideIdColumn(_gCari);
        HideIdColumn(_gUrun);
        HideIdColumn(_gHar);
        ColorStatus(_gStok, "Durum");
    }

    private static void HideIdColumn(DataGridView g)
    {
        if (g.Columns.Contains("Id")) g.Columns["Id"].Visible = false;
    }

    private static void ColorStatus(DataGridView g, string col)
    {
        if (!g.Columns.Contains(col)) return;
        foreach (DataGridViewRow r in g.Rows)
        {
            var v = r.Cells[col].Value?.ToString();
            if (v == "KRİTİK")
            {
                r.Cells[col].Style.BackColor = Color.FromArgb(254, 243, 199);
                r.Cells[col].Style.ForeColor = Color.FromArgb(133, 77, 14);
            }
            else if (v == "STOK YOK")
            {
                r.Cells[col].Style.BackColor = Color.FromArgb(254, 226, 226);
                r.Cells[col].Style.ForeColor = Theme.Danger;
            }
        }
    }

    private void LoadDashboard()
    {
        _kpiFlow.Controls.Clear();

        double satis = Db.Num("SELECT IFNULL(SUM(Miktar*BirimFiyat),0) FROM Hareketler WHERE Tip='Satış'");
        double alis = Db.Num("SELECT IFNULL(SUM(Miktar*BirimFiyat),0) FROM Hareketler WHERE Tip='Alış'");
        double kdvS = Db.Num("SELECT IFNULL(SUM(Miktar*BirimFiyat*KdvOrani),0) FROM Hareketler WHERE Tip='Satış'");
        double kdvA = Db.Num("SELECT IFNULL(SUM(Miktar*BirimFiyat*KdvOrani),0) FROM Hareketler WHERE Tip='Alış'");
        double alacak = Db.Num("SELECT IFNULL(SUM(Miktar*BirimFiyat*(1+KdvOrani)),0) FROM Hareketler WHERE Tip='Satış' AND Tahsil=0");
        double borc = Db.Num("SELECT IFNULL(SUM(Miktar*BirimFiyat*(1+KdvOrani)),0) FROM Hareketler WHERE Tip='Alış' AND Tahsil=0");
        double gecen = Db.Num(@"SELECT IFNULL(SUM(Miktar*BirimFiyat*(1+KdvOrani)),0) FROM Hareketler
                                WHERE Tahsil=0 AND VadeTarihi IS NOT NULL AND VadeTarihi < date('now')");
        double kritik = Db.Num(@"
SELECT COUNT(*) FROM Urunler u WHERE u.Aktif=1 AND
  (u.AcilisStogu
   + IFNULL((SELECT SUM(Miktar) FROM Hareketler WHERE UrunId=u.UrunId AND Tip='Alış'),0)
   - IFNULL((SELECT SUM(Miktar) FROM Hareketler WHERE UrunId=u.UrunId AND Tip='Satış'),0)) <= u.KritikStok");

        double kar = satis - alis;
        double marj = satis > 0 ? kar / satis * 100 : 0;
        double kdvNet = kdvS - kdvA;

        var boxes = new[]
        {
            Theme.KpiBox("Toplam Satış (KDV hariç)", Money(satis), "Tüm dönemler"),
            Theme.KpiBox("Toplam Alış (KDV hariç)", Money(alis), "Tüm dönemler"),
            Theme.KpiBox("Brüt Kâr", Money(kar), $"Kâr marjı {Pct(marj)}", Theme.Mint),
            Theme.KpiBox(kdvNet >= 0 ? "Ödenecek KDV" : "Devreden KDV", Money(Math.Abs(kdvNet)),
                $"Hesaplanan {Money(kdvS)}"),
            Theme.KpiBox("Tahsil Edilmemiş Alacak", Money(alacak), $"Vadesi geçen {Money(gecen)}"),
            Theme.KpiBox("Ödenmemiş Borç", Money(borc), "Tedarikçilere"),
            Theme.KpiBox("Kritik Stok", Int0(kritik) + " ürün", "Sipariş verilmeli",
                kritik > 0 ? Color.FromArgb(254, 243, 199) : null),
            Theme.KpiBox("Kayıt Sayısı", Int0(Db.Num("SELECT COUNT(*) FROM Hareketler")) + " hareket",
                Int0(Db.Num("SELECT COUNT(*) FROM Cariler")) + " cari · " +
                Int0(Db.Num("SELECT COUNT(*) FROM Urunler")) + " ürün"),
        };

        foreach (var b in boxes) _kpiFlow.Controls.Add(b);
    }

    // -----------------------------------------------------
    // CARİ
    // -----------------------------------------------------
    private static readonly string[] CariTipleri = { "Müşteri", "Tedarikçi", "Her İkisi" };
    private static readonly string[] Durumlar = { "Aktif", "Pasif" };

    private List<FieldDef> CariFields(DataRow r = null) => new()
    {
        new FieldDef { Key="kod", Label="Cari Kodu", Required=true, Value=r?["Kod"] },
        new FieldDef { Key="unvan", Label="Unvan / Ad Soyad", Required=true, Value=r?["Unvan"] },
        new FieldDef { Key="tip", Label="Tip", Kind=FieldKind.Combo, Options=CariTipleri, Value=r?["Tip"] },
        new FieldDef { Key="vno", Label="Vergi No / TCKN", Value=r?["Vergi No"] },
        new FieldDef { Key="tel", Label="Telefon", Value=r?["Telefon"] },
        new FieldDef { Key="eposta", Label="E-posta", Value=r?["E-posta"] },
        new FieldDef { Key="acilis", Label="Açılış Bakiyesi", Kind=FieldKind.Money, Value=r?["Açılış"] },
        new FieldDef { Key="durum", Label="Durum", Kind=FieldKind.Combo, Options=Durumlar, Value=r?["Durum"] },
    };

    private void CariEkle()
    {
        var d = new EditDialog("Yeni Cari", CariFields());
        if (d.ShowDialog(this) != DialogResult.OK) return;
        try
        {
            Db.Exec(@"INSERT INTO Cariler (CariKodu,Unvan,Tip,VergiNo,Telefon,Eposta,AcilisBakiyesi,Aktif)
                      VALUES ($k,$u,$t,$v,$tel,$e,$a,$ak)",
                ("$k", d.Str("kod")), ("$u", d.Str("unvan")), ("$t", d.Str("tip")),
                ("$v", d.Str("vno")), ("$tel", d.Str("tel")), ("$e", d.Str("eposta")),
                ("$a", d.Dbl("acilis")), ("$ak", d.Str("durum") == "Aktif" ? 1 : 0));
        }
        catch (Exception ex) { Hata(ex, "Bu cari kodu zaten kullanılıyor olabilir."); }
    }

    private void CariDuzenle()
    {
        var row = SelectedRow(_gCari); if (row == null) return;
        var d = new EditDialog("Cari Düzenle", CariFields(row));
        if (d.ShowDialog(this) != DialogResult.OK) return;
        try
        {
            Db.Exec(@"UPDATE Cariler SET CariKodu=$k,Unvan=$u,Tip=$t,VergiNo=$v,Telefon=$tel,
                      Eposta=$e,AcilisBakiyesi=$a,Aktif=$ak WHERE CariId=$id",
                ("$k", d.Str("kod")), ("$u", d.Str("unvan")), ("$t", d.Str("tip")),
                ("$v", d.Str("vno")), ("$tel", d.Str("tel")), ("$e", d.Str("eposta")),
                ("$a", d.Dbl("acilis")), ("$ak", d.Str("durum") == "Aktif" ? 1 : 0),
                ("$id", row["Id"]));
        }
        catch (Exception ex) { Hata(ex, "Güncelleme yapılamadı."); }
    }

    private void CariSil()
    {
        var row = SelectedRow(_gCari); if (row == null) return;
        if (!Onay($"'{row["Unvan"]}' carisi silinsin mi?")) return;
        try { Db.Exec("DELETE FROM Cariler WHERE CariId=$id", ("$id", row["Id"])); }
        catch (Exception ex) { Hata(ex, "Bu cariye bağlı hareketler var. Önce hareketleri silin veya cariyi Pasif yapın."); }
    }

    // -----------------------------------------------------
    // ÜRÜN
    // -----------------------------------------------------
    private List<FieldDef> UrunFields(DataRow r = null) => new()
    {
        new FieldDef { Key="kod", Label="Ürün Kodu", Required=true, Value=r?["Kod"] },
        new FieldDef { Key="ad", Label="Ürün / Hizmet Adı", Required=true, Value=r?["Ürün"] },
        new FieldDef { Key="birim", Label="Birim", Kind=FieldKind.Combo,
                       Options=new[]{"Adet","Kg","Lt","Metre","Paket","Kutu","Saat","Ay"}, Value=r?["Birim"] },
        new FieldDef { Key="alis", Label="Alış Fiyatı", Kind=FieldKind.Money, Value=r?["Alış"] },
        new FieldDef { Key="satis", Label="Satış Fiyatı", Kind=FieldKind.Money, Value=r?["Satış"] },
        new FieldDef { Key="kdv", Label="KDV Oranı (0,20 = %20)", Kind=FieldKind.Number, Value=r?["KDV"] },
        new FieldDef { Key="acilis", Label="Açılış Stoğu", Kind=FieldKind.Number, Value=r?["Açılış Stok"] },
        new FieldDef { Key="kritik", Label="Kritik Stok", Kind=FieldKind.Number, Value=r?["Kritik"] },
        new FieldDef { Key="durum", Label="Durum", Kind=FieldKind.Combo, Options=Durumlar, Value=r?["Durum"] },
    };

    private void UrunEkle()
    {
        var d = new EditDialog("Yeni Ürün", UrunFields());
        if (d.ShowDialog(this) != DialogResult.OK) return;
        try
        {
            Db.Exec(@"INSERT INTO Urunler (UrunKodu,UrunAdi,Birim,AlisFiyati,SatisFiyati,KdvOrani,AcilisStogu,KritikStok,Aktif)
                      VALUES ($k,$a,$b,$al,$s,$kdv,$ac,$kr,$ak)",
                ("$k", d.Str("kod")), ("$a", d.Str("ad")), ("$b", d.Str("birim")),
                ("$al", d.Dbl("alis")), ("$s", d.Dbl("satis")), ("$kdv", d.Dbl("kdv")),
                ("$ac", d.Dbl("acilis")), ("$kr", d.Dbl("kritik")),
                ("$ak", d.Str("durum") == "Aktif" ? 1 : 0));
        }
        catch (Exception ex) { Hata(ex, "Bu ürün kodu zaten kullanılıyor olabilir."); }
    }

    private void UrunDuzenle()
    {
        var row = SelectedRow(_gUrun); if (row == null) return;
        var d = new EditDialog("Ürün Düzenle", UrunFields(row));
        if (d.ShowDialog(this) != DialogResult.OK) return;
        try
        {
            Db.Exec(@"UPDATE Urunler SET UrunKodu=$k,UrunAdi=$a,Birim=$b,AlisFiyati=$al,
                      SatisFiyati=$s,KdvOrani=$kdv,AcilisStogu=$ac,KritikStok=$kr,Aktif=$ak WHERE UrunId=$id",
                ("$k", d.Str("kod")), ("$a", d.Str("ad")), ("$b", d.Str("birim")),
                ("$al", d.Dbl("alis")), ("$s", d.Dbl("satis")), ("$kdv", d.Dbl("kdv")),
                ("$ac", d.Dbl("acilis")), ("$kr", d.Dbl("kritik")),
                ("$ak", d.Str("durum") == "Aktif" ? 1 : 0), ("$id", row["Id"]));
        }
        catch (Exception ex) { Hata(ex, "Güncelleme yapılamadı."); }
    }

    private void UrunSil()
    {
        var row = SelectedRow(_gUrun); if (row == null) return;
        if (!Onay($"'{row["Ürün"]}' ürünü silinsin mi?")) return;
        try { Db.Exec("DELETE FROM Urunler WHERE UrunId=$id", ("$id", row["Id"])); }
        catch (Exception ex) { Hata(ex, "Bu ürüne bağlı hareketler var. Önce hareketleri silin veya ürünü Pasif yapın."); }
    }

    // -----------------------------------------------------
    // HAREKET
    // -----------------------------------------------------
    private string[] CariSecenekleri() =>
        Db.Table("SELECT CariKodu || ' - ' || Unvan AS s FROM Cariler WHERE Aktif=1 ORDER BY CariKodu")
          .Rows.Cast<DataRow>().Select(r => r["s"].ToString()).ToArray();

    private string[] UrunSecenekleri() =>
        Db.Table("SELECT UrunKodu || ' - ' || UrunAdi AS s FROM Urunler WHERE Aktif=1 ORDER BY UrunKodu")
          .Rows.Cast<DataRow>().Select(r => r["s"].ToString()).ToArray();

    private static int IdFromLabel(string label) => 0; // kod ayrıştırma aşağıda yapılır

    private List<FieldDef> HareketFields(DataRow r = null)
    {
        var cariler = CariSecenekleri();
        var urunler = UrunSecenekleri();

        string cariSec = null, urunSec = null;
        if (r != null)
        {
            cariSec = cariler.FirstOrDefault(x => x.EndsWith(" - " + r["Cari"]));
            urunSec = urunler.FirstOrDefault(x => x.EndsWith(" - " + r["Ürün"]));
        }

        return new List<FieldDef>
        {
            new FieldDef { Key="tarih", Label="Tarih", Kind=FieldKind.Date, Value=r?["Tarih"] },
            new FieldDef { Key="tip", Label="Hareket Tipi", Kind=FieldKind.Combo,
                           Options=new[]{"Satış","Alış"}, Value=r?["Tip"] },
            new FieldDef { Key="cari", Label="Cari", Kind=FieldKind.Combo, Options=cariler, Value=cariSec },
            new FieldDef { Key="urun", Label="Ürün", Kind=FieldKind.Combo, Options=urunler, Value=urunSec },
            new FieldDef { Key="miktar", Label="Miktar", Kind=FieldKind.Number, Required=true, Value=r?["Miktar"] },
            new FieldDef { Key="fiyat", Label="Birim Fiyat", Kind=FieldKind.Money, Required=true, Value=r?["Birim Fiyat"] },
            new FieldDef { Key="kdv", Label="KDV Oranı (0,20 = %20)", Kind=FieldKind.Number, Value=r == null ? 0.20 : null },
            new FieldDef { Key="odeme", Label="Ödeme Yöntemi", Kind=FieldKind.Combo,
                           Options=new[]{"Banka","Nakit","Kredi Kartı","Çek","Senet","Açık Hesap"} },
            new FieldDef { Key="belgeturu", Label="Belge Türü", Kind=FieldKind.Combo,
                           Options=new[]{"Fatura","e-Fatura","e-Arşiv Fatura","İrsaliye","Fiş","Dekont","Diğer"} },
            new FieldDef { Key="belgeno", Label="Belge No", Value=r?["Belge No"] },
            new FieldDef { Key="vade", Label="Vade Tarihi", Kind=FieldKind.Date, Value=r?["Vade"] },
            new FieldDef { Key="tahsil", Label="Tahsil / Ödeme yapıldı", Kind=FieldKind.Bool,
                           Value=r != null && r["Durum"].ToString() == "Tamam" ? 1 : 0 },
        };
    }

    private static int CariIdOf(string label)
    {
        if (string.IsNullOrWhiteSpace(label)) return 0;
        var kod = label.Split(" - ")[0];
        var o = Db.Scalar("SELECT CariId FROM Cariler WHERE CariKodu=$k", ("$k", kod));
        return o == null || o == DBNull.Value ? 0 : Convert.ToInt32(o);
    }

    private static int UrunIdOf(string label)
    {
        if (string.IsNullOrWhiteSpace(label)) return 0;
        var kod = label.Split(" - ")[0];
        var o = Db.Scalar("SELECT UrunId FROM Urunler WHERE UrunKodu=$k", ("$k", kod));
        return o == null || o == DBNull.Value ? 0 : Convert.ToInt32(o);
    }

    private void HareketEkle()
    {
        var d = new EditDialog("Yeni Hareket", HareketFields());
        if (d.ShowDialog(this) != DialogResult.OK) return;
        try
        {
            Db.Exec(@"INSERT INTO Hareketler (Tarih,Tip,CariId,UrunId,Miktar,BirimFiyat,KdvOrani,
                      Odeme,BelgeTuru,BelgeNo,VadeTarihi,Tahsil,Aciklama)
                      VALUES ($t,$tip,$c,$u,$m,$f,$kdv,$o,$bt,$bn,$v,$th,'')",
                ("$t", d.Str("tarih")), ("$tip", d.Str("tip")),
                ("$c", CariIdOf(d.Str("cari"))), ("$u", UrunIdOf(d.Str("urun"))),
                ("$m", d.Dbl("miktar")), ("$f", d.Dbl("fiyat")), ("$kdv", d.Dbl("kdv")),
                ("$o", d.Str("odeme")), ("$bt", d.Str("belgeturu")), ("$bn", d.Str("belgeno")),
                ("$v", d.Str("vade")), ("$th", d.Get("tahsil")));
        }
        catch (Exception ex) { Hata(ex, "Hareket kaydedilemedi."); }
    }

    private void HareketDuzenle()
    {
        var row = SelectedRow(_gHar); if (row == null) return;
        var d = new EditDialog("Hareket Düzenle", HareketFields(row));
        if (d.ShowDialog(this) != DialogResult.OK) return;
        try
        {
            Db.Exec(@"UPDATE Hareketler SET Tarih=$t,Tip=$tip,CariId=$c,UrunId=$u,Miktar=$m,
                      BirimFiyat=$f,KdvOrani=$kdv,Odeme=$o,BelgeTuru=$bt,BelgeNo=$bn,
                      VadeTarihi=$v,Tahsil=$th WHERE HareketId=$id",
                ("$t", d.Str("tarih")), ("$tip", d.Str("tip")),
                ("$c", CariIdOf(d.Str("cari"))), ("$u", UrunIdOf(d.Str("urun"))),
                ("$m", d.Dbl("miktar")), ("$f", d.Dbl("fiyat")), ("$kdv", d.Dbl("kdv")),
                ("$o", d.Str("odeme")), ("$bt", d.Str("belgeturu")), ("$bn", d.Str("belgeno")),
                ("$v", d.Str("vade")), ("$th", d.Get("tahsil")), ("$id", row["Id"]));
        }
        catch (Exception ex) { Hata(ex, "Güncelleme yapılamadı."); }
    }

    private void HareketSil()
    {
        var row = SelectedRow(_gHar); if (row == null) return;
        if (!Onay("Seçili hareket silinsin mi?")) return;
        Db.Exec("DELETE FROM Hareketler WHERE HareketId=$id", ("$id", row["Id"]));
    }

    // -----------------------------------------------------
    // DIŞA AKTARIM
    // -----------------------------------------------------
    private void ExportCsv()
    {
        using var sfd = new SaveFileDialog
        {
            Filter = "CSV dosyası (*.csv)|*.csv",
            FileName = $"minihesap-hareketler-{DateTime.Today:yyyy-MM-dd}.csv",
        };
        if (sfd.ShowDialog(this) != DialogResult.OK) return;

        var dt = (DataTable)_gHar.DataSource;
        var sb = new System.Text.StringBuilder();

        var cols = dt.Columns.Cast<DataColumn>().Where(c => c.ColumnName != "Id").ToList();
        sb.AppendLine(string.Join(";", cols.Select(c => Quote(c.ColumnName))));

        foreach (DataRow r in dt.Rows)
            sb.AppendLine(string.Join(";", cols.Select(c => Quote(r[c].ToString()))));

        // BOM, Excel'in Türkçe karakterleri doğru açması için
        File.WriteAllText(sfd.FileName, sb.ToString(), new System.Text.UTF8Encoding(true));

        MessageBox.Show("Dışa aktarım tamamlandı.", "MiniHesap",
            MessageBoxButtons.OK, MessageBoxIcon.Information);
    }

    private static string Quote(string s) => "\"" + (s ?? "").Replace("\"", "\"\"") + "\"";

    // -----------------------------------------------------
    // YARDIMCI
    // -----------------------------------------------------
    private DataRow SelectedRow(DataGridView g)
    {
        if (g.CurrentRow == null || g.CurrentRow.Index < 0)
        {
            MessageBox.Show("Önce listeden bir satır seçin.", "MiniHesap",
                MessageBoxButtons.OK, MessageBoxIcon.Information);
            return null;
        }
        return ((DataRowView)g.CurrentRow.DataBoundItem).Row;
    }

    private static bool Onay(string msg) =>
        MessageBox.Show(msg, "Onay", MessageBoxButtons.YesNo, MessageBoxIcon.Question)
            == DialogResult.Yes;

    private static void Hata(Exception ex, string ipucu)
    {
        MessageBox.Show($"{ipucu}\n\nAyrıntı: {ex.Message}", "İşlem tamamlanamadı",
            MessageBoxButtons.OK, MessageBoxIcon.Warning);
    }
}

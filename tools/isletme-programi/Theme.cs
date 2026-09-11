using System.Drawing;
using System.Windows.Forms;

namespace MiniHesap;

/// <summary>Site ile aynı görsel dili kullanan ortak stiller.</summary>
public static class Theme
{
    public static readonly Color Brand = Color.FromArgb(22, 163, 74);
    public static readonly Color BrandDark = Color.FromArgb(21, 128, 61);
    public static readonly Color BrandDeep = Color.FromArgb(22, 101, 52);
    public static readonly Color Mint = Color.FromArgb(240, 253, 244);
    public static readonly Color Bg = Color.FromArgb(244, 250, 246);
    public static readonly Color Surface = Color.White;
    public static readonly Color Line = Color.FromArgb(220, 231, 223);
    public static readonly Color Ink = Color.FromArgb(16, 35, 26);
    public static readonly Color Muted = Color.FromArgb(97, 112, 102);
    public static readonly Color Danger = Color.FromArgb(185, 28, 28);
    public static readonly Color Amber = Color.FromArgb(245, 158, 11);

    public static readonly Font H1 = new("Segoe UI", 16F, FontStyle.Bold);
    public static readonly Font H2 = new("Segoe UI", 11F, FontStyle.Bold);
    public static readonly Font Body = new("Segoe UI", 9.5F);
    public static readonly Font Kpi = new("Segoe UI", 17F, FontStyle.Bold);
    public static readonly Font Small = new("Segoe UI", 8F);

    public static Button PrimaryButton(string text)
    {
        var b = new Button
        {
            Text = text,
            BackColor = Brand,
            ForeColor = Color.White,
            FlatStyle = FlatStyle.Flat,
            Font = new Font("Segoe UI", 9.5F, FontStyle.Bold),
            Height = 34,
            Padding = new Padding(10, 0, 10, 0),
            AutoSize = true,
            AutoSizeMode = AutoSizeMode.GrowAndShrink,
            Cursor = Cursors.Hand,
        };
        b.FlatAppearance.BorderSize = 0;
        b.FlatAppearance.MouseOverBackColor = BrandDark;
        return b;
    }

    public static Button GhostButton(string text)
    {
        var b = new Button
        {
            Text = text,
            BackColor = Color.White,
            ForeColor = Ink,
            FlatStyle = FlatStyle.Flat,
            Font = new Font("Segoe UI", 9.5F),
            Height = 34,
            Padding = new Padding(10, 0, 10, 0),
            AutoSize = true,
            AutoSizeMode = AutoSizeMode.GrowAndShrink,
            Cursor = Cursors.Hand,
        };
        b.FlatAppearance.BorderColor = Line;
        b.FlatAppearance.MouseOverBackColor = Mint;
        return b;
    }

    public static void StyleGrid(DataGridView g)
    {
        g.BackgroundColor = Surface;
        g.BorderStyle = BorderStyle.None;
        g.CellBorderStyle = DataGridViewCellBorderStyle.SingleHorizontal;
        g.EnableHeadersVisualStyles = false;
        g.ColumnHeadersDefaultCellStyle.BackColor = BrandDeep;
        g.ColumnHeadersDefaultCellStyle.ForeColor = Color.White;
        g.ColumnHeadersDefaultCellStyle.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
        g.ColumnHeadersDefaultCellStyle.Padding = new Padding(6, 6, 6, 6);
        g.ColumnHeadersHeight = 34;
        g.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.DisableResizing;
        g.RowHeadersVisible = false;
        g.AllowUserToAddRows = false;
        g.AllowUserToDeleteRows = false;
        g.ReadOnly = true;
        g.SelectionMode = DataGridViewSelectionMode.FullRowSelect;
        g.MultiSelect = false;
        g.AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill;
        g.DefaultCellStyle.Font = Body;
        g.DefaultCellStyle.SelectionBackColor = Mint;
        g.DefaultCellStyle.SelectionForeColor = Ink;
        g.DefaultCellStyle.Padding = new Padding(4, 3, 4, 3);
        g.AlternatingRowsDefaultCellStyle.BackColor = Color.FromArgb(250, 252, 251);
        g.RowTemplate.Height = 30;
        g.GridColor = Line;
        g.Dock = DockStyle.Fill;
    }

    /// <summary>Dashboard için tek KPI kutusu üretir.</summary>
    public static Panel KpiBox(string label, string value, string note, Color? accent = null)
    {
        var p = new Panel
        {
            BackColor = accent ?? Color.FromArgb(248, 250, 249),
            Padding = new Padding(14, 10, 14, 10),
            Margin = new Padding(6),
            Width = 232,
            Height = 92,
        };
        p.Paint += (s, e) =>
        {
            using var pen = new Pen(Line);
            e.Graphics.DrawRectangle(pen, 0, 0, p.Width - 1, p.Height - 1);
        };

        var l = new Label
        {
            Text = label.ToUpperInvariant(),
            Font = Small,
            ForeColor = Muted,
            Dock = DockStyle.Top,
            Height = 18,
        };
        var v = new Label
        {
            Text = value,
            Font = Kpi,
            ForeColor = BrandDeep,
            Dock = DockStyle.Top,
            Height = 34,
        };
        var n = new Label
        {
            Text = note,
            Font = Small,
            ForeColor = Muted,
            Dock = DockStyle.Top,
            Height = 20,
        };

        p.Controls.Add(n);
        p.Controls.Add(v);
        p.Controls.Add(l);
        return p;
    }
}

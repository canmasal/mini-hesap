using System.Drawing;
using System.Windows.Forms;

namespace MiniHesap;

public enum FieldKind { Text, Number, Money, Percent, Date, Combo, Bool }

public class FieldDef
{
    public string Key = "";
    public string Label = "";
    public FieldKind Kind = FieldKind.Text;
    public object Value;
    public string[] Options = Array.Empty<string>();
    public bool Required;
}

/// <summary>Kayıt ekleme / düzenleme için genel amaçlı diyalog.</summary>
public class EditDialog : Form
{
    private readonly List<FieldDef> _fields;
    private readonly Dictionary<string, Control> _controls = new();

    public EditDialog(string title, List<FieldDef> fields)
    {
        _fields = fields;

        Text = title;
        StartPosition = FormStartPosition.CenterParent;
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;
        MinimizeBox = false;
        BackColor = Theme.Surface;
        Font = Theme.Body;
        Padding = new Padding(18);
        AutoScaleMode = AutoScaleMode.Dpi;

        var layout = new TableLayoutPanel
        {
            Dock = DockStyle.Top,
            ColumnCount = 2,
            AutoSize = true,
            AutoSizeMode = AutoSizeMode.GrowAndShrink,
        };
        layout.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 170));
        layout.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 260));

        foreach (var f in fields)
        {
            var lbl = new Label
            {
                Text = f.Required ? f.Label + " *" : f.Label,
                Font = Theme.Body,
                ForeColor = Theme.Ink,
                TextAlign = ContentAlignment.MiddleLeft,
                Dock = DockStyle.Fill,
                Height = 30,
            };

            Control ctl = f.Kind switch
            {
                FieldKind.Combo => MakeCombo(f),
                FieldKind.Date => MakeDate(f),
                FieldKind.Bool => MakeCheck(f),
                _ => MakeText(f),
            };

            ctl.Width = 250;
            ctl.Margin = new Padding(0, 3, 0, 3);
            _controls[f.Key] = ctl;

            layout.Controls.Add(lbl);
            layout.Controls.Add(ctl);
        }

        var buttons = new FlowLayoutPanel
        {
            Dock = DockStyle.Bottom,
            FlowDirection = FlowDirection.RightToLeft,
            Height = 52,
            Padding = new Padding(0, 10, 0, 0),
        };

        var ok = Theme.PrimaryButton("Kaydet");
        ok.Click += (s, e) =>
        {
            foreach (var f in _fields)
            {
                if (!f.Required) continue;
                var v = Get(f.Key);
                if (v == null || string.IsNullOrWhiteSpace(v.ToString()))
                {
                    MessageBox.Show($"{f.Label} alanı zorunludur.", "Eksik bilgi",
                        MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    _controls[f.Key].Focus();
                    return;
                }
            }
            DialogResult = DialogResult.OK;
            Close();
        };

        var cancel = Theme.GhostButton("Vazgeç");
        cancel.Click += (s, e) => { DialogResult = DialogResult.Cancel; Close(); };

        buttons.Controls.Add(ok);
        buttons.Controls.Add(cancel);

        Controls.Add(buttons);
        Controls.Add(layout);

        ClientSize = new Size(470, layout.PreferredSize.Height + 96);
    }

    private Control MakeText(FieldDef f)
    {
        var t = new TextBox
        {
            Text = f.Value?.ToString() ?? "",
            BorderStyle = BorderStyle.FixedSingle,
        };
        if (f.Kind is FieldKind.Number or FieldKind.Money or FieldKind.Percent)
            t.TextAlign = HorizontalAlignment.Right;
        return t;
    }

    private Control MakeCombo(FieldDef f)
    {
        var c = new ComboBox
        {
            DropDownStyle = ComboBoxStyle.DropDownList,
            FlatStyle = FlatStyle.Flat,
        };
        c.Items.AddRange(f.Options);
        var v = f.Value?.ToString();
        c.SelectedIndex = v != null ? Math.Max(c.Items.IndexOf(v), 0) : 0;
        return c;
    }

    private Control MakeDate(FieldDef f)
    {
        var d = new DateTimePicker { Format = DateTimePickerFormat.Short };
        if (f.Value is DateTime dt) d.Value = dt;
        else if (DateTime.TryParse(f.Value?.ToString(), out var p)) d.Value = p;
        return d;
    }

    private Control MakeCheck(FieldDef f)
    {
        var b = f.Value != null && (f.Value.ToString() == "1" || f.Value.ToString().ToLower() == "true");
        return new CheckBox { Checked = b, Text = "", Height = 26 };
    }

    public object Get(string key)
    {
        var c = _controls[key];
        return c switch
        {
            ComboBox cb => cb.SelectedItem?.ToString(),
            DateTimePicker dp => dp.Value.ToString("yyyy-MM-dd"),
            CheckBox ck => ck.Checked ? 1 : 0,
            TextBox tb => tb.Text,
            _ => null,
        };
    }

    public string Str(string key) => Get(key)?.ToString() ?? "";

    public double Dbl(string key)
    {
        var s = Str(key).Replace(".", "").Replace(",", ".");
        return double.TryParse(s, System.Globalization.NumberStyles.Any,
            System.Globalization.CultureInfo.InvariantCulture, out var d) ? d : 0;
    }

    public int Int(string key) => (int)Dbl(key);
}

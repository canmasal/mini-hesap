using System.Globalization;
using System.Windows.Forms;

namespace MiniHesap;

internal static class Program
{
    [STAThread]
    private static void Main()
    {
        var tr = new CultureInfo("tr-TR");
        CultureInfo.DefaultThreadCurrentCulture = tr;
        CultureInfo.DefaultThreadCurrentUICulture = tr;
        Thread.CurrentThread.CurrentCulture = tr;

        ApplicationConfiguration.Initialize();

        try
        {
            // Veritabani programin yaninda durur: tasinabilir, kurulum gerektirmez.
            var folder = AppContext.BaseDirectory;
            Db.Initialize(folder);
        }
        catch (Exception ex)
        {
            MessageBox.Show(
                "Veritabanı açılamadı.\n\n" + ex.Message,
                "MiniHesap İşletme",
                MessageBoxButtons.OK, MessageBoxIcon.Error);
            return;
        }

        Application.Run(new MainForm());
    }
}

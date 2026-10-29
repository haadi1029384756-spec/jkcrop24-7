using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Windows.Forms;

internal static class Launcher
{
    [STAThread]
    private static void Main()
    {
        try
        {
            string appFolder = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "JKCrop247");
            Directory.CreateDirectory(appFolder);
            Extract("index.html", appFolder);
            Extract("styles.css", appFolder);
            Extract("app.js", appFolder);

            string page = Path.Combine(appFolder, "index.html");
            string browserData = Path.Combine(appFolder, "BrowserData");
            Directory.CreateDirectory(browserData);
            string edge = FindEdge();
            string pageUrl = new Uri(page).AbsoluteUri;

            if (!String.IsNullOrEmpty(edge))
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = edge,
                    Arguments = "--app=\"" + pageUrl + "\" --user-data-dir=\"" + browserData + "\"",
                    UseShellExecute = false
                });
            }
            else
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = page,
                    UseShellExecute = true
                });
            }
        }
        catch (Exception error)
        {
            MessageBox.Show(
                "JKCrop 24/7 could not start.\r\n\r\n" + error.Message,
                "JKCrop 24/7",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error);
        }
    }

    private static void Extract(string resourceName, string folder)
    {
        using (Stream input = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName))
        {
            if (input == null) throw new InvalidOperationException("App resource is missing: " + resourceName);
            using (FileStream output = File.Create(Path.Combine(folder, resourceName)))
            {
                input.CopyTo(output);
            }
        }
    }

    private static string FindEdge()
    {
        string[] candidates = new string[]
        {
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Microsoft", "Edge", "Application", "msedge.exe"),
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Microsoft", "Edge", "Application", "msedge.exe"),
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Microsoft", "Edge", "Application", "msedge.exe")
        };
        foreach (string candidate in candidates)
        {
            if (File.Exists(candidate)) return candidate;
        }
        return null;
    }
}

# JKCrop 24/7

A Windows/browser prototype for crop-health reporting and farmer support in Jammu & Kashmir.

## Try the Windows app

Run `frontend/dist/JKCrop247.exe`. The app opens in a Microsoft Edge app window. On first launch, it extracts its web files to `%LOCALAPPDATA%\JKCrop247`.

## Run from source

1. Install Node.js.
2. Open a terminal in `frontend`.
3. Run `node server.js`.
4. Open <http://localhost:4173>.

The prototype has account creation and sign-in, crop reports, crop guides, a sample farm assistant, and local alerts. Accounts and app data are stored on the current device; signup is not connected to the PostgreSQL backend.

## Rebuild the Windows executable

On Windows, open PowerShell in `frontend` and run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\desktop-app\build.ps1
```

The executable is written to `frontend/dist/JKCrop247.exe`. The project source is intended to be committed to Git; the generated executable can be shared separately or attached to a GitHub Release.

## Project folders

- `frontend/` — browser app and Windows launcher source
- `backend/` — initial API draft
- `database/schema.sql` — PostgreSQL schema draft
- `docs/setup_guide.txt` — local setup and demo instructions

Do not commit `backend/.env`; it is excluded by `.gitignore`.

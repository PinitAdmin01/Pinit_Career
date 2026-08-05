# KittenTTS Server Deployment Guide (Option A)

This folder contains the files needed to fix the **500 Internal Server Error** on your Render server by deploying the official `kittentts` library wrapper.

## 🛠️ What to do

1. Open your private repository `Vinay-N-kashyapa/kitten` on GitHub or clone it locally.
2. Replace your existing `main.py` with [main.py](main.py).
3. Replace your existing `requirements.txt` with [requirements.txt](requirements.txt).
4. Commit and push the changes:
   ```bash
   git add main.py requirements.txt
   git commit -m "Configure official KittenTTS model and fix input parameters"
   git push origin main
   ```
5. Render will automatically redeploy.

## ⚙️ Render Service Settings

Verify these settings in your Render Dashboard under **kitten** -> **Settings**:

*   **Build Command:** `pip install -r requirements.txt` (Render does this by default if it detects `requirements.txt`).
*   **Start Command:** `python main.py` or `uvicorn main:app --host 0.0.0.0 --port $PORT`

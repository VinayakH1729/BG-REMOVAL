# BG-REMOVAL

Full-stack background removal app (React + Vite client, Express + MongoDB server) with Clerk auth.

## Prerequisites
- Node.js 18+
- A MongoDB connection string in `Server/.env` as `MONGODB_URI`
- Background removal options:
  - Free (local): rembg CLI (U^2-Net). Requires Python and `pip install rembg`.
  - Hosted APIs:
    - Hugging Face Inference API (set `HUGGINGFACE_TOKEN`, optional `HUGGINGFACE_MODEL`, default `briaai/RMBG-1.4`)
  - Preferred: `CLIPDROP_API_KEY` (https://clipdrop.co/apis/remove-background)
  - Or: `REMOVE_BG_API_KEY` (https://www.remove.bg/api)
- Clerk publishable key for the client: `VITE_CLERK_PUBLISHABLE_KEY`

## Environment
Create `Server/.env`:
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net
# Choose ONE approach below:

# 1) Free local model (requires Python and rembg)
# Enable free mode:
# REMBG_CLI=1
# Optional: set full path if rembg is not in PATH
# REMBG_PATH=C:\\Users\\you\\AppData\\Roaming\\Python\\Python312\\Scripts\\rembg.exe

# 2) Paid provider (ClipDrop or remove.bg)
# CLIPDROP_API_KEY=your_clipdrop_key
# or
# REMOVE_BG_API_KEY=your_removebg_key

# 3) Hugging Face (hosted)
# HUGGINGFACE_TOKEN=hf_your_token
# HUGGINGFACE_MODEL=briaai/RMBG-1.4
PORT=4000
CLERK_WEBHOOK_SECRET=whsec_...        # optional, only if using Clerk webhooks
VERCEL=0
```

Create `client/.env`:
```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_or_test_...
# Optionally point directly to a remote API base
# VITE_API_BASE_URL=https://your-server.example.com
```

## Run locally
Terminal 1 (API):
```
cd Server
npm install
node server.js
```

Terminal 2 (client):
```
cd client
npm install
npm run dev
```

Open http://localhost:5173 and upload an image. The client calls `/api/image/remove-bg` which the Vite proxy forwards to `http://localhost:4000`.

## Notes
- Webhooks: We set `express.raw` for the `/api/user/webhooks` route so Svix verification works. Ensure your deploy supports raw body on that route.
- Provider selection:
  - If `REMBG_CLI=1` (or `REMBG_PATH` provided), the server uses rembg locally (free).
  - Else, if `HUGGINGFACE_TOKEN` is set, we call Hugging Face Inference API (defaults to `briaai/RMBG-1.4`).
  - Else, if `CLIPDROP_API_KEY` is set, we use ClipDrop.
  - Else, if `REMOVE_BG_API_KEY` is set, we use remove.bg.

### Hugging Face notes
- Some models cold-start; the first request can return a JSON message like "loading". We surface that with 503 and the returned text.
- You can try different models, e.g., `briaai/RMBG-1.4`, `hustvl/anybg`, or `skytnt/anime-remove-background`. Ensure they accept image bytes and output an image.
- Limits: Uploads are limited to 10MB via `multer`.
- Deployment: `Server/vercel.json` is provided; ensure env vars are set in your hosting provider.

### Installing rembg on Windows (free mode)
1. Install Python 3.11+ from Microsoft Store or python.org.
2. In PowerShell:
```
pip install --upgrade pip
pip install rembg
```
3. Ensure the rembg script is on PATH. If not, find rembg.exe (often under `%AppData%\Python\Python3xx\Scripts`) and set `REMBG_PATH` in `Server/.env` to that full path.
4. Set `REMBG_CLI=1` in `Server/.env` and restart the server.

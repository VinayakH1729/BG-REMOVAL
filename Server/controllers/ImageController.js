import axios from "axios";
import FormData from "form-data";
import { spawn } from "child_process";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import crypto from "crypto";

// Remove background using ClipDrop API
// POST /api/image/remove-bg
// multipart/form-data with field: image
export const removeBackground = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

  const clipdropKey = process.env.CLIPDROP_API_KEY;
  const removebgKey = process.env.REMOVE_BG_API_KEY;
  const hfToken = process.env.HUGGINGFACE_TOKEN;
  const hfModel = process.env.HUGGINGFACE_MODEL || "briaai/RMBG-1.4";
    const useRembgCli = process.env.REMBG_CLI === "1" || !!process.env.REMBG_PATH;

    // Path 1: Free local processing via rembg CLI (U^2-Net). Requires Python + `pip install rembg`.
    if (useRembgCli) {
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "bg-"));
      const inExt = ".png"; // ensure consistent output transparency handling
      const inPath = path.join(tmpDir, `${crypto.randomUUID()}-in${inExt}`);
      const outPath = path.join(tmpDir, `${crypto.randomUUID()}-out.png`);

      try {
        await fs.writeFile(inPath, req.file.buffer);
        const cmd = process.env.REMBG_PATH || "rembg"; // if not in PATH, set REMBG_PATH to full executable path
        const args = ["i", inPath, outPath];

        const exitCode = await new Promise((resolve, reject) => {
          const child = spawn(cmd, args, { stdio: ["ignore", "inherit", "inherit"] });
          child.on("error", reject);
          child.on("close", resolve);
        });

        if (exitCode !== 0) {
          throw new Error(`rembg exited with code ${exitCode}`);
        }

        const outBuf = await fs.readFile(outPath);
        const base64 = outBuf.toString("base64");
        const dataUrl = `data:image/png;base64,${base64}`;
        return res.json({ success: true, image: dataUrl, provider: "rembg-cli" });
      } catch (e) {
        // If rembg fails, surface error. We will not silently fall back to paid providers unless keys are set.
        return res.status(500).json({ success: false, message: e.message || "rembg processing failed" });
      } finally {
        // best-effort cleanup
        try { await fs.rm(tmpDir, { recursive: true, force: true }); } catch {}
      }
    }

    // Path 2: Hosted providers (requires keys): Hugging Face (if token), then ClipDrop, then remove.bg
    if (!hfToken && !clipdropKey && !removebgKey) {
      return res.status(500).json({
        success: false,
        message: "Missing background removal provider. Set HUGGINGFACE_TOKEN (with HUGGINGFACE_MODEL), CLIPDROP_API_KEY, or REMOVE_BG_API_KEY in the server environment, or enable free mode with REMBG_CLI=1 and install rembg.",
      });
    }

    let response;
    if (hfToken) {
      // Hugging Face Inference API path
      // Sends raw image bytes, expects image/png (some models may return other image types)
      response = await axios.post(
        `https://api-inference.huggingface.co/models/${encodeURIComponent(hfModel)}`,
        req.file.buffer,
        {
          headers: {
            Authorization: `Bearer ${hfToken}`,
            "Content-Type": "application/octet-stream",
            Accept: "image/png",
          },
          responseType: "arraybuffer",
          // HF free tier can be slow to warm a model; give generous timeout
          timeout: 120000,
        }
      );
    } else if (clipdropKey) {
      // ClipDrop path
      const form = new FormData();
      form.append("image_file", req.file.buffer, {
        filename: req.file.originalname || "upload.jpg",
        contentType: req.file.mimetype || "image/jpeg",
      });
      form.append("format", "png");

      response = await axios.post(
        "https://clipdrop-api.co/remove-background/v1",
        form,
        {
          headers: {
            ...form.getHeaders(),
            "x-api-key": clipdropKey,
          },
          responseType: "arraybuffer",
          timeout: 60000,
        }
      );
    } else {
      // remove.bg path
      const form = new FormData();
      form.append("image_file", req.file.buffer, {
        filename: req.file.originalname || "upload.jpg",
        contentType: req.file.mimetype || "image/jpeg",
      });
      form.append("size", "auto");
      form.append("format", "png");

      response = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        form,
        {
          headers: {
            ...form.getHeaders(),
            "X-Api-Key": removebgKey,
          },
          responseType: "arraybuffer",
          timeout: 60000,
        }
      );
    }

    // Some HF responses might return JSON if the model is loading or an error occurred.
    let contentType = response.headers["content-type"] || "image/png";
    if (contentType.includes("application/json")) {
      const text = Buffer.from(response.data).toString("utf8");
      return res.status(503).json({ success: false, message: `Provider returned JSON: ${text.slice(0, 300)}` });
    }
    const base64 = Buffer.from(response.data).toString("base64");
    const dataUrl = `data:${contentType};base64,${base64}`;

    return res.json({ success: true, image: dataUrl });
  } catch (err) {
    // Try to parse provider error
    let providerError = "";
    try {
      if (err.response && err.response.data) {
        const text = Buffer.isBuffer(err.response.data)
          ? err.response.data.toString()
          : String(err.response.data);
        providerError = text.slice(0, 500);
      }
    } catch {}

    return res.status(500).json({
      success: false,
      message: err.message || "Failed to remove background",
      providerError,
    });
  }
};

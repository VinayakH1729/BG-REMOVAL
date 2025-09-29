import axios from "axios";
import FormData from "form-data";

// Remove background using remove.bg API
// POST /api/image/remove-bg
// multipart/form-data with field: image
export const removeBackground = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const removebgKey = process.env.REMOVE_BG_API_KEY;
    
    if (!removebgKey) {
      return res.status(500).json({
        success: false,
        message: "Missing REMOVE_BG_API_KEY in server environment"
      });
    }

    const form = new FormData();
    form.append("image_file", req.file.buffer, {
      filename: req.file.originalname || "upload.jpg",
      contentType: req.file.mimetype || "image/jpeg",
    });
    form.append("size", "auto");
    form.append("format", "png");

    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "X-Api-Key": removebgKey,
        },
        responseType: "arraybuffer",
        timeout: 30000,
      }
    );

    const base64 = Buffer.from(response.data).toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;

    return res.json({ success: true, image: dataUrl });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to remove background"
    });
  }
};

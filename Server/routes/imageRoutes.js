import express from "express";
import multer from "multer";
import { removeBackground } from "../controllers/ImageController.js";
import { requireAuth } from "../middlewares/auth.js";

const imageRouter = express.Router();

// Use memory storage to forward buffer to external API
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

// Require authentication for background removal
imageRouter.post("/remove-bg", requireAuth, upload.single("image"), removeBackground);

export default imageRouter;

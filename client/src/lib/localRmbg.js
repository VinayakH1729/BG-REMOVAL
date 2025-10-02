// Client-side background removal using Hugging Face transformers.js (RMBG-1.4)
import {
  env,
  AutoModel,
  AutoProcessor,
  RawImage,
} from "@huggingface/transformers";

const MODEL_ID = "briaai/RMBG-1.4";

const state = {
  model: null,
  processor: null,
  currentModelId: MODEL_ID,
  initializing: false,
};

export async function initializeModel() {
  if (state.model && state.processor) return true;
  if (state.initializing) {
    // wait for existing init
    while (state.initializing) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 100));
    }
    return !!(state.model && state.processor);
  }

  try {
    state.initializing = true;
    
    // Configure environment
    env.allowLocalModels = false;
    env.allowRemoteModels = true;
    
    // Configure WASM backend
    if (env.backends?.onnx) {
      env.backends.onnx.wasm = {
        proxy: false, // Disable worker for compatibility
        numThreads: 1,
      };
    }

    state.model = await AutoModel.from_pretrained(MODEL_ID, {
      config: {
        model_type: "custom",
        is_encoder_decoder: false,
        max_position_embeddings: 0,
        "transformers.js_config": {},
      },
    });

    state.processor = await AutoProcessor.from_pretrained(MODEL_ID, {
      config: {
        do_normalize: true,
        do_pad: false,
        do_rescale: true,
        do_resize: true,
        image_mean: [0.5, 0.5, 0.5],
        feature_extractor_type: "ImageFeatureExtractor",
        image_std: [1, 1, 1],
        resample: 2,
        rescale_factor: 1 / 255,
        size: { width: 1024, height: 1024 },
      },
    });

    state.currentModelId = MODEL_ID;
    return true;
  } finally {
    state.initializing = false;
  }
}

export async function processFile(file) {
  if (!state.model || !state.processor) {
    throw new Error("Local model not initialized. Call initializeModel() first.");
  }

  const img = await RawImage.fromURL(URL.createObjectURL(file));

  // Preprocess
  const { pixel_values } = await state.processor(img);
  // Inference
  const { output } = await state.model({ input: pixel_values });

  // Convert output mask to 0..255 and resize back to original
  const maskImage = await RawImage.fromTensor(output[0].mul(255).to("uint8"));
  const resizedMask = await maskImage.resize(img.width, img.height);
  const maskData = resizedMask.data; // Uint8ClampedArray length = w*h

  // Compose transparent PNG on canvas
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2d context");

  // Draw original image
  ctx.drawImage(img.toCanvas(), 0, 0);

  // Apply alpha from mask
  const pixelData = ctx.getImageData(0, 0, img.width, img.height);
  for (let i = 0; i < maskData.length; i++) {
    pixelData.data[4 * i + 3] = maskData[i];
  }
  ctx.putImageData(pixelData, 0, 0);

  // Convert to data URLs
  const processedDataUrl = canvas.toDataURL("image/png");

  // Also render visible mask (optional)
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = img.width;
  maskCanvas.height = img.height;
  const mctx = maskCanvas.getContext("2d");
  if (mctx) {
    const maskPixelData = mctx.createImageData(img.width, img.height);
    for (let i = 0; i < maskData.length; i++) {
      const v = maskData[i];
      maskPixelData.data[4 * i] = v;
      maskPixelData.data[4 * i + 1] = v;
      maskPixelData.data[4 * i + 2] = v;
      maskPixelData.data[4 * i + 3] = 255;
    }
    mctx.putImageData(maskPixelData, 0, 0);
  }
  const maskDataUrl = maskCanvas.toDataURL("image/png");

  return { processedDataUrl, maskDataUrl };
}

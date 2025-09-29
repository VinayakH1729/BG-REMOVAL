import React, { createContext, useContext, useState, useMemo } from "react";

const ImageContext = createContext(null);

export const ImageProvider = ({ children }) => {
  const [originalFile, setOriginalFile] = useState(null); // File object
  const [originalPreview, setOriginalPreview] = useState(""); // data URL
  const [processedImage, setProcessedImage] = useState(""); // data URL (png)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("local"); // "server" | "local"

  const value = useMemo(
    () => ({
      originalFile,
      setOriginalFile,
      originalPreview,
      setOriginalPreview,
      processedImage,
      setProcessedImage,
      loading,
      setLoading,
      error,
      setError,
      mode,
      setMode,
    }),
    [originalFile, originalPreview, processedImage, loading, error, mode]
  );

  return <ImageContext.Provider value={value}>{children}</ImageContext.Provider>;
};

export const useImage = () => {
  const ctx = useContext(ImageContext);
  if (!ctx) throw new Error("useImage must be used within an ImageProvider");
  return ctx;
};

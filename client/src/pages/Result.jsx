import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import { useImage } from "../context/ImageContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const Result = () => {
  const { originalPreview, processedImage, loading, setProcessedImage, error, mode } = useImage();
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useUser();

  // Redirect to home if not authenticated AND using server mode
  useEffect(() => {
    if (isLoaded && mode === 'server' && !isSignedIn) {
      navigate('/');
    }
  }, [isSignedIn, isLoaded, navigate, mode]);

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'bg-removed.png';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const handleTryAnother = () => {
    setProcessedImage("");
    navigate('/');
  }

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <div className="mx-4 my-3 lg:mx-44 mt-14 min-h-[75vh] flex items-center justify-center">
        <div className="border-4 border-violet-600 rounded-full h-12 w-12 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated AND using server mode (will redirect)
  if (mode === 'server' && !isSignedIn) {
    return null;
  }

  const showLoader = loading || (!processedImage && !!originalPreview);
  return (
    <div className="mx-4 my-3 lg:mx-44 mt-14 min-h-[75vh]">
      <div className="bg-white rounded-lg px-8 py-6 drop-shadow-sm">
        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}
        {/* {Image container} */}
        <div className="flex flex-col sm:grid grid-cols-2 gap-8">
          {/* {Left side} */}
          <div>
            <p className="font-semibold text-gray-600 md-2">Original</p>
            {originalPreview ? (
              <img className="rounded-md" src={originalPreview} alt="original" />
            ) : (
              <div className="rounded-md border-gray-300 h-full relative bg-layer overflow-hidden min-h-64 flex items-center justify-center text-gray-500">
                No image selected. Go back and upload an image.
              </div>
            )}
          </div>

          {/* {Right side} */}
          <div className="flex flex-col">
            <p className="font-semibold text-gray-600 md-2">
              Background Removed
            </p>
            <div className="rounded-md border-gray-300 h-full relative bg-layer overflow-hidden">
              {processedImage ? (
                <img className="w-full h-full object-contain" src={processedImage} alt="bg-removed" />
              ) : showLoader ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-4 border-violet-600 rounded-full h-12 w-12 border-t-transparent animate-spin"></div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Result will appear here after processing.
                </div>
              )}
            </div>
          </div>
        </div>
        {/* {Button container} */}
        <div className="flex justify-center sm:justify-end items-center flex-wrap gap-4 mt-6">
          <button onClick={handleTryAnother} className="px-8 py-2.5 text-violet-600 text-sm border border-violet-600 rounded-full hover:scale-105 transition-all duration-700">
            Try another image
          </button>
          <button
            disabled={!processedImage}
            onClick={handleDownload}
            className="px-8 py-2.5 text-white text-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full hover:scale-105 transition-all duration-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download image
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;

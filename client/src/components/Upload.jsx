import React from 'react'
import { assets } from '../assets/assets'
import { useImage } from '../context/ImageContext'
import { useNavigate } from 'react-router-dom'
import { useClerk, useUser, useAuth } from '@clerk/clerk-react'
import { initializeModel, processFile as processLocalFile } from "../lib/localRmbg";

const Upload = () => {
  const { setOriginalFile, setOriginalPreview, setProcessedImage, setLoading, setError, mode } = useImage();
  const navigate = useNavigate();
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();

  const handleSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check authentication before processing
    if (!isSignedIn) {
      openSignIn({});
      return;
    }
    
    setError("");
    setProcessedImage("");
    setOriginalFile(file);

    // Preview
    const reader = new FileReader();
    reader.onload = () => setOriginalPreview(reader.result);
    reader.readAsDataURL(file);

    // Upload and process
    try {
      setLoading(true);
      // Move user to result screen to show progress immediately
      navigate('/result');
      if (mode === 'local') {
        await initializeModel();
        const { processedDataUrl } = await processLocalFile(file);
        setProcessedImage(processedDataUrl);
      } else {
        const form = new FormData();
        form.append('image', file);

        // Use Vite dev proxy or environment base URL if provided
        const base = import.meta.env.VITE_API_BASE_URL || '';
        
        // Get auth token for API request
        const token = await getToken();
        const headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        
        const resp = await fetch(`${base}/api/image/remove-bg`, {
          method: 'POST',
          body: form,
          headers,
        });

        const data = await resp.json();
        if (!resp.ok || !data.success) {
          throw new Error(data.message || 'Failed to process image');
        }
        setProcessedImage(data.image);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className='pb-16'>
        {/* {title} */}
        <h1 className='text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent'>See the magic. Try now</h1>
        {/* {upload box} */}
        <div className='text-center mb-24 mt-10'>
            <input type="file" accept="image/*" id="upload2" hidden onChange={handleSelect}/>
            <label className={`inline-flex gap-3 px-8 py-3.5 rounded-full cursor-pointer m-auto hover:scale-105 transition-all duration-700 ${
                isSignedIn 
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500' 
                    : 'bg-gray-400'
            }`} htmlFor="upload2">
                <img width={20} height={10} src={assets.upload_btn_icon} alt="" />
                <p className='text-white text-sm'>
                    {isSignedIn ? 'Upload Your Image' : 'Sign in to Upload'}
                </p>
            </label>
        </div>
    </div>
  )
}

export default Upload
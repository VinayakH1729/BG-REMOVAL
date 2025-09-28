import React, { useRef } from 'react'
import { assets } from '../assets/assets'
import { useImage } from '../context/ImageContext'
import { useNavigate } from 'react-router-dom'
import { useClerk, useUser, useAuth } from '@clerk/clerk-react'
import { initializeModel, processFile as processLocalFile } from "../lib/localRmbg";

const Header = () => {
    const inputRef = useRef(null);
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
        const reader = new FileReader();
        reader.onload = () => setOriginalPreview(reader.result);
        reader.readAsDataURL(file);
        try {
            setLoading(true);
            // Navigate first to show progress immediately
            navigate('/result');
            if (mode === 'local') {
                await initializeModel();
                const { processedDataUrl } = await processLocalFile(file);
                setProcessedImage(processedDataUrl);
            } else {
                const form = new FormData();
                form.append('image', file);
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
                    headers 
                });
                const data = await resp.json();
                if (!resp.ok || !data.success) throw new Error(data.message || 'Failed to process image');
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
    <div className='flex items-center justify-between max-sm:flex-col-reverse gap-y-10 px-4 mt-10 lg:px-44 sm:mt-20'>
        {/* Left Side */}
        <div>
            <h1 className='text-4xl xl:text-5xl 2xl:text-6xl font-bold text-neutral-700 leading-tight'>
                Remove the <br className='max-md:hidden'/> <span className='bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent'>background</span> from <br className='max-md:hidden'/> images for free.
                </h1>
            <p className='my-6 text-[15px] text-gray-500'>
                {isSignedIn 
                    ? 'Our AI-powered tool makes it easy to remove backgrounds from your images in just a few clicks.'
                    : 'Sign in to access our AI-powered background removal tool and process your images instantly.'
                }
            </p>
            <div>
                <input ref={inputRef} type="file" accept="image/*" id="upload1" hidden onChange={handleSelect}/>
                <label className={`inline-flex gap-3 px-8 py-3.5 rounded-full cursor-pointer m-auto hover:scale-105 transition-all duration-700 ${
                    isSignedIn 
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500' 
                        : 'bg-gray-400'
                }`} htmlFor="upload1">
                    <img width={20} height={10} src={assets.upload_btn_icon} alt="" />
                    <p className='text-white text-sm'>
                        {isSignedIn ? 'Upload Your Image' : 'Sign in to Upload'}
                    </p>
                </label>
            </div>
        </div>

        {/* Right Side */}
        <div className='w-full max-w-md'>
            <img src={assets.header_img} alt="" />
        </div>
    </div>
  )
}

export default Header
import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import { useImage } from "../context/ImageContext";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { isSignedIn, user } = useUser();
  const { mode, setMode } = useImage();

  return (
    <div className="flex items-center justify-between mx-4 py-3 lg:mx-44">
      <Link to="/">
        <img className="w-32 sm:w-44" src={assets.logo} alt="" />
      </Link>
      <div className="flex items-center gap-3">
        <div className={`flex items-center rounded-full bg-gray-100 p-1 border border-gray-200 ${!isSignedIn ? 'opacity-50' : ''}`}>
          <button
            type="button"
            onClick={() => isSignedIn && setMode('server')}
            aria-pressed={mode === 'server'}
            disabled={!isSignedIn}
            className={`px-3 py-1 text-xs sm:text-sm rounded-full transition-all whitespace-nowrap ${
              mode === 'server' && isSignedIn
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow'
                : 'text-gray-700 hover:bg-white'
            } ${!isSignedIn ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            Server
          </button>
          <button
            type="button"
            onClick={() => isSignedIn && setMode('local')}
            aria-pressed={mode === 'local'}
            title="Local (free)"
            disabled={!isSignedIn}
            className={`px-3 py-1 text-xs sm:text-sm rounded-full transition-all whitespace-nowrap ${
              mode === 'local' && isSignedIn
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow'
                : 'text-gray-700 hover:bg-white'
            } ${!isSignedIn ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            Local <span className="hidden sm:inline">(free)</span>
          </button>
        </div>
      {isSignedIn ? (
        <UserButton />
      ) : (
        <button
          onClick={() => openSignIn({})}
          className="bg-zinc-800 text-white flex items-center gap-4 px-4 py-2 sm:px-8 sm:py-3 text-sm rounded-full cursor-pointer"
        >
          Get Started <img src={assets.arrow_icon} alt="" />
        </button>
      )}
      </div>
    </div>
  );
};

export default Navbar;

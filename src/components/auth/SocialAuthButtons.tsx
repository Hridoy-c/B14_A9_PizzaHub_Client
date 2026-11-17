"use client";

import React from "react";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09C3.26 21.3 7.31 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.28a12 12 0 0 0 0 10.74l3.99-3.09z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.28 6.63l3.99 3.09C6.22 6.86 8.87 4.75 12 4.75z"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#3B2417"
      d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.55v-2.1c-3.2.7-3.88-1.4-3.88-1.4-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"
    />
  </svg>
);

const buttonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#EADBC8] bg-white px-3 text-[0.8125rem] font-medium text-[#3B2417] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#F5EDE3] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF6EF]";

const SocialAuthButtons = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 text-[0.6875rem] uppercase tracking-[0.18em] text-[#A08C7B]">
        <span className="h-px flex-1 bg-[#EADBC8]" />
        Or continue with
        <span className="h-px flex-1 bg-[#EADBC8]" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          aria-label="Continue with Google"
          className={buttonClass}
        >
          <GoogleIcon />
          Google
        </button>
        <button
          type="button"
          aria-label="Continue with GitHub"
          className={buttonClass}
        >
          <GitHubIcon />
          GitHub
        </button>
      </div>
    </div>
  );
};

export default SocialAuthButtons;

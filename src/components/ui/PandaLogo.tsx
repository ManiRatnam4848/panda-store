import React from 'react';

interface PandaLogoProps {
  className?: string;
  size?: number;
}

export const PandaLogo: React.FC<PandaLogoProps> = ({ className = '', size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer circular medallion */}
      <circle cx="24" cy="24" r="23" stroke="#20251F" strokeWidth="1.5" strokeOpacity="0.8" />
      <circle cx="24" cy="24" r="21" stroke="#315C46" strokeWidth="0.75" strokeOpacity="0.4" />

      {/* Stylized Minimalist Panda Silhouette reading a book */}
      {/* Panda Ears */}
      <ellipse cx="16" cy="15" rx="3.5" ry="3" fill="#20251F" />
      <ellipse cx="32" cy="15" rx="3.5" ry="3" fill="#20251F" />

      {/* Head */}
      <path
        d="M17 25C17 19.4772 20.134 15 24 15C27.866 15 31 19.4772 31 25C31 29 28.5 31 24 31C19.5 31 17 29 17 25Z"
        fill="#FAF7F2"
        stroke="#20251F"
        strokeWidth="1.2"
      />

      {/* Eye patches */}
      <ellipse cx="20.5" cy="22" rx="2" ry="2.8" transform="rotate(-15 20.5 22)" fill="#20251F" />
      <ellipse cx="27.5" cy="22" rx="2" ry="2.8" transform="rotate(15 27.5 22)" fill="#20251F" />
      {/* Eye glints */}
      <circle cx="20.8" cy="21.5" r="0.6" fill="#FAF7F2" />
      <circle cx="27.2" cy="21.5" r="0.6" fill="#FAF7F2" />

      {/* Nose */}
      <path d="M23 25.5H25L24 26.8L23 25.5Z" fill="#20251F" />

      {/* Open Book in front of Panda */}
      <path
        d="M15 35C18.5 33.5 22 34 24 35.5C26 34 29.5 33.5 33 35V30C29.5 28.5 26 29 24 30.5C22 29 18.5 28.5 15 30V35Z"
        fill="#315C46"
        stroke="#20251F"
        strokeWidth="1"
      />
      {/* Center book spine divide */}
      <line x1="24" y1="30.5" x2="24" y2="35.5" stroke="#FAF7F2" strokeWidth="1" />
    </svg>
  );
};

import React from 'react';

interface BrandMarkProps {
  variant?: 'light' | 'dark'; // 'dark' = for dark nav (#0B2E1C), 'light' = for light surfaces
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({
  variant = 'dark',
  size = 'md',
  showWordmark = true,
  className = '',
}) => {
  const getBadgeDimensions = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 rounded-lg';
      case 'lg':
        return 'w-12 h-12 rounded-2xl';
      case 'xl':
        return 'w-16 h-16 rounded-2xl';
      default:
        return 'w-10 h-10 rounded-xl';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-base';
      case 'lg':
        return 'text-2xl';
      case 'xl':
        return 'text-3xl';
      default:
        return 'text-xl';
    }
  };

  const wordmarkColor = variant === 'dark' ? 'text-[#F3F0E4]' : 'text-[#0B2E1C]';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Open Quran & Crescent Badge: Gold on Deep Emerald */}
      <div
        className={`${getBadgeDimensions()} bg-[#0B2E1C] border border-[#C89B2E]/40 flex items-center justify-center shadow-md relative shrink-0 transition-transform active:scale-95`}
        title="BarakahDaily"
      >
        <svg
          viewBox="0 0 40 40"
          className="w-3/4 h-3/4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Crescent Moon Resting above Spine */}
          <path
            d="M20 7C18.6 7 17.5 7.8 17.1 9C18.3 8.8 19.5 9.3 20.2 10.3C20.8 11.2 20.8 12.4 20.2 13.3C21.6 13 22.7 11.7 22.7 10.1C22.7 8.4 21.5 7 20 7Z"
            fill="#FBBF24"
          />
          {/* Spine Center line */}
          <path
            d="M20 13.5V30.5"
            stroke="#C89B2E"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Left Facing Page */}
          <path
            d="M19 14.5C14.5 13.2 10 14 7 15.5V29C10 27.5 14.5 26.8 19 28V14.5Z"
            fill="#FAF0D8"
            stroke="#C89B2E"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Right Facing Page */}
          <path
            d="M21 14.5C25.5 13.2 30 14 33 15.5V29C30 27.5 25.5 26.8 21 28V14.5Z"
            fill="#FAF0D8"
            stroke="#C89B2E"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Gold text lines on left page */}
          <path d="M10 18.5H16M10 22H16M10 25.5H14" stroke="#C89B2E" strokeWidth="1" strokeLinecap="round" />
          {/* Gold text lines on right page */}
          <path d="M24 18.5H30M24 22H30M26 25.5H30" stroke="#C89B2E" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className={`${getTextSize()} font-extrabold tracking-tight ${wordmarkColor}`}>
            Barakah<span className="text-[#C89B2E]">Daily</span>
          </span>
        </div>
      )}
    </div>
  );
};

export const KhatmCelebrationBadge: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0B2E1C] border-2 border-[#C89B2E] text-[#F3F0E4] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative">
        <div className="w-20 h-20 mx-auto mb-4 bg-[#123D28] rounded-2xl flex items-center justify-center border border-[#C89B2E] animate-bounce">
          <svg viewBox="0 0 40 40" className="w-12 h-12" fill="none">
            <path d="M20 6C18.4 6 17.1 6.9 16.7 8.3C18.1 8 19.5 8.6 20.3 9.8C21 10.9 21 12.3 20.3 13.3C21.9 13 23.2 11.5 23.2 9.7C23.2 7.6 21.8 6 20 6Z" fill="#FBBF24" />
            <path d="M20 13V31" stroke="#C89B2E" strokeWidth="2" strokeLinecap="round" />
            <path d="M19 14C14 12.5 9 13.5 6 15V29C9 27.5 14 26.5 19 28V14Z" fill="#FAF0D8" stroke="#C89B2E" strokeWidth="1.5" />
            <path d="M21 14C26 12.5 31 13.5 34 15V29C31 27.5 26 26.5 21 28V14Z" fill="#FAF0D8" stroke="#C89B2E" strokeWidth="1.5" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-[#FBBF24] mb-2 font-serif">Khatm Mubarak!</h3>
        <p className="text-sm text-[#9FB6A3] mb-6">
          The recitation of the Holy Qur'an has been completed. May Allah accept every letter, bless your time with Barakah, and elevate you in this life and the next.
        </p>
        <button
          onClick={onDismiss}
          className="w-full py-3 px-6 rounded-xl bg-[#C89B2E] hover:bg-[#b58a25] text-[#0B2E1C] font-bold text-sm transition-colors"
        >
          Alhamdulillah
        </button>
      </div>
    </div>
  );
};

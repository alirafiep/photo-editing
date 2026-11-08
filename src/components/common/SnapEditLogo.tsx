import React from 'react';

export const SNAPEDIT_LOGO_SRC = '/assets/aistudio/image_10b91270.png';

interface SnapEditLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const SnapEditLogo: React.FC<SnapEditLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = false,
  className = '',
  onClick,
}) => {
  const sizeMap = {
    xs: { img: 'w-6 h-6', text: 'text-xs', tagline: 'text-[8px]' },
    sm: { img: 'w-8 h-8', text: 'text-sm', tagline: 'text-[9px]' },
    md: { img: 'w-10 h-10', text: 'text-base', tagline: 'text-[10px]' },
    lg: { img: 'w-14 h-14', text: 'text-2xl', tagline: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''} ${className}`}
    >
      {/* 3D-inspired Camera Aperture & Timeline Symbol */}
      <div className={`relative ${currentSize.img} rounded-xl overflow-hidden shadow-lg ring-1 ring-white/20 shrink-0 group`}>
        <img
          src={SNAPEDIT_LOGO_SRC}
          alt="SNAPEDIT Logo"
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/10" />
      </div>

      {showText && (
        <div className="flex flex-col justify-center text-left">
          <div className={`font-black tracking-wider text-white ${currentSize.text} leading-none flex items-center`}>
            SNAP<span className="text-[#1685ff] ml-0.5">EDIT</span>
          </div>
          {showTagline && (
            <span className={`text-neutral-400 font-semibold tracking-widest uppercase mt-0.5 ${currentSize.tagline}`}>
              Create Without Limits
            </span>
          )}
        </div>
      )}
    </div>
  );
};

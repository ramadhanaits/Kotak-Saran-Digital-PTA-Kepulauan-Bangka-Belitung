import React, { useState } from 'react';
import ptaLogoImg from '../assets/pta-logo.jpg';

interface PtaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showShadow?: boolean;
}

export const PtaLogo: React.FC<PtaLogoProps> = ({
  className = '',
  size = 'md',
  showShadow = true,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-12',
    md: 'w-14 h-16',
    lg: 'w-20 h-24',
    xl: 'w-28 h-32',
  };

  if (!imgError) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
        <img
          src={ptaLogoImg}
          alt="Logo Pengadilan Tinggi Agama Kepulauan Bangka Belitung"
          onError={() => setImgError(true)}
          className={`w-full h-full object-contain ${
            showShadow ? 'drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]' : ''
          }`}
        />
      </div>
    );
  }

  // High-fidelity Vector SVG Fallback with exact PTA colors & crest
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 200 240"
        className={`w-full h-full ${showShadow ? 'drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]' : ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Gold Border */}
        <ellipse cx="100" cy="120" rx="96" ry="116" fill="#FACC15" stroke="#EAB308" strokeWidth="2" />
        
        {/* Inner Emerald Field */}
        <ellipse cx="100" cy="120" rx="88" ry="108" fill="#005A2B" stroke="#FDE047" strokeWidth="2.5" />
        <ellipse cx="100" cy="120" rx="76" ry="94" fill="#006530" stroke="#FACC15" strokeWidth="1.5" />

        {/* Text Along Border Arch */}
        <path
          id="textCurveLeft"
          d="M 38 170 A 70 85 0 0 1 100 32"
          fill="none"
          stroke="none"
        />
        <path
          id="textCurveRight"
          d="M 100 32 A 70 85 0 0 1 162 170"
          fill="none"
          stroke="none"
        />
        
        <text fill="#FACC15" fontSize="10.5" fontWeight="800" letterSpacing="0.8" textAnchor="middle">
          <textPath href="#textCurveLeft" startOffset="50%">
            PENGADILAN TINGGI AGAMA
          </textPath>
        </text>
        <text fill="#FACC15" fontSize="11" fontWeight="800" letterSpacing="1" textAnchor="middle">
          <textPath href="#textCurveRight" startOffset="50%">
            KEP. BANGKA BELITUNG
          </textPath>
        </text>

        {/* Cakra / Flame Wheel */}
        <g transform="translate(100, 105)">
          <path
            d="M0 -36 C6 -24 16 -24 24 -16 C20 -8 24 0 32 4 C24 8 20 18 18 26 C10 22 2 24 -4 32 C-8 24 -18 22 -26 18 C-22 10 -24 2 -32 -4 C-24 -8 -20 -18 -18 -26 C-10 -22 -2 -24 0 -36 Z"
            fill="#005A2B"
            stroke="#FDE047"
            strokeWidth="2.5"
          />
          <circle cx="0" cy="0" r="22" fill="#004D25" stroke="#FACC15" strokeWidth="2" />

          {/* National Garuda Shield */}
          <g transform="scale(0.85)">
            <path
              d="M -16 -18 H 16 V 4 C 16 14 0 22 0 22 C 0 22 -16 14 -16 4 Z"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="1.2"
            />
            {/* Top Left: Red Bull Head */}
            <path d="M -16 -18 H 0 V 0 H -16 Z" fill="#DC2626" />
            <circle cx="-8" cy="-9" r="4" fill="#000000" />
            {/* Top Right: Banyan Tree */}
            <path d="M 0 -18 H 16 V 0 H 0 Z" fill="#FFFFFF" />
            <circle cx="8" cy="-9" r="4.5" fill="#15803D" />
            {/* Bottom Left: Rice & Cotton */}
            <path d="M -16 0 H 0 V 4 C 0 10 -6 14 -16 14 Z" fill="#FFFFFF" />
            <path d="M -10 2 Q -8 8 -4 10" stroke="#FACC15" strokeWidth="2" fill="none" />
            {/* Bottom Right: Chain */}
            <path d="M 0 0 H 16 V 4 C 16 10 10 14 0 14 Z" fill="#DC2626" />
            <circle cx="8" cy="7" r="3.5" stroke="#FACC15" strokeWidth="1.5" fill="none" />
            {/* Center Gold Star */}
            <polygon
              points="0,-5 2,-1 6,-1 3,2 4,6 0,3 -4,6 -3,2 -6,-1 -2,-1"
              fill="#FACC15"
              stroke="#B45309"
              strokeWidth="0.5"
            />
          </g>
        </g>

        {/* Rice & Cotton Garland */}
        <g transform="translate(100, 185)">
          <path
            d="M -50 -18 C -35 15 35 15 50 -18"
            fill="none"
            stroke="#FDE047"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {[-45, -35, -25, -15, 15, 25, 35, 45].map((x, idx) => (
            <circle key={idx} cx={x} cy={-12 + Math.abs(x) * 0.25} r="3" fill="#FACC15" stroke="#EAB308" strokeWidth="1" />
          ))}

          {/* Ribbon DHARMMAYUKTI */}
          <path
            d="M -40 -12 Q 0 -5 40 -12 L 46 -2 Q 0 5 -46 -2 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="1"
          />
          <text x="0" y="-3.5" fill="#000000" fontSize="5.5" fontWeight="900" textAnchor="middle" letterSpacing="0.8">
            DHARMMAYUKTI
          </text>
        </g>
      </svg>
    </div>
  );
};

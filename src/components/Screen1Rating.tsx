import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RatingScore, RatingOption } from '../types';
import { sound } from '../utils/sound';

interface Screen1RatingProps {
  onSelectRating: (rating: RatingScore) => void;
}

const RATING_OPTIONS: RatingOption[] = [
  {
    score: 1,
    emoji: '😡',
    label: 'Tidak Puas',
    sublabel: '(Sangat)',
    color: 'red',
    bgGradient: 'from-red-50 to-rose-100/90',
    borderColor: 'border-red-200',
    hoverBorder: 'hover:border-red-500 hover:shadow-red-200/60',
    textColor: 'text-red-950',
    pillBg: 'bg-red-600 text-white',
  },
  {
    score: 2,
    emoji: '🙁',
    label: 'Kurang Puas',
    sublabel: '',
    color: 'orange',
    bgGradient: 'from-orange-50 to-amber-100/90',
    borderColor: 'border-orange-200',
    hoverBorder: 'hover:border-orange-500 hover:shadow-orange-200/60',
    textColor: 'text-orange-950',
    pillBg: 'bg-orange-500 text-white',
  },
  {
    score: 3,
    emoji: '😐',
    label: 'Cukup',
    sublabel: '',
    color: 'amber',
    bgGradient: 'from-yellow-50 to-amber-100/90',
    borderColor: 'border-amber-200',
    hoverBorder: 'hover:border-amber-500 hover:shadow-amber-200/60',
    textColor: 'text-amber-950',
    pillBg: 'bg-amber-500 text-white',
  },
  {
    score: 4,
    emoji: '😊',
    label: 'Puas',
    sublabel: '',
    color: 'emerald',
    bgGradient: 'from-emerald-50 to-green-100/90',
    borderColor: 'border-emerald-200',
    hoverBorder: 'hover:border-emerald-500 hover:shadow-emerald-200/60',
    textColor: 'text-emerald-950',
    pillBg: 'bg-emerald-600 text-white',
  },
  {
    score: 5,
    emoji: '😍',
    label: 'Sangat Puas',
    sublabel: '',
    color: 'green',
    bgGradient: 'from-green-50 to-emerald-200/90',
    borderColor: 'border-emerald-300',
    hoverBorder: 'hover:border-green-600 hover:shadow-green-300/70',
    textColor: 'text-emerald-950',
    pillBg: 'bg-[#007038] text-white',
  },
];

export const Screen1Rating: React.FC<Screen1RatingProps> = ({ onSelectRating }) => {
  const [selectedScore, setSelectedScore] = useState<RatingScore | null>(null);

  const handleCardClick = (score: RatingScore) => {
    setSelectedScore(score);
    sound.playRating(score);

    // Short tactile delay for visual selection confirmation before advancing
    setTimeout(() => {
      onSelectRating(score);
    }, 450);
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between items-center w-full px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto">
      {/* Title & Call-to-action */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-2 mb-6 sm:mb-8"
      >
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tight font-serif drop-shadow-xs">
          Bagaimana Pelayanan Kami Hari Ini?
        </h2>
        <p className="text-slate-600 text-base sm:text-xl font-medium flex items-center justify-center gap-2">
          <span>Pilih salah satu yang sesuai dengan pengalaman Anda</span>
          <span className="inline-block animate-bounce text-emerald-600 text-xl">👇</span>
        </p>
      </motion.div>

      {/* 5 Big Touch Rating Cards */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 my-auto max-w-5xl">
        {RATING_OPTIONS.map((opt, idx) => {
          const isSelected = selectedScore === opt.score;
          return (
            <motion.button
              key={opt.score}
              type="button"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{
                opacity: 1,
                scale: isSelected ? 1.06 : 1,
                y: 0,
              }}
              transition={{
                delay: idx * 0.08,
                duration: 0.35,
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleCardClick(opt.score)}
              className={`group relative flex flex-col items-center justify-between p-4 sm:p-6 md:p-7 rounded-3xl border-2 transition-all duration-200 cursor-pointer shadow-md bg-gradient-to-b ${opt.bgGradient} ${opt.borderColor} ${opt.hoverBorder} ${
                isSelected ? 'ring-4 ring-emerald-500 ring-offset-2 shadow-2xl scale-105' : 'hover:shadow-xl'
              }`}
            >
              {/* Score indicator badge in corner */}
              <div className="w-full flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-slate-400">0{opt.score}</span>
                <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-emerald-500 transition-colors" />
              </div>

              {/* Big Expressive Emoji with Micro-animation */}
              <div className="my-2 sm:my-3 transform transition-transform group-hover:scale-115 duration-200 select-none">
                <span className="text-6xl sm:text-7xl md:text-8xl drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)]">
                  {opt.emoji}
                </span>
              </div>

              {/* Rating Label Box */}
              <div className="w-full mt-2 pt-2 border-t border-slate-200/60 text-center">
                <div className={`text-base sm:text-lg md:text-xl font-bold tracking-tight ${opt.textColor}`}>
                  {opt.label}
                </div>
                {opt.sublabel && (
                  <div className="text-xs sm:text-sm font-semibold text-red-600 mt-0.5">
                    {opt.sublabel}
                  </div>
                )}
              </div>

              {/* Touch ripple hint */}
              <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.button>
          );
        })}
      </div>

      {/* Decorative Bottom Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="w-full max-w-4xl mt-6 sm:mt-8"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#034426] via-[#05683b] to-[#034426] text-white py-3.5 px-6 shadow-lg border border-amber-400/40 text-center">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#facc15_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
          <div className="relative flex items-center justify-center gap-2">
            <span className="text-amber-400 font-serif text-lg">❦</span>
            <p className="font-serif italic text-base sm:text-lg md:text-xl font-semibold tracking-wide text-amber-200">
              Terima Kasih atas penilaian Anda
            </p>
            <span className="text-amber-400 font-serif text-lg">❦</span>
          </div>
          <p className="text-[11px] sm:text-xs text-emerald-100 mt-0.5">
            Sentuh salah satu emotikon di atas untuk melanjutkan
          </p>
        </div>
      </motion.div>
    </div>
  );
};

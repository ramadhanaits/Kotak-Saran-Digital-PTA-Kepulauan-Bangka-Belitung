import React from 'react';
import { motion } from 'motion/react';
import { Edit3, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import { RatingScore } from '../types';
import { sound } from '../utils/sound';

interface Screen2ChoiceProps {
  rating: RatingScore;
  onChooseSuggestion: () => void;
  onSkipSuggestion: () => void;
  onBackToRating: () => void;
}

const RATING_EMOJIS: Record<RatingScore, { emoji: string; text: string }> = {
  1: { emoji: '😡', text: 'Tidak Puas' },
  2: { emoji: '🙁', text: 'Kurang Puas' },
  3: { emoji: '😐', text: 'Cukup' },
  4: { emoji: '😊', text: 'Puas' },
  5: { emoji: '😍', text: 'Sangat Puas' },
};

export const Screen2Choice: React.FC<Screen2ChoiceProps> = ({
  rating,
  onChooseSuggestion,
  onSkipSuggestion,
  onBackToRating,
}) => {
  const currentRatingInfo = RATING_EMOJIS[rating] || { emoji: '😊', text: 'Puas' };

  const handleGiveSuggestion = () => {
    sound.playTap();
    onChooseSuggestion();
  };

  const handleSkip = () => {
    sound.playTap();
    onSkipSuggestion();
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between items-center w-full px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto">
      {/* Top micro-badge showing chosen rating */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full text-xs sm:text-sm text-emerald-900 shadow-xs"
      >
        <span className="text-base">{currentRatingInfo.emoji}</span>
        <span>Penilaian Anda: <strong className="font-semibold">{currentRatingInfo.text}</strong></span>
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            onBackToRating();
          }}
          className="ml-2 text-emerald-700 hover:text-emerald-900 flex items-center gap-1 text-[11px] underline cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" /> Ubah
        </button>
      </motion.div>

      {/* Main Center Callout */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, type: 'spring' }}
        className="flex flex-col items-center text-center my-auto space-y-6 max-w-2xl"
      >
        {/* Animated Checkmark Circle */}
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xl ring-8 ring-emerald-100"
          >
            <CheckCircle2 className="w-14 h-14 sm:w-16 sm:h-16 stroke-[2.2]" />
          </motion.div>

          {/* Radiating sparkles */}
          <div className="absolute -top-1 -right-1 text-amber-400 text-2xl animate-spin [animation-duration:6s]">
            ✦
          </div>
          <div className="absolute -bottom-1 -left-2 text-amber-400 text-xl animate-pulse">
            ★
          </div>
        </div>

        {/* Text Copy */}
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-800 tracking-tight font-serif">
            Terima Kasih!
          </h2>
          <p className="text-lg sm:text-2xl font-bold text-emerald-800">
            Apa yang bisa kami tingkatkan?
          </p>
          <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto">
            Apakah Anda ingin menyampaikan saran atau masukan untuk peningkatan kualitas pelayanan PTA Kepulauan Bangka Belitung?
          </p>
        </div>

        {/* Two Big Action Choice Buttons */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4">
          {/* Button 1: Sampaikan Saran */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGiveSuggestion}
            className="group relative flex items-center justify-center gap-3 sm:gap-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#03542f] via-[#056f3e] to-[#03542f] text-white shadow-xl hover:shadow-2xl border-2 border-emerald-400/50 cursor-pointer text-left transition-all duration-200"
          >
            <div className="p-3 bg-white/15 rounded-xl group-hover:bg-white/25 transition-colors">
              <Edit3 className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>Sampaikan Saran</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-xs text-emerald-100 font-medium">
                Tulis masukan singkat &amp; konstruktif
              </div>
            </div>
          </motion.button>

          {/* Button 2: Tidak Ada (Skip) */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSkip}
            className="group relative flex items-center justify-center gap-3 sm:gap-4 p-5 sm:p-6 rounded-2xl bg-white text-slate-700 shadow-md hover:shadow-xl border-2 border-slate-300 hover:border-slate-400 cursor-pointer text-left transition-all duration-200"
          >
            <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-slate-200 transition-colors">
              <span className="text-2xl sm:text-3xl">🚫</span>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold tracking-tight text-slate-800 flex items-center gap-1.5">
                <span>Tidak Ada</span>
                <span className="text-xs font-semibold text-slate-500 font-sans">(Selesai)</span>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Langsung selesai &amp; simpan penilaian
              </div>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Bottom hint */}
      <div className="text-center text-xs text-slate-400">
        Pengadilan Tinggi Agama Kepulauan Bangka Belitung • Menuju WBBM 2026
      </div>
    </div>
  );
};

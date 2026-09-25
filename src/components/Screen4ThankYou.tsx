import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { RotateCcw, Heart, Sparkles, Building } from 'lucide-react';
import { sound } from '../utils/sound';

interface Screen4ThankYouProps {
  onResetToStart: () => void;
  countdownSeconds?: number;
}

export const Screen4ThankYou: React.FC<Screen4ThankYouProps> = ({
  onResetToStart,
  countdownSeconds = 5,
}) => {
  const [timeLeft, setTimeLeft] = useState(countdownSeconds);

  useEffect(() => {
    // Play celebratory chime
    sound.playSuccess();

    // Trigger subtle confetti burst
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#007038', '#FACC15', '#10B981', '#34D399', '#F59E0B'],
        disableForReducedMotion: true,
      });
    } catch {
      // Confetti fallback
    }

    // Countdown interval
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onResetToStart();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onResetToStart]);

  const handleManualReset = () => {
    sound.playTap();
    onResetToStart();
  };

  const progressPercentage = ((countdownSeconds - timeLeft) / countdownSeconds) * 100;

  return (
    <div className="relative flex-1 flex flex-col justify-between items-center w-full px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto">
      {/* Top subtle decorative text */}
      <div className="text-xs text-emerald-800 font-semibold tracking-wide flex items-center gap-1.5 bg-emerald-100/70 px-3.5 py-1 rounded-full border border-emerald-300/40">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>Survei Kepuasan Masyarakat PTA Kep. Bangka Belitung</span>
      </div>

      {/* Main Thank You Presentation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
        className="flex flex-col items-center text-center my-auto space-y-6 max-w-2xl"
      >
        {/* Animated Friendly Emoji Badge */}
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.25, 1] }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-[#03542f] via-[#056f3e] to-teal-500 text-white flex items-center justify-center shadow-2xl ring-8 ring-emerald-100"
          >
            <span className="text-6xl sm:text-7xl select-none animate-pulse">
              😊
            </span>
          </motion.div>
          {/* Subtle Heart Pill */}
          <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white p-2 rounded-full shadow-lg border-2 border-white animate-bounce">
            <Heart className="w-5 h-5 fill-current" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-3 px-2">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-800 tracking-tight font-serif">
            Terima Kasih Atas Masukan Anda! 🙏
          </h2>
          <p className="text-base sm:text-xl font-medium text-slate-700 max-w-xl mx-auto leading-relaxed">
            Setiap masukan akan menjadi bahan evaluasi untuk peningkatan kualitas pelayanan Pengadilan Tinggi Agama Kepulauan Bangka Belitung.
          </p>
        </div>

        {/* Highlighted Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-lg bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center justify-center gap-2 text-emerald-900 font-bold text-sm sm:text-base">
            <Building className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>Bersama kita wujudkan Pelayanan Prima</span>
          </div>
          <p className="text-xs text-emerald-700 font-medium mt-1">
            Wilayah Bebas dari Korupsi (WBK) &amp; Wilayah Birokrasi Bersih dan Melayani (WBBM)
          </p>
        </motion.div>

        {/* Visual Countdown Timer */}
        <div className="pt-2 flex flex-col items-center space-y-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500">
            <span>Otomatis kembali ke layar awal dalam</span>
            <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-mono font-bold flex items-center justify-center text-sm shadow-xs">
              {timeLeft}
            </span>
            <span>detik</span>
          </div>

          {/* Linear Progress Bar */}
          <div className="w-56 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Instant Reset Button */}
          <button
            type="button"
            onClick={handleManualReset}
            className="mt-3 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer border border-slate-300"
          >
            <RotateCcw className="w-4 h-4 text-emerald-700" />
            <span>Kembali ke Beranda Sekarang</span>
          </button>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="text-center text-xs text-slate-400">
        PTA Kepulauan Bangka Belitung • Melayani dengan Hati, Menuju Peradilan Agama yang Agung
      </div>
    </div>
  );
};

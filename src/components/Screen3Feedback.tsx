import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Monitor,
  UserCheck,
  Building2,
  Clock,
  MoreHorizontal,
  Send,
  ArrowLeft,
  User,
  Phone,
  Sparkles,
} from 'lucide-react';
import { FeedbackCategory, RatingScore } from '../types';
import { sound } from '../utils/sound';

interface Screen3FeedbackProps {
  rating: RatingScore;
  onSubmit: (data: {
    category: FeedbackCategory;
    message: string;
    name?: string;
    phone?: string;
  }) => void;
  onBack: () => void;
}

interface CategoryItem {
  id: FeedbackCategory;
  label: string;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'ptsp', label: 'Pelayanan PTSP', icon: <Users className="w-5 h-5" /> },
  { id: 'sistem', label: 'Sistem / Website', icon: <Monitor className="w-5 h-5" /> },
  { id: 'petugas', label: 'Petugas', icon: <UserCheck className="w-5 h-5" /> },
  { id: 'sarana', label: 'Sarana & Prasarana', icon: <Building2 className="w-5 h-5" /> },
  { id: 'waktu', label: 'Waktu Pelayanan', icon: <Clock className="w-5 h-5" /> },
  { id: 'lainnya', label: 'Lainnya', icon: <MoreHorizontal className="w-5 h-5" /> },
];

const PRESET_QUICK_CHIPS: Record<FeedbackCategory, string[]> = {
  ptsp: [
    'Petugas PTSP sangat ramah & solutif',
    'Penjelasan alur perkara jelas',
    'Mohon brosur informasi diperbanyak',
  ],
  sistem: [
    'Aplikasi e-Court mudah digunakan',
    'Website informatif & transparan',
    'WiFi pengunjung agar lebih stabil',
  ],
  petugas: [
    'Sikap petugas sopan dan berintegritas',
    'Pelayanan tanpa pungli & calo',
    'Petugas cepat tanggap membantu lansia',
  ],
  sarana: [
    'Ruang tunggu bersih, nyaman & sejuk',
    'Musholla dan toilet sangat bersih',
    'Tambah fasilitas charging station HP',
  ],
  waktu: [
    'Waktu tunggu sidang tepat waktu',
    'Proses legalisir akta sangat cepat',
    'Pertahankan ketepatan waktu loket',
  ],
  lainnya: [
    'Apresiasi tinggi untuk jajaran PTA Babel',
    'Terus tingkatkan pelayanan prima',
  ],
};

export const Screen3Feedback: React.FC<Screen3FeedbackProps> = ({
  rating,
  onSubmit,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory>('ptsp');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSelectCategory = (cat: FeedbackCategory) => {
    sound.playTap();
    setSelectedCategory(cat);
  };

  const handleAddChipText = (chipText: string) => {
    sound.playTap();
    if (!message) {
      setMessage(chipText);
    } else {
      setMessage((prev) => `${prev}. ${chipText}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg('Mohon tuliskan saran atau masukan Anda secara singkat.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    sound.playTap();

    onSubmit({
      category: selectedCategory,
      message: message.trim(),
      name: name.trim() || undefined,
      phone: phone.trim() || undefined,
    });
  };

  return (
    <div className="relative flex-1 flex flex-col justify-start items-center w-full px-4 sm:px-6 py-4 sm:py-6 max-w-4xl mx-auto overflow-y-auto">
      {/* Title Card */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full text-center mb-4"
      >
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1 rounded-full text-xs font-semibold mb-2">
          <span>Tingkat Kepuasan:</span>
          <span>{rating === 5 ? '😍 Sangat Puas' : rating === 4 ? '😊 Puas' : rating === 3 ? '😐 Cukup' : rating === 2 ? '🙁 Kurang Puas' : '😡 Tidak Puas'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight font-serif flex items-center justify-center gap-2.5">
          <span className="p-2 bg-emerald-700 text-white rounded-xl text-lg sm:text-xl">
            💬
          </span>
          Tulis Saran atau Masukan Anda
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Suara Anda adalah komitmen kami untuk memberikan pelayanan peradilan terbaik
        </p>
      </motion.div>

      {/* Main Form Box */}
      <motion.form
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-200/80 space-y-5"
      >
        {/* Step 1: Category Selector */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
            Pilih kategori masukan:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-600/30 font-bold shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 font-medium'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-white text-slate-500 border border-slate-200'
                    }`}
                  >
                    {cat.icon}
                  </div>
                  <span className="text-xs sm:text-sm leading-tight">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Quick Predefined Suggestions Chips */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Saran Cepat (Sentuh untuk memilih):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_QUICK_CHIPS[selectedCategory]?.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddChipText(chip)}
                className="text-[11px] sm:text-xs bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 px-3 py-1.5 rounded-full transition-all cursor-pointer text-left"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Textarea for Suggestion */}
        <div className="relative">
          <label htmlFor="message-box" className="sr-only">
            Tuliskan saran atau masukan Anda
          </label>
          <textarea
            id="message-box"
            rows={4}
            maxLength={500}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="Tuliskan saran atau masukan Anda di sini secara singkat dan jelas..."
            className="w-full p-4 text-sm sm:text-base text-slate-800 bg-slate-50 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white resize-none transition-all placeholder:text-slate-400"
          />
          <div className="flex justify-between items-center px-1 mt-1 text-[11px] text-slate-400">
            <span>Masukan konstruktif akan sangat membantu peningkatan mutu layanan.</span>
            <span className={message.length > 450 ? 'text-amber-600 font-bold' : ''}>
              {message.length}/500
            </span>
          </div>
          {errorMsg && (
            <p className="text-xs text-red-600 font-semibold mt-1 animate-shake">
              ⚠️ {errorMsg}
            </p>
          )}
        </div>

        {/* Step 4: Optional Contact Information */}
        <div className="pt-2 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama (Opsional)"
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="No. HP / WhatsApp (Opsional)"
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
            <span>🔒</span> Identitas Anda dijamin kerahasiaannya oleh Pengadilan Tinggi Agama Kep. Bangka Belitung.
          </p>
        </div>

        {/* Buttons: Back & Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onBack();
            }}
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#03542f] via-[#056f3e] to-[#03542f] hover:from-[#024426] hover:to-[#024426] text-white text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-amber-300" />
            <span>Kirim Masukan</span>
          </button>
        </div>
      </motion.form>
    </div>
  );
};

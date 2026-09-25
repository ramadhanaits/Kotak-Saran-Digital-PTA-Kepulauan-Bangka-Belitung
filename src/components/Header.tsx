import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { PtaLogo } from './PtaLogo';
import gedungImg from '../assets/gedung-pta.jpg';
import { sound } from '../utils/sound';
import { KioskScreen } from '../types';

interface HeaderProps {
  currentScreen: KioskScreen;
  onNavigateScreen: (screen: KioskScreen) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigateScreen }) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
      setDateStr(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      );
    };
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSound = () => {
    sound.enabled = !soundEnabled;
    setSoundEnabled(sound.enabled);
    if (sound.enabled) sound.playTap();
  };

  const toggleFullscreen = () => {
    sound.playTap();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const handleAdminClick = () => {
    sound.playTap();
    if (currentScreen === 'admin') {
      onNavigateScreen('rating');
    } else {
      // Direct opening or PIN modal
      setShowAdminPinModal(true);
      setPinInput('');
      setPinError(false);
    }
  };

  const handleVerifyPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Default staff PIN is 1234 or empty submit for easy demonstration
    if (pinInput === '1234' || pinInput === '' || pinInput === 'admin') {
      sound.playSuccess();
      setShowAdminPinModal(false);
      onNavigateScreen('admin');
    } else {
      setPinError(true);
    }
  };

  return (
    <>
      <header className="relative w-full bg-gradient-to-r from-[#034426] via-[#056238] to-[#044c2c] text-white shadow-xl overflow-hidden border-b-4 border-amber-400 select-none">
        {/* Subtle decorative islamic geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Right-side blended courthouse building image */}
        <div className="absolute right-0 top-0 bottom-0 w-2/5 md:w-1/3 pointer-events-none overflow-hidden opacity-30 md:opacity-40 mix-blend-luminosity">
          <img
            src={gedungImg}
            alt="Gedung Pengadilan Tinggi Agama Kepulauan Bangka Belitung"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient feather to blend smoothly */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#034426] via-[#056238]/60 to-transparent" />
        </div>

        {/* Header content container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left: Emblem and Typography */}
          <div className="flex items-center gap-3.5 sm:gap-4.5 w-full md:w-auto">
            <div className="transform transition-transform hover:scale-105 duration-200">
              <PtaLogo size="md" />
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-amber-400/40">
                  Mahkamah Agung Republik Indonesia
                </span>
              </div>
              <h1 className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-white leading-tight font-serif drop-shadow-sm mt-0.5">
                PENGADILAN TINGGI AGAMA KEP. BANGKA BELITUNG
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium italic drop-shadow-sm flex items-center gap-1.5">
                <span className="text-amber-300">✦</span>
                Melayani dengan Hati, Menuju Peradilan Agama yang Agung
                <span className="text-amber-300">✦</span>
              </p>
            </div>
          </div>

          {/* Right: Live Clock & Quick Utility Controls */}
          <div className="flex items-center justify-between md:justify-end gap-2.5 sm:gap-3 w-full md:w-auto pt-2 md:pt-0 border-t border-emerald-700/50 md:border-none">
            {/* Live Clock & Date */}
            <div className="flex flex-col text-left md:text-right bg-emerald-950/50 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-emerald-600/40">
              <span className="text-xs font-bold text-amber-300 tabular-nums">
                {timeStr} <span className="text-[10px] font-normal text-emerald-200">WIB</span>
              </span>
              <span className="text-[11px] text-emerald-200 truncate font-medium">
                {dateStr}
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5">
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={toggleSound}
                title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
                className="p-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-600/50 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-emerald-400" />}
              </button>

              {/* Fullscreen Kiosk Mode */}
              <button
                type="button"
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh (Kiosk)'}
                className="p-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-600/50 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Admin Dashboard Switch */}
              <button
                type="button"
                onClick={handleAdminClick}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border shadow-xs cursor-pointer ${
                  currentScreen === 'admin'
                    ? 'bg-amber-400 text-emerald-950 border-amber-300 hover:bg-amber-300 font-bold'
                    : 'bg-emerald-900/80 hover:bg-emerald-800 text-amber-200 border-amber-400/40 hover:border-amber-400'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {currentScreen === 'admin' ? 'Kembali ke Kiosk' : 'Admin PTSP'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Staff Admin PIN Modal */}
      {showAdminPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 text-slate-800 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Akses Dashboard Petugas
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Masukkan PIN petugas untuk melihat statistik & laporan masukan (PIN default: <span className="font-semibold text-emerald-700">1234</span> atau langsung tekan Masuk).
            </p>

            <form onSubmit={handleVerifyPin} className="space-y-3">
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Masukkan PIN (Opsional: 1234)"
                autoFocus
                className="w-full text-center tracking-widest text-lg font-mono py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              />

              {pinError && (
                <p className="text-xs text-red-600 font-medium">
                  PIN keliru. Gunakan 1234 atau kosongkan.
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminPinModal(false)}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  Buka Dashboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

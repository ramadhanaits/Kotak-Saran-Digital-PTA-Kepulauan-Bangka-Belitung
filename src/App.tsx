/**
 * Kotak Saran Digital - Pengadilan Tinggi Agama Kepulauan Bangka Belitung
 * Melayani dengan Hati, Menuju Peradilan Agama yang Agung
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Screen1Rating } from './components/Screen1Rating';
import { Screen2Choice } from './components/Screen2Choice';
import { Screen3Feedback } from './components/Screen3Feedback';
import { Screen4ThankYou } from './components/Screen4ThankYou';
import { AdminDashboard } from './components/AdminDashboard';
import { FeedbackCategory, FeedbackSubmission, KioskScreen, RatingScore } from './types';
import { getStoredSubmissions, saveSubmission } from './utils/storage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<KioskScreen>('rating');
  const [selectedRating, setSelectedRating] = useState<RatingScore>(5);
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>([]);

  // Initialize and load persistent feedback data
  useEffect(() => {
    const data = getStoredSubmissions();
    setSubmissions(data);
  }, []);

  const refreshData = () => {
    const data = getStoredSubmissions();
    setSubmissions(data);
  };

  // Step 1: User selects satisfaction rating (Layar 1 -> Layar 2)
  const handleSelectRating = (score: RatingScore) => {
    setSelectedRating(score);
    setCurrentScreen('choice');
  };

  // Step 2A: User wants to submit detailed suggestion (Layar 2 -> Layar 3)
  const handleChooseSuggestion = () => {
    setCurrentScreen('feedback');
  };

  // Step 2B: User skips suggestion (Layar 2 -> Layar 4 directly)
  const handleSkipSuggestion = () => {
    saveSubmission({
      rating: selectedRating,
      hasSuggestion: false,
    });
    refreshData();
    setCurrentScreen('thankyou');
  };

  // Step 3: User submits feedback form (Layar 3 -> Layar 4)
  const handleSubmitFeedback = (data: {
    category: FeedbackCategory;
    message: string;
    name?: string;
    phone?: string;
  }) => {
    saveSubmission({
      rating: selectedRating,
      hasSuggestion: true,
      category: data.category,
      message: data.message,
      name: data.name,
      phone: data.phone,
    });
    refreshData();
    setCurrentScreen('thankyou');
  };

  // Step 4: Reset back to screen 1 (auto after 5s or manually)
  const handleResetToStart = () => {
    setSelectedRating(5);
    setCurrentScreen('rating');
  };

  // Navigation controller
  const handleNavigateScreen = (screen: KioskScreen) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 text-slate-800 flex flex-col justify-between selection:bg-emerald-200">
      {/* Kiosk Header is visible across all interactive kiosk steps */}
      <Header
        currentScreen={currentScreen}
        onNavigateScreen={handleNavigateScreen}
      />

      {/* Main Kiosk Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center w-full relative">
        {currentScreen === 'rating' && (
          <Screen1Rating onSelectRating={handleSelectRating} />
        )}

        {currentScreen === 'choice' && (
          <Screen2Choice
            rating={selectedRating}
            onChooseSuggestion={handleChooseSuggestion}
            onSkipSuggestion={handleSkipSuggestion}
            onBackToRating={() => setCurrentScreen('rating')}
          />
        )}

        {currentScreen === 'feedback' && (
          <Screen3Feedback
            rating={selectedRating}
            onSubmit={handleSubmitFeedback}
            onBack={() => setCurrentScreen('choice')}
          />
        )}

        {currentScreen === 'thankyou' && (
          <Screen4ThankYou
            onResetToStart={handleResetToStart}
            countdownSeconds={5}
          />
        )}

        {currentScreen === 'admin' && (
          <AdminDashboard
            submissions={submissions}
            onRefreshData={refreshData}
            onBackToKiosk={() => setCurrentScreen('rating')}
          />
        )}
      </main>

      {/* Discreet footer on Kiosk screens (hidden on admin dashboard) */}
      {currentScreen !== 'admin' && (
        <footer className="w-full py-2.5 px-4 text-center text-[11px] text-slate-400 border-t border-slate-200/60 bg-white/50 backdrop-blur-xs select-none">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>© {new Date().getFullYear()} Pengadilan Tinggi Agama Kepulauan Bangka Belitung</span>
            <span className="hidden sm:inline">·</span>
            <span>Pelayanan Terpadu Satu Pintu (PTSP)</span>
            <span className="hidden sm:inline">·</span>
            <span>Wilayah Birokrasi Bersih dan Melayani (WBBM)</span>
          </div>
        </footer>
      )}
    </div>
  );
}

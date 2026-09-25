export type RatingScore = 1 | 2 | 3 | 4 | 5;

export interface RatingOption {
  score: RatingScore;
  emoji: string;
  label: string;
  sublabel?: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  hoverBorder: string;
  textColor: string;
  pillBg: string;
}

export type FeedbackCategory =
  | 'ptsp'
  | 'sistem'
  | 'petugas'
  | 'sarana'
  | 'waktu'
  | 'lainnya';

export interface CategoryOption {
  id: FeedbackCategory;
  label: string;
  iconName: string;
}

export type FollowUpStatus = 'belum' | 'proses' | 'selesai';

export interface FeedbackSubmission {
  id: string;
  timestamp: string; // ISO
  rating: RatingScore;
  hasSuggestion: boolean;
  category?: FeedbackCategory;
  categoryLabel?: string;
  message?: string;
  name?: string;
  phone?: string;
  status: FollowUpStatus;
  notes?: string;
  updatedAt?: string;
}

export type KioskScreen = 'rating' | 'choice' | 'feedback' | 'thankyou' | 'admin';

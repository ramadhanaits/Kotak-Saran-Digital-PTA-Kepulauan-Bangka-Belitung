import React, { useState } from 'react';
import { X, CheckCircle, Clock, AlertCircle, Save, MessageSquare, User, Phone, Calendar } from 'lucide-react';
import { FeedbackSubmission, FollowUpStatus } from '../types';
import { sound } from '../utils/sound';

interface FeedbackDetailModalProps {
  item: FeedbackSubmission;
  onClose: () => void;
  onUpdateStatus: (id: string, status: FollowUpStatus, notes?: string) => void;
}

const RATING_MAP = {
  1: { emoji: '😡', label: 'Tidak Puas (Sangat)', color: 'text-red-600 bg-red-50' },
  2: { emoji: '🙁', label: 'Kurang Puas', color: 'text-orange-600 bg-orange-50' },
  3: { emoji: '😐', label: 'Cukup', color: 'text-amber-600 bg-amber-50' },
  4: { emoji: '😊', label: 'Puas', color: 'text-emerald-600 bg-emerald-50' },
  5: { emoji: '😍', label: 'Sangat Puas', color: 'text-teal-700 bg-teal-50' },
};

export const FeedbackDetailModal: React.FC<FeedbackDetailModalProps> = ({
  item,
  onClose,
  onUpdateStatus,
}) => {
  const [currentStatus, setCurrentStatus] = useState<FollowUpStatus>(item.status);
  const [notes, setNotes] = useState(item.notes || '');
  const [isSaved, setIsSaved] = useState(false);

  const ratingInfo = RATING_MAP[item.rating] || RATING_MAP[5];

  const handleSave = () => {
    sound.playSuccess();
    onUpdateStatus(item.id, currentStatus, notes);
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const formattedDate = new Date(item.timestamp).toLocaleString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xl">{ratingInfo.emoji}</span>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Detail Saran &amp; Tindak Lanjut
              </h3>
              <p className="text-xs text-slate-400">ID: {item.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Metadata badges */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <div>
              <span className="text-slate-400 block mb-0.5">Penilaian:</span>
              <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-md ${ratingInfo.color}`}>
                <span>{ratingInfo.emoji}</span>
                <span>{ratingInfo.label}</span>
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Kategori Masukan:</span>
              <span className="font-semibold text-slate-800">
                {item.categoryLabel || 'Penilaian Cepat'}
              </span>
            </div>

            <div className="col-span-2 flex items-center gap-1.5 text-slate-500 pt-1 border-t border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Waktu Submit: {formattedDate} WIB</span>
            </div>
          </div>

          {/* User Message */}
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span>Isi Saran / Masukan Pengunjung:</span>
            </label>
            <div className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-2xl text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
              {item.message ? item.message : <em className="text-slate-400">Pengunjung hanya memberikan rating tanpa catatan teks tambahan.</em>}
            </div>
          </div>

          {/* Contact Details */}
          {(item.name || item.phone) && (
            <div className="flex flex-wrap gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              {item.name && (
                <div className="flex items-center gap-1.5 text-slate-700">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Pengirim: <strong>{item.name}</strong></span>
                </div>
              )}
              {item.phone && (
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Kontak: <strong>{item.phone}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* Update Status Selector */}
          <div className="pt-2">
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Status Tindak Lanjut Petugas:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCurrentStatus('belum')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  currentStatus === 'belum'
                    ? 'bg-slate-700 text-white border-slate-800 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Belum Diproses</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStatus('proses')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  currentStatus === 'proses'
                    ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Sedang Proses</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStatus('selesai')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  currentStatus === 'selesai'
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Selesai</span>
              </button>
            </div>
          </div>

          {/* Staff Follow-up Notes */}
          <div>
            <label htmlFor="staff-notes" className="text-xs font-bold text-slate-700 block mb-1.5">
              Catatan Tindak Lanjut / Evaluasi Internal:
            </label>
            <textarea
              id="staff-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Sudah dikoordinasikan dengan Subbag Tata Usaha / Petugas PTSP..."
              className="w-full p-3 text-xs sm:text-sm text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Tutup
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaved ? 'Tersimpan!' : 'Simpan Tindak Lanjut'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

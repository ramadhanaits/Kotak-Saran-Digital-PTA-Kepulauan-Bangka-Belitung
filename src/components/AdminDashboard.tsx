import React, { useState, useMemo } from 'react';
import {
  Download,
  Printer,
  RotateCcw,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
  FileText,
  Calendar,
  Eye,
  TrendingUp,
  Building,
} from 'lucide-react';
import { FeedbackSubmission, FollowUpStatus, RatingScore, FeedbackCategory } from '../types';
import { CATEGORY_LABELS, resetToDefaultSeed, updateSubmissionStatus } from '../utils/storage';
import { FeedbackDetailModal } from './FeedbackDetailModal';
import { PtaLogo } from './PtaLogo';
import { sound } from '../utils/sound';

interface AdminDashboardProps {
  submissions: FeedbackSubmission[];
  onRefreshData: () => void;
  onBackToKiosk: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  submissions,
  onRefreshData,
  onBackToKiosk,
}) => {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'grafik' | 'daftar'>('ringkasan');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemForModal, setSelectedItemForModal] = useState<FeedbackSubmission | null>(null);

  // Stats computations
  const stats = useMemo(() => {
    const total = submissions.length;
    const withFeedback = submissions.filter((s) => s.hasSuggestion && s.message);

    const counts: Record<RatingScore, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    submissions.forEach((s) => {
      counts[s.rating] = (counts[s.rating] || 0) + 1;
    });

    const percentages = {
      1: total ? ((counts[1] / total) * 100).toFixed(1).replace('.', ',') : '0,0',
      2: total ? ((counts[2] / total) * 100).toFixed(1).replace('.', ',') : '0,0',
      3: total ? ((counts[3] / total) * 100).toFixed(1).replace('.', ',') : '0,0',
      4: total ? ((counts[4] / total) * 100).toFixed(1).replace('.', ',') : '0,0',
      5: total ? ((counts[5] / total) * 100).toFixed(1).replace('.', ',') : '0,0',
    };

    // Category breakdown
    const categoryCounts: Record<FeedbackCategory, number> = {
      ptsp: 0,
      petugas: 0,
      waktu: 0,
      sistem: 0,
      sarana: 0,
      lainnya: 0,
    };
    withFeedback.forEach((s) => {
      if (s.category && categoryCounts[s.category] !== undefined) {
        categoryCounts[s.category]++;
      }
    });

    // Follow-up status counts
    const statusCounts: Record<FollowUpStatus, number> = {
      selesai: 0,
      proses: 0,
      belum: 0,
    };
    withFeedback.forEach((s) => {
      statusCounts[s.status]++;
    });

    // IKM (Indeks Kepuasan Masyarakat) calculation (scale of 25 - 100 according to PermenPANRB)
    const totalScorePoints =
      counts[1] * 1 + counts[2] * 2 + counts[3] * 3 + counts[4] * 4 + counts[5] * 5;
    const ikmValue = total ? ((totalScorePoints / (total * 5)) * 100).toFixed(2) : '0';

    return {
      total,
      withFeedbackCount: withFeedback.length,
      counts,
      percentages,
      categoryCounts,
      statusCounts,
      ikmValue,
    };
  }, [submissions]);

  // Filtered list for table
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      // Must have suggestion text for table unless search specifies
      if (filterStatus !== 'all' && item.status !== filterStatus) return false;
      if (filterCategory !== 'all' && item.category !== filterCategory) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const msgMatch = item.message?.toLowerCase().includes(query);
        const nameMatch = item.name?.toLowerCase().includes(query);
        const catMatch = item.categoryLabel?.toLowerCase().includes(query);
        const phoneMatch = item.phone?.toLowerCase().includes(query);
        return Boolean(msgMatch || nameMatch || catMatch || phoneMatch);
      }
      return item.hasSuggestion;
    });
  }, [submissions, filterStatus, filterCategory, searchQuery]);

  // Export CSV
  const handleExportCSV = () => {
    sound.playTap();
    const headers = ['ID', 'Waktu', 'Rating', 'Kategori', 'Pesan', 'Nama', 'Telepon', 'Status', 'Catatan Evaluasi'];
    const rows = submissions.map((s) => [
      `"${s.id}"`,
      `"${new Date(s.timestamp).toLocaleString('id-ID')}"`,
      s.rating,
      `"${s.categoryLabel || '-'}"`,
      `"${(s.message || '').replace(/"/g, '""')}"`,
      `"${(s.name || '-').replace(/"/g, '""')}"`,
      `"${s.phone || '-'}"`,
      `"${s.status}"`,
      `"${(s.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Kotak_Saran_PTA_Babel_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    sound.playTap();
    window.print();
  };

  const handleResetData = () => {
    sound.playTap();
    if (window.confirm('Reset data dashboard ke data simulasi default PTA Bangka Belitung?')) {
      resetToDefaultSeed();
      onRefreshData();
    }
  };

  const handleUpdateStatus = (id: string, status: FollowUpStatus, notes?: string) => {
    updateSubmissionStatus(id, status, notes);
    onRefreshData();
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* Top Bar matching user mockup */}
      <div className="bg-[#034426] text-white px-4 sm:px-8 py-3.5 border-b-2 border-amber-400 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md print:bg-white print:text-black">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <PtaLogo size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase font-serif">
                DASHBOARD KOTAK SARAN DIGITAL
              </h1>
              <span className="text-[10px] font-bold bg-amber-400 text-emerald-950 px-2 py-0.2 rounded font-sans">
                IKM ONLINE
              </span>
            </div>
            <p className="text-xs text-emerald-200">
              Pengadilan Tinggi Agama Kep. Bangka Belitung
            </p>
          </div>
        </div>

        {/* Date / Time and Navigation Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end print:hidden">
          <div className="flex items-center gap-1.5 text-xs text-emerald-100 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-700/50">
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>

          <button
            type="button"
            onClick={onBackToKiosk}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold border border-emerald-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-300" />
            <span>Kembali ke Kiosk</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 space-y-6">
        {/* Navigation Tabs & Actions Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-2 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl">
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setActiveTab('ringkasan');
              }}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'ringkasan'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              05. Ringkasan &amp; IKM
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setActiveTab('grafik');
              }}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'grafik'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              06. Grafik &amp; Analitik
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setActiveTab('daftar');
              }}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'daftar'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kotak Masuk Saran ({stats.withFeedbackCount})
            </button>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Cetak</span>
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Export Laporan</span>
            </button>
            <button
              type="button"
              onClick={handleResetData}
              title="Reset ke data awal"
              className="p-2 text-slate-400 hover:text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab 1: Ringkasan (Mockup 05) */}
        {activeTab === 'ringkasan' && (
          <div className="space-y-6">
            {/* Top Grid: Total Respon & Rangkuman Kepuasan */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Card 1: Total Respon (Mockup 05 Left) */}
              <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Total Respon
                    </span>
                    <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                      <FileText className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="mt-4 text-5xl sm:text-6xl font-black text-slate-900 tracking-tight font-serif">
                    {stats.total}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                    <TrendingUp className="w-4 h-4" />
                    <span>↑ 12% dari bulan lalu</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Indeks IKM PTA Babel:</span>
                  <span className="font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {stats.ikmValue} (Sangat Baik / A)
                  </span>
                </div>
              </div>

              {/* Card 2: Rangkuman Kepuasan 5 Emoticons (Mockup 05 Right) */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Rangkuman Kepuasan
                  </h2>
                  <span className="text-xs text-slate-400">
                    Periode Berjalan Tahun 2026
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 sm:gap-3 text-center">
                  {/* Rating 1: Tidak Puas */}
                  <div className="p-3 sm:p-4 rounded-xl bg-red-50/60 border border-red-200/80 flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl mb-1 select-none">😡</span>
                    <div className="text-lg sm:text-2xl font-black text-slate-800">
                      {stats.counts[1]}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-red-600">
                      ({stats.percentages[1]}%)
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-1">
                      Tidak Puas
                    </div>
                  </div>

                  {/* Rating 2: Kurang Puas */}
                  <div className="p-3 sm:p-4 rounded-xl bg-orange-50/60 border border-orange-200/80 flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl mb-1 select-none">🙁</span>
                    <div className="text-lg sm:text-2xl font-black text-slate-800">
                      {stats.counts[2]}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-orange-600">
                      ({stats.percentages[2]}%)
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-1">
                      Kurang Puas
                    </div>
                  </div>

                  {/* Rating 3: Cukup */}
                  <div className="p-3 sm:p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl mb-1 select-none">😐</span>
                    <div className="text-lg sm:text-2xl font-black text-slate-800">
                      {stats.counts[3]}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-amber-700">
                      ({stats.percentages[3]}%)
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-1">
                      Cukup
                    </div>
                  </div>

                  {/* Rating 4: Puas */}
                  <div className="p-3 sm:p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl mb-1 select-none">😊</span>
                    <div className="text-lg sm:text-2xl font-black text-slate-800">
                      {stats.counts[4]}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-emerald-700">
                      ({stats.percentages[4]}%)
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-1">
                      Puas
                    </div>
                  </div>

                  {/* Rating 5: Sangat Puas */}
                  <div className="p-3 sm:p-4 rounded-xl bg-green-50/90 border-2 border-emerald-400 flex flex-col items-center shadow-xs">
                    <span className="text-2xl sm:text-3xl mb-1 select-none">😍</span>
                    <div className="text-lg sm:text-2xl font-black text-emerald-900">
                      {stats.counts[5]}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-emerald-700">
                      ({stats.percentages[5]}%)
                    </div>
                    <div className="text-[10px] sm:text-xs text-emerald-900 font-bold mt-1">
                      Sangat Puas
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 3 Status Cards (Mockup 05 Bottom) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Card 1: Total Saran & Masukan */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                    <span className="p-1 rounded bg-blue-50 text-blue-600">💬</span>
                    <span>Saran &amp; Masukan</span>
                  </div>
                  <div className="mt-3 text-4xl font-black text-slate-800">
                    {stats.withFeedbackCount}
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-1">
                    Total masukan tertulis
                  </div>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <FileText className="w-8 h-8" />
                </div>
              </div>

              {/* Card 2: Perlu Tindak Lanjut */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>Perlu Tindak Lanjut</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    {stats.statusCounts.proses + stats.statusCounts.belum}
                  </span>
                </div>
                <div className="mt-3 text-4xl font-black text-amber-900">
                  {stats.statusCounts.proses + stats.statusCounts.belum}
                  <span className="text-xs font-normal text-slate-500 ml-2">Masukan</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFilterStatus('belum');
                    setActiveTab('daftar');
                  }}
                  className="mt-4 text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center justify-end gap-1 cursor-pointer"
                >
                  Lihat Detail →
                </button>
              </div>

              {/* Card 3: Sudah Ditindaklanjuti */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Sudah Ditindaklanjuti</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {stats.statusCounts.selesai}
                  </span>
                </div>
                <div className="mt-3 text-4xl font-black text-emerald-900">
                  {stats.statusCounts.selesai}
                  <span className="text-xs font-normal text-slate-500 ml-2">Masukan</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFilterStatus('selesai');
                    setActiveTab('daftar');
                  }}
                  className="mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center justify-end gap-1 cursor-pointer"
                >
                  Lihat Detail →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Grafik & Analitik (Mockup 06) */}
        {activeTab === 'grafik' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Grafik Kepuasan Pelayanan (Mockup 06 Left Bar Chart) */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                      Grafik Kepuasan Pelayanan
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Persentase distribusi respon masyarakat pencari keadilan
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Total {stats.total} Suara
                  </span>
                </div>

                {/* Vertical Bar Chart Bars */}
                <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-200">
                  {/* Rating 1 */}
                  <div className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-xs font-bold text-slate-700 mb-1">
                      {stats.percentages[1]}%
                    </span>
                    <div
                      className="w-full max-w-[48px] bg-red-500 rounded-t-lg transition-all duration-500 group-hover:bg-red-600"
                      style={{ height: `${Math.max(Number(stats.percentages[1].replace(',', '.')), 3)}%` }}
                    />
                    <div className="mt-2 text-center">
                      <span className="text-base select-none">😡</span>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-semibold leading-tight">
                        Tidak Puas
                      </p>
                    </div>
                  </div>

                  {/* Rating 2 */}
                  <div className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-xs font-bold text-slate-700 mb-1">
                      {stats.percentages[2]}%
                    </span>
                    <div
                      className="w-full max-w-[48px] bg-orange-500 rounded-t-lg transition-all duration-500 group-hover:bg-orange-600"
                      style={{ height: `${Math.max(Number(stats.percentages[2].replace(',', '.')), 4)}%` }}
                    />
                    <div className="mt-2 text-center">
                      <span className="text-base select-none">🙁</span>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-semibold leading-tight">
                        Kurang Puas
                      </p>
                    </div>
                  </div>

                  {/* Rating 3 */}
                  <div className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-xs font-bold text-slate-700 mb-1">
                      {stats.percentages[3]}%
                    </span>
                    <div
                      className="w-full max-w-[48px] bg-amber-400 rounded-t-lg transition-all duration-500 group-hover:bg-amber-500"
                      style={{ height: `${Math.max(Number(stats.percentages[3].replace(',', '.')), 8)}%` }}
                    />
                    <div className="mt-2 text-center">
                      <span className="text-base select-none">😐</span>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-semibold leading-tight">
                        Cukup
                      </p>
                    </div>
                  </div>

                  {/* Rating 4 */}
                  <div className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-xs font-bold text-slate-700 mb-1">
                      {stats.percentages[4]}%
                    </span>
                    <div
                      className="w-full max-w-[48px] bg-emerald-500 rounded-t-lg transition-all duration-500 group-hover:bg-emerald-600"
                      style={{ height: `${Math.max(Number(stats.percentages[4].replace(',', '.')), 20)}%` }}
                    />
                    <div className="mt-2 text-center">
                      <span className="text-base select-none">😊</span>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-semibold leading-tight">
                        Puas
                      </p>
                    </div>
                  </div>

                  {/* Rating 5 */}
                  <div className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-xs font-bold text-emerald-800 mb-1">
                      {stats.percentages[5]}%
                    </span>
                    <div
                      className="w-full max-w-[48px] bg-emerald-700 rounded-t-lg transition-all duration-500 group-hover:bg-emerald-800 shadow-xs"
                      style={{ height: `${Math.max(Number(stats.percentages[5].replace(',', '.')), 60)}%` }}
                    />
                    <div className="mt-2 text-center">
                      <span className="text-base select-none">😍</span>
                      <p className="text-[10px] sm:text-xs text-emerald-800 font-bold leading-tight">
                        Sangat Puas
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Jenis Masukan Donut / Category Breakdown (Mockup 06 Right) */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                    Jenis Masukan ({stats.withFeedbackCount} Total)
                  </h2>

                  <div className="flex items-center gap-6">
                    {/* SVG Donut */}
                    <div className="relative w-32 h-32 shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        {/* Donut Background */}
                        <circle cx="18" cy="18" r="14" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                        {/* Segment 1: PTSP */}
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="transparent"
                          stroke="#047857"
                          strokeWidth="4"
                          strokeDasharray="30 70"
                          strokeDashoffset="0"
                        />
                        {/* Segment 2: Petugas */}
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="transparent"
                          stroke="#10b981"
                          strokeWidth="4"
                          strokeDasharray="20 80"
                          strokeDashoffset="-30"
                        />
                        {/* Segment 3: Sarana */}
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="transparent"
                          stroke="#f59e0b"
                          strokeWidth="4"
                          strokeDasharray="17 83"
                          strokeDashoffset="-50"
                        />
                        {/* Segment 4: Waktu */}
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="transparent"
                          stroke="#3b82f6"
                          strokeWidth="4"
                          strokeDasharray="15 85"
                          strokeDashoffset="-67"
                        />
                        {/* Segment 5: Sistem */}
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="transparent"
                          stroke="#8b5cf6"
                          strokeWidth="4"
                          strokeDasharray="12 88"
                          strokeDashoffset="-82"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-black text-slate-800">{stats.withFeedbackCount}</span>
                        <span className="text-[9px] text-slate-400 uppercase font-bold">Total</span>
                      </div>
                    </div>

                    {/* Category Legend List */}
                    <div className="flex-1 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#047857]" />
                          <span className="text-slate-700">Pelayanan PTSP</span>
                        </div>
                        <span className="font-bold text-slate-900">{stats.categoryCounts.ptsp}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                          <span className="text-slate-700">Petugas</span>
                        </div>
                        <span className="font-bold text-slate-900">{stats.categoryCounts.petugas}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                          <span className="text-slate-700">Waktu Pelayanan</span>
                        </div>
                        <span className="font-bold text-slate-900">{stats.categoryCounts.waktu}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />
                          <span className="text-slate-700">Sistem / Website</span>
                        </div>
                        <span className="font-bold text-slate-900">{stats.categoryCounts.sistem}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                          <span className="text-slate-700">Sarana &amp; Prasarana</span>
                        </div>
                        <span className="font-bold text-slate-900">{stats.categoryCounts.sarana}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                          <span className="text-slate-700">Lainnya</span>
                        </div>
                        <span className="font-bold text-slate-900">{stats.categoryCounts.lainnya}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Prioritas Perbaikan:</span>
                  <span className="font-semibold text-amber-700">Sarana &amp; Waktu Layanan</span>
                </div>
              </div>
            </div>

            {/* Status Tindak Lanjut Row (Mockup 06 Bottom) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                Status Tindak Lanjut
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-emerald-950">
                      {stats.statusCounts.selesai}
                    </div>
                    <div className="text-xs font-semibold text-emerald-800">Selesai</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-amber-950">
                      {stats.statusCounts.proses}
                    </div>
                    <div className="text-xs font-semibold text-amber-800">Proses</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 border border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-slate-500 text-white flex items-center justify-center">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">
                      {stats.statusCounts.belum}
                    </div>
                    <div className="text-xs font-semibold text-slate-600">Belum Diproses</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Kotak Masuk Saran Table */}
        {activeTab === 'daftar' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden space-y-4 p-5">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari saran, nama, telepon..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  aria-label="Filter berdasarkan kategori masukan"
                  className="text-xs py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-700"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="ptsp">Pelayanan PTSP</option>
                  <option value="petugas">Petugas</option>
                  <option value="waktu">Waktu Pelayanan</option>
                  <option value="sistem">Sistem / Website</option>
                  <option value="sarana">Sarana &amp; Prasarana</option>
                  <option value="lainnya">Lainnya</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  aria-label="Filter berdasarkan status tindak lanjut"
                  className="text-xs py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-700"
                >
                  <option value="all">Semua Status</option>
                  <option value="belum">Belum Diproses</option>
                  <option value="proses">Dalam Proses</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>
            </div>

            {/* Table of Submissions */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3.5">Waktu</th>
                    <th className="py-3 px-3">Rating</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-4">Saran &amp; Masukan</th>
                    <th className="py-3 px-3">Pengirim</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        Tidak ada saran yang sesuai dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((row) => {
                      const emojiMap: Record<number, string> = {
                        1: '😡',
                        2: '🙁',
                        3: '😐',
                        4: '😊',
                        5: '😍',
                      };
                      return (
                        <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3.5 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                            {new Date(row.timestamp).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                            })}{' '}
                            {new Date(row.timestamp).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="text-base select-none mr-1.5">
                              {emojiMap[row.rating]}
                            </span>
                            <span className="font-semibold text-slate-700">{row.rating}/5</span>
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {row.categoryLabel || CATEGORY_LABELS[row.category as FeedbackCategory] || '-'}
                            </span>
                          </td>

                          <td className="py-3 px-4 max-w-xs truncate text-slate-800 font-medium">
                            {row.message || <em className="text-slate-400">(Hanya rating)</em>}
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                            <div>{row.name || 'Anonim'}</div>
                            {row.phone && (
                              <div className="text-[10px] text-slate-400 font-mono">{row.phone}</div>
                            )}
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap">
                            {row.status === 'selesai' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" /> Selesai
                              </span>
                            )}
                            {row.status === 'proses' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                                <Clock className="w-3 h-3" /> Proses
                              </span>
                            )}
                            {row.status === 'belum' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                                <AlertCircle className="w-3 h-3" /> Belum
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                sound.playTap();
                                setSelectedItemForModal(row);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Detail</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Staff Feedback Detail Modal */}
      {selectedItemForModal && (
        <FeedbackDetailModal
          item={selectedItemForModal}
          onClose={() => setSelectedItemForModal(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

import { FeedbackSubmission, FollowUpStatus, RatingScore, FeedbackCategory } from '../types';

const STORAGE_KEY = 'pta_babel_kotak_saran_data_v1';

export const CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  ptsp: 'Pelayanan PTSP',
  sistem: 'Sistem / Website',
  petugas: 'Petugas',
  sarana: 'Sarana & Prasarana',
  waktu: 'Waktu Pelayanan',
  lainnya: 'Lainnya',
};

const SEED_SUGGESTIONS: Array<Partial<FeedbackSubmission>> = [
  {
    rating: 5,
    category: 'ptsp',
    message: 'Pelayanan di meja PTSP sangat ramah dan informatif. Berkas saya selesai dalam waktu singkat tanpa kendala. Terima kasih PTA Babel!',
    name: 'Bapak Hendra Kusuma',
    phone: '0812-7890-xxxx',
    status: 'selesai',
    notes: 'Apresiasi dicatat pada rapat monev bulanan PTSP.',
  },
  {
    rating: 5,
    category: 'petugas',
    message: 'Petugas keamanan dan resepsionis sangat santun mengarahkan alur persidangan dan ruang tunggu.',
    name: 'Ibu Rahmawati',
    phone: '0813-6712-xxxx',
    status: 'selesai',
    notes: 'Sudah disampaikan dalam briefing pagi seluruh staf keamanan & frontliner.',
  },
  {
    rating: 4,
    category: 'sarana',
    message: 'Ruang tunggu sudah sangat bersih dan sejuk. Saran agar colokan listrik / charging station untuk pengunjung bisa diperbanyak.',
    name: 'Agus Setiawan',
    phone: '0852-4411-xxxx',
    status: 'proses',
    notes: 'Sedang diajukan penambahan 2 unit multi-socket charging station di ruang tunggu PTSP.',
  },
  {
    rating: 4,
    category: 'sistem',
    message: 'Aplikasi antrian dan website informatif, namun mohon panduan alur banding online dibuatkan infografis video singkat di TV ruang tunggu.',
    name: 'Dedy Irawan, S.H.',
    phone: '0819-2345-xxxx',
    status: 'selesai',
    notes: 'Video tutorial alur perkara banding telah ditayangkan di monitor PTSP.',
  },
  {
    rating: 3,
    category: 'waktu',
    message: 'Waktu verifikasi berkas agak menunggu karena sedang pergantian jam istirahat. Mohon petugas piket selalu standby.',
    name: 'M. Yusuf',
    phone: '0821-8901-xxxx',
    status: 'selesai',
    notes: 'Jadwal piket makan siang telah diatur bergantian (shift) agar loket tidak kosong.',
  },
  {
    rating: 5,
    category: 'ptsp',
    message: 'Fasilitas ramah disabilitas dan lansia sangat baik, ada jalur landai dan kursi roda yang siap sedia.',
    name: 'Hj. Fatimah',
    phone: '0812-3321-xxxx',
    status: 'selesai',
    notes: 'Pemeliharaan sarana prioritas kelompok rentan terus dimonitor.',
  },
  {
    rating: 2,
    category: 'sarana',
    message: 'Dispenser air minum di dekat toilet lantai 1 habis galonnya tadi siang. Mohon diperhatikan kebersihannya.',
    name: 'Pengunjung PTSP',
    phone: '',
    status: 'proses',
    notes: 'Petugas kebersihan (OB) telah diinstruksikan cek berkala setiap 2 jam.',
  },
  {
    rating: 1,
    category: 'waktu',
    message: 'Menunggu tanda tangan legalisir agak lama karena pejabat terkait sedang ada agenda sidang mendadak.',
    name: 'Ahmad Faisal',
    phone: '0813-8822-xxxx',
    status: 'belum',
    notes: 'Akan dievaluasi pendelegasian wewenang saat pejabat berhalangan hadir.',
  },
  {
    rating: 5,
    category: 'petugas',
    message: 'Pelayanan prima berintegritas tanpa pungli, sangat transparan dan sesuai SOP Mahkamah Agung.',
    name: 'Adv. Herman, S.H.',
    phone: '0811-9988-xxxx',
    status: 'selesai',
    notes: 'Diteruskan ke Tim Pembangunan Zona Integritas (ZI) WBK/WBBM.',
  },
];

export function getStoredSubmissions(): FeedbackSubmission[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = generateSeedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSubmission(newEntry: Omit<FeedbackSubmission, 'id' | 'timestamp' | 'status'> & { id?: string }): FeedbackSubmission {
  const current = getStoredSubmissions();
  const entry: FeedbackSubmission = {
    id: newEntry.id || `pta-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    rating: newEntry.rating,
    hasSuggestion: newEntry.hasSuggestion,
    category: newEntry.category,
    categoryLabel: newEntry.category ? CATEGORY_LABELS[newEntry.category] : undefined,
    message: newEntry.message?.trim(),
    name: newEntry.name?.trim(),
    phone: newEntry.phone?.trim(),
    status: 'belum',
    updatedAt: new Date().toISOString(),
  };

  const updated = [entry, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return entry;
}

export function updateSubmissionStatus(id: string, status: FollowUpStatus, notes?: string): void {
  const current = getStoredSubmissions();
  const updated = current.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        status,
        notes: notes !== undefined ? notes : item.notes,
        updatedAt: new Date().toISOString(),
      };
    }
    return item;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function resetToDefaultSeed(): FeedbackSubmission[] {
  const seeded = generateSeedData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

function generateSeedData(): FeedbackSubmission[] {
  const list: FeedbackSubmission[] = [];
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  // Exact numbers from user mockup:
  // Sangat Puas: 218
  // Puas: 79
  // Cukup: 21
  // Kurang Puas: 6
  // Tidak Puas: 3
  // Total: 327
  // Total Masukan (with text): 47

  // Add the 9 detailed text suggestions
  SEED_SUGGESTIONS.forEach((sug, i) => {
    const timeOffset = (i * 1.5 + 0.5) * oneDay;
    list.push({
      id: `seed-text-${i + 1}`,
      timestamp: new Date(now - timeOffset).toISOString(),
      rating: sug.rating as RatingScore,
      hasSuggestion: true,
      category: sug.category as FeedbackCategory,
      categoryLabel: sug.category ? CATEGORY_LABELS[sug.category as FeedbackCategory] : undefined,
      message: sug.message,
      name: sug.name,
      phone: sug.phone,
      status: sug.status as FollowUpStatus,
      notes: sug.notes,
      updatedAt: new Date(now - timeOffset + 3600000).toISOString(),
    });
  });

  // Additional suggestions to reach total 47 suggestions
  const additionalCategories: FeedbackCategory[] = ['ptsp', 'petugas', 'waktu', 'sistem', 'sarana', 'lainnya'];
  for (let i = 10; i <= 47; i++) {
    const cat = additionalCategories[i % additionalCategories.length];
    const isHighRating = i % 4 !== 0;
    const rating: RatingScore = isHighRating ? (i % 2 === 0 ? 5 : 4) : (i % 3 === 0 ? 3 : 2);
    const status: FollowUpStatus = i < 38 ? 'selesai' : (i < 41 ? 'proses' : 'belum');
    const timeOffset = (Math.random() * 25 + 0.2) * oneDay;

    list.push({
      id: `seed-sug-${i}`,
      timestamp: new Date(now - timeOffset).toISOString(),
      rating,
      hasSuggestion: true,
      category: cat,
      categoryLabel: CATEGORY_LABELS[cat],
      message: getQuickText(cat, rating),
      name: i % 3 === 0 ? `Masyarakat Pencari Keadilan #${i}` : undefined,
      phone: i % 4 === 0 ? `0812-7100-${1000 + i}` : undefined,
      status,
      notes: status === 'selesai' ? 'Sudah ditindaklanjuti oleh koordinator bagian.' : (status === 'proses' ? 'Sedang dalam peninjauan sarpras/petugas.' : undefined),
      updatedAt: new Date(now - timeOffset).toISOString(),
    });
  }

  // Now add quick rating-only responses (hasSuggestion: false) to match the exact mockup totals:
  // Target totals:
  // Sangat Puas (5): 218
  // Puas (4): 79
  // Cukup (3): 21
  // Kurang Puas (2): 6
  // Tidak Puas (1): 3
  const countCurrent = (r: RatingScore) => list.filter(item => item.rating === r).length;

  const targets: Record<RatingScore, number> = {
    5: 218,
    4: 79,
    3: 21,
    2: 6,
    1: 3,
  };

  ([1, 2, 3, 4, 5] as RatingScore[]).forEach((rating) => {
    const currentCount = countCurrent(rating);
    const needed = targets[rating] - currentCount;
    for (let j = 0; j < needed; j++) {
      const timeOffset = (Math.random() * 30 + 0.05) * oneDay;
      list.push({
        id: `seed-rating-${rating}-${j}`,
        timestamp: new Date(now - timeOffset).toISOString(),
        rating,
        hasSuggestion: false,
        status: 'selesai',
        updatedAt: new Date(now - timeOffset).toISOString(),
      });
    }
  });

  // Sort descending by timestamp
  list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return list;
}

function getQuickText(cat: FeedbackCategory, rating: RatingScore): string {
  if (rating >= 4) {
    const msgs: Record<FeedbackCategory, string[]> = {
      ptsp: ['Pelayanan ramah, cepat dan petugas memberikan penjelasan dengan jelas.', 'Alur permohonan akta cerai/kasasi sangat transparan.'],
      sistem: ['Layanan digital e-Court & SIPP sangat membantu percepatan perkara.', 'Tampilan informasi perkara jelas dan mudah dipahami.'],
      petugas: ['Sikap petugas sangat santun, beretika, dan tidak ada biaya tersembunyi.', 'Pelayanan sangat humanis dan profesional.'],
      sarana: ['Ruang tunggu ber-AC, musholla bersih, dan toilet wangi.', 'Tersedia air minum dan permen di meja informasi, sangat mengayomi.'],
      waktu: ['Pelayanan tepat waktu sesuai estimasi standar operasional.', 'Proses antrian tertib dan efisien.'],
      lainnya: ['Secara keseluruhan pelayanan Pengadilan Tinggi Agama Babel sangat memuaskan.', 'Mendukung penuh PTA Babel menuju WBBM.'],
    };
    const list = msgs[cat] || msgs.ptsp;
    return list[Math.floor(Math.random() * list.length)];
  } else {
    const msgs: Record<FeedbackCategory, string[]> = {
      ptsp: ['Bisa dibantu petunjuk papan alur yang lebih besar di depan pintu masuk.', 'Mohon brosur persyaratan perkara diperbanyak di meja informasi.'],
      sistem: ['Koneksi WiFi pengunjung sesekali lambat saat membuka e-Court.', 'Formulir online mohon disederhanakan formatnya.'],
      petugas: ['Petugas mohon lebih cepat tanggap saat pengunjung kebingungan.', 'Agar senyum, salam, sapa lebih konsisten.'],
      sarana: ['Suhu AC di sudut ruang tunggu terkadang terlalu dingin.', 'Tempat parkir motor mohon ditambah kanopi peneduh.'],
      waktu: ['Waktu tunggu panggilan konsultasi mohon bisa lebih dipersingkat.', 'Estimasi jam pelayanan mohon ditepati.'],
      lainnya: ['Perlu peningkatan komunikasi informasi berkas.', 'Mohon evaluasi berkala.'],
    };
    const list = msgs[cat] || msgs.ptsp;
    return list[Math.floor(Math.random() * list.length)];
  }
}

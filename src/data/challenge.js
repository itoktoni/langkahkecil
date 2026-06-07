export const kategoriChallenge = {
  "Kitab Suci": { emoji: '📖', bg: '#E8F5E9', color: '#4CAF50' },
  "Matematika": { emoji: '✖️', bg: '#E3F2FD', color: '#2196F3' },
  "Bahasa": { emoji: '🔤', bg: '#FFF3E0', color: '#FF9800' },
  "IPA": { emoji: '🔬', bg: '#F3E5F5', color: '#9C27B0' },
  "Lainnya": { emoji: '📝', bg: '#FCE4EC', color: '#E91E63' }
}

export const challengeByAnak = {
  1: {
    challenges: [
      { id: 1, category: "Kitab Suci", title: 'Surat An-Naba', notes: 'Sudah hafal ayat 1-5, masih terbata-bata', emoji: '📖', bg: '#E8F5E9', color: '#4CAF50', points: 7, maxPoints: 10 },
      { id: 2, category: 'Matematika', title: 'Perkalian 1-5', notes: 'Hafal perkalian 1-3, belum lancar 4-5', emoji: '✖️', bg: '#E3F2FD', color: '#2196F3', points: 3, maxPoints: 10 },
      { id: 3, category: 'Bahasa', title: 'Kosakata Bahasa Inggris', notes: 'Sudah tahu nama hewan, masih lupa nama buah', emoji: '🔤', bg: '#FFF3E0', color: '#FF9800', points: 2, maxPoints: 10 }
    ],
    challengeHistory: [
      { id: 101, category: "Kitab Suci", title: 'Surat Al-Fatihah', emoji: '📖', bg: '#E8F5E9', maxPoints: 10 },
      { id: 104, category: "Kitab Suci", title: 'Surat An-Naba', emoji: '📖', bg: '#E8F5E9', maxPoints: 10 },
      { id: 105, category: "Kitab Suci", title: 'Surat Al-Baqarah', emoji: '📖', bg: '#E8F5E9', maxPoints: 15 },
      { id: 102, category: 'Matematika', title: 'Penjumlahan 1-10', emoji: '➕', bg: '#F3E5F5', maxPoints: 10 },
      { id: 103, category: 'Bahasa', title: 'Kosakata Hewan', emoji: '🔤', bg: '#FFF3E0', maxPoints: 8 }
    ]
  },
  2: {
    challenges: [
      { id: 1, category: "Kitab Suci", title: 'Surat Al-Fatihah', notes: 'Sudah lancar, tinggal tartil', emoji: '📖', bg: '#E8F5E9', color: '#4CAF50', points: 10, maxPoints: 10 },
      { id: 2, category: 'Matematika', title: 'Menghitung 1-20', notes: 'Masih bolak-balik lupa angka 13 dan 15', emoji: '🔢', bg: '#FCE4EC', color: '#E91E63', points: 4, maxPoints: 10 }
    ],
    challengeHistory: [
      { id: 101, category: 'Matematika', title: 'Menghitung 1-10', emoji: '🔢', bg: '#FCE4EC', maxPoints: 10 },
      { id: 102, category: 'IPA', title: 'Warna & Bentuk', emoji: '🔬', bg: '#F3E5F5', maxPoints: 8 },
      { id: 103, category: 'Bahasa', title: 'Sapaan Sehari-hari', emoji: '🔤', bg: '#FFF3E0', maxPoints: 6 }
    ]
  }
}

export const defaultChallenge = {
  challenges: [],
  challengeHistory: []
}

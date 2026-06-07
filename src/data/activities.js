const meta = {
  storytelling: { emoji: '📖', title: 'Story Telling', desc: 'Anak belajar mendengar, bercerita dan menyampaikan ide secara verbal.', color: '#4CAF50', bg: '#E8F5E9', feature: 'story', skills: ['spiritual', 'karakter', 'kreatifitas', 'emosi', 'sosial'] },
  bermain_peran: { emoji: '🎭', title: 'Bermain Peran', desc: 'Anak belajar memahami perspektif orang lain melalui peran.', color: '#FF9800', bg: '#FFF3E0', feature: 'roleplay', skills: ['karakter', 'sosial', 'emosi', 'kreatifitas'] },
  permainan: { emoji: '🎲', title: 'Permainan', desc: 'Anak belajar aturan, kerja sama, dan sportivitas.', color: '#E91E63', bg: '#FCE4EC', feature: 'game', skills: ['disiplin', 'sosial', 'karakter', 'kreatifitas'] },
  monolog: { emoji: '🎤', title: 'Monolog', desc: 'Anak belajar berani tampil dan berbicara di depan umum.', color: '#9C27B0', bg: '#F3E5F5', feature: 'monolog', skills: ['karakter', 'sosial', 'kreatifitas'] },
  proyek_kreatif: { emoji: '🎨', title: 'Proyek Kreatif & Seni', desc: 'Anak belajar mengekspresikan diri melalui seni.', color: '#2196F3', bg: '#E3F2FD', feature: 'project', skills: ['kreatifitas', 'kemandirian', 'disiplin'] },
  musik_gerak: { emoji: '🎵', title: 'Musik & Gerak', desc: 'Anak belajar ritme, koordinasi, dan ekspresi tubuh.', color: '#FF5722', bg: '#FBE9E7', feature: 'music', skills: ['kreatifitas', 'kesehatan', 'emosi', 'disiplin'] },
  puzzle: { emoji: '🧩', title: 'Puzzle & Problem Solving', desc: 'Anak belajar berpikir logis dan memecahkan masalah.', color: '#673AB7', bg: '#EDE7F6', feature: 'puzzle', skills: ['kreatifitas', 'disiplin', 'kemandirian'] },
  mindfulness: { emoji: '🧘', title: 'Mindfulness & Refleksi', desc: 'Anak belajar mengenali perasaan dan menenangkan diri.', color: '#795548', bg: '#EFEBE9', feature: 'mindfulness', skills: ['emosi', 'spiritual', 'disiplin'] },
  outdoor: { emoji: '🌿', title: 'Outdoor Exploration', desc: 'Anak belajar mengenal alam dan lingkungan sekitar.', color: '#009688', bg: '#E0F2F1', feature: 'outdoor', skills: ['kesehatan', 'kemandirian', 'kreatifitas', 'spiritual'] },
  ilmu_pengetahuan: { emoji: '🔬', title: 'Ilmu Pengetahuan & Literasi', desc: 'Anak belajar sains, eksperimen, dan meningkatkan kemampuan literasi.', color: '#0D47A1', bg: '#E3F2FD', feature: 'ilmu_pengetahuan', skills: ['kreatifitas', 'disiplin', 'fokus', 'berani_mencoba'] },
  worksheet: { emoji: '📝', title: 'Worksheet Anak', desc: 'Worksheet latihan menulis kutipan inspiratif untuk anak. Bisa dicetak!', color: '#176c33', bg: '#E1F2E5', feature: 'worksheet', skills: ['disiplin', 'fokus', 'kreatifitas'] }
}

const globs = {
  storytelling: import.meta.glob('./aktivitas/storytelling/*.json', { eager: true }),
  bermain_peran: import.meta.glob('./aktivitas/bermain_peran/*.json', { eager: true }),
  permainan: import.meta.glob('./aktivitas/permainan/*.json', { eager: true }),
  monolog: import.meta.glob('./aktivitas/monolog/*.json', { eager: true }),
  proyek_kreatif: import.meta.glob('./aktivitas/proyek_kreatif/*.json', { eager: true }),
  musik_gerak: import.meta.glob('./aktivitas/musik_gerak/*.json', { eager: true }),
  puzzle: import.meta.glob('./aktivitas/puzzle/*.json', { eager: true }),
  mindfulness: import.meta.glob('./aktivitas/mindfulness/*.json', { eager: true }),
  outdoor: import.meta.glob('./aktivitas/outdoor/*.json', { eager: true }),
  ilmu_pengetahuan: import.meta.glob('./aktivitas/ilmu_pengetahuan/*.json', { eager: true })
}

function loadItems(globObj) {
  const result = []
  for (const m of Object.values(globObj)) {
    const item = m.default || m
    if (Array.isArray(item)) result.push(...item)
    else result.push(item)
  }
  return result
}

function collectAges(items) {
  const set = new Set()
  for (const item of items) {
    for (const age of (item.ages || [])) set.add(age)
  }
  return [...set].sort((a, b) => a - b)
}

function buildAktivitasData() {
  return Object.entries(meta).map(([key, m]) => {
    const items = loadItems(globs[key] || {})
    const ages = collectAges(items)
    const contentKey = {
      storytelling: 'stories',
      bermain_peran: 'roles',
      permainan: 'games',
      monolog: 'scripts',
      proyek_kreatif: 'projects',
      musik_gerak: 'songs',
      puzzle: 'puzzles',
      mindfulness: 'exercises',
      outdoor: 'activities',
      ilmu_pengetahuan: 'experiments'
    }[key]
    return { key, ...m, ages, [contentKey]: items }
  })
}

export const aktivitasData = buildAktivitasData()

export function filterActivities(childAge, skillKey) {
  return aktivitasData.map(a => {
    const contentKey = {
      storytelling: 'stories', bermain_peran: 'roles', permainan: 'games',
      monolog: 'scripts', proyek_kreatif: 'projects', musik_gerak: 'songs',
      puzzle: 'puzzles', mindfulness: 'exercises', outdoor: 'activities',
      ilmu_pengetahuan: 'experiments'
    }[a.key]
    const items = (a[contentKey] || []).filter(item => {
      const ageOk = childAge == null || (item.ages && item.ages.includes(childAge))
      const skillOk = !skillKey || !item.skills || item.skills.includes(skillKey)
      return ageOk && skillOk
    })
    return { ...a, [contentKey]: items }
  }).filter(a => {
    if (a.key === 'worksheet') return true
    const contentKey = {
      storytelling: 'stories', bermain_peran: 'roles', permainan: 'games',
      monolog: 'scripts', proyek_kreatif: 'projects', musik_gerak: 'songs',
      puzzle: 'puzzles', mindfulness: 'exercises', outdoor: 'activities',
      ilmu_pengetahuan: 'experiments'
    }[a.key]
    return (a[contentKey] || []).length > 0
  })
}

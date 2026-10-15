/* Quiz content — illustrative demo data.
   Every name, question, score and play-count on this site is a placeholder. */

window.QUIZ_DATA = {
  title: 'Seberapa receh kamu hari ini?',
  category: 'Kepribadian',

  questions: [
    {
      q: 'Grup keluarga berbunyi. Kamu…',
      opts: [
        { t: 'Buka dalam tiga detik', s: 2 },
        { t: 'Diamkan, nanti dibalas', s: 1 },
        { t: 'Keluar dari grup', s: 0 },
        { t: 'Balas pakai stiker', s: 2 }
      ]
    },
    {
      q: 'Jam 9 malam, kamu paling pengin…',
      opts: [
        { t: 'Rebahan sambil scroll', s: 2 },
        { t: 'Ngerjain side project', s: 0 },
        { t: 'Nongkrong sama teman', s: 1 },
        { t: 'Tidur. Jelas.', s: 1 }
      ]
    },
    {
      q: 'Ada meme baru di grup. Kamu…',
      opts: [
        { t: 'Langsung repost', s: 2 },
        { t: 'Simpan buat nanti', s: 1 },
        { t: 'Sudah lihat kemarin', s: 0 },
        { t: 'Bikin versi sendiri', s: 2 }
      ]
    },
    {
      q: 'Kuota tinggal 200 MB. Kamu…',
      opts: [
        { t: 'Panik, cari wifi', s: 1 },
        { t: 'Hemat, matikan video', s: 0 },
        { t: 'Ya sudah, lanjut', s: 2 },
        { t: 'Chat operator minta bonus', s: 2 }
      ]
    },
    {
      q: 'Rapat jam 8 pagi. Kamu…',
      opts: [
        { t: 'Sudah ngopi dari jam 6', s: 0 },
        { t: 'Join dari kasur', s: 2 },
        { t: 'Telat, tapi hadir', s: 1 },
        { t: 'Kirim stiker "siap"', s: 2 }
      ]
    },
    {
      q: 'Ditanya "sudah makan?" Kamu…',
      opts: [
        { t: 'Jawab pakai meme', s: 2 },
        { t: 'Jawab serius', s: 0 },
        { t: 'Balas stiker', s: 2 },
        { t: 'Kirim foto piring', s: 1 }
      ]
    }
  ],

  /* score band -> result. Bands are inclusive lower bounds, checked high to low. */
  results: [
    {
      min: 9,
      art: 'halftone',
      title: 'Si Paling Receh',
      desc: 'Kamu menandai hampir semuanya di kolom paling receh. Grup keluargamu beruntung punya kamu — dan sedikit kewalahan.'
    },
    {
      min: 5,
      art: 'ember',
      title: 'Receh Secukupnya',
      desc: 'Kamu tahu kapan harus lucu dan kapan harus serius. Recehnya pas, tidak berlebihan, tidak pula menyiksa.'
    },
    {
      min: 0,
      art: 'plasma',
      title: 'Si Paling Santai',
      desc: 'Kamu menjawab dengan tenang. Hidup ini bukan lomba, dan kamu sudah tahu itu sejak lama.'
    }
  ],

  /* Duels shown in the hero board — illustrative, rotates while the page is idle. */
  duels: [
    { q: 'Seberapa receh kamu vs Rani?', a: { n: 'Kamu', s: 6 }, b: { n: 'Rani', s: 4 }, more: '2 orang lagi main' },
    { q: 'Tim rebahan vs tim produktif', a: { n: 'Bagas', s: 5 }, b: { n: 'Nadia', s: 7 }, more: '1 orang lagi main' },
    { q: 'Nama pasangan versi bintang', a: { n: 'Sari', s: 8 }, b: { n: 'Dewi', s: 8 }, more: '3 orang lagi main' },
    { q: 'Seberapa skena kamu sebenarnya?', a: { n: 'Yoga', s: 7 }, b: { n: 'Tika', s: 3 }, more: '4 orang lagi main' }
  ],

  /* Category tiles — counts are illustrative. */
  categories: [
    { name: 'Kepribadian', count: 42, plays: 128402 },
    { name: 'Trivia', count: 38 },
    { name: 'Nostalgia', count: 27 },
    { name: 'Skena', count: 31 },
    { name: 'Keluarga', count: 19 },
    { name: 'Cinta', count: 24 },
    { name: 'Makanan', count: 16 }
  ]
};

/**
 * RAG Knowledge Base Ingest
 * Populates 5 ChromaDB collections:
 *  1. job_descriptions
 *  2. hr_question_bank
 *  3. technical_question_bank
 *  4. evaluation_rubrics
 *  5. interview_history (empty, filled at runtime)
 */

import { addDocuments, COLLECTIONS } from './vectorstore'

// ─────────────────────────────────────────────────────────────
// 1. Job Descriptions
// ─────────────────────────────────────────────────────────────
const JOB_DESCRIPTIONS = [
  {
    id: 'jd_frontend',
    role: 'Frontend Developer',
    content:
      'Deskripsi Pekerjaan Frontend Developer: Membangun antarmuka pengguna yang responsif dan interaktif menggunakan React, Next.js, dan TypeScript. Memahami manajemen state seperti Zustand atau Redux. Pengalaman dengan CSS modern dan desain responsif sangat dibutuhkan.',
  },
  {
    id: 'jd_backend',
    role: 'Backend Developer',
    content:
      'Deskripsi Pekerjaan Backend Developer: Membangun API RESTful menggunakan Node.js dan Express. Mengelola database PostgreSQL dan MongoDB. Memahami konsep autentikasi, otorisasi, dan keamanan API. Pengalaman dengan Docker dan deployment menjadi nilai tambah.',
  },
  {
    id: 'jd_fullstack',
    role: 'Fullstack Developer',
    content:
      'Deskripsi Pekerjaan Fullstack Developer: Menguasai pengembangan frontend dan backend. Familiar dengan React/Next.js di sisi klien dan Node.js/Express di sisi server. Mampu merancang database dan membangun fitur end-to-end secara mandiri.',
  },
  {
    id: 'jd_mobile',
    role: 'Mobile Developer',
    content:
      'Deskripsi Pekerjaan Mobile Developer: Mengembangkan aplikasi mobile menggunakan React Native atau Flutter. Memahami integrasi API, manajemen state mobile, dan publikasi ke App Store maupun Google Play Store. Pengalaman dengan native modules menjadi nilai tambah.',
  },
  {
    id: 'jd_data_analyst',
    role: 'Data Analyst',
    content:
      'Deskripsi Pekerjaan Data Analyst: Menganalisis data bisnis menggunakan Python, SQL, dan tools visualisasi seperti Tableau atau Power BI. Mampu membuat laporan, dashboard, dan insight yang dapat ditindaklanjuti. Memahami statistik dasar dan metodologi analitik.',
  },
  {
    id: 'jd_data_scientist',
    role: 'Data Scientist',
    content:
      'Deskripsi Pekerjaan Data Scientist: Membangun model machine learning untuk prediksi dan klasifikasi. Menguasai Python, scikit-learn, TensorFlow, atau PyTorch. Mampu melakukan feature engineering, evaluasi model, dan deployment ke produksi.',
  },
  {
    id: 'jd_ml_engineer',
    role: 'Machine Learning Engineer',
    content:
      'Deskripsi Pekerjaan Machine Learning Engineer: Mengimplementasikan dan men-deploy model ML ke lingkungan produksi. Memahami MLOps, pipeline pelatihan model, dan infrastruktur cloud. Pengalaman dengan Kubernetes, Docker, dan monitoring model.',
  },
  {
    id: 'jd_devops',
    role: 'DevOps Engineer',
    content:
      'Deskripsi Pekerjaan DevOps Engineer: Merancang dan mengelola CI/CD pipeline, infrastruktur cloud (AWS/GCP/Azure), dan containerisasi dengan Docker/Kubernetes. Memahami monitoring, logging, dan keamanan sistem secara menyeluruh.',
  },
  {
    id: 'jd_cybersecurity',
    role: 'Cyber Security Analyst',
    content:
      'Deskripsi Pekerjaan Cyber Security Analyst: Melakukan analisis kerentanan, penetration testing, dan monitoring keamanan jaringan. Memahami protokol keamanan, enkripsi, dan manajemen insiden siber. Sertifikasi CEH atau CISSP menjadi nilai tambah.',
  },
  {
    id: 'jd_uiux',
    role: 'UI UX Designer',
    content:
      'Deskripsi Pekerjaan UI/UX Designer: Merancang pengalaman pengguna yang intuitif dan estetis menggunakan Figma atau Adobe XD. Mampu melakukan user research, wireframing, prototyping, dan usability testing. Pemahaman tentang design system dan aksesibilitas sangat penting.',
  },
  {
    id: 'jd_qa',
    role: 'QA Engineer',
    content:
      'Deskripsi Pekerjaan QA Engineer: Merancang dan menjalankan pengujian manual dan otomatis menggunakan Selenium, Cypress, atau Jest. Mampu membuat test plan, test case, dan laporan bug yang terstruktur. Memahami metodologi Agile dan pengujian API.',
  },
]

// ─────────────────────────────────────────────────────────────
// 2. HR Question Bank (per dimension)
// ─────────────────────────────────────────────────────────────
const HR_QUESTIONS = [
  // Motivasi
  { id: 'hr_mot_1', dim: 'motivation', content: 'Apa yang memotivasi Anda melamar posisi ini? Ceritakan alasan terkuat Anda.' },
  { id: 'hr_mot_2', dim: 'motivation', content: 'Apa tujuan karier Anda dalam 3-5 tahun ke depan?' },
  { id: 'hr_mot_3', dim: 'motivation', content: 'Bagaimana posisi ini sejalan dengan rencana pengembangan karier Anda?' },

  // Komunikasi
  { id: 'hr_com_1', dim: 'communication', content: 'Bagaimana cara Anda menyampaikan ide yang kompleks kepada rekan yang non-teknis?' },
  { id: 'hr_com_2', dim: 'communication', content: 'Ceritakan pengalaman Anda ketika harus mempresentasikan hasil kerja kepada tim atau stakeholder.' },
  { id: 'hr_com_3', dim: 'communication', content: 'Bagaimana Anda memastikan semua anggota tim memahami update atau perubahan penting?' },

  // Kolaborasi
  { id: 'hr_col_1', dim: 'collaboration', content: 'Bagaimana cara Anda bekerja dalam tim yang memiliki beragam latar belakang dan pendapat?' },
  { id: 'hr_col_2', dim: 'collaboration', content: 'Ceritakan pengalaman saat Anda harus berkolaborasi dengan tim dari departemen lain.' },
  { id: 'hr_col_3', dim: 'collaboration', content: 'Bagaimana cara Anda menangani konflik atau ketidaksetujuan dengan rekan kerja?' },

  // Kepemimpinan
  { id: 'hr_lead_1', dim: 'leadership', content: 'Pernahkah Anda memimpin sebuah proyek atau tim? Bagaimana pengalaman itu?' },
  { id: 'hr_lead_2', dim: 'leadership', content: 'Bagaimana Anda menginspirasi atau memotivasi rekan kerja ketika proyek sedang berjalan kurang lancar?' },
  { id: 'hr_lead_3', dim: 'leadership', content: 'Ceritakan momen ketika Anda harus mengambil keputusan sulit dalam situasi yang tidak pasti.' },

  // Adaptabilitas
  { id: 'hr_ada_1', dim: 'adaptability', content: 'Bagaimana cara Anda menyesuaikan diri ketika ada perubahan mendadak dalam prioritas proyek?' },
  { id: 'hr_ada_2', dim: 'adaptability', content: 'Ceritakan pengalaman Anda belajar teknologi atau alat baru dalam waktu singkat.' },
  { id: 'hr_ada_3', dim: 'adaptability', content: 'Bagaimana Anda mengelola tekanan saat menghadapi deadline yang ketat?' },

  // Tujuan Karier
  { id: 'hr_goal_1', dim: 'career_goal', content: 'Apa nilai-nilai profesional yang paling penting bagi Anda dalam lingkungan kerja?' },
  { id: 'hr_goal_2', dim: 'career_goal', content: 'Apa pencapaian profesional yang paling Anda banggakan sejauh ini?' },
  { id: 'hr_goal_3', dim: 'career_goal', content: 'Apa yang ingin Anda pelajari atau kembangkan dalam 1-2 tahun ke depan?' },
]

// ─────────────────────────────────────────────────────────────
// 3. Technical Question Bank
// ─────────────────────────────────────────────────────────────
const TECH_QUESTIONS = [
  // Frontend Developer
  { id: 'tech_fe_1', role: 'Frontend Developer', content: 'Bagaimana cara kerja event loop di JavaScript? Jelaskan dengan contoh sederhana.' },
  { id: 'tech_fe_2', role: 'Frontend Developer', content: 'Apa perbedaan antara useMemo dan useCallback di React? Kapan masing-masing digunakan?' },
  { id: 'tech_fe_3', role: 'Frontend Developer', content: 'Jelaskan perbedaan antara SSR, SSG, dan CSR di Next.js beserta kapan menggunakannya.' },
  { id: 'tech_fe_4', role: 'Frontend Developer', content: 'Bagaimana Anda mengelola global state di aplikasi React yang besar?' },
  { id: 'tech_fe_5', role: 'Frontend Developer', content: 'Apa itu virtual DOM dan bagaimana React menggunakannya untuk optimasi performa?' },

  // Backend Developer
  { id: 'tech_be_1', role: 'Backend Developer', content: 'Jelaskan perbedaan antara SQL dan NoSQL. Kapan Anda memilih salah satunya?' },
  { id: 'tech_be_2', role: 'Backend Developer', content: 'Bagaimana cara Anda menangani autentikasi dan otorisasi di REST API Node.js?' },
  { id: 'tech_be_3', role: 'Backend Developer', content: 'Apa itu memory leak di Node.js dan bagaimana cara mencegahnya?' },
  { id: 'tech_be_4', role: 'Backend Developer', content: 'Jelaskan konsep indexing di database dan mengapa itu penting untuk performa query.' },
  { id: 'tech_be_5', role: 'Backend Developer', content: 'Bagaimana Anda merancang API yang scalable dan mudah di-maintain?' },

  // Fullstack Developer
  { id: 'tech_fs_1', role: 'Fullstack Developer', content: 'Bagaimana Anda memutuskan logika mana yang dijalankan di server vs client?' },
  { id: 'tech_fs_2', role: 'Fullstack Developer', content: 'Ceritakan arsitektur proyek fullstack terbesar yang pernah Anda kerjakan.' },
  { id: 'tech_fs_3', role: 'Fullstack Developer', content: 'Bagaimana Anda menangani sinkronisasi data antara frontend dan backend secara real-time?' },

  // Mobile Developer
  { id: 'tech_mob_1', role: 'Mobile Developer', content: 'Apa perbedaan antara React Native dan Flutter? Apa kelebihan dan kekurangan masing-masing?' },
  { id: 'tech_mob_2', role: 'Mobile Developer', content: 'Bagaimana Anda mengelola state di aplikasi mobile yang kompleks?' },
  { id: 'tech_mob_3', role: 'Mobile Developer', content: 'Bagaimana cara mengoptimalkan performa aplikasi mobile untuk menghindari jank atau lag?' },

  // Data Analyst
  { id: 'tech_da_1', role: 'Data Analyst', content: 'Bagaimana Anda membersihkan dan memvalidasi data yang kotor atau tidak konsisten?' },
  { id: 'tech_da_2', role: 'Data Analyst', content: 'Jelaskan perbedaan antara mean, median, dan modus. Kapan masing-masing lebih relevan digunakan?' },
  { id: 'tech_da_3', role: 'Data Analyst', content: 'Bagaimana Anda menyampaikan temuan data kepada stakeholder non-teknis agar mudah dipahami?' },

  // Data Scientist
  { id: 'tech_ds_1', role: 'Data Scientist', content: 'Jelaskan perbedaan antara overfitting dan underfitting. Bagaimana cara mengatasinya?' },
  { id: 'tech_ds_2', role: 'Data Scientist', content: 'Apa itu cross-validation dan mengapa penting dalam evaluasi model machine learning?' },
  { id: 'tech_ds_3', role: 'Data Scientist', content: 'Ceritakan proyek machine learning yang pernah Anda kerjakan dari awal hingga deployment.' },

  // Machine Learning Engineer
  { id: 'tech_ml_1', role: 'Machine Learning Engineer', content: 'Apa itu MLOps dan mengapa penting dalam siklus hidup model machine learning?' },
  { id: 'tech_ml_2', role: 'Machine Learning Engineer', content: 'Bagaimana Anda memonitor model yang sudah di-deploy agar performanya tetap terjaga?' },
  { id: 'tech_ml_3', role: 'Machine Learning Engineer', content: 'Jelaskan konsep model drift dan strategi untuk menghadapinya.' },

  // DevOps Engineer
  { id: 'tech_do_1', role: 'DevOps Engineer', content: 'Bagaimana Anda merancang CI/CD pipeline yang efisien untuk tim pengembangan?' },
  { id: 'tech_do_2', role: 'DevOps Engineer', content: 'Jelaskan perbedaan antara Docker dan Kubernetes. Kapan menggunakan keduanya bersama?' },
  { id: 'tech_do_3', role: 'DevOps Engineer', content: 'Bagaimana strategi Anda untuk memonitor dan merespons insiden produksi dengan cepat?' },

  // Cyber Security
  { id: 'tech_cs_1', role: 'Cyber Security Analyst', content: 'Jelaskan apa itu OWASP Top 10 dan berikan contoh salah satu kerentanan yang paling umum.' },
  { id: 'tech_cs_2', role: 'Cyber Security Analyst', content: 'Bagaimana Anda melakukan penetration testing pada sebuah aplikasi web?' },
  { id: 'tech_cs_3', role: 'Cyber Security Analyst', content: 'Apa langkah-langkah yang Anda ambil ketika mendeteksi adanya potensi pelanggaran keamanan?' },

  // UI/UX Designer
  { id: 'tech_ux_1', role: 'UI UX Designer', content: 'Bagaimana proses desain Anda dari riset pengguna hingga prototype final?' },
  { id: 'tech_ux_2', role: 'UI UX Designer', content: 'Apa itu design system dan bagaimana Anda memastikan konsistensi di seluruh produk?' },
  { id: 'tech_ux_3', role: 'UI UX Designer', content: 'Bagaimana Anda menggunakan data dan feedback pengguna untuk memperbaiki desain?' },

  // QA Engineer
  { id: 'tech_qa_1', role: 'QA Engineer', content: 'Jelaskan perbedaan antara pengujian unit, integrasi, dan end-to-end.' },
  { id: 'tech_qa_2', role: 'QA Engineer', content: 'Bagaimana Anda memprioritaskan test case ketika waktu pengujian sangat terbatas?' },
  { id: 'tech_qa_3', role: 'QA Engineer', content: 'Bagaimana Anda membangun test automation framework dari nol untuk sebuah proyek baru?' },
]

// ─────────────────────────────────────────────────────────────
// 4. Evaluation Rubrics
// ─────────────────────────────────────────────────────────────
const RUBRICS = [
  {
    id: 'rubric_frontend',
    role: 'Frontend Developer',
    content:
      'Rubrik Evaluasi Frontend Developer: Kandidat harus menunjukkan pemahaman kuat tentang React hooks, SSR di Next.js, dan penulisan kode yang bersih. Nilai tinggi jika mampu menjelaskan optimasi performa dan state management. Tolak jika tidak memiliki pemahaman dasar TypeScript.',
  },
  {
    id: 'rubric_backend',
    role: 'Backend Developer',
    content:
      'Rubrik Evaluasi Backend Developer: Kandidat harus memahami desain RESTful API, database indexing, dan pemrograman asinkron. Nilai tinggi jika bisa menjelaskan skalabilitas dan keamanan API. Tolak jika tidak bisa menjelaskan SQL joins.',
  },
  {
    id: 'rubric_fullstack',
    role: 'Fullstack Developer',
    content:
      'Rubrik Evaluasi Fullstack Developer: Kandidat harus mampu menjelaskan keputusan arsitektur end-to-end. Nilai tinggi jika memiliki pengalaman nyata membangun fitur dari database hingga UI.',
  },
  {
    id: 'rubric_mobile',
    role: 'Mobile Developer',
    content:
      'Rubrik Evaluasi Mobile Developer: Kandidat harus memahami lifecycle aplikasi mobile, manajemen state, dan optimasi performa. Nilai tinggi jika pernah mempublikasikan aplikasi ke store.',
  },
  {
    id: 'rubric_data_analyst',
    role: 'Data Analyst',
    content:
      'Rubrik Evaluasi Data Analyst: Kandidat harus mampu menceritakan proses analisis data dari pengumpulan hingga insight. Nilai tinggi jika bisa menunjukkan kemampuan visualisasi dan storytelling dengan data.',
  },
  {
    id: 'rubric_data_scientist',
    role: 'Data Scientist',
    content:
      'Rubrik Evaluasi Data Scientist: Kandidat harus memahami siklus proyek ML secara menyeluruh. Nilai tinggi jika pernah men-deploy model ke produksi dan memahami trade-off antar algoritma.',
  },
  {
    id: 'rubric_ml_engineer',
    role: 'Machine Learning Engineer',
    content:
      'Rubrik Evaluasi ML Engineer: Kandidat harus memahami infrastruktur ML dan MLOps. Nilai tinggi jika berpengalaman dengan pipeline training otomatis dan monitoring model.',
  },
  {
    id: 'rubric_devops',
    role: 'DevOps Engineer',
    content:
      'Rubrik Evaluasi DevOps Engineer: Kandidat harus mampu menjelaskan CI/CD, containerisasi, dan strategi deployment. Nilai tinggi jika memiliki pengalaman insiden response di lingkungan produksi.',
  },
  {
    id: 'rubric_cybersecurity',
    role: 'Cyber Security Analyst',
    content:
      'Rubrik Evaluasi Cyber Security Analyst: Kandidat harus memahami kerentanan umum dan cara mitigasinya. Nilai tinggi jika berpengalaman melakukan penetration testing atau incident response nyata.',
  },
  {
    id: 'rubric_uiux',
    role: 'UI UX Designer',
    content:
      'Rubrik Evaluasi UI/UX Designer: Kandidat harus mampu menjelaskan proses desain berbasis riset pengguna. Nilai tinggi jika dapat menunjukkan portofolio dan proses iterasi desain berdasarkan feedback.',
  },
  {
    id: 'rubric_qa',
    role: 'QA Engineer',
    content:
      'Rubrik Evaluasi QA Engineer: Kandidat harus memahami strategi pengujian yang komprehensif. Nilai tinggi jika berpengalaman membangun framework automation dan memiliki pendekatan sistematis dalam menemukan bug.',
  },
]

// ─────────────────────────────────────────────────────────────
// Main ingest function
// ─────────────────────────────────────────────────────────────
export const ingestAllData = async () => {
  console.log('\n[Ingest] Starting ChromaDB knowledge base population...\n')

  // 1. Job Descriptions
  console.log('[Ingest] 1/4 — Job Descriptions...')
  await addDocuments(
    COLLECTIONS.JOB_DESCRIPTIONS,
    JOB_DESCRIPTIONS.map((d) => ({
      id: d.id,
      content: d.content,
      metadata: { role: d.role },
    }))
  )

  // 2. HR Questions
  console.log('[Ingest] 2/4 — HR Question Bank...')
  await addDocuments(
    COLLECTIONS.HR_QUESTIONS,
    HR_QUESTIONS.map((d) => ({
      id: d.id,
      content: d.content,
      metadata: { dimension: d.dim },
    }))
  )

  // 3. Technical Questions
  console.log('[Ingest] 3/4 — Technical Question Bank...')
  await addDocuments(
    COLLECTIONS.TECH_QUESTIONS,
    TECH_QUESTIONS.map((d) => ({
      id: d.id,
      content: d.content,
      metadata: { role: d.role },
    }))
  )

  // 4. Rubrics
  console.log('[Ingest] 4/4 — Evaluation Rubrics...')
  await addDocuments(
    COLLECTIONS.RUBRICS,
    RUBRICS.map((d) => ({
      id: d.id,
      content: d.content,
      metadata: { role: d.role },
    }))
  )

  console.log('\n[Ingest] ✓ All collections populated successfully!\n')
}

// Legacy export for backward compat
export const ingestData = ingestAllData

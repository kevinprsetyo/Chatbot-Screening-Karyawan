# 🤖 Chatbot Screening Karyawan — TalentMatch AI

<div align="center">

![TalentMatch AI](https://img.shields.io/badge/TalentMatch-AI-6366f1?style=for-the-badge&logo=openai&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-Agentic-orange?style=for-the-badge&logo=langchain&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**Platform AI untuk otomatisasi proses screening & wawancara kandidat secara cerdas dan terstruktur.**

[Demo](#demo) · [Fitur](#-fitur-utama) · [Instalasi](#-instalasi) · [Arsitektur](#-arsitektur-sistem)

</div>

---

## 📖 Deskripsi

**TalentMatch AI** adalah aplikasi web berbasis AI yang dirancang untuk membantu tim HR dalam melakukan proses **screening dan wawancara kandidat** secara otomatis dan efisien. Sistem ini menggunakan pipeline agentic multi-fase yang ditenagai oleh LangGraph dan LLM untuk menganalisis CV, melakukan wawancara HR & teknikal, mengevaluasi kandidat, lalu memberikan rekomendasi akhir secara objektif.

Dengan TalentMatch AI, proses rekrutmen menjadi lebih **cepat**, **konsisten**, dan **berbasis data**.

---

## ✨ Fitur Utama

- 🧠 **AI-Powered CV Analysis** — Analisis otomatis CV kandidat untuk mengekstrak pengalaman, keahlian, dan kesesuaian posisi.
- 💬 **HR Interview Chatbot** — Wawancara HR interaktif yang menggali motivasi, komunikasi, kolaborasi, kepemimpinan, dan adaptabilitas kandidat.
- 🛠️ **Technical Interview Chatbot** — Sesi wawancara teknikal adaptif yang menguji kedalaman teknis, problem-solving, dan pemahaman sistem.
- 📊 **Automated Evaluation** — Penilaian terstruktur berbasis rubrik untuk fase HR dan teknikal secara otomatis.
- 🎯 **Smart Recommendation** — Rekomendasi akhir berbasis skor gabungan yang dapat dijelaskan secara transparan.
- 📄 **PDF CV Parsing** — Upload dan parsing CV dalam format PDF secara langsung.
- 🗃️ **RAG (Retrieval-Augmented Generation)** — Penggunaan ChromaDB untuk knowledge base posisi dan kriteria jabatan.
- 📈 **Dashboard Hasil** — Tampilan hasil wawancara dan evaluasi yang informatif dan visual.

---

## 🏗️ Arsitektur Sistem

Sistem menggunakan **LangGraph** untuk mengorkestrasi pipeline agentic multi-fase:

```
[Upload CV] → [CV Analyzer Node]
                    ↓
             [HR Interview Node] ⟷ [Coverage Check Node]
                    ↓ (HR Complete)
             [HR Evaluation Node]
                    ↓
             [Decision Node]
              ↙           ↘
   [Technical Interview] [Skip to Recommendation]
       Node ⟷ [Tech Coverage Check]
              ↓ (Tech Complete)
       [Technical Evaluation Node]
              ↓
       [Recommendation Node]
              ↓
         [Final Result]
```

### Pipeline Fase

| Fase | Node | Deskripsi |
|------|------|-----------|
| 1 | `CVAnalyzerNode` | Parsing & analisis mendalam dokumen CV |
| 2 | `HRInterviewNode` | Wawancara HR berbasis coverage check |
| 3 | `CoverageCheckNode` | Validasi kelengkapan topik HR |
| 4 | `HREvaluationNode` | Skoring & evaluasi hasil HR interview |
| 5 | `DecisionNode` | Keputusan lanjut ke fase teknikal atau tidak |
| 6 | `TechnicalInterviewNode` | Wawancara teknikal adaptif |
| 7 | `TechnicalCoverageCheckNode` | Validasi kelengkapan topik teknikal |
| 8 | `TechnicalEvaluationNode` | Skoring & evaluasi hasil teknikal |
| 9 | `RecommendationNode` | Rekomendasi akhir kandidat |

---

## 🗂️ Struktur Proyek

```
talentmatch-ai/
├── ai/
│   ├── agent/
│   │   ├── graph.ts            # LangGraph pipeline definition
│   │   ├── state.ts            # Global agent state annotations
│   │   └── nodes/
│   │       ├── cv-analyzer.ts
│   │       ├── hr-interview.ts
│   │       ├── hr-evaluation.ts
│   │       ├── technical-interview.ts
│   │       ├── technical-evaluation.ts
│   │       └── recommendation.ts
│   ├── ollama/                 # LLM client configuration
│   └── rag/                    # RAG & ChromaDB integration
├── app/
│   ├── page.tsx                # Landing page
│   ├── apply/                  # Formulir pendaftaran kandidat
│   ├── interview/              # Sesi wawancara HR
│   ├── hr-interview/           # HR interview interface
│   ├── technical-interview/    # Technical interview interface
│   ├── result/                 # Halaman hasil evaluasi
│   └── api/                    # Next.js API Routes
│       ├── cv/                 # CV upload & parsing
│       ├── hr-interview/       # HR interview endpoint
│       ├── technical-interview/ # Technical interview endpoint
│       ├── hr-evaluation/      # HR evaluation endpoint
│       ├── technical-evaluation/ # Tech evaluation endpoint
│       ├── recommendation/     # Final recommendation endpoint
│       └── pipeline/           # Pipeline orchestration
├── components/
│   └── landing/                # Landing page components
├── data/                       # Static data & job profiles
├── lib/                        # Utility libraries
├── scripts/                    # Data ingestion scripts
├── store/                      # Zustand state management
└── types/                      # TypeScript type definitions
```

---

## 🚀 Instalasi

### Prasyarat

Pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) >= 18
- [Ollama](https://ollama.com/) (untuk LLM lokal)
- [ChromaDB](https://www.trychroma.com/) (untuk vector database)

### Langkah Instalasi

1. **Clone repositori**
   ```bash
   git clone https://github.com/kevinprsetyo/Chatbot-Screening-Karyawan.git
   cd Chatbot-Screening-Karyawan
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Kemudian edit `.env.local` dengan konfigurasi Anda:
   ```env
   # Ollama API (Cloud/Remote)
   OLLAMA_API_KEY=your_api_key_here
   OLLAMA_BASE_URL=https://ollama.com
   OLLAMA_MODEL=gpt-oss:120b-cloud

   # Ollama Lokal
   OLLAMA_LOCAL_URL=http://localhost:11434
   OLLAMA_EMBEDDING_MODEL=nomic-embed-text

   # ChromaDB
   CHROMA_SERVER_URL=http://localhost:8000
   ```

4. **Jalankan ChromaDB** (vector database)
   ```bash
   # Menggunakan Docker
   docker run -p 8000:8000 chromadb/chroma
   ```

5. **Pull model Ollama lokal** (untuk embedding)
   ```bash
   ollama pull nomic-embed-text
   ```

6. **Ingest data posisi ke ChromaDB**
   ```bash
   npm run ingest
   ```

7. **Jalankan development server**
   ```bash
   npm run dev
   ```

8. **Buka browser** di [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) + TypeScript |
| **AI Orchestration** | [LangGraph](https://langchain-ai.github.io/langgraphjs/) |
| **LLM Integration** | [LangChain](https://www.langchain.com/) + Ollama |
| **Vector Database** | [ChromaDB](https://www.trychroma.com/) |
| **Embedding** | Ollama `nomic-embed-text` |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Styling** | Tailwind CSS v4 |
| **Charts** | [Recharts](https://recharts.org/) |
| **PDF Parsing** | `pdf-parse` |
| **Validation** | [Zod](https://zod.dev/) |

---

## 📡 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/cv` | Upload & parse CV kandidat |
| `POST` | `/api/pipeline` | Inisiasi pipeline screening |
| `POST` | `/api/hr-interview` | Kirim pesan sesi HR interview |
| `POST` | `/api/hr-evaluation` | Trigger evaluasi HR |
| `POST` | `/api/technical-interview` | Kirim pesan sesi teknikal |
| `POST` | `/api/technical-evaluation` | Trigger evaluasi teknikal |
| `POST` | `/api/recommendation` | Dapatkan rekomendasi akhir |
| `GET`  | `/api/result` | Ambil hasil evaluasi kandidat |
| `GET`  | `/api/position-profile` | Profil posisi yang tersedia |

---

## 🎯 Alur Penggunaan

1. **Kandidat mendaftar** — Mengisi form dan upload CV (PDF)
2. **Analisis CV** — AI mengekstrak dan menganalisis profil kandidat
3. **Wawancara HR** — Chatbot melakukan wawancara HR secara interaktif
4. **Evaluasi HR** — Sistem menilai hasil wawancara HR secara otomatis
5. **Keputusan** — Sistem memutuskan apakah lanjut ke fase teknikal
6. **Wawancara Teknikal** — Chatbot melakukan wawancara teknikal mendalam
7. **Evaluasi Teknikal** — Sistem menilai kompetensi teknikal kandidat
8. **Rekomendasi Akhir** — Laporan lengkap dengan skor dan rekomendasi

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repositori ini
2. Buat branch fitur baru (`git checkout -b feature/fitur-baru`)
3. Commit perubahan Anda (`git commit -m 'feat: tambah fitur baru'`)
4. Push ke branch (`git push origin feature/fitur-baru`)
5. Buat Pull Request

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License**.

---

<div align="center">

Dibuat dengan ❤️ oleh [kevinprsetyo](https://github.com/kevinprsetyo)

</div>

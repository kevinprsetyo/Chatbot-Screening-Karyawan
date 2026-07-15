import { ingestData } from '../ai/rag/ingest';

async function main() {
  console.log("Memulai proses Ingest...");
  try {
    await ingestData();
    console.log("Berhasil memasukkan data ke ChromaDB!");
  } catch (error) {
    console.error("Gagal melakukan ingest data:", error);
  }
}

main();

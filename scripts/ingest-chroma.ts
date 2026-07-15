import { ingestAllData } from '../ai/rag/ingest'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function run() {
  try {
    await ingestAllData()
    console.log('Ingest complete!')
    process.exit(0)
  } catch (error) {
    console.error('Ingest failed:', error)
    process.exit(1)
  }
}

run()

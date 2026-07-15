/**
 * JSON-based Vector Store (No Docker, No ChromaDB Server needed)
 * It saves embeddings and texts locally into `.rag-db.json`.
 * Still uses Ollama nomic-embed-text for generating vectors.
 * Performs Cosine Similarity manually in memory.
 */

import fs from 'fs'
import path from 'path'
import { embedText } from './embeddings'

export const COLLECTIONS = {
  JOB_DESCRIPTIONS: 'job_descriptions',
  HR_QUESTIONS: 'hr_question_bank',
  TECH_QUESTIONS: 'technical_question_bank',
  RUBRICS: 'evaluation_rubrics',
  HISTORY: 'interview_history',
} as const

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS]

interface Document {
  id: string
  content: string
  metadata: Record<string, string>
  embedding: number[]
}

type Database = Record<string, Document[]>

const DB_PATH = path.join(process.cwd(), '.rag-db.json')

function loadDB(): Database {
  if (fs.existsSync(DB_PATH)) {
    try {
      const data = fs.readFileSync(DB_PATH, 'utf-8')
      return JSON.parse(data)
    } catch {
      return {}
    }
  }
  return {}
}

function saveDB(db: Database) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8')
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

// ─────────────────────────────────────────────────────────────
// Add documents to a collection
// ─────────────────────────────────────────────────────────────
export async function addDocuments(
  collectionName: CollectionName,
  docs: Array<{ id: string; content: string; metadata?: Record<string, string> }>
): Promise<void> {
  const db = loadDB()
  if (!db[collectionName]) {
    db[collectionName] = []
  }

  for (const d of docs) {
    const embedding = await embedText(d.content)
    const newDoc: Document = {
      id: d.id,
      content: d.content,
      metadata: d.metadata ?? {},
      embedding
    }
    const existingIdx = db[collectionName].findIndex(x => x.id === d.id)
    if (existingIdx >= 0) {
      db[collectionName][existingIdx] = newDoc
    } else {
      db[collectionName].push(newDoc)
    }
  }

  saveDB(db)
  console.log(`[JSON-DB] Added ${docs.length} docs to "${collectionName}"`)
}

// ─────────────────────────────────────────────────────────────
// Similarity search in a specific collection
// ─────────────────────────────────────────────────────────────
export async function similaritySearch(
  collectionName: CollectionName,
  query: string,
  k = 3,
  where?: Record<string, string>
): Promise<Array<{ content: string; metadata: Record<string, string> }>> {
  const db = loadDB()
  const collection = db[collectionName] || []
  
  let filtered = collection
  if (where) {
    filtered = collection.filter(doc => {
      for (const key of Object.keys(where)) {
        if (doc.metadata[key] !== where[key]) return false
      }
      return true
    })
  }

  if (filtered.length === 0) return []

  try {
    const queryEmbedding = await embedText(query)
    
    const scored = filtered.map(doc => ({
      content: doc.content,
      metadata: doc.metadata,
      score: cosineSimilarity(queryEmbedding, doc.embedding)
    }))

    scored.sort((a, b) => b.score - a.score)
    
    return scored.slice(0, k).map(({ content, metadata }) => ({ content, metadata }))
  } catch (error) {
    console.error(`[JSON-DB] similaritySearch error in "${collectionName}":`, error)
    return []
  }
}

// ─────────────────────────────────────────────────────────────
// Keyword fallback search
// ─────────────────────────────────────────────────────────────
export async function keywordSearch(
  collectionName: CollectionName,
  query: string,
  k = 3
): Promise<Array<{ content: string; metadata: Record<string, string> }>> {
  const db = loadDB()
  const collection = db[collectionName] || []
  
  const queryLower = query.toLowerCase()

  const scored = collection.map(doc => ({
    content: doc.content,
    metadata: doc.metadata,
    score: doc.content.toLowerCase().split(' ').filter(w => queryLower.includes(w)).length
  }))

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, k).map(({ content, metadata }) => ({ content, metadata }))
}

// ─────────────────────────────────────────────────────────────
// Smart search: tries embedding, falls back to keyword
// ─────────────────────────────────────────────────────────────
export async function smartSearch(
  collectionName: CollectionName,
  query: string,
  k = 3,
  where?: Record<string, string>
): Promise<string> {
  try {
    const results = await similaritySearch(collectionName, query, k, where)
    if (results.length > 0) {
      return results.map((r) => r.content).join('\n\n')
    }
  } catch {
    console.warn(`[JSON-DB] Embedding search failed, falling back to keyword search`)
  }

  const fallback = await keywordSearch(collectionName, query, k)
  return fallback.map((r) => r.content).join('\n\n')
}

// ─────────────────────────────────────────────────────────────
// Check if DB is reachable
// ─────────────────────────────────────────────────────────────
export async function isChromaAvailable(): Promise<boolean> {
  return true // Selalu true untuk local JSON DB
}

// ─────────────────────────────────────────────────────────────
// Legacy compatibility
// ─────────────────────────────────────────────────────────────
export async function getVectorStore() {
  return {
    async similaritySearch(query: string, k: number) {
      const results = await smartSearch(COLLECTIONS.RUBRICS, query, k)
      return [{ pageContent: results }]
    },
    async addDocuments(docs: Array<{ pageContent: string; metadata: Record<string, string> }>) {
      const formatted = docs.map((d, i) => ({
        id: `legacy_${Date.now()}_${i}`,
        content: d.pageContent,
        metadata: d.metadata,
      }))
      await addDocuments(COLLECTIONS.RUBRICS, formatted)
    },
  }
}

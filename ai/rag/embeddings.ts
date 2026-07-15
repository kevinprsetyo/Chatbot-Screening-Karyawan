/**
 * Embeddings using Ollama's nomic-embed-text model (local)
 * URL: http://localhost:11434
 */

const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY || ''
const baseUrl = (process.env.OLLAMA_BASE_URL || 'https://ollama.com').replace(/\/$/, '')
const model = process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text'

function getEmbeddingsEndpoint() {
  if (baseUrl.endsWith('/api')) {
    return `${baseUrl}/embeddings`
  }
  return `${baseUrl}/api/embeddings`
}

export async function embedText(text: string): Promise<number[]> {
  try {
    const endpoint = getEmbeddingsEndpoint()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (OLLAMA_API_KEY) {
      headers.Authorization = `Bearer ${OLLAMA_API_KEY}`
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ model, prompt: text }),
    })

    if (!response.ok) {
      console.warn(`[Embeddings] Server returned ${response.status}. Using keyword fallback.`)
      return new Array(768).fill(0)
    }

    const data = await response.json()
    return data.embedding as number[]
  } catch (error) {
    console.warn(`[Embeddings] Connection failed. Using keyword fallback.`, error)
    return new Array(768).fill(0)
  }
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const results: number[][] = []
  for (const text of texts) {
    const vec = await embedText(text)
    results.push(vec)
  }
  return results
}

export const getEmbeddings = () => ({
  async embedQuery(text: string): Promise<number[]> {
    return embedText(text)
  },
  async embedDocuments(texts: string[]): Promise<number[][]> {
    return embedBatch(texts)
  },
})

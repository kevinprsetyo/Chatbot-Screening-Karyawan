// Ollama API client wrapper (local + cloud)
// Base URL: https://ollama.com  →  endpoint: https://ollama.com/api/chat

const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY!
const OLLAMA_BASE_URL = (process.env.OLLAMA_BASE_URL || 'https://ollama.com').replace(/\/$/, '')
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3:5b'

function getChatEndpoint() {
  // If the base URL already ends in /api don't double-append
  if (OLLAMA_BASE_URL.endsWith('/api')) {
    return `${OLLAMA_BASE_URL}/chat`
  }
  return `${OLLAMA_BASE_URL}/api/chat`
}

export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OllamaChatOptions {
  messages: OllamaMessage[]
  temperature?: number
  max_tokens?: number
  stream?: boolean
}

export async function ollamaChat(options: OllamaChatOptions): Promise<string> {
  const endpoint = getChatEndpoint()
  
  // If using Ollama Cloud (ollama.com) an API key is required
  if (OLLAMA_BASE_URL.includes('ollama.com') && !OLLAMA_API_KEY) {
    throw new Error(
      'OLLAMA_API_KEY is not set. Set OLLAMA_API_KEY in .env.local for Ollama Cloud.'
    )
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (OLLAMA_API_KEY) headers.Authorization = `Bearer ${OLLAMA_API_KEY}`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 2000,
      stream: false,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    if (response.status === 401) {
      throw new Error(
        `Ollama API error 401: unauthorized. This usually means your OLLAMA_API_KEY is invalid or expired. ` +
          `If you're using the example key from .env.local.example, replace it with a valid key from Ollama Cloud. ` +
          `To use a local Ollama server instead, set OLLAMA_BASE_URL=http://localhost:11434 and remove OLLAMA_API_KEY. ` +
          `(server response: ${error})`
      )
    }

    throw new Error(`Ollama API error ${response.status}: ${error}`)
  }

  const data = await response.json()
  // Ollama /api/chat response
  if (data?.message?.content) return data.message.content
  // Fallback for OpenAI-compatible responses if configured elsewhere
  return data?.choices?.[0]?.message?.content ?? ''
}

export async function ollamaChatStream(
  options: OllamaChatOptions
): Promise<ReadableStream<Uint8Array>> {
  const endpoint = getChatEndpoint()

  // If using Ollama Cloud (ollama.com) an API key is required
  if (OLLAMA_BASE_URL.includes('ollama.com') && !OLLAMA_API_KEY) {
    throw new Error(
      'OLLAMA_API_KEY is not set. Set OLLAMA_API_KEY in .env.local for Ollama Cloud.'
    )
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (OLLAMA_API_KEY) headers.Authorization = `Bearer ${OLLAMA_API_KEY}`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 1000,
      stream: true,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    if (response.status === 401) {
      throw new Error(
        `Ollama API error 401: unauthorized. This usually means your OLLAMA_API_KEY is invalid or expired. ` +
          `If you're using the example key from .env.local.example, replace it with a valid key from Ollama Cloud. ` +
          `To use a local Ollama server instead, set OLLAMA_BASE_URL=http://localhost:11434 and remove OLLAMA_API_KEY. ` +
          `(server response: ${error})`
      )
    }

    throw new Error(`Ollama API error ${response.status}: ${error}`)
  }

  // Transform NDJSON stream to text chunks
  const encoder = new TextEncoder()
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          controller.close()
          break
        }
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed) continue
          try {
            const parsed = JSON.parse(trimmed)
            const content = parsed?.message?.content
            if (content) {
              controller.enqueue(encoder.encode(content))
            }
            if (parsed?.done) {
              controller.close()
              return
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    },
  })
}

(async () => {
  try {
    const base = (process.env.OLLAMA_BASE_URL || 'https://ollama.com').replace(/\/$/, '')
    const endpoint = base.endsWith('/api') ? `${base}/chat` : `${base}/api/chat`

    const headers = {
      'Content-Type': 'application/json',
    }
    if (process.env.OLLAMA_API_KEY) {
      headers.Authorization = 'Bearer ' + process.env.OLLAMA_API_KEY
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || 'gpt-oss:120b-cloud',
        messages: [{ role: 'user', content: 'ping' }],
        stream: false,
      }),
    })

    console.log('STATUS', res.status)
    const text = await res.text()
    console.log(text)
    if (!res.ok) process.exit(1)
  } catch (err) {
    console.error(err)
    process.exit(2)
  }
})()

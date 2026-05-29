// PDF parser wrapper using pdf-parse
// Must be used server-side only (in API routes or server actions)

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // Dynamic import to avoid build-time issues
  const pdfParse = (await import('pdf-parse')).default
  
  try {
    const data = await pdfParse(buffer)
    return data.text.trim()
  } catch (error) {
    throw new Error(`Failed to extract PDF text: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

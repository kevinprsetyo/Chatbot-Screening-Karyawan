import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { extractTextFromPDF } from '@/lib/pdf/parser'
import { analyzeCV } from '@/lib/ollama/cv-analyzer'
import type { CandidateProfile } from '@/types'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const cvFile = formData.get('cv') as File | null
    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const linkedIn = formData.get('linkedIn') as string
    const github = formData.get('github') as string
    const yearsOfExperience = parseInt(formData.get('yearsOfExperience') as string, 10)
    const position = formData.get('position') as string

    // Validate required fields
    if (!cvFile || !fullName || !email || !phone || !position) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (cvFile.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are accepted' }, { status: 400 })
    }

    // Extract text from PDF
    const arrayBuffer = await cvFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const cvText = await extractTextFromPDF(buffer)

    if (!cvText || cvText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract sufficient text from the CV. Please ensure the PDF is not scanned/image-based.' },
        { status: 400 }
      )
    }

    // Analyze CV with Ollama
    const cvAnalysis = await analyzeCV(cvText)

    // Build candidate profile
    const candidate: CandidateProfile = {
      id: randomUUID(),
      fullName,
      email,
      phone,
      linkedIn: linkedIn || undefined,
      github: github || undefined,
      yearsOfExperience: isNaN(yearsOfExperience) ? 0 : yearsOfExperience,
      position,
      cvText,
      cvAnalysis,
    }

    return NextResponse.json({ candidate }, { status: 200 })
  } catch (error) {
    console.error('CV analysis error:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

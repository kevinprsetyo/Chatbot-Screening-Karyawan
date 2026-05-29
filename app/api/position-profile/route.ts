import { NextResponse } from 'next/server'
import { generatePositionProfile } from '@/lib/ollama/position-profiler'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { position } = body

    if (!position || typeof position !== 'string') {
      return NextResponse.json(
        { error: 'Position is required and must be a string.' },
        { status: 400 }
      )
    }

    const profile = await generatePositionProfile(position)
    
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error generating position profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

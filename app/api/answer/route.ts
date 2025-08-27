import { NextRequest, NextResponse } from 'next/server'
import { answerTip } from '@/lib/mock-data'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tipId, answerText } = body

    if (!tipId || !answerText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update the tip with the answer
    answerTip(tipId, answerText)

    // In real app, this would trigger Telegram API call
    console.log(`Mock: Sending answer via Telegram for tip ${tipId}`)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error answering tip:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { generateNonce, generateTipId } from '@/lib/utils'
import { mockCreators, addTip } from '@/lib/mock-data'
import { TipRow } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { creatorHandle, tipperTg, questionText } = body

    if (!creatorHandle || !tipperTg || !questionText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const creator = mockCreators[creatorHandle]
    if (!creator) {
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      )
    }

    const nonce = generateNonce()
    const tipId = generateTipId()

    // Create optimistic tip entry
    const newTip: TipRow = {
      id: tipId,
      createdAt: new Date().toISOString(),
      tipperTg,
      amountLamports: creator.priceLamports,
      questionText,
      status: 'pending'
    }

    // Add to mock data store
    addTip(newTip)

    // Mock action URL - in real app this would be a Phantom/Dialect Blink
    const actionUrl = `/success?ref=${nonce}&tipId=${tipId}`

    return NextResponse.json({
      actionUrl,
      nonce,
      tipId
    })
  } catch (error) {
    console.error('Error initializing tip:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

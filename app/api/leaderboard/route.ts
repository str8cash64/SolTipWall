import { NextResponse } from 'next/server'
import { generateLeaderboard } from '@/lib/mock-data'

export async function GET() {
  try {
    const topCreators = generateLeaderboard()
    
    return NextResponse.json({
      topCreators
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

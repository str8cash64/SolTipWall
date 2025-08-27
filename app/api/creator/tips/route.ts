import { NextResponse } from 'next/server'
import { getTipsByStatus } from '@/lib/mock-data'

export async function GET() {
  try {
    const { pending, answered } = getTipsByStatus()
    
    return NextResponse.json({
      pending,
      answered
    })
  } catch (error) {
    console.error('Error fetching tips:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

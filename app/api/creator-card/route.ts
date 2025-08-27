import { NextRequest, NextResponse } from 'next/server'
import { mockCreators } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const handle = searchParams.get('handle')

  if (!handle) {
    return NextResponse.json(
      { error: 'Handle parameter is required' },
      { status: 400 }
    )
  }

  const creator = mockCreators[handle]
  
  if (!creator) {
    return NextResponse.json(
      { error: 'Creator not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(creator)
}

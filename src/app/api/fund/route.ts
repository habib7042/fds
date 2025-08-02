import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const fund = await databaseService.getFund()
    return NextResponse.json({ fund })
  } catch (error) {
    console.error('Get fund error:', error)
    return NextResponse.json(
      { error: 'সার্ভার এরর ঘটেছে' },
      { status: 500 }
    )
  }
}
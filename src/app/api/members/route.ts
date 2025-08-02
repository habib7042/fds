import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const members = await databaseService.getMembers()
    return NextResponse.json({ members })
  } catch (error) {
    console.error('Get members error:', error)
    return NextResponse.json(
      { error: 'সার্ভার এরর ঘটেছে' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, email, password, phone, address, monthlyFee = 1000 } = data

    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { error: 'নাম, ইমেইল, পাসওয়ার্ড এবং ফোন নম্বর প্রয়োজন' },
        { status: 400 }
      )
    }

    // Create new user and member
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role: 'MEMBER'
    }

    const newMember = {
      id: (Date.now() + 1).toString(),
      userId: newUser.id,
      phone,
      address,
      monthlyFee,
      totalBalance: 0,
      dueAmount: 0,
      isActive: true
    }

    // Add to mock data (in real implementation, this would use Prisma)
    const { mockUsers, mockMembers } = await import('@/lib/db')
    mockUsers.push(newUser)
    mockMembers.push(newMember)

    const memberWithUser = {
      ...newMember,
      user: newUser
    }

    return NextResponse.json({
      message: 'সদস্য সফলভাবে যোগ করা হয়েছে',
      member: memberWithUser
    })
  } catch (error) {
    console.error('Create member error:', error)
    return NextResponse.json(
      { error: 'সার্ভার এরর ঘটেছে' },
      { status: 500 }
    )
  }
}
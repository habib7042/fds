import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get user from cookie
    const userCookie = request.cookies.get('fds-user')
    
    if (!userCookie || !userCookie.value) {
      return NextResponse.json(
        { error: 'কোনো ইউজার লগইন করা নেই' },
        { status: 401 }
      )
    }

    // Parse user data from cookie
    const userData = JSON.parse(userCookie.value)
    
    // Get fresh user data from database
    const user = await databaseService.getUserById(userData.id)

    if (!user) {
      return NextResponse.json(
        { error: 'ইউজার পাওয়া যায়নি' },
        { status: 404 }
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'সার্ভার এরর ঘটেছে' },
      { status: 500 }
    )
  }
}
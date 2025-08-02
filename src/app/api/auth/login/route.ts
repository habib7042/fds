import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'ইমেইল, পাসওয়ার্ড এবং ভূমিকা প্রয়োজন' },
        { status: 400 }
      )
    }

    // Find user by email and role
    const user = await databaseService.findUser(email, role)

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'ভুল ইমেইল, পাসওয়ার্ড বা ভূমিকা' },
        { status: 401 }
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    // Create response with user data
    const response = NextResponse.json({
      message: 'লগইন সফল হয়েছে',
      user: userWithoutPassword
    })

    // Set HTTP-only cookie with user info (in production, use proper JWT)
    response.cookies.set('fds-user', JSON.stringify(userWithoutPassword), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'সার্ভার এরর ঘটেছে' },
      { status: 500 }
    )
  }
}
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({
      message: 'লগআউট সফল হয়েছে'
    })

    // Clear the user cookie
    response.cookies.set('fds-user', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'সার্ভার এরর ঘটেছে' },
      { status: 500 }
    )
  }
}
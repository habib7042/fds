import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const paymentId = params.id

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'সঠিক স্ট্যাটাস (APPROVED/REJECTED) প্রয়োজন' },
        { status: 400 }
      )
    }

    // Get user from cookie (approver)
    const userCookie = request.cookies.get('fds-user')
    if (!userCookie || !userCookie.value) {
      return NextResponse.json(
        { error: 'অনুমোদনের জন্য লগইন করতে হবে' },
        { status: 401 }
      )
    }

    const approver = JSON.parse(userCookie.value)
    if (approver.role !== 'ACCOUNTANT') {
      return NextResponse.json(
        { error: 'শুধুমাত্র হিসাবরক্ষক পেমেন্ট অনুমোদন করতে পারেন' },
        { status: 403 }
      )
    }

    const payment = await databaseService.updatePaymentStatus(
      paymentId,
      status,
      approver.id
    )

    if (!payment) {
      return NextResponse.json(
        { error: 'পেমেন্ট পাওয়া যায়নি' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: `পেমেন্ট ${status === 'APPROVED' ? 'অনুমোদিত' : 'প্রত্যাখ্যান'} হয়েছে`,
      payment
    })
  } catch (error) {
    console.error('Approve payment error:', error)
    return NextResponse.json(
      { error: 'সার্ভার এরর ঘটেছে' },
      { status: 500 }
    )
  }
}
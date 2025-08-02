import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let payments
    if (status === 'pending') {
      payments = await databaseService.getPendingPayments()
    } else {
      payments = await databaseService.getPayments()
    }

    return NextResponse.json({ payments })
  } catch (error) {
    console.error('Get payments error:', error)
    return NextResponse.json(
      { error: 'সার্ভার এরর ঘটেছে' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { memberId, userId, amount, paymentMethod, transactionId, cashNote } = data

    if (!memberId || !userId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: 'সদস্য আইডি, ইউজার আইডি, পরিমাণ এবং পেমেন্ট মেথড প্রয়োজন' },
        { status: 400 }
      )
    }

    // Validate payment method specific fields
    if ((paymentMethod === 'BKASH' || paymentMethod === 'NAGAD') && !transactionId) {
      return NextResponse.json(
        { error: 'বিকাশ/নগদ পেমেন্টের জন্য ট্রানজেকশন আইডি প্রয়োজন' },
        { status: 400 }
      )
    }

    if (paymentMethod === 'CASH' && !cashNote) {
      return NextResponse.json(
        { error: 'ক্যাশ পেমেন্টের জন্য নোট প্রয়োজন' },
        { status: 400 }
      )
    }

    const paymentData = {
      memberId,
      userId,
      amount,
      paymentMethod,
      transactionId: paymentMethod === 'CASH' ? null : transactionId,
      cashNote: paymentMethod === 'CASH' ? cashNote : null
    }

    const payment = await databaseService.createPayment(paymentData)

    return NextResponse.json({
      message: 'পেমেন্ট সফলভাবে জমা দেওয়া হয়েছে',
      payment
    })
  } catch (error) {
    console.error('Create payment error:', error)
    return NextResponse.json(
      { error: 'সার্ভার এরর ঘটেছে' },
      { status: 500 }
    )
  }
}
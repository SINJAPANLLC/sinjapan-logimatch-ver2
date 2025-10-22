import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { error, status } = await verifyAdminToken(request)
    
    if (error) {
      return NextResponse.json({ error }, { status })
    }

    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            companyName: true,
            email: true,
            userType: true
          }
        }
      }
    })

    return NextResponse.json({ payments })

  } catch (error) {
    console.error('Admin payments error:', error)
    return NextResponse.json({ error: '決済一覧の取得に失敗しました' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { error, status } = await verifyAdminToken(request)
    
    if (error) {
      return NextResponse.json({ error }, { status })
    }

    const { paymentId, paymentStatus } = await request.json()

    if (!paymentId || !paymentStatus) {
      return NextResponse.json({ error: '決済IDとステータスが必要です' }, { status: 400 })
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: { paymentStatus }
    })

    return NextResponse.json({
      message: 'ステータスを更新しました',
      payment: updatedPayment
    })

  } catch (error) {
    console.error('Update payment error:', error)
    return NextResponse.json({ error: 'ステータスの更新に失敗しました' }, { status: 500 })
  }
}

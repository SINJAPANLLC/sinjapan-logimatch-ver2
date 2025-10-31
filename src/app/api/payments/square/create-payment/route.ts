import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getSquareClient } from '@/lib/square'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: '無効なトークンです' }, { status: 401 })
    }

    const square = getSquareClient()
    if (!square) {
      return NextResponse.json({ 
        error: 'Square設定が完了していません。SQUARE_ACCESS_TOKENを設定してください。' 
      }, { status: 500 })
    }

    const body = await request.json()
    const { amount, sourceId, description, locationId } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: '有効な金額を入力してください' }, { status: 400 })
    }

    if (!sourceId) {
      return NextResponse.json({ error: 'カード情報が必要です' }, { status: 400 })
    }

    // ユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 })
    }

    // Square Paymentを作成
    const idempotencyKey = randomUUID()
    
    const paymentResponse = await square.payments.create({
      sourceId,
      idempotencyKey,
      amountMoney: {
        amount: BigInt(amount),
        currency: 'JPY',
      },
      ...(locationId && { locationId }),
      note: description || `${user.companyName}様のお支払い`,
    })

    if (paymentResponse.payment) {
      const squarePayment = paymentResponse.payment

      // Payment レコードを作成
      const payment = await prisma.payment.create({
        data: {
          userId: user.id,
          amount: amount,
          paymentMethod: 'card',
          paymentStatus: squarePayment.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING',
          transactionId: squarePayment.id!,
          paidAt: squarePayment.status === 'COMPLETED' ? new Date() : null,
          description: description || 'Square決済',
          metadata: JSON.stringify({
            squarePaymentId: squarePayment.id,
            status: squarePayment.status,
            receiptUrl: squarePayment.receiptUrl,
            orderId: squarePayment.orderId,
            locationId: squarePayment.locationId,
          })
        }
      })

      return NextResponse.json({
        success: true,
        payment,
        squarePayment: {
          id: squarePayment.id,
          status: squarePayment.status,
          receiptUrl: squarePayment.receiptUrl,
          receiptNumber: squarePayment.receiptNumber,
        }
      })
    } else {
      throw new Error('Square payment creation failed')
    }

  } catch (error) {
    console.error('Square payment creation error:', error)
    return NextResponse.json({ 
      error: 'Square決済の作成に失敗しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

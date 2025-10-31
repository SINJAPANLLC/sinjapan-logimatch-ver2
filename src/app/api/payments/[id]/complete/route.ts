import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { getSquareClient } from '@/lib/square'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: '無効なトークンです' }, { status: 401 })
    }

    const paymentId = params.id
    const body = await request.json()
    const { sourceId, paymentMethod } = body

    // 決済情報を取得
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: true
      }
    })

    if (!payment) {
      return NextResponse.json({ error: '決済情報が見つかりません' }, { status: 404 })
    }

    // ユーザー認証チェック
    if (payment.userId !== decoded.userId) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 })
    }

    // Square決済処理
    if (paymentMethod === 'card' && sourceId) {
      const square = getSquareClient()
      
      if (!square) {
        return NextResponse.json({ error: 'Square設定が完了していません' }, { status: 500 })
      }

      try {
        // Square Payments APIを使用して決済処理
        // 冪等性キーとして決済IDを使用（重複課金を防ぐ）
        const idempotencyKey = paymentId
        
        const response = await square.payments.create({
          sourceId: sourceId,
          amountMoney: {
            amount: BigInt(Math.round(payment.amount)),
            currency: 'JPY'
          },
          idempotencyKey,
          note: `Payment ID: ${paymentId} - ${payment.user.companyName}`
        })

        if (response.payment) {
          const squarePayment = response.payment
          
          // 決済情報を更新
          const updatedPayment = await prisma.payment.update({
            where: { id: paymentId },
            data: {
              paymentStatus: squarePayment.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING',
              transactionId: squarePayment.id!,
              paidAt: squarePayment.status === 'COMPLETED' ? new Date() : null,
              metadata: JSON.stringify({
                squarePaymentId: squarePayment.id,
                status: squarePayment.status,
                receiptUrl: squarePayment.receiptUrl,
                receiptNumber: squarePayment.receiptNumber,
                orderId: squarePayment.orderId,
              })
            }
          })

          return NextResponse.json({
            message: '決済が完了しました',
            data: {
              paymentId: updatedPayment.id,
              status: updatedPayment.paymentStatus,
              amount: updatedPayment.amount,
              receiptUrl: squarePayment.receiptUrl,
              receiptNumber: squarePayment.receiptNumber,
            }
          })
        } else {
          throw new Error('Square payment failed')
        }
      } catch (squareError) {
        console.error('Square payment error:', squareError)
        
        // エラー時は決済ステータスを更新
        await prisma.payment.update({
          where: { id: paymentId },
          data: {
            paymentStatus: 'FAILED',
            metadata: JSON.stringify({
              error: squareError instanceof Error ? squareError.message : 'Unknown error',
              failedAt: new Date().toISOString(),
            })
          }
        })
        
        throw squareError
      }
    }

    return NextResponse.json({ error: '未対応の決済方法です' }, { status: 400 })

  } catch (error) {
    console.error('Payment completion error:', error)
    return NextResponse.json({ 
      error: '決済処理に失敗しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

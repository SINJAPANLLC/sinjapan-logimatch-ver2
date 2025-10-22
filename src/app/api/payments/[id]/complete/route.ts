import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

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
    if (paymentMethod === 'card') {
      const isProduction = process.env.NODE_ENV === 'production'
      const squareAccessToken = isProduction
        ? process.env.SQUARE_ACCESS_TOKEN
        : process.env.SQUARE_SANDBOX_ACCESS_TOKEN

      if (!squareAccessToken) {
        return NextResponse.json({ error: 'Square設定が不完全です' }, { status: 500 })
      }

      // Square Payments APIを使用して決済処理
      // TODO: Square SDK統合（現在はデモ）
      // const { Client, Environment } = require('square');
      // const client = new Client({
      //   accessToken: squareAccessToken,
      //   environment: isProduction ? Environment.Production : Environment.Sandbox
      // });
      
      // const response = await client.paymentsApi.createPayment({
      //   sourceId: sourceId,
      //   amountMoney: {
      //     amount: Math.round(payment.amount),
      //     currency: 'JPY'
      //   },
      //   idempotencyKey: paymentId
      // });

      // デモ用：決済を完了としてマーク
      const updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          paymentStatus: 'COMPLETED',
          transactionId: `demo_${sourceId.substring(0, 16)}`,
          paidAt: new Date(),
          metadata: JSON.stringify({
            sourceId,
            environment: isProduction ? 'production' : 'sandbox'
          })
        }
      })

      return NextResponse.json({
        message: '決済が完了しました',
        data: {
          paymentId: updatedPayment.id,
          status: updatedPayment.paymentStatus,
          amount: updatedPayment.amount
        }
      })
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

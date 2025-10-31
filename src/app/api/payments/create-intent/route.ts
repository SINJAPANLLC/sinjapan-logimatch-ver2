import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

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

    if (!stripe) {
      return NextResponse.json({ 
        error: 'Stripe設定が完了していません。STRIPE_SECRET_KEYを設定してください。' 
      }, { status: 500 })
    }

    const body = await request.json()
    const { amount, description } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: '有効な金額を入力してください' }, { status: 400 })
    }

    // ユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 })
    }

    // Stripe Payment Intentを作成
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // JPYは最小単位が円
      currency: 'jpy',
      metadata: {
        userId: user.id,
        userEmail: user.email,
        companyName: user.companyName,
      },
      description: description || `${user.companyName}様のお支払い`,
    })

    // Payment レコードを作成
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        amount: amount,
        paymentMethod: 'card',
        paymentStatus: 'PENDING',
        transactionId: paymentIntent.id,
        description: description || 'Stripe決済',
        metadata: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
        })
      }
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
      paymentIntentId: paymentIntent.id,
    })

  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json({ 
      error: 'Payment Intentの作成に失敗しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

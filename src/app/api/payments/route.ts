import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

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

    const body = await request.json()
    const { amount, paymentMethod } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: '有効な金額を入力してください' }, { status: 400 })
    }

    if (!['bank_transfer', 'card', 'direct_debit'].includes(paymentMethod)) {
      return NextResponse.json({ error: '無効な支払い方法です' }, { status: 400 })
    }

    // Paymentレコードを作成
    const payment = await prisma.payment.create({
      data: {
        userId: decoded.userId,
        amount: parseFloat(amount),
        paymentMethod,
        paymentStatus: paymentMethod === 'bank_transfer' ? 'PENDING' : 'PENDING',
        description: `${paymentMethod === 'bank_transfer' ? '銀行振込' : paymentMethod === 'card' ? 'カード決済' : '口座振替'}による支払い`,
      }
    })

    // 支払い方法に応じてレスポンスを返す
    let responseData: any = {
      paymentId: payment.id,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      status: payment.paymentStatus
    }

    if (paymentMethod === 'card') {
      // Square決済URLを生成（実装時はSquare APIを使用）
      // 現在はダミーURLを返す
      responseData.paymentUrl = `/api/payments/${payment.id}/square`
    } else if (paymentMethod === 'direct_debit') {
      // 会費ペイURLを生成（実装時は会費ペイAPIを使用）
      // 現在はダミーURLを返す
      responseData.paymentUrl = `/api/payments/${payment.id}/kaihipay`
    } else if (paymentMethod === 'bank_transfer') {
      // 銀行振込の場合は、振込先情報を返す
      responseData.bankInfo = {
        bankName: '相愛信用組合',
        branchName: '本店営業部',
        accountType: '普通',
        accountNumber: '0170074',
        accountHolder: 'ド）シン ジャパン'
      }
    }

    return NextResponse.json({
      message: '決済を開始しました',
      data: responseData
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json({ error: '決済の開始に失敗しました' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: '無効なトークンです' }, { status: 401 })
    }

    // ユーザーの決済履歴を取得
    const payments = await prisma.payment.findMany({
      where: {
        userId: decoded.userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20 // 最新20件を取得
    })

    return NextResponse.json({
      data: payments
    })

  } catch (error) {
    console.error('Payment fetch error:', error)
    return NextResponse.json({ error: '決済履歴の取得に失敗しました' }, { status: 500 })
  }
}

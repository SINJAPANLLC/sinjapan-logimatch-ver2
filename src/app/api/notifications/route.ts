import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

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

    // ユーザーのNotificationReceiptを取得
    const receipts = await prisma.notificationReceipt.findMany({
      where: {
        userId: decoded.userId,
        isDeleted: false,
      },
      include: {
        notification: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    })

    // Receipt情報を含めた通知データに変換
    const notifications = receipts.map(receipt => ({
      id: receipt.notification.id,
      title: receipt.notification.title,
      message: receipt.notification.message,
      type: receipt.notification.type,
      targetType: receipt.notification.targetType,
      targetUserId: receipt.notification.targetUserId,
      isRead: receipt.isRead,
      sentByEmail: receipt.notification.sentByEmail,
      createdAt: receipt.notification.createdAt,
      receiptId: receipt.id, // Receipt IDも返す（既読・削除時に使用）
    }))

    // 未読件数も取得
    const unreadCount = receipts.filter(r => !r.isRead).length

    return NextResponse.json({
      data: notifications,
      unreadCount,
    })

  } catch (error) {
    console.error('Notification fetch error:', error)
    return NextResponse.json({ 
      error: '通知の取得に失敗しました' 
    }, { status: 500 })
  }
}

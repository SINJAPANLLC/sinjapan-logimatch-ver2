import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function PUT(
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

    const notificationId = params.id

    // ユーザーのReceiptを既読にする
    const receipt = await prisma.notificationReceipt.updateMany({
      where: {
        notificationId,
        userId: decoded.userId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    if (receipt.count === 0) {
      return NextResponse.json({ error: '通知が見つかりません' }, { status: 404 })
    }

    return NextResponse.json({
      message: '通知を既読にしました',
    })

  } catch (error) {
    console.error('Notification update error:', error)
    return NextResponse.json({ 
      error: '通知の更新に失敗しました' 
    }, { status: 500 })
  }
}

export async function DELETE(
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

    const notificationId = params.id

    // ユーザーのReceiptを削除済みにする（実際には削除せず、フラグを立てる）
    const receipt = await prisma.notificationReceipt.updateMany({
      where: {
        notificationId,
        userId: decoded.userId,
      },
      data: {
        isDeleted: true,
      },
    })

    if (receipt.count === 0) {
      return NextResponse.json({ error: '通知が見つかりません' }, { status: 404 })
    }

    return NextResponse.json({
      message: '通知を削除しました',
    })

  } catch (error) {
    console.error('Notification delete error:', error)
    return NextResponse.json({ 
      error: '通知の削除に失敗しました' 
    }, { status: 500 })
  }
}

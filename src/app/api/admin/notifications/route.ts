import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, requireAdmin } from '@/lib/auth'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const admin = verifyToken(token)
    if (!admin || !requireAdmin(admin)) {
      return NextResponse.json({ error: '管理者権限が必要です' }, { status: 403 })
    }

    const body = await request.json()
    const { title, message, type = 'INFO', targetType, targetUserId, sendEmail = true } = body

    // バリデーション
    if (!title || !message || !targetType) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 })
    }

    if (targetType === 'SPECIFIC_USER' && !targetUserId) {
      return NextResponse.json({ error: '対象ユーザーIDが必要です' }, { status: 400 })
    }

    // 対象ユーザーを取得
    const targetUsers = await getTargetUsers(targetType, targetUserId)

    // 通知を作成
    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type,
        targetType,
        targetUserId,
        sentByEmail: sendEmail,
        createdBy: admin.userId,
        // 各ユーザーに対してReceiptを作成
        receipts: {
          create: targetUsers.map(user => ({
            userId: user.id,
          })),
        },
      },
    })

    // メール送信
    if (sendEmail) {
      for (const user of targetUsers) {
        try {
          await resend.emails.send({
            from: 'SIN JAPAN LOGI MATCH <noreply@sinjapan.jp>',
            to: user.email,
            subject: `【SIN JAPAN LOGI MATCH】${title}`,
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8">
                  <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #0070f3; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                    .message { background: white; padding: 20px; border-radius: 4px; margin: 20px 0; }
                    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1 style="margin: 0;">SIN JAPAN LOGI MATCH</h1>
                    </div>
                    <div class="content">
                      <h2>${title}</h2>
                      <div class="message">
                        <p style="white-space: pre-wrap;">${message}</p>
                      </div>
                      <p>この通知はダッシュボードでもご確認いただけます。</p>
                      <p><a href="https://sinjapan.jp/dashboard" style="color: #0070f3;">ダッシュボードを開く</a></p>
                    </div>
                    <div class="footer">
                      <p>このメールは配信専用です。返信はできません。</p>
                      <p>&copy; 2025 SIN JAPAN LLC. All rights reserved.</p>
                    </div>
                  </div>
                </body>
              </html>
            `,
          })
        } catch (emailError) {
          console.error('Email send error:', emailError)
        }
      }
    }

    return NextResponse.json({
      message: '通知を送信しました',
      data: notification,
    }, { status: 201 })

  } catch (error) {
    console.error('Notification create error:', error)
    return NextResponse.json({ 
      error: '通知の作成に失敗しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const admin = verifyToken(token)
    if (!admin || !requireAdmin(admin)) {
      return NextResponse.json({ error: '管理者権限が必要です' }, { status: 403 })
    }

    // 全通知を取得（最新順）
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({
      data: notifications,
    })

  } catch (error) {
    console.error('Notification fetch error:', error)
    return NextResponse.json({ 
      error: '通知の取得に失敗しました' 
    }, { status: 500 })
  }
}

async function getTargetUsers(targetType: string, targetUserId?: string) {
  if (targetType === 'SPECIFIC_USER' && targetUserId) {
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, email: true, companyName: true },
    })
    return user ? [user] : []
  }

  if (targetType === 'SHIPPER') {
    return await prisma.user.findMany({
      where: { userType: 'SHIPPER' },
      select: { id: true, email: true, companyName: true },
    })
  }

  if (targetType === 'CARRIER') {
    return await prisma.user.findMany({
      where: { userType: 'CARRIER' },
      select: { id: true, email: true, companyName: true },
    })
  }

  // ALL
  return await prisma.user.findMany({
    select: { id: true, email: true, companyName: true },
  })
}

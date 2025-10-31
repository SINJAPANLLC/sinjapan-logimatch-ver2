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

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: '無効なトークンです' }, { status: 401 })
    }

    const admin = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!admin?.isAdmin) {
      return NextResponse.json({ error: '管理者権限が必要です' }, { status: 403 })
    }

    const verifications = await prisma.verification.findMany({
      include: {
        user: {
          select: {
            id: true,
            companyName: true,
            email: true
          }
        }
      },
      orderBy: [
        { status: 'asc' },
        { submittedAt: 'desc' }
      ]
    })

    return NextResponse.json({ verifications })
  } catch (error) {
    console.error('Get admin verifications error:', error)
    return NextResponse.json({ error: '許可証の取得に失敗しました' }, { status: 500 })
  }
}

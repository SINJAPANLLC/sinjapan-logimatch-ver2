import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

// 全ユーザー取得
export async function GET(request: NextRequest) {
  try {
    const { error, status } = await verifyAdminToken(request)
    
    if (error) {
      return NextResponse.json({ error }, { status })
    }

    const { searchParams } = new URL(request.url)
    const userType = searchParams.get('userType')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (userType && userType !== 'all') {
      where.userType = userType
    }

    if (search) {
      where.OR = [
        { companyName: { contains: search } },
        { contactPerson: { contains: search } },
        { email: { contains: search } }
      ]
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        companyName: true,
        contactPerson: true,
        userType: true,
        verificationStatus: true,
        trustScore: true,
        isAdmin: true,
        createdAt: true,
        _count: {
          select: {
            shipments: true,
            vehicles: true,
            payments: true,
            offers: true
          }
        }
      }
    })

    return NextResponse.json({ users })

  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json({ error: 'ユーザー一覧の取得に失敗しました' }, { status: 500 })
  }
}

// ユーザー権限変更
export async function PATCH(request: NextRequest) {
  try {
    const { error, status } = await verifyAdminToken(request)
    
    if (error) {
      return NextResponse.json({ error }, { status })
    }

    const { userId, isAdmin } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'ユーザーIDが必要です' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isAdmin }
    })

    return NextResponse.json({
      message: `ユーザーの権限を${isAdmin ? '管理者に' : '一般ユーザーに'}変更しました`,
      user: updatedUser
    })

  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'ユーザー権限の変更に失敗しました' }, { status: 500 })
  }
}

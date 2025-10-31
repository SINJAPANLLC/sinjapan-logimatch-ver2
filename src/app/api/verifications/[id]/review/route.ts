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

    const body = await request.json()
    const { status, rejectionReason } = body

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: '無効なステータスです' }, { status: 400 })
    }

    const verification = await prisma.verification.update({
      where: { id: params.id },
      data: {
        status,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
        reviewedBy: decoded.userId,
        reviewedAt: new Date()
      }
    })

    if (status === 'APPROVED') {
      const allUserVerifications = await prisma.verification.findMany({
        where: { 
          userId: verification.userId,
          documentType: { in: ['BUSINESS_LICENSE', 'TRANSPORT_LICENSE', 'INSURANCE'] }
        }
      })

      const allApproved = allUserVerifications.every(v => v.status === 'APPROVED')

      if (allApproved) {
        await prisma.user.update({
          where: { id: verification.userId },
          data: { verificationStatus: 'APPROVED' }
        })
      }
    }

    return NextResponse.json({ verification })
  } catch (error) {
    console.error('Review verification error:', error)
    return NextResponse.json({ error: '審査に失敗しました' }, { status: 500 })
  }
}

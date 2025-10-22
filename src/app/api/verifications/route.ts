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

    const verifications = await prisma.verification.findMany({
      where: { userId: decoded.userId },
      orderBy: { submittedAt: 'desc' }
    })

    return NextResponse.json({ verifications })
  } catch (error) {
    console.error('Get verifications error:', error)
    return NextResponse.json({ error: '許可証の取得に失敗しました' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: '無効なトークンです' }, { status: 401 })
    }

    const body = await request.json()
    const { documentType, documentNumber, issueDate, expiryDate, documentUrl } = body

    if (!documentType) {
      return NextResponse.json({ error: '書類タイプを選択してください' }, { status: 400 })
    }

    const verification = await prisma.verification.create({
      data: {
        userId: decoded.userId,
        documentType,
        documentNumber,
        documentUrl,
        issueDate: issueDate ? new Date(issueDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        status: 'PENDING'
      }
    })

    return NextResponse.json({ verification }, { status: 201 })
  } catch (error) {
    console.error('Create verification error:', error)
    return NextResponse.json({ error: '許可証の提出に失敗しました' }, { status: 500 })
  }
}

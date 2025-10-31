import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'ユーザーIDが必要です' }, { status: 400 })
    }

    const ratings = await prisma.rating.findMany({
      where: { ratedUserId: userId },
      include: {
        rater: {
          select: {
            id: true,
            companyName: true,
            userType: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const avgScore = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
      : 5.0

    return NextResponse.json({ ratings, avgScore, totalRatings: ratings.length })
  } catch (error) {
    console.error('Get ratings error:', error)
    return NextResponse.json({ error: '評価の取得に失敗しました' }, { status: 500 })
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
    const { ratedUserId, score, comment, shipmentId } = body

    if (!ratedUserId || !score) {
      return NextResponse.json({ error: '必須項目を入力してください' }, { status: 400 })
    }

    if (score < 1 || score > 5) {
      return NextResponse.json({ error: '評価は1～5の範囲で入力してください' }, { status: 400 })
    }

    if (decoded.userId === ratedUserId) {
      return NextResponse.json({ error: '自分自身を評価することはできません' }, { status: 400 })
    }

    const existingRating = await prisma.rating.findFirst({
      where: {
        ratedUserId,
        raterUserId: decoded.userId,
        shipmentId: shipmentId || null
      }
    })

    if (existingRating) {
      return NextResponse.json({ error: 'この取引に対して既に評価済みです' }, { status: 400 })
    }

    const rating = await prisma.rating.create({
      data: {
        ratedUserId,
        raterUserId: decoded.userId,
        score,
        comment,
        shipmentId
      }
    })

    const allRatings = await prisma.rating.findMany({
      where: { ratedUserId }
    })

    const avgScore = allRatings.reduce((sum, r) => sum + r.score, 0) / allRatings.length

    await prisma.user.update({
      where: { id: ratedUserId },
      data: { trustScore: Math.round(avgScore * 10) / 10 }
    })

    return NextResponse.json({ rating }, { status: 201 })
  } catch (error) {
    console.error('Create rating error:', error)
    return NextResponse.json({ error: '評価の投稿に失敗しました' }, { status: 500 })
  }
}

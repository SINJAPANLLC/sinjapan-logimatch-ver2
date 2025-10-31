import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// 管理者権限チェックミドルウェア
async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value

  if (!token) {
    return NextResponse.json(
      { error: '管理者認証が必要です' },
      { status: 401 }
    )
  }

  const payload = verifyAdminSession(token)

  if (!payload) {
    return NextResponse.json(
      { error: '無効な管理者認証です' },
      { status: 401 }
    )
  }

  return payload
}

// リアルタイム分析データ取得
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request)
    if (admin instanceof NextResponse) return admin

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d'

    // 実際のデータベースから取得
    const [totalUsers, totalShipments, totalVehicles, recentShipments] = await Promise.all([
      prisma.user.count(),
      prisma.shipment.count(),
      prisma.vehicle.count(),
      prisma.shipment.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          shipper: {
            select: { companyName: true }
          },
          carrier: {
            select: { companyName: true }
          }
        }
      })
    ])

    // リアルタイム統計（デモ用）
    const realtimeStats = {
      onlineUsers: Math.floor(Math.random() * 50) + 120,
      activeShipments: Math.floor(Math.random() * 20) + 45,
      pendingApprovals: Math.floor(Math.random() * 10) + 8,
      systemHealth: 'excellent',
      serverLoad: Math.floor(Math.random() * 30) + 20,
      responseTime: Math.floor(Math.random() * 50) + 100
    }

    // 詳細統計
    const detailedStats = {
      totalUsers,
      activeUsers: Math.floor(totalUsers * 0.7),
      pendingUsers: Math.floor(totalUsers * 0.05),
      totalShipments,
      completedShipments: Math.floor(totalShipments * 0.9),
      totalVehicles,
      availableVehicles: Math.floor(totalVehicles * 0.8),
      totalRevenue: 125000000,
      monthlyRevenue: 8500000,
      averageMatchScore: 87.5,
      customerSatisfaction: 4.6
    }

    // 地域別統計
    const regionalStats = [
      { region: '関東', count: 456, revenue: 45000000 },
      { region: '関西', count: 234, revenue: 23000000 },
      { region: '中部', count: 189, revenue: 18000000 },
      { region: '九州', count: 123, revenue: 12000000 },
      { region: '北海道', count: 67, revenue: 6500000 }
    ]

    // 成長データ
    const userGrowth = [
      { month: '2023-07', count: 120 },
      { month: '2023-08', count: 145 },
      { month: '2023-09', count: 167 },
      { month: '2023-10', count: 189 },
      { month: '2023-11', count: 234 },
      { month: '2023-12', count: 278 },
      { month: '2024-01', count: totalUsers }
    ]

    const revenueGrowth = [
      { month: '2023-07', amount: 4500000 },
      { month: '2023-08', amount: 5200000 },
      { month: '2023-09', amount: 6100000 },
      { month: '2023-10', amount: 6800000 },
      { month: '2023-11', amount: 7500000 },
      { month: '2023-12', amount: 8200000 },
      { month: '2024-01', amount: detailedStats.monthlyRevenue }
    ]

    // 貨物タイプ別統計
    const cargoTypeStats = [
      { type: '一般貨物', count: 1234, percentage: 35.7 },
      { type: '冷蔵・冷凍', count: 567, percentage: 16.4 },
      { type: '大型貨物', count: 345, percentage: 10.0 },
      { type: '危険物', count: 123, percentage: 3.6 },
      { type: '生鮮食品', count: 456, percentage: 13.2 }
    ]

    // 最近の活動
    const recentActivities = [
      {
        id: '1',
        type: 'user_approved',
        message: '新しいユーザーが承認されました',
        details: '株式会社トランスロジック',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        icon: 'CheckCircle'
      },
      {
        id: '2',
        type: 'shipment_created',
        message: '新しい案件が投稿されました',
        details: '東京から大阪への大型貨物配送',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        icon: 'Package'
      },
      {
        id: '3',
        type: 'document_pending',
        message: '承認待ちの書類があります',
        details: '中部運送株式会社 - 事業許可証',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        icon: 'FileText'
      },
      {
        id: '4',
        type: 'payment_completed',
        message: '決済が完了しました',
        details: '関西物流株式会社 - ¥50,000',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        icon: 'CreditCard'
      }
    ]

    return NextResponse.json({
      realtime: realtimeStats,
      detailed: detailedStats,
      regional: regionalStats,
      growth: {
        users: userGrowth,
        revenue: revenueGrowth
      },
      cargoTypes: cargoTypeStats,
      recentActivities,
      recentShipments: recentShipments.map(s => ({
        id: s.id,
        title: s.cargoName,
        shipper: s.shipper.companyName,
        carrier: s.carrier?.companyName,
        status: s.status,
        createdAt: s.createdAt
      }))
    })
  } catch (error) {
    console.error('Get analytics error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { error, status, user } = await verifyAdminToken(request)
    
    if (error) {
      return NextResponse.json({ error }, { status })
    }

    // 実データから統計情報を集計
    const [
      totalUsers,
      totalShippers,
      totalCarriers,
      totalShipments,
      openShipments,
      completedShipments,
      totalVehicles,
      availableVehicles,
      totalPayments,
      totalRevenue,
      pendingVerifications,
      approvedVerifications
    ] = await Promise.all([
      // ユーザー統計
      prisma.user.count(),
      prisma.user.count({ where: { userType: 'SHIPPER' } }),
      prisma.user.count({ where: { userType: 'CARRIER' } }),
      
      // 荷物統計
      prisma.shipment.count(),
      prisma.shipment.count({ where: { status: 'OPEN' } }),
      prisma.shipment.count({ where: { status: 'DELIVERED' } }),
      
      // 車両統計
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: 'AVAILABLE' } }),
      
      // 決済統計
      prisma.payment.count(),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: 'COMPLETED' }
      }),
      
      // 認証統計
      prisma.verification.count({ where: { status: 'PENDING' } }),
      prisma.verification.count({ where: { status: 'APPROVED' } })
    ])

    // 最近のアクティビティ
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        companyName: true,
        userType: true,
        createdAt: true
      }
    })

    const recentShipments = await prisma.shipment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        cargoName: true,
        status: true,
        budget: true,
        createdAt: true,
        shipper: {
          select: {
            companyName: true
          }
        }
      }
    })

    const recentPayments = await prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amount: true,
        paymentMethod: true,
        paymentStatus: true,
        createdAt: true,
        user: {
          select: {
            companyName: true
          }
        }
      }
    })

    return NextResponse.json({
      stats: {
        users: {
          total: totalUsers,
          shippers: totalShippers,
          carriers: totalCarriers
        },
        shipments: {
          total: totalShipments,
          open: openShipments,
          completed: completedShipments
        },
        vehicles: {
          total: totalVehicles,
          available: availableVehicles
        },
        payments: {
          total: totalPayments,
          revenue: totalRevenue._sum.amount || 0
        },
        verifications: {
          pending: pendingVerifications,
          approved: approvedVerifications
        }
      },
      recent: {
        users: recentUsers,
        shipments: recentShipments,
        payments: recentPayments
      }
    })

  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: '統計情報の取得に失敗しました' }, { status: 500 })
  }
}

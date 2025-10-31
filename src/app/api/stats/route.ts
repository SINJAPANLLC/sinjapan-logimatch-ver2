import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // 荷物数の取得（すべての荷物）
    const shipmentCount = await prisma.shipment.count()
    
    // 空車数の取得（利用可能な車両数）
    const vehicleCount = await prisma.vehicle.count({
      where: {
        status: 'AVAILABLE',
        availableFrom: {
          lte: new Date()
        },
        availableTo: {
          gte: new Date()
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: {
        shipmentCount,
        vehicleCount
      }
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 検索パラメータを取得
    const query = searchParams.get('q') || ''
    const pickupPrefecture = searchParams.get('pickupPrefecture') || ''
    const deliveryPrefecture = searchParams.get('deliveryPrefecture') || ''
    const vehicleType = searchParams.get('vehicleType') || ''
    const status = searchParams.get('status') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // 検索条件を構築
    const where: any = {}

    // キーワード検索（荷物名、説明、住所など）
    if (query) {
      where.OR = [
        { cargoName: { contains: query, mode: 'insensitive' } },
        { cargoDescription: { contains: query, mode: 'insensitive' } },
        { pickupAddress: { contains: query, mode: 'insensitive' } },
        { deliveryAddress: { contains: query, mode: 'insensitive' } },
        { pickupCity: { contains: query, mode: 'insensitive' } },
        { deliveryCity: { contains: query, mode: 'insensitive' } }
      ]
    }

    // 出発地都道府県
    if (pickupPrefecture) {
      where.pickupPrefecture = pickupPrefecture
    }

    // 到着地都道府県
    if (deliveryPrefecture) {
      where.deliveryPrefecture = deliveryPrefecture
    }

    // 車両タイプ
    if (vehicleType) {
      where.requiredVehicleType = vehicleType
    }

    // ステータス
    if (status) {
      where.status = status
    }

    // 荷物を検索
    const [shipments, totalCount] = await Promise.all([
      prisma.shipment.findMany({
        where,
        include: {
          shipper: {
            select: {
              id: true,
              companyName: true,
              contactPerson: true,
              phone: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.shipment.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        shipments,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    })
  } catch (error) {
    console.error('Error searching shipments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to search shipments' },
      { status: 500 }
    )
  }
}

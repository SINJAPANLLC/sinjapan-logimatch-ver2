import { NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'
import { getUserFromRequest } from '@/lib/auth'
import { createOfferSchema } from '@/lib/validators'
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
} from '@/lib/api-response'
import prisma from '@/lib/prisma'

// オファー一覧取得
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }
    
    const { searchParams } = new URL(request.url)
    const shipmentId = searchParams.get('shipmentId')
    
    const where: any = {}
    
    // 運送会社の場合は自分のオファーのみ表示
    if (user.userType === 'CARRIER') {
      where.carrierId = user.userId
    }
    
    // 特定の配送案件のオファーを取得
    if (shipmentId) {
      where.shipmentId = shipmentId
    }
    
    const offers = await prisma.offer.findMany({
      where,
      include: {
        shipment: {
          include: {
            shipper: {
              select: {
                id: true,
                companyName: true,
                contactPerson: true,
              },
            },
          },
        },
        carrier: {
          select: {
            id: true,
            companyName: true,
            contactPerson: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    return successResponse(offers)
  } catch (error) {
    console.error('Get offers error:', error)
    return errorResponse('オファーの取得に失敗しました', 500)
  }
}

// オファー作成
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }
    
    // 運送会社のみ作成可能
    if (user.userType !== 'CARRIER') {
      return forbiddenResponse('運送会社のみがオファーを作成できます')
    }
    
    const body = await request.json()
    
    // バリデーション
    const validatedData = createOfferSchema.parse(body)
    
    // 配送案件の存在確認
    const shipment = await prisma.shipment.findUnique({
      where: { id: validatedData.shipmentId },
    })
    
    if (!shipment) {
      return notFoundResponse('配送案件が見つかりません')
    }
    
    // ステータスチェック
    if (shipment.status !== 'OPEN') {
      return errorResponse('この配送案件は既に募集が終了しています')
    }
    
    // 重複オファーチェック
    const existingOffer = await prisma.offer.findFirst({
      where: {
        shipmentId: validatedData.shipmentId,
        carrierId: user.userId,
      },
    })
    
    if (existingOffer) {
      return errorResponse('既にこの配送案件にオファーを送信しています')
    }
    
    // オファー作成
    const offer = await prisma.offer.create({
      data: {
        shipmentId: validatedData.shipmentId,
        carrierId: user.userId,
        proposedPrice: validatedData.proposedPrice,
        message: validatedData.message,
        vehicleInfo: validatedData.vehicleInfo,
        estimatedPickupTime: validatedData.estimatedPickupTime,
        estimatedDeliveryTime: validatedData.estimatedDeliveryTime,
      },
      include: {
        carrier: {
          select: {
            id: true,
            companyName: true,
            contactPerson: true,
            phone: true,
          },
        },
        shipment: {
          select: {
            id: true,
            cargoName: true,
            pickupPrefecture: true,
            deliveryPrefecture: true,
          },
        },
      },
    })
    
    return successResponse(offer, 201)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return errorResponse(error.errors[0].message)
    }
    console.error('Create offer error:', error)
    return errorResponse('オファーの作成に失敗しました', 500)
  }
}


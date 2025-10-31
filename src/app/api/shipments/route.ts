import { NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'
import { getUserFromRequest } from '@/lib/auth'
import { createShipmentSchema } from '@/lib/validators'
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from '@/lib/api-response'
import prisma from '@/lib/prisma'

// 配送案件一覧取得
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const pickupPrefecture = searchParams.get('pickupPrefecture')
    const deliveryPrefecture = searchParams.get('deliveryPrefecture')
    
    const where: any = {}
    
    // 荷主の場合は自分の案件のみ表示
    if (user.userType === 'SHIPPER') {
      where.shipperId = user.userId
    }
    
    // ステータスフィルター
    if (status) {
      where.status = status
    }
    
    // 集荷地フィルター
    if (pickupPrefecture) {
      where.pickupPrefecture = pickupPrefecture
    }
    
    // 配送地フィルター
    if (deliveryPrefecture) {
      where.deliveryPrefecture = deliveryPrefecture
    }
    
    const shipments = await prisma.shipment.findMany({
      where,
      include: {
        shipper: {
          select: {
            id: true,
            companyName: true,
            contactPerson: true,
            phone: true,
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
        offers: {
          include: {
            carrier: {
              select: {
                id: true,
                companyName: true,
                contactPerson: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    return successResponse(shipments)
  } catch (error) {
    console.error('Get shipments error:', error)
    return errorResponse('配送案件の取得に失敗しました', 500)
  }
}

// 配送案件作成
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }
    
    // 荷主のみ作成可能
    if (user.userType !== 'SHIPPER') {
      return forbiddenResponse('荷主のみが配送案件を作成できます')
    }
    
    // 許可証承認済みユーザーのみ作成可能
    const userProfile = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { verificationStatus: true }
    })
    
    if (userProfile?.verificationStatus !== 'APPROVED') {
      return forbiddenResponse('許可証が承認されるまで、配送案件を作成できません')
    }
    
    const body = await request.json()
    
    // バリデーション
    const validatedData = createShipmentSchema.parse(body)
    
    // 配送案件作成
    const shipment = await prisma.shipment.create({
      data: {
        shipperId: user.userId,
        cargoName: validatedData.cargoName,
        cargoDescription: validatedData.cargoDescription,
        cargoWeight: validatedData.cargoWeight,
        cargoVolume: validatedData.cargoVolume,
        cargoValue: validatedData.cargoValue,
        
        pickupAddress: validatedData.pickupAddress,
        pickupCity: validatedData.pickupCity,
        pickupPrefecture: validatedData.pickupPrefecture,
        pickupPostalCode: validatedData.pickupPostalCode,
        pickupDate: new Date(validatedData.pickupDate),
        pickupTimeFrom: validatedData.pickupTimeFrom,
        pickupTimeTo: validatedData.pickupTimeTo,
        
        deliveryAddress: validatedData.deliveryAddress,
        deliveryCity: validatedData.deliveryCity,
        deliveryPrefecture: validatedData.deliveryPrefecture,
        deliveryPostalCode: validatedData.deliveryPostalCode,
        deliveryDate: new Date(validatedData.deliveryDate),
        deliveryTimeFrom: validatedData.deliveryTimeFrom,
        deliveryTimeTo: validatedData.deliveryTimeTo,
        
        requiredVehicleType: validatedData.requiredVehicleType,
        needsHelper: validatedData.needsHelper,
        needsLiftGate: validatedData.needsLiftGate,
        temperature: validatedData.temperature,
        specialInstructions: validatedData.specialInstructions,
        
        budget: validatedData.budget,
      },
      include: {
        shipper: {
          select: {
            id: true,
            companyName: true,
            contactPerson: true,
            phone: true,
          },
        },
      },
    })
    
    return successResponse(shipment, 201)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return errorResponse(error.errors[0].message)
    }
    console.error('Create shipment error:', error)
    return errorResponse('配送案件の作成に失敗しました', 500)
  }
}


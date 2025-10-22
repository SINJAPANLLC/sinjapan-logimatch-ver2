import { NextRequest } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
} from '@/lib/api-response'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// 配送案件詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }
    
    const shipment = await prisma.shipment.findUnique({
      where: { id: params.id },
      include: {
        shipper: {
          select: {
            id: true,
            companyName: true,
            contactPerson: true,
            phone: true,
            email: true,
          },
        },
        carrier: {
          select: {
            id: true,
            companyName: true,
            contactPerson: true,
            phone: true,
            email: true,
          },
        },
        offers: {
          include: {
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
        },
      },
    })
    
    if (!shipment) {
      return notFoundResponse('配送案件が見つかりません')
    }
    
    return successResponse(shipment)
  } catch (error) {
    console.error('Get shipment error:', error)
    return errorResponse('配送案件の取得に失敗しました', 500)
  }
}

// 配送案件更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }
    
    const shipment = await prisma.shipment.findUnique({
      where: { id: params.id },
    })
    
    if (!shipment) {
      return notFoundResponse('配送案件が見つかりません')
    }
    
    // 自分の案件のみ更新可能
    if (shipment.shipperId !== user.userId) {
      return forbiddenResponse('この配送案件を更新する権限がありません')
    }
    
    const body = await request.json()
    
    const updatedShipment = await prisma.shipment.update({
      where: { id: params.id },
      data: {
        status: body.status,
      },
      include: {
        shipper: {
          select: {
            id: true,
            companyName: true,
            contactPerson: true,
          },
        },
        carrier: {
          select: {
            id: true,
            companyName: true,
            contactPerson: true,
          },
        },
      },
    })
    
    return successResponse(updatedShipment)
  } catch (error) {
    console.error('Update shipment error:', error)
    return errorResponse('配送案件の更新に失敗しました', 500)
  }
}

// 配送案件削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }
    
    const shipment = await prisma.shipment.findUnique({
      where: { id: params.id },
    })
    
    if (!shipment) {
      return notFoundResponse('配送案件が見つかりません')
    }
    
    // 自分の案件のみ削除可能
    if (shipment.shipperId !== user.userId) {
      return forbiddenResponse('この配送案件を削除する権限がありません')
    }
    
    await prisma.shipment.delete({
      where: { id: params.id },
    })
    
    return successResponse({ message: '配送案件を削除しました' })
  } catch (error) {
    console.error('Delete shipment error:', error)
    return errorResponse('配送案件の削除に失敗しました', 500)
  }
}


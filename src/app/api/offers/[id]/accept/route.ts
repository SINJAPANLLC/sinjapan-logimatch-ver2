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

// オファー承認
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }
    
    // オファー取得
    const offer = await prisma.offer.findUnique({
      where: { id: params.id },
      include: {
        shipment: true,
      },
    })
    
    if (!offer) {
      return notFoundResponse('オファーが見つかりません')
    }
    
    // 荷主のみが承認可能
    if (offer.shipment.shipperId !== user.userId) {
      return forbiddenResponse('このオファーを承認する権限がありません')
    }
    
    // オファーを承認してマッチング
    const [updatedOffer, updatedShipment] = await prisma.$transaction([
      // オファーを承認
      prisma.offer.update({
        where: { id: params.id },
        data: { status: 'ACCEPTED' },
      }),
      // 配送案件をマッチング済みに更新
      prisma.shipment.update({
        where: { id: offer.shipmentId },
        data: {
          status: 'MATCHED',
          carrierId: offer.carrierId,
        },
      }),
      // 他のオファーを拒否
      prisma.offer.updateMany({
        where: {
          shipmentId: offer.shipmentId,
          id: { not: params.id },
          status: 'PENDING',
        },
        data: { status: 'REJECTED' },
      }),
    ])
    
    return successResponse({
      offer: updatedOffer,
      shipment: updatedShipment,
    })
  } catch (error) {
    console.error('Accept offer error:', error)
    return errorResponse('オファーの承認に失敗しました', 500)
  }
}


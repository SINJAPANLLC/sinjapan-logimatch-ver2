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

// オファー拒否
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
    
    // 荷主のみが拒否可能
    if (offer.shipment.shipperId !== user.userId) {
      return forbiddenResponse('このオファーを拒否する権限がありません')
    }
    
    // オファーを拒否
    const updatedOffer = await prisma.offer.update({
      where: { id: params.id },
      data: { status: 'REJECTED' },
    })
    
    return successResponse(updatedOffer)
  } catch (error) {
    console.error('Reject offer error:', error)
    return errorResponse('オファーの拒否に失敗しました', 500)
  }
}


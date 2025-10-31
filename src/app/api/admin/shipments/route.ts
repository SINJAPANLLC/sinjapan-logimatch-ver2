import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { error, status } = await verifyAdminToken(request)
    
    if (error) {
      return NextResponse.json({ error }, { status })
    }

    const shipments = await prisma.shipment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        shipper: {
          select: {
            id: true,
            companyName: true,
            email: true
          }
        },
        _count: {
          select: {
            offers: true
          }
        }
      }
    })

    return NextResponse.json({ shipments })

  } catch (error) {
    console.error('Admin shipments error:', error)
    return NextResponse.json({ error: '荷物一覧の取得に失敗しました' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { error, status } = await verifyAdminToken(request)
    
    if (error) {
      return NextResponse.json({ error }, { status })
    }

    const { shipmentId, status: newStatus } = await request.json()

    if (!shipmentId || !newStatus) {
      return NextResponse.json({ error: '荷物IDとステータスが必要です' }, { status: 400 })
    }

    const updatedShipment = await prisma.shipment.update({
      where: { id: shipmentId },
      data: { status: newStatus }
    })

    return NextResponse.json({
      message: 'ステータスを更新しました',
      shipment: updatedShipment
    })

  } catch (error) {
    console.error('Update shipment error:', error)
    return NextResponse.json({ error: 'ステータスの更新に失敗しました' }, { status: 500 })
  }
}

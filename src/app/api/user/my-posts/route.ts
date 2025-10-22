import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // ユーザーの荷物投稿を取得
    const shipments = await prisma.shipment.findMany({
      where: { shipperId: user.userId },
      select: {
        id: true,
        cargoName: true,
        cargoDescription: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        pickupPrefecture: true,
        pickupCity: true,
        deliveryPrefecture: true,
        deliveryCity: true,
        pickupDate: true,
        cargoWeight: true,
        requiredVehicleType: true,
        budget: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    // ユーザーの空車投稿を取得
    const vehicles = await prisma.vehicle.findMany({
      where: { carrierId: user.userId },
      select: {
        id: true,
        vehicleType: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        maxWeight: true,
        availablePrefectures: true,
        availableFrom: true,
        availableTo: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    // 統一された形式に変換
    const posts = [
      ...shipments.map(shipment => ({
        id: shipment.id,
        type: 'shipment' as const,
        title: shipment.cargoName,
        description: shipment.cargoDescription,
        status: shipment.status,
        createdAt: shipment.createdAt,
        updatedAt: shipment.updatedAt,
        data: {
          pickupPrefecture: shipment.pickupPrefecture,
          pickupCity: shipment.pickupCity,
          deliveryPrefecture: shipment.deliveryPrefecture,
          deliveryCity: shipment.deliveryCity,
          pickupDate: shipment.pickupDate,
          cargoWeight: shipment.cargoWeight,
          requiredVehicleType: shipment.requiredVehicleType,
          budget: shipment.budget,
        }
      })),
      ...vehicles.map(vehicle => ({
        id: vehicle.id,
        type: 'vehicle' as const,
        title: vehicle.vehicleType,
        description: `${vehicle.vehicleType} - 最大積載重量: ${vehicle.maxWeight}kg`,
        status: vehicle.status,
        createdAt: vehicle.createdAt,
        updatedAt: vehicle.updatedAt,
        data: {
          vehicleType: vehicle.vehicleType,
          maxWeight: vehicle.maxWeight,
          availablePrefectures: vehicle.availablePrefectures,
          availableFrom: vehicle.availableFrom,
          availableTo: vehicle.availableTo,
        }
      }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch posts', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

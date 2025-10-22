import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // 荷物か空車かを判定して削除
    const shipment = await prisma.shipment.findFirst({
      where: { id, shipperId: user.userId }
    });

    if (shipment) {
      await prisma.shipment.delete({
        where: { id }
      });
    } else {
      const vehicle = await prisma.vehicle.findFirst({
        where: { id, carrierId: user.userId }
      });

      if (vehicle) {
        await prisma.vehicle.delete({
          where: { id }
        });
      } else {
        return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete post', 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      contactPerson,
      email,
      phone,
      companyName,
      postalCode,
      address,
    } = body;

    // ユーザー情報を更新
    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: {
        contactPerson,
        email,
        phone,
        companyName,
        postalCode,
        address,
      },
      select: {
        id: true,
        contactPerson: true,
        email: true,
        phone: true,
        companyName: true,
        postalCode: true,
        address: true,
        userType: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update profile', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

import { NextRequest } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { successResponse, unauthorizedResponse } from '@/lib/api-response'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }
    
    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        userType: true,
        companyName: true,
        contactPerson: true,
        phone: true,
        postalCode: true,
        address: true,
        createdAt: true,
      },
    })
    
    if (!userData) {
      return unauthorizedResponse()
    }
    
    return successResponse(userData)
  } catch (error) {
    console.error('Get user error:', error)
    return unauthorizedResponse()
  }
}


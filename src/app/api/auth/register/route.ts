import { NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'
import { registerSchema } from '@/lib/validators'
import { hashPassword, generateToken } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // バリデーション
    const validatedData = registerSchema.parse(body)
    
    // 既存ユーザーチェック
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })
    
    if (existingUser) {
      return errorResponse('このメールアドレスは既に登録されています')
    }
    
    // パスワードのハッシュ化
    const hashedPassword = await hashPassword(validatedData.password)
    
    // ユーザー作成
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        userType: validatedData.userType,
        companyName: validatedData.companyName,
        contactPerson: validatedData.contactPerson,
        phone: validatedData.phone,
        postalCode: validatedData.postalCode,
        address: validatedData.address,
      },
      select: {
        id: true,
        email: true,
        userType: true,
        companyName: true,
        contactPerson: true,
        phone: true,
        createdAt: true,
      },
    })
    
    // JWTトークン生成
    const token = generateToken({
      userId: user.id,
      email: user.email,
      userType: user.userType as 'SHIPPER' | 'CARRIER',
    })
    
    return successResponse({
      user,
      token,
    }, 201)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return errorResponse(error.errors[0].message)
    }
    console.error('Registration error:', error)
    return errorResponse('登録に失敗しました', 500)
  }
}


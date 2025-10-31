import { NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'
import { loginSchema } from '@/lib/validators'
import { verifyPassword, generateToken } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Login attempt for email:', body.email)
    
    // バリデーション
    const validatedData = loginSchema.parse(body)
    
    // ユーザー検索
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })
    
    if (!user) {
      console.log('User not found:', validatedData.email)
      return errorResponse('メールアドレスまたはパスワードが正しくありません', 401)
    }
    
    console.log('User found, verifying password...')
    // パスワード検証
    const isValidPassword = await verifyPassword(
      validatedData.password,
      user.password
    )
    
    if (!isValidPassword) {
      console.log('Password verification failed')
      return errorResponse('メールアドレスまたはパスワードが正しくありません', 401)
    }
    
    console.log('Login successful for:', user.email)
    
    // JWTトークン生成
    const token = generateToken({
      userId: user.id,
      email: user.email,
      userType: user.userType as 'SHIPPER' | 'CARRIER',
    })
    
    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType as 'SHIPPER' | 'CARRIER',
        companyName: user.companyName,
        contactPerson: user.contactPerson,
        phone: user.phone,
        isAdmin: user.isAdmin,
        verificationStatus: user.verificationStatus,
      },
      token,
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return errorResponse(error.errors[0].message)
    }
    console.error('Login error:', error)
    return errorResponse('ログインに失敗しました', 500)
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminSession, generateAdminToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// 管理者ログイン
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードが必要です' },
        { status: 400 }
      )
    }

    // 管理者ユーザーを検索
    const admin = await prisma.user.findUnique({
      where: { 
        email,
        userType: 'ADMIN'
      }
    })

    if (!admin) {
      return NextResponse.json(
        { error: '管理者アカウントが見つかりません' },
        { status: 401 }
      )
    }

    // パスワード検証（実際の実装ではbcryptを使用）
    // デモ用に簡単な検証
    if (password !== 'admin123' && password !== 'password') {
      return NextResponse.json(
        { error: 'パスワードが正しくありません' },
        { status: 401 }
      )
    }

    // 管理者トークン生成
    const token = generateAdminToken({
      userId: admin.id,
      email: admin.email,
      userType: 'ADMIN'
    })

    const response = NextResponse.json({
      message: '管理者ログインに成功しました',
      user: {
        userId: admin.id,
        email: admin.email,
        companyName: admin.companyName,
        userType: admin.userType,
        contactPerson: admin.contactPerson
      }
    })

    // セキュアなHTTPOnlyクッキーにトークンを設定
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24時間
    })

    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// 管理者認証状態確認
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: '認証トークンが見つかりません' },
        { status: 401 }
      )
    }

    const payload = verifyAdminSession(token)

    if (!payload) {
      return NextResponse.json(
        { error: '無効な認証トークンです' },
        { status: 401 }
      )
    }

    const admin = await prisma.user.findUnique({
      where: { 
        id: payload.userId,
        userType: 'ADMIN'
      },
      select: {
        id: true,
        email: true,
        companyName: true,
        userType: true,
        contactPerson: true,
        createdAt: true
      }
    })

    if (!admin) {
      return NextResponse.json(
        { error: '管理者アカウントが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: '認証成功',
      user: admin
    })
  } catch (error) {
    console.error('Admin auth check error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// 管理者ログアウト
export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json({
      message: '管理者ログアウトしました'
    })

    // クッキーを削除
    response.cookies.set('admin_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0
    })

    return response
  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

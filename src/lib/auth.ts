import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET as string
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set. Please configure it in your environment.')
}

export interface JWTPayload {
  userId: string
  email: string
  userType: 'SHIPPER' | 'CARRIER' | 'ADMIN'
}

// パスワードのハッシュ化
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// パスワードの検証
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// JWTトークンの生成
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// JWTトークンの検証
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

// リクエストからユーザー情報を取得
export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return null
  }
  
  return verifyToken(token)
}

// Cookieからトークンを取得
export function getTokenFromCookies(cookies: string): string | null {
  const tokenCookie = cookies
    .split(';')
    .find((c) => c.trim().startsWith('token='))
  
  if (!tokenCookie) {
    return null
  }
  
  return tokenCookie.split('=')[1]
}

// 管理者権限チェック
export function isAdmin(userType: string): boolean {
  return userType === 'ADMIN'
}

// 管理者認証ミドルウェア
export function requireAdmin(payload: JWTPayload): boolean {
  return payload.userType === 'ADMIN'
}

// セキュアな管理者トークン生成
export function generateAdminToken(payload: JWTPayload): string {
  if (payload.userType !== 'ADMIN') {
    throw new Error('管理者権限が必要です')
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
}

// 管理者セッション検証
export function verifyAdminSession(token: string): JWTPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload
    if (payload.userType !== 'ADMIN') {
      return null
    }
    return payload
  } catch (error) {
    return null
  }
}


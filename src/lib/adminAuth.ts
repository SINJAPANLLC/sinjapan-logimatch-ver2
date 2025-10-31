import { NextRequest } from 'next/server'
import { verifyToken } from './auth'
import { prisma } from './prisma'

export async function verifyAdminToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return { error: '認証が必要です', status: 401, user: null }
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return { error: '無効なトークンです', status: 401, user: null }
  }

  // ユーザー情報を取得してadmin権限を確認
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId }
  })

  if (!user) {
    return { error: 'ユーザーが見つかりません', status: 404, user: null }
  }

  if (!user.isAdmin) {
    return { error: '管理者権限が必要です', status: 403, user: null }
  }

  return { error: null, status: 200, user }
}

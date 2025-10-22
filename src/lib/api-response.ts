import { NextResponse } from 'next/server'

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  )
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  )
}

export function unauthorizedResponse(message = '認証が必要です') {
  return errorResponse(message, 401)
}

export function forbiddenResponse(message = 'アクセス権限がありません') {
  return errorResponse(message, 403)
}

export function notFoundResponse(message = 'リソースが見つかりません') {
  return errorResponse(message, 404)
}


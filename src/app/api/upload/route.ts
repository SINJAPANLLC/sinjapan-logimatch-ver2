import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { ObjectStorageService } from '@/lib/objectStorage'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: '無効なトークンです' }, { status: 401 })
    }

    const objectStorageService = new ObjectStorageService()
    const uploadURL = await objectStorageService.getObjectEntityUploadURL()

    return NextResponse.json({
      uploadURL,
      message: 'アップロードURLを生成しました'
    })

  } catch (error) {
    console.error('Upload URL generation error:', error)
    return NextResponse.json({ 
      error: 'アップロードURLの生成に失敗しました' 
    }, { status: 500 })
  }
}

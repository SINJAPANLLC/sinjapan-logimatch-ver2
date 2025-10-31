import { NextRequest, NextResponse } from 'next/server'
import { ObjectStorageService, ObjectNotFoundError } from '@/lib/objectStorage'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { objectPath: string[] } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: '無効なトークンです' }, { status: 401 })
    }

    const objectPath = `/objects/${params.objectPath.join('/')}`
    const objectStorageService = new ObjectStorageService()
    
    const objectFile = await objectStorageService.getObjectEntityFile(objectPath)
    const downloadURL = await objectStorageService.getDownloadURL(objectFile)

    return NextResponse.redirect(downloadURL)

  } catch (error) {
    console.error('Object download error:', error)
    if (error instanceof ObjectNotFoundError) {
      return NextResponse.json({ error: 'ファイルが見つかりません' }, { status: 404 })
    }
    return NextResponse.json({ error: 'ファイルの取得に失敗しました' }, { status: 500 })
  }
}

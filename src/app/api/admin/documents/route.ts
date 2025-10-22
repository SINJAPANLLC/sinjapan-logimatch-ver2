import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// 管理者権限チェックミドルウェア
async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value

  if (!token) {
    return NextResponse.json(
      { error: '管理者認証が必要です' },
      { status: 401 }
    )
  }

  const payload = verifyAdminSession(token)

  if (!payload) {
    return NextResponse.json(
      { error: '無効な管理者認証です' },
      { status: 401 }
    )
  }

  return payload
}

// 許可証・書類一覧取得
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request)
    if (admin instanceof NextResponse) return admin

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (type && type !== 'all') {
      where.type = type
    }

    // デモ用の書類データ
    const sampleDocuments = [
      {
        id: '1',
        userId: '1',
        type: 'business_license',
        name: '事業許可証',
        status: 'pending',
        uploadedAt: '2024-01-15',
        fileUrl: '/documents/business_license_1.pdf',
        user: {
          companyName: '株式会社トランスロジック',
          contactPerson: '山田花子',
          email: 'yamada@translogic.co.jp'
        }
      },
      {
        id: '2',
        userId: '2',
        type: 'transport_license',
        name: '一般貨物自動車運送事業許可証',
        status: 'pending',
        uploadedAt: '2024-01-15',
        fileUrl: '/documents/transport_license_2.pdf',
        user: {
          companyName: '関西物流株式会社',
          contactPerson: '鈴木一郎',
          email: 'suzuki@kansai-logistics.co.jp'
        }
      },
      {
        id: '3',
        userId: '1',
        type: 'insurance',
        name: '保険証券',
        status: 'approved',
        uploadedAt: '2024-01-10',
        reviewedAt: '2024-01-12',
        reviewer: '管理者',
        fileUrl: '/documents/insurance_1.pdf',
        expiryDate: '2025-01-10',
        user: {
          companyName: '株式会社トランスロジック',
          contactPerson: '山田花子',
          email: 'yamada@translogic.co.jp'
        }
      },
      {
        id: '4',
        userId: '3',
        type: 'tax_certificate',
        name: '納税証明書',
        status: 'pending',
        uploadedAt: '2024-01-16',
        fileUrl: '/documents/tax_certificate_3.pdf',
        user: {
          companyName: '中部運送株式会社',
          contactPerson: '田村四郎',
          email: 'tamura@chubu-transport.co.jp'
        }
      },
      {
        id: '5',
        userId: '4',
        type: 'business_license',
        name: '事業許可証',
        status: 'rejected',
        uploadedAt: '2024-01-14',
        reviewedAt: '2024-01-15',
        reviewer: '管理者',
        comment: '書類が不鮮明です。再提出をお願いします。',
        fileUrl: '/documents/business_license_4.pdf',
        user: {
          companyName: 'サンプル商事株式会社',
          contactPerson: '佐藤太郎',
          email: 'sato@sample.co.jp'
        }
      }
    ]

    let filteredDocuments = sampleDocuments

    if (status && status !== 'all') {
      filteredDocuments = filteredDocuments.filter(doc => doc.status === status)
    }

    if (type && type !== 'all') {
      filteredDocuments = filteredDocuments.filter(doc => doc.type === type)
    }

    const total = filteredDocuments.length
    const paginatedDocuments = filteredDocuments.slice(
      (page - 1) * limit,
      page * limit
    )

    return NextResponse.json({
      documents: paginatedDocuments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get documents error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// 書類承認/拒否
export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin(request)
    if (admin instanceof NextResponse) return admin

    const { documentId, action, comment } = await request.json()

    if (!documentId || !action) {
      return NextResponse.json(
        { error: '書類IDとアクションが必要です' },
        { status: 400 }
      )
    }

    // デモ用のレスポンス
    const result = {
      id: documentId,
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewedAt: new Date().toISOString().split('T')[0],
      reviewer: '管理者',
      comment: comment || ''
    }

    console.log(`Admin ${admin.userId} ${action} document ${documentId}${comment ? ` with comment: ${comment}` : ''}`)

    return NextResponse.json({
      message: `書類を${action === 'approve' ? '承認' : '拒否'}しました`,
      document: result
    })
  } catch (error) {
    console.error('Update document error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

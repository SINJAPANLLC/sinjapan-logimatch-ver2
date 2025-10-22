'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { Shield, CheckCircle, XCircle, Clock, FileText, User } from 'lucide-react'

interface Verification {
  id: string
  documentType: string
  documentNumber?: string
  status: string
  submittedAt: string
  user: {
    id: string
    companyName: string
    email: string
  }
}

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<Verification[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null)
  const [reviewAction, setReviewAction] = useState<'APPROVED' | 'REJECTED' | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      if (userData.isAdmin) {
        setIsAdmin(true)
        fetchAllVerifications()
      } else {
        router.push('/dashboard')
      }
    } else {
      router.push('/login')
    }
  }, [router])

  const fetchAllVerifications = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/verifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setVerifications(data.verifications)
      }
    } catch (error) {
      console.error('Failed to fetch verifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async () => {
    if (!selectedVerification || !reviewAction) return
    if (reviewAction === 'REJECTED' && !rejectionReason) {
      alert('却下理由を入力してください')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/verifications/${selectedVerification.id}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: reviewAction,
          rejectionReason: reviewAction === 'REJECTED' ? rejectionReason : null
        })
      })

      if (response.ok) {
        alert(`許可証を${reviewAction === 'APPROVED' ? '承認' : '却下'}しました`)
        setSelectedVerification(null)
        setReviewAction(null)
        setRejectionReason('')
        fetchAllVerifications()
      } else {
        const error = await response.json()
        alert(error.error || '処理に失敗しました')
      }
    } catch (error) {
      console.error('Review error:', error)
      alert('処理に失敗しました')
    }
  }

  const documentTypes: Record<string, string> = {
    'BUSINESS_LICENSE': '事業許可証',
    'TRANSPORT_LICENSE': '一般貨物自動車運送事業許可証',
    'INSURANCE': '保険証券',
    'OTHER': 'その他'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>審査待ち</span>
        </span>
      case 'APPROVED':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center space-x-1">
          <CheckCircle className="h-4 w-4" />
          <span>承認済み</span>
        </span>
      case 'REJECTED':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center space-x-1">
          <XCircle className="h-4 w-4" />
          <span>却下</span>
        </span>
      default:
        return null
    }
  }

  if (!isAdmin) {
    return null
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  const pendingVerifications = verifications.filter(v => v.status === 'PENDING')

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Shield className="h-7 w-7 text-blue-600" />
              <span>許可証承認管理</span>
            </h1>
            <p className="text-gray-600">ユーザーが提出した許可証を審査・承認します</p>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">審査待ち: </span>
            <span className="text-lg font-bold text-yellow-600">{pendingVerifications.length}件</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 審査待ち許可証 */}
        {pendingVerifications.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
              <h2 className="text-lg font-semibold text-gray-900">審査待ち許可証</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pendingVerifications.map((verification) => (
                  <div key={verification.id} className="border border-yellow-300 bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                          <FileText className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">
                            {documentTypes[verification.documentType] || verification.documentType}
                          </h3>
                          <p className="text-xs text-gray-600 flex items-center space-x-2 mt-1">
                            <User className="h-3 w-3" />
                            <span>{verification.user.companyName} ({verification.user.email})</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            許可証番号: {verification.documentNumber || '未入力'}
                          </p>
                          <p className="text-xs text-gray-500">
                            提出日: {new Date(verification.submittedAt).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedVerification(verification)
                            setReviewAction('APPROVED')
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>承認</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVerification(verification)
                            setReviewAction('REJECTED')
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>却下</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* すべての許可証 */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">すべての許可証</h2>
          </div>
          <div className="p-6">
            {verifications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">許可証が提出されていません</p>
            ) : (
              <div className="space-y-4">
                {verifications.map((verification) => (
                  <div key={verification.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          verification.status === 'APPROVED' ? 'bg-green-100' :
                          verification.status === 'PENDING' ? 'bg-yellow-100' :
                          'bg-red-100'
                        }`}>
                          <FileText className={`h-5 w-5 ${
                            verification.status === 'APPROVED' ? 'text-green-600' :
                            verification.status === 'PENDING' ? 'text-yellow-600' :
                            'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {documentTypes[verification.documentType] || verification.documentType}
                          </h3>
                          <p className="text-xs text-gray-600">{verification.user.companyName}</p>
                          <p className="text-xs text-gray-500">
                            提出日: {new Date(verification.submittedAt).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(verification.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 確認モーダル */}
      {selectedVerification && reviewAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">
              {reviewAction === 'APPROVED' ? '許可証を承認しますか？' : '許可証を却下しますか？'}
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600">企業名: {selectedVerification.user.companyName}</p>
              <p className="text-sm text-gray-600">
                書類: {documentTypes[selectedVerification.documentType]}
              </p>
            </div>
            
            {reviewAction === 'REJECTED' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  却下理由（必須）
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="却下の理由を入力してください"
                />
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setSelectedVerification(null)
                  setReviewAction(null)
                  setRejectionReason('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleReview}
                className={`flex-1 px-4 py-2 text-white rounded-lg ${
                  reviewAction === 'APPROVED' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {reviewAction === 'APPROVED' ? '承認' : '却下'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

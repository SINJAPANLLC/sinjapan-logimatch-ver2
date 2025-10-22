'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Shield,
  X
} from 'lucide-react'

interface Verification {
  id: string
  documentType: string
  documentNumber?: string
  status: string
  submittedAt: string
  reviewedAt?: string
  rejectionReason?: string
}

export default function VerificationPage() {
  const [verifications, setVerifications] = useState<Verification[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [documentType, setDocumentType] = useState('')
  const [documentNumber, setDocumentNumber] = useState('')

  useEffect(() => {
    fetchVerifications()
  }, [])

  const fetchVerifications = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/verifications', {
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

  const handleSubmit = async () => {
    if (!documentType || !documentNumber) {
      alert('すべての項目を入力してください')
      return
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/verifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          documentType,
          documentNumber
        })
      })

      if (response.ok) {
        alert('許可証を提出しました。審査をお待ちください。')
        setDocumentType('')
        setDocumentNumber('')
        fetchVerifications()
      } else {
        const error = await response.json()
        alert(error.error || '提出に失敗しました')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('提出に失敗しました')
    } finally {
      setSubmitting(false)
    }
  }

  const documentTypes = [
    { value: 'BUSINESS_LICENSE', label: '事業許可証', required: true },
    { value: 'TRANSPORT_LICENSE', label: '一般貨物自動車運送事業許可証', required: true },
    { value: 'INSURANCE', label: '保険証券', required: true },
    { value: 'OTHER', label: 'その他', required: false }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-green-600 bg-green-100'
      case 'PENDING': return 'text-yellow-600 bg-yellow-100'
      case 'REJECTED': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED': return '承認済み'
      case 'PENDING': return '審査中'
      case 'REJECTED': return '却下'
      default: return '不明'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="h-4 w-4" />
      case 'PENDING': return <Clock className="h-4 w-4" />
      case 'REJECTED': return <X className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const approvedCount = verifications.filter(v => v.status === 'APPROVED').length
  const requiredCount = documentTypes.filter(t => t.required).length
  const isFullyVerified = approvedCount >= requiredCount

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">許可証・認証</h1>
            <p className="text-gray-600">必要な許可証を提出して認証を受けましょう</p>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className={`h-6 w-6 ${isFullyVerified ? 'text-green-600' : 'text-yellow-600'}`} />
            <span className={`text-sm font-medium ${isFullyVerified ? 'text-green-600' : 'text-yellow-600'}`}>
              {isFullyVerified ? '認証完了' : '認証待ち'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 認証ステータス */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">認証ステータス</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {isFullyVerified ? '認証完了' : '認証待ち'}
                </h3>
                <p className="text-sm text-gray-600">
                  {approvedCount} / {requiredCount} の必須書類が承認されています
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                isFullyVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isFullyVerified ? '認証済み' : '認証待ち'}
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(approvedCount / requiredCount) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 提出済み許可証一覧 */}
        {verifications.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">提出済み書類</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {verifications.map((verification) => (
                  <div key={verification.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          verification.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                          verification.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {documentTypes.find(t => t.value === verification.documentType)?.label || verification.documentType}
                          </h3>
                          <p className="text-xs text-gray-500">
                            許可証番号: {verification.documentNumber || '未入力'}
                          </p>
                          <p className="text-xs text-gray-500">
                            提出日: {new Date(verification.submittedAt).toLocaleDateString('ja-JP')}
                          </p>
                          {verification.rejectionReason && (
                            <p className="text-xs text-red-600 mt-1">{verification.rejectionReason}</p>
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(verification.status)}`}>
                        {getStatusIcon(verification.status)}
                        <span>{getStatusText(verification.status)}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 新規提出フォーム */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">新規許可証提出</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  書類タイプ
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  {documentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} {type.required ? '(必須)' : '(任意)'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  許可証番号
                </label>
                <input
                  type="text"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例: 関東運輸局第12345号"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={!documentType || !documentNumber || submitting}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>提出中...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>提出</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 注意事項 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">重要事項</h3>
              <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                <li>• すべての必須書類が承認されるまで、荷物登録や車両登録はできません</li>
                <li>• 提出した情報は管理者が審査します（通常1-3営業日）</li>
                <li>• 正確な許可証番号を入力してください</li>
                <li>• 虚偽の情報を提供した場合、アカウントが停止される可能性があります</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

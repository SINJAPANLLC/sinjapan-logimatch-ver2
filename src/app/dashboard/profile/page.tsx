'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Edit, 
  Save, 
  X, 
  Shield, 
  Star, 
  TrendingUp, 
  Award, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Target,
  BarChart3
} from 'lucide-react'

interface UserProfile {
  id: string
  contactPerson: string
  email: string
  phone: string
  companyName: string
  postalCode: string
  address: string
  userType: string
  createdAt: string
  creditScore?: number
  rating?: number
  totalShipments?: number
  completedShipments?: number
  reliabilityScore?: number
  responseTime?: number
  specialties?: string[]
  achievements?: string[]
  riskFactors?: string[]
}

interface CreditScoreBreakdown {
  paymentHistory: number
  transactionVolume: number
  responseTime: number
  completionRate: number
  userFeedback: number
  accountAge: number
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    contactPerson: '',
    email: '',
    phone: '',
    companyName: '',
    postalCode: '',
    address: ''
  })

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = () => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const userProfile = JSON.parse(userData)
      // 信用スコア関連のデータを追加（実際のアプリではAPIから取得）
      const enhancedProfile = {
        ...userProfile,
        creditScore: userProfile.creditScore || 85,
        rating: userProfile.rating || 4.2,
        totalShipments: userProfile.totalShipments || 45,
        completedShipments: userProfile.completedShipments || 42,
        reliabilityScore: userProfile.reliabilityScore || 88,
        responseTime: userProfile.responseTime || 25,
        specialties: userProfile.specialties || ['一般貨物', '関東圏', '急便対応'],
        achievements: userProfile.achievements || ['新規登録', '初回取引完了', '5件取引達成'],
        riskFactors: userProfile.riskFactors || []
      }
      setUser(enhancedProfile)
      setFormData({
        contactPerson: userProfile.contactPerson || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        companyName: userProfile.companyName || '',
        postalCode: userProfile.postalCode || '',
        address: userProfile.address || ''
      })
    }
    setLoading(false)
  }

  const handleEdit = () => {
    setEditing(true)
  }

  const handleCancel = () => {
    setEditing(false)
    loadUserProfile()
  }

  const handleSave = async () => {
    try {
      // ここでAPIを呼び出してプロフィールを更新
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedUser = { ...user, ...formData }
      setUser(updatedUser as UserProfile)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('プロフィールの更新に失敗しました')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getCreditScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getCreditScoreLevel = (score: number) => {
    if (score >= 90) return '優秀'
    if (score >= 80) return '良好'
    if (score >= 70) return '普通'
    return '要改善'
  }

  const getCreditScoreBreakdown = (): CreditScoreBreakdown => {
    return {
      paymentHistory: 95,
      transactionVolume: 80,
      responseTime: 75,
      completionRate: 93,
      userFeedback: 88,
      accountAge: 70
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600 text-lg">読み込み中...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">プロフィール</h1>
            <p className="text-gray-600">アカウント情報を管理できます</p>
          </div>
          <div className="flex space-x-2">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>保存</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>キャンセル</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>編集</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* プロフィールカード */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-gray-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {user?.contactPerson}
              </h2>
              <p className="text-gray-600 mb-4">{user?.companyName}</p>
              <div className="text-sm text-gray-500">
                <p>アカウント種別: {user?.userType === 'SHIPPER' ? '荷主' : '運送会社'}</p>
                <p>登録日: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ja-JP') : '-'}</p>
              </div>
            </div>
          </div>

          {/* 信用スコアカード */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">信用スコア</h3>
              </div>
              
              <div className="mb-4">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${getCreditScoreColor(user?.creditScore || 0)}`}>
                  {user?.creditScore}点
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  レベル: {getCreditScoreLevel(user?.creditScore || 0)}
                </p>
              </div>

              {/* 評価 */}
              <div className="mb-4">
                <div className="flex items-center justify-center mb-2">
                  {renderStars(user?.rating || 0)}
                  <span className="ml-2 text-sm text-gray-600">({user?.rating})</span>
                </div>
                <p className="text-sm text-gray-600">ユーザー評価</p>
              </div>

              {/* 実績 */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">取引実績</p>
                  <p className="font-semibold text-gray-900">
                    {user?.completedShipments}/{user?.totalShipments}件
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">信頼性</p>
                  <p className="font-semibold text-gray-900">{user?.reliabilityScore}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* 専門分野・実績 */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              専門分野・実績
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">専門分野</p>
                <div className="flex flex-wrap gap-1">
                  {user?.specialties?.map((specialty, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">実績バッジ</p>
                <div className="flex flex-wrap gap-1">
                  {user?.achievements?.map((achievement, idx) => (
                    <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 詳細情報 */}
        <div className="lg:col-span-2">
          {/* 信用スコア詳細分析 */}
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                信用スコア詳細分析
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(() => {
                  const breakdown = getCreditScoreBreakdown()
                  return Object.entries(breakdown).map(([key, value]) => {
                    const labels = {
                      paymentHistory: '支払い履歴',
                      transactionVolume: '取引量',
                      responseTime: 'レスポンス時間',
                      completionRate: '完了率',
                      userFeedback: 'ユーザーフィードバック',
                      accountAge: 'アカウント年数'
                    }
                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">{labels[key as keyof typeof labels]}</span>
                          <span className="text-sm font-semibold text-gray-900">{value}点</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })
                })()}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  スコア向上のヒント
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 迅速なレスポンスで取引相手の信頼を獲得しましょう</li>
                  <li>• 定期的な取引で取引量を増やしましょう</li>
                  <li>• 高品質なサービスでユーザー評価を向上させましょう</li>
                  <li>• プロフィール情報を充実させて信頼性を高めましょう</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">基本情報</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    担当者名
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.contactPerson}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-2" />
                    メールアドレス
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-2" />
                    電話番号
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="h-4 w-4 inline mr-2" />
                    会社名
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.companyName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  郵便番号
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 123-4567"
                  />
                ) : (
                  <p className="text-gray-900">{user?.postalCode || '未設定'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  住所
                </label>
                {editing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="住所を入力してください"
                  />
                ) : (
                  <p className="text-gray-900">{user?.address || '未設定'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

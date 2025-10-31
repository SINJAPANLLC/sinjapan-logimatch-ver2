'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  Users, 
  FileText, 
  Save, 
  X, 
  Edit,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function CompanyDetailsPage() {
  const [editing, setEditing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    companyName: '',
    companyNameKana: '',
    representativeName: '',
    representativeNameKana: '',
    businessType: '',
    industry: '',
    capital: '',
    establishedDate: '',
    employeeCount: '',
    website: '',
    description: '',
    businessLicense: '',
    transportLicense: '',
    insuranceNumber: '',
    taxId: ''
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const userProfile = JSON.parse(userData)
      setUser(userProfile)
      setFormData({
        companyName: userProfile.companyName || '',
        companyNameKana: userProfile.companyNameKana || '',
        representativeName: userProfile.representativeName || '',
        representativeNameKana: userProfile.representativeNameKana || '',
        businessType: userProfile.businessType || '',
        industry: userProfile.industry || '',
        capital: userProfile.capital || '',
        establishedDate: userProfile.establishedDate || '',
        employeeCount: userProfile.employeeCount || '',
        website: userProfile.website || '',
        description: userProfile.description || '',
        businessLicense: userProfile.businessLicense || '',
        transportLicense: userProfile.transportLicense || '',
        insuranceNumber: userProfile.insuranceNumber || '',
        taxId: userProfile.taxId || ''
      })
    }
  }, [])

  const handleEdit = () => {
    setEditing(true)
  }

  const handleCancel = () => {
    setEditing(false)
    if (user) {
      setFormData({
        companyName: user.companyName || '',
        companyNameKana: user.companyNameKana || '',
        representativeName: user.representativeName || '',
        representativeNameKana: user.representativeNameKana || '',
        businessType: user.businessType || '',
        industry: user.industry || '',
        capital: user.capital || '',
        establishedDate: user.establishedDate || '',
        employeeCount: user.employeeCount || '',
        website: user.website || '',
        description: user.description || '',
        businessLicense: user.businessLicense || '',
        transportLicense: user.transportLicense || '',
        insuranceNumber: user.insuranceNumber || '',
        taxId: user.taxId || ''
      })
    }
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/company-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to update company details')
      }

      const updatedUser = { ...user, ...formData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setEditing(false)
      alert('企業詳細情報を更新しました')
    } catch (error) {
      console.error('Error updating company details:', error)
      alert('企業詳細情報の更新に失敗しました')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const businessTypes = [
    '株式会社', '有限会社', '合同会社', '合資会社', '合名会社', '個人事業主', 'その他'
  ]

  const industries = [
    '物流・運送業', '製造業', '小売業', '卸売業', '建設業', 'IT・通信業', '金融業', '不動産業', 'その他'
  ]

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">企業詳細情報</h1>
            <p className="text-gray-600">企業の詳細情報を管理できます</p>
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

      <div className="space-y-6">
        {/* 基本情報 */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              基本情報
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">会社名 *</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="株式会社サンプル"
                  />
                ) : (
                  <p className="text-gray-900">{formData.companyName || '未設定'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">会社名（カナ）</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.companyNameKana}
                    onChange={(e) => handleInputChange('companyNameKana', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="カブシキガイシャサンプル"
                  />
                ) : (
                  <p className="text-gray-900">{formData.companyNameKana || '未設定'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">代表者名 *</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.representativeName}
                    onChange={(e) => handleInputChange('representativeName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="山田太郎"
                  />
                ) : (
                  <p className="text-gray-900">{formData.representativeName || '未設定'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">代表者名（カナ）</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.representativeNameKana}
                    onChange={(e) => handleInputChange('representativeNameKana', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ヤマダタロウ"
                  />
                ) : (
                  <p className="text-gray-900">{formData.representativeNameKana || '未設定'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">法人格 *</label>
                {editing ? (
                  <select
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">選択してください</option>
                    {businessTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{formData.businessType || '未設定'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">業種 *</label>
                {editing ? (
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">選択してください</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{formData.industry || '未設定'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">資本金</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.capital}
                    onChange={(e) => handleInputChange('capital', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1000万円"
                  />
                ) : (
                  <p className="text-gray-900">{formData.capital || '未設定'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">設立日</label>
                {editing ? (
                  <input
                    type="date"
                    value={formData.establishedDate}
                    onChange={(e) => handleInputChange('establishedDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{formData.establishedDate || '未設定'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">従業員数</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.employeeCount}
                    onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="50名"
                  />
                ) : (
                  <p className="text-gray-900">{formData.employeeCount || '未設定'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ウェブサイト</label>
                {editing ? (
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                ) : (
                  <p className="text-gray-900">{formData.website || '未設定'}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">事業内容・企業概要</label>
              {editing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="企業の事業内容や概要を記載してください"
                />
              ) : (
                <p className="text-gray-900 whitespace-pre-wrap">{formData.description || '未設定'}</p>
              )}
            </div>
          </div>
        </div>

        {/* 許可・認証情報 */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              許可・認証情報
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">事業許可番号</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.businessLicense}
                    onChange={(e) => handleInputChange('businessLicense', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="第1234567890号"
                  />
                ) : (
                  <p className="text-gray-900">{formData.businessLicense || '未設定'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">一般貨物自動車運送事業許可</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.transportLicense}
                    onChange={(e) => handleInputChange('transportLicense', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="第1234567890号"
                  />
                ) : (
                  <p className="text-gray-900">{formData.transportLicense || '未設定'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">保険証券番号</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.insuranceNumber}
                    onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1234567890"
                  />
                ) : (
                  <p className="text-gray-900">{formData.insuranceNumber || '未設定'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">法人番号</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1234567890123"
                  />
                ) : (
                  <p className="text-gray-900">{formData.taxId || '未設定'}</p>
                )}
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
              <p className="text-sm text-yellow-700 mt-1">
                許可・認証情報は取引の信頼性向上のために重要です。正確な情報を入力してください。
                虚偽の情報を入力した場合、アカウントが停止される可能性があります。
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}


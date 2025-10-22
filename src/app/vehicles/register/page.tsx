'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Truck, 
  MapPin, 
  Calendar, 
  Weight, 
  DollarSign, 
  User, 
  Phone, 
  Mail,
  Save,
  X,
  Plus,
  Trash2,
  Shield,
  AlertCircle
} from 'lucide-react'

export default function VehicleRegisterPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isVerified, setIsVerified] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState('')
  const [formData, setFormData] = useState({
    vehicleType: '',
    vehicleNumber: '',
    maxWeight: '',
    availablePrefectures: [] as string[],
    availableFrom: '',
    availableTo: '',
    basePrice: '',
    driverName: '',
    driverPhone: '',
    driverEmail: '',
    specialFeatures: [] as string[],
    notes: ''
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setVerificationStatus(parsedUser.verificationStatus || 'PENDING')
    setIsVerified(parsedUser.verificationStatus === 'APPROVED')
  }, [router])

  const vehicleTypes = [
    '軽トラック', '小型トラック', '中型トラック', '大型トラック', 'トレーラー', '冷凍車', '冷蔵車', 'その他'
  ]

  const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ]

  const specialFeatures = [
    'クレーン付き', 'リフト付き', '冷蔵機能', '冷凍機能', '温蔵機能', '危険物輸送対応',
    '美術品輸送対応', '精密機器輸送対応', '24時間対応', '急便対応', '長距離対応', 'その他'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 未承認チェック
    if (!isVerified) {
      setError('許可証が承認されるまで、車両の登録はできません。')
      return
    }
    
    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          maxWeight: parseFloat(formData.maxWeight),
          basePrice: parseFloat(formData.basePrice),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '空車登録に失敗しました')
      }

      alert('空車登録が完了しました')
      router.push('/dashboard/vehicle-search')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePrefectureToggle = (prefecture: string) => {
    setFormData(prev => ({
      ...prev,
      availablePrefectures: prev.availablePrefectures.includes(prefecture)
        ? prev.availablePrefectures.filter(p => p !== prefecture)
        : [...prev.availablePrefectures, prefecture]
    }))
  }

  const handleSpecialFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      specialFeatures: prev.specialFeatures.includes(feature)
        ? prev.specialFeatures.filter(f => f !== feature)
        : [...prev.specialFeatures, feature]
    }))
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            空車登録
          </h1>
          <p className="text-gray-600">
            車両の詳細情報を入力して空車を登録してください
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* 未承認警告 */}
          {!isVerified && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 flex items-start">
              <Shield className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-800">許可証の承認が必要です</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  {verificationStatus === 'PENDING' 
                    ? '許可証の審査が完了するまで、車両の登録はできません。許可証ページで必要書類を提出してください。'
                    : '許可証が却下されています。許可証ページで再提出してください。'}
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/verification')}
                  className="mt-2 text-sm text-yellow-800 underline hover:text-yellow-900"
                >
                  許可証ページへ移動 →
                </button>
              </div>
            </div>
          )}

          {/* 車両基本情報 */}
          <div className="card fade-in-up" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-3 rounded-xl">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">車両基本情報</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    車両タイプ *
                  </label>
                  <select
                    required
                    value={formData.vehicleType}
                    onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">選択してください</option>
                    {vehicleTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    車両番号 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.vehicleNumber}
                    onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="例: 品川 500 あ 1234"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    最大積載重量 (kg) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.maxWeight}
                    onChange={(e) => handleInputChange('maxWeight', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    基本料金 (円/km)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => handleInputChange('basePrice', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="150"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 運行可能エリア */}
          <div className="card fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">運行可能エリア</h2>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">運行可能な都道府県を選択してください（複数選択可）</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {prefectures.map(prefecture => (
                  <label key={prefecture} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.availablePrefectures.includes(prefecture)}
                      onChange={() => handlePrefectureToggle(prefecture)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{prefecture}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 利用可能期間 */}
          <div className="card fade-in-up" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-3 rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">利用可能期間</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  利用開始日 *
                </label>
                <input
                  type="date"
                  required
                  value={formData.availableFrom}
                  onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  利用終了日 *
                </label>
                <input
                  type="date"
                  required
                  value={formData.availableTo}
                  onChange={(e) => handleInputChange('availableTo', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* 運転手情報 */}
          <div className="card fade-in-up" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-orange-600 to-yellow-500 p-3 rounded-xl">
                <User className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">運転手情報</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  運転手名 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.driverName}
                  onChange={(e) => handleInputChange('driverName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="山田太郎"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  電話番号 *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.driverPhone}
                  onChange={(e) => handleInputChange('driverPhone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="090-1234-5678"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={formData.driverEmail}
                  onChange={(e) => handleInputChange('driverEmail', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="yamada@example.com"
                />
              </div>
            </div>
          </div>

          {/* 特別機能 */}
          <div className="card fade-in-up" style={{animationDelay: '0.5s'}}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-500 p-3 rounded-xl">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">特別機能・設備</h2>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">該当する機能・設備を選択してください（複数選択可）</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {specialFeatures.map(feature => (
                  <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.specialFeatures.includes(feature)}
                      onChange={() => handleSpecialFeatureToggle(feature)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 備考 */}
          <div className="card fade-in-up" style={{animationDelay: '0.6s'}}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-500 p-3 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">備考・特記事項</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  備考・特記事項
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="その他、特別な要望や注意事項があれば記載してください"
                />
              </div>
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="flex flex-col sm:flex-row gap-4 fade-in-up" style={{animationDelay: '0.7s'}}>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary py-4 text-lg disabled:opacity-50"
            >
              {loading ? '登録中...' : '空車を登録'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard/vehicle-search')}
              className="flex-1 btn-secondary py-4 text-lg"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { 
  Package, 
  MapPin, 
  Calendar, 
  Truck, 
  DollarSign, 
  Brain, 
  Target, 
  Star, 
  Shield, 
  Clock, 
  TrendingUp, 
  Award,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

interface RecommendedCarrier {
  id: string
  companyName: string
  contactPerson: string
  phone: string
  email: string
  rating: number
  creditScore: number
  specialties: string[]
  responseTime: number
  reliabilityScore: number
  aiMatchScore: number
  aiRecommendationReason: string
  estimatedDeliveryTime: number
  costEfficiency: number
}

interface AISearchResult {
  carriers: RecommendedCarrier[]
  aiInsights: {
    totalMatches: number
    averageMatchScore: number
    topSpecialties: string[]
    marketTrends: string
  }
}

export default function NewShipmentPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [aiSearching, setAiSearching] = useState(false)
  const [aiResults, setAiResults] = useState<AISearchResult | null>(null)
  const [showAIResults, setShowAIResults] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pickupLocation: '',
    pickupPrefecture: '',
    pickupDateTime: '',
    deliveryLocation: '',
    deliveryPrefecture: '',
    deliveryDateTime: '',
    cargoType: '',
    cargoWeight: '',
    cargoSize: '',
    requiredVehicleType: 'SMALL_TRUCK',
    price: '',
    notes: '',
    urgency: 'normal',
    specialRequirements: ''
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.userType !== 'SHIPPER') {
      router.push('/dashboard')
      return
    }

    setUser(parsedUser)
  }, [router])

  const performAISearch = async () => {
    if (!formData.cargoWeight || !formData.cargoType || !formData.pickupPrefecture || !formData.deliveryPrefecture) {
      alert('AI検索には荷物の重量、種類、集荷・配送先の都道府県が必要です')
      return
    }

    setAiSearching(true)
    try {
      // AI検索のシミュレーション
      const mockAISearchResult: AISearchResult = {
        carriers: [
          {
            id: 'carrier-1',
            companyName: '株式会社トランスロジック',
            contactPerson: '山田花子',
            phone: '03-1234-5678',
            email: 'yamada@translogic.co.jp',
            rating: 4.8,
            creditScore: 95,
            specialties: ['大型貨物', '関東圏', '急便対応'],
            responseTime: 15,
            reliabilityScore: 98,
            aiMatchScore: 95,
            aiRecommendationReason: '荷物の重量と緊急度に最適な運送会社。過去の実績と高い信用スコアで信頼性が高い。',
            estimatedDeliveryTime: 6,
            costEfficiency: 92
          },
          {
            id: 'carrier-2',
            companyName: '関西物流株式会社',
            contactPerson: '鈴木一郎',
            phone: '06-9876-5432',
            email: 'suzuki@kansai-logistics.co.jp',
            rating: 4.6,
            creditScore: 88,
            specialties: ['冷蔵輸送', '関西圏', '生鮮食品'],
            responseTime: 25,
            reliabilityScore: 94,
            aiMatchScore: 87,
            aiRecommendationReason: '冷蔵輸送に特化した運送会社で、生鮮食品の輸送実績が豊富。',
            estimatedDeliveryTime: 8,
            costEfficiency: 85
          },
          {
            id: 'carrier-3',
            companyName: '中部運送株式会社',
            contactPerson: '田村四郎',
            phone: '052-5555-1234',
            email: 'tamura@chubu-transport.co.jp',
            rating: 4.4,
            creditScore: 82,
            specialties: ['一般貨物', '中部圏', 'コスト重視'],
            responseTime: 30,
            reliabilityScore: 89,
            aiMatchScore: 78,
            aiRecommendationReason: 'コストパフォーマンスが良く、中小規模の荷物に適している。',
            estimatedDeliveryTime: 12,
            costEfficiency: 95
          }
        ],
        aiInsights: {
          totalMatches: 3,
          averageMatchScore: 87,
          topSpecialties: ['大型貨物', '冷蔵輸送', '関東圏'],
          marketTrends: '現在、大型貨物の需要が高く、冷蔵輸送の需要も増加傾向にあります。'
        }
      }
      
      // 実際のAPI呼び出しをシミュレート
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setAiResults(mockAISearchResult)
      setShowAIResults(true)
    } catch (error) {
      console.error('Error performing AI search:', error)
      alert('AI検索に失敗しました')
    } finally {
      setAiSearching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          cargoWeight: parseFloat(formData.cargoWeight),
          price: parseFloat(formData.price),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '案件の投稿に失敗しました')
      }

      router.push('/shipments')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
    '岐阜県', '静岡県', '愛知県', '三重県',
    '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
    '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県',
    '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ]

  const vehicleTypes = [
    { value: 'LIGHT_TRUCK', label: '軽トラック' },
    { value: 'SMALL_TRUCK', label: '小型トラック' },
    { value: 'MEDIUM_TRUCK', label: '中型トラック' },
    { value: 'LARGE_TRUCK', label: '大型トラック' },
    { value: 'TRAILER', label: 'トレーラー' },
    { value: 'REFRIGERATED', label: '冷凍・冷蔵車' },
    { value: 'FLATBED', label: '平ボディ' },
    { value: 'WING', label: 'ウィング車' },
  ]

  const urgencyLevels = [
    { value: 'urgent', label: '緊急（24時間以内）', color: 'text-red-600' },
    { value: 'high', label: '高（3日以内）', color: 'text-orange-600' },
    { value: 'normal', label: '通常（1週間以内）', color: 'text-blue-600' },
    { value: 'low', label: '低（2週間以内）', color: 'text-green-600' }
  ]

  const getCreditScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
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

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8 fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            新規案件を投稿
          </h1>
          <p className="text-gray-600">
            配送案件の詳細を入力してください
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* 基本情報 */}
          <div className="card fade-in-up" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-3 rounded-xl">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">基本情報</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  案件タイトル *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="例: 東京から大阪への荷物配送"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  詳細説明 *
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="配送内容の詳細を記載してください"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* 集荷情報 */}
          <div className="card fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">集荷情報</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  集荷都道府県 *
                </label>
                <select
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.pickupPrefecture}
                  onChange={(e) => setFormData({ ...formData, pickupPrefecture: e.target.value })}
                >
                  <option value="">選択してください</option>
                  {prefectures.map((pref) => (
                    <option key={pref} value={pref}>{pref}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  集荷住所 *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="市区町村以降の住所"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  集荷希望日時 *
                </label>
                <input
                  type="datetime-local"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.pickupDateTime}
                  onChange={(e) => setFormData({ ...formData, pickupDateTime: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* 配送先情報 */}
          <div className="card fade-in-up" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">配送先情報</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  配送先都道府県 *
                </label>
                <select
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.deliveryPrefecture}
                  onChange={(e) => setFormData({ ...formData, deliveryPrefecture: e.target.value })}
                >
                  <option value="">選択してください</option>
                  {prefectures.map((pref) => (
                    <option key={pref} value={pref}>{pref}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  配送先住所 *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="市区町村以降の住所"
                  value={formData.deliveryLocation}
                  onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  配送希望日時 *
                </label>
                <input
                  type="datetime-local"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.deliveryDateTime}
                  onChange={(e) => setFormData({ ...formData, deliveryDateTime: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* 荷物情報 */}
          <div className="card fade-in-up" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-orange-600 to-yellow-500 p-3 rounded-xl">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">荷物情報</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  荷物の種類 *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="例: 電化製品、食品、建材など"
                  value={formData.cargoType}
                  onChange={(e) => setFormData({ ...formData, cargoType: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  重量 (kg) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="100"
                  value={formData.cargoWeight}
                  onChange={(e) => setFormData({ ...formData, cargoWeight: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  サイズ *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="例: 100cm × 50cm × 30cm"
                  value={formData.cargoSize}
                  onChange={(e) => setFormData({ ...formData, cargoSize: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  必要な車両タイプ *
                </label>
                <select
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.requiredVehicleType}
                  onChange={(e) => setFormData({ ...formData, requiredVehicleType: e.target.value })}
                >
                  {vehicleTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* AI検索用フィールド */}
          <div className="card fade-in-up" style={{animationDelay: '0.5s'}}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-3 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">AI おすすめ検索</h2>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">NEW</span>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    緊急度
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  >
                    {urgencyLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    特別な要件
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    placeholder="例: 温度管理、危険物輸送資格、24時間対応など"
                    value={formData.specialRequirements}
                    onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={performAISearch}
                  disabled={aiSearching}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {aiSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>AI検索中...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4" />
                      <span>AI おすすめ運送会社を検索</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* AI検索結果 */}
          {showAIResults && aiResults && (
            <div className="card fade-in-up" style={{animationDelay: '0.6s'}}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-3 rounded-xl">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">AI おすすめ運送会社</h2>
              </div>

              {/* AIインサイト */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{aiResults.aiInsights.totalMatches}件</div>
                    <div className="text-sm text-gray-600">マッチング数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{aiResults.aiInsights.averageMatchScore}%</div>
                    <div className="text-sm text-gray-600">平均マッチング率</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">市場動向</div>
                    <div className="text-xs text-gray-500 mt-1">{aiResults.aiInsights.marketTrends}</div>
                  </div>
                </div>
              </div>

              {/* おすすめ運送会社一覧 */}
              <div className="space-y-4">
                {aiResults.carriers.map((carrier, index) => (
                  <div key={carrier.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                            #{index + 1} おすすめ
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900">{carrier.companyName}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMatchScoreColor(carrier.aiMatchScore)}`}>
                            <Target className="h-3 w-3 inline mr-1" />
                            マッチング率: {carrier.aiMatchScore}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{carrier.aiRecommendationReason}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">担当者</p>
                        <p className="text-sm text-gray-600">{carrier.contactPerson}</p>
                        <p className="text-sm text-gray-600">TEL: {carrier.phone}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">評価</span>
                          <div className="flex items-center">
                            {renderStars(carrier.rating)}
                            <span className="ml-1 text-sm text-gray-600">({carrier.rating})</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">信用スコア</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCreditScoreColor(carrier.creditScore)}`}>
                            {carrier.creditScore}点
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">信頼性</span>
                          <span className="text-sm text-gray-600">{carrier.reliabilityScore}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {carrier.specialties.map((specialty, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <Brain className="h-4 w-4 mr-2" />
                        AI 予測情報
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="text-gray-700">予想配送時間: {carrier.estimatedDeliveryTime}時間</span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                          <span className="text-gray-700">コスト効率: {carrier.costEfficiency}%</span>
                        </div>
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-purple-500" />
                          <span className="text-gray-700">レスポンス時間: {carrier.responseTime}分</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                        詳細を見る
                      </button>
                      <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 text-sm">
                        AI おすすめで依頼
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 料金・備考 */}
          <div className="card fade-in-up" style={{animationDelay: '0.7s'}}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-500 p-3 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">料金・備考</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  希望運賃 (円) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="50000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  備考・特記事項
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="その他、特別な要望や注意事項があれば記載してください"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="flex flex-col sm:flex-row gap-4 fade-in-up" style={{animationDelay: '0.8s'}}>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary py-4 text-lg disabled:opacity-50"
            >
              {loading ? '投稿中...' : '案件を投稿'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="flex-1 btn-secondary py-4 text-lg"
            >
              キャンセル
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

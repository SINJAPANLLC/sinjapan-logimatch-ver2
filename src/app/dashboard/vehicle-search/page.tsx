'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Truck, 
  Search, 
  MapPin, 
  Calendar, 
  Weight, 
  DollarSign, 
  Plus, 
  Filter, 
  ArrowLeft, 
  ArrowRight,
  Star,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Brain,
  TrendingUp,
  Award,
  Zap,
  Target,
  BarChart3
} from 'lucide-react'

interface Vehicle {
  id: string
  vehicleType: string
  vehicleNumber: string
  maxWeight: number
  availablePrefectures: string
  availableFrom: string
  availableTo: string
  basePrice?: number
  driverName: string
  driverPhone: string
  status: string
  carrier: {
    id: string
    companyName: string
    contactPerson: string
    phone: string
    email: string
    rating: number
    totalShipments: number
    completedShipments: number
    creditScore: number
    specialties: string[]
    responseTime: number
    reliabilityScore: number
  }
  aiMatchScore?: number
  aiRecommendationReason?: string
  estimatedDeliveryTime?: number
  costEfficiency?: number
}

interface AISearchResult {
  vehicles: Vehicle[]
  aiInsights: {
    totalMatches: number
    averageMatchScore: number
    topSpecialties: string[]
    recommendedCarriers: string[]
    marketTrends: string
  }
}

export default function VehicleSearchPage() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [aiResults, setAiResults] = useState<AISearchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [aiSearching, setAiSearching] = useState(false)
  const [searchForm, setSearchForm] = useState({
    vehicleType: '',
    prefecture: '',
    status: 'AVAILABLE',
    cargoWeight: '',
    cargoType: '',
    urgency: 'normal',
    budget: '',
    specialRequirements: ''
  })
  const [showAIResults, setShowAIResults] = useState(false)

  const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ]

  const vehicleTypes = [
    '軽トラック', '小型トラック', '中型トラック', '大型トラック', 'トレーラー', '冷凍車', '冷蔵車', 'その他'
  ]

  const cargoTypes = [
    '一般貨物', '冷蔵・冷凍', '危険物', '生鮮食品', '精密機器', '美術品', '医薬品', 'その他'
  ]

  const urgencyLevels = [
    { value: 'urgent', label: '緊急（24時間以内）', color: 'text-red-600' },
    { value: 'high', label: '高（3日以内）', color: 'text-orange-600' },
    { value: 'normal', label: '通常（1週間以内）', color: 'text-blue-600' },
    { value: 'low', label: '低（2週間以内）', color: 'text-green-600' }
  ]

  const statuses = [
    { value: 'AVAILABLE', label: '利用可能' },
    { value: 'IN_USE', label: '使用中' },
    { value: 'MAINTENANCE', label: 'メンテナンス中' },
    { value: 'UNAVAILABLE', label: '利用不可' }
  ]

  useEffect(() => {
    loadVehicles()
  }, [])

  const loadVehicles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '20',
        ...searchForm
      })

      const response = await fetch(`/api/vehicles?${params}`)
      if (!response.ok) throw new Error('Failed to load vehicles')
      
      const data = await response.json()
      setVehicles(data.data?.vehicles || [])
    } catch (error) {
      console.error('Error loading vehicles:', error)
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }

  const performAISearch = async () => {
    setAiSearching(true)
    try {
      // AI検索のシミュレーション
      const mockAISearchResult: AISearchResult = {
        vehicles: [
          {
            id: '1',
            vehicleType: '大型トラック',
            vehicleNumber: '品川 500 あ 1234',
            maxWeight: 10000,
            availablePrefectures: '["東京都", "神奈川県", "埼玉県", "千葉県"]',
            availableFrom: '2024-01-20',
            availableTo: '2024-01-30',
            basePrice: 150,
            driverName: '田中太郎',
            driverPhone: '090-1234-5678',
            status: 'AVAILABLE',
            carrier: {
              id: 'carrier-1',
              companyName: '株式会社トランスロジック',
              contactPerson: '山田花子',
              phone: '03-1234-5678',
              email: 'yamada@translogic.co.jp',
              rating: 4.8,
              totalShipments: 156,
              completedShipments: 148,
              creditScore: 95,
              specialties: ['大型貨物', '関東圏', '急便対応'],
              responseTime: 15,
              reliabilityScore: 98
            },
            aiMatchScore: 95,
            aiRecommendationReason: '荷物の重量と緊急度に最適な車両。過去の実績と高い信用スコアで信頼性が高い。',
            estimatedDeliveryTime: 6,
            costEfficiency: 92
          },
          {
            id: '2',
            vehicleType: '冷蔵車',
            vehicleNumber: '大阪 500 い 5678',
            maxWeight: 5000,
            availablePrefectures: '["大阪府", "京都府", "兵庫県", "奈良県"]',
            availableFrom: '2024-01-20',
            availableTo: '2024-01-28',
            basePrice: 200,
            driverName: '佐藤次郎',
            driverPhone: '090-9876-5432',
            status: 'AVAILABLE',
            carrier: {
              id: 'carrier-2',
              companyName: '関西物流株式会社',
              contactPerson: '鈴木一郎',
              phone: '06-9876-5432',
              email: 'suzuki@kansai-logistics.co.jp',
              rating: 4.6,
              totalShipments: 89,
              completedShipments: 85,
              creditScore: 88,
              specialties: ['冷蔵輸送', '関西圏', '生鮮食品'],
              responseTime: 25,
              reliabilityScore: 94
            },
            aiMatchScore: 87,
            aiRecommendationReason: '冷蔵輸送に特化した車両で、生鮮食品の輸送実績が豊富。',
            estimatedDeliveryTime: 8,
            costEfficiency: 85
          },
          {
            id: '3',
            vehicleType: '中型トラック',
            vehicleNumber: '名古屋 500 う 9012',
            maxWeight: 3000,
            availablePrefectures: '["愛知県", "静岡県", "岐阜県", "三重県"]',
            availableFrom: '2024-01-20',
            availableTo: '2024-01-25',
            basePrice: 120,
            driverName: '高橋三郎',
            driverPhone: '090-5555-1234',
            status: 'AVAILABLE',
            carrier: {
              id: 'carrier-3',
              companyName: '中部運送株式会社',
              contactPerson: '田村四郎',
              phone: '052-5555-1234',
              email: 'tamura@chubu-transport.co.jp',
              rating: 4.4,
              totalShipments: 67,
              completedShipments: 63,
              creditScore: 82,
              specialties: ['一般貨物', '中部圏', 'コスト重視'],
              responseTime: 30,
              reliabilityScore: 89
            },
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
          recommendedCarriers: ['株式会社トランスロジック', '関西物流株式会社'],
          marketTrends: '現在、大型貨物の需要が高く、冷蔵輸送の需要も増加傾向にあります。'
        }
      }
      
      // 実際のAPI呼び出しをシミュレート
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setAiResults(mockAISearchResult)
      setShowAIResults(true)
    } catch (error) {
      console.error('Error performing AI search:', error)
    } finally {
      setAiSearching(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadVehicles()
  }

  const handleAISearch = (e: React.FormEvent) => {
    e.preventDefault()
    performAISearch()
  }

  const handleInputChange = (field: string, value: string) => {
    setSearchForm(prev => ({ ...prev, [field]: value }))
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800'
      case 'IN_USE': return 'bg-blue-100 text-blue-800'
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800'
      case 'UNAVAILABLE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">空車検索</h1>
            <p className="text-gray-600">条件を指定して空車を検索できます</p>
          </div>
          <button
            onClick={() => router.push('/vehicles/register')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>空車登録</span>
          </button>
        </div>
      </div>

      {/* 通常検索フォーム */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">車両タイプ</label>
              <select
                value={searchForm.vehicleType}
                onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">すべて</option>
                {vehicleTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">都道府県</label>
              <select
                value={searchForm.prefecture}
                onChange={(e) => handleInputChange('prefecture', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">すべて</option>
                {prefectures.map(pref => (
                  <option key={pref} value={pref}>{pref}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ステータス</label>
              <select
                value={searchForm.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>検索</span>
            </button>
          </div>
        </form>
      </div>

      {/* AI検索フォーム */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-sm border border-purple-200 p-6 mb-8">
        <div className="flex items-center mb-4">
          <Brain className="h-6 w-6 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">AI おすすめ検索</h3>
          <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">NEW</span>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          荷物の詳細を入力すると、AIが最適な運送会社をマッチング率と共にご提案します
        </p>
        
        <form onSubmit={handleAISearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">荷物の重量 (kg)</label>
              <input
                type="number"
                value={searchForm.cargoWeight}
                onChange={(e) => handleInputChange('cargoWeight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="例: 1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">荷物の種類</label>
              <select
                value={searchForm.cargoType}
                onChange={(e) => handleInputChange('cargoType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">選択してください</option>
                {cargoTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">緊急度</label>
              <select
                value={searchForm.urgency}
                onChange={(e) => handleInputChange('urgency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {urgencyLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">予算 (円)</label>
              <input
                type="number"
                value={searchForm.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="例: 50000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">特別な要件</label>
            <textarea
              value={searchForm.specialRequirements}
              onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              placeholder="例: 温度管理が必要、危険物輸送資格必須、24時間対応など"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={aiSearching}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {aiSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>AI検索中...</span>
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  <span>AI おすすめ検索</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* AI検索結果 */}
      {showAIResults && aiResults && (
        <div className="mb-8">
          {/* AIインサイト */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-sm border border-purple-200 p-6 mb-6">
            <div className="flex items-center mb-4">
              <Brain className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">AI 分析結果</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">マッチング数</span>
                </div>
                <p className="text-2xl font-bold text-purple-600 mt-1">{aiResults.aiInsights.totalMatches}件</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">平均マッチング率</span>
                </div>
                <p className="text-2xl font-bold text-blue-600 mt-1">{aiResults.aiInsights.averageMatchScore}%</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">おすすめ運送会社</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{aiResults.aiInsights.recommendedCarriers.length}社</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-orange-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">市場動向</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{aiResults.aiInsights.marketTrends}</p>
              </div>
            </div>
          </div>

          {/* AIおすすめ車両一覧 */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">AI おすすめ車両 ({aiResults.vehicles.length}件)</h2>
              <p className="text-sm text-gray-600">マッチング率順に表示されています</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {aiResults.vehicles.map((vehicle, index) => (
                <div key={vehicle.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                          #{index + 1} おすすめ
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900">{vehicle.vehicleType}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMatchScoreColor(vehicle.aiMatchScore || 0)}`}>
                          <Target className="h-3 w-3 inline mr-1" />
                          マッチング率: {vehicle.aiMatchScore}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{vehicle.aiRecommendationReason}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                      {statuses.find(s => s.value === vehicle.status)?.label}
                    </span>
                  </div>

                  {/* 運送会社情報 */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Truck className="h-4 w-4 mr-2" />
                      運送会社情報
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{vehicle.carrier.companyName}</p>
                        <p className="text-sm text-gray-600">担当: {vehicle.carrier.contactPerson}</p>
                        <p className="text-sm text-gray-600">TEL: {vehicle.carrier.phone}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">評価</span>
                          <div className="flex items-center">
                            {renderStars(vehicle.carrier.rating)}
                            <span className="ml-1 text-sm text-gray-600">({vehicle.carrier.rating})</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">信用スコア</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCreditScoreColor(vehicle.carrier.creditScore)}`}>
                            {vehicle.carrier.creditScore}点
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">実績</span>
                          <span className="text-sm text-gray-600">
                            {vehicle.carrier.completedShipments}/{vehicle.carrier.totalShipments}件完了
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 専門分野 */}
                    <div className="mt-3">
                      <span className="text-sm font-medium text-gray-700">専門分野: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {vehicle.carrier.specialties.map((specialty, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 車両詳細情報 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700 mb-4">
                    <div className="flex items-center">
                      <Weight className="h-4 w-4 mr-2 text-gray-500" />
                      最大積載重量: {vehicle.maxWeight}kg
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      運行可能エリア: {vehicle.availablePrefectures ? JSON.parse(vehicle.availablePrefectures).join(', ') : '-'}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      利用可能期間: {new Date(vehicle.availableFrom).toLocaleDateString()} - {new Date(vehicle.availableTo).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      基本料金: {vehicle.basePrice ? `${vehicle.basePrice}円/km` : '要相談'}
                    </div>
                  </div>

                  {/* AI予測情報 */}
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <Brain className="h-4 w-4 mr-2" />
                      AI 予測情報
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="text-gray-700">予想配送時間: {vehicle.estimatedDeliveryTime}時間</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-gray-700">コスト効率: {vehicle.costEfficiency}%</span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-purple-500" />
                        <span className="text-gray-700">信頼性スコア: {vehicle.carrier.reliabilityScore}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <p>運転手: {vehicle.driverName}</p>
                      <p>連絡先: {vehicle.driverPhone}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                        詳細を見る
                      </button>
                      <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 text-sm">
                        AI おすすめで依頼
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 通常検索結果 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">通常検索結果</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-gray-500">読み込み中...</div>
        ) : vehicles.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>該当する空車はありません</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {vehicles.map(vehicle => (
              <div key={vehicle.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{vehicle.vehicleType}</h3>
                    <p className="text-sm text-gray-600">車両番号: {vehicle.vehicleNumber}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                    {statuses.find(s => s.value === vehicle.status)?.label}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700">
                  <div className="flex items-center">
                    <Weight className="h-4 w-4 mr-2 text-gray-500" />
                    最大積載重量: {vehicle.maxWeight}kg
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    運行可能エリア: {vehicle.availablePrefectures ? JSON.parse(vehicle.availablePrefectures).join(', ') : '-'}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    利用可能期間: {new Date(vehicle.availableFrom).toLocaleDateString()} - {new Date(vehicle.availableTo).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                    基本料金: {vehicle.basePrice ? `${vehicle.basePrice}円/km` : '要相談'}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <p>運転手: {vehicle.driverName}</p>
                      <p>連絡先: {vehicle.driverPhone}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                        詳細を見る
                      </button>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                        依頼する
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

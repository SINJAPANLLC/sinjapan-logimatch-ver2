'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Search, 
  MapPin, 
  Calendar, 
  Weight, 
  DollarSign, 
  Truck, 
  Filter,
  Star,
  Clock,
  User,
  Phone,
  Mail,
  Eye,
  Heart,
  Share2,
  ArrowRight,
  Package,
  X,
  CheckCircle2
} from 'lucide-react'

interface Shipment {
  id: string
  title: string
  description: string
  shipper: {
    id: string
    companyName: string
    contactPerson: string
    rating: number
    creditScore: number
  }
  pickupLocation: {
    prefecture: string
    address: string
    dateTime: string
  }
  deliveryLocation: {
    prefecture: string
    address: string
    dateTime: string
  }
  cargo: {
    type: string
    weight: number
    size: string
    specialRequirements?: string
  }
  vehicleType: string
  price: number
  urgency: 'urgent' | 'high' | 'normal' | 'low'
  status: 'available' | 'matched' | 'in_transit' | 'delivered'
  createdAt: string
  aiMatchScore?: number
  isBookmarked?: boolean
}

export default function ShipmentSearchPage() {
  const router = useRouter()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchForm, setSearchForm] = useState({
    pickupPrefecture: '',
    deliveryPrefecture: '',
    cargoType: '',
    vehicleType: '',
    urgency: '',
    minPrice: '',
    maxPrice: '',
    dateRange: ''
  })
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [offerForm, setOfferForm] = useState({
    proposedPrice: '',
    message: '',
    estimatedPickupTime: '',
    estimatedDeliveryTime: ''
  })
  const [shareMessage, setShareMessage] = useState('')

  useEffect(() => {
    loadShipments()
    loadBookmarks()
  }, [])

  const loadBookmarks = () => {
    const bookmarks = localStorage.getItem('shipment_bookmarks')
    if (bookmarks) {
      const bookmarkedIds = JSON.parse(bookmarks)
      setShipments(prev => prev.map(shipment => ({
        ...shipment,
        isBookmarked: bookmarkedIds.includes(shipment.id)
      })))
    }
  }

  const loadShipments = async () => {
    setLoading(true)
    try {
      const sampleShipments: Shipment[] = [
        {
          id: '1',
          title: '東京から大阪への大型貨物配送',
          description: '大型機械の輸送をお願いします。取り扱いには注意が必要です。',
          shipper: {
            id: 'shipper-1',
            companyName: 'サンプル商事株式会社',
            contactPerson: '佐藤太郎',
            rating: 4.5,
            creditScore: 90
          },
          pickupLocation: {
            prefecture: '東京都',
            address: '品川区大崎1-2-3',
            dateTime: '2024-01-20 09:00'
          },
          deliveryLocation: {
            prefecture: '大阪府',
            address: '大阪市北区梅田1-1-1',
            dateTime: '2024-01-21 15:00'
          },
          cargo: {
            type: '大型機械',
            weight: 5000,
            size: '300cm × 200cm × 150cm',
            specialRequirements: '取り扱い注意、クレーン作業必要'
          },
          vehicleType: '大型トラック',
          price: 150000,
          urgency: 'normal',
          status: 'available',
          createdAt: '2024-01-15',
          aiMatchScore: 95,
          isBookmarked: false
        },
        {
          id: '2',
          title: '名古屋から福岡への冷蔵貨物配送',
          description: '生鮮食品の冷蔵輸送をお願いします。温度管理が重要です。',
          shipper: {
            id: 'shipper-2',
            companyName: 'フレッシュフーズ株式会社',
            contactPerson: '田中花子',
            rating: 4.8,
            creditScore: 95
          },
          pickupLocation: {
            prefecture: '愛知県',
            address: '名古屋市中区栄2-3-4',
            dateTime: '2024-01-22 08:00'
          },
          deliveryLocation: {
            prefecture: '福岡県',
            address: '福岡市博多区博多駅前1-1-1',
            dateTime: '2024-01-23 12:00'
          },
          cargo: {
            type: '生鮮食品',
            weight: 2000,
            size: '200cm × 150cm × 100cm',
            specialRequirements: '冷蔵輸送必須、温度-2℃以下'
          },
          vehicleType: '冷蔵車',
          price: 120000,
          urgency: 'high',
          status: 'available',
          createdAt: '2024-01-16',
          aiMatchScore: 87,
          isBookmarked: false
        },
        {
          id: '3',
          title: '札幌から東京への急便配送',
          description: '緊急書類の配送をお願いします。時間厳守でお願いします。',
          shipper: {
            id: 'shipper-3',
            companyName: '北海道物流株式会社',
            contactPerson: '鈴木一郎',
            rating: 4.2,
            creditScore: 85
          },
          pickupLocation: {
            prefecture: '北海道',
            address: '札幌市中央区大通西1-1-1',
            dateTime: '2024-01-18 10:00'
          },
          deliveryLocation: {
            prefecture: '東京都',
            address: '千代田区丸の内1-1-1',
            dateTime: '2024-01-19 16:00'
          },
          cargo: {
            type: '書類',
            weight: 5,
            size: '30cm × 20cm × 5cm',
            specialRequirements: '時間厳守、受取人確認必須'
          },
          vehicleType: '軽トラック',
          price: 80000,
          urgency: 'urgent',
          status: 'available',
          createdAt: '2024-01-17',
          aiMatchScore: 92,
          isBookmarked: false
        }
      ]

      setShipments(sampleShipments)
      loadBookmarks()
    } catch (error) {
      console.error('Error loading shipments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadShipments()
  }

  const handleInputChange = (field: string, value: string) => {
    setSearchForm(prev => ({ ...prev, [field]: value }))
  }

  const handleBookmark = (shipmentId: string) => {
    const bookmarks = localStorage.getItem('shipment_bookmarks')
    let bookmarkedIds: string[] = bookmarks ? JSON.parse(bookmarks) : []
    
    if (bookmarkedIds.includes(shipmentId)) {
      bookmarkedIds = bookmarkedIds.filter(id => id !== shipmentId)
    } else {
      bookmarkedIds.push(shipmentId)
    }
    
    localStorage.setItem('shipment_bookmarks', JSON.stringify(bookmarkedIds))
    
    setShipments(prev => prev.map(shipment => 
      shipment.id === shipmentId 
        ? { ...shipment, isBookmarked: !shipment.isBookmarked }
        : shipment
    ))
  }

  const handleShare = async (shipment: Shipment) => {
    const url = `${window.location.origin}/shipments/${shipment.id}`
    try {
      await navigator.clipboard.writeText(url)
      setShareMessage('URLをコピーしました！')
      setTimeout(() => setShareMessage(''), 3000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleViewDetails = (shipmentId: string) => {
    router.push(`/shipments/${shipmentId}`)
  }

  const handleOfferClick = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setShowOfferModal(true)
  }

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('ログインが必要です')
        router.push('/login')
        return
      }

      // TODO: API実装
      console.log('Submitting offer:', {
        shipmentId: selectedShipment?.id,
        ...offerForm
      })

      alert('応募が完了しました！')
      setShowOfferModal(false)
      setOfferForm({
        proposedPrice: '',
        message: '',
        estimatedPickupTime: '',
        estimatedDeliveryTime: ''
      })
    } catch (error) {
      console.error('Error submitting offer:', error)
      alert('応募に失敗しました')
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'normal': return 'text-blue-600 bg-blue-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return '緊急'
      case 'high': return '高'
      case 'normal': return '通常'
      case 'low': return '低'
      default: return '不明'
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

  const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ]

  const cargoTypes = [
    '一般貨物', '冷蔵・冷凍', '危険物', '生鮮食品', '精密機器', '美術品', '医薬品', 'その他'
  ]

  const vehicleTypes = [
    '軽トラック', '小型トラック', '中型トラック', '大型トラック', 'トレーラー', '冷凍車', '冷蔵車', 'その他'
  ]

  const urgencyLevels = [
    { value: 'urgent', label: '緊急（24時間以内）' },
    { value: 'high', label: '高（3日以内）' },
    { value: 'normal', label: '通常（1週間以内）' },
    { value: 'low', label: '低（2週間以内）' }
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">荷物検索</h1>
          <p className="text-gray-600">条件に合う配送案件を検索できます</p>
        </div>

        {/* 共有メッセージ */}
        {shareMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center animate-fade-in">
            <CheckCircle2 className="h-5 w-5 text-green-600 mr-3" />
            <p className="text-sm text-green-700">{shareMessage}</p>
          </div>
        )}

        {/* 検索フォーム */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">集荷都道府県</label>
                <select
                  value={searchForm.pickupPrefecture}
                  onChange={(e) => handleInputChange('pickupPrefecture', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  {prefectures.map(pref => (
                    <option key={pref} value={pref}>{pref}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">配送先都道府県</label>
                <select
                  value={searchForm.deliveryPrefecture}
                  onChange={(e) => handleInputChange('deliveryPrefecture', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  {prefectures.map(pref => (
                    <option key={pref} value={pref}>{pref}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">荷物の種類</label>
                <select
                  value={searchForm.cargoType}
                  onChange={(e) => handleInputChange('cargoType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  {cargoTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">車両タイプ</label>
                <select
                  value={searchForm.vehicleType}
                  onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                <span>詳細フィルター</span>
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>検索</span>
              </button>
            </div>

            {showFilters && (
              <div className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">緊急度</label>
                    <select
                      value={searchForm.urgency}
                      onChange={(e) => handleInputChange('urgency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">すべて</option>
                      {urgencyLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">最低価格</label>
                    <input
                      type="number"
                      value={searchForm.minPrice}
                      onChange={(e) => handleInputChange('minPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">最高価格</label>
                    <input
                      type="number"
                      value={searchForm.maxPrice}
                      onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1000000"
                    />
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* 検索結果 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            検索結果 ({shipments.length}件)
          </h2>
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">新しい順</option>
              <option value="oldest">古い順</option>
              <option value="price_high">価格の高い順</option>
              <option value="price_low">価格の安い順</option>
              <option value="urgency">緊急度順</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">検索中...</p>
          </div>
        ) : shipments.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600">該当する荷物はありません</p>
          </div>
        ) : (
          <div className="space-y-6">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{shipment.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(shipment.urgency)}`}>
                          {getUrgencyText(shipment.urgency)}
                        </span>
                        {shipment.aiMatchScore && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            AIマッチング: {shipment.aiMatchScore}%
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{shipment.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleBookmark(shipment.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          shipment.isBookmarked ? 'text-red-600 bg-red-100' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                        }`}
                        title="ブックマーク"
                      >
                        <Heart className={`h-5 w-5 ${shipment.isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                      <button 
                        onClick={() => handleShare(shipment)}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                        title="共有"
                      >
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">集荷情報</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          {shipment.pickupLocation.prefecture} {shipment.pickupLocation.address}
                        </p>
                        <p className="text-sm text-gray-600">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {new Date(shipment.pickupLocation.dateTime).toLocaleString('ja-JP')}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">配送先情報</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          {shipment.deliveryLocation.prefecture} {shipment.deliveryLocation.address}
                        </p>
                        <p className="text-sm text-gray-600">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {new Date(shipment.deliveryLocation.dateTime).toLocaleString('ja-JP')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">荷物情報</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <Package className="h-4 w-4 inline mr-1" />
                          {shipment.cargo.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          <Weight className="h-4 w-4 inline mr-1" />
                          {shipment.cargo.weight}kg
                        </p>
                        <p className="text-sm text-gray-600">
                          サイズ: {shipment.cargo.size}
                        </p>
                        {shipment.cargo.specialRequirements && (
                          <p className="text-sm text-orange-600">
                            特記事項: {shipment.cargo.specialRequirements}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">運送情報</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <Truck className="h-4 w-4 inline mr-1" />
                          {shipment.vehicleType}
                        </p>
                        <p className="text-sm text-gray-600">
                          <Clock className="h-4 w-4 inline mr-1" />
                          投稿日: {new Date(shipment.createdAt).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">荷主情報</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <User className="h-4 w-4 inline mr-1" />
                          {shipment.shipper.companyName}
                        </p>
                        <p className="text-sm text-gray-600">
                          担当: {shipment.shipper.contactPerson}
                        </p>
                        <div className="flex items-center space-x-1">
                          {renderStars(shipment.shipper.rating)}
                          <span className="text-sm text-gray-600">({shipment.shipper.rating})</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          信用スコア: {shipment.shipper.creditScore}点
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">
                      ¥{shipment.price?.toLocaleString() || '未設定'}
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewDetails(shipment.id)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>詳細を見る</span>
                      </button>
                      <button 
                        onClick={() => handleOfferClick(shipment)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
                      >
                        <span>応募する</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 応募モーダル */}
      {showOfferModal && selectedShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">配送案件に応募</h2>
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">{selectedShipment.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{selectedShipment.description}</p>
                <div className="text-lg font-bold text-gray-900">
                  予算: ¥{selectedShipment.price?.toLocaleString() || '未設定'}
                </div>
              </div>

              <form onSubmit={handleSubmitOffer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    提案金額 (円) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={offerForm.proposedPrice}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, proposedPrice: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 100000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">メッセージ</label>
                  <textarea
                    value={offerForm.message}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="運送会社からのメッセージをご記入ください"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">集荷予定時間</label>
                    <input
                      type="datetime-local"
                      value={offerForm.estimatedPickupTime}
                      onChange={(e) => setOfferForm(prev => ({ ...prev, estimatedPickupTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">配送予定時間</label>
                    <input
                      type="datetime-local"
                      value={offerForm.estimatedDeliveryTime}
                      onChange={(e) => setOfferForm(prev => ({ ...prev, estimatedDeliveryTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowOfferModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    応募する
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

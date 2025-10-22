'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Package, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  MapPin, 
  Calendar, 
  Weight, 
  Truck, 
  DollarSign, 
  Eye, 
  Bookmark,
  Building2,
  User,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  Crown,
  Zap
} from 'lucide-react'

interface LimitedShipment {
  id: string
  cargoName: string
  cargoDescription: string
  status: 'OPEN' | 'MATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'
  pickupPrefecture: string
  pickupCity: string
  deliveryPrefecture: string
  deliveryCity: string
  pickupDate: string
  deliveryDate: string
  cargoWeight: number
  requiredVehicleType: string
  budget: number
  specialConditions: string[]
  priority: 'high' | 'medium' | 'low'
  isUrgent: boolean
  isPremium: boolean
  isBookmarked?: boolean
  shipper: {
    companyName: string
    contactPerson: string
    phone: string
    email: string
  }
  createdAt: string
  expiresAt: string
}

export default function LimitedShipmentsPage() {
  const router = useRouter()
  const [shipments, setShipments] = useState<LimitedShipment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'urgent' | 'premium' | 'special'>('all')

  useEffect(() => {
    loadLimitedShipments()
  }, [])

  const loadLimitedShipments = async () => {
    try {
      const bookmarks = localStorage.getItem('limited_shipment_bookmarks')
      const bookmarkedIds: string[] = bookmarks ? JSON.parse(bookmarks) : []
      
      // サンプルデータ
      const sampleShipments: LimitedShipment[] = [
        {
          id: '1',
          cargoName: '医療機器（緊急輸送）',
          cargoDescription: '手術用医療機器の緊急輸送。温度管理必須。',
          status: 'OPEN',
          pickupPrefecture: '東京都',
          pickupCity: '港区',
          deliveryPrefecture: '大阪府',
          deliveryCity: '大阪市',
          pickupDate: '2024-01-20',
          deliveryDate: '2024-01-20',
          cargoWeight: 50,
          requiredVehicleType: '冷蔵車',
          budget: 150000,
          specialConditions: ['緊急輸送', '温度管理', '医療機器', '24時間対応'],
          priority: 'high',
          isUrgent: true,
          isPremium: true,
          shipper: {
            companyName: 'メディカルサプライ株式会社',
            contactPerson: '山田太郎',
            phone: '03-1234-5678',
            email: 'yamada@medical-supply.co.jp'
          },
          createdAt: '2024-01-19T10:00:00',
          expiresAt: '2024-01-20T18:00:00'
        },
        {
          id: '2',
          cargoName: '美術品（特別輸送）',
          cargoDescription: '高価な美術品の特別輸送。専用車両・警備員付き。',
          status: 'OPEN',
          pickupPrefecture: '京都府',
          pickupCity: '京都市',
          deliveryPrefecture: '東京都',
          deliveryCity: '渋谷区',
          pickupDate: '2024-01-25',
          deliveryDate: '2024-01-25',
          cargoWeight: 200,
          requiredVehicleType: '特別車両',
          budget: 500000,
          specialConditions: ['美術品輸送', '警備員付き', '専用車両', '保険必須'],
          priority: 'high',
          isUrgent: false,
          isPremium: true,
          shipper: {
            companyName: 'アートギャラリー京都',
            contactPerson: '佐藤花子',
            phone: '075-1234-5678',
            email: 'sato@art-gallery-kyoto.co.jp'
          },
          createdAt: '2024-01-18T14:00:00',
          expiresAt: '2024-01-24T17:00:00'
        },
        {
          id: '3',
          cargoName: '危険物（化学薬品）',
          cargoDescription: '化学薬品の輸送。危険物輸送資格必須。',
          status: 'OPEN',
          pickupPrefecture: '愛知県',
          pickupCity: '名古屋市',
          deliveryPrefecture: '神奈川県',
          deliveryCity: '横浜市',
          pickupDate: '2024-01-22',
          deliveryDate: '2024-01-23',
          cargoWeight: 1000,
          requiredVehicleType: '危険物輸送車',
          budget: 200000,
          specialConditions: ['危険物輸送', '資格必須', '専用車両', '安全対策'],
          priority: 'medium',
          isUrgent: false,
          isPremium: false,
          shipper: {
            companyName: 'ケミカル工業株式会社',
            contactPerson: '田中次郎',
            phone: '052-1234-5678',
            email: 'tanaka@chemical-industry.co.jp'
          },
          createdAt: '2024-01-17T09:00:00',
          expiresAt: '2024-01-21T17:00:00'
        },
        {
          id: '4',
          cargoName: '生鮮食品（深夜配送）',
          cargoDescription: '生鮮食品の深夜配送。早朝到着必須。',
          status: 'OPEN',
          pickupPrefecture: '青森県',
          pickupCity: '青森市',
          deliveryPrefecture: '東京都',
          deliveryCity: '中央区',
          pickupDate: '2024-01-21',
          deliveryDate: '2024-01-22',
          cargoWeight: 300,
          requiredVehicleType: '冷蔵車',
          budget: 80000,
          specialConditions: ['深夜配送', '早朝到着', '冷蔵輸送', '鮮度保持'],
          priority: 'medium',
          isUrgent: true,
          isPremium: false,
          shipper: {
            companyName: '青森フルーツ農協',
            contactPerson: '鈴木一郎',
            phone: '017-1234-5678',
            email: 'suzuki@aomori-fruits.co.jp'
          },
          createdAt: '2024-01-16T16:00:00',
          expiresAt: '2024-01-20T20:00:00'
        }
      ]
      
      // ブックマーク状態を適用
      const shipmentsWithBookmarks = sampleShipments.map(shipment => ({
        ...shipment,
        isBookmarked: bookmarkedIds.includes(shipment.id)
      }))
      
      setShipments(shipmentsWithBookmarks)
    } catch (error) {
      console.error('Error loading limited shipments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'high':
        return { label: '高優先度', color: 'bg-red-100 text-red-800', icon: AlertCircle }
      case 'medium':
        return { label: '中優先度', color: 'bg-yellow-100 text-yellow-800', icon: Clock }
      case 'low':
        return { label: '低優先度', color: 'bg-green-100 text-green-800', icon: CheckCircle }
      default:
        return { label: '不明', color: 'bg-gray-100 text-gray-800', icon: Clock }
    }
  }

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = searchTerm === '' || 
      shipment.cargoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.cargoDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.specialConditions.some(condition => 
        condition.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    const matchesPriority = priorityFilter === 'all' || shipment.priority === priorityFilter
    
    const matchesType = typeFilter === 'all' || 
      (typeFilter === 'urgent' && shipment.isUrgent) ||
      (typeFilter === 'premium' && shipment.isPremium) ||
      (typeFilter === 'special' && !shipment.isUrgent && !shipment.isPremium)
    
    return matchesSearch && matchesPriority && matchesType
  })

  const handleBookmark = (shipmentId: string) => {
    const bookmarks = localStorage.getItem('limited_shipment_bookmarks')
    let bookmarkedIds: string[] = bookmarks ? JSON.parse(bookmarks) : []
    
    if (bookmarkedIds.includes(shipmentId)) {
      bookmarkedIds = bookmarkedIds.filter(id => id !== shipmentId)
    } else {
      bookmarkedIds.push(shipmentId)
    }
    
    localStorage.setItem('limited_shipment_bookmarks', JSON.stringify(bookmarkedIds))
    
    // UI更新のためにshipmentsを再レンダリング
    loadLimitedShipments()
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">限定荷物</h1>
        <p className="text-gray-600">特別な条件や緊急度の高い荷物をご確認いただけます</p>
      </div>

      {/* 検索フィルター */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="荷物名、条件で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">すべての優先度</option>
                  <option value="high">高優先度</option>
                  <option value="medium">中優先度</option>
                  <option value="low">低優先度</option>
                </select>
              </div>
            </div>
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">すべてのタイプ</option>
                <option value="urgent">緊急</option>
                <option value="premium">プレミアム</option>
                <option value="special">特別条件</option>
              </select>
            </div>
            <div>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setPriorityFilter('all')
                  setTypeFilter('all')
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                フィルターをクリア
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 限定荷物一覧 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            限定荷物一覧 ({filteredShipments.length}件)
          </h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-gray-500">読み込み中...</div>
        ) : filteredShipments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>条件に一致する限定荷物はありません</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredShipments.map((shipment) => {
              const priorityInfo = getPriorityInfo(shipment.priority)
              const PriorityIcon = priorityInfo.icon
              
              return (
                <div key={shipment.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {shipment.cargoName}
                        </h3>
                        {shipment.isUrgent && (
                          <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            <Zap className="h-3 w-3 mr-1" />
                            緊急
                          </span>
                        )}
                        {shipment.isPremium && (
                          <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            <Crown className="h-3 w-3 mr-1" />
                            プレミアム
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${priorityInfo.color}`}>
                          <PriorityIcon className="h-3 w-3" />
                          <span>{priorityInfo.label}</span>
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{shipment.cargoDescription}</p>
                      
                      {/* 特別条件 */}
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-800 mb-2">特別条件</h4>
                        <div className="flex flex-wrap gap-2">
                          {shipment.specialConditions.map((condition, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 基本情報 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{shipment.pickupPrefecture} → {shipment.deliveryPrefecture}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{new Date(shipment.pickupDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Weight className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{shipment.cargoWeight}kg</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                          <span>¥{shipment.budget.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* 荷主情報 */}
                      <div className="border-t border-gray-100 pt-3 mb-3">
                        <h4 className="font-semibold text-gray-800 mb-2">荷主情報</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{shipment.shipper.companyName}</span>
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{shipment.shipper.contactPerson}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{shipment.shipper.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{shipment.shipper.email}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>登録日: {new Date(shipment.createdAt).toLocaleString('ja-JP')}</span>
                        <span className="text-red-500">
                          期限: {new Date(shipment.expiresAt).toLocaleString('ja-JP')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => router.push(`/shipments/${shipment.id}`)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="詳細を見る"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleBookmark(shipment.id)}
                        className={`p-2 transition-colors ${
                          shipment.isBookmarked 
                            ? 'text-yellow-600 bg-yellow-100' 
                            : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                        }`}
                        title={shipment.isBookmarked ? 'ブックマーク解除' : 'ブックマーク'}
                      >
                        <Bookmark className={`h-4 w-4 ${shipment.isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
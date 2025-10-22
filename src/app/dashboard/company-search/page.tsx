'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Building2, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Star,
  Filter,
  Plus,
  Eye,
  MessageCircle,
  Truck,
  Package,
  Calendar,
  CheckCircle
} from 'lucide-react'

interface Company {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  address: string
  postalCode: string
  userType: 'SHIPPER' | 'CARRIER'
  rating: number
  totalShipments: number
  completedShipments: number
  joinedDate: string
  description?: string
  specialties?: string[]
}

export default function CompanySearchPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'SHIPPER' | 'CARRIER'>('all')
  const [ratingFilter, setRatingFilter] = useState<'all' | '4+' | '3+' | '2+'>('all')

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      // サンプルデータ
      const sampleCompanies: Company[] = [
        {
          id: '1',
          companyName: '株式会社トランスロジック',
          contactPerson: '田中太郎',
          email: 'tanaka@translogic.co.jp',
          phone: '03-1234-5678',
          address: '東京都港区六本木1-1-1',
          postalCode: '106-0032',
          userType: 'CARRIER',
          rating: 4.8,
          totalShipments: 156,
          completedShipments: 148,
          joinedDate: '2023-01-15',
          description: '関東圏を中心とした物流サービスを提供。冷凍・冷蔵輸送に強みがあります。',
          specialties: ['冷凍輸送', '関東圏', '急便対応']
        },
        {
          id: '2',
          companyName: '山田運送株式会社',
          contactPerson: '山田花子',
          email: 'yamada@yamada-transport.co.jp',
          phone: '06-9876-5432',
          address: '大阪府大阪市北区梅田2-2-2',
          postalCode: '530-0001',
          userType: 'CARRIER',
          rating: 4.5,
          totalShipments: 89,
          completedShipments: 85,
          joinedDate: '2023-03-20',
          description: '関西圏の一般貨物輸送を専門としています。',
          specialties: ['一般貨物', '関西圏', '大型トラック']
        },
        {
          id: '3',
          companyName: '株式会社グリーンロジスティクス',
          contactPerson: '佐藤次郎',
          email: 'sato@greenlogistics.co.jp',
          phone: '052-1111-2222',
          address: '愛知県名古屋市中区栄3-3-3',
          postalCode: '460-0008',
          userType: 'SHIPPER',
          rating: 4.2,
          totalShipments: 234,
          completedShipments: 220,
          joinedDate: '2022-11-10',
          description: '環境に配慮した物流ソリューションを提供。',
          specialties: ['エコ物流', '中部圏', 'BtoB']
        },
        {
          id: '4',
          companyName: 'スピード物流株式会社',
          contactPerson: '鈴木一郎',
          email: 'suzuki@speedlogistics.co.jp',
          phone: '092-3333-4444',
          address: '福岡県福岡市博多区博多駅前4-4-4',
          postalCode: '812-0011',
          userType: 'CARRIER',
          rating: 4.7,
          totalShipments: 312,
          completedShipments: 298,
          joinedDate: '2022-08-05',
          description: '九州全域の高速輸送サービス。24時間対応可能。',
          specialties: ['高速輸送', '九州圏', '24時間対応']
        }
      ]
      
      setCompanies(sampleCompanies)
    } catch (error) {
      console.error('Error loading companies:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = searchTerm === '' || 
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesUserType = userTypeFilter === 'all' || company.userType === userTypeFilter
    
    const matchesRating = ratingFilter === 'all' || 
      (ratingFilter === '4+' && company.rating >= 4) ||
      (ratingFilter === '3+' && company.rating >= 3) ||
      (ratingFilter === '2+' && company.rating >= 2)
    
    return matchesSearch && matchesUserType && matchesRating
  })

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

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">企業検索</h1>
        <p className="text-gray-600">取引先企業を検索して連絡先を確認できます</p>
      </div>

      {/* 検索フィルター */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="会社名、担当者名で検索..."
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
                  value={userTypeFilter}
                  onChange={(e) => setUserTypeFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">すべての企業</option>
                  <option value="SHIPPER">荷主企業</option>
                  <option value="CARRIER">運送業者</option>
                </select>
              </div>
            </div>
            <div>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">すべての評価</option>
                <option value="4+">4.0以上</option>
                <option value="3+">3.0以上</option>
                <option value="2+">2.0以上</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 企業一覧 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            企業一覧 ({filteredCompanies.length}件)
          </h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-gray-500">読み込み中...</div>
        ) : filteredCompanies.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>条件に一致する企業が見つかりません</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredCompanies.map((company) => (
              <div key={company.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {company.companyName}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        company.userType === 'SHIPPER' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {company.userType === 'SHIPPER' ? '荷主企業' : '運送業者'}
                      </span>
                    </div>
                    
                    {company.description && (
                      <p className="text-sm text-gray-600 mb-3">{company.description}</p>
                    )}

                    {/* 評価と実績 */}
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        {renderStars(company.rating)}
                        <span className="text-sm text-gray-600 ml-1">({company.rating})</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Package className="h-4 w-4 mr-1" />
                          総荷物数: {company.totalShipments}
                        </span>
                        <span className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          完了: {company.completedShipments}
                        </span>
                      </div>
                    </div>

                    {/* 連絡先情報 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700 mb-3">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{company.contactPerson}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{company.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{company.email}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{company.postalCode} {company.address}</span>
                      </div>
                    </div>

                    {/* 専門分野 */}
                    {company.specialties && company.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {company.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 text-xs text-gray-400">
                      登録日: {new Date(company.joinedDate).toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      className="p-2 text-gray-400 hover:text-blue-600"
                      title="詳細を見る"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-green-600"
                      title="メッセージを送る"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-purple-600"
                      title="取引先に追加"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
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
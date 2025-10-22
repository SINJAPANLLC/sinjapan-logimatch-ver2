'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Star,
  Calendar,
  Package,
  CheckCircle,
  Trash2,
  Edit,
  User,
  Building2,
  MoreVertical,
  Save,
  X
} from 'lucide-react'

interface Partner {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  address: string
  postalCode: string
  userType: 'SHIPPER' | 'CARRIER'
  rating: number
  totalTransactions: number
  lastTransactionDate: string
  addedDate: string
  status: 'active' | 'inactive' | 'pending'
  notes?: string
  specialties?: string[]
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all')
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'SHIPPER' | 'CARRIER'>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    postalCode: '',
    userType: 'SHIPPER' as 'SHIPPER' | 'CARRIER',
    status: 'active' as 'active' | 'inactive' | 'pending',
    specialties: [] as string[],
    notes: ''
  })

  useEffect(() => {
    loadPartners()
  }, [])

  const loadPartners = async () => {
    try {
      // サンプルデータ
      const samplePartners: Partner[] = [
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
          totalTransactions: 15,
          lastTransactionDate: '2024-01-10',
          addedDate: '2023-06-15',
          status: 'active',
          notes: '信頼できるパートナー。冷凍輸送に強み。',
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
          totalTransactions: 8,
          lastTransactionDate: '2024-01-05',
          addedDate: '2023-08-20',
          status: 'active',
          notes: '関西圏の輸送でよく利用。',
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
          totalTransactions: 23,
          lastTransactionDate: '2023-12-28',
          addedDate: '2023-04-10',
          status: 'active',
          notes: '環境に配慮した物流を重視。',
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
          totalTransactions: 12,
          lastTransactionDate: '2023-11-15',
          addedDate: '2023-09-05',
          status: 'inactive',
          notes: '九州圏の高速輸送。最近取引なし。',
          specialties: ['高速輸送', '九州圏', '24時間対応']
        }
      ]
      
      setPartners(samplePartners)
    } catch (error) {
      console.error('Error loading partners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPartner = () => {
    setFormData({
      companyName: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      postalCode: '',
      userType: 'SHIPPER',
      status: 'active',
      specialties: [],
      notes: ''
    })
    setShowAddModal(true)
  }

  const handleEditPartner = (partner: Partner) => {
    setFormData({
      companyName: partner.companyName,
      contactPerson: partner.contactPerson,
      phone: partner.phone,
      email: partner.email,
      address: partner.address,
      postalCode: partner.postalCode,
      userType: partner.userType,
      status: partner.status,
      specialties: partner.specialties || [],
      notes: partner.notes || ''
    })
    setEditingPartner(partner)
    setShowAddModal(true)
  }

  const handleSavePartner = () => {
    if (editingPartner) {
      // 編集
      setPartners(prev => prev.map(partner => 
        partner.id === editingPartner.id 
          ? { ...partner, ...formData, rating: partner.rating, totalTransactions: partner.totalTransactions, lastTransactionDate: partner.lastTransactionDate, addedDate: partner.addedDate }
          : partner
      ))
    } else {
      // 新規追加
      const newPartner: Partner = {
        id: Date.now().toString(),
        ...formData,
        rating: 0,
        totalTransactions: 0,
        lastTransactionDate: '',
        addedDate: new Date().toISOString().split('T')[0]
      }
      setPartners(prev => [...prev, newPartner])
    }
    setShowAddModal(false)
    setEditingPartner(null)
  }

  const handleDeletePartner = (partnerId: string) => {
    if (!confirm('この取引先を削除しますか？')) return
    setPartners(prev => prev.filter(p => p.id !== partnerId))
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }))
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'アクティブ', color: 'bg-green-100 text-green-800' }
      case 'inactive':
        return { label: '非アクティブ', color: 'bg-gray-100 text-gray-800' }
      case 'pending':
        return { label: '承認待ち', color: 'bg-yellow-100 text-yellow-800' }
      default:
        return { label: '不明', color: 'bg-gray-100 text-gray-800' }
    }
  }

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = searchTerm === '' || 
      partner.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || partner.status === statusFilter
    const matchesUserType = userTypeFilter === 'all' || partner.userType === userTypeFilter
    
    return matchesSearch && matchesStatus && matchesUserType
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">取引先管理</h1>
            <p className="text-gray-600">取引先企業の管理と連絡先情報を確認できます</p>
          </div>
            <button
              onClick={handleAddPartner}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>取引先を追加</span>
            </button>
        </div>
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">すべてのステータス</option>
                  <option value="active">アクティブ</option>
                  <option value="inactive">非アクティブ</option>
                  <option value="pending">承認待ち</option>
                </select>
              </div>
            </div>
            <div>
              <select
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">すべての企業タイプ</option>
                <option value="SHIPPER">荷主企業</option>
                <option value="CARRIER">運送業者</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 取引先一覧 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            取引先一覧 ({filteredPartners.length}件)
          </h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-gray-500">読み込み中...</div>
        ) : filteredPartners.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>取引先はありません</p>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              最初の取引先を追加する
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPartners.map((partner) => {
              const statusInfo = getStatusInfo(partner.status)
              
              return (
                <div key={partner.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {partner.companyName}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          partner.userType === 'SHIPPER' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {partner.userType === 'SHIPPER' ? '荷主企業' : '運送業者'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      
                      {/* 評価と取引実績 */}
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-1">
                          {renderStars(partner.rating)}
                          <span className="text-sm text-gray-600 ml-1">({partner.rating})</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Package className="h-4 w-4 mr-1" />
                            取引回数: {partner.totalTransactions}回
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            最終取引: {new Date(partner.lastTransactionDate).toLocaleDateString('ja-JP')}
                          </span>
                        </div>
                      </div>

                      {/* 連絡先情報 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700 mb-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{partner.contactPerson}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{partner.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{partner.email}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{partner.postalCode} {partner.address}</span>
                        </div>
                      </div>

                      {/* メモ */}
                      {partner.notes && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            <strong>メモ:</strong> {partner.notes}
                          </p>
                        </div>
                      )}

                      {/* 専門分野 */}
                      {partner.specialties && partner.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {partner.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="text-xs text-gray-400">
                        追加日: {new Date(partner.addedDate).toLocaleDateString('ja-JP')}
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
                        onClick={() => handleEditPartner(partner)}
                        className="p-2 text-gray-400 hover:text-purple-600"
                        title="編集"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePartner(partner.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                        title="削除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 追加・編集モーダル */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingPartner ? '取引先を編集' : '取引先を追加'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingPartner(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">会社名 *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="株式会社サンプル"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">担当者名 *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="山田太郎"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">電話番号 *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="03-1234-5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="yamada@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">郵便番号</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="106-0032"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">住所 *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="東京都渋谷区恵比寿1-2-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">タイプ *</label>
                  <select
                    value={formData.userType}
                    onChange={(e) => handleInputChange('userType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="SHIPPER">荷主</option>
                    <option value="CARRIER">運送会社</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ステータス *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">アクティブ</option>
                    <option value="inactive">非アクティブ</option>
                    <option value="pending">承認待ち</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">専門分野</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['大型貨物', '小型貨物', '冷蔵輸送', '冷凍輸送', '危険物', '生鮮食品', '精密機器', '美術品', '関東圏', '関西圏', '中部圏', '九州圏', '北海道', '急便対応', '24時間対応', '長距離対応'].map(specialty => (
                    <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.specialties.includes(specialty)}
                        onChange={() => handleSpecialtyToggle(specialty)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{specialty}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">メモ</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="取引先に関するメモや特記事項"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingPartner(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleSavePartner}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{editingPartner ? '更新' : '追加'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload,
  Calendar,
  MapPin,
  Truck,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  Building2,
  User,
  Phone,
  Mail
} from 'lucide-react'

interface TransportLog {
  id: string
  shipmentId: string
  cargoName: string
  carrierCompany: string
  carrierContact: string
  carrierPhone: string
  carrierEmail: string
  driverName: string
  driverLicense: string
  vehicleNumber: string
  vehicleType: string
  pickupDate: string
  deliveryDate: string
  pickupLocation: string
  deliveryLocation: string
  status: 'scheduled' | 'in_transit' | 'delivered' | 'cancelled'
  actualPickupTime?: string
  actualDeliveryTime?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function TransportLogPage() {
  const [logs, setLogs] = useState<TransportLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'in_transit' | 'delivered' | 'cancelled'>('all')
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {
    loadTransportLogs()
  }, [])

  const loadTransportLogs = async () => {
    try {
      // サンプルデータ
      const sampleLogs: TransportLog[] = [
        {
          id: '1',
          shipmentId: 'SH-001',
          cargoName: '電子部品（冷蔵）',
          carrierCompany: '株式会社トランスロジック',
          carrierContact: '田中太郎',
          carrierPhone: '03-1234-5678',
          carrierEmail: 'tanaka@translogic.co.jp',
          driverName: '佐藤一郎',
          driverLicense: '1234567890',
          vehicleNumber: '品川 500 あ 1234',
          vehicleType: '冷蔵車',
          pickupDate: '2024-01-15',
          deliveryDate: '2024-01-16',
          pickupLocation: '東京都港区六本木1-1-1',
          deliveryLocation: '大阪府大阪市北区梅田2-2-2',
          status: 'delivered',
          actualPickupTime: '2024-01-15T09:00:00',
          actualDeliveryTime: '2024-01-16T14:30:00',
          notes: '予定通り配送完了。荷物に問題なし。',
          createdAt: '2024-01-10T10:00:00',
          updatedAt: '2024-01-16T14:30:00'
        },
        {
          id: '2',
          shipmentId: 'SH-002',
          cargoName: '機械部品',
          carrierCompany: '山田運送株式会社',
          carrierContact: '山田花子',
          carrierPhone: '06-9876-5432',
          carrierEmail: 'yamada@yamada-transport.co.jp',
          driverName: '鈴木二郎',
          driverLicense: '0987654321',
          vehicleNumber: '大阪 500 い 5678',
          vehicleType: '大型トラック',
          pickupDate: '2024-01-20',
          deliveryDate: '2024-01-21',
          pickupLocation: '愛知県名古屋市中区栄3-3-3',
          deliveryLocation: '福岡県福岡市博多区博多駅前4-4-4',
          status: 'in_transit',
          actualPickupTime: '2024-01-20T08:30:00',
          notes: '現在輸送中。予定通り進行。',
          createdAt: '2024-01-18T14:00:00',
          updatedAt: '2024-01-20T08:30:00'
        },
        {
          id: '3',
          shipmentId: 'SH-003',
          cargoName: '衣料品',
          carrierCompany: 'スピード物流株式会社',
          carrierContact: '鈴木一郎',
          carrierPhone: '092-3333-4444',
          carrierEmail: 'suzuki@speedlogistics.co.jp',
          driverName: '高橋三郎',
          driverLicense: '1122334455',
          vehicleNumber: '福岡 500 う 9012',
          vehicleType: '中型トラック',
          pickupDate: '2024-01-25',
          deliveryDate: '2024-01-26',
          pickupLocation: '東京都渋谷区渋谷1-1-1',
          deliveryLocation: '神奈川県横浜市西区みなとみらい2-2-2',
          status: 'scheduled',
          notes: '配送準備中。',
          createdAt: '2024-01-22T16:00:00',
          updatedAt: '2024-01-22T16:00:00'
        }
      ]
      
      setLogs(sampleLogs)
    } catch (error) {
      console.error('Error loading transport logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { label: '予定', color: 'bg-blue-100 text-blue-800', icon: Clock }
      case 'in_transit':
        return { label: '輸送中', color: 'bg-yellow-100 text-yellow-800', icon: Truck }
      case 'delivered':
        return { label: '配送完了', color: 'bg-green-100 text-green-800', icon: CheckCircle }
      case 'cancelled':
        return { label: 'キャンセル', color: 'bg-red-100 text-red-800', icon: AlertCircle }
      default:
        return { label: '不明', color: 'bg-gray-100 text-gray-800', icon: Clock }
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.cargoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.carrierCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter
    
    const matchesDate = dateFilter === '' || 
      log.pickupDate === dateFilter || 
      log.deliveryDate === dateFilter
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const handleDeleteLog = (logId: string) => {
    if (!confirm('この記録を削除しますか？')) return
    setLogs(prev => prev.filter(l => l.id !== logId))
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">実運送体制管理簿</h1>
            <p className="text-gray-600">運送業者の実運送体制を管理・記録できます</p>
          </div>
          <div className="flex space-x-2">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>インポート</span>
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>エクスポート</span>
            </button>
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>新規登録</span>
            </button>
          </div>
        </div>
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
                  placeholder="荷物名、運送業者、ドライバー名で検索..."
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
                  <option value="scheduled">予定</option>
                  <option value="in_transit">輸送中</option>
                  <option value="delivered">配送完了</option>
                  <option value="cancelled">キャンセル</option>
                </select>
              </div>
            </div>
            <div>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="日付でフィルター"
              />
            </div>
            <div>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setDateFilter('')
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                フィルターをクリア
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 運送記録一覧 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            運送記録一覧 ({filteredLogs.length}件)
          </h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-gray-500">読み込み中...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>運送記録はありません</p>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              最初の記録を登録する
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredLogs.map((log) => {
              const statusInfo = getStatusInfo(log.status)
              const StatusIcon = statusInfo.icon
              
              return (
                <div key={log.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {log.cargoName}
                        </h3>
                        <span className="text-sm text-gray-500">
                          荷物ID: {log.shipmentId}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span>{statusInfo.label}</span>
                        </span>
                      </div>
                      
                      {/* 運送業者情報 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <Building2 className="h-4 w-4 mr-2" />
                            運送業者情報
                          </h4>
                          <div className="space-y-1 text-sm text-gray-700">
                            <div className="flex items-center">
                              <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{log.carrierCompany}</span>
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{log.carrierContact}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{log.carrierPhone}</span>
                            </div>
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{log.carrierEmail}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <Truck className="h-4 w-4 mr-2" />
                            車両・ドライバー情報
                          </h4>
                          <div className="space-y-1 text-sm text-gray-700">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-gray-500" />
                              <span>ドライバー: {log.driverName}</span>
                            </div>
                            <div className="flex items-center">
                              <Truck className="h-4 w-4 mr-2 text-gray-500" />
                              <span>車両番号: {log.vehicleNumber}</span>
                            </div>
                            <div className="flex items-center">
                              <Package className="h-4 w-4 mr-2 text-gray-500" />
                              <span>車種: {log.vehicleType}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              免許番号: {log.driverLicense}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 配送情報 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            集荷情報
                          </h4>
                          <div className="space-y-1 text-sm text-gray-700">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                              <span>予定日: {new Date(log.pickupDate).toLocaleDateString('ja-JP')}</span>
                            </div>
                            {log.actualPickupTime && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                <span>実際: {new Date(log.actualPickupTime).toLocaleString('ja-JP')}</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{log.pickupLocation}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            配送情報
                          </h4>
                          <div className="space-y-1 text-sm text-gray-700">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                              <span>予定日: {new Date(log.deliveryDate).toLocaleDateString('ja-JP')}</span>
                            </div>
                            {log.actualDeliveryTime && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                <span>実際: {new Date(log.actualDeliveryTime).toLocaleString('ja-JP')}</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{log.deliveryLocation}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* メモ */}
                      {log.notes && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                            <strong>メモ:</strong> {log.notes}
                          </p>
                        </div>
                      )}

                      <div className="text-xs text-gray-400">
                        登録日: {new Date(log.createdAt).toLocaleString('ja-JP')} | 
                        更新日: {new Date(log.updatedAt).toLocaleString('ja-JP')}
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
                        title="編集"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLog(log.id)}
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
    </DashboardLayout>
  )
}
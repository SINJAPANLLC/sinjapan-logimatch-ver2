'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Package, 
  MapPin, 
  Calendar, 
  Weight, 
  Truck, 
  DollarSign, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Filter,
  Search,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

interface Shipment {
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
  createdAt: string
  updatedAt: string
}

export default function MyShipmentsPage() {
  const router = useRouter()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'OPEN' | 'MATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadMyShipments()
  }, [])

  const loadMyShipments = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/my-posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to load shipments')
      
      const data = await response.json()
      // 荷物のみをフィルタリング（type: 'shipment'）
      const shipmentPosts = data.data?.filter((post: any) => post.type === 'shipment') || []
      setShipments(shipmentPosts)
    } catch (error) {
      console.error('Error loading shipments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (shipmentId: string) => {
    if (!confirm('この荷物を削除しますか？')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/user/my-posts/${shipmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to delete shipment')
      
      setShipments(prev => prev.filter(s => s.id !== shipmentId))
    } catch (error) {
      console.error('Error deleting shipment:', error)
      alert('削除に失敗しました')
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'OPEN':
        return { label: '募集中', color: 'bg-blue-100 text-blue-800', icon: Clock }
      case 'MATCHED':
        return { label: '成約済み', color: 'bg-green-100 text-green-800', icon: CheckCircle }
      case 'IN_TRANSIT':
        return { label: '輸送中', color: 'bg-yellow-100 text-yellow-800', icon: Truck }
      case 'DELIVERED':
        return { label: '完了', color: 'bg-gray-100 text-gray-800', icon: CheckCircle }
      case 'CANCELLED':
        return { label: 'キャンセル', color: 'bg-red-100 text-red-800', icon: AlertCircle }
      default:
        return { label: '不明', color: 'bg-gray-100 text-gray-800', icon: Clock }
    }
  }

  const filteredShipments = shipments.filter(shipment => {
    const matchesFilter = filter === 'all' || shipment.status === filter
    const matchesSearch = searchTerm === '' || 
      shipment.cargoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.cargoDescription.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">登録した荷物</h1>
            <p className="text-gray-600">あなたが登録した荷物の一覧です</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/shipments/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>新規登録</span>
          </button>
        </div>
      </div>

      {/* フィルターと検索 */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="荷物名や説明で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">すべて</option>
                <option value="OPEN">募集中</option>
                <option value="MATCHED">成約済み</option>
                <option value="IN_TRANSIT">輸送中</option>
                <option value="DELIVERED">完了</option>
                <option value="CANCELLED">キャンセル</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 荷物一覧 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            登録した荷物一覧 ({filteredShipments.length}件)
          </h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-gray-500">読み込み中...</div>
        ) : filteredShipments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>登録した荷物はありません</p>
            <button
              onClick={() => router.push('/dashboard/shipments/new')}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              最初の荷物を登録する
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredShipments.map((shipment) => {
              const statusInfo = getStatusInfo(shipment.status)
              const StatusIcon = statusInfo.icon
              
              return (
                <div key={shipment.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {shipment.cargoName}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span>{statusInfo.label}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        {shipment.cargoDescription}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
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
                          <span>¥{shipment.budget?.toLocaleString() || '未設定'}</span>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-400">
                        登録日: {new Date(shipment.createdAt).toLocaleString('ja-JP')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => router.push(`/shipments/${shipment.id}`)}
                        className="p-2 text-gray-400 hover:text-blue-600"
                        title="詳細を見る"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/dashboard/shipments/edit/${shipment.id}`)}
                        className="p-2 text-gray-400 hover:text-green-600"
                        title="編集"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(shipment.id)}
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
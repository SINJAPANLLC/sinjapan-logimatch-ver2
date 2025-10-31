'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Weight, 
  Truck, 
  DollarSign, 
  Eye, 
  Phone,
  Mail,
  Building2,
  User,
  Clock,
  AlertCircle,
  Filter,
  Search
} from 'lucide-react'

interface ContractedShipment {
  id: string
  cargoName: string
  cargoDescription: string
  status: 'MATCHED' | 'IN_TRANSIT' | 'DELIVERED'
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
  carrier?: {
    companyName: string
    contactPerson: string
    phone: string
    email: string
  }
  shipper?: {
    companyName: string
    contactPerson: string
    phone: string
    email: string
  }
}

export default function ContractedShipmentsPage() {
  const router = useRouter()
  const [shipments, setShipments] = useState<ContractedShipment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'MATCHED' | 'IN_TRANSIT' | 'DELIVERED'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadContractedShipments()
  }, [])

  const loadContractedShipments = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/my-posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to load shipments')
      
      const data = await response.json()
      // 成約済みの荷物のみをフィルタリング
      const contractedShipments = data.data?.filter((post: any) => 
        post.type === 'shipment' && 
        ['MATCHED', 'IN_TRANSIT', 'DELIVERED'].includes(post.status)
      ) || []
      setShipments(contractedShipments)
    } catch (error) {
      console.error('Error loading contracted shipments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'MATCHED':
        return { label: '成約済み', color: 'bg-green-100 text-green-800', icon: CheckCircle }
      case 'IN_TRANSIT':
        return { label: '輸送中', color: 'bg-yellow-100 text-yellow-800', icon: Truck }
      case 'DELIVERED':
        return { label: '完了', color: 'bg-gray-100 text-gray-800', icon: CheckCircle }
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
        <h1 className="text-2xl font-bold text-gray-900">成約した荷物</h1>
        <p className="text-gray-600">成約が完了した荷物の一覧です</p>
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
                <option value="MATCHED">成約済み</option>
                <option value="IN_TRANSIT">輸送中</option>
                <option value="DELIVERED">完了</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 荷物一覧 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            成約した荷物一覧 ({filteredShipments.length}件)
          </h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-gray-500">読み込み中...</div>
        ) : filteredShipments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>成約した荷物はありません</p>
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
                      <p className="text-sm text-gray-500 mb-4">
                        {shipment.cargoDescription}
                      </p>
                      
                      {/* 荷物詳細情報 */}
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

                      {/* 取引先情報 */}
                      {shipment.carrier && (
                        <div className="border-t border-gray-100 pt-4">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <Truck className="h-4 w-4 mr-2" />
                            運送業者情報
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                            <div className="flex items-center">
                              <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{shipment.carrier.companyName}</span>
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{shipment.carrier.contactPerson}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{shipment.carrier.phone}</span>
                            </div>
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{shipment.carrier.email}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-3 text-xs text-gray-400">
                        成約日: {new Date(shipment.updatedAt).toLocaleString('ja-JP')}
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
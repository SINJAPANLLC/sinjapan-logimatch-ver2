'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Package, 
  Search, 
  Truck, 
  Building2, 
  Users, 
  Settings, 
  Bell, 
  User,
  ChevronDown,
  ChevronRight,
  Filter,
  X,
  Plus,
  Eye,
  Calendar,
  MapPin,
  Weight,
  Car,
  User as UserIcon,
  Globe,
  FileText,
  HelpCircle,
  CheckCircle,
  Bookmark,
  History
} from 'lucide-react'

export default function DashboardPage() {
  const [shipments, setShipments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('募集中')

  useEffect(() => {
    loadShipments()
  }, [])

  const loadShipments = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/shipments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to load shipments')
      
      const data = await response.json()
      setShipments(data.data || [])
    } catch (error) {
      console.error('Error loading shipments:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      {/* タブ */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['募集中', '成約済み', '輸送中', '完了'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">総荷物数</p>
              <p className="text-2xl font-bold text-gray-900">{shipments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">成約済み</p>
              <p className="text-2xl font-bold text-gray-900">
                {shipments.filter(s => s.status === 'MATCHED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Truck className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">輸送中</p>
              <p className="text-2xl font-bold text-gray-900">
                {shipments.filter(s => s.status === 'IN_TRANSIT').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">完了</p>
              <p className="text-2xl font-bold text-gray-900">
                {shipments.filter(s => s.status === 'DELIVERED').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 荷物一覧 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">荷物一覧</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-gray-500">読み込み中...</div>
        ) : shipments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>荷物がありません</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {shipment.cargoName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {shipment.cargoDescription}
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {shipment.pickupPrefecture} → {shipment.deliveryPrefecture}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(shipment.pickupDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Weight className="h-4 w-4 mr-1" />
                        {shipment.cargoWeight}kg
                      </span>
                      <span className="flex items-center">
                        <Truck className="h-4 w-4 mr-1" />
                        {shipment.requiredVehicleType}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      shipment.status === 'OPEN' ? 'bg-blue-100 text-blue-800' :
                      shipment.status === 'MATCHED' ? 'bg-green-100 text-green-800' :
                      shipment.status === 'IN_TRANSIT' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {shipment.status === 'OPEN' ? '募集中' :
                       shipment.status === 'MATCHED' ? '成約済み' :
                       shipment.status === 'IN_TRANSIT' ? '輸送中' : '完了'}
                    </span>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Eye className="h-4 w-4" />
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
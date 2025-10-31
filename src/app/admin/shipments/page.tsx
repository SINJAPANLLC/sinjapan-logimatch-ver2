'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { Package, MapPin, Calendar, DollarSign } from 'lucide-react'

interface Shipment {
  id: string
  cargoName: string
  pickupLocation: string
  deliveryLocation: string
  pickupDate: string
  budget: number
  status: string
  shipper: {
    id: string
    companyName: string
    email: string
  }
  _count: {
    offers: number
  }
  createdAt: string
}

export default function AdminShipments() {
  const router = useRouter()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (!parsedUser.isAdmin) {
        router.push('/dashboard')
        return
      }
    }

    fetchShipments()
  }, [router])

  const fetchShipments = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/shipments', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to fetch shipments')

      const data = await response.json()
      setShipments(data.shipments)
    } catch (error) {
      console.error('Error fetching shipments:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (shipmentId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/shipments', {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ shipmentId, status: newStatus })
      })

      if (!response.ok) throw new Error('Failed to update shipment')

      const data = await response.json()
      alert(data.message)
      fetchShipments()
    } catch (error) {
      console.error('Error updating shipment:', error)
      alert('ステータスの更新に失敗しました')
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600">読み込み中...</div>
        </div>
      </DashboardLayout>
    )
  }

  const statusCounts = {
    open: shipments.filter(s => s.status === 'OPEN').length,
    matched: shipments.filter(s => s.status === 'MATCHED').length,
    inTransit: shipments.filter(s => s.status === 'IN_TRANSIT').length,
    delivered: shipments.filter(s => s.status === 'DELIVERED').length,
    cancelled: shipments.filter(s => s.status === 'CANCELLED').length
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">荷物管理</h1>
            <p className="text-gray-600 mt-1">全荷物の管理とステータス変更</p>
          </div>
          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
            {shipments.length} 件の荷物
          </div>
        </div>

        {/* ステータスサマリー */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">募集中</p>
            <p className="text-2xl font-bold text-green-600">{statusCounts.open}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">マッチング済み</p>
            <p className="text-2xl font-bold text-blue-600">{statusCounts.matched}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">輸送中</p>
            <p className="text-2xl font-bold text-orange-600">{statusCounts.inTransit}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">配送完了</p>
            <p className="text-2xl font-bold text-gray-600">{statusCounts.delivered}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">キャンセル</p>
            <p className="text-2xl font-bold text-red-600">{statusCounts.cancelled}</p>
          </div>
        </div>

        {/* 荷物一覧 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">荷物情報</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">荷主</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">配送区間</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">引取日</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">予算</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">オファー数</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {shipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Package className="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                          <p className="font-medium text-gray-900">{shipment.cargoName}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(shipment.createdAt).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{shipment.shipper.companyName}</p>
                      <p className="text-xs text-gray-500">{shipment.shipper.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        <div>
                          <p>{shipment.pickupLocation}</p>
                          <p className="text-xs text-gray-500">→ {shipment.deliveryLocation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(shipment.pickupDate).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">¥{shipment.budget.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {shipment._count.offers}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        shipment.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                        shipment.status === 'MATCHED' ? 'bg-blue-100 text-blue-800' :
                        shipment.status === 'IN_TRANSIT' ? 'bg-orange-100 text-orange-800' :
                        shipment.status === 'DELIVERED' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {shipment.status === 'OPEN' ? '募集中' :
                         shipment.status === 'MATCHED' ? 'マッチング済み' :
                         shipment.status === 'IN_TRANSIT' ? '輸送中' :
                         shipment.status === 'DELIVERED' ? '配送完了' : 'キャンセル'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={shipment.status}
                        onChange={(e) => updateStatus(shipment.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="OPEN">募集中</option>
                        <option value="MATCHED">マッチング済み</option>
                        <option value="IN_TRANSIT">輸送中</option>
                        <option value="DELIVERED">配送完了</option>
                        <option value="CANCELLED">キャンセル</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {shipments.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              荷物が登録されていません
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

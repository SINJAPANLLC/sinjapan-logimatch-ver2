'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Bookmark, Package, MapPin, Calendar, Weight, Truck, DollarSign, Building2, User, Phone } from 'lucide-react'

export default function SavedShipmentsPage() {
  const [savedShipments, setSavedShipments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSavedShipments()
  }, [])

  const loadSavedShipments = async () => {
    setLoading(true)
    try {
      const savedIds = JSON.parse(localStorage.getItem('savedShipments') || '[]')
      if (savedIds.length === 0) {
        setSavedShipments([])
        return
      }

      // 保存された荷物の詳細を取得
      const response = await fetch('/api/shipments/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ids: savedIds })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch saved shipment details')
      }

      const result = await response.json()
      setSavedShipments(result.data)
    } catch (error) {
      console.error('Error loading saved shipments:', error)
      // 無効な保存IDをクリア
      localStorage.removeItem('savedShipments')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveSaved = (shipmentId: string) => {
    setSavedShipments(prev => prev.filter(s => s.id !== shipmentId))
    const updatedSavedIds = JSON.parse(localStorage.getItem('savedShipments') || '[]')
      .filter((id: string) => id !== shipmentId)
    localStorage.setItem('savedShipments', JSON.stringify(updatedSavedIds))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800'
      case 'MATCHED': return 'bg-green-100 text-green-800'
      case 'IN_TRANSIT': return 'bg-yellow-100 text-yellow-800'
      case 'DELIVERED': return 'bg-gray-100 text-gray-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">保存した荷物</h1>
        <p className="text-gray-600">お気に入りに保存した荷物の一覧です</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">保存した荷物一覧</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-gray-500">読み込み中...</div>
        ) : savedShipments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Bookmark className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>保存した荷物はありません</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {savedShipments.map(shipment => (
              <div key={shipment.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-blue-700">{shipment.cargoName}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                      {shipment.status === 'OPEN' && '募集中'}
                      {shipment.status === 'MATCHED' && 'マッチング済み'}
                      {shipment.status === 'IN_TRANSIT' && '輸送中'}
                      {shipment.status === 'DELIVERED' && '配送完了'}
                      {shipment.status === 'CANCELLED' && 'キャンセル'}
                    </span>
                    <button
                      onClick={() => handleRemoveSaved(shipment.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Bookmark className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">{shipment.cargoDescription}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
                  <div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-gray-500" />発地: {shipment.pickupPrefecture} {shipment.pickupCity}</div>
                  <div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-gray-500" />着地: {shipment.deliveryPrefecture} {shipment.deliveryCity}</div>
                  <div className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-gray-500" />発日時: {new Date(shipment.pickupDate).toLocaleDateString()} {shipment.pickupTimeFrom}</div>
                  <div className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-gray-500" />着日時: {new Date(shipment.deliveryDate).toLocaleDateString()} {shipment.deliveryTimeFrom}</div>
                  <div className="flex items-center"><Weight className="h-4 w-4 mr-2 text-gray-500" />重量: {shipment.cargoWeight} kg</div>
                  <div className="flex items-center"><Truck className="h-4 w-4 mr-2 text-gray-500" />車種: {shipment.requiredVehicleType}</div>
                  <div className="flex items-center"><DollarSign className="h-4 w-4 mr-2 text-gray-500" />予算: {shipment.budget.toLocaleString()} 円</div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <h4 className="font-semibold text-gray-800 mb-2">荷主情報</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                    <div className="flex items-center"><Building2 className="h-4 w-4 mr-2 text-gray-500" />会社名: {shipment.shipper.companyName}</div>
                    <div className="flex items-center"><User className="h-4 w-4 mr-2 text-gray-500" />担当者: {shipment.shipper.contactPerson}</div>
                    <div className="flex items-center"><Phone className="h-4 w-4 mr-2 text-gray-500" />電話番号: {shipment.shipper.phone}</div>
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
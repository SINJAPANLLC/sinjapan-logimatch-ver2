'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Package, MapPin, Calendar, Truck, DollarSign, Plus, Eye } from 'lucide-react'

export default function ShipmentsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [shipments, setShipments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
    fetchShipments(token)
  }, [router])

  const fetchShipments = async (token: string) => {
    try {
      const response = await fetch('/api/shipments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setShipments(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch shipments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      OPEN: { bg: 'bg-green-100', text: 'text-green-800', label: '募集中' },
      MATCHED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'マッチング済' },
      IN_TRANSIT: { bg: 'bg-purple-100', text: 'text-purple-800', label: '輸送中' },
      DELIVERED: { bg: 'bg-gray-100', text: 'text-gray-800', label: '配達完了' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: 'キャンセル' },
    }
    const badge = badges[status] || badges.OPEN
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    )
  }

  const getVehicleTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      LIGHT_TRUCK: '軽トラック',
      SMALL_TRUCK: '小型トラック',
      MEDIUM_TRUCK: '中型トラック',
      LARGE_TRUCK: '大型トラック',
      TRAILER: 'トレーラー',
      REFRIGERATED: '冷凍・冷蔵車',
      FLATBED: '平ボディ',
      WING: 'ウィング車',
    }
    return types[type] || type
  }

  const filteredShipments = shipments.filter(shipment => {
    if (filter === 'ALL') return true
    return shipment.status === filter
  })

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 fade-in-up">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {user.userType === 'SHIPPER' ? '投稿した案件' : '配送案件一覧'}
            </h1>
            <p className="text-gray-600">
              {filteredShipments.length}件の案件
            </p>
          </div>
          
          {user.userType === 'SHIPPER' && (
            <Link href="/shipments/new" className="btn-primary flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>新規案件を投稿</span>
            </Link>
          )}
        </div>

        {/* フィルター */}
        <div className="card mb-8 slide-in-left">
          <div className="flex flex-wrap gap-2">
            {['ALL', 'OPEN', 'MATCHED', 'IN_TRANSIT', 'DELIVERED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  filter === status
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'ALL' ? 'すべて' : getStatusBadge(status).props.children}
              </button>
            ))}
          </div>
        </div>

        {/* 案件リスト */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-600 mt-4">読み込み中...</p>
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="card text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">案件がありません</p>
            {user.userType === 'SHIPPER' && (
              <Link href="/shipments/new" className="btn-primary mt-6 inline-block">
                最初の案件を投稿
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredShipments.map((shipment, index) => (
              <div
                key={shipment.id}
                className="card hover:shadow-2xl transition-all cursor-pointer fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
                onClick={() => router.push(`/shipments/${shipment.id}`)}
              >
                {/* ヘッダー */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex-1 pr-4">
                    {shipment.title}
                  </h3>
                  {getStatusBadge(shipment.status)}
                </div>

                {/* 説明 */}
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {shipment.description}
                </p>

                {/* ルート情報 */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <MapPin className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">集荷</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {shipment.pickupPrefecture} {shipment.pickupLocation}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(shipment.pickupDateTime).toLocaleString('ja-JP')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <MapPin className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">配送先</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {shipment.deliveryPrefecture} {shipment.deliveryLocation}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(shipment.deliveryDateTime).toLocaleString('ja-JP')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 詳細情報 */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {getVehicleTypeLabel(shipment.requiredVehicleType)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {shipment.cargoWeight}kg
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 col-span-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-lg font-bold text-blue-600">
                      ¥{shipment.budget?.toLocaleString() || '未設定'}
                    </span>
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="w-full btn-secondary py-2 flex items-center justify-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>詳細を見る</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

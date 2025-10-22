'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Package, MapPin, DollarSign, Clock, Check, X } from 'lucide-react'

export default function OffersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [offers, setOffers] = useState<any[]>([])
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
    fetchOffers(token)
  }, [router])

  const fetchOffers = async (token: string) => {
    try {
      const response = await fetch('/api/offers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setOffers(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch offers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptOffer = async (offerId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`/api/offers/${offerId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchOffers(token)
      }
    } catch (error) {
      console.error('Failed to accept offer:', error)
    }
  }

  const handleRejectOffer = async (offerId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`/api/offers/${offerId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchOffers(token)
      }
    } catch (error) {
      console.error('Failed to reject offer:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '保留中' },
      ACCEPTED: { bg: 'bg-green-100', text: 'text-green-800', label: '承認済み' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-800', label: '拒否' },
      CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'キャンセル' },
    }
    const badge = badges[status] || badges.PENDING
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    )
  }

  const filteredOffers = offers.filter(offer => {
    if (filter === 'ALL') return true
    return offer.status === filter
  })

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ヘッダー */}
        <div className="mb-8 fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {user.userType === 'SHIPPER' ? '受け取ったオファー' : '送信したオファー'}
          </h1>
          <p className="text-gray-600">
            {filteredOffers.length}件のオファー
          </p>
        </div>

        {/* フィルター */}
        <div className="card mb-8 slide-in-left">
          <div className="flex flex-wrap gap-2">
            {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'].map((status) => (
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

        {/* オファーリスト */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-600 mt-4">読み込み中...</p>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="card text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">オファーがありません</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOffers.map((offer, index) => (
              <div
                key={offer.id}
                className="card hover:shadow-xl transition-all fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* 左側: 案件情報 */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 flex-1 pr-4">
                        {offer.shipment.title}
                      </h3>
                      {getStatusBadge(offer.status)}
                    </div>

                    {/* ルート情報 */}
                    <div className="space-y-3 mb-4 bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-500 p-2 rounded-lg">
                          <MapPin className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">集荷</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {offer.shipment.pickupPrefecture} {offer.shipment.pickupLocation}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="bg-purple-500 p-2 rounded-lg">
                          <MapPin className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">配送先</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {offer.shipment.deliveryPrefecture} {offer.shipment.deliveryLocation}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* オファー情報 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">希望運賃</p>
                        <p className="text-lg font-bold text-gray-700">
                          ¥{offer.shipment.budget?.toLocaleString() || '未設定'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">オファー金額</p>
                        <p className="text-lg font-bold text-blue-600">
                          ¥{offer.proposedPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 右側: オファー詳細とアクション */}
                  <div className="lg:w-80 space-y-4">
                    {/* 運送会社情報 (荷主の場合) */}
                    {user.userType === 'SHIPPER' && (
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <p className="text-xs text-gray-600 mb-2">運送会社</p>
                        <p className="font-bold text-gray-900">{offer.carrier.companyName}</p>
                        <p className="text-sm text-gray-600 mt-1">{offer.carrier.contactPerson}</p>
                      </div>
                    )}

                    {/* メッセージ */}
                    {offer.message && (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-xs text-gray-600 mb-2">メッセージ</p>
                        <p className="text-sm text-gray-800">{offer.message}</p>
                      </div>
                    )}

                    {/* 配送予定日 */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>配送予定: {new Date(offer.proposedDeliveryDate).toLocaleDateString('ja-JP')}</span>
                    </div>

                    {/* アクションボタン (荷主で保留中の場合) */}
                    {user.userType === 'SHIPPER' && offer.status === 'PENDING' && (
                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleRejectOffer(offer.id)}
                          className="btn-secondary py-3 flex items-center justify-center space-x-2"
                        >
                          <X className="h-4 w-4" />
                          <span>拒否</span>
                        </button>
                        <button
                          onClick={() => handleAcceptOffer(offer.id)}
                          className="btn-primary py-3 flex items-center justify-center space-x-2"
                        >
                          <Check className="h-4 w-4" />
                          <span>承認</span>
                        </button>
                      </div>
                    )}

                    {/* 詳細を見るボタン */}
                    <button
                      onClick={() => router.push(`/shipments/${offer.shipmentId}`)}
                      className="w-full btn-secondary py-3"
                    >
                      案件詳細を見る
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

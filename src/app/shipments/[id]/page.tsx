'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { 
  Package, MapPin, Calendar, Truck, DollarSign, User, 
  Phone, Mail, Edit, Trash, ArrowLeft, Send 
} from 'lucide-react'

function ShipmentDetailContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const shipmentId = params.id as string
  const action = searchParams.get('action')

  const [user, setUser] = useState<any>(null)
  const [shipment, setShipment] = useState<any>(null)
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showOfferForm, setShowOfferForm] = useState(action === 'offer')
  const [offerData, setOfferData] = useState({
    proposedPrice: '',
    proposedDeliveryDate: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
    fetchShipmentDetail(token)
  }, [shipmentId, router])

  const fetchShipmentDetail = async (token: string) => {
    try {
      const [shipmentRes, offersRes] = await Promise.all([
        fetch(`/api/shipments/${shipmentId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`/api/offers?shipmentId=${shipmentId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ])

      if (shipmentRes.ok) {
        const shipmentData = await shipmentRes.json()
        setShipment(shipmentData.data)
      }

      if (offersRes.ok) {
        const offersData = await offersRes.json()
        setOffers(offersData.data)
      }
    } catch (error) {
      console.error('Failed to fetch shipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          shipmentId,
          proposedPrice: parseFloat(offerData.proposedPrice),
          proposedDeliveryDate: offerData.proposedDeliveryDate,
          message: offerData.message,
        }),
      })

      if (response.ok) {
        setShowOfferForm(false)
        setOfferData({ proposedPrice: '', proposedDeliveryDate: '', message: '' })
        if (token) fetchShipmentDetail(token)
      }
    } catch (error) {
      console.error('Failed to submit offer:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteShipment = async () => {
    if (!confirm('本当にこの案件を削除しますか？')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/shipments/${shipmentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      })

      if (response.ok) {
        router.push('/shipments')
      }
    } catch (error) {
      console.error('Failed to delete shipment:', error)
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
      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}>
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

  if (loading || !user || !shipment) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-600 mt-4">読み込み中...</p>
          </div>
        </div>
      </div>
    )
  }

  const isOwner = user.id === shipment.shipperId
  const canOffer = user.userType === 'CARRIER' && shipment.status === 'OPEN'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 戻るボタン */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition fade-in-up"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>戻る</span>
        </button>

        {/* ヘッダー */}
        <div className="card mb-8 fade-in-up" style={{animationDelay: '0.1s'}}>
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                {shipment.title}
              </h1>
              {getStatusBadge(shipment.status)}
            </div>
            
            {isOwner && (
              <div className="flex gap-3">
                <button
                  onClick={() => router.push(`/shipments/${shipmentId}/edit`)}
                  className="btn-secondary flex items-center space-x-2 py-2 px-4"
                >
                  <Edit className="h-4 w-4" />
                  <span>編集</span>
                </button>
                <button
                  onClick={handleDeleteShipment}
                  className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-xl font-semibold transition flex items-center space-x-2"
                >
                  <Trash className="h-4 w-4" />
                  <span>削除</span>
                </button>
              </div>
            )}
          </div>

          <p className="text-gray-700 leading-relaxed">
            {shipment.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側: 詳細情報 */}
          <div className="lg:col-span-2 space-y-6">
            {/* ルート情報 */}
            <div className="card slide-in-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">配送ルート</h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 p-6 rounded-xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-green-500 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">集荷地</h3>
                  </div>
                  <p className="text-xl font-semibold text-gray-900 mb-2">
                    {shipment.pickupPrefecture} {shipment.pickupLocation}
                  </p>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(shipment.pickupDateTime).toLocaleString('ja-JP')}</span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="h-12 w-0.5 bg-gradient-to-b from-green-500 to-purple-500"></div>
                </div>

                <div className="bg-purple-50 p-6 rounded-xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-purple-500 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">配送先</h3>
                  </div>
                  <p className="text-xl font-semibold text-gray-900 mb-2">
                    {shipment.deliveryPrefecture} {shipment.deliveryLocation}
                  </p>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(shipment.deliveryDateTime).toLocaleString('ja-JP')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 荷物情報 */}
            <div className="card slide-in-left" style={{animationDelay: '0.2s'}}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">荷物情報</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">荷物の種類</p>
                  <p className="text-lg font-semibold text-gray-900">{shipment.cargoType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">重量</p>
                  <p className="text-lg font-semibold text-gray-900">{shipment.cargoWeight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">サイズ</p>
                  <p className="text-lg font-semibold text-gray-900">{shipment.cargoSize}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">必要な車両</p>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <p className="text-lg font-semibold text-gray-900">
                      {getVehicleTypeLabel(shipment.requiredVehicleType)}
                    </p>
                  </div>
                </div>
              </div>

              {shipment.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">備考・特記事項</p>
                  <p className="text-gray-900">{shipment.notes}</p>
                </div>
              )}
            </div>

            {/* オファー一覧 (荷主の場合) */}
            {isOwner && offers.length > 0 && (
              <div className="card slide-in-left" style={{animationDelay: '0.3s'}}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  受け取ったオファー ({offers.length}件)
                </h2>
                
                <div className="space-y-4">
                  {offers.map((offer) => (
                    <div key={offer.id} className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-gray-900">{offer.carrier.companyName}</p>
                          <p className="text-sm text-gray-600">{offer.carrier.contactPerson}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          offer.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                          offer.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {offer.status === 'ACCEPTED' ? '承認済み' :
                           offer.status === 'REJECTED' ? '拒否' : '保留中'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-600">オファー金額</p>
                          <p className="text-lg font-bold text-blue-600">
                            ¥{offer.proposedPrice.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">配送予定日</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {new Date(offer.proposedDeliveryDate).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                      
                      {offer.message && (
                        <p className="text-sm text-gray-700 mb-3">「{offer.message}」</p>
                      )}
                      
                      {offer.status === 'PENDING' && (
                        <Link href="/offers" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                          オファー管理画面で対応 →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 右側: サイドバー */}
          <div className="space-y-6">
            {/* 料金 */}
            <div className="card slide-in-right">
              <div className="text-center">
                <p className="text-gray-600 mb-2">希望運賃</p>
                <div className="flex items-center justify-center space-x-2">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                  <p className="text-4xl font-bold text-blue-600">
                    ¥{shipment.budget?.toLocaleString() || '未設定'}
                  </p>
                </div>
              </div>
            </div>

            {/* 荷主情報 (運送会社の場合) */}
            {!isOwner && shipment.shipper && (
              <div className="card slide-in-right" style={{animationDelay: '0.1s'}}>
                <h3 className="text-lg font-bold text-gray-900 mb-4">荷主情報</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">会社名</p>
                      <p className="font-semibold text-gray-900">{shipment.shipper.companyName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">担当者</p>
                      <p className="font-semibold text-gray-900">{shipment.shipper.contactPerson}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">電話番号</p>
                      <p className="font-semibold text-gray-900">{shipment.shipper.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* オファーボタン (運送会社の場合) */}
            {canOffer && !showOfferForm && (
              <button
                onClick={() => setShowOfferForm(true)}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center space-x-2 slide-in-right"
                style={{animationDelay: '0.2s'}}
              >
                <Send className="h-5 w-5" />
                <span>オファーを送信</span>
              </button>
            )}

            {/* オファーフォーム */}
            {showOfferForm && (
              <div className="card slide-in-right" style={{animationDelay: '0.2s'}}>
                <h3 className="text-lg font-bold text-gray-900 mb-4">オファーを送信</h3>
                <form onSubmit={handleSubmitOffer} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      提案金額 (円) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder={shipment.budget?.toString() || '0'}
                      value={offerData.proposedPrice}
                      onChange={(e) => setOfferData({ ...offerData, proposedPrice: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      配送予定日 *
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={offerData.proposedDeliveryDate}
                      onChange={(e) => setOfferData({ ...offerData, proposedDeliveryDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      メッセージ
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder="アピールポイントや特記事項があれば記載してください"
                      value={offerData.message}
                      onChange={(e) => setOfferData({ ...offerData, message: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setShowOfferForm(false)}
                      className="btn-secondary py-3"
                    >
                      キャンセル
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary py-3 disabled:opacity-50"
                    >
                      {submitting ? '送信中...' : '送信'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ShipmentDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-lg">読み込み中...</div>
      </div>
    }>
      <ShipmentDetailContent />
    </Suspense>
  )
}

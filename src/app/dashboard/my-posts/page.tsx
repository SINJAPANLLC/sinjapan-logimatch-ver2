'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Package, Plus, Edit, Trash2, Eye, Calendar, MapPin, Weight, DollarSign, Truck } from 'lucide-react'

interface MyPost {
  id: string
  type: 'shipment' | 'vehicle'
  title: string
  description: string
  status: string
  createdAt: string
  updatedAt: string
  data: any
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<MyPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'shipments' | 'vehicles'>('shipments')

  useEffect(() => {
    loadMyPosts()
  }, [])

  const loadMyPosts = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/my-posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to load posts')
      }

      const data = await response.json()
      setPosts(data.data || [])
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('この投稿を削除しますか？')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/user/my-posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      setPosts(prev => prev.filter(post => post.id !== id))
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('削除に失敗しました')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800'
      case 'MATCHED': return 'bg-green-100 text-green-800'
      case 'IN_TRANSIT': return 'bg-yellow-100 text-yellow-800'
      case 'DELIVERED': return 'bg-gray-100 text-gray-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      case 'AVAILABLE': return 'bg-green-100 text-green-800'
      case 'IN_USE': return 'bg-blue-100 text-blue-800'
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800'
      case 'UNAVAILABLE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'OPEN': return '募集中'
      case 'MATCHED': return 'マッチング済み'
      case 'IN_TRANSIT': return '輸送中'
      case 'DELIVERED': return '配送完了'
      case 'CANCELLED': return 'キャンセル'
      case 'AVAILABLE': return '利用可能'
      case 'IN_USE': return '使用中'
      case 'MAINTENANCE': return 'メンテナンス中'
      case 'UNAVAILABLE': return '利用不可'
      default: return status
    }
  }

  const filteredPosts = posts.filter(post => 
    activeTab === 'shipments' ? post.type === 'shipment' : post.type === 'vehicle'
  )

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">マイ投稿</h1>
            <p className="text-gray-600">投稿した荷物や空車情報を管理できます</p>
          </div>
          <div className="flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>新規投稿</span>
            </button>
          </div>
        </div>
      </div>

      {/* タブ */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('shipments')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'shipments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              荷物投稿 ({posts.filter(p => p.type === 'shipment').length})
            </button>
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'vehicles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              空車投稿 ({posts.filter(p => p.type === 'vehicle').length})
            </button>
          </nav>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {activeTab === 'shipments' ? '荷物投稿一覧' : '空車投稿一覧'}
          </h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-gray-500">読み込み中...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>投稿がありません</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPosts.map(post => (
              <div key={post.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{post.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                      {getStatusLabel(post.status)}
                    </span>
                    <div className="flex space-x-1">
                      <button className="p-2 text-gray-400 hover:text-blue-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {post.type === 'shipment' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      発地: {post.data.pickupPrefecture} {post.data.pickupCity}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      着地: {post.data.deliveryPrefecture} {post.data.deliveryCity}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      発日時: {new Date(post.data.pickupDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Weight className="h-4 w-4 mr-2 text-gray-500" />
                      重量: {post.data.cargoWeight}kg
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-2 text-gray-500" />
                      車種: {post.data.requiredVehicleType}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      予算: {post.data.budget.toLocaleString()}円
                    </div>
                  </div>
                )}

                {post.type === 'vehicle' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700">
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-2 text-gray-500" />
                      車種: {post.data.vehicleType}
                    </div>
                    <div className="flex items-center">
                      <Weight className="h-4 w-4 mr-2 text-gray-500" />
                      最大積載重量: {post.data.maxWeight}kg
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      運行可能エリア: {post.data.availablePrefectures ? JSON.parse(post.data.availablePrefectures).join(', ') : '-'}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      利用可能期間: {new Date(post.data.availableFrom).toLocaleDateString()} - {new Date(post.data.availableTo).toLocaleDateString()}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>投稿日: {new Date(post.createdAt).toLocaleString('ja-JP')}</span>
                    <span>更新日: {new Date(post.updatedAt).toLocaleString('ja-JP')}</span>
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

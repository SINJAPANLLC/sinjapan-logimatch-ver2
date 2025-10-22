'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Users, 
  Package, 
  Truck, 
  CreditCard, 
  Shield, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface AdminStats {
  users: { total: number; shippers: number; carriers: number }
  shipments: { total: number; open: number; completed: number }
  vehicles: { total: number; available: number }
  payments: { total: number; revenue: number }
  verifications: { pending: number; approved: number }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      // Admin権限チェック
      if (!parsedUser.isAdmin) {
        router.push('/dashboard')
        return
      }
    }

    fetchAdminStats()
  }, [router])

  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data = await response.json()
      setStats(data.stats)
      setRecentActivity(data.recent)
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    } finally {
      setLoading(false)
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

  const statCards = [
    {
      title: 'ユーザー',
      value: stats?.users.total || 0,
      subtitle: `荷主: ${stats?.users.shippers || 0} / 運送: ${stats?.users.carriers || 0}`,
      icon: Users,
      color: 'blue'
    },
    {
      title: '荷物',
      value: stats?.shipments.total || 0,
      subtitle: `募集中: ${stats?.shipments.open || 0} / 完了: ${stats?.shipments.completed || 0}`,
      icon: Package,
      color: 'green'
    },
    {
      title: '車両',
      value: stats?.vehicles.total || 0,
      subtitle: `利用可能: ${stats?.vehicles.available || 0}`,
      icon: Truck,
      color: 'purple'
    },
    {
      title: '決済',
      value: `¥${(stats?.payments.revenue || 0).toLocaleString()}`,
      subtitle: `取引数: ${stats?.payments.total || 0}`,
      icon: CreditCard,
      color: 'orange'
    },
    {
      title: '認証',
      value: stats?.verifications.pending || 0,
      subtitle: `承認済み: ${stats?.verifications.approved || 0}`,
      icon: Shield,
      color: 'red'
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">管理者ダッシュボード</h1>
            <p className="text-gray-600 mt-1">システム全体の統計と管理</p>
          </div>
          <div className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium">
            Admin
          </div>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
                  <Icon className={`w-5 h-5 text-${card.color}-600`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{card.value}</div>
                <p className="text-sm text-gray-500">{card.subtitle}</p>
              </div>
            )
          })}
        </div>

        {/* 最近のアクティビティ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 最近のユーザー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              最近のユーザー登録
            </h2>
            <div className="space-y-3">
              {recentActivity?.users?.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{user.companyName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.userType === 'SHIPPER' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.userType === 'SHIPPER' ? '荷主' : '運送'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 最近の荷物 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              最近の荷物登録
            </h2>
            <div className="space-y-3">
              {recentActivity?.shipments?.map((shipment: any) => (
                <div key={shipment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{shipment.cargoName}</p>
                    <p className="text-sm text-gray-500">{shipment.shipper.companyName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">¥{shipment.budget.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      shipment.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {shipment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 最近の決済 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            最近の決済
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">会社名</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">金額</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">支払い方法</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">日時</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentActivity?.payments?.map((payment: any) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{payment.user.companyName}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">¥{payment.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {payment.paymentMethod === 'bank_transfer' ? '銀行振込' : 
                       payment.paymentMethod === 'card' ? 'カード決済' : '口座振替'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        payment.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        payment.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.paymentStatus === 'COMPLETED' ? '完了' :
                         payment.paymentStatus === 'PENDING' ? '処理中' : '失敗'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString('ja-JP')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* クイックアクション */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push('/admin/users')}
            className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-between"
          >
            <div className="text-left">
              <h3 className="text-lg font-semibold">ユーザー管理</h3>
              <p className="text-sm text-blue-100">全ユーザーを管理</p>
            </div>
            <Users className="w-8 h-8" />
          </button>

          <button
            onClick={() => router.push('/admin/shipments')}
            className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-between"
          >
            <div className="text-left">
              <h3 className="text-lg font-semibold">荷物管理</h3>
              <p className="text-sm text-green-100">全荷物を管理</p>
            </div>
            <Package className="w-8 h-8" />
          </button>

          <button
            onClick={() => router.push('/admin/verifications')}
            className="bg-red-600 text-white p-6 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-between"
          >
            <div className="text-left">
              <h3 className="text-lg font-semibold">認証管理</h3>
              <p className="text-sm text-red-100">許可証を承認</p>
            </div>
            <Shield className="w-8 h-8" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

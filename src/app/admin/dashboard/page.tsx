'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import {
  Users,
  Package,
  TrendingUp,
  DollarSign,
  LogOut,
  FileText,
  Settings,
  BarChart3,
} from 'lucide-react'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalShipments: 0,
    totalOffers: 0,
    revenue: 0,
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      router.push('/admin')
      return
    }

    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token') || ''
      
      // ユーザー数を取得（管理者として）
      const response = await fetch('/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // ダミーデータ（実際はAPIから取得）
      setStats({
        totalUsers: 127,
        totalShipments: 453,
        totalOffers: 1089,
        revenue: 8500000,
      })

      setRecentActivity([
        { type: 'user', message: '新規ユーザー登録: 株式会社サンプル物流', time: '5分前' },
        { type: 'shipment', message: '新規案件投稿: 東京→大阪 (2t車)', time: '12分前' },
        { type: 'offer', message: 'オファー承認: 案件#1234', time: '18分前' },
        { type: 'user', message: '新規ユーザー登録: ABC運輸株式会社', time: '25分前' },
      ])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Logo width={180} height={50} className="w-[120px] h-[35px] sm:w-[180px] sm:h-[50px]" />
              <span className="text-xs sm:text-sm font-semibold text-red-600 bg-red-50 px-2 sm:px-3 py-1 rounded-full">
                管理者モード
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 sm:space-x-2 text-gray-700 hover:text-red-600 transition"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">ログアウト</span>
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">管理者ダッシュボード</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">システム全体の状況を確認できます</p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="card fade-in-up" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm mb-1">総ユーザー数</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs sm:text-sm text-green-600 mt-1">+12% 前月比</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 sm:p-4 rounded-2xl floating">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm mb-1">総案件数</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalShipments}</p>
                <p className="text-xs sm:text-sm text-green-600 mt-1">+8% 前月比</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 sm:p-4 rounded-2xl floating" style={{animationDelay: '1s'}}>
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="card fade-in-up" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm mb-1">総オファー数</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalOffers}</p>
                <p className="text-xs sm:text-sm text-green-600 mt-1">+15% 前月比</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-3 sm:p-4 rounded-2xl floating" style={{animationDelay: '2s'}}>
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="card fade-in-up" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm mb-1">総取引額</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  ¥{(stats.revenue / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs sm:text-sm text-green-600 mt-1">+20% 前月比</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 sm:p-4 rounded-2xl floating" style={{animationDelay: '0.5s'}}>
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* クイックアクション */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">クイックアクション</h2>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-600 transition flex items-center justify-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>ユーザー管理</span>
                </button>
                <button className="w-full bg-white border-2 border-gray-200 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:border-blue-300 hover:bg-blue-50 transition flex items-center justify-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>案件管理</span>
                </button>
                <button className="w-full bg-white border-2 border-gray-200 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:border-blue-300 hover:bg-blue-50 transition flex items-center justify-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>レポート</span>
                </button>
                <button className="w-full bg-white border-2 border-gray-200 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:border-blue-300 hover:bg-blue-50 transition flex items-center justify-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>システム設定</span>
                </button>
              </div>
            </div>
          </div>

          {/* 最近のアクティビティ */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">最近のアクティビティ</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        activity.type === 'user'
                          ? 'bg-blue-100'
                          : activity.type === 'shipment'
                          ? 'bg-purple-100'
                          : 'bg-green-100'
                      }`}
                    >
                      {activity.type === 'user' && (
                        <Users className="h-5 w-5 text-blue-600" />
                      )}
                      {activity.type === 'shipment' && (
                        <Package className="h-5 w-5 text-purple-600" />
                      )}
                      {activity.type === 'offer' && (
                        <FileText className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{activity.message}</p>
                      <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* グラフエリア（将来的に実装） */}
        <div className="mt-6 card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">月間統計</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 mx-auto mb-2 opacity-50" />
              <p>グラフ表示機能は準備中です</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Calculator, 
  MapPin, 
  Fuel, 
  Calendar, 
  Users, 
  Wrench,
  DollarSign,
  TrendingUp,
  Clock,
  Package,
  FileText,
  Download,
  Upload,
  BarChart3,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  icon: any
  color: string
  bgColor: string
  status: 'active' | 'coming_soon'
  link?: string
}

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'tools' | 'reports' | 'management'>('all')

  const services: Service[] = [
    {
      id: 'price-calc',
      title: '料金見積もり計算',
      description: '距離、重量、車両タイプから運賃を自動計算',
      icon: Calculator,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      status: 'active',
      link: '/dashboard/services/price-calculator'
    },
    {
      id: 'distance-calc',
      title: '距離計算ツール',
      description: '2地点間の最適ルートと距離を計算',
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      status: 'active',
      link: '/dashboard/services/distance-calculator'
    },
    {
      id: 'fuel-calc',
      title: '燃料費計算',
      description: '走行距離と燃費から燃料コストを算出',
      icon: Fuel,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      status: 'active',
      link: '/dashboard/services/fuel-calculator'
    },
    {
      id: 'schedule',
      title: '配送スケジュール管理',
      description: '配送予定を一元管理し、効率的に運用',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      status: 'coming_soon'
    },
    {
      id: 'driver',
      title: 'ドライバー管理',
      description: 'ドライバーの稼働状況や勤怠を管理',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      status: 'coming_soon'
    },
    {
      id: 'maintenance',
      title: '車両メンテナンス記録',
      description: '車両の点検・整備履歴を記録・管理',
      icon: Wrench,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      status: 'coming_soon'
    },
    {
      id: 'profit',
      title: '収益分析レポート',
      description: '売上・利益を可視化し、経営判断をサポート',
      icon: TrendingUp,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      status: 'coming_soon'
    },
    {
      id: 'invoice',
      title: '請求書自動作成',
      description: '配送実績から請求書を自動生成',
      icon: FileText,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      status: 'coming_soon'
    },
    {
      id: 'performance',
      title: 'パフォーマンス分析',
      description: '配送効率や稼働率を分析・改善提案',
      icon: BarChart3,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      status: 'coming_soon'
    }
  ]

  const filteredServices = services.filter(service => {
    if (activeTab === 'all') return true
    if (activeTab === 'tools') return ['price-calc', 'distance-calc', 'fuel-calc'].includes(service.id)
    if (activeTab === 'reports') return ['profit', 'performance'].includes(service.id)
    if (activeTab === 'management') return ['schedule', 'driver', 'maintenance', 'invoice'].includes(service.id)
    return true
  })

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">便利サービス</h1>
        <p className="text-gray-600">物流業務を効率化する各種サービスをご利用いただけます</p>
      </div>

      {/* タブメニュー */}
      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            すべて
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'tools'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            計算ツール
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'reports'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            レポート・分析
          </button>
          <button
            onClick={() => setActiveTab('management')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'management'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            管理ツール
          </button>
        </div>
      </div>

      {/* サービスカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service, index) => (
          <div
            key={service.id}
            className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-all duration-300 ${
              service.status === 'active' ? 'cursor-pointer hover:scale-105' : 'opacity-75'
            }`}
            onClick={() => {
              if (service.status === 'active' && service.link) {
                window.location.href = service.link
              }
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${service.bgColor} p-3 rounded-lg`}>
                <service.icon className={`h-6 w-6 ${service.color}`} />
              </div>
              {service.status === 'coming_soon' && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  近日公開
                </span>
              )}
              {service.status === 'active' && (
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  利用可能
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
            <p className="text-sm text-gray-600">{service.description}</p>
            {service.status === 'active' && (
              <div className="mt-4 text-blue-600 text-sm font-medium flex items-center">
                今すぐ使う
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 統計情報 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100">利用可能サービス</span>
            <CheckCircle className="h-5 w-5" />
          </div>
          <div className="text-3xl font-bold">3</div>
          <div className="text-sm text-blue-100 mt-1">計算ツール</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-100">近日公開予定</span>
            <Clock className="h-5 w-5" />
          </div>
          <div className="text-3xl font-bold">6</div>
          <div className="text-sm text-purple-100 mt-1">新機能準備中</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100">合計サービス</span>
            <Package className="h-5 w-5" />
          </div>
          <div className="text-3xl font-bold">9</div>
          <div className="text-sm text-green-100 mt-1">業務効率化ツール</div>
        </div>
      </div>

      {/* お知らせ */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">新サービス続々追加予定！</h3>
            <p className="text-blue-700 text-sm">
              2024年2月より、配送スケジュール管理、ドライバー管理など、さらに便利な機能を順次リリース予定です。
              物流業務の効率化をさらにサポートします。
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

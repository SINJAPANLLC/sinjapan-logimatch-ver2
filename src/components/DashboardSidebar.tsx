'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { 
  Package, 
  Search, 
  Truck, 
  Building2, 
  Users, 
  Settings, 
  FileText, 
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Plus,
  Bookmark,
  History,
  Shield,
  CreditCard,
  LayoutDashboard
} from 'lucide-react'

interface DashboardSidebarProps {
  onNavigate?: () => void
}

export default function DashboardSidebar({ onNavigate }: DashboardSidebarProps = {}) {
  const router = useRouter()
  const [shipmentSearchOpen, setShipmentSearchOpen] = useState(false)
  const [myShipmentsOpen, setMyShipmentsOpen] = useState(false)
  const [adminMenuOpen, setAdminMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      setIsAdmin(user.isAdmin || false)
    }
  }, [])

  const handleNavigation = (path: string) => {
    router.push(path)
    if (onNavigate) {
      onNavigate()
    }
  }

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col h-screen overflow-y-auto">
      {/* ロゴエリア */}
      <div className="p-6 border-b">
        <Logo linkable={false} />
      </div>

      {/* ナビゲーション */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="space-y-1">
          {/* 荷物を探す */}
          <div className="space-y-1">
            <button 
              onClick={() => setShipmentSearchOpen(!shipmentSearchOpen)}
              className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-between"
            >
              <span className="flex items-center">
                <Search className="h-4 w-4 mr-3" />
                荷物を探す
              </span>
              {shipmentSearchOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {shipmentSearchOpen && (
              <div className="ml-6 space-y-1">
                <button 
                  onClick={() => handleNavigation('/shipments/search')}
                  className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center text-sm"
                >
                  <Search className="h-4 w-4 mr-3" />
                  荷物検索
                </button>
                <button 
                  onClick={() => handleNavigation('/dashboard/saved-shipments')}
                  className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center text-sm"
                >
                  <Bookmark className="h-4 w-4 mr-3" />
                  保存した荷物
                </button>
                <button 
                  onClick={() => handleNavigation('/dashboard/recent-shipments')}
                  className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center text-sm"
                >
                  <History className="h-4 w-4 mr-3" />
                  最近見た荷物
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => handleNavigation('/dashboard/limited-shipments')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <Package className="h-4 w-4 mr-3" />
            限定荷物
          </button>

          <button 
            onClick={() => handleNavigation('/dashboard/shipments/new')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <Plus className="h-4 w-4 mr-3" />
            荷物登録
          </button>
          
          {/* マイ荷物・成約 */}
          <div className="space-y-1">
            <button 
              onClick={() => setMyShipmentsOpen(!myShipmentsOpen)}
              className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-between"
            >
              <span className="flex items-center">
                <Package className="h-4 w-4 mr-3" />
                マイ荷物・成約
              </span>
              {myShipmentsOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {myShipmentsOpen && (
              <div className="ml-6 space-y-1">
                <button 
                  onClick={() => handleNavigation('/dashboard/my-shipments')}
                  className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center text-sm"
                >
                  <Package className="h-4 w-4 mr-3" />
                  登録した荷物
                </button>
                <button 
                  onClick={() => handleNavigation('/dashboard/contracted-shipments')}
                  className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center text-sm"
                >
                  <CheckCircle className="h-4 w-4 mr-3" />
                  成約した荷物
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => handleNavigation('/dashboard/vehicle-search')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <Truck className="h-4 w-4 mr-3" />
            空車検索
          </button>

          <button 
            onClick={() => handleNavigation('/vehicles/register')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <Plus className="h-4 w-4 mr-3" />
            空車登録
          </button>

          <button 
            onClick={() => handleNavigation('/dashboard/company-search')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <Building2 className="h-4 w-4 mr-3" />
            企業検索
          </button>

          <button 
            onClick={() => handleNavigation('/dashboard/partners')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <Users className="h-4 w-4 mr-3" />
            取引先管理
          </button>

          <button 
            onClick={() => handleNavigation('/dashboard/transport-log')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <FileText className="h-4 w-4 mr-3" />
            実運送体制管理簿
          </button>

          <button 
            onClick={() => handleNavigation('/dashboard/verification')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <Shield className="h-4 w-4 mr-3" />
            許可証・認証
          </button>

          <button 
            onClick={() => handleNavigation('/dashboard/payment')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <CreditCard className="h-4 w-4 mr-3" />
            お支払い
          </button>

          <button 
            onClick={() => handleNavigation('/dashboard/services')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <Settings className="h-4 w-4 mr-3" />
            便利サービス
          </button>

          <button 
            onClick={() => handleNavigation('/dashboard/settings')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <Settings className="h-4 w-4 mr-3" />
            設定
          </button>

          {/* 管理者メニュー */}
          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-gray-200 space-y-1">
              <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                管理者機能
              </div>
              <div className="space-y-1">
                <button 
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  className="w-full text-left px-3 py-2 text-red-700 hover:bg-red-50 rounded-lg flex items-center justify-between"
                >
                  <span className="flex items-center">
                    <LayoutDashboard className="h-4 w-4 mr-3" />
                    Admin
                  </span>
                  {adminMenuOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {adminMenuOpen && (
                  <div className="ml-6 space-y-1">
                    <button 
                      onClick={() => handleNavigation('/admin')}
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center text-sm"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-3" />
                      ダッシュボード
                    </button>
                    <button 
                      onClick={() => handleNavigation('/admin/users')}
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center text-sm"
                    >
                      <Users className="h-4 w-4 mr-3" />
                      ユーザー管理
                    </button>
                    <button 
                      onClick={() => handleNavigation('/admin/shipments')}
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center text-sm"
                    >
                      <Package className="h-4 w-4 mr-3" />
                      荷物管理
                    </button>
                    <button 
                      onClick={() => handleNavigation('/admin/verifications')}
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center text-sm"
                    >
                      <Shield className="h-4 w-4 mr-3" />
                      認証管理
                    </button>
                    <button 
                      onClick={() => handleNavigation('/admin/payments')}
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center text-sm"
                    >
                      <CreditCard className="h-4 w-4 mr-3" />
                      決済管理
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from './Logo'
import { LogOut, User } from 'lucide-react'
import { useEffect, useState } from 'react'

interface NavbarProps {
  userType?: 'SHIPPER' | 'CARRIER'
}

export default function Navbar({ userType }: NavbarProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // ローカルストレージからユーザー情報を取得
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 sm:h-16">
          <Link href="/dashboard">
            <Logo width={180} height={50} linkable={false} className="w-[120px] h-[35px] sm:w-[180px] sm:h-[50px]" />
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-6">
            {userType === 'SHIPPER' && (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium transition text-xs sm:text-base"
                >
                  <span className="hidden sm:inline">ダッシュボード</span>
                  <span className="sm:hidden">ダッシュ</span>
                </Link>
                <Link
                  href="/shipments"
                  className="text-gray-700 hover:text-blue-600 font-medium transition text-xs sm:text-base"
                >
                  <span className="hidden sm:inline">配送案件</span>
                  <span className="sm:hidden">案件</span>
                </Link>
                <Link
                  href="/shipments/new"
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-600 transition text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">新規投稿</span>
                  <span className="sm:hidden">投稿</span>
                </Link>
              </>
            )}

            {userType === 'CARRIER' && (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium transition text-xs sm:text-base"
                >
                  <span className="hidden sm:inline">ダッシュボード</span>
                  <span className="sm:hidden">ダッシュ</span>
                </Link>
                <Link
                  href="/shipments/search"
                  className="text-gray-700 hover:text-blue-600 font-medium transition text-xs sm:text-base"
                >
                  <span className="hidden sm:inline">案件検索</span>
                  <span className="sm:hidden">検索</span>
                </Link>
                <Link
                  href="/offers"
                  className="text-gray-700 hover:text-blue-600 font-medium transition text-xs sm:text-base"
                >
                  <span className="hidden sm:inline">マイオファー</span>
                  <span className="sm:hidden">オファー</span>
                </Link>
              </>
            )}

            <div className="flex items-center space-x-1 sm:space-x-2 text-gray-700">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">
                {user?.companyName || 'ユーザー'}
              </span>
            </div>

            <Link
              href="/profile"
              className="text-gray-700 hover:text-blue-600 font-medium transition text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">プロフィール</span>
              <span className="sm:hidden">プロフ</span>
            </Link>

            <Link
              href="/help"
              className="text-gray-700 hover:text-blue-600 font-medium transition text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">ヘルプ</span>
              <span className="sm:hidden">?</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm hidden sm:inline">ログアウト</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}


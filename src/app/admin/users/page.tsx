'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { Users, Shield, ShieldOff, Search, Truck, Package } from 'lucide-react'

interface User {
  id: string
  email: string
  companyName: string
  contactPerson: string
  userType: 'SHIPPER' | 'CARRIER'
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  trustScore: number
  isAdmin: boolean
  createdAt: string
  _count: {
    shipments: number
    vehicles: number
    payments: number
    offers: number
  }
}

export default function AdminUsers() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'SHIPPER' | 'CARRIER'>('all')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (!parsedUser.isAdmin) {
        router.push('/dashboard')
        return
      }
    }

    fetchUsers()
  }, [router])

  useEffect(() => {
    let filtered = users

    if (filterType !== 'all') {
      filtered = filtered.filter(u => u.userType === filterType)
    }

    if (searchQuery) {
      filtered = filtered.filter(u => 
        u.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredUsers(filtered)
  }, [users, filterType, searchQuery])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to fetch users')

      const data = await response.json()
      setUsers(data.users)
      setFilteredUsers(data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAdminRole = async (userId: string, currentIsAdmin: boolean) => {
    if (!confirm(`このユーザーを${currentIsAdmin ? '一般ユーザー' : '管理者'}に変更しますか？`)) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, isAdmin: !currentIsAdmin })
      })

      if (!response.ok) throw new Error('Failed to update user')

      const data = await response.json()
      alert(data.message)
      fetchUsers()
    } catch (error) {
      console.error('Error updating user:', error)
      alert('権限の変更に失敗しました')
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ユーザー管理</h1>
            <p className="text-gray-600 mt-1">全ユーザーの管理と権限設定</p>
          </div>
          <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
            {users.length} 人のユーザー
          </div>
        </div>

        {/* 検索とフィルター */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="会社名、メール、担当者名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg ${
                  filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                全て
              </button>
              <button
                onClick={() => setFilterType('SHIPPER')}
                className={`px-4 py-2 rounded-lg ${
                  filterType === 'SHIPPER' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                荷主
              </button>
              <button
                onClick={() => setFilterType('CARRIER')}
                className={`px-4 py-2 rounded-lg ${
                  filterType === 'CARRIER' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                運送会社
              </button>
            </div>
          </div>
        </div>

        {/* ユーザー一覧テーブル */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ユーザー</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">タイプ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">認証</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">信頼スコア</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">アクティビティ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">登録日</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.companyName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">{user.contactPerson}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        user.userType === 'SHIPPER' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.userType === 'SHIPPER' ? '荷主' : '運送会社'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        user.verificationStatus === 'APPROVED' 
                          ? 'bg-green-100 text-green-800' 
                          : user.verificationStatus === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.verificationStatus === 'APPROVED' ? '承認済み' : 
                         user.verificationStatus === 'REJECTED' ? '拒否' : '保留中'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="text-lg font-semibold text-gray-900">{user.trustScore}</div>
                        <div className="text-xs text-gray-500 ml-1">/100</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-1" />
                          {user._count.shipments}
                        </div>
                        <div className="flex items-center">
                          <Truck className="w-4 h-4 mr-1" />
                          {user._count.vehicles}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.isAdmin ? (
                          <button
                            onClick={() => toggleAdminRole(user.id, user.isAdmin)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                          >
                            <ShieldOff className="w-4 h-4" />
                            Admin解除
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleAdminRole(user.id, user.isAdmin)}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                          >
                            <Shield className="w-4 h-4" />
                            Admin付与
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              該当するユーザーが見つかりません
            </div>
          )}
        </div>

        {/* 統計サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">総ユーザー数</p>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">荷主</p>
            <p className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.userType === 'SHIPPER').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">運送会社</p>
            <p className="text-2xl font-bold text-green-600">
              {users.filter(u => u.userType === 'CARRIER').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">管理者</p>
            <p className="text-2xl font-bold text-red-600">
              {users.filter(u => u.isAdmin).length}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

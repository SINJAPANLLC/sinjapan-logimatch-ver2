'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { CreditCard, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'

interface Payment {
  id: string
  amount: number
  paymentMethod: string
  paymentStatus: string
  transactionId: string | null
  paidAt: string | null
  createdAt: string
  user: {
    id: string
    companyName: string
    email: string
    userType: string
  }
}

export default function AdminPayments() {
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (!parsedUser.isAdmin) {
        router.push('/dashboard')
        return
      }
    }

    fetchPayments()
  }, [router])

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/payments', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to fetch payments')

      const data = await response.json()
      setPayments(data.payments)
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (paymentId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/payments', {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paymentId, paymentStatus: newStatus })
      })

      if (!response.ok) throw new Error('Failed to update payment')

      const data = await response.json()
      alert(data.message)
      fetchPayments()
    } catch (error) {
      console.error('Error updating payment:', error)
      alert('ステータスの更新に失敗しました')
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

  const totalRevenue = payments
    .filter(p => p.paymentStatus === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0)

  const statusCounts = {
    pending: payments.filter(p => p.paymentStatus === 'PENDING').length,
    completed: payments.filter(p => p.paymentStatus === 'COMPLETED').length,
    failed: payments.filter(p => p.paymentStatus === 'FAILED').length
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">決済管理</h1>
            <p className="text-gray-600 mt-1">全決済の管理とステータス変更</p>
          </div>
          <div className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg font-medium">
            {payments.length} 件の決済
          </div>
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">総売上</p>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">¥{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">処理中</p>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-yellow-600">{statusCounts.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">完了</p>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">{statusCounts.completed}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">失敗</p>
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-600">{statusCounts.failed}</p>
          </div>
        </div>

        {/* 決済一覧 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">会社名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ユーザータイプ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">金額</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">支払い方法</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">取引ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">作成日</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{payment.user.companyName}</p>
                        <p className="text-xs text-gray-500">{payment.user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        payment.user.userType === 'SHIPPER' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {payment.user.userType === 'SHIPPER' ? '荷主' : '運送会社'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-lg font-bold text-gray-900">¥{payment.amount.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {payment.paymentMethod === 'bank_transfer' ? '銀行振込' :
                         payment.paymentMethod === 'card' ? 'カード決済' : '口座振替'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-500 font-mono">
                        {payment.transactionId || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        payment.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        payment.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.paymentStatus === 'COMPLETED' ? '完了' :
                         payment.paymentStatus === 'PENDING' ? '処理中' : '失敗'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {new Date(payment.createdAt).toLocaleDateString('ja-JP')}
                      </p>
                      {payment.paidAt && (
                        <p className="text-xs text-gray-400">
                          {new Date(payment.paidAt).toLocaleTimeString('ja-JP')}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={payment.paymentStatus}
                        onChange={(e) => updateStatus(payment.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="PENDING">処理中</option>
                        <option value="COMPLETED">完了</option>
                        <option value="FAILED">失敗</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {payments.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              決済履歴がありません
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

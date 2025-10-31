'use client'

import { useState, useEffect } from 'react'
import { Bell, Send, AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  targetType: string
  targetUserId?: string
  isRead: boolean
  sentByEmail: boolean
  createdAt: string
}

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState('INFO')
  const [targetType, setTargetType] = useState('ALL')
  const [sendEmail, setSendEmail] = useState(true)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data.data)
      }
    } catch (err) {
      console.error('Fetch error:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          message,
          type,
          targetType,
          sendEmail,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTitle('')
        setMessage('')
        setType('INFO')
        setTargetType('ALL')
        fetchNotifications()
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(data.error || '通知の送信に失敗しました')
      }
    } catch (err) {
      setError('通知の送信に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'WARNING': return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'ERROR': return <XCircle className="w-5 h-5 text-red-500" />
      default: return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SUCCESS': return 'bg-green-50 border-green-200'
      case 'WARNING': return 'bg-yellow-50 border-yellow-200'
      case 'ERROR': return 'bg-red-50 border-red-200'
      default: return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-600" />
            通知管理
          </h1>
          <p className="text-gray-600 mt-2">
            ユーザーに通知を送信します（アプリ内通知 + メール配信）
          </p>
        </div>

        {/* 通知送信フォーム */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">新規通知作成</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* タイトル */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="通知のタイトルを入力"
                required
              />
            </div>

            {/* メッセージ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メッセージ <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="通知の内容を入力"
                required
              />
            </div>

            {/* 通知タイプ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                通知タイプ
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="INFO">情報</option>
                <option value="SUCCESS">成功</option>
                <option value="WARNING">警告</option>
                <option value="ERROR">エラー</option>
              </select>
            </div>

            {/* 配信対象 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                配信対象
              </label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">全ユーザー</option>
                <option value="SHIPPER">荷主のみ</option>
                <option value="CARRIER">運送会社のみ</option>
              </select>
            </div>

            {/* メール送信 */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="sendEmail"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="sendEmail" className="text-sm font-medium text-gray-700">
                メールでも通知を送信する
              </label>
            </div>

            {/* 成功メッセージ */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                ✓ 通知を送信しました
              </div>
            )}

            {/* エラーメッセージ */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              {loading ? '送信中...' : '通知を送信'}
            </button>
          </form>
        </div>

        {/* 送信済み通知一覧 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">送信済み通知</h2>
          
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                まだ通知が送信されていません
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 ${getTypeColor(notification.type)}`}
                >
                  <div className="flex items-start gap-3">
                    {getTypeIcon(notification.type)}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{notification.title}</h3>
                      <p className="text-gray-700 mt-1 whitespace-pre-wrap">{notification.message}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        <span>対象: {
                          notification.targetType === 'ALL' ? '全ユーザー' :
                          notification.targetType === 'SHIPPER' ? '荷主のみ' :
                          notification.targetType === 'CARRIER' ? '運送会社のみ' :
                          '特定ユーザー'
                        }</span>
                        <span>{notification.sentByEmail ? 'メール送信済み' : 'アプリ内のみ'}</span>
                        <span>{new Date(notification.createdAt).toLocaleString('ja-JP')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

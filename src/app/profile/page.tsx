'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { User, Building2, Phone, Mail, MapPin, Edit, Save, X } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    postalCode: '',
    address: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    const userObj = JSON.parse(userData)
    setUser(userObj)
    setFormData({
      companyName: userObj.companyName || '',
      contactPerson: userObj.contactPerson || '',
      phone: userObj.phone || '',
      postalCode: userObj.postalCode || '',
      address: userObj.address || '',
    })
    setLoading(false)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('更新に失敗しました')

      const updatedUser = { ...user, ...formData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      companyName: user?.companyName || '',
      contactPerson: user?.contactPerson || '',
      phone: user?.phone || '',
      postalCode: user?.postalCode || '',
      address: user?.address || '',
    })
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar userType={user?.userType} />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600 text-lg">読み込み中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar userType={user?.userType} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">プロフィール</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">アカウント情報を管理できます</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* プロフィール情報 */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">基本情報</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition"
                  >
                    <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-sm sm:text-base">編集</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition text-sm disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>{saving ? '保存中...' : '保存'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition text-sm"
                    >
                      <X className="h-4 w-4" />
                      <span>キャンセル</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Building2 className="inline h-4 w-4 mr-2" />
                    会社名
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm sm:text-base">{user?.companyName || '未設定'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-2" />
                    担当者名
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm sm:text-base">{user?.contactPerson || '未設定'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-2" />
                    電話番号
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm sm:text-base">{user?.phone || '未設定'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-2" />
                    メールアドレス
                  </label>
                  <p className="text-gray-900 text-sm sm:text-base">{user?.email}</p>
                  <p className="text-xs text-gray-500 mt-1">メールアドレスは変更できません</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-2" />
                    郵便番号
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="例: 1000001"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm sm:text-base">{user?.postalCode || '未設定'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-2" />
                    住所
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="住所を入力してください"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm sm:text-base">{user?.address || '未設定'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">アカウント情報</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">アカウント種別</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {user?.userType === 'SHIPPER' ? '荷主' : '運送会社'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">登録日</span>
                  <span className="text-sm text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ja-JP') : '不明'}
                  </span>
                </div>
              </div>
            </div>

            <div className="card mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">アカウント設定</h3>
              <div className="space-y-3">
                <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700 transition">
                  パスワードを変更
                </button>
                <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700 transition">
                  通知設定
                </button>
                <button className="w-full text-left text-sm text-red-600 hover:text-red-700 transition">
                  アカウントを削除
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

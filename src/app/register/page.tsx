'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    userType: 'SHIPPER',
    companyName: '',
    contactPerson: '',
    phone: '',
    postalCode: '',
    address: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '登録に失敗しました')
      }

      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
            新規登録
          </h1>
          <p className="text-slate-600">
            アカウントを作成してご利用ください
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-slate-700 leading-relaxed">
              運送事業法に基づく許可を受けた事業者様のみ<br />
              マッチングが可能となります。
            </p>
            <p className="text-sm text-slate-700 leading-relaxed mt-3">
              無料お試し期間は14日間になっており<br />
              継続しない場合は費用は発生しません。
            </p>
          </div>
        </div>

        <div className="floating-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* ユーザータイプ選択 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                登録タイプ <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'SHIPPER' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.userType === 'SHIPPER'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-semibold">荷主</div>
                  <div className="text-xs text-gray-600">配送を依頼する</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'CARRIER' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.userType === 'CARRIER'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-semibold">運送会社</div>
                  <div className="text-xs text-gray-600">配送を請け負う</div>
                </button>
              </div>
            </div>

            {/* 会社情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="companyName" className="block text-sm font-semibold text-slate-700 mb-2">
                  会社名 <span className="text-red-500">*</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="株式会社〇〇"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="contactPerson" className="block text-sm font-semibold text-slate-700 mb-2">
                  担当者名 <span className="text-red-500">*</span>
                </label>
                <input
                  id="contactPerson"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="山田太郎"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                />
              </div>
            </div>

            {/* 連絡先 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                  電話番号 <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="03-1234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* 住所 */}
            <div>
              <label htmlFor="postalCode" className="block text-sm font-semibold text-slate-700 mb-2">
                郵便番号 <span className="text-red-500">*</span>
              </label>
              <input
                id="postalCode"
                type="text"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123-4567"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-2">
                住所 <span className="text-red-500">*</span>
              </label>
              <input
                id="address"
                type="text"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="東京都〇〇区〇〇 1-2-3"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            {/* パスワード */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                パスワード <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="8文字以上"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50"
            >
              {loading ? '登録中...' : '登録する'}
            </button>

            <div className="text-center">
              <span className="text-slate-600">既にアカウントをお持ちの方は </span>
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                ログイン
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

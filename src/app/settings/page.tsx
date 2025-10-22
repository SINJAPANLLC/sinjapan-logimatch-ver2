'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Bell, Shield, Eye, Mail, Smartphone, Globe, Save, Check } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    publicProfile: false,
    showContactInfo: true,
    language: 'ja',
    timezone: 'Asia/Tokyo',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      // 実際のAPI呼び出しをここに実装
      await new Promise(resolve => setTimeout(resolve, 1000)) // ダミーの遅延
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings({ ...settings, [key]: value })
  }

  return (
    <div className="min-h-screen">
      <Navbar userType={user?.userType} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">設定</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">アプリケーションの設定を管理できます</p>
        </div>

        <div className="space-y-6">
          {/* 通知設定 */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-2xl">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">通知設定</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">メール通知</h3>
                  <p className="text-xs sm:text-sm text-gray-600">新しいオファーやメッセージの通知</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">プッシュ通知</h3>
                  <p className="text-xs sm:text-sm text-gray-600">ブラウザからの通知</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">SMS通知</h3>
                  <p className="text-xs sm:text-sm text-gray-600">重要な通知をSMSで受け取る</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* プライバシー設定 */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-2xl">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">プライバシー設定</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">プロフィールを公開</h3>
                  <p className="text-xs sm:text-sm text-gray-600">他のユーザーがプロフィールを閲覧可能</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.publicProfile}
                    onChange={(e) => handleSettingChange('publicProfile', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">連絡先情報を表示</h3>
                  <p className="text-xs sm:text-sm text-gray-600">電話番号とメールアドレスを表示</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showContactInfo}
                    onChange={(e) => handleSettingChange('showContactInfo', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* 地域・言語設定 */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-2xl">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">地域・言語設定</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">言語</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="ja">日本語</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">タイムゾーン</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="Asia/Tokyo">東京 (JST)</option>
                  <option value="Asia/Seoul">ソウル (KST)</option>
                  <option value="Asia/Shanghai">上海 (CST)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 保存ボタン */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center space-x-2 px-6 py-3"
            >
              {saved ? (
                <>
                  <Check className="h-5 w-5" />
                  <span>保存完了</span>
                </>
              ) : saving ? (
                <>
                  <Save className="h-5 w-5" />
                  <span>保存中...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>設定を保存</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

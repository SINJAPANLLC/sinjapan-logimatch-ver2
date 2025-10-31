'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { ArrowLeft, Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)
    const data = {
      lastName: formData.get('lastName'),
      firstName: formData.get('firstName'),
      lastNameKana: formData.get('lastNameKana'),
      firstNameKana: formData.get('firstNameKana'),
      company: formData.get('company'),
      department: formData.get('department'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      contactMethod: formData.get('contactMethod'),
      message: formData.get('message'),
      newsletter: formData.get('newsletter') === 'on'
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus('success')
        e.currentTarget.reset()
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.error || 'エラーが発生しました')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('送信に失敗しました。もう一度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* ヘッダー */}
      <header className="glass sticky top-0 z-50 border-b border-white/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <Logo width={200} height={60} className="w-[150px] h-[45px] sm:w-[200px] sm:h-[60px]" linkable={false} />
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-6">
              <Link
                href="/login"
                className="text-slate-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="btn-primary text-sm px-6 py-3"
              >
                新規登録
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-300 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            トップページに戻る
          </Link>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
            お問い合わせ
          </h1>
          <p className="text-lg text-slate-600">
            ご質問・ご相談がございましたら、お気軽にお問い合わせください
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* お問い合わせフォーム */}
          <div className="floating-card">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">お問い合わせフォーム</h2>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  ✓ お問い合わせを送信しました。担当者より折り返しご連絡いたします。
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">
                  ✗ {errorMessage}
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                    お名前（姓）<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="山田"
                  />
                </div>
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                    お名前（名）<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="太郎"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lastNameKana" className="block text-sm font-medium text-slate-700 mb-2">
                    フリガナ（セイ）<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastNameKana"
                    name="lastNameKana"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="ヤマダ"
                  />
                </div>
                <div>
                  <label htmlFor="firstNameKana" className="block text-sm font-medium text-slate-700 mb-2">
                    フリガナ（メイ）<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstNameKana"
                    name="firstNameKana"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="タロウ"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                  会社名
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="株式会社サンプル"
                />
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-2">
                  部署・役職
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="営業部 部長"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  お電話番号<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="03-1234-5678"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  メールアドレス<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="example@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ご希望の連絡方法<span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="contactMethod" value="email" className="mr-2" />
                    <span>メール</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="contactMethod" value="phone" className="mr-2" />
                    <span>電話</span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  お問い合わせ内容<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="お問い合わせ内容をご記入ください"
                ></textarea>
              </div>

              <div className="flex items-start">
                <input type="checkbox" id="newsletter" name="newsletter" className="mt-1 mr-2" />
                <label htmlFor="newsletter" className="text-sm text-slate-600">
                  送信したメールアドレスでお知らせ配信に登録する
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '送信中...' : '送信'}
              </button>

              <p className="text-xs text-slate-500">
                利用規約・プライバシーポリシーをお読みの上、同意して送信して下さい。
              </p>
            </form>
          </div>

          {/* 会社情報 */}
          <div className="space-y-6">
            <div className="floating-card">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">会社情報</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-800">本社所在地</h3>
                    <p className="text-slate-600">〒243-0303</p>
                    <p className="text-slate-600">神奈川県愛甲郡愛川町中津７２８７</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-800">電話番号</h3>
                    <p className="text-slate-600">046-212-2325</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-800">FAX</h3>
                    <p className="text-slate-600">046-212-2326</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-800">メールアドレス</h3>
                    <p className="text-slate-600">info@sinjapan.jp</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-800">受付時間</h3>
                    <p className="text-slate-600">9:00-21:00</p>
                    <p className="text-sm text-slate-500">（土日祝日は休業）</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-card">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">その他のお問い合わせ</h2>
              <div className="space-y-3">
                <Link 
                  href="/help" 
                  className="block text-blue-600 hover:text-blue-700 transition-colors duration-300"
                >
                  よくあるご質問
                </Link>
                <Link 
                  href="/terms" 
                  className="block text-blue-600 hover:text-blue-700 transition-colors duration-300"
                >
                  利用規約
                </Link>
                <Link 
                  href="/privacy" 
                  className="block text-blue-600 hover:text-blue-700 transition-colors duration-300"
                >
                  プライバシーポリシー
                </Link>
                <Link 
                  href="/about" 
                  className="block text-blue-600 hover:text-blue-700 transition-colors duration-300"
                >
                  会社概要
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

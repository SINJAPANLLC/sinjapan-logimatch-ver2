'use client'

import Link from 'next/link'
import Logo from '@/components/Logo'
import { ArrowLeft, HelpCircle, Mail, Phone, MessageCircle } from 'lucide-react'

export default function HelpPage() {
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-300 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            トップページに戻る
          </Link>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
            ヘルプセンター
          </h1>
          <p className="text-lg text-slate-600">
            よくあるご質問とサポート情報をご案内します
          </p>
        </div>

        {/* FAQ セクション */}
        <div className="space-y-8">
          <div className="floating-card">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <HelpCircle className="h-6 w-6 mr-3 text-blue-600" />
              よくあるご質問
            </h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Q. 無料お試しの期間はどのくらいですか？
                </h3>
                <p className="text-slate-600">
                  A. 無料お試し期間は14日間です。
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Q. 登録に必要な書類はありますか？
                </h3>
                <p className="text-slate-600">
                  A. 運送事業許可証が必要です。詳細は登録画面でご確認ください。
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Q. マッチングの手数料はかかりますか？
                </h3>
                <p className="text-slate-600">
                  A. 御座いません。
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Q. 支払い方法はどのようなものがありますか？
                </h3>
                <p className="text-slate-600">
                  A. クレジットカード決済、銀行振込、口座振替、コンビニ払い、電子マネーに対応しております。
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Q. トラブルが発生した場合はどうすればよいですか？
                </h3>
                <p className="text-slate-600">
                  A. お問い合わせフォームまたはお電話でご連絡ください。24時間以内に回答いたします。
                </p>
              </div>
            </div>
          </div>

          {/* お問い合わせ情報 */}
          <div className="floating-card">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <MessageCircle className="h-6 w-6 mr-3 text-blue-600" />
              お問い合わせ
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-800">電話でのお問い合わせ</h3>
                  <p className="text-slate-600">046-212-2325</p>
                  <p className="text-sm text-slate-500">9:00-21:00</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-800">メールでのお問い合わせ</h3>
                  <p className="text-slate-600">info@sinjapan.jp</p>
                  <p className="text-sm text-slate-500">24時間受付</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Link 
                href="/contact" 
                className="btn-primary inline-flex items-center"
              >
                お問い合わせフォーム
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
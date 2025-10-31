'use client'

import Link from 'next/link'
import Logo from '@/components/Logo'
import { ArrowLeft, MapPin, Phone, Mail, Globe, Building, Users, Target, Award } from 'lucide-react'

export default function AboutPage() {
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
            会社概要
          </h1>
          <p className="text-lg text-slate-600">
            合同会社SIN JAPANについて
          </p>
        </div>

        <div className="space-y-8">
          {/* 会社基本情報 */}
          <div className="floating-card">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <Building className="h-6 w-6 mr-3 text-blue-600" />
              会社基本情報
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Building className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-800">会社名</h3>
                    <p className="text-slate-600">合同会社SIN JAPAN</p>
                  </div>
                </div>

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
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-800">メールアドレス</h3>
                    <p className="text-slate-600">info@sinjapan.jp</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Globe className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-800">ホームページ</h3>
                    <a 
                      href="https://sinjapan.work/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 transition-colors duration-300"
                    >
                      https://sinjapan.work/
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-800">事業内容</h3>
                    <p className="text-slate-600">一般貨物・軽貨物運送</p>
                    <p className="text-slate-600">物流AIマッチング</p>
                    <p className="text-slate-600">マーケティング支援</p>
                    <p className="text-slate-600">WEB制作</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 企業理念 */}
          <div className="floating-card">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <Target className="h-6 w-6 mr-3 text-blue-600" />
              企業理念
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-slate-800 mb-3">「断らない物流」を実現する</h3>
                <p className="text-slate-700 leading-relaxed">
                  私たちは「荷物を断られる…そんな当たり前を変えたい。」という想いから、<br />
                  「断らない物流」を実現する総合物流企業として、人とITの力で全国に届けられる仕組みを構築しています。
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-slate-800 mb-3">人を大切に、物流を止めない</h3>
                <p className="text-slate-700 leading-relaxed">
                  人を大切にし、物流を止めないことが私たちの使命です。<br />
                  複雑な業務もシンプルに、誰でも使えるシステムを設計し、持続可能な社会をITから支えます。
                </p>
              </div>
            </div>
          </div>

          {/* 事業内容詳細 */}
          <div className="floating-card">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <Award className="h-6 w-6 mr-3 text-blue-600" />
              事業内容
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">一般貨物・軽貨物輸送</h3>
                  <p className="text-slate-600 text-sm">
                    神奈川県愛甲郡愛川町を拠点とした運送事業。関東圏を中心とした軽貨物配送と一般貨物輸送を、自社車両保有＋協力会社ネットワークにより柔軟に対応します。
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">物流AIマッチング</h3>
                  <p className="text-slate-600 text-sm">
                    AIを活用した求荷求車システムの開発・運営。荷主と運送会社を効率的にマッチングし、「断らない物流」を実現します。
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">マーケティング支援</h3>
                  <p className="text-slate-600 text-sm">
                    ランディングページ・ECサイト構築、SNS広告・SEO・LPO対策など、総合的なマーケティング支援を提供します。
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">WEB制作</h3>
                  <p className="text-slate-600 text-sm">
                    企業のデジタル化を支援するWEBサイト制作・システム開発を行います。誰でも簡単に使えるシステムを設計します。
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">海外事業展開</h3>
                  <p className="text-slate-600 text-sm">
                    フィリピンを中心とした海外事業展開支援。現地法人設立・店舗ビジネスサポート、美容・医療クリニック運営を行います。
                  </p>
                </div>

                <div className="border-l-4 border-teal-500 pl-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">その他事業</h3>
                  <p className="text-slate-600 text-sm">
                    不動産仲介・貸会議室運営、中古車販売（商用車中心）、ライブチャットシステム構築・運用など、多岐にわたる事業を展開しています。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* お問い合わせ */}
          <div className="floating-card">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">お問い合わせ</h2>
            <p className="text-slate-600 mb-6">
              ご質問・ご相談がございましたら、お気軽にお問い合わせください。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/contact" 
                className="btn-primary text-center"
              >
                お問い合わせフォーム
              </Link>
              <Link 
                href="/help" 
                className="btn-secondary text-center"
              >
                よくあるご質問
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

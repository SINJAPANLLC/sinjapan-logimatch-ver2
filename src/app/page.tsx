'use client'

import Link from 'next/link'
import Logo from '@/components/Logo'
import CountUpAnimation from '@/components/CountUpAnimation'
import { Package, Users, TrendingUp, Shield, Clock, BarChart, Truck } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function HomePage() {
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation()
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation()
  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="glass sticky top-0 z-50 border-b border-white/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <Logo width={200} height={60} className="w-[150px] h-[45px] sm:w-[200px] sm:h-[60px] scale-in" />
            <div className="flex items-center space-x-2 sm:space-x-6">
              <Link
                href="/login"
                className="text-slate-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="btn-primary text-sm px-6 py-3 scale-in"
                style={{animationDelay: '0.1s'}}
              >
                新規登録
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* ヒーローセクション */}
      <section className="relative overflow-hidden min-h-screen flex items-center gradient-bg">
        {/* アニメーション背景 */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow glow-effect"></div>
          <div className="absolute top-40 right-10 w-32 h-32 sm:w-96 sm:h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow animation-delay-2000 glow-effect"></div>
          <div className="absolute -bottom-8 left-20 w-32 h-32 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow animation-delay-4000 glow-effect"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-[500px] sm:h-[500px] bg-gradient-to-r from-white/20 to-blue-100/30 rounded-full filter blur-3xl animate-pulse-slow animation-delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 w-full">
          <div className="text-center">
            <div className="fade-in-up">
              <h1 className="text-4xl sm:text-5xl lg:text-8xl font-bold mb-6 sm:mb-8 leading-tight">
                <span className="text-slate-800">物流を</span>
                <span className="gradient-text text-glow">もっとスマート</span>
                <span className="text-slate-800">に</span>
              </h1>
            </div>
            
            <div className="slide-in-left">
              <p className="text-lg sm:text-xl lg:text-3xl text-slate-600 mb-8 sm:mb-12 max-w-5xl mx-auto leading-relaxed px-4 font-medium">
                「断らない物流」を実現する、次世代求荷求車サービス<br className="hidden sm:block" />
                荷物や空きトラックがAIによってすぐ決まる！
              </p>
            </div>
            
            <div className="slide-in-right">
              <div className="flex justify-center mb-12 sm:mb-16 px-4">
                <Link href="/register" className="btn-primary text-lg sm:text-xl px-12 py-4 sm:px-20 lg:px-24 floating glow-effect">
                  無料お試しに申し込む
                </Link>
              </div>
            </div>
            
            {/* リアルタイム情報 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mt-12 sm:mt-16 max-w-4xl mx-auto px-4">
              <div className="floating-card text-center scale-in glow-effect" style={{animationDelay: '0.1s'}}>
                <div className="text-3xl sm:text-4xl lg:text-6xl font-bold gradient-text mb-3 text-glow">
                  <CountUpAnimation end={10247} duration={2500} />
                </div>
                <div className="text-slate-600 text-sm sm:text-lg font-medium">現在の荷物数</div>
                <div className="text-xs text-slate-500 mt-1">リアルタイム更新</div>
              </div>
              <div className="floating-card text-center scale-in glow-effect" style={{animationDelay: '0.15s'}}>
                <div className="text-3xl sm:text-4xl lg:text-6xl font-bold gradient-text mb-3 text-glow">
                  <CountUpAnimation end={856} duration={2500} />
                </div>
                <div className="text-slate-600 text-sm sm:text-lg font-medium">現在の空車数</div>
                <div className="text-xs text-slate-500 mt-1">リアルタイム更新</div>
              </div>
            </div>
            
            {/* 統計情報 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mt-8 sm:mt-12 max-w-6xl mx-auto px-4">
              <div className="floating-card text-center scale-in glow-effect" style={{animationDelay: '0.2s'}}>
                <div className="text-3xl sm:text-4xl lg:text-6xl font-bold gradient-text mb-3 text-glow">
                  <CountUpAnimation end={1000} duration={3000} suffix="+" />
                </div>
                <div className="text-slate-600 text-sm sm:text-lg font-medium">登録企業数</div>
              </div>
              <div className="floating-card text-center scale-in glow-effect" style={{animationDelay: '0.4s'}}>
                <div className="text-3xl sm:text-4xl lg:text-6xl font-bold gradient-text mb-3 text-glow">
                  <CountUpAnimation end={5000} duration={3000} suffix="+" />
                </div>
                <div className="text-slate-600 text-sm sm:text-lg font-medium">月間マッチング数</div>
              </div>
              <div className="floating-card text-center scale-in glow-effect sm:col-span-2 lg:col-span-1" style={{animationDelay: '0.6s'}}>
                <div className="text-3xl sm:text-4xl lg:text-6xl font-bold gradient-text mb-3 text-glow">
                  <CountUpAnimation end={98} duration={2000} suffix="%" />
                </div>
                <div className="text-slate-600 text-sm sm:text-lg font-medium">顧客満足度</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section ref={featuresRef} className="gradient-bg py-24 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-20 ${featuresVisible ? 'zoom-in' : 'opacity-0'}`}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-8">
              SIN JAPAN LOGI MATCHの特徴
            </h2>
            <p className="text-xl sm:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
              最先端のテクノロジーで物流業界に革新をもたらします
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            <div className={`floating-card group ${featuresVisible ? 'zoom-in stagger-1' : 'opacity-0'} hover:glow-pulse`}>
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:wiggle transition-all duration-500 glow-pulse">
                <Package className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-slate-800">簡単な案件投稿</h3>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                荷主は数分で配送案件を投稿可能。詳細な条件設定で、最適な運送会社とマッチングします。
              </p>
            </div>

            <div className={`floating-card group ${featuresVisible ? 'zoom-in stagger-2' : 'opacity-0'} hover:glow-pulse`}>
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:wiggle transition-all duration-500 glow-pulse">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-slate-800">効率的なマッチング</h3>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                運送会社は条件に合う案件を検索し、自由にオファーを提案。双方が納得する条件で取引できます。
              </p>
            </div>

            <div className={`floating-card group ${featuresVisible ? 'zoom-in stagger-3' : 'opacity-0'} hover:glow-pulse`}>
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:wiggle transition-all duration-500 glow-pulse">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-slate-800">コスト削減</h3>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                複数の運送会社から相見積もりが可能。競争原理により、適正価格での取引を実現します。
              </p>
            </div>

            <div className={`floating-card group ${featuresVisible ? 'zoom-in stagger-4' : 'opacity-0'} hover:glow-pulse`}>
              <div className="bg-gradient-to-br from-orange-600 to-yellow-600 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:wiggle transition-all duration-500 glow-pulse">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-slate-800">安全・安心</h3>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                厳格な審査を通過した運送会社のみが登録。安心して取引できる環境を提供します。
              </p>
            </div>

            <div className={`floating-card group ${featuresVisible ? 'zoom-in stagger-5' : 'opacity-0'} hover:glow-pulse`}>
              <div className="bg-gradient-to-br from-indigo-600 to-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:wiggle transition-all duration-500 glow-pulse">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-slate-800">24時間対応</h3>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                いつでもどこでも案件の投稿・検索が可能。リアルタイムで状況を確認できます。
              </p>
            </div>

            <div className={`floating-card group ${featuresVisible ? 'zoom-in animation-delay-500' : 'opacity-0'} hover:glow-pulse`}>
              <div className="bg-gradient-to-br from-teal-600 to-cyan-600 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:wiggle transition-all duration-500 glow-pulse">
                <BarChart className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-slate-800">データ分析</h3>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                過去の取引データを分析し、最適な価格設定や運送ルートを提案します。
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* フッター */}
      <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 gradient-text text-glow">
                SIN JAPAN LOGI MATCH
              </h3>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                「断らない物流」を実現する、次世代求荷求車サービス
              </p>
            </div>
            <p className="text-slate-400 mb-8 text-lg">
              © 2025 SIN JAPAN LLC All rights reserved
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-base text-slate-400">
              <Link href="/help" className="hover:text-white transition-all duration-300 hover:scale-105 hover:text-glow">ヘルプ</Link>
              <Link href="/terms" className="hover:text-white transition-all duration-300 hover:scale-105 hover:text-glow">利用規約</Link>
              <Link href="/privacy" className="hover:text-white transition-all duration-300 hover:scale-105 hover:text-glow">プライバシーポリシー</Link>
              <Link href="/contact" className="hover:text-white transition-all duration-300 hover:scale-105 hover:text-glow">お問い合わせ</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


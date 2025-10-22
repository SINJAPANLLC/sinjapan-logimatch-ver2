'use client'

import Link from 'next/link'
import Logo from '@/components/Logo'
import { ArrowLeft, FileText } from 'lucide-react'

export default function TermsPage() {
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
          
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4 flex items-center">
            <FileText className="h-8 w-8 mr-4 text-blue-600" />
            利用規約
          </h1>
          <p className="text-lg text-slate-600">
            最終更新日：2025年1月15日
          </p>
        </div>

        <div className="floating-card">
          <div className="prose prose-slate max-w-none">
            <h2>第1条（適用）</h2>
            <p>
              本利用規約（以下「本規約」といいます。）は、合同会社SIN JAPAN（以下「当社」といいます。）が提供する「SIN JAPAN LOGI MATCH」サービス（以下「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下「ユーザー」といいます。）には、本規約に従って、本サービスをご利用いただきます。
            </p>

            <h2>第2条（利用登録）</h2>
            <p>
              本サービスにおいては、登録希望者が本規約に同意の上、当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。
            </p>

            <h2>第3条（ユーザーIDおよびパスワードの管理）</h2>
            <p>
              ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。
            </p>

            <h2>第4条（禁止事項）</h2>
            <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
            <ul>
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>本サービスの内容等、本サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為</li>
              <li>当社、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
              <li>本サービスによって得られた情報を商業的に利用する行為</li>
              <li>当社のサービスの運営を妨害するおそれのある行為</li>
              <li>不正アクセスをし、またはこれを試みる行為</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ul>

            <h2>第5条（本サービスの提供の停止等）</h2>
            <p>
              当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
            </p>
            <ul>
              <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
              <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
              <li>コンピュータまたは通信回線等が事故により停止した場合</li>
              <li>その他、当社が本サービスの提供が困難と判断した場合</li>
            </ul>

            <h2>第6条（利用制限および登録抹消）</h2>
            <p>
              当社は、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、ユーザーに対して、本サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができるものとします。
            </p>
            <ul>
              <li>本規約のいずれかの条項に違反した場合</li>
              <li>登録事項に虚偽の事実があることが判明した場合</li>
              <li>料金等の支払債務の不履行があった場合</li>
              <li>当社からの連絡に対し、一定期間返答がない場合</li>
              <li>本サービスについて、最終の利用から一定期間利用がない場合</li>
              <li>その他、本サービスの利用を適当でないと判断した場合</li>
            </ul>

            <h2>第7条（退会）</h2>
            <p>
              ユーザーは、当社の定める退会手続により、本サービスから退会できるものとします。
            </p>

            <h2>第8条（保証の否認および免責事項）</h2>
            <p>
              当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
            </p>

            <h2>第9条（サービス内容の変更等）</h2>
            <p>
              当社は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
            </p>

            <h2>第10条（利用規約の変更）</h2>
            <p>
              当社は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、本サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。
            </p>

            <h2>第11条（個人情報の取扱い）</h2>
            <p>
              当社は、本サービスの利用によって取得する個人情報については、当社「プライバシーポリシー」に従い適切に取り扱うものとします。
            </p>

            <h2>第12条（通知または連絡）</h2>
            <p>
              ユーザーと当社との間の通知または連絡は、当社の定める方法によって行うものとします。当社は、ユーザーから、当社が別途定める方式に従った変更届け出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは、発信時にユーザーへ到達したものとみなします。
            </p>

            <h2>第13条（権利義務の譲渡の禁止）</h2>
            <p>
              ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
            </p>

            <h2>第14条（準拠法・裁判管轄）</h2>
            <p>
              本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
            </p>

            <div className="mt-8 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">
                以上
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

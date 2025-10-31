'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { CreditCard, Building2, Repeat, CheckCircle, ArrowRight, Shield } from 'lucide-react'

export default function PaymentPage() {
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<'bank_transfer' | 'card' | 'direct_debit' | null>(null)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const paymentMethods = [
    {
      id: 'bank_transfer',
      name: '銀行振込',
      icon: Building2,
      description: '銀行口座への振込でお支払い',
      color: 'blue',
      processingTime: '1-3営業日',
      fee: '無料（振込手数料はお客様負担）'
    },
    {
      id: 'card',
      name: 'カード決済',
      icon: CreditCard,
      description: 'Square決済でクレジットカード払い',
      color: 'green',
      processingTime: '即時',
      fee: '3.25%'
    },
    {
      id: 'direct_debit',
      name: '口座振替',
      icon: Repeat,
      description: '会費ペイで自動引き落とし',
      color: 'purple',
      processingTime: '即時',
      fee: '無料'
    }
  ]

  const handlePayment = async () => {
    if (!selectedMethod || !amount) {
      setMessage('支払い方法と金額を入力してください')
      return
    }

    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setMessage('有効な金額を入力してください')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parsedAmount,
          paymentMethod: selectedMethod
        })
      })

      if (!response.ok) {
        throw new Error('決済の開始に失敗しました')
      }

      const data = await response.json()
      
      if (selectedMethod === 'bank_transfer') {
        setMessage('振込情報を下記にてご確認ください。振込完了後、処理に1-3営業日かかります。')
      } else if (selectedMethod === 'card') {
        if (data.data.paymentUrl) {
          window.location.href = data.data.paymentUrl
        } else {
          setMessage('Square決済ページへの移動準備中...')
        }
      } else if (selectedMethod === 'direct_debit') {
        if (data.data.paymentUrl) {
          window.location.href = data.data.paymentUrl
        } else {
          setMessage('会費ペイページへの移動準備中...')
        }
      }
    } catch (error) {
      console.error('Payment error:', error)
      setMessage('決済の開始に失敗しました。再度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">お支払い</h1>
          <p className="text-gray-600">ご利用いただける決済方法をお選びください</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-6">
            {/* 金額入力 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">お支払い金額</h2>
              <div className="relative max-w-md">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="10000"
                  min="1"
                  step="1"
                />
                <span className="absolute right-4 top-3.5 text-gray-500 text-lg">円</span>
              </div>
            </div>

            {/* 支払い方法選択 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">お支払い方法を選択</h2>
              <div className="space-y-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id as any)}
                      className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedMethod === method.id
                          ? `border-${method.color}-500 bg-${method.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-lg bg-${method.color}-100`}>
                            <Icon className={`w-6 h-6 text-${method.color}-600`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{method.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-gray-500">処理時間: {method.processingTime}</span>
                              <span className="text-xs text-gray-500">手数料: {method.fee}</span>
                            </div>
                          </div>
                        </div>
                        {selectedMethod === method.id && (
                          <CheckCircle className={`w-6 h-6 text-${method.color}-600`} />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* メッセージ表示 */}
            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes('失敗') ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-blue-50 border border-blue-200 text-blue-800'
              }`}>
                <p>{message}</p>
              </div>
            )}

            {/* 決済詳細情報 */}
            {selectedMethod === 'bank_transfer' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  振込先情報
                </h3>
                <div className="bg-white rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium text-gray-700">金融機関名：</span>
                    <span className="col-span-2 text-gray-900">相愛信用組合</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium text-gray-700">支店名：</span>
                    <span className="col-span-2 text-gray-900">本店営業部</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium text-gray-700">口座種別：</span>
                    <span className="col-span-2 text-gray-900">普通</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium text-gray-700">口座番号：</span>
                    <span className="col-span-2 text-gray-900 text-xl font-bold">0170074</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium text-gray-700">口座名義：</span>
                    <span className="col-span-2 text-gray-900">ド）シン ジャパン</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-100 rounded-md">
                  <p className="text-sm text-blue-900">
                    ⚠️ 振込手数料はお客様のご負担となります<br />
                    ⚠️ お振込み名義は必ず登録されている会社名でお願いします<br />
                    ⚠️ 振込完了後、処理に1-3営業日かかります
                  </p>
                </div>
              </div>
            )}

            {selectedMethod === 'card' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Square決済について
                </h3>
                <div className="space-y-3 text-green-800">
                  <p>✓ 各種クレジットカードがご利用いただけます</p>
                  <p className="ml-4 text-sm">（VISA、MasterCard、JCB、American Express、Diners Club）</p>
                  <p>✓ 安全なSquare決済システムを使用しています</p>
                  <p>✓ 決済完了後、即座に領収書が発行されます</p>
                  <p>✓ 手数料: 決済金額の3.25%</p>
                </div>
              </div>
            )}

            {selectedMethod === 'direct_debit' && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                  <Repeat className="w-5 h-5 mr-2" />
                  会費ペイについて
                </h3>
                <div className="space-y-3 text-purple-800">
                  <p>✓ 毎月自動で口座から引き落とされます</p>
                  <p>✓ 会費ペイのシステムを使用した安全な口座振替です</p>
                  <p>✓ 初回のみ口座情報の登録が必要です</p>
                  <p>✓ 手数料無料でご利用いただけます</p>
                </div>
              </div>
            )}

            {/* 支払いボタン */}
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                戻る
              </button>
              <button
                onClick={handlePayment}
                disabled={!selectedMethod || !amount || loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  '処理中...'
                ) : selectedMethod === 'bank_transfer' ? (
                  <>振込情報を確認</>
                ) : (
                  <>
                    お支払いへ進む
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* セキュリティ情報 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start">
                <Shield className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-green-900 mb-2">セキュアな決済</h3>
                  <p className="text-sm text-green-700">
                    すべての決済はSSL/TLS暗号化により保護されています。お客様の情報は安全に処理されます。
                  </p>
                </div>
              </div>
            </div>

            {/* お問い合わせ */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">お支払いについて</h3>
              <p className="text-sm text-gray-600 mb-4">
                決済に関するご質問やお困りのことがございましたら、お気軽にお問い合わせください。
              </p>
              <button
                onClick={() => router.push('/contact')}
                className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
              >
                お問い合わせ
              </button>
            </div>

            {/* 利用規約 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600">
                お支払いを行うことで、
                <a href="/terms" className="text-blue-600 hover:underline">利用規約</a>
                および
                <a href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</a>
                に同意したものとみなされます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

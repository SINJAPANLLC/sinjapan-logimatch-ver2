'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Shield, 
  TrendingUp, 
  BarChart3, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Star,
  Target,
  Award,
  FileText,
  Upload,
  Download
} from 'lucide-react'

export default function CreditInfoPage() {
  const [user, setUser] = useState<any>(null)
  const [creditScore, setCreditScore] = useState(85)
  const [creditHistory, setCreditHistory] = useState([
    { date: '2024-01-15', action: '取引完了', points: +5, description: '大型貨物配送完了' },
    { date: '2024-01-10', action: '支払い遅延', points: -10, description: '支払いが3日遅延' },
    { date: '2024-01-05', action: '取引完了', points: +3, description: '冷蔵貨物配送完了' },
    { date: '2023-12-28', action: '取引完了', points: +5, description: '急便配送完了' },
    { date: '2023-12-20', action: '評価向上', points: +2, description: '顧客からの高評価' }
  ])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const userProfile = JSON.parse(userData)
      setUser(userProfile)
    }
  }, [])

  const getCreditScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getCreditScoreLevel = (score: number) => {
    if (score >= 90) return '優秀'
    if (score >= 80) return '良好'
    if (score >= 70) return '普通'
    return '要改善'
  }

  const creditFactors = [
    { name: '支払い履歴', score: 95, weight: 35, description: '過去の支払い実績' },
    { name: '取引量', score: 80, weight: 25, description: '月間取引金額' },
    { name: 'レスポンス時間', score: 75, weight: 20, description: '平均応答時間' },
    { name: '完了率', score: 93, weight: 15, description: '取引完了率' },
    { name: 'ユーザー評価', score: 88, weight: 5, description: '取引相手からの評価' }
  ]

  const improvementTips = [
    '支払いを期日通りに行うことで信用スコアが向上します',
    '定期的な取引で取引量を増やすとスコアが上がります',
    '迅速なレスポンスで取引相手の信頼を獲得しましょう',
    '高品質なサービスでユーザー評価を向上させましょう',
    'プロフィール情報を充実させて信頼性を高めましょう'
  ]

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">信用情報</h1>
        <p className="text-gray-600">あなたの信用スコアと取引履歴を確認できます</p>
      </div>

      <div className="space-y-6">
        {/* 信用スコア概要 */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              信用スコア概要
            </h2>
          </div>
          <div className="p-6">
            <div className="text-center mb-6">
              <div className={`inline-flex items-center px-6 py-3 rounded-full text-2xl font-bold ${getCreditScoreColor(creditScore)}`}>
                {creditScore}点
              </div>
              <p className="text-sm text-gray-600 mt-2">
                レベル: {getCreditScoreLevel(creditScore)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">42</div>
                <div className="text-sm text-gray-600">完了取引数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-sm text-gray-600">完了率</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">4.2</div>
                <div className="text-sm text-gray-600">平均評価</div>
              </div>
            </div>
          </div>
        </div>

        {/* 信用スコア詳細 */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              信用スコア詳細
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {creditFactors.map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium text-gray-700">{factor.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({factor.weight}%)</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{factor.score}点</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${factor.score}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 取引履歴 */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              取引履歴
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {creditHistory.map((history, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      history.points > 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {history.points > 0 ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{history.action}</p>
                      <p className="text-xs text-gray-500">{history.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      history.points > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {history.points > 0 ? '+' : ''}{history.points}pt
                    </p>
                    <p className="text-xs text-gray-500">{history.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* スコア向上のヒント */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              スコア向上のヒント
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {improvementTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 証明書類アップロード */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              証明書類アップロード
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">証明書類をアップロードしてください</p>
                <p className="text-xs text-gray-500">事業許可証、運送事業許可証、保険証券など</p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  ファイルを選択
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">事業許可証</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">未アップロード</span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      アップロード
                    </button>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">運送事業許可証</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">未アップロード</span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      アップロード
                    </button>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">保険証券</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">未アップロード</span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      アップロード
                    </button>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">法人番号証明書</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">未アップロード</span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      アップロード
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}


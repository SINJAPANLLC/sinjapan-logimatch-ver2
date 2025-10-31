'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { MapPin, Navigation, Clock, TrendingUp, Route } from 'lucide-react'

export default function DistanceCalculatorPage() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null)
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null)

  const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ]

  const calculateDistance = () => {
    if (!origin || !destination) {
      alert('出発地と到着地を選択してください')
      return
    }

    if (origin === destination) {
      alert('出発地と到着地が同じです')
      return
    }

    const prefectureCoordinates: { [key: string]: { lat: number; lng: number } } = {
      '北海道': { lat: 43.06, lng: 141.35 }, '青森県': { lat: 40.82, lng: 140.74 },
      '岩手県': { lat: 39.70, lng: 141.15 }, '宮城県': { lat: 38.27, lng: 140.87 },
      '秋田県': { lat: 39.72, lng: 140.10 }, '山形県': { lat: 38.24, lng: 140.36 },
      '福島県': { lat: 37.75, lng: 140.47 }, '茨城県': { lat: 36.34, lng: 140.45 },
      '栃木県': { lat: 36.57, lng: 139.88 }, '群馬県': { lat: 36.39, lng: 139.06 },
      '埼玉県': { lat: 35.86, lng: 139.65 }, '千葉県': { lat: 35.61, lng: 140.12 },
      '東京都': { lat: 35.69, lng: 139.69 }, '神奈川県': { lat: 35.45, lng: 139.64 },
      '新潟県': { lat: 37.90, lng: 139.02 }, '富山県': { lat: 36.70, lng: 137.21 },
      '石川県': { lat: 36.59, lng: 136.63 }, '福井県': { lat: 36.07, lng: 136.22 },
      '山梨県': { lat: 35.66, lng: 138.57 }, '長野県': { lat: 36.65, lng: 138.18 },
      '岐阜県': { lat: 35.39, lng: 136.72 }, '静岡県': { lat: 34.98, lng: 138.38 },
      '愛知県': { lat: 35.18, lng: 136.91 }, '三重県': { lat: 34.73, lng: 136.51 },
      '滋賀県': { lat: 35.00, lng: 135.87 }, '京都府': { lat: 35.02, lng: 135.76 },
      '大阪府': { lat: 34.69, lng: 135.50 }, '兵庫県': { lat: 34.69, lng: 135.18 },
      '奈良県': { lat: 34.69, lng: 135.83 }, '和歌山県': { lat: 34.23, lng: 135.17 },
      '鳥取県': { lat: 35.50, lng: 134.24 }, '島根県': { lat: 35.47, lng: 133.05 },
      '岡山県': { lat: 34.66, lng: 133.92 }, '広島県': { lat: 34.40, lng: 132.46 },
      '山口県': { lat: 34.19, lng: 131.47 }, '徳島県': { lat: 34.07, lng: 134.56 },
      '香川県': { lat: 34.34, lng: 134.04 }, '愛媛県': { lat: 33.84, lng: 132.77 },
      '高知県': { lat: 33.56, lng: 133.53 }, '福岡県': { lat: 33.61, lng: 130.42 },
      '佐賀県': { lat: 33.25, lng: 130.30 }, '長崎県': { lat: 32.75, lng: 129.87 },
      '熊本県': { lat: 32.79, lng: 130.74 }, '大分県': { lat: 33.24, lng: 131.61 },
      '宮崎県': { lat: 31.91, lng: 131.42 }, '鹿児島県': { lat: 31.56, lng: 130.56 },
      '沖縄県': { lat: 26.21, lng: 127.68 }
    }

    const originCoord = prefectureCoordinates[origin]
    const destCoord = prefectureCoordinates[destination]

    if (!originCoord || !destCoord) {
      alert('座標データが見つかりませんでした')
      return
    }

    const R = 6371
    const dLat = (destCoord.lat - originCoord.lat) * Math.PI / 180
    const dLng = (destCoord.lng - originCoord.lng) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(originCoord.lat * Math.PI / 180) * Math.cos(destCoord.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = Math.round(R * c * 1.3)

    setCalculatedDistance(distance)
    setEstimatedTime(Math.round(distance / 60 * 10) / 10)
  }

  const resetForm = () => {
    setOrigin('')
    setDestination('')
    setCalculatedDistance(null)
    setEstimatedTime(null)
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">距離計算ツール</h1>
        <p className="text-gray-600">2地点間の最適ルートと距離を計算します</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1 text-green-600" />
                    出発地
                  </label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">都道府県を選択</option>
                    {prefectures.map(pref => (
                      <option key={pref} value={pref}>{pref}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1 text-red-600" />
                    到着地
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">都道府県を選択</option>
                    {prefectures.map(pref => (
                      <option key={pref} value={pref}>{pref}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={calculateDistance}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Navigation className="h-5 w-5" />
                  <span>距離を計算</span>
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  リセット
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Route className="h-5 w-5 mr-2 text-blue-600" />
              主要都市間距離の目安
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between items-center bg-white rounded-lg p-3">
                <span className="text-gray-700">東京 ↔ 大阪</span>
                <span className="font-semibold text-blue-600">約 515km</span>
              </div>
              <div className="flex justify-between items-center bg-white rounded-lg p-3">
                <span className="text-gray-700">東京 ↔ 福岡</span>
                <span className="font-semibold text-blue-600">約 1,090km</span>
              </div>
              <div className="flex justify-between items-center bg-white rounded-lg p-3">
                <span className="text-gray-700">東京 ↔ 札幌</span>
                <span className="font-semibold text-blue-600">約 1,150km</span>
              </div>
              <div className="flex justify-between items-center bg-white rounded-lg p-3">
                <span className="text-gray-700">大阪 ↔ 福岡</span>
                <span className="font-semibold text-blue-600">約 620km</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {calculatedDistance !== null ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Navigation className="h-5 w-5 mr-2" />
                  計算結果
                </h3>
                <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                  <div className="text-sm text-green-100 mb-1">総距離</div>
                  <div className="text-4xl font-bold">{calculatedDistance}km</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-green-100">出発地</span>
                    <span className="font-medium">{origin}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-100">到着地</span>
                    <span className="font-medium">{destination}</span>
                  </div>
                  <div className="h-px bg-white bg-opacity-20 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-100 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      推定時間
                    </span>
                    <span className="font-medium">{estimatedTime}時間</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  活用のヒント
                </h4>
                <ul className="text-xs text-purple-700 space-y-1">
                  <li>• 平均時速60kmで計算しています</li>
                  <li>• 実際の所要時間は交通状況により変動します</li>
                  <li>• 高速道路利用を想定しています</li>
                  <li>• 料金計算ツールと組み合わせて使用できます</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="text-center text-gray-500">
                <Navigation className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">出発地と到着地を選択して<br />「距離を計算」ボタンを<br />クリックしてください</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Calculator, DollarSign, Truck, Package, MapPin, ArrowRight, TrendingUp } from 'lucide-react'

export default function PriceCalculatorPage() {
  const [distance, setDistance] = useState('')
  const [weight, setWeight] = useState('')
  const [vehicleType, setVehicleType] = useState('SMALL_TRUCK')
  const [isExpress, setIsExpress] = useState(false)
  const [needsHelper, setNeedsHelper] = useState(false)
  const [needsLiftGate, setNeedsLiftGate] = useState(false)
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null)

  const vehicleTypes = [
    { value: 'LIGHT_TRUCK', label: '軽トラック', baseRate: 80 },
    { value: 'SMALL_TRUCK', label: '小型トラック (2t)', baseRate: 120 },
    { value: 'MEDIUM_TRUCK', label: '中型トラック (4t)', baseRate: 180 },
    { value: 'LARGE_TRUCK', label: '大型トラック (10t)', baseRate: 280 },
    { value: 'TRAILER', label: 'トレーラー', baseRate: 350 }
  ]

  const calculatePrice = () => {
    const distanceNum = parseFloat(distance)
    const weightNum = parseFloat(weight)

    if (!distanceNum || !weightNum) {
      alert('距離と重量を入力してください')
      return
    }

    const selectedVehicle = vehicleTypes.find(v => v.value === vehicleType)
    if (!selectedVehicle) return

    let basePrice = distanceNum * selectedVehicle.baseRate
    const weightSurcharge = weightNum > 500 ? (weightNum - 500) * 10 : 0
    const expressFee = isExpress ? basePrice * 0.3 : 0
    const helperFee = needsHelper ? 5000 : 0
    const liftGateFee = needsLiftGate ? 3000 : 0

    const totalPrice = Math.round(basePrice + weightSurcharge + expressFee + helperFee + liftGateFee)
    setCalculatedPrice(totalPrice)
  }

  const resetForm = () => {
    setDistance('')
    setWeight('')
    setVehicleType('SMALL_TRUCK')
    setIsExpress(false)
    setNeedsHelper(false)
    setNeedsLiftGate(false)
    setCalculatedPrice(null)
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">料金見積もり計算</h1>
        <p className="text-gray-600">距離、重量、車両タイプから運賃を自動計算します</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    配送距離 (km)
                  </label>
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 50"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Package className="h-4 w-4 inline mr-1" />
                    荷物重量 (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 300"
                    min="0"
                    step="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Truck className="h-4 w-4 inline mr-1" />
                  車両タイプ
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {vehicleTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} (¥{type.baseRate}/km)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">オプション</h3>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isExpress}
                    onChange={(e) => setIsExpress(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">特急便 (+30%)</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needsHelper}
                    onChange={(e) => setNeedsHelper(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">作業員付き (+¥5,000)</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needsLiftGate}
                    onChange={(e) => setNeedsLiftGate(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">リフトゲート (+¥3,000)</span>
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={calculatePrice}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Calculator className="h-5 w-5" />
                  <span>見積もり計算</span>
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
        </div>

        <div className="lg:col-span-1">
          {calculatedPrice !== null ? (
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                見積もり結果
              </h3>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                <div className="text-sm text-blue-100 mb-1">合計金額</div>
                <div className="text-4xl font-bold">¥{calculatedPrice.toLocaleString()}</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-100">距離</span>
                  <span>{distance}km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">重量</span>
                  <span>{weight}kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">車両</span>
                  <span>{vehicleTypes.find(v => v.value === vehicleType)?.label}</span>
                </div>
                {isExpress && (
                  <div className="flex justify-between text-yellow-200">
                    <span>特急便</span>
                    <span>+30%</span>
                  </div>
                )}
                {needsHelper && (
                  <div className="flex justify-between">
                    <span className="text-blue-100">作業員</span>
                    <span>+¥5,000</span>
                  </div>
                )}
                {needsLiftGate && (
                  <div className="flex justify-between">
                    <span className="text-blue-100">リフトゲート</span>
                    <span>+¥3,000</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="text-center text-gray-500">
                <Calculator className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">条件を入力して<br />「見積もり計算」ボタンを<br />クリックしてください</p>
              </div>
            </div>
          )}

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              料金体系について
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• 基本料金: 距離 × 車両タイプ別単価</li>
              <li>• 重量500kg超過分: ¥10/kg</li>
              <li>• 特急便: 基本料金の30%加算</li>
              <li>• 作業員: ¥5,000/名</li>
              <li>• リフトゲート: ¥3,000</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

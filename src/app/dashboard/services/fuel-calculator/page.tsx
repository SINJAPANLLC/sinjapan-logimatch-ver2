'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Fuel, DollarSign, Gauge, TrendingDown, AlertCircle } from 'lucide-react'

export default function FuelCalculatorPage() {
  const [distance, setDistance] = useState('')
  const [fuelEfficiency, setFuelEfficiency] = useState('')
  const [fuelPrice, setFuelPrice] = useState('150')
  const [calculatedFuelCost, setCalculatedFuelCost] = useState<number | null>(null)
  const [fuelConsumption, setFuelConsumption] = useState<number | null>(null)

  const vehiclePresets = [
    { type: '軽トラック', efficiency: 15 },
    { type: '小型トラック (2t)', efficiency: 10 },
    { type: '中型トラック (4t)', efficiency: 7 },
    { type: '大型トラック (10t)', efficiency: 5 },
    { type: 'トレーラー', efficiency: 4 }
  ]

  const calculateFuelCost = () => {
    const distanceNum = parseFloat(distance)
    const efficiencyNum = parseFloat(fuelEfficiency)
    const priceNum = parseFloat(fuelPrice)

    if (!distanceNum || !efficiencyNum || !priceNum) {
      alert('すべての項目を入力してください')
      return
    }

    const consumption = distanceNum / efficiencyNum
    const totalCost = Math.round(consumption * priceNum)

    setFuelConsumption(Math.round(consumption * 10) / 10)
    setCalculatedFuelCost(totalCost)
  }

  const resetForm = () => {
    setDistance('')
    setFuelEfficiency('')
    setFuelPrice('150')
    setCalculatedFuelCost(null)
    setFuelConsumption(null)
  }

  const applyPreset = (efficiency: number) => {
    setFuelEfficiency(efficiency.toString())
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">燃料費計算</h1>
        <p className="text-gray-600">走行距離と燃費から燃料コストを算出します</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  車両タイプから燃費を選択（任意）
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {vehiclePresets.map(preset => (
                    <button
                      key={preset.type}
                      onClick={() => applyPreset(preset.efficiency)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-500 transition-colors"
                    >
                      {preset.type}
                      <div className="text-xs text-gray-500 mt-1">{preset.efficiency}km/L</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Gauge className="h-4 w-4 inline mr-1" />
                    走行距離 (km)
                  </label>
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 500"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Fuel className="h-4 w-4 inline mr-1" />
                    燃費 (km/L)
                  </label>
                  <input
                    type="number"
                    value={fuelEfficiency}
                    onChange={(e) => setFuelEfficiency(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 10"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="h-4 w-4 inline mr-1" />
                    燃料単価 (円/L)
                  </label>
                  <input
                    type="number"
                    value={fuelPrice}
                    onChange={(e) => setFuelPrice(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 150"
                    min="0"
                    step="1"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={calculateFuelCost}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Fuel className="h-5 w-5" />
                  <span>燃料費を計算</span>
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

          <div className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
              燃料費削減のポイント
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                <span>急発進・急ブレーキを避ける</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                <span>適切なタイヤ空気圧を維持</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                <span>不要な荷物を降ろして軽量化</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                <span>定期的なメンテナンスを実施</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {calculatedFuelCost !== null ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Fuel className="h-5 w-5 mr-2" />
                  計算結果
                </h3>
                <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                  <div className="text-sm text-orange-100 mb-1">燃料費</div>
                  <div className="text-4xl font-bold">¥{calculatedFuelCost?.toLocaleString()}</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-orange-100">走行距離</span>
                    <span>{distance}km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-100">燃費</span>
                    <span>{fuelEfficiency}km/L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-100">燃料単価</span>
                    <span>¥{fuelPrice}/L</span>
                  </div>
                  <div className="h-px bg-white bg-opacity-20 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-100">燃料消費量</span>
                    <span className="font-medium">{fuelConsumption}L</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center text-sm">
                  <TrendingDown className="h-4 w-4 mr-2" />
                  コスト削減シミュレーション
                </h4>
                <div className="space-y-2 text-xs text-green-700">
                  {fuelEfficiency && (
                    <>
                      <div className="flex justify-between items-center bg-white rounded p-2">
                        <span>燃費10%改善時</span>
                        <span className="font-semibold text-green-600">
                          ¥{Math.round(calculatedFuelCost * 0.9).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-white rounded p-2">
                        <span>燃費20%改善時</span>
                        <span className="font-semibold text-green-600">
                          ¥{Math.round(calculatedFuelCost * 0.8).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="text-center text-gray-500">
                <Fuel className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">条件を入力して<br />「燃料費を計算」ボタンを<br />クリックしてください</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Package, 
  MapPin, 
  Calendar, 
  Weight, 
  Truck, 
  DollarSign, 
  Save, 
  X,
  AlertCircle,
  CheckCircle2,
  Shield
} from 'lucide-react'

// 車両タイプのマッピング（日本語 → ENUM）
const VEHICLE_TYPE_MAP: Record<string, string> = {
  '軽トラック': 'LIGHT_TRUCK',
  '小型トラック': 'SMALL_TRUCK',
  '中型トラック': 'MEDIUM_TRUCK',
  '大型トラック': 'LARGE_TRUCK',
  'トレーラー': 'TRAILER',
  '冷凍車': 'REFRIGERATED',
  '冷蔵車': 'REFRIGERATED',
  '平ボディ': 'FLATBED',
  'ウイング車': 'WING',
}

export default function NewShipmentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isVerified, setIsVerified] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState('')
  
  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setVerificationStatus(userData.verificationStatus || 'PENDING')
      setIsVerified(userData.verificationStatus === 'APPROVED')
    }
  }, [])
  
  const [formData, setFormData] = useState({
    cargoName: '',
    cargoDescription: '',
    cargoWeight: '',
    cargoVolume: '',
    cargoValue: '',
    
    pickupPrefecture: '',
    pickupCity: '',
    pickupAddress: '',
    pickupPostalCode: '',
    pickupDate: '',
    pickupTimeFrom: '',
    pickupTimeTo: '',
    
    deliveryPrefecture: '',
    deliveryCity: '',
    deliveryAddress: '',
    deliveryPostalCode: '',
    deliveryDate: '',
    deliveryTimeFrom: '',
    deliveryTimeTo: '',
    
    requiredVehicleType: '',
    needsHelper: false,
    needsLiftGate: false,
    temperature: '',
    specialInstructions: '',
    budget: ''
  })

  const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ]

  const vehicleTypes = [
    '軽トラック', '小型トラック', '中型トラック', '大型トラック', 
    'トレーラー', '冷凍車', '冷蔵車', '平ボディ', 'ウイング車'
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 未承認チェック
    if (!isVerified) {
      setError('許可証が承認されるまで、荷物の登録はできません。')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('認証トークンが見つかりません')
      }

      // 車両タイプを日本語からENUMに変換
      const vehicleTypeEnum = VEHICLE_TYPE_MAP[formData.requiredVehicleType]
      if (!vehicleTypeEnum) {
        throw new Error('車両タイプを選択してください')
      }

      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cargoName: formData.cargoName,
          cargoDescription: formData.cargoDescription || undefined,
          cargoWeight: parseFloat(formData.cargoWeight),
          cargoVolume: formData.cargoVolume ? parseFloat(formData.cargoVolume) : undefined,
          cargoValue: formData.cargoValue ? parseFloat(formData.cargoValue) : undefined,
          
          pickupAddress: formData.pickupAddress,
          pickupCity: formData.pickupCity,
          pickupPrefecture: formData.pickupPrefecture,
          pickupPostalCode: formData.pickupPostalCode,
          pickupDate: formData.pickupDate,
          pickupTimeFrom: formData.pickupTimeFrom || undefined,
          pickupTimeTo: formData.pickupTimeTo || undefined,
          
          deliveryAddress: formData.deliveryAddress,
          deliveryCity: formData.deliveryCity,
          deliveryPrefecture: formData.deliveryPrefecture,
          deliveryPostalCode: formData.deliveryPostalCode,
          deliveryDate: formData.deliveryDate,
          deliveryTimeFrom: formData.deliveryTimeFrom || undefined,
          deliveryTimeTo: formData.deliveryTimeTo || undefined,
          
          requiredVehicleType: vehicleTypeEnum,
          needsHelper: formData.needsHelper,
          needsLiftGate: formData.needsLiftGate,
          temperature: formData.temperature || undefined,
          specialInstructions: formData.specialInstructions || undefined,
          
          budget: parseFloat(formData.budget)
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '荷物の登録に失敗しました')
      }

      setSuccess('荷物が正常に登録されました！')
      
      // 2秒後にリダイレクト
      setTimeout(() => {
        router.push('/dashboard/my-shipments')
      }, 2000)
      
    } catch (error: any) {
      console.error('Error creating shipment:', error)
      setError(error.message || '荷物の登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">荷物登録</h1>
        <p className="text-gray-600">新しい荷物を登録してください</p>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start animate-fade-in">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">エラーが発生しました</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError('')}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* 成功メッセージ */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-green-800">成功</h3>
            <p className="text-sm text-green-700 mt-1">{success}</p>
          </div>
        </div>
      )}

      {/* 未承認警告 */}
      {!isVerified && (
        <div className="mb-6 bg-yellow-50 border border-yellow-300 rounded-lg p-4 flex items-start">
          <Shield className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-800">許可証の承認が必要です</h3>
            <p className="text-sm text-yellow-700 mt-1">
              {verificationStatus === 'PENDING' 
                ? '許可証の審査が完了するまで、荷物の登録はできません。許可証ページで必要書類を提出してください。'
                : '許可証が却下されています。許可証ページで再提出してください。'}
            </p>
            <button
              onClick={() => router.push('/dashboard/verification')}
              className="mt-2 text-sm text-yellow-800 underline hover:text-yellow-900"
            >
              許可証ページへ移動 →
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本情報 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2" />
            基本情報
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                荷物名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.cargoName}
                onChange={(e) => handleInputChange('cargoName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 精密機械部品"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">荷物説明</label>
              <textarea
                value={formData.cargoDescription}
                onChange={(e) => handleInputChange('cargoDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="荷物の詳細を入力してください"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                重量 (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.cargoWeight}
                onChange={(e) => handleInputChange('cargoWeight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 1000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">容積 (m³)</label>
              <input
                type="number"
                step="0.01"
                value={formData.cargoVolume}
                onChange={(e) => handleInputChange('cargoVolume', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">荷物価格 (円)</label>
              <input
                type="number"
                step="1"
                value={formData.cargoValue}
                onChange={(e) => handleInputChange('cargoValue', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 500000"
              />
            </div>
          </div>
        </div>

        {/* 出発地情報 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            出発地情報
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                郵便番号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.pickupPostalCode}
                onChange={(e) => handleInputChange('pickupPostalCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 100-0001"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                都道府県 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.pickupPrefecture}
                onChange={(e) => handleInputChange('pickupPrefecture', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">選択してください</option>
                {prefectures.map(pref => (
                  <option key={pref} value={pref}>{pref}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                市区町村 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.pickupCity}
                onChange={(e) => handleInputChange('pickupCity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 千代田区"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                住所 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.pickupAddress}
                onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 千代田1-1-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                集荷日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.pickupDate}
                onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">集荷時間帯</label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  value={formData.pickupTimeFrom}
                  onChange={(e) => handleInputChange('pickupTimeFrom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="開始時間"
                />
                <input
                  type="time"
                  value={formData.pickupTimeTo}
                  onChange={(e) => handleInputChange('pickupTimeTo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="終了時間"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 配送先情報 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            配送先情報
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                郵便番号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.deliveryPostalCode}
                onChange={(e) => handleInputChange('deliveryPostalCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 150-0001"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                都道府県 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.deliveryPrefecture}
                onChange={(e) => handleInputChange('deliveryPrefecture', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">選択してください</option>
                {prefectures.map(pref => (
                  <option key={pref} value={pref}>{pref}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                市区町村 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.deliveryCity}
                onChange={(e) => handleInputChange('deliveryCity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 渋谷区"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                住所 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.deliveryAddress}
                onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 渋谷1-1-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                配送日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">配送時間帯</label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  value={formData.deliveryTimeFrom}
                  onChange={(e) => handleInputChange('deliveryTimeFrom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="開始時間"
                />
                <input
                  type="time"
                  value={formData.deliveryTimeTo}
                  onChange={(e) => handleInputChange('deliveryTimeTo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="終了時間"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 配送条件 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Truck className="h-5 w-5 mr-2" />
            配送条件
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                必要車両タイプ <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.requiredVehicleType}
                onChange={(e) => handleInputChange('requiredVehicleType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">選択してください</option>
                {vehicleTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">温度管理</label>
              <input
                type="text"
                value={formData.temperature}
                onChange={(e) => handleInputChange('temperature', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: -5℃〜5℃"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">追加オプション</label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.needsHelper}
                    onChange={(e) => handleInputChange('needsHelper', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">荷役作業員が必要</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.needsLiftGate}
                    onChange={(e) => handleInputChange('needsLiftGate', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">パワーゲートが必要</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">特記事項</label>
              <textarea
                value={formData.specialInstructions}
                onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="その他の要望や注意事項を入力してください"
              />
            </div>
          </div>
        </div>

        {/* 予算 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            予算
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                予算 (円) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="1"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 50000"
                required
              />
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard/my-shipments')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            disabled={loading}
          >
            <X className="h-4 w-4 mr-2" />
            キャンセル
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                登録中...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                登録する
              </>
            )}
          </button>
        </div>
      </form>
    </DashboardLayout>
  )
}

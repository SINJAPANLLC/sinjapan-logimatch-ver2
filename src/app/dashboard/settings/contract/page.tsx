'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Upload,
  Edit,
  Save,
  X,
  Clock,
  Shield,
  User
} from 'lucide-react'

interface Contract {
  id: string
  contractType: string
  contractNumber: string
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'pending' | 'terminated'
  monthlyFee: number
  paymentMethod: string
  autoRenewal: boolean
  terms: string
  specialConditions: string
  contactPerson: string
  lastUpdated: string
}

export default function ContractPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [editingContract, setEditingContract] = useState<Contract | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    contractType: '',
    contractNumber: '',
    startDate: '',
    endDate: '',
    status: 'active' as 'active' | 'expired' | 'pending' | 'terminated',
    monthlyFee: '',
    paymentMethod: '',
    autoRenewal: false,
    terms: '',
    specialConditions: '',
    contactPerson: ''
  })

  useEffect(() => {
    loadContracts()
  }, [])

  const loadContracts = async () => {
    // サンプルデータ
    const sampleContracts: Contract[] = [
      {
        id: '1',
        contractType: '基本プラン',
        contractNumber: 'CNT-2024-001',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'active',
        monthlyFee: 50000,
        paymentMethod: 'クレジットカード',
        autoRenewal: true,
        terms: '月額利用料金に基づく基本サービス契約',
        specialConditions: '大型貨物輸送の割引適用',
        contactPerson: '田中太郎',
        lastUpdated: '2024-01-15'
      },
      {
        id: '2',
        contractType: 'プレミアムプラン',
        contractNumber: 'CNT-2024-002',
        startDate: '2024-02-01',
        endDate: '2025-01-31',
        status: 'active',
        monthlyFee: 100000,
        paymentMethod: '銀行振込',
        autoRenewal: true,
        terms: 'プレミアム機能を含む包括的サービス契約',
        specialConditions: '24時間サポート、優先マッチング',
        contactPerson: '佐藤花子',
        lastUpdated: '2024-01-20'
      }
    ]

    setContracts(sampleContracts)
  }

  const handleAddContract = () => {
    setFormData({
      contractType: '',
      contractNumber: '',
      startDate: '',
      endDate: '',
      status: 'active',
      monthlyFee: '',
      paymentMethod: '',
      autoRenewal: false,
      terms: '',
      specialConditions: '',
      contactPerson: ''
    })
    setEditingContract(null)
    setShowAddModal(true)
  }

  const handleEditContract = (contract: Contract) => {
    setFormData({
      contractType: contract.contractType,
      contractNumber: contract.contractNumber,
      startDate: contract.startDate,
      endDate: contract.endDate,
      status: contract.status,
      monthlyFee: contract.monthlyFee.toString(),
      paymentMethod: contract.paymentMethod,
      autoRenewal: contract.autoRenewal,
      terms: contract.terms,
      specialConditions: contract.specialConditions,
      contactPerson: contract.contactPerson
    })
    setEditingContract(contract)
    setShowAddModal(true)
  }

  const handleSaveContract = () => {
    if (editingContract) {
      // 編集
      setContracts(prev => prev.map(contract => 
        contract.id === editingContract.id 
          ? { ...contract, ...formData, monthlyFee: parseFloat(formData.monthlyFee), lastUpdated: new Date().toISOString().split('T')[0] }
          : contract
      ))
    } else {
      // 新規追加
      const newContract: Contract = {
        id: Date.now().toString(),
        ...formData,
        monthlyFee: parseFloat(formData.monthlyFee),
        lastUpdated: new Date().toISOString().split('T')[0]
      }
      setContracts(prev => [...prev, newContract])
    }
    setShowAddModal(false)
    setEditingContract(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'expired': return 'text-red-600 bg-red-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'terminated': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '有効'
      case 'expired': return '期限切れ'
      case 'pending': return '承認待ち'
      case 'terminated': return '終了'
      default: return '不明'
    }
  }

  const contractTypes = [
    '基本プラン', 'スタンダードプラン', 'プレミアムプラン', 'エンタープライズプラン', 'カスタムプラン'
  ]

  const paymentMethods = [
    'クレジットカード', '銀行振込', '口座振替', '電子マネー', 'コンビニ払い'
  ]

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">契約内容</h1>
            <p className="text-gray-600">契約の詳細情報を管理できます</p>
          </div>
          <button
            onClick={handleAddContract}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>契約を追加</span>
          </button>
        </div>
      </div>

      {/* 契約一覧 */}
      <div className="space-y-6">
        {contracts.map((contract) => (
          <div key={contract.id} className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{contract.contractType}</h2>
                  <p className="text-sm text-gray-600">契約番号: {contract.contractNumber}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contract.status)}`}>
                    {getStatusText(contract.status)}
                  </span>
                  <button
                    onClick={() => handleEditContract(contract)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">契約期間</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-900">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      開始: {new Date(contract.startDate).toLocaleDateString('ja-JP')}
                    </p>
                    <p className="text-sm text-gray-900">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      終了: {new Date(contract.endDate).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">料金情報</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-900">
                      <DollarSign className="h-4 w-4 inline mr-1" />
                      月額料金: ¥{contract.monthlyFee.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-900">
                      支払い方法: {contract.paymentMethod}
                    </p>
                    <p className="text-sm text-gray-900">
                      自動更新: {contract.autoRenewal ? '有効' : '無効'}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">連絡先</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-900">
                      <User className="h-4 w-4 inline mr-1" />
                      担当者: {contract.contactPerson}
                    </p>
                    <p className="text-sm text-gray-900">
                      <Clock className="h-4 w-4 inline mr-1" />
                      最終更新: {new Date(contract.lastUpdated).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">契約条件</h3>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{contract.terms}</p>
                </div>

                {contract.specialConditions && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">特別条件</h3>
                    <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded-lg">{contract.specialConditions}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>契約書をダウンロード</span>
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>契約書をアップロード</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 追加・編集モーダル */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingContract ? '契約を編集' : '契約を追加'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingContract(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">契約タイプ *</label>
                  <select
                    value={formData.contractType}
                    onChange={(e) => setFormData(prev => ({ ...prev, contractType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">選択してください</option>
                    {contractTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">契約番号 *</label>
                  <input
                    type="text"
                    required
                    value={formData.contractNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, contractNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="CNT-2024-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">開始日 *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">終了日 *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ステータス *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">有効</option>
                    <option value="expired">期限切れ</option>
                    <option value="pending">承認待ち</option>
                    <option value="terminated">終了</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">月額料金 (円) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthlyFee: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">支払い方法 *</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">選択してください</option>
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">担当者 *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="田中太郎"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">自動更新</label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.autoRenewal}
                    onChange={(e) => setFormData(prev => ({ ...prev, autoRenewal: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">自動更新を有効にする</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">契約条件 *</label>
                <textarea
                  required
                  value={formData.terms}
                  onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="契約の詳細条件を記載してください"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">特別条件</label>
                <textarea
                  value={formData.specialConditions}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialConditions: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="特別な条件や特記事項があれば記載してください"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingContract(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleSaveContract}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{editingContract ? '更新' : '追加'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}


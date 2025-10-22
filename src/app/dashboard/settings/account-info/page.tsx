'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Building2, 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Shield,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react'

interface AccountInfo {
  id: string
  accountType: 'bank' | 'credit_card' | 'digital_wallet'
  accountName: string
  accountNumber: string
  bankName?: string
  branchName?: string
  accountHolderName: string
  isDefault: boolean
  isVerified: boolean
  addedDate: string
  lastUsed?: string
}

export default function AccountInfoPage() {
  const [accounts, setAccounts] = useState<AccountInfo[]>([])
  const [editingAccount, setEditingAccount] = useState<AccountInfo | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAccountNumber, setShowAccountNumber] = useState<{ [key: string]: boolean }>({})
  const [formData, setFormData] = useState({
    accountType: 'bank' as 'bank' | 'credit_card' | 'digital_wallet',
    accountName: '',
    accountNumber: '',
    bankName: '',
    branchName: '',
    accountHolderName: '',
    isDefault: false
  })

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    // サンプルデータ
    const sampleAccounts: AccountInfo[] = [
      {
        id: '1',
        accountType: 'bank',
        accountName: 'メイン口座',
        accountNumber: '1234567',
        bankName: '三菱UFJ銀行',
        branchName: '品川支店',
        accountHolderName: '株式会社サンプル',
        isDefault: true,
        isVerified: true,
        addedDate: '2024-01-01',
        lastUsed: '2024-01-15'
      },
      {
        id: '2',
        accountType: 'credit_card',
        accountName: '法人カード',
        accountNumber: '****-****-****-1234',
        accountHolderName: '株式会社サンプル',
        isDefault: false,
        isVerified: true,
        addedDate: '2024-01-05',
        lastUsed: '2024-01-14'
      },
      {
        id: '3',
        accountType: 'digital_wallet',
        accountName: 'PayPay',
        accountNumber: 'paypay@example.com',
        accountHolderName: '株式会社サンプル',
        isDefault: false,
        isVerified: false,
        addedDate: '2024-01-10'
      }
    ]

    setAccounts(sampleAccounts)
  }

  const handleAddAccount = () => {
    setFormData({
      accountType: 'bank',
      accountName: '',
      accountNumber: '',
      bankName: '',
      branchName: '',
      accountHolderName: '',
      isDefault: false
    })
    setEditingAccount(null)
    setShowAddModal(true)
  }

  const handleEditAccount = (account: AccountInfo) => {
    setFormData({
      accountType: account.accountType,
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      bankName: account.bankName || '',
      branchName: account.branchName || '',
      accountHolderName: account.accountHolderName,
      isDefault: account.isDefault
    })
    setEditingAccount(account)
    setShowAddModal(true)
  }

  const handleSaveAccount = () => {
    if (editingAccount) {
      // 編集
      setAccounts(prev => prev.map(account => 
        account.id === editingAccount.id 
          ? { ...account, ...formData, isVerified: account.isVerified, addedDate: account.addedDate, lastUsed: account.lastUsed }
          : account
      ))
    } else {
      // 新規追加
      const newAccount: AccountInfo = {
        id: Date.now().toString(),
        ...formData,
        isVerified: false,
        addedDate: new Date().toISOString().split('T')[0]
      }
      setAccounts(prev => [...prev, newAccount])
    }
    setShowAddModal(false)
    setEditingAccount(null)
  }

  const handleDeleteAccount = (accountId: string) => {
    if (confirm('この口座情報を削除しますか？')) {
      setAccounts(prev => prev.filter(account => account.id !== accountId))
    }
  }

  const handleSetDefault = (accountId: string) => {
    setAccounts(prev => prev.map(account => ({
      ...account,
      isDefault: account.id === accountId
    })))
  }

  const toggleAccountNumberVisibility = (accountId: string) => {
    setShowAccountNumber(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }))
  }

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'bank': return <Building2 className="h-5 w-5" />
      case 'credit_card': return <CreditCard className="h-5 w-5" />
      case 'digital_wallet': return <Shield className="h-5 w-5" />
      default: return <Building2 className="h-5 w-5" />
    }
  }

  const getAccountTypeText = (type: string) => {
    switch (type) {
      case 'bank': return '銀行口座'
      case 'credit_card': return 'クレジットカード'
      case 'digital_wallet': return '電子マネー'
      default: return '不明'
    }
  }

  const maskAccountNumber = (accountNumber: string, type: string) => {
    if (type === 'credit_card') {
      return accountNumber
    }
    if (type === 'digital_wallet') {
      return accountNumber
    }
    return '****' + accountNumber.slice(-4)
  }

  const banks = [
    '三菱UFJ銀行', '三井住友銀行', 'みずほ銀行', 'りそな銀行', '楽天銀行', '住信SBIネット銀行', 'その他'
  ]

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">口座情報</h1>
            <p className="text-gray-600">支払い用の口座情報を管理できます</p>
          </div>
          <button
            onClick={handleAddAccount}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>口座を追加</span>
          </button>
        </div>
      </div>

      {/* 口座一覧 */}
      <div className="space-y-6">
        {accounts.map((account) => (
          <div key={account.id} className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="text-blue-600">
                    {getAccountTypeIcon(account.accountType)}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{account.accountName}</h2>
                    <p className="text-sm text-gray-600">{getAccountTypeText(account.accountType)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {account.isDefault && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      デフォルト
                    </span>
                  )}
                  {account.isVerified ? (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>認証済み</span>
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>未認証</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">口座情報</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">口座番号:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900 font-mono">
                          {showAccountNumber[account.id] ? account.accountNumber : maskAccountNumber(account.accountNumber, account.accountType)}
                        </span>
                        <button
                          onClick={() => toggleAccountNumberVisibility(account.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showAccountNumber[account.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    {account.bankName && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">銀行名:</span>
                        <span className="text-sm text-gray-900">{account.bankName}</span>
                      </div>
                    )}
                    {account.branchName && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">支店名:</span>
                        <span className="text-sm text-gray-900">{account.branchName}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">口座名義:</span>
                      <span className="text-sm text-gray-900">{account.accountHolderName}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">利用状況</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">追加日:</span>
                      <span className="text-sm text-gray-900">{new Date(account.addedDate).toLocaleDateString('ja-JP')}</span>
                    </div>
                    {account.lastUsed && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">最終利用:</span>
                        <span className="text-sm text-gray-900">{new Date(account.lastUsed).toLocaleDateString('ja-JP')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                {!account.isDefault && (
                  <button
                    onClick={() => handleSetDefault(account.id)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    デフォルトに設定
                  </button>
                )}
                <button
                  onClick={() => handleEditAccount(account)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>編集</span>
                </button>
                <button
                  onClick={() => handleDeleteAccount(account.id)}
                  className="px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>削除</span>
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
                  {editingAccount ? '口座を編集' : '口座を追加'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingAccount(null)
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">口座タイプ *</label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountType: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="bank">銀行口座</option>
                    <option value="credit_card">クレジットカード</option>
                    <option value="digital_wallet">電子マネー</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">口座名 *</label>
                  <input
                    type="text"
                    required
                    value={formData.accountName}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="メイン口座"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">口座番号/カード番号 *</label>
                  <input
                    type="text"
                    required
                    value={formData.accountNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1234567 または 1234-5678-9012-3456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">口座名義 *</label>
                  <input
                    type="text"
                    required
                    value={formData.accountHolderName}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountHolderName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="株式会社サンプル"
                  />
                </div>

                {formData.accountType === 'bank' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">銀行名 *</label>
                      <select
                        value={formData.bankName}
                        onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">選択してください</option>
                        {banks.map(bank => (
                          <option key={bank} value={bank}>{bank}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">支店名 *</label>
                      <input
                        type="text"
                        required
                        value={formData.branchName}
                        onChange={(e) => setFormData(prev => ({ ...prev, branchName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="品川支店"
                      />
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">デフォルト口座に設定する</span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingAccount(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleSaveAccount}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{editingAccount ? '更新' : '追加'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}


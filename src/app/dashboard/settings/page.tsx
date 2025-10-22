'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Settings, 
  ChevronUp, 
  ChevronDown, 
  Building2, 
  User, 
  CreditCard, 
  FileText, 
  Mail, 
  DollarSign,
  Users,
  Bell,
  LogOut,
  Save,
  X,
  Edit
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('基本情報')
  const [expandedSections, setExpandedSections] = useState({
    '企業情報管理': true,
    'ユーザー管理': false
  })
  const [editing, setEditing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    // 基本情報
    contactPerson: '',
    email: '',
    phone: '',
    companyName: '',
    postalCode: '',
    address: '',
    
    // 詳細情報
    industry: '',
    establishedDate: '',
    capital: '',
    employeeCount: '',
    businessDescription: '',
    
    // 契約内容
    subscriptionPlan: '',
    contractStartDate: '',
    contractEndDate: '',
    
    // 口座情報
    bankName: '',
    branchName: '',
    accountType: '',
    accountNumber: '',
    accountHolder: '',
    
    // お支払い方法
    paymentMethod: '',
    billingAddress: '',
    
    // 請求書設定
    invoiceReceiptEmail: '',
    invoiceReceiptMethod: '',
    invoiceIssueMethod: '',
    invoiceCompanyName: '',
    
    // 経理担当者
    accountingPersonName: '',
    accountingPersonEmail: '',
    accountingPersonPhone: '',
    
    // メール通知
    emailNotificationShipment: true,
    emailNotificationOffer: true,
    emailNotificationMatching: true,
    emailNotificationMessage: true
  })

  useEffect(() => {
    const fetchSettings = async () => {
      const token = localStorage.getItem('token')
      if (!token) return
      
      try {
        const response = await fetch('/api/settings', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (response.ok) {
          const result = await response.json()
          const data = result.data
          setUser(data)
          setFormData({
            contactPerson: data.contactPerson || '',
            email: data.email || '',
            phone: data.phone || '',
            companyName: data.companyName || '',
            postalCode: data.postalCode || '',
            address: data.address || '',
            
            industry: data.industry || '',
            establishedDate: data.establishedDate ? data.establishedDate.split('T')[0] : '',
            capital: data.capital || '',
            employeeCount: data.employeeCount || '',
            businessDescription: data.businessDescription || '',
            
            subscriptionPlan: data.subscriptionPlan || '',
            contractStartDate: data.contractStartDate ? data.contractStartDate.split('T')[0] : '',
            contractEndDate: data.contractEndDate ? data.contractEndDate.split('T')[0] : '',
            
            bankName: data.bankName || '',
            branchName: data.branchName || '',
            accountType: data.accountType || '',
            accountNumber: data.accountNumber || '',
            accountHolder: data.accountHolder || '',
            
            paymentMethod: data.paymentMethod || '',
            billingAddress: data.billingAddress || '',
            
            invoiceReceiptEmail: data.invoiceReceiptEmail || '',
            invoiceReceiptMethod: data.invoiceReceiptMethod || '',
            invoiceIssueMethod: data.invoiceIssueMethod || '',
            invoiceCompanyName: data.invoiceCompanyName || '',
            
            accountingPersonName: data.accountingPersonName || '',
            accountingPersonEmail: data.accountingPersonEmail || '',
            accountingPersonPhone: data.accountingPersonPhone || '',
            
            emailNotificationShipment: data.emailNotificationShipment ?? true,
            emailNotificationOffer: data.emailNotificationOffer ?? true,
            emailNotificationMatching: data.emailNotificationMatching ?? true,
            emailNotificationMessage: data.emailNotificationMessage ?? true
          })
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }
    
    fetchSettings()
  }, [])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }))
  }

  const handleEdit = () => {
    setEditing(true)
  }

  const handleCancel = () => {
    setEditing(false)
    if (user) {
      setFormData({
        contactPerson: user.contactPerson || '',
        email: user.email || '',
        phone: user.phone || '',
        companyName: user.companyName || '',
        postalCode: user.postalCode || '',
        address: user.address || '',
        
        industry: user.industry || '',
        establishedDate: user.establishedDate ? user.establishedDate.split('T')[0] : '',
        capital: user.capital || '',
        employeeCount: user.employeeCount || '',
        businessDescription: user.businessDescription || '',
        
        subscriptionPlan: user.subscriptionPlan || '',
        contractStartDate: user.contractStartDate ? user.contractStartDate.split('T')[0] : '',
        contractEndDate: user.contractEndDate ? user.contractEndDate.split('T')[0] : '',
        
        bankName: user.bankName || '',
        branchName: user.branchName || '',
        accountType: user.accountType || '',
        accountNumber: user.accountNumber || '',
        accountHolder: user.accountHolder || '',
        
        paymentMethod: user.paymentMethod || '',
        billingAddress: user.billingAddress || '',
        
        invoiceReceiptEmail: user.invoiceReceiptEmail || '',
        invoiceReceiptMethod: user.invoiceReceiptMethod || '',
        invoiceIssueMethod: user.invoiceIssueMethod || '',
        invoiceCompanyName: user.invoiceCompanyName || '',
        
        accountingPersonName: user.accountingPersonName || '',
        accountingPersonEmail: user.accountingPersonEmail || '',
        accountingPersonPhone: user.accountingPersonPhone || '',
        
        emailNotificationShipment: user.emailNotificationShipment ?? true,
        emailNotificationOffer: user.emailNotificationOffer ?? true,
        emailNotificationMatching: user.emailNotificationMatching ?? true,
        emailNotificationMessage: user.emailNotificationMessage ?? true
      })
    }
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to update settings')
      }

      // 保存後、最新の設定を再取得
      const getResponse = await fetch('/api/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (getResponse.ok) {
        const result = await getResponse.json()
        const updatedUser = result.data
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        // formDataも最新の状態に更新
        setFormData({
          contactPerson: updatedUser.contactPerson || '',
          email: updatedUser.email || '',
          phone: updatedUser.phone || '',
          companyName: updatedUser.companyName || '',
          postalCode: updatedUser.postalCode || '',
          address: updatedUser.address || '',
          
          industry: updatedUser.industry || '',
          establishedDate: updatedUser.establishedDate ? updatedUser.establishedDate.split('T')[0] : '',
          capital: updatedUser.capital || '',
          employeeCount: updatedUser.employeeCount || '',
          businessDescription: updatedUser.businessDescription || '',
          
          subscriptionPlan: updatedUser.subscriptionPlan || '',
          contractStartDate: updatedUser.contractStartDate ? updatedUser.contractStartDate.split('T')[0] : '',
          contractEndDate: updatedUser.contractEndDate ? updatedUser.contractEndDate.split('T')[0] : '',
          
          bankName: updatedUser.bankName || '',
          branchName: updatedUser.branchName || '',
          accountType: updatedUser.accountType || '',
          accountNumber: updatedUser.accountNumber || '',
          accountHolder: updatedUser.accountHolder || '',
          
          paymentMethod: updatedUser.paymentMethod || '',
          billingAddress: updatedUser.billingAddress || '',
          
          invoiceReceiptEmail: updatedUser.invoiceReceiptEmail || '',
          invoiceReceiptMethod: updatedUser.invoiceReceiptMethod || '',
          invoiceIssueMethod: updatedUser.invoiceIssueMethod || '',
          invoiceCompanyName: updatedUser.invoiceCompanyName || '',
          
          accountingPersonName: updatedUser.accountingPersonName || '',
          accountingPersonEmail: updatedUser.accountingPersonEmail || '',
          accountingPersonPhone: updatedUser.accountingPersonPhone || '',
          
          emailNotificationShipment: updatedUser.emailNotificationShipment ?? true,
          emailNotificationOffer: updatedUser.emailNotificationOffer ?? true,
          emailNotificationMatching: updatedUser.emailNotificationMatching ?? true,
          emailNotificationMessage: updatedUser.emailNotificationMessage ?? true
        })
      } else {
        throw new Error('Failed to refresh settings')
      }
      
      setEditing(false)
      alert('設定を保存しました')
    } catch (error) {
      console.error('Error updating settings:', error)
      alert('設定の更新に失敗しました')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const menuItems = [
    {
      section: '企業情報管理',
      icon: Building2,
      items: [
        { id: '基本情報', label: '基本情報' },
        { id: '詳細情報', label: '詳細情報' },
        { id: '信用情報', label: '信用情報' },
        { id: '契約内容', label: '契約内容' },
        { id: '口座情報', label: '口座情報' },
        { id: 'お支払い方法', label: 'お支払い方法' },
        { id: '請求書受領設定', label: '請求書受領設定' },
        { id: '請求書発行設定', label: '請求書発行設定' },
        { id: '経理担当者', label: '経理担当者' }
      ]
    },
    {
      section: 'ユーザー管理',
      icon: Users,
      items: [
        { id: 'メール受信設定', label: 'メール受信設定' },
        { id: 'ご利用金額', label: 'ご利用金額' },
        { id: 'ログアウト', label: 'ログアウト', isLogout: true }
      ]
    }
  ]

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <p className="text-gray-600">アカウント設定を管理できます</p>
      </div>

      <div className="flex gap-6">
        {/* サイドメニュー */}
        <div className="w-64 bg-white rounded-lg shadow-sm border">
          <div className="p-4">
            {menuItems.map((section) => (
              <div key={section.section} className="mb-4">
                <button
                  onClick={() => toggleSection(section.section)}
                  className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <section.icon className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="font-medium text-gray-900">{section.section}</span>
                  </div>
                  {expandedSections[section.section as keyof typeof expandedSections] ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                
                {expandedSections[section.section as keyof typeof expandedSections] && (
                  <div className="ml-6 mt-2 space-y-1">
                    {section.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.isLogout) {
                            handleLogout()
                          } else {
                            setActiveSection(item.id)
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeSection === item.id
                            ? 'bg-green-50 text-green-800 border-r-2 border-green-600'
                            : item.isLogout
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {item.isLogout && <LogOut className="h-4 w-4 inline mr-2" />}
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">{activeSection}</h2>
              {activeSection !== '信用情報' && activeSection !== 'ご利用金額' && (
                <div className="flex space-x-2">
                  {editing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>保存</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center space-x-2"
                      >
                        <X className="h-4 w-4" />
                        <span>キャンセル</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEdit}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>編集</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6">
            {activeSection === '基本情報' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">会社名</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="会社名を入力してください"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.companyName || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">担当者名</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="担当者名を入力してください"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.contactPerson || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="メールアドレスを入力してください"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.email || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">電話番号</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="電話番号を入力してください"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.phone || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">郵便番号</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="郵便番号を入力してください"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.postalCode || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">住所</label>
                  {editing ? (
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="住所を入力してください"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.address || '未設定'}</p>
                  )}
                </div>
              </div>
            )}

            {activeSection === '詳細情報' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">業種</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="例: 物流業"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.industry || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">設立日</label>
                  {editing ? (
                    <input
                      type="date"
                      value={formData.establishedDate}
                      onChange={(e) => handleInputChange('establishedDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.establishedDate || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">資本金（円）</label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.capital}
                      onChange={(e) => handleInputChange('capital', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="10000000"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.capital ? `¥${Number(formData.capital).toLocaleString()}` : '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">従業員数（人）</label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.employeeCount}
                      onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="50"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.employeeCount ? `${formData.employeeCount}人` : '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">事業内容</label>
                  {editing ? (
                    <textarea
                      value={formData.businessDescription}
                      onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="事業内容を入力してください"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.businessDescription || '未設定'}</p>
                  )}
                </div>
              </div>
            )}

            {activeSection === '信用情報' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm">信用情報は認証システムによって管理されています。</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">認証ステータス</label>
                  <p className="text-gray-900">
                    {user?.verificationStatus === 'APPROVED' ? (
                      <span className="text-green-600">承認済み ✓</span>
                    ) : user?.verificationStatus === 'REJECTED' ? (
                      <span className="text-red-600">却下</span>
                    ) : (
                      <span className="text-yellow-600">審査中</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">信用スコア</label>
                  <p className="text-gray-900 text-2xl font-bold">{user?.trustScore?.toFixed(1) || '5.0'} / 5.0</p>
                </div>
                <button
                  onClick={() => router.push('/dashboard/verification')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  認証管理ページへ
                </button>
              </div>
            )}

            {activeSection === '契約内容' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">契約プラン</label>
                  {editing ? (
                    <select
                      value={formData.subscriptionPlan}
                      onChange={(e) => handleInputChange('subscriptionPlan', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">選択してください</option>
                      <option value="basic">ベーシック</option>
                      <option value="standard">スタンダード</option>
                      <option value="premium">プレミアム</option>
                      <option value="enterprise">エンタープライズ</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{formData.subscriptionPlan || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">契約開始日</label>
                  {editing ? (
                    <input
                      type="date"
                      value={formData.contractStartDate}
                      onChange={(e) => handleInputChange('contractStartDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.contractStartDate || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">契約終了日</label>
                  {editing ? (
                    <input
                      type="date"
                      value={formData.contractEndDate}
                      onChange={(e) => handleInputChange('contractEndDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.contractEndDate || '未設定'}</p>
                  )}
                </div>
              </div>
            )}

            {activeSection === '口座情報' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">銀行名</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="例: みずほ銀行"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.bankName || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">支店名</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.branchName}
                      onChange={(e) => handleInputChange('branchName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="例: 東京支店"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.branchName || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">口座種別</label>
                  {editing ? (
                    <select
                      value={formData.accountType}
                      onChange={(e) => handleInputChange('accountType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">選択してください</option>
                      <option value="普通">普通</option>
                      <option value="当座">当座</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{formData.accountType || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">口座番号</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="1234567"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.accountNumber || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">口座名義</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.accountHolder}
                      onChange={(e) => handleInputChange('accountHolder', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="カ）サンプルカイシャ"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.accountHolder || '未設定'}</p>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'お支払い方法' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">支払い方法</label>
                  {editing ? (
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">選択してください</option>
                      <option value="クレジットカード">クレジットカード</option>
                      <option value="銀行振込">銀行振込</option>
                      <option value="口座振替">口座振替</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{formData.paymentMethod || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">請求先住所</label>
                  {editing ? (
                    <textarea
                      value={formData.billingAddress}
                      onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="請求先住所を入力してください"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.billingAddress || '未設定'}</p>
                  )}
                </div>
              </div>
            )}

            {activeSection === '請求書受領設定' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">請求書受領メール</label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.invoiceReceiptEmail}
                      onChange={(e) => handleInputChange('invoiceReceiptEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="invoice@company.com"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.invoiceReceiptEmail || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">受領方法</label>
                  {editing ? (
                    <select
                      value={formData.invoiceReceiptMethod}
                      onChange={(e) => handleInputChange('invoiceReceiptMethod', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">選択してください</option>
                      <option value="メール">メール</option>
                      <option value="郵送">郵送</option>
                      <option value="システム内">システム内</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{formData.invoiceReceiptMethod || '未設定'}</p>
                  )}
                </div>
              </div>
            )}

            {activeSection === '請求書発行設定' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">発行方法</label>
                  {editing ? (
                    <select
                      value={formData.invoiceIssueMethod}
                      onChange={(e) => handleInputChange('invoiceIssueMethod', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">選択してください</option>
                      <option value="自動">自動発行</option>
                      <option value="手動">手動発行</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{formData.invoiceIssueMethod || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">請求書宛名</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.invoiceCompanyName}
                      onChange={(e) => handleInputChange('invoiceCompanyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="株式会社サンプル"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.invoiceCompanyName || '未設定'}</p>
                  )}
                </div>
              </div>
            )}

            {activeSection === '経理担当者' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">担当者名</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.accountingPersonName}
                      onChange={(e) => handleInputChange('accountingPersonName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="山田 太郎"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.accountingPersonName || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.accountingPersonEmail}
                      onChange={(e) => handleInputChange('accountingPersonEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="accounting@company.com"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.accountingPersonEmail || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">電話番号</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.accountingPersonPhone}
                      onChange={(e) => handleInputChange('accountingPersonPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="03-1234-5678"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.accountingPersonPhone || '未設定'}</p>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'メール受信設定' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-900">荷物関連通知</p>
                    <p className="text-sm text-gray-500">新しい荷物や配送状況の更新</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.emailNotificationShipment}
                      onChange={(e) => handleInputChange('emailNotificationShipment', e.target.checked)}
                      disabled={!editing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-900">オファー関連通知</p>
                    <p className="text-sm text-gray-500">新しいオファーや応答</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.emailNotificationOffer}
                      onChange={(e) => handleInputChange('emailNotificationOffer', e.target.checked)}
                      disabled={!editing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-900">マッチング通知</p>
                    <p className="text-sm text-gray-500">マッチング成立のお知らせ</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.emailNotificationMatching}
                      onChange={(e) => handleInputChange('emailNotificationMatching', e.target.checked)}
                      disabled={!editing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">メッセージ通知</p>
                    <p className="text-sm text-gray-500">新しいメッセージの受信</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.emailNotificationMessage}
                      onChange={(e) => handleInputChange('emailNotificationMessage', e.target.checked)}
                      disabled={!editing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            )}

            {activeSection === 'ご利用金額' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">今月のご利用金額</h3>
                  <p className="text-4xl font-bold text-blue-600">¥0</p>
                  <p className="text-sm text-gray-600 mt-2">2025年10月分</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">利用履歴</h4>
                  <p className="text-gray-500 text-center py-4">利用履歴はまだありません</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createCustomAdmin() {
  try {
    // ここで管理者情報を変更できます
    const email = process.env.ADMIN_EMAIL || 'admin@example.com'
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!'
    const companyName = process.env.ADMIN_COMPANY || 'SIN JAPAN'
    const contactPerson = process.env.ADMIN_NAME || 'Administrator'
    
    console.log(`📧 管理者作成中: ${email}`)
    
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // 既存のアカウントをチェック
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      console.log('⚠️  このメールアドレスは既に使用されています:', email)
      // 管理者権限を確認・更新
      if (!existingUser.isAdmin) {
        await prisma.user.update({
          where: { email },
          data: { 
            isAdmin: true,
            verificationStatus: 'APPROVED'
          }
        })
        console.log('✅ 管理者権限を付与しました')
      } else {
        console.log('✅ 既に管理者権限があります')
      }
      return
    }
    
    // 管理者アカウントを作成
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        userType: 'SHIPPER',
        companyName,
        contactPerson,
        phone: '000-0000-0000',
        isAdmin: true,
        verificationStatus: 'APPROVED',
        trustScore: 5.0
      }
    })
    
    console.log('✅ 管理者アカウントが作成されました:')
    console.log('   Email:', admin.email)
    console.log('   Company:', admin.companyName)
    console.log('   Admin:', admin.isAdmin)
    console.log('   ID:', admin.id)
    console.log('\n🔐 ログイン情報:')
    console.log('   Email:', email)
    console.log('   Password:', password)
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createCustomAdmin()

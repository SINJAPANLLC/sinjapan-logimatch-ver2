import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const email = 'info@sinjapan.jp'
    const password = 'Kazuya8008'
    
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // 既存のアカウントをチェック
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      console.log('✅ 管理者アカウントは既に存在します:', email)
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
      }
      return
    }
    
    // 管理者アカウントを作成
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        userType: 'SHIPPER',
        companyName: 'SIN JAPAN',
        contactPerson: 'Admin',
        phone: '000-0000-0000',
        isAdmin: true,
        verificationStatus: 'APPROVED',
        trustScore: 5.0
      }
    })
    
    console.log('✅ 管理者アカウントが作成されました:')
    console.log('   Email:', admin.email)
    console.log('   Admin:', admin.isAdmin)
    console.log('   ID:', admin.id)
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()

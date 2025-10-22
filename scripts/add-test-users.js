const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('テストアカウントを追加しています...')

  const hashedPassword = await bcrypt.hash('Kazuya8008', 10)

  // メインアカウントを追加
  const mainUser = await prisma.user.upsert({
    where: { email: 'info@sinjapan.jp' },
    update: {
      password: hashedPassword,
      companyName: '合同会社SIN JAPAN',
      contactPerson: '大谷 和哉',
    },
    create: {
      email: 'info@sinjapan.jp',
      password: hashedPassword,
      userType: 'ADMIN', // 管理者として設定
      companyName: '合同会社SIN JAPAN',
      contactPerson: '大谷 和哉',
      phone: '046-212-2325',
      postalCode: '243-0303',
      address: '神奈川県愛甲郡愛川町中津７２８７',
    },
  })

  console.log('✅ メインアカウントを追加しました:')
  console.log('   Email:', mainUser.email)
  console.log('   会社名:', mainUser.companyName)
  console.log('   担当者:', mainUser.contactPerson)

  // 運送会社アカウントも追加
  const carrier = await prisma.user.upsert({
    where: { email: 'carrier@sinjapan.jp' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'carrier@sinjapan.jp',
      password: hashedPassword,
      userType: 'CARRIER',
      companyName: 'SIN JAPAN運送株式会社',
      contactPerson: '佐藤 太郎',
      phone: '03-9876-5432',
      postalCode: '140-0001',
      address: '東京都品川区北品川1-1-1',
    },
  })

  console.log('\n✅ 運送会社アカウントを追加しました:')
  console.log('   Email:', carrier.email)
  console.log('   会社名:', carrier.companyName)
  console.log('   種別: 運送会社')

  console.log('\n=== アカウント情報 ===')
  console.log('\n【メインアカウント】')
  console.log('ID: info@sinjapan.jp')
  console.log('PASS: Kazuya8008')
  console.log('会社名: 合同会社SIN JAPAN')
  console.log('担当者: 大谷 和哉')
  console.log('\n【運送会社アカウント】')
  console.log('ID: carrier@sinjapan.jp')
  console.log('PASS: Kazuya8008')
}

main()
  .catch((e) => {
    console.error('エラーが発生しました:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


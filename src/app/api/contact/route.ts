import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      lastName,
      firstName,
      lastNameKana,
      firstNameKana,
      company,
      department,
      phone,
      email,
      contactMethod,
      message,
      newsletter
    } = body

    if (!lastName || !firstName || !lastNameKana || !firstNameKana || !phone || !email || !message) {
      return NextResponse.json(
        { success: false, error: '必須項目を入力してください' },
        { status: 400 }
      )
    }

    const emailContent = `
【新規お問い合わせ】

お名前: ${lastName} ${firstName}
フリガナ: ${lastNameKana} ${firstNameKana}
会社名: ${company || '未記入'}
部署・役職: ${department || '未記入'}
電話番号: ${phone}
メールアドレス: ${email}
希望連絡方法: ${contactMethod === 'email' ? 'メール' : contactMethod === 'phone' ? '電話' : '未選択'}
メルマガ登録: ${newsletter ? '希望する' : '希望しない'}

【お問い合わせ内容】
${message}

---
このメールは SIN JAPAN LOGI MATCH のお問い合わせフォームから送信されました。
    `.trim()

    const data = await resend.emails.send({
      from: 'SIN JAPAN LOGI MATCH <noreply@sinjapan.jp>',
      to: ['info@sinjapan.jp'],
      replyTo: email as string,
      subject: `【お問い合わせ】${lastName} ${firstName}様より`,
      text: emailContent,
    })

    return NextResponse.json({
      success: true,
      message: 'お問い合わせを送信しました',
      data
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, error: 'メール送信に失敗しました' },
      { status: 500 }
    )
  }
}

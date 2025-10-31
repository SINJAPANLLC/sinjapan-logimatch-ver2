import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { WebhooksHelper } from 'square'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-square-hmacsha256-signature')
    const body = await request.text()

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    const webhookSignatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY

    if (!webhookSignatureKey) {
      console.warn('SQUARE_WEBHOOK_SIGNATURE_KEY is not set. Webhook verification skipped.')
      return NextResponse.json({ error: 'Webhook signature key not configured' }, { status: 500 })
    }

    // Webhook署名を検証
    const isValid = WebhooksHelper.verifySignature({
      requestBody: body,
      signatureHeader: signature,
      signatureKey: webhookSignatureKey,
      notificationUrl: request.url
    })

    if (!isValid) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)

    // イベントタイプに応じて処理
    switch (event.type) {
      case 'payment.created':
      case 'payment.updated':
        const payment = event.data?.object?.payment
        
        if (payment) {
          // データベースの支払い情報を更新
          const existingPayment = await prisma.payment.findFirst({
            where: { transactionId: payment.id }
          })

          if (existingPayment) {
            await prisma.payment.update({
              where: { id: existingPayment.id },
              data: {
                paymentStatus: payment.status === 'COMPLETED' ? 'COMPLETED' : 
                               payment.status === 'FAILED' ? 'FAILED' : 
                               payment.status === 'CANCELED' ? 'FAILED' : 'PENDING',
                paidAt: payment.status === 'COMPLETED' ? new Date() : null,
                metadata: JSON.stringify({
                  ...JSON.parse(existingPayment.metadata || '{}'),
                  squareEventId: event.event_id,
                  squareEventType: event.type,
                  updatedAt: new Date().toISOString(),
                  status: payment.status,
                  receiptUrl: payment.receipt_url,
                })
              }
            })
            
            console.log(`Payment ${payment.id} updated:`, payment.status)
          }
        }
        break

      default:
        console.log(`Unhandled webhook event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Square webhook error:', error)
    return NextResponse.json({ 
      error: 'Webhook処理に失敗しました' 
    }, { status: 500 })
  }
}

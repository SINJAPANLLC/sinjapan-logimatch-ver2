import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 })
    }

    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.warn('STRIPE_WEBHOOK_SECRET is not set. Webhook verification skipped.')
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // イベントタイプに応じて処理
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // データベースの支払い情報を更新
        await prisma.payment.updateMany({
          where: { transactionId: paymentIntent.id },
          data: {
            paymentStatus: 'COMPLETED',
            paidAt: new Date(),
            metadata: JSON.stringify({
              ...JSON.parse((await prisma.payment.findFirst({
                where: { transactionId: paymentIntent.id }
              }))?.metadata || '{}'),
              stripeEventId: event.id,
              completedAt: new Date().toISOString(),
            })
          }
        })
        
        console.log('Payment succeeded:', paymentIntent.id)
        break

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object as Stripe.PaymentIntent
        
        await prisma.payment.updateMany({
          where: { transactionId: failedIntent.id },
          data: {
            paymentStatus: 'FAILED',
            metadata: JSON.stringify({
              stripeEventId: event.id,
              failedAt: new Date().toISOString(),
              error: failedIntent.last_payment_error?.message,
            })
          }
        })
        
        console.log('Payment failed:', failedIntent.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ 
      error: 'Webhook処理に失敗しました' 
    }, { status: 500 })
  }
}

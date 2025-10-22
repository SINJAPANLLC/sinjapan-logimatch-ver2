import Stripe from 'stripe'

// Stripe設定
export const getStripeInstance = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  
  if (!secretKey) {
    console.warn('STRIPE_SECRET_KEY is not set. Stripe payments will not work.')
    return null
  }

  return new Stripe(secretKey, {
    apiVersion: '2025-09-30.clover',
  })
}

export const stripe = getStripeInstance()

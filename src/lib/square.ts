import { SquareClient, SquareEnvironment } from 'square'

// Square クライアントを遅延初期化
export function getSquareClient() {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN
  const environment = process.env.SQUARE_ENVIRONMENT || 'sandbox'
  
  if (!accessToken) {
    console.warn('SQUARE_ACCESS_TOKEN is not set. Square payments will not work.')
    return null
  }

  return new SquareClient({
    token: accessToken,
    environment: environment === 'production' ? 'production' : 'sandbox',
  })
}

export const square = getSquareClient()

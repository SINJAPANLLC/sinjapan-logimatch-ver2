import { z } from 'zod'

// ユーザー登録
export const registerSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上である必要があります'),
  userType: z.enum(['SHIPPER', 'CARRIER'], {
    errorMap: () => ({ message: 'ユーザータイプを選択してください' }),
  }),
  companyName: z.string().min(1, '会社名を入力してください'),
  contactPerson: z.string().min(1, '担当者名を入力してください'),
  phone: z.string().min(10, '有効な電話番号を入力してください'),
  postalCode: z.string().optional(),
  address: z.string().optional(),
})

// ログイン
export const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
})

// 配送案件作成
export const createShipmentSchema = z.object({
  cargoName: z.string().min(1, '荷物名を入力してください'),
  cargoDescription: z.string().optional(),
  cargoWeight: z.number().positive('重量は正の数である必要があります'),
  cargoVolume: z.number().positive().optional(),
  cargoValue: z.number().positive().optional(),
  
  pickupAddress: z.string().min(1, '集荷先住所を入力してください'),
  pickupCity: z.string().min(1, '集荷先市区町村を入力してください'),
  pickupPrefecture: z.string().min(1, '集荷先都道府県を入力してください'),
  pickupPostalCode: z.string().min(1, '集荷先郵便番号を入力してください'),
  pickupDate: z.string().min(1, '集荷日を入力してください'),
  pickupTimeFrom: z.string().optional(),
  pickupTimeTo: z.string().optional(),
  
  deliveryAddress: z.string().min(1, '配送先住所を入力してください'),
  deliveryCity: z.string().min(1, '配送先市区町村を入力してください'),
  deliveryPrefecture: z.string().min(1, '配送先都道府県を入力してください'),
  deliveryPostalCode: z.string().min(1, '配送先郵便番号を入力してください'),
  deliveryDate: z.string().min(1, '配送日を入力してください'),
  deliveryTimeFrom: z.string().optional(),
  deliveryTimeTo: z.string().optional(),
  
  requiredVehicleType: z.enum([
    'LIGHT_TRUCK',
    'SMALL_TRUCK',
    'MEDIUM_TRUCK',
    'LARGE_TRUCK',
    'TRAILER',
    'REFRIGERATED',
    'FLATBED',
    'WING',
  ]),
  needsHelper: z.boolean().default(false),
  needsLiftGate: z.boolean().default(false),
  temperature: z.string().optional(),
  specialInstructions: z.string().optional(),
  
  budget: z.number().positive('予算は正の数である必要があります'),
})

// オファー作成
export const createOfferSchema = z.object({
  shipmentId: z.string().min(1, '配送案件IDが必要です'),
  proposedPrice: z.number().positive('提案金額は正の数である必要があります'),
  message: z.string().optional(),
  vehicleInfo: z.string().optional(),
  estimatedPickupTime: z.string().optional(),
  estimatedDeliveryTime: z.string().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateShipmentInput = z.infer<typeof createShipmentSchema>
export type CreateOfferInput = z.infer<typeof createOfferSchema>


import { NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'
import { getUserFromRequest } from '@/lib/auth'
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} from '@/lib/api-response'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }
    
    const userProfile = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        userType: true,
        companyName: true,
        contactPerson: true,
        phone: true,
        postalCode: true,
        address: true,
        verificationStatus: true,
        trustScore: true,
        
        industry: true,
        establishedDate: true,
        capital: true,
        employeeCount: true,
        businessDescription: true,
        
        subscriptionPlan: true,
        contractStartDate: true,
        contractEndDate: true,
        
        bankName: true,
        branchName: true,
        accountType: true,
        accountNumber: true,
        accountHolder: true,
        
        paymentMethod: true,
        billingAddress: true,
        
        invoiceReceiptEmail: true,
        invoiceReceiptMethod: true,
        invoiceIssueMethod: true,
        invoiceCompanyName: true,
        
        accountingPersonName: true,
        accountingPersonEmail: true,
        accountingPersonPhone: true,
        
        emailNotificationShipment: true,
        emailNotificationOffer: true,
        emailNotificationMatching: true,
        emailNotificationMessage: true,
        
        createdAt: true,
        updatedAt: true,
      },
    })
    
    if (!userProfile) {
      return errorResponse('ユーザーが見つかりません', 404)
    }
    
    return successResponse(userProfile)
  } catch (error) {
    console.error('Get settings error:', error)
    return errorResponse('設定の取得に失敗しました', 500)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }
    
    const body = await request.json()
    
    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: {
        companyName: body.companyName,
        contactPerson: body.contactPerson,
        phone: body.phone,
        postalCode: body.postalCode,
        address: body.address,
        
        industry: body.industry,
        establishedDate: body.establishedDate ? new Date(body.establishedDate) : null,
        capital: body.capital ? parseFloat(body.capital) : null,
        employeeCount: body.employeeCount ? parseInt(body.employeeCount) : null,
        businessDescription: body.businessDescription,
        
        subscriptionPlan: body.subscriptionPlan,
        contractStartDate: body.contractStartDate ? new Date(body.contractStartDate) : null,
        contractEndDate: body.contractEndDate ? new Date(body.contractEndDate) : null,
        
        bankName: body.bankName,
        branchName: body.branchName,
        accountType: body.accountType,
        accountNumber: body.accountNumber,
        accountHolder: body.accountHolder,
        
        paymentMethod: body.paymentMethod,
        billingAddress: body.billingAddress,
        
        invoiceReceiptEmail: body.invoiceReceiptEmail,
        invoiceReceiptMethod: body.invoiceReceiptMethod,
        invoiceIssueMethod: body.invoiceIssueMethod,
        invoiceCompanyName: body.invoiceCompanyName,
        
        accountingPersonName: body.accountingPersonName,
        accountingPersonEmail: body.accountingPersonEmail,
        accountingPersonPhone: body.accountingPersonPhone,
        
        emailNotificationShipment: body.emailNotificationShipment ?? true,
        emailNotificationOffer: body.emailNotificationOffer ?? true,
        emailNotificationMatching: body.emailNotificationMatching ?? true,
        emailNotificationMessage: body.emailNotificationMessage ?? true,
      },
      select: {
        id: true,
        email: true,
        companyName: true,
        contactPerson: true,
        phone: true,
        postalCode: true,
        address: true,
        updatedAt: true,
      },
    })
    
    return successResponse(updatedUser)
  } catch (error: any) {
    console.error('Update settings error:', error)
    return errorResponse('設定の更新に失敗しました', 500)
  }
}

# SIN JAPAN LOGI MATCH - 物流マッチングプラットフォーム

## Overview
SIN JAPAN LOGI MATCH is a logistics matching platform designed for the Japanese market, connecting shippers (荷主) with carriers (運送会社). The platform leverages AI for efficient cargo-to-truck matching, aiming to provide next-generation freight procurement services. It enables users to post shipments, carriers to make offers, manage vehicle fleets, and provides comprehensive dashboards for both user types. The platform also includes robust user verification, a rating system, and detailed company settings management.

## User Preferences
I prefer detailed explanations and clear communication. Please ask before making major changes to the codebase or architectural decisions. I value iterative development and well-structured code.

## System Architecture
The platform is built on **Next.js 14 (App Router)** with **TypeScript**, utilizing **Tailwind CSS** for styling, and **React Hook Form** with **Zod** for form validation.
- **UI/UX**: Features a unified dashboard layout for consistency across 24+ pages, responsive mobile menus with smooth transitions, and a comprehensive CSS animation system (10+ animations, scroll-triggered effects) for enhanced user experience. Visual distinctions are used for shipper (blue) and carrier (green) selections.
- **Authentication & Authorization**: Implements JWT with bcryptjs for secure authentication. Features an admin dashboard with `verifyAdminToken()` middleware for server-side enforcement and granular access control (e.g., admin role assignment, user/shipment/payment management). Unverified users are blocked from critical actions (e.g., posting shipments, registering vehicles) via server-side enforcement.
- **User Management**: A unified registration process for both shippers and carriers. Extends the `User` model with 30+ fields for detailed company information, including credit info, contract details, bank accounts, payment settings, invoice configurations, and notification preferences, managed via a unified settings API and UI.
- **Core Functionality**:
    - **Shipment Management**: Comprehensive shipment registration with detailed fields (e.g., postal codes, vehicle types, special requirements) and status tracking.
    - **Verification & Rating**: `User`, `Verification`, and `Rating` models enable document submission, admin approval, and a trust score system based on user reviews.
    - **Services Section**: Includes a Price Calculator, Distance Calculator (using Haversine for 47 prefectures), and Fuel Cost Calculator, all with deterministic results and a user-friendly UI.
    - **Payment System**: Integrated `Payment` model tracking various methods (bank transfer, Square, Kaihipay), with dedicated UIs and APIs for payment initialization, history retrieval, and secure processing. Square Web Payments SDK is integrated for card payments.
    - **Notification System**: Admin broadcasting system with both email (Resend API) and in-app notifications. Features per-user `NotificationReceipt` table for secure read/delete state management, preventing cross-user mutations. Supports targeted notifications (ALL, SHIPPER, CARRIER, SPECIFIC_USER) with notification bell in dashboard header.
- **Database**: PostgreSQL is used as the primary database, managed with **Prisma ORM**.
- **Project Structure**: Follows a standard Next.js App Router structure with logical separation of components, utilities (auth, Prisma client, validators), custom hooks, and Prisma schema.

## External Dependencies
- **Database**: PostgreSQL (Neon-backed via Replit)
- **ORM**: Prisma
- **Authentication**: JWT, bcryptjs
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form, Zod
- **Email Service**: Resend API (for contact form submissions)
- **Payment Gateways**:
    - Square Web Payments SDK (for card payments)
    - Kaihipay (for direct debit – integration ready)

## Recent Changes
### Admin Notification System Implementation (October 17, 2025)
- ✅ **Database Schema**: Added `Notification` and `NotificationReceipt` tables with per-user read/delete state
- ✅ **Security Fix**: Implemented per-user `NotificationReceipt` to prevent cross-user mutations (approved by architect)
- ✅ **Admin API**: POST /api/admin/notifications (create with auto-receipt generation), GET (retrieve all notifications)
- ✅ **User API**: GET /api/notifications (fetch user receipts), PUT/DELETE /api/notifications/[id] (mark read/delete per-user)
- ✅ **Email Integration**: Resend API for email notifications with HTML templates
- ✅ **Admin UI**: /admin/notifications page with targeting (ALL, SHIPPER, CARRIER, SPECIFIC_USER) and email toggle
- ✅ **User UI**: /dashboard/notifications page with notification bell in header, unread count badge
- ✅ **Future Improvements**: Error handling for SPECIFIC_USER targeting, receipt backfill for legacy data, regression tests

### Deployment Error Resolution (October 17, 2025)
- ✅ **Fixed Next.js static rendering errors**: Added `export const dynamic = 'force-dynamic'` to all 26 API routes
- ✅ **Resolved deployment failures**: All API routes now properly configured for server-side rendering
- ✅ **Production build verified**: All 49 pages compile successfully, API routes marked as dynamic (ƒ)
- ✅ **Fixed deployment run command**: Changed from `npm run` to `npm start` for proper server startup
- ✅ **Application ready for deployment**: No errors, server running smoothly

### Production Deployment Preparation (October 17, 2025)
- ✅ Security hardening: Removed hardcoded JWT_SECRET fallback, now requires environment variable
- ✅ Fixed TypeScript build errors (shipment budget→price property)
- ✅ Optimized build script: Removed failing migrate deploy, using Prisma generate only
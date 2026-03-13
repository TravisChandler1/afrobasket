# AfroBasket Email, User Accounts & Admin Dashboard Plan

## Overview
Add automated emails, simple user accounts, and admin dashboard for order management.

## Architecture

### 1. Email System
- **Provider**: Resend (free tier: 3,000 emails/month)
- **Emails sent**:
  - Order confirmation to customer
  - Order notification to admin
  - Order tracking updates

### 2. User System (Simplified)
- **Method**: Email + 6-digit OTP verification (no password required)
- **Storage**: LocalStorage for session, backend for persistent data
- **Features**:
  - Quick OTP login (enter email → receive code → enter code)
  - View order history
  - Re-order from previous orders
  - Saved cart items

### 3. Order Storage
- **Solution**: Airtable (free, easy admin access)
- **Alternative**: JSON file stored in backend
- **Fields**: Order ID, customer email, items, total, status, date

### 4. Admin Dashboard
- **Route**: `/admin` (protected with admin code)
- **Features**:
  - View all orders
  - Update order status
  - See order details
  - Mark orders as shipped/completed

## Implementation Steps

### Step 1: Email API Route
Create `/api/send-email` using Resend SDK
- Send order confirmation to customer
- Send notification to admin

### Step 2: Update Webhook
Modify `/api/webhooks.js` to:
- Store orders in Airtable
- Trigger admin email notification

### Step 3: Simple Auth
Create `/api/auth/send-otp` and `/api/auth/verify-otp`
- Generate 6-digit OTP
- Store user session in localStorage

### Step 4: User Components
- Login modal with email input
- OTP verification screen
- Order history page

### Step 5: Admin Dashboard
- Protected route with admin code
- Orders table with status management
- Order detail view

## Files to Create/Modify

### New Files:
- `api/send-email.js` - Email sending endpoint
- `api/auth/send-otp.js` - OTP generation
- `api/auth/verify-otp.js` - OTP verification
- `api/orders.js` - Order CRUD operations
- `src/components/AuthModal.js` - Login UI
- `src/components/OrderHistory.js` - User orders
- `src/components/AdminDashboard.js` - Admin panel

### Modify:
- `api/webhooks.js` - Add order storage + email triggers
- `src/App.js` - Add auth state and routing

## Environment Variables Needed
```
RESEND_API_KEY=re_...
ADMIN_EMAIL=admin@afrobasket.com
ADMIN_CODE=your-admin-code
AIRTABLE_API_KEY=...
AIRTABLE_BASE_ID=...
```

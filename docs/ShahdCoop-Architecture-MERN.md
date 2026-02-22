# ShahdCoop — Technical Architecture Document

**Project:** ShahdCoop Beekeeping E‑Commerce Platform
**Author:** Principal Architect, Vercel
**Date:** February 2026
**Version:** 2.0 — MERN Stack
**Stack:** Next.js 15 · MongoDB Atlas · Upstash Redis · Stripe · Vercel

---

## Executive Summary

ShahdCoop is a full‑featured e‑commerce platform for a Moroccan beekeeping cooperative selling honey, beeswax, propolis, royal jelly, and beekeeping equipment. The platform serves three distinct user personas — **Customers**, **Cooperative Members**, and **Admin Staff** — and must deliver a blazing‑fast, SEO‑rich, mobile‑first experience with enterprise‑grade admin tooling.

This document is the single source of truth for the complete frontend and full‑stack architecture: site map, user flows, data models, API surface, component inventory, page templates, stack recommendation, performance budgets, and SEO structure.

---

## 1. Site Map

```
shahdcoop.ma
│
├── / ................................. Homepage
├── /products ........................ Product Listing (Catalog)
│   ├── /products?category=honey ..... Filtered by Category
│   ├── /products?q=propolis ......... Search Results
│   └── /products/[slug] ............. Product Detail Page (PDP)
│
├── /categories ...................... All Categories Overview
│   └── /categories/[slug] ........... Category Landing Page
│
├── /cart ............................ Shopping Cart
├── /checkout ........................ Checkout Flow
│   ├── /checkout/shipping ........... Shipping Info
│   ├── /checkout/payment ............ Payment (Stripe Elements)
│   └── /checkout/confirmation ....... Order Confirmation
│
├── /account ......................... Account Dashboard
│   ├── /account/orders .............. Order History
│   │   └── /account/orders/[id] ..... Order Detail / Tracking
│   ├── /account/addresses ........... Saved Addresses
│   ├── /account/settings ............ Profile & Security (2FA)
│   ├── /account/wishlist ............ Wishlist / Favorites
│   └── /account/notifications ....... Notification Preferences
│
├── /auth
│   ├── /auth/login .................. Login (Email / OAuth)
│   ├── /auth/register ............... Registration
│   ├── /auth/forgot-password ........ Password Reset
│   ├── /auth/verify-email ........... Email Verification
│   └── /auth/2fa .................... Two‑Factor Auth Challenge
│
├── /member .......................... Cooperative Member Portal
│   ├── /member/dashboard ............ Member Dashboard
│   ├── /member/products ............. My Submitted Products
│   │   └── /member/products/new ..... Submit New Product
│   ├── /member/sales ................ Sales & Revenue Reports
│   └── /member/payouts .............. Payout History
│
├── /admin ........................... Admin Panel
│   ├── /admin/dashboard ............. Analytics Overview
│   ├── /admin/products .............. Product Management
│   │   ├── /admin/products/new ...... Add Product
│   │   └── /admin/products/[id] ..... Edit Product
│   ├── /admin/orders ................ Order Management
│   │   └── /admin/orders/[id] ....... Order Detail / Actions
│   ├── /admin/customers ............. Customer Management
│   │   └── /admin/customers/[id] .... Customer Profile
│   ├── /admin/members ............... Member Management
│   ├── /admin/inventory ............. Inventory / Stock
│   ├── /admin/categories ............ Category Management
│   ├── /admin/promotions ............ Coupons & Discounts
│   ├── /admin/notifications ......... Send Notifications
│   ├── /admin/reports ............... Reporting Suite
│   └── /admin/settings .............. Store Settings
│
├── /about ........................... About the Cooperative
├── /blog ............................ Blog / Bee Education
│   └── /blog/[slug] ................. Blog Post
├── /contact ......................... Contact Page
├── /faq ............................. FAQ / Help Center
├── /privacy ......................... Privacy Policy
├── /terms ........................... Terms of Service
└── /shipping-info ................... Shipping & Returns Policy
```

**Total: ~50 unique routes** across 5 route groups (public, auth, account, member, admin).

---

## 2. User Flows

### Flow A — Customer Purchase Journey

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  Homepage /  │───▶│  Browse or   │───▶│   Product    │
│  Search Bar  │    │  Category    │    │  Detail Page │
└─────────────┘    └──────────────┘    └──────┬──────┘
                                              │
                              ┌────────────────┤
                              ▼                ▼
                     ┌──────────────┐  ┌──────────────┐
                     │ Add to Cart  │  │ Add to       │
                     │  (toast)     │  │ Wishlist     │
                     └──────┬───────┘  └──────────────┘
                            ▼
                     ┌──────────────┐
                     │  View Cart   │
                     │  (update qty)│
                     └──────┬───────┘
                            ▼
                   ┌────────────────┐   Not logged in?
                   │   Checkout     │──────────────────┐
                   │   Shipping     │                  ▼
                   └───────┬────────┘          ┌──────────────┐
                           ▼                   │  Login /     │
                   ┌────────────────┐          │  Register    │
                   │  Stripe        │◀─────────└──────────────┘
                   │  Payment       │
                   └───────┬────────┘
                           ▼
                   ┌────────────────┐    ┌───────────────────┐
                   │  Confirmation  │───▶│ Email Receipt      │
                   │  + Thank You   │    │ + SMS + Push Notif │
                   └────────────────┘    └───────────────────┘
```

**Key Decisions:**

- **Guest checkout** is supported; account creation is offered post‑purchase with a single click (password‑less via magic link).
- **Cart persistence:** `localStorage` for guests → synced to MongoDB when authenticated. Merge strategy on login: keep the higher quantity for duplicate items.
- **Payment:** Stripe Payment Element (supports cards, Apple Pay, Google Pay). Stripe Checkout Session is created server‑side; confirmation uses Stripe webhooks, never client‑side confirmation alone.
- **Optimistic UX:** "Add to cart" immediately updates the UI badge via Zustand; server sync happens in the background.

---

### Flow B — Cooperative Member Product Submission

```
┌──────────────┐    ┌──────────────────┐    ┌───────────────────┐
│  Member      │───▶│  /member/        │───▶│  Fill Product     │
│  Login       │    │  dashboard       │    │  Submission Form  │
└──────────────┘    └──────────────────┘    └────────┬──────────┘
                                                     │
                                                     ▼
                                            ┌───────────────────┐
                                            │  Upload Images    │
                                            │  (Cloudinary),    │
                                            │  Set Price/Stock, │
                                            │  Choose Category  │
                                            └────────┬──────────┘
                                                     │
                                                     ▼
                                            ┌───────────────────┐
                                            │  Submit for       │
                                            │  Admin Review     │
                                            └────────┬──────────┘
                                                     │
                              ┌───────────────────────┤
                              ▼                       ▼
                     ┌──────────────┐       ┌──────────────────┐
                     │   Approved   │       │   Rejected       │
                     │  → Published │       │  → Feedback Note │
                     └──────────────┘       └──────────────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │  Track Sales on  │
                     │  /member/sales   │
                     └──────────────────┘
```

**Key Decisions:**

- Images upload directly to Cloudinary via unsigned upload preset from the browser (avoids routing large files through the API).
- Product status follows a state machine: `DRAFT → PENDING_REVIEW → ACTIVE | REJECTED → ARCHIVED`.
- Admin receives an in‑app + email notification when a new product is submitted. Member receives notification on approval or rejection.

---

### Flow C — Admin Order Fulfillment

```
┌──────────────┐    ┌───────────────────┐    ┌───────────────────┐
│  Admin       │───▶│  /admin/orders    │───▶│  Filter: Pending  │
│  Login + 2FA │    │  (all orders)     │    │  Orders           │
└──────────────┘    └───────────────────┘    └────────┬──────────┘
                                                      │
                                                      ▼
                                             ┌───────────────────┐
                                             │  Open Order       │
                                             │  Detail View      │
                                             └────────┬──────────┘
                                                      │
                          ┌───────────────────────────┬┘
                          ▼                           ▼
                 ┌──────────────────┐       ┌──────────────────┐
                 │  Verify Stock    │       │  Flag Issue      │
                 │  & Payment       │       │  (contact buyer) │
                 └────────┬─────────┘       └──────────────────┘
                          ▼
                 ┌──────────────────┐
                 │  Mark as         │
                 │  "Processing"    │
                 └────────┬─────────┘
                          ▼
                 ┌──────────────────┐    ┌──────────────────────┐
                 │  Assign Tracking │───▶│  Auto‑notify buyer   │
                 │  Number          │    │  via BullMQ job:     │
                 └────────┬─────────┘    │  email + SMS + push  │
                          ▼              └──────────────────────┘
                 ┌──────────────────┐
                 │  Mark as         │
                 │  "Shipped"       │
                 └────────┬─────────┘
                          ▼
                 ┌──────────────────┐
                 │  Delivered       │
                 │  (auto or manual)│
                 └──────────────────┘
```

**Key Decisions:**

- Order status transitions are enforced server‑side with a finite state machine: `PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED` (with `CANCELLED` and `REFUNDED` as terminal branches from any pre‑delivery state).
- Every status change dispatches a BullMQ job that fans out to the notification channels the customer has opted into.
- Admin real‑time: Server‑Sent Events (SSE) stream at `/api/admin/orders/stream` pushes new‑order and status‑change events. Backed by Upstash Redis Pub/Sub.

---

## 3. Data Models (MongoDB Schemas)

All models use Mongoose ODM. nanoid‑generated `publicId` values are used for public‑facing IDs; MongoDB `_id` (ObjectId) for internal references.

### 3.1 User

```javascript
{
  _id:              ObjectId,
  publicId:         String,       // nanoid, used in URLs / API
  email:            String,       // unique, lowercase, trimmed
  passwordHash:     String,       // nullable (OAuth users)
  name:             String,
  phone:            String,       // nullable
  role:             String,       // enum: "customer" | "member" | "admin"
  avatarUrl:        String,       // nullable, Cloudinary URL
  emailVerified:    Boolean,      // default: false
  twoFactor: {
    enabled:        Boolean,      // default: false
    secret:         String,       // TOTP secret, encrypted at rest
  },
  oauth: {
    provider:       String,       // "google" | "facebook" | null
    providerId:     String,
  },
  locale:           String,       // "fr" | "ar" | "en"
  notificationPrefs: {
    email:          Boolean,      // default: true
    sms:            Boolean,      // default: false
    push:           Boolean,      // default: false
    inApp:          Boolean,      // default: true
  },
  pushSubscriptions: [            // Web Push subscriptions
    {
      endpoint:     String,
      keys: {
        p256dh:     String,
        auth:       String,
      }
    }
  ],
  addresses:        [AddressSubdoc],
  wishlist:         [ObjectId],   // refs → Product
  stripeCustomerId: String,       // Stripe customer ID
  createdAt:        Date,
  updatedAt:        Date,
}

// AddressSubdoc (embedded)
{
  _id:              ObjectId,
  label:            String,       // "Home", "Work"
  fullName:         String,
  street:           String,
  city:             String,
  region:           String,
  postalCode:       String,
  country:          String,       // default: "MA"
  phone:            String,
  isDefault:        Boolean,
}

// Indexes
{ email: 1 }                      // unique
{ "oauth.provider": 1, "oauth.providerId": 1 }  // unique sparse
{ role: 1 }
{ stripeCustomerId: 1 }           // sparse
```

### 3.2 Product

```javascript
{
  _id:              ObjectId,
  slug:             String,       // unique, auto-generated from name
  name:             String,
  nameAr:           String,       // Arabic translation
  description:      String,       // markdown
  descriptionAr:    String,
  price:            Number,       // stored in centimes (MAD × 100)
  compareAtPrice:   Number,       // nullable, original price for sales
  currency:         String,       // default: "MAD"
  sku:              String,       // unique
  stock:            Number,       // default: 0
  lowStockThreshold: Number,      // default: 5
  weight:           Number,       // grams, nullable
  categoryId:       ObjectId,     // ref → Category
  memberId:         ObjectId,     // ref → User (submitter), nullable
  status:           String,       // enum: "draft" | "pending_review" |
                                  //       "active" | "rejected" | "archived"
  featured:         Boolean,      // default: false
  images: [
    {
      url:          String,       // Cloudinary URL
      publicId:     String,       // Cloudinary public_id for transforms
      alt:          String,
      width:        Number,
      height:       Number,
      position:     Number,       // sort order
    }
  ],
  specs: [                        // flexible key-value attributes
    { key: String, value: String }
  ],
  tags:             [String],
  seo: {
    metaTitle:      String,
    metaDescription: String,
  },
  rating: {
    average:        Number,       // denormalized, updated on review write
    count:          Number,
  },
  createdAt:        Date,
  updatedAt:        Date,
}

// Indexes
{ slug: 1 }                       // unique
{ sku: 1 }                        // unique
{ categoryId: 1, status: 1 }
{ status: 1, featured: -1, createdAt: -1 }
{ tags: 1 }
{ "$**": "text" }                 // text index on name, description, tags
```

### 3.3 Category

```javascript
{
  _id:              ObjectId,
  slug:             String,       // unique
  name:             String,
  nameAr:           String,
  description:      String,
  imageUrl:         String,       // Cloudinary
  parentId:         ObjectId,     // self-ref for nesting, nullable
  position:         Number,       // sort order
  productCount:     Number,       // denormalized counter
}

// Indexes
{ slug: 1 }                       // unique
{ parentId: 1, position: 1 }
```

### 3.4 Order

```javascript
{
  _id:              ObjectId,
  orderNumber:      String,       // unique, e.g. "SC-20260218-A3K9"
  userId:           ObjectId,     // ref → User, nullable (guest checkout)
  guestEmail:       String,       // nullable
  status:           String,       // enum: "pending" | "confirmed" |
                                  //       "processing" | "shipped" |
                                  //       "delivered" | "cancelled" | "refunded"
  items: [
    {
      productId:    ObjectId,     // ref → Product
      productSlug:  String,       // snapshot
      productName:  String,       // snapshot at order time
      productImage: String,       // snapshot
      quantity:     Number,
      unitPrice:    Number,       // centimes, snapshot
      totalPrice:   Number,       // centimes
    }
  ],
  subtotal:         Number,       // centimes
  shippingCost:     Number,       // centimes
  discountAmount:   Number,       // centimes, default: 0
  tax:              Number,       // centimes, default: 0
  total:            Number,       // centimes
  currency:         String,       // "MAD"

  payment: {
    method:         String,       // "stripe" | "cod"
    status:         String,       // "pending" | "paid" | "failed" | "refunded"
    stripePaymentIntentId: String,
    stripeSessionId: String,
    paidAt:         Date,
  },

  shipping: {
    address: {
      fullName:     String,
      street:       String,
      city:         String,
      region:       String,
      postalCode:   String,
      country:      String,
      phone:        String,
    },
    trackingNumber: String,       // nullable
    carrier:        String,       // "amana" | "ctm" | "chronopost" | null
    shippedAt:      Date,
    deliveredAt:    Date,
  },

  couponId:         ObjectId,     // ref → Coupon, nullable
  couponCode:       String,       // snapshot
  notes:            String,       // admin notes
  statusHistory: [
    {
      status:       String,
      changedBy:    ObjectId,     // ref → User (admin)
      changedAt:    Date,
      note:         String,
    }
  ],
  createdAt:        Date,
  updatedAt:        Date,
}

// Indexes
{ orderNumber: 1 }               // unique
{ userId: 1, createdAt: -1 }
{ status: 1, createdAt: -1 }
{ "payment.stripePaymentIntentId": 1 }  // sparse
{ guestEmail: 1 }                 // sparse
{ createdAt: -1 }
```

### 3.5 Cart (Server‑Side for Auth Users)

```javascript
{
  _id:              ObjectId,
  userId:           ObjectId,     // ref → User, unique
  items: [
    {
      productId:    ObjectId,
      quantity:     Number,
      addedAt:      Date,
    }
  ],
  couponCode:       String,       // nullable
  updatedAt:        Date,
}

// Indexes
{ userId: 1 }                     // unique
```

### 3.6 Coupon

```javascript
{
  _id:              ObjectId,
  code:             String,       // unique, uppercase
  type:             String,       // "percentage" | "fixed"
  value:            Number,       // percentage (0-100) or centimes
  minOrderAmount:   Number,       // centimes, nullable
  maxDiscountAmount: Number,      // centimes cap for %, nullable
  maxUses:          Number,       // nullable = unlimited
  currentUses:      Number,       // default: 0
  usedBy:           [ObjectId],   // track per-user usage
  perUserLimit:     Number,       // default: 1
  validFrom:        Date,
  validUntil:       Date,
  active:           Boolean,      // default: true
  applicableCategories: [ObjectId], // empty = all categories
  createdAt:        Date,
}

// Indexes
{ code: 1 }                       // unique
{ active: 1, validFrom: 1, validUntil: 1 }
```

### 3.7 Review

```javascript
{
  _id:              ObjectId,
  productId:        ObjectId,     // ref → Product
  userId:           ObjectId,     // ref → User
  orderId:          ObjectId,     // ref → Order (proves purchase)
  rating:           Number,       // 1-5
  title:            String,
  body:             String,
  verified:         Boolean,      // auto-set if orderId matches a delivered order
  helpful:          Number,       // upvote count, default: 0
  reported:         Boolean,      // flagged for moderation
  createdAt:        Date,
}

// Indexes
{ productId: 1, createdAt: -1 }
{ userId: 1, productId: 1 }      // unique (one review per product per user)
```

### 3.8 Notification

```javascript
{
  _id:              ObjectId,
  userId:           ObjectId,     // ref → User
  type:             String,       // "order_update" | "promo" | "stock_alert" |
                                  // "review_request" | "product_review" | "system"
  channel:          String,       // "email" | "sms" | "push" | "in_app"
  title:            String,
  body:             String,
  read:             Boolean,      // default: false (in_app only)
  actionUrl:        String,       // nullable, deep-link
  metadata:         Mixed,        // flexible: orderId, productId, etc.
  sentAt:           Date,
  readAt:           Date,         // nullable
}

// Indexes
{ userId: 1, channel: 1, read: 1, sentAt: -1 }
{ userId: 1, sentAt: -1 }
{ sentAt: 1, expireAfterSeconds: 7776000 }  // TTL: auto-delete after 90 days
```

### 3.9 BlogPost

```javascript
{
  _id:              ObjectId,
  slug:             String,       // unique
  title:            String,
  titleAr:          String,
  excerpt:          String,
  body:             String,       // MDX content
  coverImage:       String,       // Cloudinary URL
  authorId:         ObjectId,     // ref → User
  tags:             [String],
  published:        Boolean,      // default: false
  publishedAt:      Date,         // nullable
  readingTime:      Number,       // minutes, computed on save
  seo: {
    metaTitle:      String,
    metaDescription: String,
  },
  createdAt:        Date,
  updatedAt:        Date,
}

// Indexes
{ slug: 1 }                       // unique
{ published: 1, publishedAt: -1 }
{ tags: 1 }
```

### 3.10 MemberPayout

```javascript
{
  _id:              ObjectId,
  memberId:         ObjectId,     // ref → User
  amount:           Number,       // centimes
  currency:         String,       // "MAD"
  status:           String,       // "pending" | "processing" | "completed"
  periodStart:      Date,
  periodEnd:        Date,
  orderIds:         [ObjectId],   // refs → Order (orders included in this payout)
  notes:            String,
  createdAt:        Date,
  completedAt:      Date,
}

// Indexes
{ memberId: 1, createdAt: -1 }
{ status: 1 }
```

### 3.11 AuditLog

```javascript
{
  _id:              ObjectId,
  userId:           ObjectId,     // who performed the action
  action:           String,       // "order.status_changed", "product.approved", etc.
  resource:         String,       // "order" | "product" | "user" | "coupon"
  resourceId:       ObjectId,
  changes:          Mixed,        // { field: { from, to } }
  ip:               String,
  userAgent:        String,
  createdAt:        Date,
}

// Indexes
{ resource: 1, resourceId: 1, createdAt: -1 }
{ userId: 1, createdAt: -1 }
{ createdAt: 1, expireAfterSeconds: 31536000 }  // TTL: 365 days
```

### 3.12 Entity Relationship Summary

```
User ──1:N──▶ Order
User ──1:N──▶ Review
User ──1:N──▶ Notification
User ──1:N──▶ Product (as Member submitter)
User ──1:N──▶ MemberPayout
User ──1:1──▶ Cart
User ──embed─▶ Address[]
User ──embed─▶ Wishlist[] (Product refs)

Product ──N:1──▶ Category
Product ──embed─▶ ProductImage[]
Product ──1:N──▶ Review
Product ──1:N──▶ OrderItem (embedded in Order)

Order ──embed──▶ OrderItem[]
Order ──embed──▶ StatusHistory[]
Order ──N:1──▶ Coupon (optional)

Category ──self-ref──▶ Category (parentId for nesting)
```

---

## 4. API Requirements

### 4.1 API Design Philosophy

All API routes live inside the Next.js App Router under `/app/api/`. They are **server‑side Route Handlers** that connect directly to MongoDB Atlas via Mongoose. There is no separate backend service — this is a unified MERN deployment on Vercel.

**Conventions:**
- RESTful naming with JSON request/response bodies
- Zod validation on every endpoint (shared schemas between client and server)
- `publicId` (nanoid) exposed in URLs; internal `_id` never leaves the server
- Pagination via `?page=1&limit=20` with `Link` header for cursor‑based fallback
- Auth via NextAuth.js session (HTTP‑only cookie); admin routes check `role === "admin"`
- Rate limiting via Upstash Redis (`@upstash/ratelimit`)

### 4.2 Endpoint Map

#### Auth (`/api/auth/...` — NextAuth.js + custom routes)

| Method | Path | Description |
|--------|------|-------------|
| — | `/api/auth/[...nextauth]` | NextAuth.js catch‑all (login, callback, session, signout) |
| POST | `/api/auth/register` | Create account (name, email, password) |
| POST | `/api/auth/forgot-password` | Send reset link via Resend |
| POST | `/api/auth/reset-password` | Set new password with token |
| POST | `/api/auth/verify-email` | Confirm email with token |
| POST | `/api/auth/2fa/setup` | Generate TOTP secret + QR code |
| POST | `/api/auth/2fa/verify` | Validate TOTP code during login |
| POST | `/api/auth/2fa/disable` | Disable 2FA (requires current TOTP) |

#### Products (`/api/products/...`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | List with filters (`category`, `minPrice`, `maxPrice`, `rating`, `inStock`, `sort`, `page`) |
| GET | `/api/products/search` | Full‑text search via MongoDB text index (`?q=...`) |
| GET | `/api/products/featured` | Featured products (homepage) |
| GET | `/api/products/[slug]` | Single product with populated category + reviews |
| POST | `/api/products` | Create (admin/member) — requires auth |
| PATCH | `/api/products/[id]` | Update (admin/member‑owner) |
| DELETE | `/api/products/[id]` | Soft delete → status: "archived" (admin) |
| POST | `/api/products/[id]/images` | Upload to Cloudinary, save URLs |
| DELETE | `/api/products/[id]/images/[imageId]` | Remove image |

#### Reviews (`/api/reviews/...`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products/[slug]/reviews` | Paginated reviews for product |
| POST | `/api/products/[slug]/reviews` | Submit review (auth, verified purchase) |
| POST | `/api/reviews/[id]/helpful` | Upvote review |
| POST | `/api/reviews/[id]/report` | Flag review |

#### Categories (`/api/categories/...`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/categories` | List all with product counts |
| GET | `/api/categories/[slug]` | Single with populated products |
| POST | `/api/categories` | Create (admin) |
| PATCH | `/api/categories/[id]` | Update (admin) |
| DELETE | `/api/categories/[id]` | Delete if no products (admin) |

#### Cart (`/api/cart/...`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/cart` | Get authenticated user's cart |
| POST | `/api/cart/items` | Add item (productId, quantity) |
| PATCH | `/api/cart/items/[productId]` | Update quantity |
| DELETE | `/api/cart/items/[productId]` | Remove item |
| POST | `/api/cart/merge` | Merge guest cart on login |
| POST | `/api/cart/coupon` | Apply coupon code |
| DELETE | `/api/cart/coupon` | Remove coupon |

#### Checkout & Payment (`/api/checkout/...`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/checkout/calculate` | Calculate totals + shipping + tax |
| POST | `/api/checkout/session` | Create Stripe Checkout Session |
| POST | `/api/checkout/cod` | Create COD order directly |
| POST | `/api/webhooks/stripe` | Stripe webhook (payment confirmation, refunds) |

#### Orders (`/api/orders/...`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/orders` | User's order history |
| GET | `/api/orders/[id]` | Order detail (user sees own; admin sees all) |
| POST | `/api/orders/[id]/cancel` | Cancel order (user, pre‑shipment only) |

#### Notifications (`/api/notifications/...`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/notifications` | User's in‑app notifications |
| GET | `/api/notifications/stream` | SSE stream for real‑time |
| PATCH | `/api/notifications/[id]/read` | Mark as read |
| PATCH | `/api/notifications/read-all` | Mark all read |
| PUT | `/api/notifications/preferences` | Update channel preferences |
| POST | `/api/notifications/push-subscribe` | Register push subscription |

#### Admin (`/api/admin/...` — all require `role: "admin"`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/dashboard` | Aggregated KPIs (MongoDB aggregation pipeline) |
| GET | `/api/admin/orders` | All orders with filters |
| PATCH | `/api/admin/orders/[id]/status` | Update order status (triggers notifications) |
| POST | `/api/admin/orders/[id]/tracking` | Add tracking info |
| GET | `/api/admin/orders/stream` | SSE: new orders, status changes |
| GET | `/api/admin/customers` | Customer list + search |
| GET | `/api/admin/customers/[id]` | Customer detail + order history |
| GET | `/api/admin/inventory` | Low stock products |
| PATCH | `/api/admin/inventory/[productId]` | Update stock |
| PATCH | `/api/admin/products/[id]/review` | Approve or reject member submission |
| GET | `/api/admin/members` | Member list |
| POST | `/api/admin/notifications/broadcast` | Send mass notification |
| GET | `/api/admin/reports/sales` | Sales analytics data |
| GET | `/api/admin/reports/products` | Product performance |
| POST | `/api/admin/coupons` | Create coupon |
| PATCH | `/api/admin/coupons/[id]` | Update coupon |
| DELETE | `/api/admin/coupons/[id]` | Delete coupon |

#### Member (`/api/member/...` — requires `role: "member"`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/member/dashboard` | Member KPIs |
| GET | `/api/member/sales` | Sales breakdown by product |
| GET | `/api/member/payouts` | Payout history |
| POST | `/api/member/products` | Submit new product |
| PATCH | `/api/member/products/[id]` | Edit own product |

#### Blog (`/api/blog/...`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/blog` | List published posts |
| GET | `/api/blog/[slug]` | Single post |
| POST | `/api/blog` | Create (admin) |
| PATCH | `/api/blog/[id]` | Update (admin) |
| DELETE | `/api/blog/[id]` | Delete (admin) |

#### Wishlist (`/api/wishlist/...`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/wishlist` | Get user's wishlist (populated products) |
| POST | `/api/wishlist/[productId]` | Add to wishlist |
| DELETE | `/api/wishlist/[productId]` | Remove from wishlist |

### 4.3 Real‑Time Channels

| Channel | Tech | Events |
|---------|------|--------|
| Customer notifications | SSE `/api/notifications/stream` | `new_notification`, `order_update` |
| Admin live orders | SSE `/api/admin/orders/stream` | `new_order`, `status_change` |
| Stock alerts | SSE (admin) | `low_stock_warning` |

**Implementation:** Each SSE endpoint subscribes to an Upstash Redis channel. When a mutation occurs (e.g., new order), the Route Handler publishes to Redis. All connected SSE clients on that channel receive the event.

### 4.4 Background Jobs (BullMQ on Upstash Redis / Vercel QStash)

| Job | Trigger | Action |
|-----|---------|--------|
| `send-email` | Order placed, status change, auth events | Resend API call |
| `send-sms` | Order shipped, delivery | Twilio API call |
| `send-push` | Any notification | Firebase Cloud Messaging |
| `sync-search` | Product created/updated | Update text index (if using Atlas Search) |
| `calculate-payouts` | Cron (monthly) | Aggregate member sales → create MemberPayout |
| `cleanup-carts` | Cron (daily) | Remove abandoned guest carts > 30 days |
| `review-reminders` | Cron (daily) | Email customers 7 days post-delivery |
| `low-stock-check` | Cron (hourly) | Flag products below threshold |

**Deployment choice:** Use **BullMQ** with a persistent worker (e.g., on Railway or a small VM) for complex job orchestration with retries. Alternatively, use **Vercel QStash** if you want fully serverless: each job becomes an HTTP endpoint that QStash calls on a schedule or via publish — zero infrastructure to manage.

### 4.5 Third‑Party Integrations

| Service | Purpose | Integration Point |
|---------|---------|-------------------|
| **Stripe** | Payments (cards, Apple Pay, Google Pay) | Checkout Session + Webhooks |
| **Resend** (primary) / **SendGrid** (fallback) | Transactional email | BullMQ job → API call |
| **Twilio** | SMS notifications | BullMQ job → API call |
| **Firebase Cloud Messaging** | Web Push notifications | BullMQ job → API call |
| **Cloudinary** | Image storage + on‑the‑fly transforms | Direct browser upload + Next.js Image loader |
| **Google OAuth 2.0** | Social login | NextAuth.js provider |
| **Upstash Redis** | Cache, sessions, rate limiting, Pub/Sub, job queue | `@upstash/redis` SDK |
| **MongoDB Atlas** | Primary database | Mongoose ODM |
| **Sentry** | Error tracking + performance | `@sentry/nextjs` |
| **Vercel Analytics** | Web analytics + Web Vitals | Built‑in |

---

## 5. Component Inventory (58 Components)

### 5.1 Global / Layout Components

| # | Component | Props / Notes |
|---|-----------|---------------|
| 1 | `SiteHeader` | Logo, nav links, SearchBar, CartIcon w/ badge, UserMenu, responsive |
| 2 | `MobileNav` | Sheet/drawer with nav, categories accordion, account links |
| 3 | `SiteFooter` | Link columns, social icons, NewsletterForm, LocaleSwitcher |
| 4 | `SearchBar` | Debounced input → `/api/products/search`, autocomplete dropdown, keyboard navigation |
| 5 | `BreadcrumbNav` | Auto‑generated from URL segments, `schema.org/BreadcrumbList` JSON‑LD |
| 6 | `AnnouncementBar` | Dismissible banner (promos, free shipping), stored in cookie |
| 7 | `LocaleSwitcher` | FR / AR / EN toggle, sets `next-intl` locale |
| 8 | `NotificationBell` | Dropdown with badge count, SSE‑connected, mark‑as‑read on open |

### 5.2 Product Components

| # | Component | Props / Notes |
|---|-----------|---------------|
| 9 | `ProductCard` | Image (Cloudinary transform), name, price, StarRating, AddToCartButton. Hover: quick‑view. |
| 10 | `ProductGrid` | Responsive CSS Grid: 1 col mobile, 2 col tablet, 3–4 col desktop. Accepts `loading` for SkeletonLoader. |
| 11 | `ProductImageGallery` | Main image + thumbnail strip, pinch‑zoom on mobile, lightbox on desktop, Cloudinary `f_auto,q_auto` |
| 12 | `ProductInfo` | Name, price (with compareAtPrice strikethrough), stock badge, markdown description, specs table |
| 13 | `ProductReviews` | Review list + star histogram + paginated load‑more + WriteReviewForm |
| 14 | `StarRating` | Readonly mode (display) + interactive mode (form input), half‑star precision |
| 15 | `QuantitySelector` | ± buttons, manual input, clamped to [1, stock], debounced server sync for cart |
| 16 | `AddToCartButton` | Animated: idle → loading (spinner) → success (check) → idle. Zustand dispatch. |
| 17 | `CategoryCard` | Image + label + product count, link to `/categories/[slug]` |
| 18 | `ProductFilters` | Sidebar (desktop) / Sheet (mobile): price range slider, category checkboxes, rating filter, in‑stock toggle, sort select. URL‑synced via `nuqs`. |
| 19 | `PaginationBar` | Page numbers + prev/next, synced to `?page=` URL param |
| 20 | `WishlistButton` | Heart toggle, optimistic UI, login redirect if unauthenticated |

### 5.3 Cart & Checkout Components

| # | Component | Props / Notes |
|---|-----------|---------------|
| 21 | `CartDrawer` | Slide‑out sheet with CartItemRow list, OrderSummary, "Proceed to Checkout" CTA |
| 22 | `CartItemRow` | Product thumbnail, name (linked), QuantitySelector, remove button, line total |
| 23 | `OrderSummary` | Subtotal, shipping estimate, discount, tax, total — reused in cart + checkout |
| 24 | `CouponInput` | Code entry + "Apply" button, shows applied coupon with remove × |
| 25 | `ShippingForm` | React Hook Form: address fields + saved address selector + phone. Zod validation. |
| 26 | `PaymentSelector` | Stripe Payment Element (cards, Apple Pay, Google Pay) OR Cash on Delivery radio |
| 27 | `CheckoutStepper` | 3‑step indicator: Shipping → Payment → Confirmation. Clickable if completed. |
| 28 | `OrderConfirmation` | Success animation (Lottie), order number, summary, "Continue Shopping" + "Track Order" CTAs |

### 5.4 Auth Components

| # | Component | Props / Notes |
|---|-----------|---------------|
| 29 | `LoginForm` | Email/password inputs + "Remember me" + OAuthButtons. React Hook Form + Zod. |
| 30 | `RegisterForm` | Name, email, password (with PasswordStrengthMeter), phone (optional), terms checkbox |
| 31 | `OAuthButtons` | Google sign‑in button (NextAuth.js `signIn("google")`). Extensible for Facebook. |
| 32 | `TwoFactorInput` | 6‑digit OTP input: auto‑focus advance, paste support, auto‑submit on 6th digit |
| 33 | `PasswordStrengthMeter` | Real‑time bar using `zxcvbn` library |

### 5.5 Account Components

| # | Component | Props / Notes |
|---|-----------|---------------|
| 34 | `AccountSidebar` | Nav links for account sections, active state, responsive collapse |
| 35 | `OrderHistoryTable` | DataTable with columns: order#, date, status badge, total. Clickable rows. |
| 36 | `OrderTimeline` | Vertical stepper: Placed → Confirmed → Processing → Shipped → Delivered |
| 37 | `AddressCard` | Display mode + edit mode (inline form), delete with confirm, "Set as Default" |
| 38 | `NotificationPreferences` | Toggle matrix: rows = notification types, cols = channels (email/SMS/push/in‑app) |

### 5.6 Admin Components

| # | Component | Props / Notes |
|---|-----------|---------------|
| 39 | `AdminSidebar` | Collapsible nav with section icons, badge for pending orders / low stock |
| 40 | `DashboardKPICards` | 4 cards: Revenue (today/week/month), Orders, Customers, AOV. Trend arrows. |
| 41 | `SalesChart` | Recharts: Line chart (daily/weekly/monthly toggle), revenue + orders dual axis |
| 42 | `DataTable` | Generic: sortable columns, column visibility, search, pagination, row selection, bulk actions |
| 43 | `ProductForm` | Full create/edit: react-hook-form, image upload dropzone (Cloudinary), category select, specs builder, SEO preview |
| 44 | `OrderStatusSelect` | Dropdown with color‑coded options, confirmation dialog before status change |
| 45 | `InventoryAlertBadge` | Red (0) / Yellow (≤ threshold) / Green (above) stock indicator |
| 46 | `CustomerDetailPanel` | Customer info, lifetime value, order history, notes |
| 47 | `BroadcastNotificationForm` | Compose: title, body, target audience (all / segment), channels, schedule or send now |
| 48 | `ReportExportButton` | Export DataTable as CSV or generate PDF via jsPDF |

### 5.7 Content / Shared Components

| # | Component | Props / Notes |
|---|-----------|---------------|
| 49 | `HeroBanner` | Full‑width Cloudinary image + H1 + subtitle + CTA buttons. `priority` on Next Image. |
| 50 | `TestimonialCarousel` | Embla Carousel with customer quotes, avatars, auto‑play, pause on hover |
| 51 | `BlogPostCard` | Cover image, title, excerpt, author, date, reading time. Link to `/blog/[slug]`. |
| 52 | `NewsletterForm` | Email input + subscribe CTA. Server action → Resend audience list. |
| 53 | `FAQAccordion` | Radix Accordion, `schema.org/FAQPage` JSON‑LD injected |
| 54 | `Toast` | Sonner toasts: success / error / info. Used globally via Zustand. |
| 55 | `ConfirmDialog` | Radix AlertDialog: title, description, confirm (destructive variant) / cancel |
| 56 | `EmptyState` | Illustration + message + CTA. Variants: empty cart, no orders, no results. |
| 57 | `SkeletonLoader` | Shimmer placeholders matching each content type (card, table row, form) |
| 58 | `SEOHead` | Dynamic `<title>`, `<meta>`, Open Graph, Twitter Card, JSON‑LD — via `generateMetadata()` |

---

## 6. Page Templates (Wireframe Descriptions)

### 6.1 Homepage

```
┌─────────────────────────────────────────────────────────┐
│  AnnouncementBar ("Free shipping on orders over 200 MAD")│
├─────────────────────────────────────────────────────────┤
│  SiteHeader  [Logo] [Nav] [SearchBar] [♡] [🛒 3] [👤]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  HeroBanner                                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Full‑bleed Cloudinary image: honey harvest     │   │
│  │  H1: "Pure Moroccan Honey, Straight from        │   │
│  │       the Hive"                                  │   │
│  │  p: "Ethically sourced by our cooperative of     │   │
│  │      200+ beekeepers across Morocco"             │   │
│  │  [Shop Honey]  [Our Story]                       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Category Cards (scroll mobile, grid desktop)           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│  │Honey │ │Bees- │ │Propo-│ │Royal │ │Equip-│        │
│  │      │ │wax   │ │lis   │ │Jelly │ │ment  │        │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘        │
│                                                         │
│  "Featured Products" — H2                               │
│  ProductGrid (2×3 desktop, 2×2 tablet, 1×4 mobile)     │
│  ┌────────┐ ┌────────┐ ┌────────┐                     │
│  │  Card  │ │  Card  │ │  Card  │                     │
│  ├────────┤ ├────────┤ ├────────┤                     │
│  │  Card  │ │  Card  │ │  Card  │                     │
│  └────────┘ └────────┘ └────────┘                     │
│  [View All Products →]                                  │
│                                                         │
│  Value Props Strip (3 columns)                          │
│  ┌───────────────┐ ┌───────────────┐ ┌──────────────┐ │
│  │ 🐝 100%       │ │ 🚚 Fast       │ │ 🤝 Coopéra- │ │
│  │ Natural       │ │ Delivery      │ │ tive Model   │ │
│  └───────────────┘ └───────────────┘ └──────────────┘ │
│                                                         │
│  TestimonialCarousel                                    │
│                                                         │
│  "From Our Blog" — H2                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │BlogCard  │ │BlogCard  │ │BlogCard  │              │
│  └──────────┘ └──────────┘ └──────────┘              │
│                                                         │
│  NewsletterForm                                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  SiteFooter                                             │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Product Listing Page (PLP)

```
┌─────────────────────────────────────────────────────────┐
│  SiteHeader                                             │
├─────────────────────────────────────────────────────────┤
│  BreadcrumbNav: Home > Products > Honey                 │
│                                                         │
│  H1: "Honey"  ·  24 products  [Sort ▾]  [Filters ▾]   │
│                                                         │
│  ┌────────────┬────────────────────────────────────┐   │
│  │ FILTERS    │  ProductGrid                       │   │
│  │ (sidebar   │  ┌────┐ ┌────┐ ┌────┐             │   │
│  │  desktop,  │  │ PC │ │ PC │ │ PC │             │   │
│  │  sheet on  │  └────┘ └────┘ └────┘             │   │
│  │  mobile)   │  ┌────┐ ┌────┐ ┌────┐             │   │
│  │            │  │ PC │ │ PC │ │ PC │             │   │
│  │ Category   │  └────┘ └────┘ └────┘             │   │
│  │ ☑ Sidr     │  ┌────┐ ┌────┐ ┌────┐             │   │
│  │ ☐ Eucalypt │  │ PC │ │ PC │ │ PC │             │   │
│  │ ☐ Wildflwr │  └────┘ └────┘ └────┘             │   │
│  │            │                                    │   │
│  │ Price      │  PaginationBar                     │   │
│  │ [50]─[500] │  [< 1  2  3 ... 8 >]              │   │
│  │            │                                    │   │
│  │ Rating     │                                    │   │
│  │ ★★★★ & up │                                    │   │
│  │            │                                    │   │
│  │ ☑ In Stock │                                    │   │
│  └────────────┴────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│  SiteFooter                                             │
└─────────────────────────────────────────────────────────┘
```

### 6.3 Product Detail Page (PDP)

```
┌─────────────────────────────────────────────────────────┐
│  SiteHeader                                             │
├─────────────────────────────────────────────────────────┤
│  BreadcrumbNav: Home > Honey > Sidr Honey 500g         │
│                                                         │
│  ┌─────────────────────┬──────────────────────────┐    │
│  │ ProductImageGallery │  ProductInfo              │    │
│  │                     │                           │    │
│  │  ┌───────────────┐  │  H1: "Sidr Honey 500g"   │    │
│  │  │               │  │  ★★★★★ 4.8 (127 reviews) │    │
│  │  │   Main Image  │  │                           │    │
│  │  │   (zoom)      │  │  180 MAD   ̶2̶2̶0̶  −18%     │    │
│  │  │               │  │  ✓ In Stock (24 units)    │    │
│  │  └───────────────┘  │                           │    │
│  │  [th1][th2][th3]    │  QuantitySelector [- 1 +]  │    │
│  │  [th4][th5]         │                           │    │
│  │                     │  [🛒 Add to Cart        ]  │    │
│  │                     │  [♡ Add to Wishlist     ]  │    │
│  │                     │                           │    │
│  │                     │  Tabs: Desc | Specs | Ship │    │
│  └─────────────────────┴──────────────────────────┘    │
│                                                         │
│  ProductReviews                                         │
│  Star histogram + review list + [Write a Review]        │
│                                                         │
│  "You Might Also Like" — ProductGrid (4 cards)         │
├─────────────────────────────────────────────────────────┤
│  SiteFooter                                             │
└─────────────────────────────────────────────────────────┘
```

### 6.4 Cart Page

```
┌─────────────────────────────────────────────────────────┐
│  SiteHeader                                             │
├─────────────────────────────────────────────────────────┤
│  H1: "Shopping Cart" (3 items)                          │
│                                                         │
│  ┌──────────────────────────┬──────────────────────┐   │
│  │  CartItemRow 1           │  OrderSummary        │   │
│  │  [img] Name   -1+ ×     │  Subtotal: 460 MAD   │   │
│  │        180 MAD × 2       │  Shipping: 30 MAD    │   │
│  │                          │  ─────────────────   │   │
│  │  CartItemRow 2           │  Total: 490 MAD      │   │
│  │  [img] Name   -1+ ×     │                      │   │
│  │        100 MAD × 1       │  CouponInput         │   │
│  │                          │  [code      ] Apply  │   │
│  │  [Continue Shopping]     │                      │   │
│  │                          │  [Checkout →       ] │   │
│  │                          │  🔒 Secure · Stripe  │   │
│  └──────────────────────────┴──────────────────────┘   │
│  OR: EmptyState ("Your cart is empty")                  │
├─────────────────────────────────────────────────────────┤
│  SiteFooter                                             │
└─────────────────────────────────────────────────────────┘
```

### 6.5 Checkout Page

```
┌─────────────────────────────────────────────────────────┐
│  Minimal Header: [Logo]         [Back to Cart]          │
├─────────────────────────────────────────────────────────┤
│  CheckoutStepper: [● Shipping]──[○ Payment]──[○ Done]   │
│                                                         │
│  ┌──────────────────────────┬──────────────────────┐   │
│  │  STEP 1: Shipping        │  OrderSummary        │   │
│  │  ◉ Home — 123 Rue...    │  (collapsible on     │   │
│  │  ○ Work — 456 Blvd...   │   mobile)            │   │
│  │  ○ + New Address         │                      │   │
│  │  [Continue to Payment →] │  Items + Totals      │   │
│  │                          │                      │   │
│  │  STEP 2: Payment         │                      │   │
│  │  ◉ Card (Stripe)        │                      │   │
│  │    [Stripe Element]      │                      │   │
│  │  ○ Cash on Delivery      │                      │   │
│  │  [Place Order →]         │                      │   │
│  └──────────────────────────┴──────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 6.6 Admin Dashboard

```
┌─────────────────────────────────────────────────────────┐
│  AdminSidebar │  Admin Header  [🔔 3] [Search] [👤]    │
│               │                                         │
│  ◆ Dashboard  │  H1: "Dashboard"                        │
│  □ Products   │                                         │
│  □ Orders  ⓮  │  DashboardKPICards (4 cards)             │
│  □ Customers  │  [Revenue] [Orders] [Customers] [AOV]   │
│  □ Members    │                                         │
│  □ Inventory  │  SalesChart (30-day trend line)          │
│  □ Categories │                                         │
│  □ Coupons    │  Recent Orders (DataTable, 5 rows)      │
│  □ Notifs     │  [#] [Customer] [Total] [Status] [...]  │
│  □ Blog       │                                         │
│  □ Reports    │  Low Stock Alerts                       │
│  □ Settings   │  🔴 Sidr Honey 250g — 0 units           │
│               │  🟡 Propolis Tincture — 3 units          │
└───────────────┴─────────────────────────────────────────┘
```

---

## 7. Technical Stack Recommendation

### 7.1 Frontend

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Framework** | **Next.js 15** (App Router) | React Server Components, streaming, layouts, middleware, parallel routes, ISR — the definitive Vercel‑optimized stack |
| **Language** | **TypeScript 5.x** | End‑to‑end type safety; shared Zod schemas between client and server |
| **Styling** | **Tailwind CSS 4** + **shadcn/ui** | Utility‑first + accessible, composable headless components (Radix primitives) |
| **State (client)** | **Zustand** | Cart, UI state (drawers, modals), notification count. Cart persists to `localStorage`. |
| **Server State** | **TanStack Query v5** | Caching, deduplication, optimistic mutations, background refetch |
| **URL State** | **nuqs** | Type‑safe URL search params for filters, pagination, sort |
| **Forms** | **React Hook Form** + **Zod** | Performant forms + schema validation shared with API Route Handlers |
| **Charts** | **Recharts** | Composable, SSR‑friendly charts for admin dashboard |
| **Carousel** | **Embla Carousel** | Lightweight, touch‑friendly, accessible |
| **i18n** | **next-intl** | FR / AR / EN with full RTL support for Arabic |
| **Animations** | **Framer Motion** | Page transitions, cart animations, micro‑interactions |
| **Toasts** | **Sonner** | Lightweight, accessible notification toasts |

### 7.2 Backend (Unified Next.js)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **API Layer** | **Next.js Route Handlers** (`/app/api/`) | Collocated with frontend; no separate server to deploy |
| **Auth** | **NextAuth.js v5** (Auth.js) | Credentials (email/password) + Google OAuth + TOTP 2FA via `otplib` |
| **Database** | **MongoDB Atlas** (M10+ for prod) | Flexible document schemas for e‑commerce; aggregation pipeline for analytics; Atlas Search |
| **ODM** | **Mongoose 8** | Schema validation, middleware hooks, population, typed with TypeScript |
| **Cache / Pub/Sub** | **Upstash Redis** | Session store, rate limiting (`@upstash/ratelimit`), cart cache, SSE Pub/Sub |
| **Job Queue** | **BullMQ** on Upstash Redis OR **Vercel QStash** | Async jobs: email, SMS, push, payouts. QStash for fully serverless. |
| **Payments** | **Stripe** | Checkout Sessions, Payment Element, Webhooks, Apple Pay / Google Pay |
| **Validation** | **Zod** | Shared schemas between client forms and server route handlers |

### 7.3 External Services

| Service | Choice | Rationale |
|---------|--------|-----------|
| **Transactional Email** | **Resend** (primary) / **SendGrid** (fallback) | React email templates; SendGrid as reliability fallback |
| **SMS** | **Twilio** | Programmable SMS with Moroccan number support |
| **Push Notifications** | **Firebase Cloud Messaging** | Web Push via service worker; free tier generous |
| **Image CDN** | **Cloudinary** | Upload, transform, optimize (f_auto, q_auto), responsive breakpoints |
| **Error Tracking** | **Sentry** (`@sentry/nextjs`) | Source maps, performance tracing, release tracking |
| **Analytics** | **Vercel Analytics** + **Speed Insights** | Real User Monitoring, Web Vitals, zero config |

### 7.4 Infrastructure

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Hosting** | **Vercel** (Pro plan) | Edge network, preview deploys, serverless functions, cron jobs |
| **Database** | **MongoDB Atlas** (AWS `eu-west-3` Paris) | Closest region to Morocco; auto-scaling; daily backups |
| **Redis** | **Upstash** (`eu-west-1`) | Serverless Redis, pay-per-request, REST API for edge |
| **CI/CD** | **GitHub Actions** → Vercel | Lint → Type‑check → Test → Deploy pipeline |
| **Monitoring** | **Sentry** + **Vercel Analytics** + **Atlas Monitoring** | Full observability |

### 7.5 Architecture Diagram

```
                        ┌───────────────────────────────────────┐
                        │            Vercel Edge Network         │
                        │                                       │
   Users ──────────────▶│  Next.js 15 App                       │
   (Customers,          │  ┌─────────────────────────────────┐  │
    Members,            │  │  React Server Components (SSR)  │  │
    Admins)             │  │  + Client Components (hydrate)  │  │
                        │  ├─────────────────────────────────┤  │
                        │  │  Route Handlers (/api/*)        │  │
                        │  │  ├── Auth (NextAuth.js)         │  │
                        │  │  ├── Products / Cart / Orders   │  │
                        │  │  ├── Checkout (Stripe Sessions) │  │
                        │  │  ├── Admin / Member APIs        │  │
                        │  │  └── Webhooks (Stripe)          │  │
                        │  └──────────┬──────────────────────┘  │
                        └─────────────┼──────────────────────────┘
                                      │
                     ┌────────────────┼────────────────────┐
                     │                │                    │
                     ▼                ▼                    ▼
           ┌──────────────┐  ┌──────────────┐   ┌──────────────┐
           │  MongoDB     │  │  Upstash     │   │  Cloudinary  │
           │  Atlas       │  │  Redis       │   │  Image CDN   │
           │  (Paris)     │  │  • Cache     │   └──────────────┘
           │              │  │  • Sessions  │
           │  11 Models   │  │  • Rate Limit│
           │  (see §3)    │  │  • Pub/Sub   │
           └──────────────┘  │  • BullMQ    │
                             └──────┬───────┘
                                    │
                           ┌────────┼────────┐
                           ▼        ▼        ▼
                    ┌─────────┐ ┌───────┐ ┌─────────┐
                    │ Resend/ │ │Twilio │ │Firebase │
                    │SendGrid │ │  SMS  │ │  FCM    │
                    │ Email   │ │       │ │  Push   │
                    └─────────┘ └───────┘ └─────────┘

         ┌──────────────────────────────────────────────┐
         │              Stripe Payments                 │
         │  Checkout Sessions · Webhooks · Connect      │
         └──────────────────────────────────────────────┘

         ┌──────────────────────────────────────────────┐
         │          Observability                       │
         │  Sentry · Vercel Analytics · Atlas Monitor   │
         └──────────────────────────────────────────────┘
```

### 7.6 Project Structure

```
shahdcoop/
├── app/
│   ├── (store)/                  # Public storefront layout group
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx          # PLP
│   │   │   └── [slug]/page.tsx   # PDP
│   │   ├── categories/
│   │   ├── cart/page.tsx
│   │   ├── checkout/
│   │   ├── blog/
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   └── faq/page.tsx
│   ├── (auth)/                   # Auth layout (minimal header)
│   │   └── auth/
│   ├── (account)/                # Authenticated user layout
│   │   └── account/
│   ├── (member)/                 # Cooperative member layout
│   │   └── member/
│   ├── (admin)/                  # Admin layout
│   │   └── admin/
│   ├── api/                      # Route Handlers
│   │   ├── auth/[...nextauth]/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── notifications/
│   │   ├── admin/
│   │   ├── member/
│   │   ├── blog/
│   │   ├── wishlist/
│   │   └── webhooks/stripe/
│   ├── layout.tsx                # Root layout
│   ├── not-found.tsx
│   └── error.tsx
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── layout/
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   ├── auth/
│   ├── account/
│   ├── admin/
│   └── shared/
├── lib/
│   ├── db/
│   │   ├── connect.ts            # Mongoose (cached for serverless)
│   │   ├── models/               # Mongoose schemas
│   │   └── seed.ts
│   ├── auth/
│   ├── stripe/
│   ├── redis/
│   ├── queue/
│   ├── notifications/
│   ├── cloudinary/
│   ├── validations/              # Zod schemas (shared)
│   ├── utils/
│   └── constants/
├── hooks/
├── stores/                       # Zustand
├── types/
├── emails/                       # React Email templates
├── public/
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
└── .env.local
```

---

## 8. Performance Budgets

### 8.1 Core Web Vitals Targets

| Metric | Target | What We're Measuring |
|--------|--------|---------------------|
| **LCP** (Largest Contentful Paint) | **< 1.5s** | Hero image (homepage), product image (PDP) |
| **INP** (Interaction to Next Paint) | **< 150ms** | Add to cart, filter toggle, quantity change |
| **CLS** (Cumulative Layout Shift) | **< 0.05** | No shifts from images, fonts, or dynamic content |
| **FCP** (First Contentful Paint) | **< 0.8s** | Initial shell render |
| **TTFB** (Time to First Byte) | **< 200ms** | Edge for ISR; < 400ms for dynamic SSR |

### 8.2 Page‑Level Budgets

| Page | JS Bundle (gzipped) | Total Transfer | Target Load |
|------|---------------------|----------------|-------------|
| Homepage | < 85 KB | < 400 KB | < 1.5s |
| PLP (Product List) | < 75 KB | < 350 KB | < 1.2s |
| PDP (Product Detail) | < 95 KB | < 500 KB | < 1.5s |
| Cart | < 65 KB | < 300 KB | < 1.0s |
| Checkout | < 90 KB (+ Stripe ~40KB) | < 400 KB | < 1.5s |
| Admin Dashboard | < 180 KB | < 750 KB | < 2.5s |
| Blog Post | < 60 KB | < 300 KB | < 1.0s |

### 8.3 Performance Strategies

| Strategy | Implementation |
|----------|---------------|
| **Image Optimization** | Next.js `<Image>` + Cloudinary loader, `priority` on LCP, AVIF/WebP via `f_auto`, responsive `sizes`, blur placeholder |
| **Code Splitting** | `next/dynamic` for: admin charts, Stripe Element, rich text editor, image lightbox, 2FA setup |
| **Static Generation** | ISR for product pages (`revalidate: 60`), fully static for `/about`, `/faq`, `/terms` |
| **Streaming SSR** | `<Suspense>` around: product grid, reviews, dashboard KPIs, order tables |
| **Font Loading** | `next/font/google` with `display: swap`; subset Latin + Arabic; preload critical weights |
| **Bundle Monitoring** | `@next/bundle-analyzer` in CI; fail build if route exceeds budget by > 10% |
| **Prefetching** | `<Link>` auto‑prefetch for PLP → PDP; `router.prefetch` on cart hover → checkout |
| **Database** | Mongoose `lean()` for reads; compound indexes; field projection; cached connection pooling |
| **Redis Cache** | Featured products (60s), category tree (300s), session data. Invalidate on write. |
| **Third‑Party** | Defer Stripe.js to checkout; lazy‑load analytics; FCM service worker async |

### 8.4 Lighthouse Score Targets

| Category | Public Pages | Admin Pages |
|----------|:-------------|:------------|
| Performance | ≥ 95 | ≥ 85 |
| Accessibility | ≥ 95 | ≥ 90 |
| Best Practices | ≥ 95 | ≥ 95 |
| SEO | 100 | N/A (noindex) |

### 8.5 API Response Time Budgets

| Endpoint Category | p50 | p95 |
|-------------------|:----|:----|
| Product list (cached) | < 50ms | < 150ms |
| Product detail | < 80ms | < 200ms |
| Cart operations | < 100ms | < 250ms |
| Checkout session | < 300ms | < 600ms |
| Admin dashboard agg | < 500ms | < 1.2s |
| Search | < 60ms | < 150ms |

---

## 9. SEO Structure

### 9.1 URL Pattern Standards

| Page Type | URL Pattern | Example |
|-----------|-------------|---------|
| Homepage | `/` | `shahdcoop.ma/` |
| Category | `/categories/[slug]` | `/categories/honey` |
| Product | `/products/[slug]` | `/products/sidr-honey-500g` |
| Blog Post | `/blog/[slug]` | `/blog/benefits-of-raw-honey` |
| Static Pages | `/[page]` | `/about`, `/contact`, `/faq` |
| Account | `/account/*` | `/account/orders` — **noindex** |
| Admin | `/admin/*` | `/admin/dashboard` — **noindex** |

**Slug conventions:** Lowercase, hyphen‑separated, no special characters. Product slugs include variant info (e.g. `sidr-honey-500g`). Auto‑generated via `slugify()` with collision handling.

### 9.2 Meta Tag Templates (via `generateMetadata()`)

```typescript
// Homepage
title: "ShahdCoop — Pure Moroccan Honey & Beekeeping Products"
description: "Shop 100% natural honey, propolis, royal jelly, and beekeeping
  equipment from Morocco's trusted cooperative. Free delivery over 200 MAD."

// Category Page
title: `${category.name} — ShahdCoop`
description: `Browse our selection of ${category.name.toLowerCase()}.
  ${category.productCount} products sourced directly from Moroccan beekeepers.`

// Product Detail Page
title: `${product.name} — ${formatPrice(product.price)} | ShahdCoop`
description: `${product.name}: ${product.description.slice(0, 150)}.
  Rated ${product.rating.average}/5 by ${product.rating.count} customers.
  Order online with free delivery over 200 MAD.`

// Blog Post
title: `${post.title} — ShahdCoop Blog`
description: post.excerpt
```

### 9.3 Open Graph & Social Meta

```html
<!-- All pages -->
<meta property="og:site_name" content="ShahdCoop" />
<meta property="og:locale" content="fr_MA" />
<meta property="og:locale:alternate" content="ar_MA" />
<meta name="twitter:card" content="summary_large_image" />

<!-- Product pages -->
<meta property="og:type" content="product" />
<meta property="product:price:amount" content="180.00" />
<meta property="product:price:currency" content="MAD" />
<meta property="product:availability" content="in stock" />

<!-- Blog posts -->
<meta property="og:type" content="article" />
<meta property="article:published_time" content="..." />
```

### 9.4 Structured Data (JSON‑LD)

| Page | Schema Types | Key Properties |
|------|-------------|----------------|
| **Homepage** | `Organization` + `WebSite` + `SearchAction` | name, logo, url, sameAs, potentialAction |
| **PDP** | `Product` + `AggregateRating` + `Review[]` + `BreadcrumbList` | name, image, offers, aggregateRating, review, sku, brand |
| **PLP** | `CollectionPage` + `ItemList` + `BreadcrumbList` | itemListElement |
| **Blog** | `BlogPosting` + `BreadcrumbList` | headline, datePublished, author, image |
| **FAQ** | `FAQPage` + `Question/Answer` | mainEntity (targets featured snippets) |
| **All Pages** | `BreadcrumbList` | Auto from URL hierarchy |

### 9.5 Technical SEO

| Item | Implementation |
|------|---------------|
| **Sitemap** | `app/sitemap.ts` — dynamic from MongoDB (products, categories, blog). Split sub‑sitemaps if > 50K. |
| **Robots.txt** | `app/robots.ts` — Allow public; Disallow `/admin`, `/account`, `/member`, `/api`, `/auth` |
| **Canonical** | Self‑referencing on every page. Filter pages canonicalize to unfiltered `/products`. |
| **hreflang** | `fr-MA` (default), `ar-MA`, `en` on every public page |
| **Pagination** | `?page=N` with `rel="next/prev"`. `noindex` on page > 1. |
| **Images** | Descriptive `alt` from product data. Cloudinary OG transforms. Width/height always set. |
| **404** | Custom `not-found.tsx` with search + popular products. Proper 404 status. |
| **Redirects** | `next.config.ts redirects()` for changed slugs (301). Middleware for locale. |
| **Mobile** | Responsive. Google mobile‑first indexing. No separate mobile URLs. |
| **Internal Links** | Related products on PDP, breadcrumbs, blog cross‑links, footer category links. |

### 9.6 Content SEO Strategy

| Tactic | Details |
|--------|---------|
| **Blog** | 2× monthly: beekeeping education, honey recipes, health benefits. Long‑tail FR/AR keywords. |
| **Category Descriptions** | 150–300 word unique SEO copy per category, FR + AR. |
| **Product Descriptions** | Minimum 100 words unique copy; specs; usage tips; origin story. |
| **FAQ Schema** | Target featured snippets for common honey/beekeeping queries. |
| **Local SEO** | Google Business Profile. `LocalBusiness` schema on `/about`. |

---

## Appendix A: Accessibility Checklist

| Requirement | Implementation |
|-------------|---------------|
| WCAG 2.1 AA | shadcn/ui (Radix primitives) provides accessible defaults |
| Keyboard nav | All elements focusable; skip‑to‑content; focus rings |
| Screen readers | ARIA labels, `aria-live` for cart/toasts, landmarks |
| Color contrast | 4.5:1 body, 3:1 large text + UI components |
| Focus mgmt | Trap in modals/drawers; return focus on close |
| Forms | Labels, `aria-describedby` errors, required markers |
| Image alt | Required in product upload; admin warning if empty |
| RTL | `dir="rtl"` for Arabic; Tailwind logical properties |
| Reduced motion | `prefers-reduced-motion` disables animations |
| Touch targets | Minimum 44×44px on mobile |

## Appendix B: Environment Variables

```bash
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://shahdcoop.ma
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
RESEND_API_KEY=re_...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
FIREBASE_SERVER_KEY=...
NEXT_PUBLIC_FIREBASE_CONFIG=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SENTRY_DSN=...
```

## Appendix C: Middleware Strategy

```typescript
// middleware.ts — execution order:
// 1. Rate limiting (Upstash @upstash/ratelimit)
// 2. Auth check — redirect unauthenticated from /account, /member, /admin
// 3. Role guard — /admin requires admin, /member requires member
// 4. 2FA enforcement — verify TOTP if enabled but not verified this session
// 5. Locale detection — cookie → Accept-Language → default (fr)
// 6. Security headers — CSP, HSTS, X-Frame-Options

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
```

---

*End of architecture document.*

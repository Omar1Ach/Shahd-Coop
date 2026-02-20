# 🍯 ShahdCoop — Premium Honey E-Commerce Platform

A full-stack cooperative e-commerce platform built with **Next.js 15**, **MongoDB Atlas**, **Upstash Redis**, and **Stripe**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, React 19) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 + Design Tokens |
| Database | MongoDB Atlas + Mongoose |
| Cache/Sessions | Upstash Redis |
| Auth | NextAuth.js v5 (beta) |
| Payments | Stripe |
| Email | Resend + React Email |
| Queue | BullMQ |
| Upload | UploadThing |
| State | Zustand + TanStack Query |
| i18n | next-intl (FR / AR / EN) |
| Package Manager | pnpm |

## Getting Started

```bash
# 1. Install dependencies
pnpm install

# 2. Copy env file
cp .env.example .env.local

# 3. Fill in your environment variables in .env.local

# 4. Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Login, Register, Reset Password
│   ├── (shop)/           # Products, Categories, Search, Cart, Checkout
│   ├── (account)/        # Customer dashboard
│   ├── (admin)/          # Admin panel
│   ├── (member)/         # Cooperative member portal
│   ├── (content)/        # Blog, About, FAQ, Contact
│   └── api/              # API Route Handlers
├── components/           # Reusable UI components
├── lib/                  # Core libraries (db, redis, auth, stripe, email)
├── models/               # Mongoose models
├── stores/               # Zustand stores
├── hooks/                # Custom React hooks
├── types/                # TypeScript types
├── config/               # Site configuration
└── messages/             # i18n translations (fr, ar, en)
```

## Sprints

| Sprint | Theme | Status |
|--------|-------|--------|
| Sprint 1 | Foundation & Infrastructure | 🚧 In Progress |
| Sprint 2 | Product Catalog & Search | 📋 Planned |
| Sprint 3 | Cart, Checkout & Payments | 📋 Planned |
| Sprint 4 | Customer Account & Orders | 📋 Planned |
| Sprint 5 | Admin Panel & Member Portal | 📋 Planned |
| Sprint 6 | Content, SEO & Launch | 📋 Planned |

## Environment Variables

See `.env.example` for all required variables.

## License

Private — ShahdCoop © 2026

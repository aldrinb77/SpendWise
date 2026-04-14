# 🚀 Advanced Free Expense Tracker (Cloudflare Edition)

A premium, high-performance expense tracking web application built exclusively for the Cloudflare ecosystem.

## ✨ Features
- **Cloudflare Native**: Uses D1 (Database), KV (Sessions), and R2 (Receipts).
- **Rule-Based Learning**: Auto-categorizes transactions using a learned merchant mapping system (no AI costs).
- **Premium Glassmorphism**: Modern, sleek UI with Framer Motion animations.
- **Bank Statement Import**: PDF parsing specifically optimized for Paytm and Indian Banks.
- **Secure Custom Auth**: JWT-based authentication at the Edge.

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js 18+
- Cloudflare Wrangler CLI (`npm i -g wrangler`)

### 2. Installation
```bash
# Navigate to the project
cd expense-tracker

# Install dependencies
npm install
```

### 3. Database Initialization (Local)
Create and seed your local D1 database:
```bash
# Apply schema
# npx wrangler d1 execute expense-tracker-db --local --file=lib/db/schema.sql
```

### 4. Running Locally
To enjoy Cloudflare bindings (D1/KV) locally:
```bash
# Build the project
npm run build

# Run with Wrangler
npx wrangler pages dev .next --compatibility-flag=nodejs_compat --d1=DB
```

Open [http://localhost:8788](http://localhost:8788) to view the app.

### 5. Seeding Categories
Once the app is running, visit:
`http://localhost:8788/api/admin/seed`
to populate the default Indian categories.

## 📁 Project Structure
- `app/`: Next.js App Router routes.
- `components/`: UI and Dashboard components.
- `lib/categorization/`: Rule-based learning engine.
- `lib/parsers/`: PDF/Bank statement logic.
- `lib/db/`: SQL schema and D1 utilities.

## 🌐 Deployment
Deploy to Cloudflare Pages:
```bash
npm run build
npx wrangler pages deploy .next
```

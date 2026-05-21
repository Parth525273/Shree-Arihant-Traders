# Shree Arihant Traders 🛒

> B2B Wholesale Food Ordering Platform

A full-stack web application for **Shree Arihant Traders** that enables retailers to browse products from 40+ food companies, place bulk orders, and track deliveries — while the admin manages everything from a powerful dashboard.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| Auth | JWT (Email/Password) |
| Images | Cloudinary |
| WhatsApp | wa.me link (zero cost) |
| Hosting | Vercel (FE) + Render (BE) |

---

## 📁 Project Structure

```
Shree-Arihant-Traders/
├── frontend/          # Next.js 14 application
├── backend/           # Express.js REST API
├── docs/              # Documentation
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)
- Cloudinary account (free)

### 1. Clone the repo
```bash
git clone https://github.com/Parth525273/Shree-Arihant-Traders.git
cd Shree-Arihant-Traders
```

### 2. Setup Backend
```bash
cd backend
npm install

# Copy env file and fill in your values
cp .env.example .env

# Start backend server
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install

# Copy env file
cp .env.example .env.local

# Start frontend
npm run dev
```

### 4. Create Admin Account
```bash
# In the backend folder (after setting up .env with MongoDB URI)
npm run seed-admin
```

Admin credentials after seeding:
- **Email:** tradersshreearihant@gmail.com
- **Password:** Admin@1234 *(change after first login!)*

### 5. Open the app
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health

---

## 📋 Features

### For Retailers (Customers)
- Browse products by company and category
- View bulk pricing tiers
- Add to cart with quantity validation
- Place orders with WhatsApp confirmation
- View order history + payment status

### For Admin (Shop Owner)
- Manage companies, categories, products
- Upload product images
- Set bulk pricing tiers
- View and manage all orders
- Mark payments as received
- View customer list + dashboard stats

---

## 🌿 Development Phases

| Phase | Branch | Status |
|-------|--------|--------|
| 1. Project Setup | `phase/1-setup` | ✅ Done |
| 2. Backend API | `phase/2-backend-api` | 🔄 In Progress |
| 3. Auth + Browse | `phase/3-auth-browse` | ⏳ Pending |
| 4. Retailer Portal | `phase/4-retailer-portal` | ⏳ Pending |
| 5. Admin Portal | `phase/5-admin-portal` | ⏳ Pending |
| 6. Polish + PDF | `phase/6-polish-pdf` | ⏳ Pending |
| 7. Deployment | `phase/7-deployment` | ⏳ Pending |

---

## 📞 Contact

**Shree Arihant Traders**
- WhatsApp: +91 94031 53875
- Email: tradersshreearihant@gmail.com
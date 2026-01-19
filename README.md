<div align="center">

# 🛒 NovaTech E-Commerce Store

### *A Premium Tech Store with Smart Coupon System*

[Features](#-features) • [API Docs](#-api-endpoints) • [Installation](#-installation) • [Testing](#-testing)

---

</div>

## 📖 Overview

This project implements a **full-featured e-commerce store** where users can:

- 🛍️ Browse premium tech products
- 🛒 Add items to cart with real-time updates
- 🎟️ Apply discount coupons at checkout
- ✅ Complete orders with validation

### 🎯 Core Concept

> **Every n-th order generates a 10% discount coupon** that can be applied once to the entire cart.

---

## 🧠 Coupon Logic

<table>
<tr>
<td width="50%">

### How It Works

1. **Automatic Generation**: A new coupon is issued on every **n-th** successful order
2. **Discount**: Coupon provides **10% off** the entire order
3. **Single Use**: Each coupon can be used **only once**
4. **Next Availability**: Next coupon becomes available after the next **n-th** order

</td>
<td width="50%">

### Example (when n = 2)

| Order # | Coupon Issued |
|---------|---------------|
| 1️⃣ | ❌ |
| **2️⃣** | **✅ SAVE10XXX** |
| 3️⃣ | ❌ |
| **4️⃣** | **✅ SAVE10YYY** |

</td>
</tr>
</table>

---

## 🎨 Features

<table>
<tr>
<td width="50%" valign="top">

### 👤 User Features

```
✨ Product Listing
   └── Browse curated tech products
   └── View ratings & reviews
   └── Check stock availability

🛒 Smart Cart System
   └── Add / update quantities
   └── Remove items instantly
   └── Real-time price calculation

🎟️ Coupon Management
   └── Apply discount codes
   └── Automatic validation
   └── See discount breakdown

💳 Seamless Checkout
   └── Order validation
   └── Discount application
   └── Cart reset on success
```

</td>
<td width="50%" valign="top">

### 👨‍💼 Admin Features

```
🎁 Coupon Generation
   └── Manual coupon creation
   └── Automatic on nth order
   └── Track usage status

📊 Analytics Dashboard
   └── Total orders & revenue
   └── Items purchased count
   └── Discount analytics
   └── Coupon usage tracking

📋 Coupon Management
   └── View all issued coupons
   └── Check availability status
   └── Copy codes easily
```

</td>
</tr>
</table>

---

## 🗂️ API Endpoints

### 🛍️ **Cart APIs**

<details>
<summary><b>POST</b> <code>/api/cart/add</code> - Add item to cart</summary>

Adds a product to the user's shopping cart or increments quantity if already present.

</details>

<details>
<summary><b>POST</b> <code>/api/checkout</code> - Checkout cart</summary>

Validates coupon code (if provided) and processes the order with discount applied.

</details>

---

### 👨‍💼 **Admin APIs**

<details>
<summary><b>POST</b> <code>/api/admin/generate-coupon</code> - Generate coupon</summary>

Creates a new discount coupon (triggered automatically on nth order or manually by admin).

</details>

<details>
<summary><b>GET</b> <code>/api/admin/stats</code> - Get store statistics</summary>

**Returns:**
- 📦 Total orders placed
- 🛒 Total items purchased
- 💰 Total purchase amount
- 🎟️ Total discount amount given
- 📋 List of all issued coupons (with status)

</details>

---

## 💾 Data Storage

All data is stored **in-memory** using:

```
📁 /lib/store.ts
```

**Includes:**
- 🛒 Shopping carts
- 📦 Order history
- 🎟️ Discount coupons
- 🔢 Global order counter

> ⚠️ **Note:** No database required as per assignment specifications. Data resets on server restart.

---

## 🚀 Installation

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Quick Start

```bash
# 1️⃣ Install dependencies
npm install

# 2️⃣ Start development server
npm run dev

# 3️⃣ Open in browser
# 🌐 http://localhost:3000
```

---

## 🧪 Testing

Run the comprehensive test suite:

```bash
npm run test
```

**Test Coverage:**
- ✅ Cart functionality (add/update/remove)
- ✅ Coupon validation logic
- ✅ Checkout behavior
- ✅ Admin statistics response
- ✅ Order counter logic

---

## 🧰 Tech Stack

<div align="center">

| Layer | Technology |
|:------|:-----------|
| **Frontend** | Next.js + React + TypeScript |
| **Backend APIs** | Next.js API Routes |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **Testing** | Jest + React Testing Library |
| **State Management** | React Hooks |

</div>

---

## 📁 Project Structure

```
📦 ecommerce-store
├── 📂 app/
│   ├── 📂 /          # Product listing page
│   ├── 📂 admin/             # Admin dashboard
│   └── 📂 api/               # API routes
│       ├── cart/
│       ├── checkout/
│       └── admin/
├── 📂 components/            # Reusable UI components
├── 📂 lib/
│   └── store.ts              # In-memory data store
├── 📂 __tests__/             # Unit tests
└── 📄 README.md
```

---

## 🎯 Key Highlights

<div align="center">

| Feature | Description |
|:--------|:------------|
| 🎨 **Premium UI** | Black & white minimalist design |
| ⚡ **Real-time Updates** | Instant cart synchronization |
| 🔒 **Validation** | Coupon and stock validation |
| 📱 **Responsive** | Mobile-first design approach |
| 🧪 **Well-tested** | Comprehensive unit tests |
| 📝 **Type-safe** | Full TypeScript coverage |

</div>

---

## 📌 Notes

- 📋 Built as a **take-home assessment**
- 🧩 Code is **modular**, **commented**, and **easy to extend**
- 🔄 Data resets when server restarts *(intentional for in-memory store)*
- 🎨 Follows modern **Next.js 14** best practices
- ✨ Clean code with **separation of concerns**

---

<div align="center">

### 💡 Questions or Feedback?

Feel free to reach out or open an issue!

**Made with ❤️ using Next.js & TypeScript**

---

⭐ *If you found this project helpful, consider giving it a star!*

</div>
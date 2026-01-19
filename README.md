📖 Overview

This project implements a basic e-commerce store where users can:

Browse products

Add items to cart

Apply discount coupons

Checkout and place orders

It follows the assignment requirement that:

Every n-th order generates a 10% discount coupon that can be applied once to the cart.

Admin APIs are also implemented for generating coupons and viewing store statistics.

🧠 Coupon Logic

A new coupon is issued on every n-th successful order

Coupon gives 10% off the entire order

Coupon can be used only once

Next coupon becomes available after the next n-th order

Example when n = 2:

Order #	Coupon Issued
1	❌
2	✅
3	❌
4	✅
🧾 Features
User Features

Product listing page

Add / update / remove cart items

Apply discount coupon

Checkout cart

Cart resets after successful checkout

Admin Features

Generate coupon API

View overall store statistics

🗂️ API Endpoints
🛍️ Cart APIs
Add item to cart
POST /api/cart/add

Checkout cart
POST /api/checkout


Validates coupon and applies discount.

🔧 Admin APIs
Generate coupon
POST /api/admin/generate-coupon

Get store statistics
GET /api/admin/stats


Returns:

Total orders

Total items purchased

Total purchase amount

Total discount given

List of issued coupons

💾 Data Storage

All data is stored in memory in:

/lib/store.ts


This includes:

carts

orders

coupons

global order counter

No database is used, as per assignment instructions.

🚀 Running the Project
Install dependencies
npm install

Start the application
npm run dev


Open:

http://localhost:3000/

🧪 Running Unit Tests
npm run test


Tests include:

Cart functionality

Coupon validation

Checkout behavior

Admin stats response

🧰 Tech Stack
Layer	Technology
Frontend	Next.js + React + TypeScript
Backend APIs	Next.js API Routes
Styling	Tailwind CSS
Icons	Lucide React
Testing	Jest

📌 Notes

Built as a take-home assessment
Code is modular, commented, and easy to extend
Data resets when the server restarts (intended)
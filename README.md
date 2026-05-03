# 🍽️ Restaurant Ordering & Kitchen Management System

> A full-stack restaurant workflow system — from customer ordering to kitchen, waiter assignment, payments, and reviews — all in real time.

---

## 📖 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Problem It Solves](#problem-it-solves)
- [Roles](#roles)
- [Order Status Flow](#order-status-flow)
- [Database Design](#database-design)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [Authentication](#authentication-apis)
  - [Roles](#role-apis)
  - [Users](#user-apis)
  - [Tables](#table-apis)
  - [Categories](#category-apis)
  - [Menu Items](#menu-item-apis)
  - [Customizations](#menu-customization-apis)
  - [Orders](#order-apis)
  - [Order Items](#order-item-apis)
  - [Chef Actions](#chef-action-apis)
  - [Order Status Logs](#order-status-log-apis)
  - [Waiter Assignments](#waiter-assignment-apis)
  - [Payments](#payment-apis)
  - [Reviews](#review-apis)
  - [Notifications](#notification-apis)
  - [Dashboards & Reports](#dashboard-and-report-apis)
- [Socket Events](#socket-events)
- [Access Control](#access-control)
- [HTTP Status Codes](#http-status-codes)
- [Build Order](#build-order)

---

## Project Overview

This system handles the complete restaurant workflow:

1. Customer places order at a kiosk
2. Order goes to the kitchen in real time
3. Chef accepts the order and gives an ETA
4. Customer is updated live on order status
5. When food is ready, the system assigns the next available waiter
6. Waiter serves the food and collects cash or confirms online payment
7. Customer submits a review after completion

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React + Tailwind CSS                |
| Backend   | Node.js + Express.js                |
| Database  | MySQL + Sequelize ORM               |
| Real-time | Socket.IO                           |
| Auth      | JWT (JSON Web Tokens)               |
| Payments  | Razorpay + Cash                     |
| Logging   | Winston + winston-console-format    |

---

## Problem It Solves

Restaurants lose time and accuracy when orders are taken manually:
- Orders get delayed or lost
- Kitchen communication breaks down
- Waiter assignment becomes confusing
- Customers have no visibility on their order status

This system solves all of the above with a structured, role-based, real-time workflow.

---

## Roles

| Role       | Responsibilities |
|------------|-----------------|
| **Customer** | Place order, track status, pay online, submit review |
| **Chef**     | View orders, accept orders, update preparation status, mark food prepared |
| **Waiter**   | View assigned orders, acknowledge assignment, serve orders, collect cash |
| **Admin**    | Full control — manage staff, menu, tables, categories, and reports |

---

## Order Status Flow

```
placed → accepted → preparing → prepared → assigned_to_waiter → served → paid → reviewed
```

| Status              | Meaning                                   |
|---------------------|-------------------------------------------|
| `placed`            | Customer has submitted the order          |
| `accepted`          | Chef accepted and provided ETA            |
| `preparing`         | Chef is cooking the food                  |
| `prepared`          | Food is ready in the kitchen              |
| `assigned_to_waiter`| System has assigned a waiter              |
| `served`            | Waiter has delivered the food             |
| `paid`              | Payment completed                         |
| `reviewed`          | Customer submitted feedback               |

---

## Database Design

| Table                      | Purpose                             | Key Columns |
|----------------------------|-------------------------------------|-------------|
| `roles`                    | Stores user roles                   | `role_id`, `name` |
| `users`                    | Stores all staff accounts           | `user_id`, `name`, `phone`, `password_hash`, `role_id`, `is_active` |
| `restaurant_tables`        | Physical restaurant tables          | `table_id`, `table_number`, `capacity`, `status` |
| `categories`               | Menu categories                     | `category_id`, `name` |
| `menu_items`               | Food catalog                        | `item_id`, `name`, `description`, `price`, `category_id`, `is_available` |
| `item_customizations`      | Customization types per item        | `customization_id`, `item_id`, `name`, `type` |
| `customization_options`    | Allowed values per customization    | `option_id`, `customization_id`, `value`, `price_modifier` |
| `orders`                   | Order header record                 | `order_id`, `table_id`, `customer_name`, `customer_phone`, `status`, `payment_method`, `total_amount`, `eta_minutes` |
| `order_items`              | Items within an order               | `order_item_id`, `order_id`, `item_id`, `quantity`, `price_at_order_time` |
| `order_item_customizations`| Selected customizations per item    | `id`, `order_item_id`, `customization_id`, `option_id` |
| `order_status_logs`        | Audit trail of every status change  | `log_id`, `order_id`, `status`, `changed_by`, `timestamp` |
| `waiter_assignments`       | Tracks waiter assignments           | `assignment_id`, `order_id`, `waiter_id`, `assigned_at`, `acknowledged`, `served_at` |
| `payments`                 | Payment records per order           | `payment_id`, `order_id`, `method`, `amount`, `status`, `transaction_id`, `paid_at` |
| `reviews`                  | Customer feedback after completion  | `review_id`, `order_id`, `rating`, `comment`, `created_at` |
| `notifications`            | Read/unread notification history    | `notification_id`, `user_id`, `order_id`, `type`, `message`, `is_read`, `created_at` |

---

## Project Structure

```
Restaurant_Ordering_&_Kitchen_Management_System/
├── backend/
│   ├── server.js               # Entry point
│   ├── .env                    # Environment variables (not committed)
│   ├── .env.example            # Environment template
│   ├── package.json
│   └── src/
│       ├── app.js              # Express app setup
│       ├── config/
│       │   └── db.js           # Sequelize connection
│       ├── models/             # Sequelize models
│       ├── controllers/        # Route handlers
│       ├── routes/             # Express routers
│       ├── services/           # Business logic
│       ├── middlewares/        # Auth, role guards, etc.
│       ├── sockets/            # Socket.IO event handlers
│       └── utils/
│           └── logger.js       # Winston logger
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MySQL >= 8
- npm

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd Restaurant_Ordering_&_Kitchen_Management_System

# 2. Install backend dependencies
cd backend
npm install

# 3. Copy the environment template
cp .env.example .env
# → Fill in your values in .env

# 4. Start the server
npm start
```

The API will be available at `http://localhost:5000`.

---

## Environment Variables

Create a `backend/.env` file based on `.env.example`:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=restaurant_db
DB_USER=root
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

LOG_LEVEL=debug
```

---

## API Reference

### API Conventions

- **Base URL:** `/api`
- Success responses: `{ "success": true, "data": ... }`
- Failure responses: `{ "success": false, "message": "..." }`
- Staff routes require JWT in the `Authorization: Bearer <token>` header

---

### Authentication APIs

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| `POST` | `/api/auth/register` | Register a staff account | No |
| `POST` | `/api/auth/login` | Login and receive JWT | No |
| `GET`  | `/api/auth/me` | Get current logged-in user | Yes |
| `POST` | `/api/auth/logout` | Logout current user | Yes |

<details>
<summary>Example — POST /api/auth/register</summary>

**Request:**
```json
{
  "name": "Rahul",
  "phone": "9876543210",
  "password": "123456",
  "role": "waiter"
}
```
**Response 201:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": { "userId": 12, "name": "Rahul", "phone": "9876543210", "role": "waiter" }
}
```
</details>

<details>
<summary>Example — POST /api/auth/login</summary>

**Request:**
```json
{ "phone": "9876543210", "password": "123456" }
```
**Response 200:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "data": { "userId": 12, "name": "Rahul", "role": "waiter" }
}
```
</details>

---

### Role APIs

| Method   | Endpoint           | Purpose        | Auth  |
|----------|--------------------|----------------|-------|
| `GET`    | `/api/roles`       | Get all roles  | Admin |
| `POST`   | `/api/roles`       | Create a role  | Admin |
| `PATCH`  | `/api/roles/:id`   | Update a role  | Admin |
| `DELETE` | `/api/roles/:id`   | Delete a role  | Admin |

---

### User APIs

| Method   | Endpoint           | Purpose             | Auth  |
|----------|--------------------|---------------------|-------|
| `GET`    | `/api/users`       | Get all staff users | Admin |
| `GET`    | `/api/users/:id`   | Get one staff user  | Admin |
| `POST`   | `/api/users`       | Create staff user   | Admin |
| `PATCH`  | `/api/users/:id`   | Update staff user   | Admin |
| `DELETE` | `/api/users/:id`   | Delete staff user   | Admin |

---

### Table APIs

| Method   | Endpoint                       | Purpose              | Auth  |
|----------|--------------------------------|----------------------|-------|
| `GET`    | `/api/tables`                  | Get all tables       | Admin |
| `GET`    | `/api/tables/:id`              | Get one table        | Admin |
| `POST`   | `/api/tables`                  | Create a table       | Admin |
| `PATCH`  | `/api/tables/:id`              | Update table details | Admin |
| `PATCH`  | `/api/tables/:id/status`       | Update table status  | Staff |
| `DELETE` | `/api/tables/:id`              | Delete a table       | Admin |

---

### Category APIs

| Method   | Endpoint                 | Purpose            | Auth  |
|----------|--------------------------|--------------------|-------|
| `GET`    | `/api/categories`        | Get all categories | No    |
| `GET`    | `/api/categories/:id`    | Get one category   | No    |
| `POST`   | `/api/categories`        | Create a category  | Admin |
| `PATCH`  | `/api/categories/:id`    | Update a category  | Admin |
| `DELETE` | `/api/categories/:id`    | Delete a category  | Admin |

---

### Menu Item APIs

| Method   | Endpoint                              | Purpose                  | Auth  |
|----------|---------------------------------------|--------------------------|-------|
| `GET`    | `/api/menu-items`                     | Get all menu items       | No    |
| `GET`    | `/api/menu-items/:id`                 | Get one menu item        | No    |
| `POST`   | `/api/menu-items`                     | Create a menu item       | Admin |
| `PATCH`  | `/api/menu-items/:id`                 | Update a menu item       | Admin |
| `PATCH`  | `/api/menu-items/:id/availability`    | Toggle item availability | Admin |
| `DELETE` | `/api/menu-items/:id`                 | Delete a menu item       | Admin |

---

### Menu Customization APIs

| Method   | Endpoint                                        | Purpose                        | Auth  |
|----------|-------------------------------------------------|--------------------------------|-------|
| `GET`    | `/api/menu-items/:itemId/customizations`         | Get customizations for an item | No    |
| `POST`   | `/api/menu-items/:itemId/customizations`         | Create a customization         | Admin |
| `PATCH`  | `/api/customizations/:id`                        | Update a customization         | Admin |
| `DELETE` | `/api/customizations/:id`                        | Delete a customization         | Admin |
| `POST`   | `/api/customizations/:id/options`                | Add an option to customization | Admin |
| `PATCH`  | `/api/customization-options/:optionId`           | Update an option               | Admin |
| `DELETE` | `/api/customization-options/:optionId`           | Delete an option               | Admin |

---

### Order APIs

| Method   | Endpoint              | Purpose              | Auth     |
|----------|-----------------------|----------------------|----------|
| `POST`   | `/api/orders`         | Place a new order    | No       |
| `GET`    | `/api/orders`         | Get all orders       | Admin    |
| `GET`    | `/api/orders/:id`     | Get one order        | Staff    |
| `PATCH`  | `/api/orders/:id`     | Update order details | Admin    |
| `DELETE` | `/api/orders/:id`     | Delete an order      | Admin    |

<details>
<summary>Example — POST /api/orders</summary>

**Request:**
```json
{
  "tableId": 3,
  "customerName": "Amit",
  "customerPhone": "9876543210",
  "paymentMethod": "razorpay",
  "items": [
    {
      "itemId": 1,
      "quantity": 2,
      "customizations": [{ "customizationId": 1, "optionId": 2 }]
    }
  ]
}
```
**Response 201:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": { "orderId": 101, "status": "placed", "totalAmount": 440 }
}
```
</details>

---

### Order Item APIs

| Method   | Endpoint                           | Purpose                   | Auth  |
|----------|------------------------------------|---------------------------|-------|
| `GET`    | `/api/orders/:orderId/items`       | Get items in an order     | Staff |
| `POST`   | `/api/orders/:orderId/items`       | Add item to an order      | Staff |
| `PATCH`  | `/api/order-items/:itemId`         | Update an order item      | Staff |
| `DELETE` | `/api/order-items/:itemId`         | Remove item from order    | Staff |

---

### Chef Action APIs

| Method  | Endpoint                              | Purpose                           | Auth  |
|---------|---------------------------------------|-----------------------------------|-------|
| `PATCH` | `/api/orders/:id/accept`             | Accept order and set ETA          | Chef  |
| `PATCH` | `/api/orders/:id/start-preparing`    | Mark order as being prepared      | Chef  |
| `PATCH` | `/api/orders/:id/mark-prepared`      | Mark food as ready                | Chef  |

<details>
<summary>Example — PATCH /api/orders/:id/accept</summary>

**Request:**
```json
{ "etaMinutes": 20 }
```
**Response 200:**
```json
{ "success": true, "message": "Order accepted", "data": { "orderId": 101, "status": "accepted", "etaMinutes": 20 } }
```
</details>

---

### Order Status Log APIs

| Method | Endpoint                            | Purpose                        | Auth  |
|--------|-------------------------------------|--------------------------------|-------|
| `GET`  | `/api/orders/:orderId/status-logs`  | Get all status changes         | Staff |
| `POST` | `/api/orders/:orderId/status-logs`  | Manually add a status log      | Admin |

---

### Waiter Assignment APIs

| Method  | Endpoint                                          | Purpose                        | Auth   |
|---------|---------------------------------------------------|--------------------------------|--------|
| `POST`  | `/api/orders/:orderId/assign-waiter`              | Auto-assign next waiter        | System |
| `GET`   | `/api/orders/:orderId/assignment`                 | Get assignment for an order    | Staff  |
| `GET`   | `/api/waiter-assignments`                         | Get all assignments            | Admin  |
| `PATCH` | `/api/waiter-assignments/:assignmentId/acknowledge`| Waiter acknowledges            | Waiter |
| `PATCH` | `/api/waiter-assignments/:assignmentId/serve`     | Mark order as served           | Waiter |
| `PATCH` | `/api/waiter-assignments/:assignmentId/reassign`  | Reassign to different waiter   | Admin  |

---

### Payment APIs

| Method   | Endpoint                                  | Purpose                          | Auth   |
|----------|-------------------------------------------|----------------------------------|--------|
| `POST`   | `/api/payments/razorpay/create-order`     | Create Razorpay payment order    | No     |
| `POST`   | `/api/payments/razorpay/verify`           | Verify Razorpay signature        | No     |
| `PATCH`  | `/api/payments/:orderId/cash-paid`        | Mark cash payment completed      | Waiter |
| `GET`    | `/api/payments/:orderId`                  | Get payment details for order    | Staff  |
| `GET`    | `/api/payments`                           | Get all payments                 | Admin  |
| `PATCH`  | `/api/payments/:paymentId`               | Update payment status            | Admin  |
| `DELETE` | `/api/payments/:paymentId`               | Delete a payment record          | Admin  |

<details>
<summary>Example — POST /api/payments/razorpay/create-order</summary>

**Request:**
```json
{ "orderId": 101, "amount": 440 }
```
**Response 200:**
```json
{
  "success": true,
  "data": { "razorpayOrderId": "order_abc123", "amount": 44000, "currency": "INR" }
}
```
</details>

---

### Review APIs

| Method   | Endpoint               | Purpose           | Auth     |
|----------|------------------------|-------------------|----------|
| `POST`   | `/api/reviews`         | Submit a review   | Customer |
| `GET`    | `/api/reviews`         | Get all reviews   | Admin    |
| `GET`    | `/api/reviews/:id`     | Get one review    | Admin    |
| `PATCH`  | `/api/reviews/:id`     | Update a review   | Admin    |
| `DELETE` | `/api/reviews/:id`     | Delete a review   | Admin    |

---

### Notification APIs

| Method   | Endpoint                                   | Purpose                   | Auth  |
|----------|--------------------------------------------|---------------------------|-------|
| `GET`    | `/api/notifications`                       | Get my notifications      | Yes   |
| `GET`    | `/api/notifications/:id`                   | Get one notification      | Yes   |
| `POST`   | `/api/notifications`                       | Create a notification     | Admin |
| `PATCH`  | `/api/notifications/:id/read`              | Mark as read              | Yes   |
| `DELETE` | `/api/notifications/:id`                   | Delete a notification     | Yes   |

---

### Dashboard and Report APIs

| Method | Endpoint                                        | Purpose                       | Auth   |
|--------|-------------------------------------------------|-------------------------------|--------|
| `GET`  | `/api/dashboard/kitchen`                        | Kitchen order counts          | Chef   |
| `GET`  | `/api/dashboard/waiter`                         | Waiter assignment counts      | Waiter |
| `GET`  | `/api/dashboard/admin`                          | Admin summary                 | Admin  |
| `GET`  | `/api/reports/orders?from=YYYY-MM-DD&to=YYYY-MM-DD` | Order report by date range | Admin  |
| `GET`  | `/api/reports/revenue?from=YYYY-MM-DD&to=YYYY-MM-DD`| Revenue report by date range| Admin |

---

## Socket Events

Real-time events powered by **Socket.IO**:

| Event                 | Triggered When                        | Received By              |
|-----------------------|---------------------------------------|--------------------------|
| `new_order`           | Customer places an order              | Kitchen, Admin           |
| `order_accepted`      | Chef accepts the order                | Customer, Admin          |
| `order_status_changed`| Any order status update               | Customer, Kitchen, Waiter|
| `waiter_assigned`     | Waiter is assigned to an order        | Waiter, Admin            |
| `payment_updated`     | Payment completed or changed          | Customer, Waiter, Admin  |
| `notification_sent`   | A new notification is created         | Relevant user            |

---

## Access Control

| Role       | Permissions |
|------------|-------------|
| **Admin**  | Full access — users, roles, tables, categories, menu, reports, all data |
| **Chef**   | View orders, accept, update preparation status, mark prepared |
| **Waiter** | View assigned orders, acknowledge, serve, collect cash |
| **Customer** | Place order, track status, pay, submit review |

---

## HTTP Status Codes

| Code  | Meaning                | When Used                             |
|-------|------------------------|---------------------------------------|
| `200` | OK                     | Request completed successfully        |
| `201` | Created                | New record created                    |
| `400` | Bad Request            | Validation failed or bad input        |
| `401` | Unauthorized           | Missing or invalid JWT token          |
| `403` | Forbidden              | User role not allowed to do action    |
| `404` | Not Found              | Resource not found                    |
| `409` | Conflict               | Duplicate record (e.g. phone exists)  |
| `500` | Internal Server Error  | Unexpected server problem             |

---

## Build Order

Recommended development sequence:

- [x] Create database tables and foreign keys
- [ ] Build authentication and JWT protection
- [ ] Build menu, category, and customization APIs
- [ ] Build order creation and order item APIs
- [ ] Add order status logs and chef actions
- [ ] Implement waiter assignment logic
- [ ] Integrate Razorpay and cash payment flow
- [ ] Add review and notification APIs
- [ ] Add Socket.IO live updates
- [ ] Build role dashboards (customer, chef, waiter, admin)
- [ ] Test full end-to-end flow

---

## Summary

This is a **production-grade restaurant workflow system**, not a simple ordering app. It features:

- ✅ Structured relational SQL design with proper foreign keys
- ✅ Role-based access control (Admin, Chef, Waiter, Customer)
- ✅ Real-time order updates via Socket.IO
- ✅ Automatic waiter assignment logic
- ✅ Razorpay online + cash payment support
- ✅ Customer reviews and rating system
- ✅ Role-specific dashboards and date-range reports
- ✅ Colorized, structured logging with Winston

Suitable as an **intermediate to advanced full-stack portfolio project**.

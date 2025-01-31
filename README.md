# Event Ticketing System - Backend

## 🚀 Project Overview

This is the **backend** of the **Event Ticketing System**, built using **Node.js, Express.js, TypeScript, Prisma (PostgreSQL ORM), and JWT Authentication**. It provides API endpoints for:

- **Event Management** (CRUD operations)
- **Buyer Authentication** (Register/Login with JWT)
- **Ticket Booking & Retrieval**
- **Event Cancellation & Search/Filtering**

## 🛠️ Tech Stack

- **Backend Framework:** Node.js with Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Express Validator
- **Logging:** Morgan

---

## 📂 Folder Structure

```
/event-ticketing-backend
│── src/                       # Source Code
│   │── controllers/           # API Controllers
│   │── middleware/            # Authentication Middleware
│   │── routes/                # Express Routes
│   │── services/              # Business Logic
│   │── utils/                 # Helper Functions
│── prisma/                    # Prisma ORM Config
│── .env                       # Environment Variables
│── package.json               # Dependencies
│── README.md                  # Documentation
```

---

## 🏗️ Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-repo/event-ticketing-backend.git
cd event-ticketing-backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory and add:

```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/event_ticketing
JWT_SECRET=your_super_secret_key
```

Replace `user`, `password`, and `database` with your PostgreSQL credentials.

### 4️⃣ Setup Prisma Database

Run the following commands to migrate the database:

```bash
npx prisma migrate dev --name init
```

Then, open Prisma Studio to inspect the database:

```bash
npx prisma studio
```

### 5️⃣ Start the Server

```bash
npm run dev
```

The API will be available at **`http://localhost:5000/api`**.

---

## 📜 API Endpoints

### 🔹 Event APIs

| Action                 | Method | Endpoint                                                     |
| ---------------------- | ------ | ------------------------------------------------------------ |
| Fetch All Events       | GET    | `/api/events`                                                |
| Create Event           | POST   | `/api/events`                                                |
| Update Event           | PUT    | `/api/events/:id`                                            |
| Delete Event           | DELETE | `/api/events/:id`                                            |
| Cancel Event           | DELETE | `/api/events/:id/cancel`                                     |
| Search & Filter Events | GET    | `/api/events?name=...&location=...&date=...&status=canceled` |

### 🔹 Buyer APIs

| Action         | Method | Endpoint               |
| -------------- | ------ | ---------------------- |
| Register Buyer | POST   | `/api/buyers/register` |
| Login Buyer    | POST   | `/api/buyers/login`    |

### 🔹 Ticket APIs

| Action           | Method | Endpoint                     |
| ---------------- | ------ | ---------------------------- |
| Book Ticket      | POST   | `/api/tickets/book`          |
| Get User Tickets | GET    | `/api/tickets/user/:contact` |

---

## 🔐 Authentication & Authorization

- **JWT Token Based Authentication**
- Users must **log in** to create, update, or delete events.
- **Protecting Routes:** The `authenticateToken` middleware ensures only authenticated users can access certain routes.

---

## 🛒 Mock Payment Flow (For Ticket Booking)

1. **User initiates booking.**
2. **Mock payment step:** User enters dummy card details.
3. **Upon payment success, the ticket is booked.**

---

## 📜 Prisma Schema (`prisma/schema.prisma`)

```prisma
model Event {
  id               String   @id @default(uuid())
  name             String
  description      String?
  date             DateTime
  location         String
  totalTickets     Int
  availableTickets Int
  status           String   @default("active")
  tickets          Ticket[]
}

model Buyer {
  id       String  @id @default(uuid())
  email    String  @unique
  phone    String? @unique
  password String
  tickets  Ticket[]
}

model Ticket {
  id       String @id @default(uuid())
  eventId  String
  buyerId  String
  event    Event @relation(fields: [eventId], references: [id])
  buyer    Buyer @relation(fields: [buyerId], references: [id])
  qrCode   String
}
```

✅ **Ensure your database schema is migrated using Prisma.**

---

## 🏗️ Environment Variables

```
DATABASE_URL="postgresql://your_user_name:your_password@localhost:5432/event_ticketing"
JWT_SECRET=pangolinmarketing
```

---

## 🎯 Next Steps

1. **Role-based authentication (Admin & Users)**
2. **Improve search & filtering with more criteria**
3. **Implement email notifications for ticket bookings**

🚀 **Now your backend is fully documented! Let me know if you need any changes. ✅**

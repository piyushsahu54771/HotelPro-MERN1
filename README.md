# HotelPro — Hotel Booking & Management System

A MERN-stack starter project for a hotel booking platform. Includes room browsing/search, JWT register/login, booking creation and guest booking history, plus protected admin room/booking APIs.

## Stack
- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication + bcrypt password hashing
- Responsive CSS

## Prerequisites
- Node.js 18+
- npm
- MongoDB local instance or MongoDB Atlas connection string

## Run locally

### 1) Backend
```bash
cd server
copy .env.example .env
npm install
npm run dev
```
Set `MONGO_URI` and `JWT_SECRET` in `server/.env`. The API runs at `http://localhost:5000`.

### 2) Frontend (new terminal)
```bash
cd client
npm install
npm run dev
```
Open the URL Vite prints (usually `http://localhost:5173`).

## First admin account
Register normally, then update that user's `role` to `admin` in MongoDB (collection `users`) to access admin endpoints. Never expose admin registration publicly.

## Main API routes
- `GET /api/rooms` — list/search rooms
- `GET /api/rooms/:id` — room details
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `POST /api/bookings` — create booking (authenticated)
- `GET /api/bookings/my` — current user's bookings
- `GET /api/admin/bookings`, `POST /api/admin/rooms`, `PATCH /api/admin/rooms/:id` — admin only

## Before public deployment
Configure production environment variables, use HTTPS, restrict CORS to your deployed frontend, validate payment provider webhooks before accepting payments, add rate limiting/email verification, and never commit `.env` files.

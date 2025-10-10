# SoilGuard-AI

A minimal, production-ready full-stack app scaffolding for soil health insights, land management, AI insights, and payments.

Tech stack
- Frontend: React (Vite) + Tailwind CSS + React Router + react-leaflet
- Backend: Node.js + Express
- Database & Auth: Supabase (DB + Auth)
- Payments: Paystack (donations + Pro)
- AI: Mocked endpoints (replace later)

## Quick Start

Prerequisites
- Node.js >= 18
- A Supabase project (URL, anon key, service_role key)
- Paystack keys (public, secret). For local dev, backend will mock if not provided.

Setup
1) Create environment files from examples.

Frontend
```
cd frontend
npm install
npm run dev
```

Backend
```
cd backend
npm install
npm run dev
```

Supabase SQL
- Open Supabase SQL editor and run `deploy/schema.sql`.

Environment
- Copy `.env.example` to `.env` in both `frontend/` and `backend/`.

Login / Auth
- Sign up with email/password. On success, a `profiles` row is created with your username.
- Google OAuth is supported if enabled in Supabase.

Map & Land Data
- Add land points (name, coordinates, soil health). CRUD is enforced by RLS policies.

AI (Mock)
- Insights and Assistant pages call backend mock endpoints returning deterministic text.

Payments
- Initiate payments through the backend. Verification updates DB status.

## Scripts
Frontend: `npm run dev`, `npm run build`, `npm run preview`
Backend: `npm run dev`, `npm start`

## Notes
- Do NOT expose `service_role` on the frontend. Only backend uses it.
- See `.env.example` files for required keys.

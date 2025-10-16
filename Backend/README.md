# CaseFlow Backend

## Setup
1. Copy `.env.example` to `.env` and update values for PORT, MONGO_URI, JWT_SECRET.
2. Run `npm install`
3. Seed database: `npm run seed`
4. Start server: `npm run dev` (or `npm start`)
5. APIs available at `/api/auth/*` and `/api/cases/*`

## Notes
- A simple health endpoint is available at `/health`.
- The server includes graceful shutdown handlers for SIGINT/SIGTERM and will close Mongo connections on exit.

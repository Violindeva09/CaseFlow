# CaseFlow (root)

Quick run instructions

1. Backend
   - cd Backend
   - copy `.env.example` to `.env` and update `MONGO_URI` if required
   - npm install
   - npm run dev

2. Frontend
   - cd Frontend
   - npm install
   - npm start

Notes
- Backend default MONGO_URI is `mongodb://localhost:27017/caseflow`. Ensure MongoDB is running locally or update `.env` to point to your Mongo instance.
- Frontend uses Angular CLI (npm start -> ng serve).
- I've added a small TypeScript check script `Frontend/tsc_check.js` you can run with `node tsc_check.js` while in the Frontend folder.

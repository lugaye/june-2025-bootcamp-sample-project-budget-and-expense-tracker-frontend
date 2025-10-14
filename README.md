# Budget & Expense Tracker (Node.js + MySQL)

## Overview
Simple full-stack project to track income and expenses, set budgets, and view summaries.

## Run locally (development)
1. Clone repository.
2. Create MySQL database:
   - Run `mysql -u root -p < schema.sql` (or use a DB GUI).
3. Backend:
   - cd backend
   - copy `.env.example` to `.env` and fill DB credentials and JWT_SECRET
   - npm install
   - npm run dev
4. Frontend:
   - Open `frontend/index.html` in your browser (or serve via any static server)
   - Default backend URL: http://localhost:5000

## Endpoints
- `POST /api/auth/register` {name,email,password}
- `POST /api/auth/login` {email,password}
- `GET /api/categories` (auth)
- `GET /api/transactions` (auth)
- `POST /api/transactions` (auth)
- `DELETE /api/transactions/:id` (auth)
- `GET /api/transactions/summary/by-category` (auth)
- `POST /api/budgets` (auth)
- `GET /api/budgets` (auth)

## Notes for Bootcamp Learners
- Use the provided starter templates to quickly scaffold projects.
- Keep commits small and use feature branches.
- Replace .env values before running.
- To demo to mentors, record your screen and show: register → add transactions → set budget → view chart.

## Improvements (next steps)
- Add pagination for transactions
- Add password reset & email verification
- Add CSV export and PDF report generation
- Add filters (by date range / category)

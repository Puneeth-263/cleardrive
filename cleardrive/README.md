# ClearDrive — Transparent Car Buying Platform

A full-stack project for new car buyers: match cars to a budget, see a
100% itemized on-road price (no hidden costs), and track the booking
in real time from confirmation to delivery.

## Structure

```
cleardrive/
├── cleardrive-backend/     Express REST API (routes → controllers → models)
├── cleardrive-frontend/    React app (Vite) — pages, components, services
└── README.md
```

This mirrors how real production apps are built: two independent
projects that talk to each other only through HTTP APIs, never by
sharing files directly.

## Running it locally

You need Node.js 18+ installed.

### 1. Start the backend (Terminal 1)
```
cd cleardrive-backend
npm install
npm start
```
Runs on **http://localhost:5000**. Test it with:
```
curl http://localhost:5000/api/health
```

### 2. Start the frontend (Terminal 2)
```
cd cleardrive-frontend
npm install
npm run dev
```
Runs on **http://localhost:5173** (Vite will print the exact URL).
Open that URL in your browser.

## Walking through the app

1. **Home** → click "Find my car"
2. **Requirements form** → enter a budget (e.g. 1300000), pick filters, submit
3. **Recommendations** → matching cars appear, click "See true price" on one
4. **Price details** → change state, toggle extended warranty/discount,
   watch the itemized price update live → click "Book this car"
5. **Booking tracker** → click "Simulate next stage (demo only)" repeatedly
   to watch the process move from Booking Confirmed all the way to Delivered

## New features (added on top of the original demo)

| Feature | Notes |
|---|---|
| EMI calculator | Shown automatically on the price details page (3/5/7 year options at 9.5% p.a., not a real bank quote) |
| Car comparison | Select up to 3 cars via the checkbox on any car card, then "Compare" |
| Reviews & ratings | Anyone can post a star rating + comment per car; logged-in users' names are attached automatically |
| User accounts | Email/password signup & login (JWT-based); "My bookings" shows your own booking history |
| Price-drop alerts | Save an email + target price per car. **Does not actually send email** — `/api/alerts/check` only *finds* matching alerts. To make this real, call an email provider (e.g. Resend, SendGrid) inside `alertController.checkAlerts`, and trigger that route on a schedule (cron job, or a scheduled Render job) |
| Admin dashboard | At `/admin`, gated by an `ADMIN_PASSWORD` you set in the backend `.env`. Lets you advance bookings and edit car prices. Editing prices requires MongoDB to be connected |
| Used car listings | Toggle "Used only" on the requirements form, or use the "Used cars" nav link |

### Setting up the new features

Add these to `cleardrive-backend/.env` (see `.env.example`):
```
JWT_SECRET=<run: openssl rand -hex 32>
ADMIN_PASSWORD=<pick a strong password>
```
Without `JWT_SECRET` set, a weak development default is used — fine for local testing, not for a real deployment. Without `ADMIN_PASSWORD` set, `/admin` login will return an error until you add one.



| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/cars` | List all cars |
| GET | `/api/cars/:id` | Get one car |
| POST | `/api/cars/recommendations` | Get matched cars by budget/filters |
| POST | `/api/price/calculate` | Get full itemized price breakdown |
| GET | `/api/price/discount/:carId` | Get active discount for a car |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings/:id` | Get booking status |
| POST | `/api/bookings/:id/advance` | Move booking to next stage (demo/public, rate-limited) |
| GET | `/api/bookings/mine` | Get the logged-in user's bookings (requires login) |
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get the logged-in user (requires login) |
| GET | `/api/reviews/:carId` | Get reviews + average rating for a car |
| POST | `/api/reviews/:carId` | Add a review (works logged out too, with a name) |
| POST | `/api/alerts` | Save a price-drop alert |
| POST | `/api/alerts/check` | Manually check for matching alerts (see notes above) |
| POST | `/api/cars/compare` | Get 2-3 cars by id for side-by-side comparison |
| POST | `/api/admin/login` | Admin login (returns admin token) |
| GET/POST/PATCH/PUT | `/api/admin/...` | Admin-only: list/advance bookings, list/edit cars, edit discounts |

## Car data source

`cleardrive-backend/src/data/cars.json` now contains **11 real car
variants with real ex-showroom prices** (Maruti Swift, Hyundai Creta,
Tata Nexon, Tata Nexon EV, Honda City, Kia Sonet), sourced from public
listings current as of **September 2026**.

Two things to know:
- **Ex-showroom prices** are real published figures and change slowly
  (usually only at model updates or after tax/GST changes), so they'll
  stay accurate for a while.
- **Discount amounts** in `discounts.json` are representative estimates,
  not live-scraped daily offers — real dealer discounts change city by
  city and week by week. Treat these as placeholders to be replaced
  with your own admin-updated numbers, or a real discount-feed
  integration, before this goes live for actual buyers.

To keep this current yourself: edit `cars.json`, `discounts.json`, or
`rtoRates.json` directly — no code changes needed, since the backend
reads them fresh on each restart.

## What's simulated vs. real for this demo

- **Car data, RTO rates, discounts** — stored as JSON files
  (`cleardrive-backend/src/data/`) instead of a real database. Swap
  these for MongoDB/PostgreSQL later without touching routes or
  controllers — that's the point of the `models/` layer.
- **Bookings** — stored in memory (resets when the server restarts).
  In production this would be a real database table.
- **Real-time updates** — the booking tracker polls the backend every
  5 seconds. In production this would use WebSockets (Socket.io) or
  Firebase Realtime Database so updates push instantly instead of
  polling.
- **Loan/EMI, insurance quotes** — not wired to real bank APIs; the
  insurance figure is a simplified 3.5% of ex-showroom price.

## Setting up a real database (MongoDB Atlas — free)

By default, this project reads car/discount data from JSON files and
stores bookings in memory — meaning bookings disappear whenever the
backend restarts (which happens automatically on Render's free tier).
Connecting a real database fixes this permanently, and it's free.

### 1. Create a free MongoDB Atlas account
- Go to **mongodb.com/cloud/atlas/register** → sign up (no credit card needed for the free tier)
- Create a free **M0 cluster** (choose any nearby region)
- Under **Database Access**, create a database user with a username and password (save these)
- Under **Network Access**, click **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) — needed since Render's servers don't have a fixed IP
- Click **Connect** on your cluster → **Drivers** → copy the connection string, which looks like:
  ```
  mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
  ```
- Replace `username` and `password` with the database user you created, and add `/cleardrive` before the `?` so it connects to a database named `cleardrive`:
  ```
  mongodb+srv://username:password@cluster.mongodb.net/cleardrive?retryWrites=true&w=majority
  ```

### 2. Load your car data into it (one-time)
Locally, create a `.env` file inside `cleardrive-backend` (copy `.env.example`) and paste your connection string as `MONGODB_URI`. Then run:
```
cd cleardrive-backend
npm install
npm run seed
```
This loads your 11 cars and their discounts into the database. Safe to re-run any time you update `cars.json` or `discounts.json` and want to refresh the database.

### 3. Connect it in production
In Render → your backend service → **Environment** tab → add:
```
Key:   MONGODB_URI
Value: (your connection string from step 1)
```
Save — Render redeploys automatically. Once connected, all new bookings persist permanently, and restarting the backend no longer erases them.

### How to tell it's working
The backend logs on startup tell you which mode it's in:
- `✅ Connected to MongoDB` → real database, bookings persist
- `⚠️  No MONGODB_URI set. Falling back to local JSON files` → demo mode, bookings are temporary

Check this in Render's **Logs** tab after deploying.

## Deploying (GitHub + Netlify)

Netlify only hosts **static** sites, so it can serve the React frontend
but cannot run the Express backend. You need two deployments:

### 1. Push to GitHub
```
cd cleardrive
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cleardrive.git
git push -u origin main
```
The included `.gitignore` keeps `node_modules` and `.env` files out of
the repo.

### 2. Deploy the backend first (Render, Railway, or similar)
Netlify can't run it, so use a Node-friendly host:
- **Render** (free tier): New → Web Service → connect your GitHub repo
  → set **Root Directory** to `cleardrive-backend` → Build command
  `npm install` → Start command `npm start`.
- Once deployed, copy the live URL, e.g. `https://cleardrive-backend.onrender.com`.
- In that service's environment variables, set:
  `FRONTEND_URL=https://your-site-name.netlify.app` (you'll get this
  URL in step 3 — you can add it after the first deploy).

### 3. Deploy the frontend on Netlify
- Netlify → Add new site → Import from GitHub → pick the `cleardrive` repo.
- Netlify reads the included `netlify.toml` automatically, which sets:
  - Base directory: `cleardrive-frontend`
  - Build command: `npm run build`
  - Publish directory: `dist`
  - A redirect rule so client-side routes like `/car/3/price` don't 404
- Before deploying, add an environment variable in Netlify's site settings:
  `VITE_API_BASE_URL = https://cleardrive-backend.onrender.com/api`
  (use your actual Render URL from step 2, with `/api` at the end)
- Deploy. Netlify gives you a URL like `https://cleardrive.netlify.app`.

### 4. Connect them
Go back to Render and set `FRONTEND_URL` to your Netlify URL, then
redeploy the backend so CORS allows requests from your live site.

### Note on data persistence
Bookings are stored in memory on the backend (see README section
above). Free hosts like Render's free tier restart the server after
inactivity, which will reset any bookings created in the demo. This
is fine for showing the project, but for real use you'd move to a
real database (see "Next steps" below).

## Next steps to make this production-ready

1. Replace JSON files with a real database (MongoDB or PostgreSQL)
2. Add authentication (so a buyer's bookings are tied to their account)
3. Add a showroom-facing admin dashboard to manage stock, discounts,
   and advance real bookings (right now `/advance` is a stand-in for
   that dashboard action)
4. Replace polling with WebSockets for true real-time updates
5. Integrate real RTO/insurance/bank loan APIs

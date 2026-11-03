# FoodBridge – Community Food Donation & Rescue Platform

> **Tagline:** *Share food. Reduce waste. Build a better community.*

FoodBridge is a production-grade full-stack web application engineered to bridge the gap between food abundance and scarcity. It enables restaurants, caterers, bakeries, grocery stores, and households (**Donors**) to share surplus edible food directly with individuals, charities, NGOs, and shelters (**Recipients**).

---

## 🌟 Architecture & Key Features

### 1. Robust Dual-Role Authentication & Access Control
- **JWT & HttpOnly Cookies** paired with bearer token fallback for cross-origin hosting.
- **Bcryptjs password hashing** with salt rounds.
- **Strict Role-Based Authorization** (`Donor` vs. `Recipient`).
  - **Donors** can create, manage, and edit surplus listings, view received claims, and mark pickups as `Collected`.
  - **Recipients** can search, filter, and claim portions, view pickup directions, and cancel active reservations.
- **Registration-First Redirection**: Unauthenticated visitors who attempt to donate or claim food are redirected to authenticate, preserving their destination path.

### 2. Atomic Inventory & Race Condition Prevention
- Prevents overclaiming, negative quantities, expired listings, or concurrent double-reservations using conditional MongoDB atomic operations (`$inc` guarded with `$expr: { $gte: [{ $subtract: ['$quantity', '$claimedQuantity'] }, quantityRequested] }`).
- Cancelling a confirmed claim restores the exact reserved portions back to the donation listing automatically.
- Deleting a donation is guarded: donations with active confirmed claims cannot be deleted until those claims are resolved or cancelled.

### 3. Startup-Grade UI/UX Design System
- **Color Palette:**
  - Primary Background: `#FAFAF7`
  - Secondary Background: `#F0F3ED`
  - Primary Green: `#176B45`
  - Dark Green: `#1E382A`
  - Accent Green: `#238052`
  - Primary Text: `#24352B`
  - Secondary Text: `#788078`
  - Card Background: `#FFFFFF`
  - Borders: `#E9ECE5`
- **Typography:** Manrope for bold modern headings, DM Sans for clean readable body copy.
- **Lucide React** vector icons throughout.
- Fully responsive across desktop, tablet, and mobile with empty states, loading skeletons, and notification toasts.

---

## 📁 Project Structure

```
c:\foodbridge\
├── backend\
│   ├── config\
│   │   └── db.js                 # MongoDB Atlas Mongoose connection
│   ├── controllers\
│   │   ├── authController.js      # User registration, login, logout, me
│   │   ├── donationController.js  # Create, read, explore, edit, delete donations
│   │   ├── claimController.js     # Atomic reservation, my claims, cancel, collect
│   │   ├── dashboardController.js # Aggregated metrics for Donor & Recipient dashboards
│   │   └── userController.js      # Profile viewing & updating
│   ├── middleware\
│   │   ├── authMiddleware.js      # JWT verification, isDonor, isRecipient
│   │   └── errorHandler.js        # Central error formatter & validation handler
│   ├── models\
│   │   ├── User.js                # Users collection schema & bcrypt hooks
│   │   ├── Donation.js            # Donations schema with status lifecycle
│   │   └── Claim.js               # Claims schema with compound indexes
│   ├── routes\
│   │   ├── authRoutes.js          # /api/auth
│   │   ├── donationRoutes.js      # /api/donations
│   │   ├── claimRoutes.js         # /api/claims
│   │   ├── dashboardRoutes.js     # /api/dashboard
│   │   └── userRoutes.js          # /api/users
│   ├── render.yaml                # Render cloud deployment blueprint
│   ├── seeder.js                  # Database seeder with realistic test data
│   ├── test-suite.js              # Comprehensive 13-point automated test suite
│   ├── server.js                  # Express application entrypoint
│   ├── package.json
│   └── .env.example
│
└── frontend\
    ├── public\
    ├── src\
    │   ├── assets\
    │   ├── components\
    │   │   ├── Navbar.jsx         # Sticky navigation with role-aware actions
    │   │   ├── Footer.jsx         # Footer with quick links & social information
    │   │   ├── Sidebar.jsx        # Dashboard sidebar navigation
    │   │   ├── ProtectedRoute.jsx # Route authentication guard
    │   │   ├── RoleRoute.jsx      # Donor/Recipient role guard
    │   │   ├── FoodCard.jsx       # Card component for donation listings
    │   │   ├── StatCard.jsx       # Metric cards for dashboards
    │   │   ├── Loading.jsx        # Loading spinner & skeleton
    │   │   └── EmptyState.jsx     # Friendly empty state renderer
    │   ├── context\
    │   │   └── AuthContext.jsx    # React Context for auth state & actions
    │   ├── pages\
    │   │   ├── Home.jsx           # Landing page with hero, categories & mission
    │   │   ├── Register.jsx       # Split-layout registration with role selector
    │   │   ├── Login.jsx          # Login with password toggle & return redirection
    │   │   ├── DonorDashboard.jsx # Donor metrics, recent posts & received claims
    │   │   ├── RecipientDashboard.jsx # Recipient metrics & recommended food
    │   │   ├── DonateFood.jsx     # Surplus donation submission form
    │   │   ├── ExploreFood.jsx    # Food marketplace with search & category filters
    │   │   ├── FoodDetails.jsx    # Complete item details & claim form
    │   │   ├── MyDonations.jsx    # Donor inventory table with edit & delete
    │   │   ├── ClaimsReceived.jsx # Donor pickup verification & collection
    │   │   ├── MyClaims.jsx       # Recipient claims history with cancellation
    │   │   ├── Profile.jsx        # Profile management & security info
    │   │   ├── Unauthorized.jsx   # 403 Forbidden page
    │   │   └── NotFound.jsx       # 404 Not Found page
    │   ├── services\
    │   │   └── api.js             # Axios instance with auth interceptors
    │   ├── App.jsx                # React Router tree
    │   ├── App.css
    │   ├── index.css              # Tailwind CSS configuration & design system
    │   └── main.jsx
    ├── vercel.json                # Vercel SPA rewrite configuration
    ├── vite.config.js             # Vite + Tailwind v4 configuration
    ├── package.json
    └── .env.example
```

---

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

#### Backend:
```bash
cd backend
npm install
```

#### Frontend:
```bash
cd ../frontend
npm install
```

---

### Step 2: Environment Setup

#### 1. Backend (`backend/.env`):
Create `backend/.env` (or copy from `backend/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/foodbridge?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
```
*(If running locally without MongoDB Atlas yet, you can also use `mongodb://localhost:27017/foodbridge`)*

#### 2. Frontend (`frontend/.env`):
Create `frontend/.env` (or copy from `frontend/.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

### Step 3: Seed Database (Optional but Recommended)
Populate MongoDB with high-quality sample food listings, donors, recipients, and claims:
```bash
cd backend
npm run seed
```

**Pre-seeded Demo Accounts:**
- **Donor 1:** `donor@bakery.org` | Password: `Password123!`
- **Donor 2:** `donor@catering.com` | Password: `Password123!`
- **Recipient 1:** `shelter@hope.org` | Password: `Password123!`
- **Recipient 2:** `youth@center.org` | Password: `Password123!`

---

### Step 4: Run the Application

#### Start Backend:
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

#### Start Frontend:
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🧪 Automated Testing

FoodBridge comes with an automated end-to-end integration test suite verifying 13 core operational scenarios with an in-memory MongoDB engine:
```bash
cd backend
npm test
```

### Verified Scenarios:
1. Donor registration with password hashing & HttpOnly JWT.
2. Recipient registration with role segregation.
3. User login & credential authentication.
4. Role Route Guard: blocks Recipient from posting a donation (403 Forbidden).
5. Donor creates surplus food listing.
6. Explore marketplace lists donation with accurate remaining quantity calculation.
7. Recipient claims portion with real-time atomic inventory reservation.
8. Prevents overclaiming when requested quantity exceeds available remaining.
9. Blocks donation deletion when active confirmed claims exist.
10. Donor marks claim as collected upon pickup handover.
11. Claim cancellation restores the reserved quantity back to available inventory.
12. Donor and Recipient dashboards display live calculated metrics.
13. User profile updating without role tampering.

---

## 🌐 Production Deployment

### 1. Database (MongoDB Atlas)
1. Log in to [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a free M0 cluster.
3. Under **Database Access**, create a user with read/write privileges.
4. Under **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere) to permit Render connections.
5. Copy your connection string and substitute `<username>` and `<password>`.

### 2. Backend (Render)
1. Create a **New Web Service** on [Render](https://render.com).
2. Connect your Git repository and set the root directory to `backend`.
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`
5. Configure Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGO_URI`: `your_mongodb_atlas_connection_string`
   - `JWT_SECRET`: `a_strong_random_secret_key`
   - `CLIENT_URL`: `https://your-frontend-domain.vercel.app`

### 3. Frontend (Vercel)
1. Import your project into [Vercel](https://vercel.com).
2. Set the root directory to `frontend`.
3. Framework Preset: **Vite**.
4. Configure Environment Variable:
   - `VITE_API_URL`: `https://your-backend-api.onrender.com/api`
5. Deploy. The included `frontend/vercel.json` ensures full client-side route handling without 404 errors.

---

## 📄 License
MIT License. Built for zero-waste communities and hunger relief.


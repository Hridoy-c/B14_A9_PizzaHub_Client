# 🍕 PizzaHub

PizzaHub is a pizza marketplace where vendors list their pizzas, customers browse and order them, and admins keep the platform in order. It has three role-based dashboards (customer, vendor, admin), Stripe-powered vendor subscriptions, and a warm, responsive interface.

**Live site:** https://b14-a9-pizza-hub-client.vercel.app/
**Client repository:** `ADD_CLIENT_REPO_LINK`
**Server repository:** `ADD_SERVER_REPO_LINK`

## Admin access (for evaluators)

| Email | Password |
| --- | --- |
| `ADD_ADMIN_EMAIL` | `ADD_ADMIN_PASSWORD` |

Admin accounts cannot be created from the public sign-up form.

## Features

### Public
- Home page with Hero, About, Explore (featured pizzas), Why Choose Us, How It Works, Testimonials marquee, FAQ and a call-to-action banner.
- Browse Menu page with search, category filter and location filter.
- Six categories: Classic, Vegetarian, Meat Lovers, Specialty / Gourmet, Sides & Appetizers, Beverages & Desserts.
- Premium vendors get a Premium badge on their cards.
- Item details page with an order dialog (delivery date, address, message).
- Custom 404 page.

### Authentication
- Email and password sign-up and sign-in, plus Google and GitHub social login (Better Auth).
- Sign up as a **customer** or a **vendor**. The admin role can never be self-selected.
- Password rules with a live requirements checklist.
- Profile page with name and photo update (ImgBB upload).

### Customer dashboard
- Overview with order stats.
- My Orders with status tabs and cancellation of pending orders.
- Settings: change name, change password, sign out other sessions, delete account.

### Vendor dashboard
- Overview with daily order and revenue stats.
- Add menu item with image upload. The free plan allows 3 active items.
- My Menu with edit and delete dialogs.
- Incoming orders with accept and reject actions.
- Subscription page. A one-time Stripe Checkout payment unlocks unlimited items and the Premium badge.

### Admin dashboard
- Platform overview: revenue, orders and signups with 7-day comparison, order status mix, and items needing attention.
- Manage Menu Items: approve or reject vendor items, filter by status.
- Manage Users: search by name or email, filter by role, view details, block and unblock users.
- Transactions: all Stripe payments with vendor name, amount, status and payment ID.

### Security
- Role-based route protection on the client (customer / vendor / admin).
- Every protected Express route verifies the session token, checks the user's role, and blocks banned users.
- Ownership is checked on the server. User ids are taken from the verified session, never from the request body.

## Tech stack

**Client** (this repository)
- Next.js (App Router), React, TypeScript
- Tailwind CSS, shadcn/ui, Base UI, lucide-react
- Better Auth (with the admin and JWT plugins) and `@better-auth/mongo-adapter`
- Stripe, `mongodb`
- sonner (toasts), react-fast-marquee, recharts, embla-carousel-react
- ImgBB for image hosting

**Server** (separate repository)
- Node.js, Express, MongoDB
- Stripe

## Packages used

`next`, `react`, `typescript`, `tailwindcss`, `better-auth`, `@better-auth/mongo-adapter`, `mongodb`, `stripe`, `sonner`, `lucide-react`, `react-fast-marquee`, `recharts`, `embla-carousel-react`, `@base-ui/react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `cmdk`, `react-day-picker`, `input-otp`

## Getting started

### 1. Clone and install

```bash
git clone ADD_CLIENT_REPO_LINK
cd pizza-hub-client
npm install
```

### 2. Environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_IMGBB_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
STRIPE_SECRET_KEY=
```

Never commit this file.

### 3. Run the client

```bash
npm run dev
```

Open http://localhost:3000.

### 4. Run the server

The Express API lives in its own repository.

```bash
git clone ADD_SERVER_REPO_LINK
cd pizza-hub-server
npm install
npm start
```

Server environment variables:

```env
PORT=8000
MONGODB_URI=
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=
```

Use the same MongoDB database for client and server, because the server reads Better Auth's `user` and `session` collections.

### 5. Production checklist
- Set `BETTER_AUTH_URL` to the deployed client URL.
- Set `NEXT_PUBLIC_API_BASE_URL` to the deployed server URL.
- Set `FRONTEND_URL` on the server to the deployed client URL so CORS allows it.
- Add the production redirect URIs in the Google and GitHub OAuth apps.

## How requests are secured

1. The browser talks only to the Next.js app.
2. Next.js server code reads the Better Auth session and sends its token to Express as `Authorization: Bearer <token>`.
3. Express looks the token up in the `session` collection, rejects expired sessions, loads the user, and rejects banned users.
4. Role middleware (`verifyAdmin`, `verifyVendor`, `verifyCustomer`) and ownership checks decide whether the request is allowed.

## Project structure

```
src/
├── app/            Routes: (auth), (root), (dashboard), api
├── components/     auth, dashboard, root (home, menu), shared, ui
├── hooks/          Reusable hooks
└── lib/            auth, session helpers, API clients, server actions, types, utils
```

## Order statuses

`pending` → `accepted` or `rejected` (by the vendor). A customer can cancel while the order is `pending`.

## License

This project was built for an assignment and is for educational use.
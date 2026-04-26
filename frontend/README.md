# Paradise Hotel Frontend

React frontend for the Paradise Hotel practical project. The app integrates with the provided backend API and keeps the backend contract unchanged.

## Requirements

- Node.js 18+
- npm
- Running backend API on `http://localhost:4000` or a custom URL

## Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the production bundle:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

## Environment

If the backend runs on a different URL, create `frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:4000
```

## Project Structure

- `src/pages/` application pages for guest, user, and admin flows
- `src/components/` shared layout and routing components
- `src/components/ui/` reusable UI primitives and their CSS files
- `src/context/` authentication state management
- `src/services/` API client and endpoint wrappers
- `src/layouts/` layout shell
- `src/assets/` static assets

## Features

- user registration and login
- client-side protected routes
- room availability search with filters
- reservation creation and cancellation
- user reservations page
- admin dashboard, reservations management, and locations/rooms CRUD

## Notes

- The supplied backend remains the source of truth.
- DTO field names follow the provided API contract.

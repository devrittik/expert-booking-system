# Project Structure

This document reflects the **Folder Structure** of the Expert Booking System.

## Root

```text
Expert Booking System/
|-- client/
|-- server/
|-- README.md
|-- roadmap.md
|-- structure.md
|-- guide.md
```

## Frontend

```text
client/
|-- public/
|-- src/
|   |-- assets/
|   |   |-- hero.png
|   |   |-- react.svg
|   |   `-- vite.svg
|   |-- components/
|   |   |-- booking/
|   |   |   |-- BookingForm.jsx
|   |   |   |-- SuccessModal.jsx
|   |   |   `-- TimeSlotPicker.jsx
|   |   |-- common/
|   |   |   |-- Badge.jsx
|   |   |   |-- ErrorState.jsx
|   |   |   |-- Loader.jsx
|   |   |   |-- Navbar.jsx
|   |   |   `-- Pagination.jsx
|   |   |-- experts/
|   |   |   |-- ExpertCard.jsx
|   |   |   |-- ExpertFilters.jsx
|   |   |   `-- SearchBar.jsx
|   |   `-- slots/
|   |       `-- SlotGrid.jsx
|   |-- constants/
|   |   `-- index.js
|   |-- context/
|   |   |-- SocketContext.jsx
|   |   `-- useSocketContext.js
|   |-- hooks/
|   |   |-- useBooking.js
|   |   |-- useExperts.js
|   |   |-- useMyBookings.js
|   |   `-- useSocket.js
|   |-- pages/
|   |   |-- AdminBookingsPage.jsx
|   |   |-- BookingPage.jsx
|   |   |-- ExpertDetailPage.jsx
|   |   |-- ExpertListPage.jsx
|   |   `-- MyBookingsPage.jsx
|   |-- services/
|   |   |-- api.js
|   |   |-- bookingService.js
|   |   `-- expertService.js
|   |-- utils/
|   |   |-- formatters.js
|   |   `-- validators.js
|   |-- App.css
|   |-- App.jsx
|   |-- index.css
|   `-- main.jsx
|-- .env.example
|-- eslint.config.js
|-- index.html
|-- package.json
|-- package-lock.json
`-- vite.config.js
```

### Frontend Responsibilities

- `App.jsx`
  Handles routing for:
  - `/experts`
  - `/experts/:id`
  - `/book`
  - `/my-bookings`
  - `/admin/bookings`

- `main.jsx`
  Wraps the app with:
  - `BrowserRouter`
  - `QueryClientProvider`
  - `SocketProvider`

- `pages/`
  Route-level screens:
  - `ExpertListPage.jsx` for expert search, category filter, URL-synced pagination
  - `ExpertDetailPage.jsx` for slot viewing and live slot updates
  - `BookingPage.jsx` for booking submission and inline form validation
  - `MyBookingsPage.jsx` for user booking lookup by email
  - `AdminBookingsPage.jsx` for the mock demo admin booking/status view

- `services/`
  Central API calls for experts and bookings using a shared Axios instance.

- `hooks/`
  React Query and socket-related hooks:
  - booking creation/status update
  - expert fetching
  - booking lookup
  - slot realtime updates

- `context/`
  Socket.io client context shared across the app.

- `utils/validators.js`
  Client-side booking validation using `yup`.

## Backend

```text
server/
|-- src/
|   |-- config/
|   |   `-- db.js
|   |-- controllers/
|   |   |-- bookingController.js
|   |   `-- expertController.js
|   |-- middlewares/
|   |   |-- errorHandler.js
|   |   `-- validate.js
|   |-- models/
|   |   |-- Booking.js
|   |   `-- Expert.js
|   |-- routes/
|   |   |-- bookingRoutes.js
|   |   `-- expertRoutes.js
|   |-- socket/
|   |   `-- slotHandler.js
|   |-- utils/
|   |   `-- ApiError.js
|   `-- seed.js
|-- .env.example
|-- app.js
|-- package.json
|-- package-lock.json
`-- server.js
```

### Backend Responsibilities

- `server.js`
  Creates the HTTP server, attaches Socket.io, connects MongoDB, and starts the app.

- `app.js`
  Configures:
  - CORS
  - JSON parsing
  - API route mounting
  - 404 fallback
  - global error handling

- `models/Expert.js`
  Stores expert profile data and grouped slot availability.

- `models/Booking.js`
  Stores booking records and uses a compound unique index on:
  - `expert`
  - `date`
  - `timeSlot`

- `controllers/expertController.js`
  Handles:
  - paginated expert listing
  - category filtering
  - text search
  - expert detail fetch

- `controllers/bookingController.js`
  Handles:
  - booking creation
  - booking lookup by email or all bookings for admin demo view
  - booking status updates
  - realtime events for:
    - `slot:booked`
    - `slot:released`
    - `booking:statusChanged`

- `routes/bookingRoutes.js`
  Applies server-side validation for:
  - name
  - email
  - phone
  - expert id
  - date
  - time slot
  - booking status

- `seed.js`
  Seeds demo experts across these categories:
  - Technology
  - Finance
  - Health
  - Legal
  - Marketing
  - Career
  - Education
  - Business
  - Design
  - Fitness

## Current API Surface

### Experts

- `GET /api/experts?page=&limit=&category=&search=`
- `GET /api/experts/:id`

### Bookings

- `POST /api/bookings`
- `GET /api/bookings?email=...`
- `GET /api/bookings`
  Used by the mock admin page to fetch all bookings
- `PATCH /api/bookings/:id/status`

### Misc

- `GET /api/health`

## Realtime Flow

- When a booking is created:
  - backend marks the slot as booked
  - backend emits `slot:booked`
  - expert detail pages disable that slot live

- When booking status changes:
  - backend emits `booking:statusChanged`
  - client invalidates booking/expert queries

- When a booking is cancelled:
  - backend marks the slot as available again
  - backend emits `slot:released`
  - expert detail pages re-enable that slot live

## Notes

- The admin page is intentionally a **mock/demo view** only.
- Authentication and role management are **not implemented**.
- The project uses React Query invalidation plus Socket.io events for lightweight synchronization.

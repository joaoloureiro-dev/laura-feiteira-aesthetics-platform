## Overview

The project is split into two main applications:

- `frontend`: React application for the public website, client area, and owner dashboard.
- `backend`: Fastify API responsible for authentication, bookings, payments, emails, availability, analytics, and admin operations.

## Main Modules

### Frontend

- Public website
- Authentication pages
- Client dashboard
- Owner dashboard
- Booking flow
- Payment flow
- Reviews section

### Backend

- Auth module
- Users module
- Services module
- Bookings module
- Availability module
- Payments module
- Emails module
- Analytics module

## Database

The database will use PostgreSQL hosted on Neon.

## Deployment

The frontend will be deployed on Vercel.

The backend will have a primary deployment on Railway and a secondary failover deployment on Render.
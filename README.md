
# HRMS - Human Resource Management System

A full-stack HR management system built for hackathon.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Tailwind CSS, Shadcn/UI, TanStack Query, Zustand |
| Backend | Node.js, Express 5, TypeScript |
| Database | MongoDB + Mongoose |
| Cache | Redis |
| Auth | JWT + bcryptjs |
| Security | Helmet, CORS, Rate Limiting, AES-256 Encryption |
| Upload | Cloudinary CDN |
| Email | Resend |

## Features

- Admin & Employee dashboards
- Employee management
- Attendance tracking (check-in/out)
- Leave requests & approvals
- Payroll & salary management
- Profile with image upload
- Audit logging
- Role-based access control

## Quick Start

```bash
# 1. Install dependencies
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..

# 2. Start MongoDB & Redis (requires Docker)
docker-compose -f docker/docker-compose.yml up -d

# 3. Start development
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

## Default Login

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hrms.com | Admin@123 |
| Employee | employee@hrms.com | Employee@123 |

## Project Structure

```
├── client/                 # React frontend
│   └── src/
│       ├── api/            # API calls
│       ├── components/     # UI components
│       ├── hooks/          # Custom hooks
│       ├── pages/          # Route pages
│       ├── stores/         # Zustand stores
│       └── types/          # TypeScript types
├── server/                 # Express backend
│   └── src/
│       ├── config/         # DB, Redis, Cloudinary
│       ├── middleware/      # Auth, RBAC, Rate Limiter
│       ├── models/         # Mongoose models
│       ├── services/       # Business logic
│       ├── controllers/    # Request handlers
│       ├── routes/         # API routes
│       └── utils/          # Helpers, JWT, Encryption
├── docker/                 # Docker configs
└── shared/                 # Shared types
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/signup` | Register |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh` | Refresh token |
| POST | `/api/v1/auth/logout` | Logout |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/me` | My profile |
| PUT | `/api/v1/users/me` | Update profile |
| GET | `/api/v1/users` | All users (Admin) |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/attendance/check-in` | Check in |
| POST | `/api/v1/attendance/check-out` | Check out |
| GET | `/api/v1/attendance/me` | My attendance |

### Leave
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/leaves/apply` | Apply leave |
| GET | `/api/v1/leaves/me` | My leaves |
| GET | `/api/v1/leaves/pending` | Pending (Admin) |
| PUT | `/api/v1/leaves/:id/status` | Approve/Reject (Admin) |

### Payroll
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/payroll/me` | My payroll |
| PUT | `/api/v1/payroll/:userId` | Update salary (Admin) |

## Environment Variables

Copy `.env.example` to `.env`:

```bash
# Server
PORT=5000
MONGODB_WRITE_URI=mongodb://admin:password@localhost:27017/hrms?authSource=admin
MONGODB_READ_URI=mongodb://admin:password@localhost:27018/hrms?authSource=admin
REDIS_URL=redis://:redispassword@localhost:6379
JWT_ACCESS_SECRET=your-64-character-secret-key-here
JWT_REFRESH_SECRET=your-64-character-refresh-secret-here
ENCRYPTION_KEY=your-32-byte-hex-key-here
CORS_ORIGIN=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Resend (Email)
RESEND_API_KEY=re_xxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Client
VITE_API_URL=http://localhost:5000/api/v1
```

## Scripts

```bash
npm run dev          # Start server + client
npm run build        # Build for production
npm run test         # Run tests
npm run db:seed      # Seed database
npm run docker:up    # Start Docker services
npm run docker:down  # Stop Docker services
```

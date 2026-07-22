# 🚀 Task Management System — Technical Assessment

A full-stack, responsive Task Management application built for the **Koncepthive Technical Assessment**. Featuring user authentication, dashboard analytics with interactive data visualizations (Recharts), task CRUD operations, real-time title search, status & priority filtering, sorting, and mobile responsiveness.

---

## 🌐 Live Production Links & Credentials

| Resource | Live Production URL |
|---|---|
| 🖥️ **Live Web Application (Frontend)** | [https://task-manager-app-d1kg.vercel.app/](https://task-manager-app-d1kg.vercel.app/) |
| ⚡ **Live Backend API** | [https://task-manager-app-ashy-rho.vercel.app/](https://task-manager-app-ashy-rho.vercel.app/) |
| 🗄️ **Database** | PostgreSQL (Hosted on **Supabase**) |

### 🔐 Default Assessment Credentials

| Email | Password | Role |
|---|---|---|
| `admin@test.com` | `123456` | Admin / User |

---

## ✨ Features & Highlights

- **🔐 User Authentication**: Secure login using JWT (JSON Web Tokens) and `bcryptjs` password hashing with protected route guards.
- **📊 Analytics & Visualizations**: Interactive Recharts components:
  - **Task Status Donut Chart**: Distribution across Pending, In Progress, Completed, and Overdue statuses.
  - **Priority Bar Chart**: Breakdown across Low, Medium, and High task priorities.
  - **Show/Hide Analytics Toggle**: Sleek button to toggle chart visibility on demand.
- **⚡ Overview Statistics Cards**: 5 metric cards (Total, Pending, In Progress, Completed, Overdue) with left gradient glows, glowing box shadows, and responsive single-row layout (`grid-cols-5`).
- **📝 Complete Task Management (CRUD)**: Create, Read, Update, and Delete tasks with custom confirmation modals and toast notifications.
- **🔍 Search, Filter & Sort**:
  - Live title search bar.
  - Dropdown filters for Status and Priority.
  - Sorting by Newest Created, Oldest Created, and Due Date.
- **📅 Modern Task Modal (`TaskModal.jsx`)**: Glassmorphism container, dark mode native date picker with custom calendar icon, interactive focus rings, and glowing gradient action buttons.
- **🎨 Premium Dark Slate Aesthetic**: Custom styling matching a cohesive dark slate palette (`slate-950` background, glassmorphism `backdrop-blur-xl`, ambient glow effects).

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18 (Vite), Tailwind CSS v4, Recharts, Lucide Icons, React Hot Toast, Axios |
| **Backend** | Node.js, Express.js, JWT (`jsonwebtoken`), `bcryptjs`, CORS, `pg` (Node Postgres Pool) |
| **Database** | PostgreSQL (Supabase Hosted PostgreSQL) |
| **Deployment** | Vercel (Frontend & Serverless Backend) |

---

## 📁 Project Structure

```
task-manager-app/
├── backend/
│   ├── config/          # PostgreSQL Database Pool setup & IPv4 pooler logic
│   ├── controllers/     # Auth and Task controller business logic
│   ├── middleware/      # JWT verification middleware
│   ├── routes/          # Auth & Task REST API routes
│   ├── vercel.json      # Standalone Vercel deployment config for backend
│   ├── .env.example     # Backend environment template
│   ├── server.js        # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Login, Dashboard & TaskModal React components
│   │   ├── context/     # AuthContext state manager & user session persistence
│   │   ├── services/    # Axios instance & token interceptors
│   │   ├── App.jsx      # Auth guard & toaster wrapper
│   │   └── index.css    # Tailwind CSS rules & dark mode styling
│   ├── vercel.json      # Standalone Vercel deployment config for frontend
│   ├── package.json
│   └── vite.config.js
├── database/
│   └── schema.sql       # PostgreSQL table schemas & initial seed migration
├── .gitignore
└── README.md            # Project documentation & assessment guide
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL database or Supabase account

---

### 1. Database Migration
Run the SQL script located at `database/schema.sql` in your **Supabase SQL Editor** or local PostgreSQL instance:

```sql
-- Creates 'users' and 'tasks' tables and seeds default user:
-- Email: admin@test.com
-- Password: 123456
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres.ektqllxwrrnxqdhtuywj:WuJ037hazfXJSvcj@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres
JWT_SECRET=super_secret_jwt_key_2026
```

Start the backend server:
```bash
npm run dev
# Backend running at http://localhost:5000
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/` (optional for local dev):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
# Frontend running at http://localhost:5173
```

---

## 📡 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Request Body / Headers |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user & return signed JWT token | `{ "email": "admin@test.com", "password": "123456" }` |

### Task Endpoints (Requires `Authorization: Bearer <JWT_TOKEN>`)
| Method | Endpoint | Description | Query Parameters / Body |
|---|---|---|---|
| `GET` | `/api/tasks/stats` | Fetch overview metric counts | None |
| `GET` | `/api/tasks` | Fetch tasks with search, filter & sort | `?search=title&status=Pending&priority=High&sort=newest\|oldest\|due_date` |
| `POST` | `/api/tasks` | Create a new task | `{ "title": "...", "priority": "High", "due_date": "YYYY-MM-DD", "status": "Pending", "description": "..." }` |
| `GET` | `/api/tasks/:id` | Fetch single task by ID | None |
| `PUT` | `/api/tasks/:id` | Update task by ID | `{ "status": "Completed" }` |
| `DELETE` | `/api/tasks/:id` | Delete task by ID | None |

---

## 💡 Key Design & Business Decisions

1. **User Scope & Data Isolation**: Tasks are associated with `user_id` foreign keys to ensure data isolation.
2. **Dynamic Overdue Calculation**: Tasks are evaluated as overdue dynamically when `due_date < CURRENT_DATE` and `status != 'Completed'`.
3. **Date Validation**: Due dates cannot be set prior to today's date during creation or editing.
4. **Vercel IPv4 Pooler Integration**: The backend automatically routes database queries through Supabase's IPv4 connection pooler to ensure zero network latency and 100% serverless connection uptime.

---

## 📄 License

Built for **Koncepthive Technical Assessment** by Ishara Madhushankha. MIT License.

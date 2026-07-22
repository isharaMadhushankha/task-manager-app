# Task Management System

A full-stack Task Management application built for Koncepthive Technical Assessment. It enables user authentication, dashboard analytics with data visualizations, task CRUD management, title search, status/priority filtering, and sorting.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), Tailwind CSS v4, Lucide Icons, Recharts, React Hot Toast, Axios
- **Backend**: Node.js, Express.js, JWT (jsonwebtoken), bcryptjs, CORS
- **Database**: PostgreSQL (Supabase), `pg` (node-postgres Pool)

---

## 📁 Project Structure

```
task-manager-app/
├── backend/
│   ├── config/          # Database Pool setup (PostgreSQL/Supabase)
│   ├── controllers/     # Auth and Task controller business logic
│   ├── middleware/      # JWT verification middleware
│   ├── routes/          # Auth and Task API endpoints
│   ├── .env.example     # Environment template
│   ├── server.js        # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Login & Dashboard React components
│   │   ├── context/     # AuthContext state manager
│   │   ├── services/    # Axios instance & token interceptor
│   │   ├── App.jsx      # Auth guard & toaster wrapper
│   │   └── index.css    # Tailwind CSS rules
│   ├── package.json
│   └── vite.config.js
├── database/
│   └── schema.sql       # PostgreSQL schema & seed migration file
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL database or Supabase account

### 1. Database Setup
Run the SQL script located at `database/schema.sql` in your **Supabase SQL Editor** or local PostgreSQL instance:
```sql
-- Creates 'users' and 'tasks' tables and seeds default user:
-- Email: admin@test.com
-- Password: 123456
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
JWT_SECRET=your_jwt_secret_key_here
```

Start the backend server:
```bash
npm run dev
# Server running at http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

---

## 🔐 Default Credentials

| Email | Password | Role |
|---|---|---|
| `admin@test.com` | `123456` | Admin / User |

---

## 📡 API Documentation

### Authentication Routes
| Method | Endpoint | Description | Request Body / Headers |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | `{ "email": "admin@test.com", "password": "123456" }` |

### Task Routes (Requires `Authorization: Bearer <JWT_TOKEN>`)
| Method | Endpoint | Description | Query Parameters / Body |
|---|---|---|---|
| `GET` | `/api/tasks/stats` | Fetch Dashboard metric counts | None |
| `GET` | `/api/tasks` | Fetch tasks with search, filter & sort | `?search=title&status=Pending&priority=High&sort=newest\|oldest\|due_date` |
| `POST` | `/api/tasks` | Create a new task | `{ "title": "...", "priority": "High", "due_date": "YYYY-MM-DD", "status": "Pending", "description": "..." }` |
| `GET` | `/api/tasks/:id` | Fetch single task by ID | None |
| `PUT` | `/api/tasks/:id` | Update task by ID | `{ "status": "Completed" }` |
| `DELETE` | `/api/tasks/:id` | Delete task by ID | None |

---

## 💡 Assumptions Made

1. **User Scope**: Each user accesses their own tasks (`user_id` foreign key association).
2. **Overdue Calculation**: Tasks are marked overdue dynamically when `due_date < CURRENT_DATE AND status != 'Completed'`.
3. **Date Validation**: Due dates cannot be set to a past date during task creation/update.

---

## 📝 License
MIT

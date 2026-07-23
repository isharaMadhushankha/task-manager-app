# Task Management System

A modern **Full-Stack Task Management Application** built for the **Koncepthive Technical Assessment**. This application enables users to securely manage tasks through a clean, responsive interface featuring authentication, analytics, task management, filtering, searching, sorting, and Light/Dark mode support.

---

# Desktop Preview

<table align="center">
  <tr>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/db89d26b-a525-4e62-8108-b04db32a4420" alt="Dashboard"/>
    </td>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/4dd22877-c7f0-4aeb-a321-3408ce7a73c6" alt="Task List"/>
    </td>
  </tr>

  <tr>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/89d0ebb6-8533-4dbb-bda6-33a9c4d770fc" alt="Analytics"/>
    </td>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/bc5085dd-8929-4aeb-91c1-76219d3b0e24" alt="Dark Mode"/>
    </td>
  </tr>
</table>


## 🔐 Mobile View

<table align="center">
  <tr>
    <td align="center" width="25%">
      <img src="https://github.com/user-attachments/assets/59a9ddd7-3e7c-45ca-a9a3-80f4a20360fc" width="250" alt="Passenger Home"/>
    </td>
    <td align="center" width="25%">
      <img src="https://github.com/user-attachments/assets/cdde99bd-d35c-4a36-bf3a-ebcc52c90987"" width="250" alt="Passenger Home"/>
    </td>
    <td align="center" width="25%">
       <img src="https://github.com/user-attachments/assets/d8c928fd-1c00-4215-b5ae-c7caad645177" width="250" alt="Passenger Home"/>
    </td>
    <td align="center" width="25%">
       <img src="https://github.com/user-attachments/assets/cfff5682-3e3b-415b-9509-03fe8c973f75" width="250" alt="Passenger Home"/>
    </td>

  </tr>
</table>


---

# Live Demo

| Resource | Link |
|----------|------|
| Live Application | https://task-manager-app-d1kg.vercel.app/ |
| Backend API | https://task-manager-app-ashy-rho.vercel.app/ |
| Database | Supabase PostgreSQL |

## Demo Credentials

| Email | Password |
|--------|----------|
| admin@test.com | 123456 |

---

# Features

## Authentication

- Secure JWT Authentication
- Password Hashing using bcryptjs
- Protected Routes
- Persistent Login Sessions

## Task Management

- Create Tasks
- View Tasks
- Update Tasks
- Delete Tasks
- Delete Confirmation Dialog
- Toast Notifications

## Dashboard

- Total Tasks
- Pending Tasks
- In Progress Tasks
- Completed Tasks
- Overdue Tasks

## Analytics

- Task Status Distribution (Donut Chart)
- Task Priority Distribution (Bar Chart)
- Toggle Analytics Visibility

## Search, Filter & Sort

- Live Search by Task Title
- Filter by Status
- Filter by Priority
- Sort by Newest
- Sort by Oldest
- Sort by Due Date

## User Experience

- Clean Modern Interface
- Light & Dark Mode
- Frosted Glass Navigation
- Fully Responsive Layout
- Mobile Optimized

---

# Technology Stack

| Layer | Technologies |
|--------|--------------|
| Frontend | React 18, Vite, Tailwind CSS v4 |
| UI Libraries | Lucide React, React Hot Toast |
| Charts | Recharts |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Authentication | JWT, bcryptjs |
| Database | PostgreSQL |
| Cloud Database | Supabase |
| Deployment | Vercel |

---

# Project Structure

```text
task-manager-app/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   ├── vercel.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── vercel.json
│   └── package.json
│
├── database/
│   └── schema.sql
│
├── assets/
│   ├── login-desktop.png
│   ├── login-mobile.png
│   ├── dashboard-desktop.png
│   └── dashboard-mobile.png
│
└── README.md
```

---

# Getting Started

## Prerequisites

- Node.js v18 or later
- PostgreSQL or Supabase
- npm

---

## Clone the Repository

```bash
git clone https://github.com/your-username/task-manager-app.git

cd task-manager-app
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file inside the **backend** directory.

```env
PORT=5000

DATABASE_URL=YOUR_DATABASE_URL

JWT_SECRET=YOUR_SECRET_KEY
```

Run the backend server.

```bash
npm run dev
```

Backend URL

```
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Create a `.env` file inside the **frontend** directory.

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run the frontend.

```bash
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# API Endpoints

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Authenticate User |

## Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Retrieve All Tasks |
| GET | `/api/tasks/stats` | Retrieve Dashboard Statistics |
| GET | `/api/tasks/:id` | Retrieve a Single Task |
| POST | `/api/tasks` | Create a Task |
| PUT | `/api/tasks/:id` | Update a Task |
| DELETE | `/api/tasks/:id` | Delete a Task |

---

# Design Decisions

- Clean and modern UI inspired by Apple's design principles.
- JWT-based authentication for secure access.
- User-specific task isolation.
- Dynamic overdue task calculation.
- Responsive design for desktop, tablet, and mobile devices.
- Theme preference persisted using Local Storage.

---

# Future Enhancements

- Drag-and-Drop Kanban Board
- Calendar View
- Team Collaboration
- Email Notifications
- File Attachments
- Activity History
- User Profile Management
- Export Tasks to PDF and Excel

---

# Author

**Ishara Madhushankha**

Software Engineering Graduate

**GitHub:** https://github.com/your-username

**LinkedIn:** https://linkedin.com/in/your-profile

---

# License

This project was developed as part of the **Koncepthive Technical Assessment**.

Licensed under the **MIT License**.

---

# Support

If you found this project useful, consider starring the repository on GitHub.

# 🚀 Task Management System

A modern **Full-Stack Task Management Application** built for the **Koncepthive Technical Assessment**. This application allows users to securely manage tasks through a clean, responsive, and Apple-inspired interface with authentication, analytics, task management, filtering, search, sorting, and Light/Dark mode support.

---

## 🌐 Live Demo

| Resource | Link |
|----------|------|
| 🖥️ **Live Application** | https://task-manager-app-d1kg.vercel.app/ |
| ⚡ **Backend API** | https://task-manager-app-ashy-rho.vercel.app/ |
| 🗄️ **Database** | Supabase PostgreSQL |

### 🔑 Demo Credentials

| Email | Password |
|--------|----------|
| **admin@test.com** | **123456** |

---

# 📸 Screenshots

## 🔐 Mobile View

<table align="center">
  <tr>
    <td align="center" width="25%">
      <img src="https://github.com/user-attachments/assets/59a9ddd7-3e7c-45ca-a9a3-80f4a20360fc" width="250" alt="Passenger Home"/>
      <br><sub><b>1. Home / Route Search</b></sub>
    </td>
    <td align="center" width="25%">
      <img src="https://github.com/user-attachments/assets/cdde99bd-d35c-4a36-bf3a-ebcc52c90987"" width="250" alt="Passenger Home"/>
      <br><sub><b>2. Dynamic Seat Matrix</b></sub>
    </td>
    <td align="center" width="25%">
       <img src="https://github.com/user-attachments/assets/d8c928fd-1c00-4215-b5ae-c7caad645177" width="250" alt="Passenger Home"/>
      <br><sub><b>3. Live Location Tracking</b></sub>
    </td>
    <td align="center" width="25%">
       <img src="https://github.com/user-attachments/assets/cfff5682-3e3b-415b-9509-03fe8c973f75" width="250" alt="Passenger Home"/>
      <br><sub><b>4. Digital Boarding Pass</b></sub>
    </td>

  </tr>
</table>
---

## 📊 Dashboard

<table align="center">
  <tr>
    <td align="center" width="33.33%">
      <img src="https://github.com/user-attachments/assets/7a969a6c-bf1f-4d4d-b019-41601f35daee" alt="Dashboard"/>
      <br><sub><b>1. Dashboard</b></sub>
    </td>

    <td align="center" width="33.33%">
      <img src="https://github.com/user-attachments/assets/0ad9636c-84df-4fcd-b43c-3fb8d535ba66" alt="Task Management"/>
      <br><sub><b>2. Task Management</b></sub>
    </td>

    <td align="center" width="33.33%">
      <img src="https://github.com/user-attachments/assets/07e02e5c-cc40-4f05-93cd-e6bc9151eeb1" width="500" alt="Analytics"/>
      <br><sub><b>3. Analytics Dashboard</b></sub>
    </td>
  </tr>
</table>

---

# ✨ Features

## 🔐 Authentication

- Secure JWT Authentication
- Password Hashing using bcryptjs
- Protected Routes
- Persistent Login Session

## 📝 Task Management

- Create Tasks
- View Tasks
- Update Tasks
- Delete Tasks
- Confirmation Dialog
- Toast Notifications

## 📊 Dashboard Analytics

- Total Tasks
- Pending Tasks
- In Progress Tasks
- Completed Tasks
- Overdue Tasks

## 📈 Data Visualization

- Task Status Donut Chart
- Priority Bar Chart
- Show / Hide Analytics

## 🔍 Search, Filter & Sort

- Live Search by Title
- Filter by Status
- Filter by Priority
- Sort by Newest
- Sort by Oldest
- Sort by Due Date

## 🎨 User Experience

- Apple Design System
- Light / Dark Mode
- Frosted Glass Navigation
- Fully Responsive
- Mobile Friendly

---

# 🛠️ Technology Stack

| Layer | Technologies |
|--------|--------------|
| **Frontend** | React 18, Vite, Tailwind CSS v4 |
| **UI Libraries** | Lucide React, React Hot Toast |
| **Charts** | Recharts |
| **HTTP Client** | Axios |
| **Backend** | Node.js, Express.js |
| **Authentication** | JWT, bcryptjs |
| **Database** | PostgreSQL |
| **Cloud Database** | Supabase |
| **Deployment** | Vercel |

---

# 📁 Project Structure

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

# 🚀 Getting Started

## Prerequisites

- Node.js v18 or later
- PostgreSQL or Supabase
- npm

---

## Clone Repository

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

Create a `.env` file inside the **backend** folder.

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

Create a `.env` file inside the **frontend** folder.

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

# 📡 API Documentation

## Authentication

| Method | Endpoint | Description |
|----------|----------|-------------|
| POST | `/api/auth/login` | Login User |

---

## Tasks

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/tasks` | Get All Tasks |
| GET | `/api/tasks/stats` | Dashboard Statistics |
| GET | `/api/tasks/:id` | Get Single Task |
| POST | `/api/tasks` | Create Task |
| PUT | `/api/tasks/:id` | Update Task |
| DELETE | `/api/tasks/:id` | Delete Task |

---

# 💡 Design Decisions

- Apple-inspired design language with a clean and minimal interface.
- Secure authentication using JWT.
- User-specific task isolation.
- Dynamic overdue task calculation.
- Responsive layout optimized for desktop and mobile devices.
- Theme preference stored using Local Storage.

---

# 🚀 Future Improvements

- Drag & Drop Task Board
- Calendar View
- Team Collaboration
- Email Notifications
- File Attachments
- Activity Logs
- User Profiles
- Export Tasks to PDF & Excel

---

# 👨‍💻 Author

**Ishara Madhushankha**

Software Engineering Graduate

- 💻 GitHub: https://github.com/your-username
- 🔗 LinkedIn: https://linkedin.com/in/your-profile

---

# 📄 License

This project was developed for the **Koncepthive Technical Assessment**.

Licensed under the **MIT License**.

---

## ⭐ Support

If you found this project useful, consider giving it a **⭐ Star** on GitHub.

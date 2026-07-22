🚀 Task Management System

A modern Full-Stack Task Management Application built for the Koncepthive Technical Assessment. This application enables users to securely manage their daily tasks through a clean, responsive, and Apple-inspired user interface. It includes authentication, analytics, task management, filtering, search, sorting, and a seamless Light/Dark mode experience.

🌟 Preview

Add your project banner here (Optional)

![Banner](assets/banner.png)
🛠️ Built With
<p align="left"> <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" /> <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" /> <img src="https://img.shields.io/badge/TailwindCSS-v4-38BDF8?logo=tailwindcss&logoColor=white" /> <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" /> <img src="https://img.shields.io/badge/PostgreSQL-Supabase-3FCF8E?logo=supabase&logoColor=white" /> <img src="https://img.shields.io/badge/JWT-Authentication-orange" /> <img src="https://img.shields.io/badge/License-MIT-blue" /> </p>
🌐 Live Demo
🖥️ Frontend

https://task-manager-app-d1kg.vercel.app/

⚡ Backend API

https://task-manager-app-ashy-rho.vercel.app/

🗄️ Database

Supabase PostgreSQL

🔑 Demo Login
Email	Password
admin@test.com	123456
📸 Screenshots
🔐 Login Page
Desktop View	Mobile View

	
📊 Dashboard
Desktop View	Mobile View

	
✨ Features
🔐 Authentication
Secure JWT Authentication
Password Encryption using bcryptjs
Protected Routes
Persistent User Session
📝 Task Management
Create Tasks
View Tasks
Edit Tasks
Delete Tasks
Confirmation Modal
Toast Notifications
📊 Dashboard Analytics
Overview Statistics
Total Tasks
Pending Tasks
In Progress Tasks
Completed Tasks
Overdue Tasks
📈 Charts
Task Status Donut Chart
Priority Bar Chart
Toggle Analytics Section
🔍 Search & Filter
Live Search by Task Title
Filter by Status
Filter by Priority
Sort by Newest
Sort by Oldest
Sort by Due Date
🎨 UI/UX
Apple Inspired Design System
Light Mode
Dark Mode
Frosted Glass Navigation
Fully Responsive
Mobile Friendly
Desktop Optimized
🛠 Technology Stack
Layer	Technologies
Frontend	React 18, Vite, Tailwind CSS v4
UI	Lucide Icons, React Hot Toast
Charts	Recharts
HTTP Client	Axios
Backend	Node.js, Express.js
Authentication	JWT, bcryptjs
Database	PostgreSQL
Cloud Database	Supabase
Deployment	Vercel
📂 Project Structure
task-manager-app/
│
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
│   ├── vite.config.js
│   ├── tailwind.config.js
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
🚀 Getting Started
Prerequisites
Node.js (18 or later)
PostgreSQL or Supabase
npm
Clone Repository
git clone https://github.com/your-username/task-manager-app.git

cd task-manager-app
Backend Setup
cd backend

npm install

Create a .env file.

PORT=5000

DATABASE_URL=YOUR_DATABASE_URL

JWT_SECRET=YOUR_SECRET_KEY

Run Backend

npm run dev

Backend

http://localhost:5000
Frontend Setup
cd frontend

npm install

Create .env

VITE_API_BASE_URL=http://localhost:5000/api

Run Frontend

npm run dev

Frontend

http://localhost:5173
📡 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/login	Login User
Tasks
Method	Endpoint	Description
GET	/api/tasks	Get All Tasks
GET	/api/tasks/stats	Dashboard Statistics
GET	/api/tasks/:id	Get Single Task
POST	/api/tasks	Create Task
PUT	/api/tasks/:id	Update Task
DELETE	/api/tasks/:id	Delete Task
💡 Design Decisions
Apple-inspired clean interface with a minimal and modern layout.
JWT authentication ensures secure access to protected resources.
Tasks are isolated per authenticated user.
Overdue tasks are calculated dynamically based on the due date.
Responsive design optimized for both desktop and mobile devices.
Theme preference is stored using Local Storage for a seamless experience.
📅 Future Improvements
Drag & Drop Task Board
Calendar View
Team Collaboration
Email Notifications
File Attachments
Activity Logs
User Profile Management
Export Tasks to PDF/Excel
👨‍💻 Author

Ishara Madhushankha

Software Engineering Graduate

📧 Email: your-email@example.com

🔗 LinkedIn: https://linkedin.com/in/your-profile

💻 GitHub: https://github.com/your-username

📄 License

This project was developed as part of the Koncepthive Technical Assessment.

Licensed under the MIT License.

⭐ Support

If you found this project useful, please consider giving it a ⭐ Star on GitHub. It helps others discover the project and supports future development.

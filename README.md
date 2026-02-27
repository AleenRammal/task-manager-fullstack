
A full-stack Task Manager application built with React, Express, Prisma, and PostgreSQL.

This project demonstrates:
- RESTful API development
- Database integration using Prisma ORM
- Full CRUD operations
- Responsive dashboard UI


 Overview

The Task Manager allows users to:

- Create tasks
- Update task status
- Update task priority
- Delete tasks
- Retrieve tasks by ID
- View all tasks in a dashboard layout



Tech Stack

Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL

 Frontend
- React
- Vite
- Custom CSS



 Project Structure


task-manager-fullstack/
│
├── task-api/
│   ├── prisma/
│   ├── src/
│   └── server.js
│
└── task-ui/
    ├── src/
    └── vite.config.js

 Installation & Setup

 Clone the Repository

bash
git clone https://github.com/AleenRammal/task-manager-fullstack.git
cd task-manager-fullstack

 Backend Setup

Navigate to backend folder:

bash
cd task-api
npm install


Create `.env` file:

env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/task_manager?schema=public"
PORT=3000


Run Prisma migration:

bash
npx prisma migrate dev


Start server:

bash
npm run dev


Backend runs at:


http://localhost:3000



 Frontend Setup

Open a new terminal:

bash
cd task-ui
npm install
npm run dev


Frontend runs at:

http://localhost:5173

 API Documentation

 Base URL


http://localhost:3000/api/tasks


 Create Task

POST `/api/tasks`

json
{
  "taskName": "Finish report",
  "description": "Write and submit the report",
  "assignedUser": "Aleen",
  "dueDate": "2026-02-27",
  "priority": "MEDIUM",
  "status": "PENDING"
}


 Get All Tasks

GET `/api/tasks`

 Get Task By ID

GET `/api/tasks/:id`

Example:


GET /api/tasks/1


 Update Task

PUT `/api/tasks/:id`

Example:

json
{
  "status": "COMPLETED"
}


 Delete Task

DELETE `/api/tasks/:id`



 Database Schema

prisma
model Task {
  id           Int      @id @default(autoincrement())
  taskName     String
  description  String?
  assignedUser String
  dueDate      DateTime
  priority     String
  status       String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

 Sample API Requests (cURL)

 Create Task

bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "taskName":"Study Prisma",
    "description":"Finish Prisma docs",
    "assignedUser":"Aleen",
    "dueDate":"2026-02-27",
    "priority":"HIGH",
    "status":"IN_PROGRESS"
  }'


 Update Task

bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"COMPLETED"}'

 

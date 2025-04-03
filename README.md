📌 Overview

The Task Manager Web App is a simple and intuitive application that allows users to manage their daily tasks efficiently. The app provides authentication, task CRUD operations, and secure data persistence with a user-friendly interface.

🚀 Features

1️⃣ UI Development (React + CSS)

Responsive and clean UI design.

Dashboard to display all tasks.

Form to add new tasks.

Edit and delete buttons for managing tasks.

2️⃣ Authentication (JWT/Session-based)

User signup and login functionality.

Protected task-related endpoints to ensure only authenticated users access their tasks.

3️⃣ API Calls (Frontend & Backend Integration)

Fetch tasks for the logged-in user from the backend.

Perform API requests to create, edit, and delete tasks.

4️⃣ Database Connectivity (MongoDB)

Stores user details and tasks securely.

Ensures that each user can only see and manage their own tasks.

5️⃣ Hosting (Deployment)

Frontend: Hosted on Vercel.

Backend: Hosted on Render.

🌟 Bonus Features

Task categories (e.g., Work, Personal, Urgent).

"Mark as Completed" feature.

UI animations for better user experience.

🛠️ Tech Stack

Frontend: React, CSS

Backend: Node.js, Express.js

Database: MongoDB

Authentication: JWT (JSON Web Token)

Hosting: Vercel (Frontend), Render (Backend)

🔧 Setup & Installation

Clone the repository

git clone https://github.com/ABHIKALVIUM/new-1
cd task-manager-app

Install dependencies

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

Setup Environment Variables

Create a .env file in the backend directory and add the following:

MONGO_URI= "mongodb+srv://abhishekchaudhari:Abhishek21@cluster0.xgoxv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

Run the Application

# Start backend server
cd backend
npm start

# Start frontend server
cd frontend
npm start

Access the app

Open http://localhost:3000 in your browser.

🚀 Deployment

Deployment Link:  https://new-1-chi.vercel.app/

Deploy Backend: https://backend-a1yu.onrender.com/api/auth/me

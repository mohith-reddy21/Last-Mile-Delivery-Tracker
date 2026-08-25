Last-Mile Delivery Tracker

A full-stack web application for managing and tracking last-mile
deliveries.

🚚 Project Overview

The Last-Mile Delivery Tracker provides a web interface for user
authentication, creating deliveries, viewing deliveries, and tracking
delivery status.

Main Components

Frontend: React.js

Backend: Node.js / Express.js

Database: MongoDB

Authentication: JWT

Deployment: Render

✨ Features

User login/authentication

Create deliveries

View personal deliveries

Track delivery status

REST API backend

MongoDB data storage

JWT-based authentication

Separate frontend and backend deployments

🛠️ Technology Stack

Layer            Technology

Frontend         React.js
Backend          Node.js, Express.js
Database         MongoDB
Authentication   JWT
API              REST
Deployment       Render

📁 Project Structure

Last-Mile-Delivery-Tracker/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── CreateDelivery.js
│   │   ├── MyDeliveries.js
│   │   ├── TrackDelivery.js
│   │   └── ...
│   ├── package.json
│   └── ...
│
└── README.md

🌐 Live Deployment

Frontend

https://last-mile-delivery-tracker-fronted-fabj.onrender.com

Backend API

https://last-mile-delivery-tracker-9ggm.onrender.com

The backend root endpoint confirms that the Last-Mile Delivery Tracker
API is running.

⚙️ Environment Variables

Configure these variables in the backend deployment environment:

MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secure_jwt_secret

Important: Never commit real database credentials, passwords, JWT
secrets, or API keys to GitHub.

💻 Running Locally

1. Clone the repository

git clone https://github.com/mohith-reddy21/Last-Mile-Delivery-Tracker.git
cd Last-Mile-Delivery-Tracker

2. Start the backend

cd backend
npm install
node server.js

The backend normally runs on:

http://localhost:5000

3. Start the frontend

Open another terminal:

cd frontend
npm install
npm start

The React development server normally runs on:

http://localhost:3000

🔐 Authentication

The application uses JWT authentication.

The backend requires:

JWT_SECRET

This secret is used to sign and verify authentication tokens.

🗄️ Database

The application uses MongoDB for persistent data storage.

The MongoDB connection string is configured through:

MONGO_URI

For the deployed backend, these values are stored as Render environment
variables rather than in source code.

🚀 Deployment Configuration

Backend --- Render Web Service

Root directory: backend

Build command: npm install

Start command: node server.js

Auto-deploy: enabled

Frontend --- Render Static Site

Root directory: frontend

Build command: npm install && npm run build

Publish directory: build

The frontend communicates with the deployed backend through its REST
API.

🧪 Testing the Application

After deployment:

Open the frontend URL.

Log in with a valid account.

Create a delivery.

Open My Deliveries.

Open Track Delivery.

Verify that delivery data is saved and retrieved from MongoDB.

🔒 Security Notes

Keep MONGO_URI private.

Keep JWT_SECRET private.

Do not commit .env files containing secrets.

Use a strong production JWT secret.

Configure MongoDB network access appropriately for production.

👨‍💻 Author

Mohith Reddy

GitHub: https://github.com/mohith-reddy21/Last-Mile-Delivery-Tracker

📌 Project Status

The application is deployed on Render, and the login/authentication flow
is working with the required JWT configuration.

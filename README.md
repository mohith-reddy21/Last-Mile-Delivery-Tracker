# Last-Mile Delivery Tracker

A full-stack web application for managing, creating, and tracking last-mile deliveries.

## Project Overview

The Last-Mile Delivery Tracker is a web-based delivery management system that allows users to log in, create delivery requests, view their deliveries, and track the delivery status of packages through different stages.

The application uses React.js for the frontend, Node.js and Express.js for the backend, and MongoDB for database management.

## Features

- User registration and login
- JWT-based authentication
- Delivery creation
- View personal deliveries
- Delivery tracking
- Delivery status management
- Delivery progress visualization
- Pickup and delivery address management
- Package details management
- MongoDB database integration
- REST API backend
- Responsive user interface

## Delivery Status

Deliveries can progress through the following stages:

1. Pending
2. Accepted
3. Picked Up
4. Out for Delivery
5. Delivered

## Technologies Used

### Frontend

- React.js
- React Router
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)

### Development Tools

- Visual Studio Code
- Git
- GitHub
- npm

## Project Structure

```text
Last-Mile-Delivery-Tracker/
│
├── backend/
│   ├── controllers/
│   │   ├── deliveryController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── delivery.js
│   │   └── user.js
│   │
│   ├── routes/
│   │   ├── deliveryRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── CreateDelivery.js
│   │   ├── MyDeliveries.js
│   │   └── TrackDelivery.js
│   │
│   └── package.json
│
├── .gitignore
└── README.md

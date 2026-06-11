# CampusConnect 🎓

CampusConnect is an enterprise-grade university recruitment and event management platform built on the MERN stack (MongoDB, Express, React, Node.js). It bridges the gap between university students, placement officers, and corporate recruiters in a single, unified interface.

![CampusConnect Banner](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite React](https://img.shields.io/badge/Vite_React-Frontend-purple?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-teal?style=for-the-badge&logo=tailwindcss&logoColor=white)

## ✨ Features

### 👨‍🎓 For Students
* **Automated Resume Generation**: Instantly build and download a perfectly formatted PDF resume directly from your profile data using `html2pdf.js`.
* **Job & Internship Board**: Browse real-time job postings, apply with one click, and track application statuses.
* **Company Reviews**: Research companies with anonymous, crowdsourced peer reviews (1-5 star ratings) from former interns and employees.
* **Campus Events**: Discover and register for upcoming university workshops, pre-placement talks, and hackathons.

### 🏢 For Recruiters
* **Company Management**: Create and manage verified company profiles with logos via Cloudinary integration.
* **Job Postings**: Publish detailed job postings with salary, location, and requirements.
* **Application Tracking**: View all student applications, filter by qualifications, and update application statuses (Pending, Accepted, Rejected) in real time via WebSockets.

### 🏫 For Placement Officers
* **Event Management**: Create campus-wide events, coordinate workshops, and track student registration.
* **Student Verification**: Monitor university-wide recruitment metrics.

## 🛠 Tech Stack

* **Frontend**: React.js, Vite, TailwindCSS, Redux Toolkit, React Router, Socket.io-client, Lucide Icons, html2pdf.js
* **Backend**: Node.js, Express.js, Socket.io, Mongoose
* **Database**: MongoDB Atlas
* **Cloud Storage**: Cloudinary (for profile pictures and company logos)
* **Authentication**: JWT Cookies, bcryptjs
* **Email System**: Nodemailer (SMTP configuration supported)

## 🚀 Local Installation

### Prerequisites
* Node.js v18+
* MongoDB Atlas Cluster (or local instance)
* Cloudinary Account

### 1. Clone the repository
```bash
git clone https://github.com/ashi-rvad/CampusConnect.git
cd CampusConnect
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Cloudinary (Optional, for image uploads)
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# SMTP (Optional, for email verification)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_user
SMTP_PASS=your_pass
```

Run the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Run the frontend client:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

## ☁️ Deployment

This platform is production-ready.
* **Frontend**: Configured for deployment on Vercel (includes `vercel.json` for React Router).
* **Backend**: Configured for deployment on Render or Heroku.

Make sure to set the `FRONTEND_URL` environment variable on your backend host exactly to your Vercel domain (without a trailing slash) to bypass CORS restrictions.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is open-source.

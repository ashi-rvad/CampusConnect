import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import http from 'http';
import { connectDB } from './config/db.js';
import { initSocket } from './config/socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));

// Database Connection
connectDB();

// Routes Import
import authRouter from './routes/auth.routes.js';
import studentRouter from './routes/student.routes.js';
import companyRouter from './routes/company.routes.js';
import jobRouter from './routes/job.routes.js';
import applicationRouter from './routes/application.routes.js';

// Routes Declaration
app.use('/api/auth', authRouter);
app.use('/api/students', studentRouter);
app.use('/api/companies', companyRouter);
app.use('/api/jobs', jobRouter);
app.use('/api/applications', applicationRouter);

app.get('/', (req, res) => {
    res.send('API is running...');
});

import { notFound, errorHandler } from './middlewares/error.middleware.js';

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

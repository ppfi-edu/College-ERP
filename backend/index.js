// const express = require('express');
// const connectDB = require('./utils/db.js');
// const cors = require('cors')

import express from 'express';
import {connectDB} from './utils/db.js';
import cors from 'cors';

const app = express();
// connectDB();
const PORT = 5173

app.use(express.json());
app.use(cors({}))


import studentRoutes from './routes/studentRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventsRoutes.js';
import feeRoutes from './routes/feeRoutes.js';

// Mounting routes
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notice', noticeRoutes);
app.use('/api/login', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/fee', feeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
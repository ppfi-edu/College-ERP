// const express = require('express');
import express from 'express';
const router = express.Router();
// const adminFacultyAuthController = require('../controllers/adminFacultyAuthController');
// const * as studentAuthController = require('../controllers/studentAuthController');
import * as adminFacultyAuthController from '../controllers/adminFacultyAuthController.js';
import * as studentAuthController from '../controllers/studentAuthController.js';

router.post('/admin-faculty', adminFacultyAuthController.adminFacultyLogin);

router.post('/student', studentAuthController.studentLogin);

// module.exports = router;
export default router;

// const express = require('express');
// const router = express.Router();
// const adminController = require('../controllers/adminController');

import express from 'express';
const router = express.Router();
import * as adminController from '../controllers/adminController.js';

router.get("/:id", adminController.getAdminById)
router.post('/faculty', adminController.createFaculty);
router.post('/students', adminController.createStudent);

// module.exports = router;
export default router;

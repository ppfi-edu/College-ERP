// const express = require('express');
import express from 'express';
const router = express.Router();
// const facultyController = require('../controllers/facultyController');
import * as facultyController from '../controllers/facultyController.js';

router.get('/', facultyController.getAllFaculty);
router.get('/:id', facultyController.getFacultyById);
router.post('/', facultyController.createFaculty);
router.put('/:id', facultyController.updateFaculty);
router.delete('/:email', facultyController.deleteFaculty);

// module.exports = router;
export default router;

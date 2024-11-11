// const express = require('express');
import express from 'express';
const router = express.Router();
// const studentController = require('../controllers/studentController');
import * as studentController from '../controllers/studentController.js';

router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', studentController.createStudent);
router.post('/update-attendance', studentController.updateAttendance);
router.post('/total-attendance', studentController.totalAttendance);
router.put('/:id', studentController.updateStudent);
router.delete('/:email', studentController.deleteStudent);
router.post('/avg', studentController.averageAttendance);
router.post('/attendance', studentController.fetchAllattendanceofStudent);

// module.exports = router;
export default router;
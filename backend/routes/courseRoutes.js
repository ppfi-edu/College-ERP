// const express = require('express');
import express from 'express';

const router = express.Router();
// const courseController = require('../controllers/courseController');
import * as courseController from '../controllers/courseController.js';

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:name', courseController.deleteCourse);

// module.exports = router;
export default router;

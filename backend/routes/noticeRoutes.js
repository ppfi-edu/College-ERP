// const express = require('express');
import express from 'express';
const router = express.Router();
// const noticeController = require('../controllers/noticeController');
import * as  noticeController from '../controllers/noticeController.js';


router.get('/', noticeController.getAllNotice);
router.post('/add', noticeController.addNotice);
router.delete('/:id', noticeController.deleteNotice);

// module.exports = router;
export default router;

const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

router.get('/', eventsController.getAllEventImages);
router.post('/upload', eventsController.uploadEvent);


module.exports = router;
import express from 'express';
const router = express.Router();
// const eventsController = require('../controllers/eventsController');
import { getAllEventImages, uploadEvent } from '../controllers/eventsController.js';

router.get('/', getAllEventImages);
router.post('/upload', uploadEvent);


// module.exports = router;
export default router;
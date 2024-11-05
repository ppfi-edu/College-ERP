import express from 'express';
import * as libController from '../controllers/libController.js';

const router = express.Router();

router.get('/', libController.getAllLib);
router.post('/add', libController.addLib);
router.post('/IssueBook/:id', libController.IssueBook);
router.post('/return/:id', libController.ReturnBook);
router.delete('/remove/:id', libController.removeBook);



export default router;


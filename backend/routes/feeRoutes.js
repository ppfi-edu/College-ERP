import * as feeController from '../controllers/feeController.js';
import express from 'express';


const router = express.Router();

router.get('/Fee', feeController.getAllFee);
router.get('/:id', feeController.getFeeById);
router.post('/create-fee', feeController.createFee);
router.post('/AddFee', feeController.addFeeforAll);
router.post('/update', feeController.updateFeebyId);
router.delete('/delete/:id', feeController.deleteFeeById);
router.post('/getFee', feeController.getTotalFeeofStudent);

export default router;

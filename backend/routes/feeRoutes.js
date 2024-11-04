import * as feeController from '../controllers/feeController.js';
import express from 'express';


const router = express.Router();

router.get('/Fee', feeController.getAllFee);
router.get('/:student_id', feeController.getFeeByIdorEmail);
router.post('/create-fee', feeController.createFee);
router.post('/AddFee', feeController.addFeeforAll);
router.post('/update/:student_id', feeController.updateFeebyId);
router.delete('/delete/:student_id', feeController.deleteFeeById);

export default router;



id SERIAL PRIMARY KEY,
student_id VARCHAR(20) REFERENCES Student(student_id) ON DELETE CASCADE,
reason VARCHAR(255) NOT NULL, -- Reason for the fee (e.g., tuition, library, etc.)
amount DECIMAL(10, 2) NOT NULL, -- Amount of the fee
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
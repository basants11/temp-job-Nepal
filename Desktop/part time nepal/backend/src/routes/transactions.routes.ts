import { Router } from 'express';
import { transactionsController } from '../controllers/transactions.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, transactionsController.create);
router.get('/', authenticate, transactionsController.getMyTransactions);
router.post('/pay', authenticate, transactionsController.processPayment);

export default router;

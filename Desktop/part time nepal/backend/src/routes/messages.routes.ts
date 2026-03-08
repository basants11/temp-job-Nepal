import { Router } from 'express';
import { messagesController } from '../controllers/messages.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, messagesController.send);
router.get('/', authenticate, messagesController.getConversations);
router.get('/conversation/:userId', authenticate, messagesController.getConversation);
router.put('/:messageId/read', authenticate, messagesController.markRead);
router.put('/conversation/:userId/read', authenticate, messagesController.markConversationRead);

export default router;

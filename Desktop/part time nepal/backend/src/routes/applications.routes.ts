import { Router } from 'express';
import { applicationsController } from '../controllers/applications.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, applicationsController.getMyApplications);
router.get('/job/:jobId', authenticate, authorize('EMPLOYER'), applicationsController.getJobApplications);
router.put('/:applicationId', authenticate, authorize('EMPLOYER'), applicationsController.updateStatus);
router.delete('/:applicationId', authenticate, applicationsController.withdraw);

export default router;

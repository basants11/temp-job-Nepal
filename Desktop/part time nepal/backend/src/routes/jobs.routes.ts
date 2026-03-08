import { Router } from 'express';
import { jobsController } from '../controllers/jobs.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', jobsController.findAll);
router.get('/my-jobs', authenticate, authorize('EMPLOYER'), jobsController.getMyJobs);
router.get('/:id', jobsController.findOne);
router.post('/', authenticate, authorize('EMPLOYER'), jobsController.create);
router.put('/:id', authenticate, authorize('EMPLOYER'), jobsController.update);
router.delete('/:id', authenticate, authorize('EMPLOYER'), jobsController.delete);
router.post('/:id/apply', authenticate, authorize('JOBER'), jobsController.apply);

export default router;

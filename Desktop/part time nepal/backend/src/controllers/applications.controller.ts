import { Response } from 'express';
import { applicationsService } from '../services/applications.service';
import { AuthRequest } from '../middleware/auth';

export class ApplicationsController {
  
  async getMyApplications(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { status } = req.query;
      
      const applications = await applicationsService.getUserApplications(userId, status as string);
      
      res.json({
        success: true,
        data: { applications },
      });
    } catch (error) {
      throw error;
    }
  }

  async getJobApplications(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { jobId } = req.params;
      
      const applications = await applicationsService.getJobApplications(jobId, userId);
      
      res.json({
        success: true,
        data: { applications },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { applicationId } = req.params;
      const { status } = req.body;
      
      const application = await applicationsService.updateApplicationStatus(applicationId, userId, status);
      
      res.json({
        success: true,
        message: 'Application status updated',
        data: { application },
      });
    } catch (error) {
      throw error;
    }
  }

  async withdraw(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { applicationId } = req.params;
      
      await applicationsService.withdrawApplication(applicationId, userId);
      
      res.json({
        success: true,
        message: 'Application withdrawn',
      });
    } catch (error) {
      throw error;
    }
  }
}

export const applicationsController = new ApplicationsController();

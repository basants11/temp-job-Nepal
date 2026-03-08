import { Request, Response } from 'express';
import { z } from 'zod';
import { jobsService } from '../services/jobs.service';
import prisma from '../config/database';
import { CreateJobSchema, UpdateJobSchema, JobFiltersSchema } from '../utils/validation';
import { AuthRequest } from '../middleware/auth';

export class JobsController {
  
  async create(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      
      const company = await prisma.company.findFirst({
        where: { userId },
      });

      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found. Please create a company profile first.',
        });
      }

      const data = CreateJobSchema.parse(req.body);
      const job = await jobsService.createJob(company.id, data);
      
      res.status(201).json({
        success: true,
        message: 'Job posted successfully',
        data: { job },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      throw error;
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const filters = JobFiltersSchema.parse(req.query);
      const userId = req.user?.userId;
      
      const result = await jobsService.getJobs(filters, userId);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      throw error;
    }
  }

  async findOne(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    const job = await jobsService.getJobById(id, userId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.json({
      success: true,
      data: { job },
    });
  }

  async getMyJobs(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      
      const company = await prisma.company.findFirst({
        where: { userId },
      });

      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found',
        });
      }

      const jobs = await jobsService.getCompanyJobs(company.id);
      
      res.json({
        success: true,
        data: { jobs },
      });
    } catch (error) {
      throw error;
    }
  }

  async update(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user!.userId;
    const data = UpdateJobSchema.parse(req.body);
    
    const job = await jobsService.updateJob(id, userId, data);
    
    res.json({
      success: true,
      message: 'Job updated successfully',
      data: { job },
    });
  }

  async delete(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user!.userId;
    
    await jobsService.deleteJob(id, userId);
    
    res.json({
      success: true,
      message: 'Job deleted successfully',
    });
  }

  async apply(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user!.userId;
    const { coverLetter, proposedRate } = req.body;
    
    const application = await jobsService.applyToJob(id, userId, {
      coverLetter,
      proposedRate,
    });
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: { application },
    });
  }
}

export const jobsController = new JobsController();

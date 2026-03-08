import { Response } from 'express';
import { transactionsService } from '../services/transactions.service';
import { AuthRequest } from '../middleware/auth';

export class TransactionsController {
  
  async create(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { type, amount, method, jobId, description } = req.body;
      
      const transaction = await transactionsService.createTransaction({
        userId,
        type,
        amount,
        method,
        jobId,
        description,
      });
      
      res.status(201).json({
        success: true,
        data: { transaction },
      });
    } catch (error) {
      throw error;
    }
  }

  async getMyTransactions(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      
      const transactions = await transactionsService.getUserTransactions(userId);
      
      res.json({
        success: true,
        data: { transactions },
      });
    } catch (error) {
      throw error;
    }
  }

  async processPayment(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { jobId, amount, method } = req.body;
      
      const transaction = await transactionsService.processPayment(jobId, userId, amount, method);
      
      res.json({
        success: true,
        message: 'Payment successful',
        data: { transaction },
      });
    } catch (error) {
      throw error;
    }
  }
}

export const transactionsController = new TransactionsController();

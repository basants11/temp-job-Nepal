import prisma from '../config/database';
import { AppError } from '../utils/responses';

export class TransactionsService {
  
  async createTransaction(data: {
    userId?: string;
    jobId?: string;
    type: string;
    amount: number;
    method?: string;
    description?: string;
  }) {
    const transaction = await prisma.transaction.create({
      data: {
        userId: data.userId,
        jobId: data.jobId,
        type: data.type as any,
        amount: data.amount,
        method: data.method as any,
        description: data.description,
        status: 'COMPLETED',
        refNumber: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        processedAt: new Date(),
      },
    });

    return transaction;
  }

  async getUserTransactions(userId: string) {
    return prisma.transaction.findMany({
      where: { userId },
      include: {
        jobPost: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getJobTransactions(jobId: string) {
    return prisma.transaction.findMany({
      where: { jobId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async processPayment(jobId: string, userId: string, amount: number, method: string) {
    const job = await prisma.jobPost.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!job || job.company.userId !== userId) {
      throw new AppError('Job not found or unauthorized', 404);
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        jobId,
        type: 'POSTING_FEE',
        amount,
        method: method as any,
        status: 'COMPLETED',
        refNumber: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        description: `Posting fee for job: ${job.title}`,
        processedAt: new Date(),
      },
    });

    await prisma.jobPost.update({
      where: { id: jobId },
      data: {
        status: 'ACTIVE',
        postingFeePaid: true,
      },
    });

    return transaction;
  }
}

export const transactionsService = new TransactionsService();

import prisma from '../config/database';
import { AppError } from '../utils/responses';

export class ApplicationsService {
  
  async getUserApplications(userId: string, status?: string) {
    return prisma.application.findMany({
      where: {
        userId,
        ...(status && { status: status as any }),
      },
      include: {
        jobPost: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async getJobApplications(jobId: string, userId: string) {
    const job = await prisma.jobPost.findUnique({
      where: { id: jobId },
      include: { company: { include: { user: true } } },
    });

    if (!job || job.company.userId !== userId) {
      throw new AppError('Unauthorized', 403);
    }

    return prisma.application.findMany({
      where: { jobId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            profileImage: true,
            phone: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async updateApplicationStatus(applicationId: string, userId: string, status: string) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        jobPost: {
          include: { company: true },
        },
      },
    });

    if (!application) {
      throw new AppError('Application not found', 404);
    }

    if (application.jobPost.company.userId !== userId) {
      throw new AppError('Unauthorized', 403);
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: status as any,
        reviewedAt: new Date(),
      },
    });

    return updated;
  }

  async withdrawApplication(applicationId: string, userId: string) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new AppError('Application not found', 404);
    }

    if (application.userId !== userId) {
      throw new AppError('Unauthorized', 403);
    }

    await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'WITHDRAWN' },
    });
  }
}

export const applicationsService = new ApplicationsService();

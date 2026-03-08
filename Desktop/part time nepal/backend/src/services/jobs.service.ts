import prisma from '../config/database';
import { CreateJobInput, UpdateJobInput, JobFilters } from '../utils/validation';
import { AppError } from '../utils/responses';

export class JobsService {
  
  async createJob(companyId: string, data: CreateJobInput) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    if (company.plan === 'FREE' && company.postsRemaining <= 0) {
      throw new AppError('No posts remaining. Please upgrade your plan.', 400);
    }

    const durationDays = data.rateType === 'HOURLY' ? Math.ceil((data.duration || 0) / 8) : data.duration || 1;

    const job = await prisma.jobPost.create({
      data: {
        companyId: company.id,
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        rate: data.rate,
        rateType: data.rateType,
        location: data.location,
        city: data.city,
        duration: data.duration,
        startDate: data.startDate ? new Date(data.startDate) : null,
        expiresAt: new Date(Date.now() + (durationDays + 7) * 24 * 60 * 60 * 1000),
        status: company.plan === 'FREE' ? 'DRAFT' : 'ACTIVE',
        postingFeePaid: company.plan !== 'FREE',
      },
    });

    if (data.skillIds?.length) {
      await prisma.jobPostSkill.createMany({
        data: data.skillIds.map((skillId) => ({
          jobPostId: job.id,
          skillId,
        })),
      });
    }

    if (company.plan === 'FREE') {
      await prisma.company.update({
        where: { id: company.id },
        data: { postsRemaining: { decrement: 1 } },
      });
    }

    return this.getJobById(job.id);
  }

  async getJobs(filters: JobFilters, userId?: string) {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      city, 
      rateType, 
      minRate, 
      maxRate, 
      skills,
      status = 'ACTIVE',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = { status };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (city) {
      where.city = city;
    }

    if (rateType) {
      where.rateType = rateType;
    }

    if (minRate !== undefined || maxRate !== undefined) {
      where.rate = {};
      if (minRate !== undefined) where.rate.gte = minRate;
      if (maxRate !== undefined) where.rate.lte = maxRate;
    }

    if (skills?.length) {
      where.skills = {
        some: {
          skillId: { in: skills.split(',') },
        },
      };
    }

    const [jobs, total] = await Promise.all([
      prisma.jobPost.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
              isVerified: true,
            },
          },
          skills: {
            include: { skill: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.jobPost.count({ where }),
    ]);

    return {
      jobs,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async getJobById(id: string, userId?: string) {
    await prisma.jobPost.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    const job = await prisma.jobPost.findUnique({
      where: { id },
      include: {
        company: true,
        skills: {
          include: { skill: true },
        },
        applications: userId ? {
          where: { userId },
          take: 1,
        } : false,
      },
    });

    return job;
  }

  async getCompanyJobs(companyId: string) {
    return prisma.jobPost.findMany({
      where: { companyId },
      include: {
        skills: { include: { skill: true } },
        applications: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateJob(id: string, userId: string, data: UpdateJobInput) {
    const company = await prisma.company.findFirst({
      where: { userId },
    });

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    const job = await prisma.jobPost.findUnique({
      where: { id },
    });

    if (!job || job.companyId !== company.id) {
      throw new AppError('Job not found or unauthorized', 404);
    }

    const updated = await prisma.jobPost.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
      },
      include: {
        skills: { include: { skill: true } },
      },
    });

    return updated;
  }

  async deleteJob(id: string, userId: string) {
    const company = await prisma.company.findFirst({
      where: { userId },
    });

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    const job = await prisma.jobPost.findUnique({
      where: { id },
    });

    if (!job || job.companyId !== company.id) {
      throw new AppError('Job not found or unauthorized', 404);
    }

    await prisma.jobPost.delete({ where: { id } });
  }

  async applyToJob(jobId: string, userId: string, data: { coverLetter?: string; proposedRate?: number }) {
    const job = await prisma.jobPost.findUnique({
      where: { id: jobId },
    });

    if (!job || job.status !== 'ACTIVE') {
      throw new AppError('Job not found or not accepting applications', 404);
    }

    const existing = await prisma.application.findUnique({
      where: {
        jobId_userId: { jobId, userId },
      },
    });

    if (existing) {
      throw new AppError('You have already applied to this job', 400);
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        userId,
        coverLetter: data.coverLetter,
        proposedRate: data.proposedRate,
      },
    });

    await prisma.jobPost.update({
      where: { id: jobId },
      data: { applicants: { increment: 1 } },
    });

    return application;
  }
}

export const jobsService = new JobsService();

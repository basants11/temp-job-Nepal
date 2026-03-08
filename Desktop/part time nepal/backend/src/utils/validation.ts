import { z } from 'zod';

const UserRole = z.enum(['EMPLOYER', 'JOBER']);
const JobRateType = z.enum(['HOURLY', 'DAILY', 'FIXED']);
const JobStatus = z.enum(['DRAFT', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'EXPIRED']);
const ApplicationStatus = z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN']);

export const CreateUserSchema = z.object({
  email: z.string().email().max(255),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain uppercase, lowercase, number and special character'),
  phone: z.string().regex(/^98\d{8}$/, 'Invalid Nepal phone number'),
  fullName: z.string().min(2).max(100),
  role: UserRole,
  language: z.enum(['en', 'ne']).default('en'),
  companyName: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const CreateJobSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(5000),
  requirements: z.string().max(2000).optional(),
  rate: z.number().min(50).max(10000),
  rateType: JobRateType,
  location: z.string().min(5).max(500),
  city: z.string().min(1),
  duration: z.number().min(1).max(365),
  startDate: z.string().datetime().optional(),
  skillIds: z.array(z.string().uuid()).optional(),
});

export const UpdateJobSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(20).max(5000).optional(),
  requirements: z.string().max(2000).optional(),
  rate: z.number().min(50).max(10000).optional(),
  rateType: JobRateType.optional(),
  location: z.string().min(5).max(500).optional(),
  city: z.string().optional(),
  duration: z.number().min(1).max(365).optional(),
  startDate: z.string().datetime().optional(),
  status: JobStatus.optional(),
  skillIds: z.array(z.string().uuid()).optional(),
});

export const JobFiltersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
  search: z.string().min(2).optional(),
  city: z.string().optional(),
  rateType: JobRateType.optional(),
  minRate: z.coerce.number().optional(),
  maxRate: z.coerce.number().optional(),
  skills: z.string().optional(),
  status: JobStatus.optional(),
  sortBy: z.enum(['createdAt', 'rate', 'relevance']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const ApplySchema = z.object({
  coverLetter: z.string().max(2000).optional(),
  proposedRate: z.number().min(50).max(10000).optional(),
});

export const UpdateApplicationSchema = z.object({
  status: ApplicationStatus,
});

export const SendMessageSchema = z.object({
  receiverId: z.string().uuid(),
  content: z.string().min(1).max(2000),
});

export const CreateTransactionSchema = z.object({
  type: z.enum(['POSTING_FEE', 'COMMISSION', 'PAYOUT', 'REFUND']),
  amount: z.number().min(1),
  method: z.enum(['ESEWA', 'KHALTI', 'BANK_TRANSFER', 'WALLET']).optional(),
  jobId: z.string().uuid().optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateJobInput = z.infer<typeof CreateJobSchema>;
export type UpdateJobInput = z.infer<typeof UpdateJobSchema>;
export type JobFilters = z.infer<typeof JobFiltersSchema>;

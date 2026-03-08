import prisma from '../config/database';
import bcrypt from 'bcrypt';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { CreateUserInput, LoginInput } from '../utils/validation';
import { AppError } from '../utils/responses';

export class AuthService {
  
  async register(input: CreateUserInput) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.email }, { phone: input.phone }],
      },
    });

    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        phone: input.phone,
        fullName: input.fullName,
        role: input.role,
        language: input.language || 'en',
      },
    });

    if (input.role === 'EMPLOYER') {
      await prisma.company.create({
        data: {
          userId: user.id,
          name: input.companyName || input.fullName + "'s Company",
        },
      });
    }

    const tokens = generateTokens({ userId: user.id, role: user.role });

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
        language: user.language,
      },
      ...tokens,
    };
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { company: true },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const tokens = generateTokens({ userId: user.id, role: user.role });

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
        language: user.language,
        profileImage: user.profileImage,
      },
      ...tokens,
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = verifyRefreshToken(token);
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return generateTokens({ userId: user.id, role: user.role });
    } catch {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async updateProfile(userId: string, data: any) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: data.fullName,
        profileImage: data.profileImage,
        language: data.language,
      },
    });

    return user;
  }
}

export const authService = new AuthService();

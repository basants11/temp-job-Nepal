import { Request, Response } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service';
import { CreateUserSchema, LoginSchema } from '../utils/validation';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  
  async register(req: Request, res: Response) {
    try {
      const data = CreateUserSchema.parse(req.body);
      const result = await authService.register(data);
      
      res.status(201).json({
        success: true,
        message: 'Registration successful',
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

  async login(req: Request, res: Response) {
    try {
      const data = LoginSchema.parse(req.body);
      const result = await authService.login(data);
      
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

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token required',
        });
      }

      const tokens = await authService.refreshToken(refreshToken);
      
      res.json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      throw error;
    }
  }

  async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await authService.getProfile(req.user!.userId);
      
      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const user = await authService.updateProfile(req.user!.userId, req.body);
      
      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      throw error;
    }
  }
}

export const authController = new AuthController();

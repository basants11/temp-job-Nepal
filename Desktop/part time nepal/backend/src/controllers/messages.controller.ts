import { Response } from 'express';
import { messagesService } from '../services/messages.service';
import { AuthRequest } from '../middleware/auth';

export class MessagesController {
  
  async send(req: AuthRequest, res: Response) {
    try {
      const senderId = req.user!.userId;
      const { receiverId, content } = req.body;
      
      const message = await messagesService.sendMessage(senderId, receiverId, content);
      
      res.status(201).json({
        success: true,
        data: { message },
      });
    } catch (error) {
      throw error;
    }
  }

  async getConversation(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { userId: otherUserId } = req.params;
      
      const messages = await messagesService.getConversation(userId, otherUserId);
      
      res.json({
        success: true,
        data: { messages },
      });
    } catch (error) {
      throw error;
    }
  }

  async getConversations(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      
      const conversations = await messagesService.getConversations(userId);
      
      res.json({
        success: true,
        data: { conversations },
      });
    } catch (error) {
      throw error;
    }
  }

  async markRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { messageId } = req.params;
      
      await messagesService.markAsRead(messageId, userId);
      
      res.json({
        success: true,
        message: 'Message marked as read',
      });
    } catch (error) {
      throw error;
    }
  }

  async markConversationRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { userId: otherUserId } = req.params;
      
      await messagesService.markConversationAsRead(userId, otherUserId);
      
      res.json({
        success: true,
        message: 'Conversation marked as read',
      });
    } catch (error) {
      throw error;
    }
  }
}

export const messagesController = new MessagesController();

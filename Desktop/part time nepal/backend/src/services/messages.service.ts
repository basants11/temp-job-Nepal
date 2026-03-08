import prisma from '../config/database';
import { AppError } from '../utils/responses';

export class MessagesService {
  
  async sendMessage(senderId: string, receiverId: string, content: string) {
    if (senderId === receiverId) {
      throw new AppError('Cannot send message to yourself', 400);
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
      include: {
        sender: {
          select: { id: true, fullName: true, profileImage: true },
        },
      },
    });

    return message;
  }

  async getConversation(userId: string, otherUserId: string) {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: { id: true, fullName: true, profileImage: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return messages;
  }

  async getConversations(userId: string) {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: { id: true, fullName: true, profileImage: true },
        },
        receiver: {
          select: { id: true, fullName: true, profileImage: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const conversationsMap = new Map();
    
    for (const msg of messages) {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      
      if (!conversationsMap.has(otherUserId)) {
        const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          user: otherUser,
          lastMessage: msg,
          unreadCount: 0,
        });
      }
      
      if (msg.receiverId === userId && !msg.readAt) {
        const conv = conversationsMap.get(otherUserId);
        conv.unreadCount++;
      }
    }

    return Array.from(conversationsMap.values());
  }

  async markAsRead(messageId: string, userId: string) {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message || message.receiverId !== userId) {
      throw new AppError('Unauthorized', 403);
    }

    return prisma.message.update({
      where: { id: messageId },
      data: { readAt: new Date() },
    });
  }

  async markConversationAsRead(userId: string, otherUserId: string) {
    return prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: userId,
        readAt: null,
      },
      data: { readAt: new Date() },
    });
  }
}

export const messagesService = new MessagesService();

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Chat, Message, User } from '../../database/entities';
import { AuthenticatedWebSocket } from './types';

@Injectable()
export class ChatService {
  [x: string]: any;
  private clients = new Map<number, AuthenticatedWebSocket>();

  constructor(
    @InjectRepository(Chat)
    private readonly chatRepo: Repository<Chat>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  addClient(userId: number, socket: AuthenticatedWebSocket) {
    this.clients.set(userId, socket);
  }

  removeClient(userId: number) {
    this.clients.delete(userId);
  }

  async createChat(name: string, ownerId: number, type?,): Promise<Chat> {
    const owner = await this.userRepo.findOne({ where: { id: ownerId } });
    if (!owner) throw new Error('User not found');

    if (type && type === 'group') {
        name = name + ' - (group)';
      }

    const chat = this.chatRepo.create({
      name,
      ownerId,
      type,
      members: [owner],
    });


    const savedChat = await this.chatRepo.save(chat);

    this.broadcastToChat(savedChat.id, { event: 'chat_created', data: savedChat });

    return savedChat;
  }

  async removeChat(ownerId: number, chatId: number): Promise<boolean> {
    const chat = await this.chatRepo.findOne({ where: { id: chatId } });
    if (!chat) throw new NotFoundException('Chat not found');
    if (chat.ownerId !== ownerId)
      throw new BadRequestException('You are not the owner of the chat');

    await this.chatRepo.remove(chat);
    this.broadcastToChat(chat.id, { event: 'chat_deleted', data: { chatId: chat.id } });
    return true;
  }


  async inviteUser(inviterId: number, chatId: number, userId: number): Promise<boolean> {
    const chat = await this.chatRepo.findOne({
      where: { id: chatId },
      relations: ['members'],
    });

    if (!chat || chat.ownerId !== inviterId) {
      throw new NotFoundException('Chat not found or you are not the owner');
    };

    if (chat.members.length > 1 && chat.type === 'private') {
      throw new BadRequestException('Cannot invite users to a private chat with more than 2 members');
    };

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    };

    if (!chat.members.find((m) => m.id === userId)) {
      chat.members.push(user);
      await this.chatRepo.save(chat);
      this.broadcastToChat(chat.id, { event: 'user_invited', data: { chatId: chat.id, userId: user.id, userName: user.firstName } });
    } else {
      throw new BadRequestException('User is already a member of the chat');
    }

    return true;
  }

  async deleteOrLeaveUser(requesterId: number, chatId, userId: number): Promise<boolean> {
    const chat = await this.chatRepo.findOne({ where: { id: chatId }, relations: ['members'] });

    if (!chat) throw new NotFoundException('Chat not found');

    const user = await this.chatRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (requesterId == userId || chat.ownerId == requesterId) {
      chat.members = chat.members.filter(m => m.id !== userId);
      await this.chatRepo.save(chat);
      this.broadcastToChat(chat.id, { event: 'user_removed', data: { chatId: chat.id, userId } });
      return true;
    }

    throw new BadRequestException('You do not have permission to remove this user');
  }



  async addMessage(userId: number, chatId: number, text: string) {
    const chat = await this.chatRepo.findOne({
      where: { id: chatId },
      relations: ['members', 'messages'],
    });

    if (!chat || !chat.members.find((m) => m.id === userId)) {
      throw new NotFoundException('Chat not found or user not a member');
    };

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return null;

    const message = this.messageRepo.create({ text, user, chat });
    const savedMessage = await this.messageRepo.save(message);

    this.broadcastToChat(chat.id, { event: 'message', data: savedMessage });

    return savedMessage;
  }

  broadcastToChat(chatOrId: number | Chat, payload: any) {
    if (typeof chatOrId === 'number') {
      this.chatRepo.findOne({ where: { id: chatOrId }, relations: ['members'] }).then((chat) => {
        if (!chat) return;
        this.sendToMembers(chat.members, payload);
      });
    } else {
      this.sendToMembers(chatOrId.members, payload);
    }
  }

  private sendToMembers(members: User[], payload: any) {
    members.forEach((member) => {
      const client = this.clients.get(member.id);
      if (client && client.readyState === client.OPEN) {
        client.send(JSON.stringify(payload));
      }
    });
  }

}

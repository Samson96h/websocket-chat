import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { Chat, Message, SecretCode, User } from '../../database/entities';
import { AuthModule } from 'src/resource/auth/auth.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';


@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message, User, SecretCode])
,AuthModule],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}

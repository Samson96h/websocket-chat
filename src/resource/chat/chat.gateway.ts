import {
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Server } from 'ws';

import { ChatService } from './chat.service';


import type { AuthenticatedWebSocket } from './types/authenticated-websocket';
import { WsAuthGuard } from 'src/guards';


@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer() server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async handleConnection(@ConnectedSocket() client: AuthenticatedWebSocket) {
    try {
      const token = (client as any).token;
      if (!token) {
        this.logger.warn('Подключение без токена — закрываем соединение');
        client.close();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_CONFIG').secret,
      });

      client.user = {
        id: payload.sub,
        name: payload.name,
        phone: payload.phone,
      };

      this.chatService.addClient(client.user.id, client);
      this.logger.log(
        `Подключился: ${client.user.name} (${client.user.phone})`,
      );
    } catch (err) {
      this.logger.warn('Ошибка авторизации WebSocket: ' + err.message);
      client.close();
    }
  }

  handleDisconnect(@ConnectedSocket() client: AuthenticatedWebSocket) {
    const user = client.user;
    if (!user?.id) return;
    this.chatService.removeClient(user.id);
    this.logger.log(`Отключился: ${user.name}`);
  }


  @UseGuards(WsAuthGuard)
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedWebSocket,
    @MessageBody() data: { chatId: number; text: string },
  ) {
    try {
      const user = client.user!;
      this.logger.log(`${user.name} отправляет сообщение в чат#${data.chatId}`);

      const message = await this.chatService.addMessage(user.id, data.chatId, data.text);

      if (!message) {
        this.safeSend(client, {
          event: 'error',
          message: 'Не удалось отправить сообщение (возможно, вы не участник чата или чат не существует)',
        });
        return;
      }
    } catch (err) {
      this.logger.error(`Ошибка при отправке сообщения: ${err.message}`);
      this.safeSend(client, { event: 'error', message: 'Internal server error' });
    }
  }


  private safeSend(client: AuthenticatedWebSocket, payload: any) {
    if (client.readyState === client.OPEN) client.send(JSON.stringify(payload));
  }

}

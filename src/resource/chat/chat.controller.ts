import { Body, Controller, Post, UseGuards, Logger, Delete, Param } from "@nestjs/common";

import { AuthUser } from "src/decorators/auth-user.decorator";
import type { IRequestUser } from "./types/request-user";
import { IventUsersDTO, CreateChatDTO } from "./dto";
import { ParamIdDTO } from "src/dto/param-id.dto";
import { ChatService } from "./chat.service";
import { AuthGuard } from "src/guards";


@Controller('chats')
export class ChatController {
    private readonly logger = new Logger(ChatController.name);

    constructor(private readonly chatService: ChatService) { }

    @UseGuards(AuthGuard)
    @Post()
    async createChat(
        @Body() body: CreateChatDTO,
        @AuthUser() client: IRequestUser,
    ) {

        const chat = await this.chatService.createChat(body.name, client.id, body.type);
        this.logger.log(`Создание чата пользователем ${client.name}`);
        return chat;
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async removeChat(
        @AuthUser() client: IRequestUser,
        @Param() params: ParamIdDTO
    ) {
        this.chatService.removeChat(client.id, +params.id);
        return this.logger.log(`Удаление чата ${params.id} пользователем ${client.name}`);

    }

    @UseGuards(AuthGuard)
    @Post('invite')
    async inviteUser(
        @Body() body: IventUsersDTO,
        @AuthUser() client: IRequestUser,
    ) {
        return this.chatService.inviteUser(client.id, body.chatId, body.userId);
    }

    @UseGuards(AuthGuard)
    @Post(':id') 
    async sendMessage(
        @Param() param: ParamIdDTO,
        @AuthUser() client: IRequestUser,
    ) {
        return this.chatService.sendMessage(client.id, param.id);
    }                               

    @UseGuards(AuthGuard)
    @Delete("leave")
    async leaveChat(@AuthUser() requester: IRequestUser, @Body() body: IventUsersDTO){
        return this.chatService.leaveChat(requester.id, body.chatId, body.userId);
    }


}

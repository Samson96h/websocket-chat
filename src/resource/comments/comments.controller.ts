import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { UpdateCommentDTO } from './dto/update-comment.dto';
import { AuthUser } from 'src/decorators';
import type { IRequestUser } from '../chat/types';
import { ParamIdDTO } from 'src/dto';
import { AuthGuard } from 'src/guards';

@UseGuards(AuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post()
  async addComment(@AuthUser() user: IRequestUser, @Body() dto: CreateCommentDTO) {
    return this.commentsService.addComment(user.id, dto)
  }

  @Delete(':id')
  async removeComment(@AuthUser() user: IRequestUser, @Param() param: ParamIdDTO) {
    return this.commentsService.removeComment(user.id, param.id)
  }
}

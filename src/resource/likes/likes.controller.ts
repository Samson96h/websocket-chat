import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from 'src/guards';
import { AuthUser } from 'src/decorators';
import type { IRequestUser } from '../chat/types';
import { ParamIdDTO } from 'src/dto';

@UseGuards(AuthGuard)
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) { }

  @Post('post/:id')
  async addPostLike(@AuthUser() user: IRequestUser, @Param() param: ParamIdDTO) {
    return this.likesService.addLikePost(user.id, param.id);
  }

  @Post('comment/:id')
  async addCommentLike(@AuthUser() user: IRequestUser, @Param() param: ParamIdDTO) {
    return this.likesService.addLikeComment(user.id, param.id);
  }
}

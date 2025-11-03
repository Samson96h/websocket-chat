import { Controller, Get, Post, Body, Param, Delete, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDTO } from './dto/create-post.dto';
import { AuthUser } from '../../decorators';
import type { IRequestUser } from '../chat/types';
import { AuthGuard } from 'src/guards';
import { ParamIdDTO } from 'src/dto/param-id.dto';
import { PhotoValidationPipe } from 'src/shared/photoValidator/photo-validation.pipe';


@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

@UseInterceptors(FilesInterceptor('photo'))
@Post()
async createPost(
  @AuthUser() user: IRequestUser,
  @Body() dto: CreatePostDTO,
  @UploadedFiles(PhotoValidationPipe) files: Express.Multer.File[]
) {
  return this.postsService.createPost(user.id, dto, files);
}

  @Get()
  async getUserPosts(@AuthUser() user: IRequestUser) {
    return this.postsService.getUserPosts(user.id)
  }


  @Delete(':id')
  async deletePost(@AuthUser() user: IRequestUser, @Param() param: ParamIdDTO){
    return this.postsService.deletePost(user.id, param.id)
  }
}

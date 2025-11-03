import { Controller, Get, Post, Param, Delete, UseGuards, UseInterceptors, Body, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { PhotoValidationPipe } from 'src/shared/photoValidator/photo-validation.pipe';
import type { IRequestUser } from '../chat/types';
import { UsersService } from './users.service';
import { AuthUser } from '../../decorators';
import { AuthGuard } from 'src/guards';
import { ParamIdDTO } from '../../dto';
import { UpdateUserDTO } from './dto';

@ApiTags('Users')
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @UseInterceptors(FilesInterceptor('photo'))
  @Post()
  async updateUser(
    @AuthUser() user: IRequestUser,
    @Body() dto: UpdateUserDTO,
    @UploadedFiles(PhotoValidationPipe) files: Express.Multer.File[]) {
    return this.usersService.updateUser(user.id, dto, files)
  }


  @Delete('photo/:fileName')
  async deleteUserPhoto(
    @AuthUser() user: IRequestUser,
    @Param('fileName') fileName: string,
  ) {
    return this.usersService.deleteUserPhoto(user.id, fileName);
  }



  @Get()
  findAll() {
    return this.usersService.findAll();
  }


  @Get(':id')
  async findOneUser(@Param() param: ParamIdDTO) {
    return this.usersService.findOne(Number(param.id))
  }


  @Post('friends')
  async addFriends(@AuthUser() user: IRequestUser, @Body() id : ParamIdDTO) {
    return this.usersService.addFriend(user.id, Number(id));
  }


  @Get('friends/:id')
  async getFriends(
    @AuthUser() user: IRequestUser,
    @Param() param: ParamIdDTO
  ) {
    return this.usersService.getFriends(+param.id, user.id);
  }



  @Delete('friends/:id')
  async removeFriends(@AuthUser() user: IRequestUser, @Param() param: ParamIdDTO) {
    return this.usersService.removeFriend(user.id, Number(param.id));
  }


}
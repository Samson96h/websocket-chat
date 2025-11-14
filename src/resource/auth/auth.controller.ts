import { Body, Controller, Post, UseGuards} from '@nestjs/common';

import { CreateAuthDTO } from './dto/create-auth.dto';
import type { IRequestUser } from '../chat/types';
import { CodeDTO } from './dto/check-code.dto';
import { AuthService } from './auth.service';
import { AuthUser } from 'src/decorators';
import { AuthGuard } from '../../guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login (@Body() dto: CreateAuthDTO) {
    return this.authService.loginOrRegister(dto)
  }

  @UseGuards(AuthGuard)
  @Post('login')
  @ApiBearerAuth()
  async confirm(@AuthUser() user: IRequestUser ,@Body() dto: CodeDTO) {
    return this.authService.authentication(user.id,dto);
  }
  
}

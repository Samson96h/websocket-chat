import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts, User, Comments } from 'src/database/entities';
import { Likes } from 'src/database/entities/likes-entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([Posts, User, Comments, Likes]), AuthModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}

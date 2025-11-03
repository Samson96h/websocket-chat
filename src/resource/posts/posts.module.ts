import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/database/entities/posts.entity';
import { MediaFiles, User } from 'src/database/entities';
import { AuthModule } from '../auth/auth.module';
import { S3Module } from 'src/shared/s3/s3.module';

@Module({
  imports:[TypeOrmModule.forFeature([Posts, User, MediaFiles]), AuthModule,S3Module],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService]
})
export class PostsModule {}

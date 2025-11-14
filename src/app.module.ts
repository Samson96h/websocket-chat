import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { join } from 'path';

import { IDBConfig } from './models';
import { jwtConfig, dbConfig, awsConfig, googleClientConfig } from './configs';
import { validationSchema } from './validation';
import { ChatModule } from './resource/chat/chat.module';
import { AuthModule } from './resource/auth/auth.module';
import { UsersModule } from './resource/users/users.module';
import { PostsModule } from './resource/posts/posts.module';
import { Chat, MediaFiles, Message, SecretCode, User, Posts, Comments, Likes } from './database/entities';
import { CommentsModule } from './resource/comments/comments.module';
import { LikesModule } from './resource/likes/likes.module';
import { UserSecurity } from './database/entities/user.secutity.entity';
import { GoogleStrategy } from './strategy/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { FacebookStrategy } from './strategy/facebook.strategy';
import { faceboockClientConfig } from './configs/faceboock-client.config';


@Module({
  imports: [
    TypeOrmModule.forFeature([SecretCode, UserSecurity, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/'),
      serveRoot: '/public/',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: validationSchema,
      load: [jwtConfig, dbConfig, awsConfig, googleClientConfig, faceboockClientConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig: IDBConfig = configService.get('DB_CONFIG') as IDBConfig;
        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          entities: [User, SecretCode, Chat, Message, Posts, MediaFiles, Comments, Likes, UserSecurity],
          synchronize: true,
        };
      },

    }),
    ChatModule,
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    LikesModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy, FacebookStrategy, JwtStrategy],
})
export class AppModule {}

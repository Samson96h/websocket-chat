import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { SecretCode, User } from '../../database/entities';
import { AuthService } from './auth.service';
import { AuthGuard } from '../../guards';
import { S3Module } from 'src/shared/s3/s3.module';
import { UserSecurity } from '../../database/entities/user.secutity.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, SecretCode, UserSecurity]),
    JwtModule.registerAsync({
      imports: [ConfigModule, S3Module],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    })
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, AuthGuard],
})
export class AuthModule {}

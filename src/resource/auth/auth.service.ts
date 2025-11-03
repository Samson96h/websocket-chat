import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDTO } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { IAuthEnticationResponse } from './models/autentication-response';
import { UserSecurity } from 'src/database/entities/user.secutity.entity';
import { User, SecretCode } from '../../database/entities';
import { createRandomCode } from '../../helpers';
import { userStatus } from 'src/database/enums';
import { ConfigService } from '@nestjs/config';
import { CodeDTO } from './dto/check-code.dto';
import { IJWTConfig } from 'src/models';


@Injectable()
export class AuthService {
  private jwtConfig: IJWTConfig;

  constructor(
    @InjectRepository(UserSecurity)
    private readonly securityRepository: Repository<UserSecurity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SecretCode)
    private readonly secretRepository: Repository<SecretCode>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtConfig = this.configService.get('JWT_CONFIG') as IJWTConfig;
  }

async loginOrRegister(dto: CreateAuthDTO): Promise<IAuthEnticationResponse> {
  const { phone, firstName, confidentiality } = dto;

  let user = await this.userRepository.findOne({
    where: { phone },
    relations: ['security'],
  });

  if (!user) {
    user = this.userRepository.create({ phone, firstName, confidentiality });
    await this.userRepository.save(user);

    const security = this.securityRepository.create({ user });
    await this.securityRepository.save(security);

    user.security = security;
  } else if (!user.security) {
    const security = this.securityRepository.create({ user });
    await this.securityRepository.save(security);
    user.security = security;
  }

  if (user.status === userStatus.PERMAMENTLY_BLOCK) {
    throw new BadRequestException('User is permanently blocked');
  }

  if (user.security.blockedUntil && new Date() < user.security.blockedUntil) {
    const remaining = Math.ceil(
      (user.security.blockedUntil.getTime() - new Date().getTime()) / 60000,
    );
    throw new BadRequestException(
      `Account temporarily blocked. Try again in ${remaining} minute(s).`,
    );
  }

  if (user.security.blockedUntil && new Date() >= user.security.blockedUntil) {
    user.security.blockedUntil = null;
    user.security.attemptsCount = 0;
    await this.securityRepository.save(user.security);
  }

  const existing = await this.secretRepository.findOne({
    where: { user: { id: user.id } },
  });
  if (existing) {
    await this.secretRepository.delete({ id: existing.id });
  }

  const tempToken = this.jwtService.sign(
    { sub: user.id, phone: user.phone, name: user.firstName, temp: true },
    {
      secret: this.jwtConfig.tempSecret,
      expiresIn: '10m',
    },
  );
  const code = createRandomCode().toString();
  const secretCode = this.secretRepository.create({ code, user });
  await this.secretRepository.save(secretCode);

  return {
    accessToken: tempToken,
    code,
  };
}


  async authentication(userId: number, dto: CodeDTO): Promise<IAuthEnticationResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['security']
    })

    if (!user) {
      throw new BadRequestException('User not found')
    }

    if (!user.security) {
      user.security = this.securityRepository.create({ user })
      await this.securityRepository.save(user.security)
    }

    if (user.security.blockedUntil && new Date() < user.security.blockedUntil) {
      const remaining = Math.ceil(
        (user.security.blockedUntil.getTime() - new Date().getTime()) / 60000,
      )
      throw new BadRequestException(
        `Account temporarily blocked. Try again in ${remaining} minute(s).`
      )
    }

    if (user.security.blockedUntil && new Date() >= user.security.blockedUntil) {
      user.security.blockedUntil = null
      user.security.attemptsCount = 0
      await this.securityRepository.save(user.security)
    }

    const existing = await this.secretRepository.findOne({
      where: { code: dto.code, user: { id: user.id } },
      relations: ['user']
    })

    if (!existing) {
      user.security.attemptsCount += 1;

      if (user.security.attemptsCount === 3) {
        user.status = userStatus.TEMPORARY_BLOCK
        user.security.blockCount += 1

        if (user.security.blockCount === 5) {
          user.status = userStatus.PERMAMENTLY_BLOCK
          await this.userRepository.save(user);
          await this.securityRepository.save(user.security);
          throw new BadRequestException("User permanently blocked");
        }
        user.security.attemptsCount = 0
        user.security.blockedUntil = new Date(Date.now() + 15 * 60 * 1000)

        await this.userRepository.save(user)
        await this.securityRepository.save(user.security)

        return { message: 'You are temporarily blocked for 15 minutes' }
      }

      await this.securityRepository.save(user.security);
      return { message: 'Invalid code' };
    }

    user.status = userStatus.ACTIVE
    user.security.attemptsCount = 0
    user.security.blockCount = 0
    user.security.blockedUntil = null

    await this.userRepository.save(user)
    await this.securityRepository.save(user.security)
    await this.secretRepository.delete({ id: existing.id })

    const accessToken = this.jwtService.sign(
      { sub: user.id, phone: user.phone, name: user.firstName },
      {
        secret: this.jwtConfig.secret,
        expiresIn: '1d'
      }
    )

    return {
      accessToken,
      message: 'Authentication successful'
    }
  }

}

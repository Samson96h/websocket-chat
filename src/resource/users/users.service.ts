import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDTO } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MediaFiles } from 'src/database/entities/media-files';
import { S3Service } from 'src/shared/s3/s3.service';
import { User } from 'src/database/entities';
import { v4 as uuid } from 'uuid';


@Injectable()
export class UsersService {

  constructor(
    private readonly s3Service: S3Service,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(MediaFiles)
    private readonly mediaRepository: Repository<MediaFiles>
  ) { }


  async updateUser(id: number, dto: UpdateUserDTO, files?: Express.Multer.File[]) {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['mediaFiles'], });

    if (!user) {
      throw new NotFoundException('user not found')
    }

    user.confidentiality = dto.confidentiality ?? user.confidentiality
    user.firstName = dto.firstName ?? user.firstName;
    user.lastName = dto.lastName ?? user.lastName;
    user.age = dto.age ?? user.age;

    if (files) {
      user.mediaFiles = [];

      for (const file of files) {
        const type = file.originalname.split('.').pop();
        const filePath = `Samson/User/${type}/${uuid()}.${file.originalname}`;

        const photoEntity = this.mediaRepository.create({
          path: filePath,
          size: file.size,
        });

        await this.s3Service.putObject(file.buffer, filePath, file.mimetype);
        user.mediaFiles.push(photoEntity);
      }
    }

    return this.userRepository.save(user)
  }

  async deleteUserPhoto(userId: number, fileName: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['mediaFiles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const photo = user.mediaFiles.find((f) => f.path === fileName);

    if (!photo) {
      throw new NotFoundException('Photo not found for this user');
    }

    await this.s3Service.deleteObject(photo.path);

    await this.mediaRepository.remove(photo);

    console.log(`Photo deleted: ${photo.path}`);

    return { message: 'Photo deleted successfully' };
  }

  async addFriend(userId: number, friendId: number): Promise<User> {
    if (userId === friendId) {
      throw new BadRequestException('You cannot add yourself as a friend');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    });
    if (!user) throw new NotFoundException('User not found');

    const friend = await this.userRepository.findOne({ where: { id: friendId } });
    if (!friend) throw new NotFoundException('Friend not found');

    if (user.friends.some((e) => e.id === friendId)) {
      return user;
    }

    user.friends.push(friend);
    return this.userRepository.save(user);
  }

  async removeFriend(userId: number, friendId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    });
    if (!user) throw new NotFoundException('User not found');

    user.friends = user.friends.filter((e) => e.id !== friendId);

    return this.userRepository.save(user);
  }



  async getFriends(targetUserId: number, requesterId: number): Promise<User[]> {
    const targetUser = await this.userRepository.findOne({
      where: { id: targetUserId },
      relations: ['friends'],
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    if (targetUser.id !== requesterId && targetUser.confidentiality === 'private') {
      throw new ForbiddenException('User data is private');
    }

    return targetUser.friends;
  }



  findAll() {
    return this.userRepository.find();
  }


  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id }, relations:['friends', 'mediaFiles'] })

    if (!user) {
      throw new NotFoundException('user not found')
    }

    return user
  }


}

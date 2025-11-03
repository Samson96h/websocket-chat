import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLikeDTO } from './dto/create-like.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Likes } from 'src/database/entities/likes-entity';
import { Repository } from 'typeorm';
import { Comments, Posts, User } from 'src/database/entities';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Likes)
    private readonly likeRepository: Repository<Likes>,
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,
    @InjectRepository(Comments)
    private readonly commentRepository: Repository<Comments>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async addLikePost(userId: number, postId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundException('user not found')

    const post = await this.postRepository.findOne({ where: { id: postId } })
    if (!post) throw new NotFoundException('post not found')

    const existing = await this.likeRepository.findOne({ where: { user, post } })
    if (existing) {
      return this.likeRepository.remove(existing)
    }
    const like = this.likeRepository.create({ user, post });

    return this.likeRepository.save(like)

  }

  async addLikeComment(userId: number, commentId: number) {

    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundException('user not found')

    const comment = await this.commentRepository.findOne({ where: { id: commentId } })
    if (!comment) throw new NotFoundException('comment not found')

    const existing = await this.likeRepository.findOne({ where: { user, comment } })
    if (existing) {
      return this.likeRepository.remove(existing)
    }
    const like = this.likeRepository.create({ user, comment });

    return this.likeRepository.save(like)

  }

}

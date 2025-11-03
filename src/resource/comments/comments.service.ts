import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDTO } from './dto'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comments, User, Posts } from 'src/database/entities';

@Injectable()
export class CommentsService {
  commentsRepository: any;

  constructor(
    @InjectRepository(Comments)
    private readonly commentRepository: Repository<Comments>,
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async addComment(userId: number, dto: CreateCommentDTO) {
    const post = await this.postRepository.findOne({ where: { id: dto.postId }, relations: ['user'] })
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!post) {
      throw new NotFoundException('post not found')
    }

    if (!user) {
      throw new NotFoundException('user not found')
    }

    const comment = this.commentRepository.create({
      text: dto.text,
      post: post,
      author: user
    })

    return await this.commentRepository.save(comment)
  }


  async removeComment(userId: number, id: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!comment) {
      throw new BadRequestException('Comment not found');
    }

    if (comment.author.id !== user.id) {
      throw new BadRequestException('You have no rights to delete this comment');
    }

    await this.commentRepository.remove(comment);
    return { message: 'Comment deleted successfully' };
  }


}

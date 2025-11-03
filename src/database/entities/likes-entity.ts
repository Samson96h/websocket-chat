import { Entity, Column, ManyToOne } from 'typeorm';
import { User, Posts, Comments } from '../entities'
import { Base } from './base';

@Entity('likes')
export class Likes extends Base {

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Posts, (post) => post.likes, { nullable: true, onDelete: 'CASCADE' })
    post: Posts;

    @ManyToOne(() => Comments, (comment) => comment.likes, { nullable: true, onDelete: 'CASCADE' })
    comment: Comments;
}

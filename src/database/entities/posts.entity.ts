import { Column, Entity, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User, MediaFiles, Comments } from '../entities';
import { Likes } from './likes-entity';
import { Base } from './base';

@Entity('posts')
export class Posts extends Base {
    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
    user: User;

    @ManyToMany(() => MediaFiles, { cascade: true })
    @JoinTable({
        name: 'post_media_files',
        joinColumn: { name: 'post_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'media_file_id', referencedColumnName: 'id' },
    })
    mediaFiles: MediaFiles[];

    @OneToMany(() => Likes, (like) => like.post)
    likes: Likes[];

    @OneToMany(() => Comments, (comment) => comment.post)
    comments: Comments[];
}

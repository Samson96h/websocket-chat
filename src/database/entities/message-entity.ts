import { Entity, Column, ManyToOne } from 'typeorm';

import { User, Chat } from '../entities'
import { Base } from './base';

@Entity('messages')
export class Message extends Base {
  @Column()
  text: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
  chat: Chat;
}

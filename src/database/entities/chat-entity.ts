import { Entity, Column, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';

import { Message, User} from '../entities'
import { Base } from './base';


export enum ChatType {
  PRIVATE = 'private',
  GROUP = 'group',
}

@Entity('chats')
export class Chat extends Base {
  @Column()
  name: string;

  @Column()
  @ManyToOne(() => User, (user) => user.id)
  ownerId: number;

  @Column({ type: 'enum', enum: ChatType, default: ChatType.PRIVATE })
  type: ChatType;

  @ManyToMany(() => User, (user) => user.chats)
  @JoinTable({
    name: 'users_chats',
    joinColumn: { name: 'chat_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'members_id', referencedColumnName: 'id' },
  })
  members: User[];

  @OneToMany(() => Message, (message) => message.chat, { cascade: true })
  messages: Message[];
}

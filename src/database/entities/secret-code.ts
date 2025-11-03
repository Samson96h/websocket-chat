import { Entity, Column, ManyToOne } from 'typeorm';

import { User } from '../entities'
import { Base } from './base';


@Entity()
export class SecretCode extends Base {
  @Column()
  code: string;

  @ManyToOne(() => User, (user) => user.secretCodes, { onDelete: 'SET NULL' })
  user: User;

}

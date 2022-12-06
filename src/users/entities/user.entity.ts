import {
   BaseEntity,
   Column,
   CreateDateColumn,
   Entity,
   OneToMany,
   PrimaryGeneratedColumn,
   UpdateDateColumn,
} from 'typeorm';
import { Trade } from '../../trades/entities';

@Entity()
export class User extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({
      unique: true,
      length: 256,
   })
   email: string;

   @Column({
      length: 76,
   })
   password: string;

   @Column({
      default: null,
      nullable: true,
      length: 76,
   })
   refreshToken: string;

   @CreateDateColumn()
   createdAt: Date;

   @UpdateDateColumn()
   updatedAt: Date;

   @Column({
      default: true,
   })
   isActive: boolean;

   /*Relations:*/
   @OneToMany(() => Trade, (trade) => trade.user)
   trades: Trade[];
}

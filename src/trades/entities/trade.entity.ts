import {
   BaseEntity,
   Column,
   CreateDateColumn,
   Entity,
   ManyToOne,
   PrimaryGeneratedColumn,
   UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Trade extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column()
   currency: string;

   @Column({
      default: () => 'CURRENT_TIMESTAMP',
   })
   boughtAt: Date;

   @Column({
      type: 'decimal',
      precision: 10,
      scale: 3,
   })
   boughtFor: number;

   @Column({
      type: 'decimal',
      precision: 10,
      scale: 3,
   })
   price: number;

   @Column({
      type: 'decimal',
      precision: 27,
      scale: 18,
   })
   amount: number;

   @Column({
      default: true,
   })
   inExchange: boolean;

   @CreateDateColumn()
   createdAt: Date;

   @UpdateDateColumn()
   updatedAt: Date;

   /*Relations:*/
   @ManyToOne(() => User, (user) => user.trades, {
      onDelete: 'SET NULL',
   })
   user: User;

   //tradeHistory(oto)
}

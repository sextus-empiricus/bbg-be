import {
   BaseEntity,
   Column,
   CreateDateColumn,
   Entity, OneToOne,
   PrimaryGeneratedColumn,
   UpdateDateColumn,
} from 'typeorm';
import { Trade } from '../../trades/entities/trade.entity';

@Entity()
export class TradeHistory extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({
      default: () => 'CURRENT_TIMESTAMP',
   })
   soldAt: Date;

   @Column({
      type: 'decimal',
      precision: 10,
      scale: 3,
   })
   soldFor: number;

   @Column({
      type: 'decimal',
      precision: 10,
      scale: 3,
   })
   price: number;

   @Column({
      type: 'decimal',
      precision: 5,
      scale: 3,
   })
   profitPerc: number;

   @Column({
      type: 'decimal',
      precision: 5,
      scale: 3,
   })
   profitCash: number;

   @UpdateDateColumn()
   updatedAt: Date;

   @CreateDateColumn()
   createdAt: Date;

   /*Relations:*/
   @OneToOne(() => Trade, (trade) => trade.tradeHistory)
   trade: Trade;
}

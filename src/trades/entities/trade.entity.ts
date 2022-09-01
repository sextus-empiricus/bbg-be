import {
   BaseEntity,
   Column,
   CreateDateColumn,
   Entity,
   JoinColumn,
   ManyToOne,
   OneToMany,
   OneToOne,
   PrimaryGeneratedColumn,
   UpdateDateColumn,
} from 'typeorm';
import { TradeInterface } from '../../types/trades/trade.interface';
import { User } from '../../users/entities/user.entity';
import { TradeHistory } from '../../trade-history/entities/trade-history.entity';
import { IconUrl } from '../../icon-url/entities/icon-url.entity';

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

   @OneToOne(() => TradeHistory, (tradeHistory) => tradeHistory.trade, {
      nullable: true,
      onDelete: 'SET NULL',
   })
   @JoinColumn()
   tradeHistory: TradeHistory;

   @ManyToOne(() => IconUrl, (iconUrl) => iconUrl.trade, {
      onDelete: 'SET NULL',
   })
   iconUrl: IconUrl;
}

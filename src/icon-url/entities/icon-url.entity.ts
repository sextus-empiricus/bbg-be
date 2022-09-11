import {
   BaseEntity,
   Column,
   CreateDateColumn,
   Entity,
   OneToMany,
   PrimaryColumn,
   UpdateDateColumn,
} from 'typeorm';
import { Trade } from '../../trades/entities/trade.entity';

@Entity()
export class IconUrl extends BaseEntity {
   @PrimaryColumn()
   symbol: string;

   @Column()
   url: string;

   @CreateDateColumn()
   createdAt: Date;

   @UpdateDateColumn()
   updatedAt: Date;

   /*Relations:*/
   @OneToMany(() => Trade, (trade) => trade.iconUrl)
   trade: Trade;
}

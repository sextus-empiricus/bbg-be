import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({
         unique: true,
         length: 256,
      },
   )
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
   authToken: string;

   @CreateDateColumn()
   createdAt: Date;

   @UpdateDateColumn()
   updatedAt: Date;

   @Column({
      default: true,
   })
   isActive: boolean;
}

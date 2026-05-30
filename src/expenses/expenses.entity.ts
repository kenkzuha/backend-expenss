import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("expenses")
export class ExpensesEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  name!: string;

  @Column()
  category!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount!: number;

  @Column('date')
  date!: Date;

  @Column({ nullable: true })
  note?: string;
}
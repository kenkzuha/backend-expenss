import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity("budgets")
export class BudgetsEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  month!: number;

  @Column()
  year!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount!: number;
}
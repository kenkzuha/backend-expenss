import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users")
export class UsersEntity {
  @PrimaryGeneratedColumn()
  userId!: number;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;
}

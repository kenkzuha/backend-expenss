import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity("users")
export class UsersEntity {
  @PrimaryGeneratedColumn()
  userId!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: false })
  isEmailVerified!: boolean;

}

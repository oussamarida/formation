import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// Entité TypeORM : table users (comptes de connexion API)
@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar2", length: 50, unique: true })
  username!: string;

  @Column({ type: "varchar2", length: 200, name: "password_hash" })
  passwordHash!: string;

  @Column({ type: "varchar2", length: 20, default: "client" })
  role!: string;
}

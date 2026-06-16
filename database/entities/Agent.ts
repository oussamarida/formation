import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import type { CongeEntity } from "./Conge.js";

@Entity("agents")
export class AgentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar2", length: 50, unique: true })
  matricule!: string;

  @Column({ type: "varchar2", length: 100 })
  nom!: string;

  @Column({ type: "varchar2", length: 50 })
  direction!: string;

  @OneToMany("CongeEntity", "agent", { cascade: true })
  conges!: CongeEntity[];
}

import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

// Entité TypeORM : table agents (id, matricule, nom, direction)
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
  conges!: import("./Conge.js").CongeEntity[];
}

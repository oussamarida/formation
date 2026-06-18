import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

// Entité TypeORM : table agents (id, matricule, nom, departement)
@Entity("agents")
export class AgentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar2", length: 50, unique: true })
  matricule!: string;

  @Column({ type: "varchar2", length: 100 })
  nom!: string;

  @ManyToOne("DepartementEntity", "agents", { nullable: true })
  @JoinColumn({ name: "departement_id" })
  departement!: import("./Departement.js").DepartementEntity | null;

  @OneToMany("CongeEntity", "agent", { cascade: true })
  conges!: import("./Conge.js").CongeEntity[];
}

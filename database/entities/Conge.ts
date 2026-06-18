import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";

// Entité TypeORM : table conges liée à un agent (type, dates, jours, statut)
@Entity("conges")
export class CongeEntity {
  @PrimaryColumn({ type: "varchar2", length: 20 })
  id!: string;

  @Column({ type: "varchar2", length: 50 })
  type!: string;

  @Column({ type: "date", name: "date_debut" })
  dateDebut!: Date;

  @Column({ type: "date", name: "date_fin" })
  dateFin!: Date;

  @Column({ type: "number" })
  jours!: number;

  @Column({ type: "varchar2", length: 50 })
  statut!: string;

  @ManyToOne("AgentEntity", "conges", { onDelete: "CASCADE" })
  @JoinColumn({ name: "agent_id" })
  agent!: import("./Agent.js").AgentEntity;
}

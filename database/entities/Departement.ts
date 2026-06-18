import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

// Entité TypeORM : table departements (code, nom)
@Entity("departements")
export class DepartementEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar2", length: 20, unique: true })
  code!: string;

  @Column({ type: "varchar2", length: 100 })
  nom!: string;

  @OneToMany("AgentEntity", "departement")
  agents!: import("./Agent.js").AgentEntity[];
}

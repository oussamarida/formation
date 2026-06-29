"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getAgentConges } from "@/lib/api";
import type { Conge } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AgentCongesPage() {
  const params = useParams<{ id: string }>();
  const [conges, setConges] = useState<Conge[]>([]);

  useEffect(() => {
    getAgentConges(Number(params.id)).then(setConges);
  }, [params.id]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Congés — agent #{params.id}</h1>
        <Link href={`/agents/${params.id}`} className={buttonVariants({ variant: "outline" })}>
          Retour
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Début</TableHead>
            <TableHead>Fin</TableHead>
            <TableHead>Jours</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conges.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>Aucun congé</TableCell>
            </TableRow>
          ) : (
            conges.map((conge) => (
              <TableRow key={conge.id}>
                <TableCell>{conge.id}</TableCell>
                <TableCell>{conge.type}</TableCell>
                <TableCell>{conge.dateDebut}</TableCell>
                <TableCell>{conge.dateFin}</TableCell>
                <TableCell>{conge.jours}</TableCell>
                <TableCell>{conge.statut}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

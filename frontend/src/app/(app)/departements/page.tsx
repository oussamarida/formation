"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDepartements } from "@/lib/api";
import type { Departement } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RequireManagerPage } from "@/components/RequireManager";

function DepartementsContent() {
  const [departements, setDepartements] = useState<Departement[]>([]);

  useEffect(() => {
    getDepartements().then(setDepartements);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Départements</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Agents</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departements.map((departement) => (
            <TableRow key={departement.id}>
              <TableCell>
                <Badge>{departement.code}</Badge>
              </TableCell>
              <TableCell>{departement.nom}</TableCell>
              <TableCell>
                <Link className="underline" href={`/agents?departement=${departement.code}`}>
                  Voir agents
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function DepartementsPage() {
  return (
    <RequireManagerPage>
      <DepartementsContent />
    </RequireManagerPage>
  );
}

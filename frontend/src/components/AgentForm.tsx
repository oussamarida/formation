"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAgent, updateAgent } from "@/lib/api";
import type { Agent } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AgentFormProps {
  agent?: Agent;
}

export default function AgentForm({ agent }: AgentFormProps) {
  const router = useRouter();
  const [matricule, setMatricule] = useState(agent?.matricule ?? "");
  const [nom, setNom] = useState(agent?.nom ?? "");
  const [departementCode, setDepartementCode] = useState(agent?.departement?.code ?? "");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (agent) {
        await updateAgent(agent.id, { matricule, nom, departementCode: departementCode || undefined });
        toast.success("Agent modifié");
        router.push(`/agents/${agent.id}`);
      } else {
        const created = await createAgent({ matricule, nom, departementCode: departementCode || undefined });
        toast.success("Agent créé");
        router.push(`/agents/${created.id}`);
      }
    } catch {
      toast.error("Échec de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{agent ? "Modifier l'agent" : "Créer un agent"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="matricule">Matricule</Label>
            <Input id="matricule" value={matricule} onChange={(e) => setMatricule(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nom">Nom</Label>
            <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Département</Label>
            <Select value={departementCode} onValueChange={(value) => setDepartementCode(value ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRH">DRH</SelectItem>
                <SelectItem value="DSI">DSI</SelectItem>
                <SelectItem value="DAF">DAF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

import { Suspense } from "react";
import AgentsList from "@/components/AgentsList";

export default function AgentsPage() {
  return (
    <Suspense fallback={<p>Chargement…</p>}>
      <AgentsList />
    </Suspense>
  );
}

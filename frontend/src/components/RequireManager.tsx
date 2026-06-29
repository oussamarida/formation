"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth, useIsManager } from "@/hooks/useAuth";

// Affiche le contenu uniquement pour les managers (boutons, formulaires)
export default function RequireManager({ children }: { children: ReactNode }) {
  const isManager = useIsManager();
  if (!isManager) return null;
  return <>{children}</>;
}

// Bloque l'accès à une page réservée aux managers
export function RequireManagerPage({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useAuth();
  const isManager = useIsManager();

  useEffect(() => {
    if (user && !isManager) {
      router.replace("/agents");
    }
  }, [user, isManager, router]);

  if (!user) return <p>Chargement…</p>;
  if (!isManager) return <p className="text-sm text-muted-foreground">Accès refusé — réservé au manager</p>;
  return <>{children}</>;
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, isTokenExpired } from "@/lib/authStorage";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token || isTokenExpired(token)) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) return <p className="p-6 text-sm text-muted-foreground">Vérification de la session…</p>;
  return <>{children}</>;
}

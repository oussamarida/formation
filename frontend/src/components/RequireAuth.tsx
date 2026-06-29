"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/api";
import { clearToken, getToken, isTokenExpired } from "@/lib/authStorage";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function verifySession() {
      const token = getToken();
      if (!token || isTokenExpired(token)) {
        clearToken();
        router.replace("/login");
        return;
      }

      try {
        await getMe();
        setChecked(true);
      } catch {
        clearToken();
        router.replace("/login");
      }
    }

    verifySession();
  }, [router]);

  if (!checked) return <p className="p-6 text-sm text-muted-foreground">Vérification de la session…</p>;
  return <>{children}</>;
}

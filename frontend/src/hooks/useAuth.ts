"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/lib/api";
import { clearToken, getToken, isTokenExpired } from "@/lib/authStorage";
import { ROLES } from "@/lib/roles";
import type { AuthUser } from "@/types";

export function useAuth(): AuthUser | null {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function loadUserFromDatabase() {
      const token = getToken();
      if (!token || isTokenExpired(token)) {
        clearToken();
        setUser(null);
        setReady(true);
        return;
      }

      try {
        const me = await getMe();
        setUser(me);
      } catch {
        clearToken();
        setUser(null);
      } finally {
        setReady(true);
      }
    }

    loadUserFromDatabase();
  }, []);

  if (!ready) return null;
  return user;
}

export function useIsManager(): boolean {
  const user = useAuth();
  return user?.role === ROLES.MANAGER;
}

export function useIsClient(): boolean {
  const user = useAuth();
  return user?.role === ROLES.CLIENT;
}

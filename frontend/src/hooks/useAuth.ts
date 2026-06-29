"use client";

import { useEffect, useState } from "react";
import {
  clearToken,
  decodeToken,
  getToken,
  isTokenExpired,
  type TokenPayload,
} from "@/lib/authStorage";
import { ROLES } from "@/lib/roles";

function readUserFromStorage(): TokenPayload | null {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    clearToken();
    return null;
  }
  return decodeToken(token);
}

export function useAuth(): TokenPayload | null {
  const [user, setUser] = useState<TokenPayload | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(readUserFromStorage());
    setReady(true);
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

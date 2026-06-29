"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Users, Building2 } from "lucide-react";
import { useAuth, useIsManager } from "@/hooks/useAuth";
import { clearToken } from "@/lib/authStorage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/agents", label: "Agents", icon: Users, managerOnly: false },
  { href: "/departements", label: "Départements", icon: Building2, managerOnly: true },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuth();
  const isManager = useIsManager();

  const visibleNavItems = navItems.filter((item) => !item.managerOnly || isManager);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <p className="text-lg font-semibold">Agents API</p>
          <div className="flex items-center gap-3">
            {user && (
              <>
                <span className="text-sm font-medium">{user.sub}</span>
                <Badge variant="secondary">{user.role}</Badge>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearToken();
                router.push("/login");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[200px_1fr]">
        <nav className="space-y-1 rounded-lg border bg-background p-3">
          {visibleNavItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted",
                pathname === href || pathname.startsWith(`${href}/`)
                  ? "bg-muted font-medium"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <main>{children}</main>
      </div>
    </div>
  );
}

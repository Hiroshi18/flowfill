"use client";

import { useAuth } from "@/components/auth/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthed, hydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (hydrated && !isAuthed && pathname !== "/login" && pathname !== "/") {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthed, hydrated, pathname, router]);

  // Provide a minimum height shell during hydration to keep layout intact
  if (!hydrated) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="h-6 w-6 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  return <>{children}</>;
}

"use client";

import { useAuth } from "@/components/auth/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthed, hydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (hydrated && !isAuthed && pathname !== "/login") {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthed, hydrated, pathname, router]);

  // Keep the layout container even while loading to prevent "layout jump"
  if (!hydrated) {
    return <div className="min-h-screen bg-background" />;
  }

  return <>{children}</>;
}

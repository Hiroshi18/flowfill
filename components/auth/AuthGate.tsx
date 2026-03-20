"use client";

import { PropsWithChildren, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/useAuth";

export default function AuthGate({ children }: PropsWithChildren) {
  const { isAuthed, hydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthed) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, isAuthed, pathname, router]);

  if (!hydrated || !isAuthed) return null;
  return <>{children}</>;
}


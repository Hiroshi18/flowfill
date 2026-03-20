"use client";

import { useEffect, useMemo, useState } from "react";
import { backend, type BackendUser } from "@/components/api/backend";

type AuthUser = {
  id: number;
  email: string;
  name: string;
};

const STORAGE_KEY = "flowfill.auth.user.v1";

function readUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function writeUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (!user) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export function useAuth() {
  // Initialize with null to avoid hydration mismatch, then load in useEffect
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Handle initial hydration from localStorage
  useEffect(() => {
    const savedUser = readUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setHydrated(true);
  }, []);

  // Sync state changes back to localStorage
  useEffect(() => {
    if (hydrated) {
      writeUser(user);
    }
  }, [user, hydrated]);

  const isAuthed = useMemo(() => Boolean(user), [user]);

  function toAuthUser(u: BackendUser): AuthUser {
    return { id: u.id, email: u.email, name: u.name };
  }

  async function login(email: string, password: string) {
    if (!email.trim() || !password.trim()) return false;
    try {
      const u = await backend.getUserByEmail(email);
      setUser(toAuthUser(u));
      return true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.startsWith("404")) {
        try {
          const normalized = email.trim().toLowerCase();
          const fallbackName = normalized.split("@")[0]?.trim() || "User";
          const u = await backend.createUser({ 
            name: fallbackName, 
            email: normalized, 
            role: "customer" 
          });
          setUser(toAuthUser(u));
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  }

  async function register(name: string, email: string, password: string) {
    if (!name.trim() || !email.trim() || !password.trim()) return false;
    try {
      const u = await backend.createUser({ 
        name: name.trim(), 
        email: email.trim().toLowerCase(), 
        role: "customer" 
      });
      setUser(toAuthUser(u));
      return true;
    } catch {
      return false;
    }
  }

  function logout() {
    setUser(null);
  }

  return { 
    user, 
    isAuthed, 
    hydrated, // Now correctly exported for use in other components
    login, 
    register, 
    logout 
  };
}

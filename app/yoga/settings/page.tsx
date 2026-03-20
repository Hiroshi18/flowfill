"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/useAuth";
import { useTheme } from "@/components/theme/useTheme";
import Link from "next/link";
import { StudioPanel, StudioScaffold } from "@/components/ds/studio";
import { MOCK_MEMBERSHIPS, MOCK_SETTINGS_BLURBS } from "@/lib/mock-consumer-content";
import { cn } from "@/lib/utils";

type SettingsState = {
  notifications: boolean;
  emailUpdates: boolean;
  language: "en" | "de";
  reduceMotion: boolean;
};

const SETTINGS_KEY = "flowfill.settings.v1";

function readSettings(): SettingsState {
  if (typeof window === "undefined") {
    return { notifications: true, emailUpdates: true, language: "en", reduceMotion: false };
  }
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { notifications: true, emailUpdates: true, language: "en", reduceMotion: false };
    return { notifications: true, emailUpdates: true, language: "en", reduceMotion: false, ...(JSON.parse(raw) as Partial<SettingsState>) };
  } catch {
    return { notifications: true, emailUpdates: true, language: "en", reduceMotion: false };
  }
}

function writeSettings(s: SettingsState) {
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

export default function YogaSettingsPage() {
  const router = useRouter();
  const { user, isAuthed, logout } = useAuth();
  const { mode, setMode } = useTheme();
  const [settings, setSettings] = useState<SettingsState>(() => readSettings());
  const title = useMemo(() => (isAuthed ? "Settings" : "Sign in"), [isAuthed]);

  function update(next: Partial<SettingsState>) {
    setSettings((prev) => {
      const merged = { ...prev, ...next };
      writeSettings(merged);
      return merged;
    });
  }

  return (
    <StudioScaffold
      eyebrow="Account"
      title={title}
      description="Device preferences and account shortcuts. Billing state still follows your home studio."
    >
      <StudioPanel className="p-3.5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Active plan</div>
        <h2 className="mt-0.5 text-base font-semibold text-foreground">{MOCK_MEMBERSHIPS[1].name}</h2>
        <p className="mt-1.5 text-xs text-muted-foreground">{MOCK_MEMBERSHIPS[1].blurb}</p>
        <ul className="mt-2 list-disc space-y-0.5 pl-4 text-xs text-foreground">
          {MOCK_MEMBERSHIPS[1].perks.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Link
            href="/yoga/home"
            className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11px] font-semibold transition hover:bg-muted"
          >
            Home
          </Link>
          <Link href="/yoga/credits" className="rounded-lg bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-primary-foreground">
            Wallet
          </Link>
        </div>
      </StudioPanel>

      <div className="grid gap-3 lg:grid-cols-2">
        <StudioPanel className="p-3.5">
          <div className="text-sm font-semibold text-foreground">Account</div>
          <p className="mt-0.5 text-xs text-muted-foreground">{user ? `Signed in as ${user.email}` : "Not signed in"}</p>
          <div className="mt-3 flex gap-2">
            {!isAuthed ? (
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Sign in
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.replace("/");
                }}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold transition hover:bg-muted"
              >
                Sign out
              </button>
            )}
          </div>
        </StudioPanel>

        <StudioPanel className="p-3.5">
          <div className="text-sm font-semibold text-foreground">Appearance</div>
          <p className="mt-0.5 text-xs text-muted-foreground">Light / dark on this device.</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setMode("light")}
              className={cn(
                "flex-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                mode === "light" ? "border-primary/40 bg-primary/10 text-foreground" : "border-border hover:bg-muted"
              )}
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => setMode("dark")}
              className={cn(
                "flex-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                mode === "dark" ? "border-primary/40 bg-primary/10 text-foreground" : "border-border hover:bg-muted"
              )}
            >
              Dark
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-foreground">Reduce motion</div>
              <div className="text-xs text-muted-foreground">Fewer transitions.</div>
            </div>
            <button
              type="button"
              onClick={() => update({ reduceMotion: !settings.reduceMotion })}
              className={cn(
                "flex h-7 w-12 items-center rounded-full border px-1 transition",
                settings.reduceMotion ? "border-primary bg-primary" : "border-border bg-muted"
              )}
              aria-label="Toggle reduce motion"
            >
              <span
                className={cn(
                  "size-5 rounded-full bg-background shadow transition",
                  settings.reduceMotion ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </StudioPanel>

        <StudioPanel className="p-3.5">
          <div className="text-sm font-semibold text-foreground">Notifications</div>
          <div className="mt-3 space-y-2">
            <label className="flex items-center justify-between gap-4 text-xs text-foreground sm:text-sm">
              Push
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => update({ notifications: e.target.checked })}
                className="size-4 accent-primary"
              />
            </label>
            <label className="flex items-center justify-between gap-4 text-xs text-foreground sm:text-sm">
              Email
              <input
                type="checkbox"
                checked={settings.emailUpdates}
                onChange={(e) => update({ emailUpdates: e.target.checked })}
                className="size-4 accent-primary"
              />
            </label>
          </div>
        </StudioPanel>

        <StudioPanel className="p-3.5">
          <div className="text-sm font-semibold text-foreground">Language</div>
          <p className="mt-0.5 text-xs text-muted-foreground">UI locale.</p>
          <select
            value={settings.language}
            onChange={(e) => update({ language: e.target.value as SettingsState["language"] })}
            className="ff-input mt-3 h-9 text-sm"
          >
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
        </StudioPanel>

        <StudioPanel className="p-3.5 lg:col-span-2">
          <div className="text-sm font-semibold text-foreground">Privacy & data</div>
          <p className="mt-1.5 text-xs leading-snug text-muted-foreground">{MOCK_SETTINGS_BLURBS.privacy}</p>
        </StudioPanel>

        <StudioPanel className="p-3.5">
          <div className="text-sm font-semibold text-foreground">Billing portal</div>
          <p className="mt-1.5 text-xs text-muted-foreground">{MOCK_SETTINGS_BLURBS.billing}</p>
          <button
            type="button"
            disabled
            className="mt-3 w-full cursor-not-allowed rounded-lg border border-dashed border-border py-1.5 text-xs font-semibold text-muted-foreground"
          >
            Open billing (tenant)
          </button>
        </StudioPanel>

        <StudioPanel className="p-3.5">
          <div className="text-sm font-semibold text-foreground">Support</div>
          <p className="mt-1.5 text-xs text-muted-foreground">{MOCK_SETTINGS_BLURBS.support}</p>
          <Link href="/" className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline sm:text-sm">
            FAQ →
          </Link>
        </StudioPanel>
      </div>
    </StudioScaffold>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coins, LayoutDashboard, MapPin } from "lucide-react";
import { FlowFillAppBridge } from "@/components/FlowFillAppBridge";
import { LogoIcon } from "@/components/logo";
import { cn } from "@/lib/utils";

const ghost = cn(
  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
  "text-sidebar-foreground/80 hover:bg-sidebar-accent/45 hover:text-sidebar-foreground"
);

const ghostActive = "bg-sidebar-accent text-sidebar-accent-foreground";

export default function Nav({ embedded }: { embedded?: boolean }) {
  const pathname = usePathname() ?? "";

  return (
    <nav
      className={cn(
        "flex items-center justify-between gap-4 border-b border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm",
        embedded ? "px-4 py-2" : "px-4 py-3.5 sm:px-6"
      )}
    >
      <Link href="/" className="flex min-w-0 items-center gap-2.5 text-sidebar-foreground">
        <LogoIcon className="size-6 shrink-0 text-sidebar-primary" aria-hidden />
        <span className="truncate text-sm font-semibold tracking-tight">FlowFill</span>
        <span className="hidden shrink-0 rounded-md border border-sidebar-border bg-sidebar-accent/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/90 sm:inline">
          Operator
        </span>
      </Link>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-1 sm:gap-2">
        <FlowFillAppBridge variant="sidebar" />
        <Link
          href="/dashboard"
          className={cn(ghost, "inline-flex items-center gap-1.5", pathname === "/dashboard" && ghostActive)}
        >
          <LayoutDashboard className="size-3.5 text-sidebar-primary" aria-hidden />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
        <Link
          href="/dashboard/credits"
          className={cn(
            ghost,
            "inline-flex items-center gap-1.5",
            pathname === "/dashboard/credits" && ghostActive
          )}
        >
          <Coins className="size-3.5 text-sidebar-primary" aria-hidden />
          <span className="hidden sm:inline">Credits</span>
        </Link>
        <Link
          href="/menu"
          className={cn(ghost, "inline-flex items-center gap-1.5", pathname === "/menu" && ghostActive)}
        >
          <MapPin className="size-3.5 text-sidebar-primary" aria-hidden />
          <span className="hidden sm:inline">Directory</span>
        </Link>
      </div>
    </nav>
  );
}

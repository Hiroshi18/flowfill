"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ComponentType, type CSSProperties, PropsWithChildren, useMemo } from "react";
import { FlowFillAppBridge } from "@/components/FlowFillAppBridge";
import { FlowFillJourneyStripApp } from "@/components/FlowFillJourneyStripApp";
import { Logo } from "@/components/logo";
import { deskPrimaryNav } from "@/lib/desk-nav";
import { memberAccountNav, memberBookNav, memberSubtitleForPath } from "@/lib/member-quick-nav";
import { SidebarThemeToggle } from "@/components/shell/SidebarThemeToggle";
import { CreditsPill } from "@/components/CreditsPill";
import { StudioHeaderSearch } from "@/components/yoga/StudioHeaderSearch";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type YogaLink = { href: string; label: string; icon: ComponentType<{ className?: string }> };

const primary: YogaLink[] = [...memberBookNav];

const deskSidebar = deskPrimaryNav;

const account: YogaLink[] = [...memberAccountNav];

const pageTitleByHref = Object.fromEntries(
  [...primary, ...account].map((l) => [l.href, l.label]),
) as Record<string, string>;

pageTitleByHref["/yoga/booking"] = "Book";

const menuBtn = cn(
  "rounded-lg px-2 py-2 text-sm font-medium transition-colors",
  "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-semibold",
  "group-data-[collapsible=icon]:justify-center"
);

const topQuiet = cn(
  "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition",
  "hover:bg-muted hover:text-foreground"
);

function deskRouteActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function TopNavLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex shrink-0 items-center gap-1.5 sm:gap-2", className)}>
      <FlowFillAppBridge className="hidden sm:inline-flex" />
      <Link href="/dashboard/directory" className={topQuiet}>
        Studios
      </Link>
    </div>
  );
}

function StudioAppHeader({ activeHref }: { activeHref: string }) {
  const pageTitle = pageTitleByHref[activeHref] ?? "Members";
  const subtitle = memberSubtitleForPath(activeHref);

  const titleBlock = (
    <div className="ff-shell-top-heading">
      <p className="ff-shell-top-kicker">Members</p>
      <h1 className="ff-shell-top-title">{pageTitle}</h1>
      <p className="ff-shell-top-desc">{subtitle}</p>
    </div>
  );

  const actions = (
    <div className="flex shrink-0 items-center justify-end gap-2">
      <CreditsPill compact className="hidden sm:inline-flex" />
      <Link
        href="/dashboard/directory"
        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        Studios
      </Link>
    </div>
  );

  const searchFallback = (
    <div className="h-8 w-full max-w-[220px] rounded-full border border-border/60 bg-muted/20 shadow-sm" aria-hidden />
  );

  return (
    <header className="ff-shell-top">
      <div className="ff-shell-top-pad">
        <div className="flex min-h-12 items-start gap-1.5 sm:gap-2 md:grid md:min-h-0 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-start md:gap-3 md:pt-0.5 lg:gap-4">
          <div className="flex min-w-0 max-w-[42%] items-start gap-1.5 sm:max-w-none sm:gap-2 md:max-w-none md:justify-self-start lg:gap-2">
            <SidebarTrigger className="ff-shell-top-trigger" />
            <Separator orientation="vertical" className="hidden h-6 sm:block" />
            {titleBlock}
          </div>

          <div className="flex shrink-0 justify-center px-0.5 md:self-center md:justify-self-center md:px-2">
            <Suspense fallback={searchFallback}>
              <StudioHeaderSearch className="w-[min(200px,32vw)] sm:w-[220px] md:w-[220px] md:max-w-[220px] lg:w-[240px] lg:max-w-[240px]" />
            </Suspense>
          </div>

          <div className="flex min-w-0 flex-1 items-start justify-end gap-1 overflow-x-auto pt-0.5 md:flex-none md:justify-self-end md:gap-2 md:overflow-visible md:pt-0 lg:gap-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <FlowFillAppBridge className="inline-flex sm:hidden" />
            <CreditsPill compact className="inline-flex sm:hidden" />
            <TopNavLinks className="[&_a]:px-2 [&_a]:py-1.5 [&_a]:text-xs md:[&_a]:px-3 md:[&_a]:py-2 md:[&_a]:text-sm" />
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function YogaShell({ children }: PropsWithChildren) {
  const pathname = usePathname() ?? "";
  const activeHref = useMemo(() => {
    const root = pathname.startsWith("/yoga/")
      ? `/${pathname.split("/").slice(1, 3).join("/")}`
      : "/yoga/schedule";
    return root;
  }, [pathname]);

  return (
    <SidebarProvider
      defaultOpen={true}
      className="flex min-h-screen min-w-0 flex-1"
      style={
        {
          "--sidebar-width": "15.5rem",
          "--sidebar-width-mobile": "18rem",
        } as CSSProperties
      }
    >
      <Sidebar
        collapsible="offcanvas"
        className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
      >
        <SidebarHeader className="ff-shell-sidebar-header">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5 rounded-md outline-none ring-sidebar-ring focus-visible:ring-2"
          >
            <Logo className="h-6 w-auto shrink-0 text-sidebar-foreground" aria-hidden />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground">FlowFill</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/55">Members</p>
            </div>
          </Link>
          <FlowFillAppBridge variant="sidebar" className="mt-3 w-full" />
        </SidebarHeader>

        <SidebarContent className="gap-0 px-2 py-3">
          <div className="min-h-0 flex-1 space-y-0">
            <SidebarGroup className="p-0">
              <SidebarGroupLabel className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/50">
                Book
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {primary.map((l) => (
                    <SidebarMenuItem key={l.href}>
                      <SidebarMenuButton
                        asChild
                        tooltip={l.label}
                        isActive={activeHref === l.href}
                        className={menuBtn}
                      >
                        <Link href={l.href}>
                          <l.icon className="h-4 w-4 shrink-0 opacity-90" />
                          <span className="group-data-[collapsible=icon]:hidden">{l.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator className="my-3 bg-sidebar-border" />

            <SidebarGroup className="p-0">
              <SidebarGroupLabel className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/50">
                Desk
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {deskSidebar.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.label}
                        isActive={deskRouteActive(pathname, item.href)}
                        className={menuBtn}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4 shrink-0 opacity-90" />
                          <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>

          <SidebarGroup className="mt-auto p-0 pt-2">
            <SidebarGroupLabel className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/50">
              Account
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {account.map((l) => (
                  <SidebarMenuItem key={l.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={l.label}
                      isActive={activeHref === l.href}
                      className={menuBtn}
                    >
                      <Link href={l.href}>
                        <l.icon className="h-4 w-4 shrink-0 opacity-90" />
                        <span className="group-data-[collapsible=icon]:hidden">{l.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-3">
          <SidebarThemeToggle />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex min-h-svh min-w-0 flex-col overflow-hidden bg-muted/30 dark:bg-muted/20">
        <StudioAppHeader activeHref={activeHref} />
        <main className="ff-main-padding flex-1 overflow-auto bg-background">
          <div className="ff-page-frame">{children}</div>
        </main>
        <FlowFillJourneyStripApp />
      </SidebarInset>
    </SidebarProvider>
  );
}
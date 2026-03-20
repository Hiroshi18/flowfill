"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, ChevronLeft, ChevronRight, CreditCard, Coins, LayoutDashboard, Sparkles, X } from "lucide-react";
import { backend } from "@/components/api/backend";
import { useCreditsWallet } from "@/hooks/useCreditsWallet";
import { useYogaBookings } from "@/components/yoga/useYogaBookings";
import type { YogaBooking } from "@/components/yoga/useYogaBookings";
import { getYogaStudioById } from "@/components/yoga/useYogaStudio";
import {
  MOCK_CREDIT_PROFILE,
  isMockBooking,
  mockBookingsForWeek,
} from "@/components/yoga/mockScheduleCredits";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpcomingReservationsList } from "@/components/yoga/UpcomingReservationsList";
import { cn } from "@/lib/utils";

function startOfWeekMonday(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

function toDate(month: string, day: number) {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, day);
}

function fmt(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function parseHour(time: string) {
  const raw = time.trim().toUpperCase();
  const m = raw.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/);
  if (!m) return 9;
  let h = Number(m[1]);
  const min = Number(m[2]);
  const ampm = m[3];
  if (ampm === "PM" && h < 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h + min / 60;
}

function styleChip(name: string) {
  const n = name.toLowerCase();
  if (n.includes("yin")) return "bg-violet-50 border-violet-200 text-violet-700";
  if (n.includes("sound")) return "bg-indigo-50 border-indigo-200 text-indigo-700";
  if (n.includes("power")) return "bg-emerald-50 border-emerald-200 text-emerald-700";
  if (n.includes("breath")) return "bg-teal-50 border-teal-200 text-teal-700";
  return "bg-amber-50 border-amber-200 text-amber-700";
}

function YogaCalendarPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") === "list" ? "list" : "week";

  function setCalendarView(next: "week" | "list") {
    if (next === "list") {
      router.replace("/yoga/my-calendar?view=list", { scroll: false });
    } else {
      router.replace("/yoga/my-calendar", { scroll: false });
    }
  }

  const { bookings, removeBooking, refreshBookingsFromApi } = useYogaBookings();
  const { balanceEUR, displayName: walletName, loading: walletLoading, refetch: refetchWallet } = useCreditsWallet();
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeekMonday(new Date()));
  const [sheetDayKey, setSheetDayKey] = useState<string | null>(null);
  const [highlightBookingId, setHighlightBookingId] = useState<string | null>(null);
  const [cancelErr, setCancelErr] = useState<string | null>(null);
  const [cancelLoadingId, setCancelLoadingId] = useState<string | null>(null);
  /** Visible window 06:00–20:00 (matches typical studio day). */
  const hours = useMemo(() => Array.from({ length: 15 }).map((_, i) => 6 + i), []);
  const rowHeight = 48; // px; keep in sync with hour row `<div style={{ height: rowHeight }}>` below
  const cellInset = 4; // px padding inside each hour row so cards never cross the grid line

  const mockForWeek = useMemo(() => mockBookingsForWeek(weekStart), [weekStart]);

  const allBookings = useMemo(() => {
    const seen = new Set<string>();
    const out: YogaBooking[] = [];
    for (const b of [...mockForWeek, ...bookings]) {
      if (seen.has(b.id)) continue;
      seen.add(b.id);
      out.push(b);
    }
    return out.sort((a, b) => {
      if (a.month !== b.month) return a.month.localeCompare(b.month);
      if (a.day !== b.day) return a.day - b.day;
      return a.time.localeCompare(b.time);
    });
  }, [mockForWeek, bookings]);

  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const byDay = useMemo(() => {
    const map = new Map<string, YogaBooking[]>();
    const start = new Date(weekStart);
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 7);
    for (const b of allBookings) {
      const d = toDate(b.month, b.day);
      if (d < start || d >= end) continue;
      const key = fmt(d);
      map.set(key, [...(map.get(key) ?? []), b]);
    }
    return map;
  }, [allBookings, weekStart]);

  const sheetBookings = sheetDayKey ? (byDay.get(sheetDayKey) ?? []) : [];
  const sheetDate = sheetDayKey
    ? (() => {
        const d = new Date(sheetDayKey + "T12:00:00");
        return Number.isNaN(d.getTime()) ? null : d;
      })()
    : null;

  const visibleCount = useMemo(() => {
    return days.reduce((acc, d) => acc + (byDay.get(fmt(d))?.length ?? 0), 0);
  }, [days, byDay]);

  function openDaySheet(dayKey: string, focusId?: string) {
    setCancelErr(null);
    setSheetDayKey(dayKey);
    setHighlightBookingId(focusId ?? null);
  }

  function closeSheet(open: boolean) {
    if (!open) {
      setSheetDayKey(null);
      setHighlightBookingId(null);
      setCancelErr(null);
      setCancelLoadingId(null);
    }
  }

  const rangeLabel = `${days[0]?.toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${days[6]?.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

  function shiftWeek(offset: number) {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(prev.getDate() + offset * 7);
      return d;
    });
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm md:flex md:items-start md:justify-between md:gap-4">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Pilot · Member</p>
          <h2 className="mt-0.5 text-sm font-semibold text-foreground">Calendar</h2>
          <p className="mt-1 max-w-2xl text-xs leading-snug text-muted-foreground">
            Week grid and list share the same bookings. Desk sees the same economics on utilization and the credit ledger.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="mt-2 inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11px] font-semibold text-foreground transition hover:bg-muted md:mt-0"
        >
          <LayoutDashboard className="size-3" aria-hidden />
          Desk
        </Link>
      </div>

      <Tabs value={view} onValueChange={(v) => setCalendarView(v === "list" ? "list" : "week")} className="w-full">
        <TabsList className="grid h-10 w-full max-w-md grid-cols-2">
          <TabsTrigger value="week" className="text-xs sm:text-sm">
            Week
          </TabsTrigger>
          <TabsTrigger value="list" className="text-xs sm:text-sm">
            List
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4 outline-none">
          <UpcomingReservationsList />
        </TabsContent>

        <TabsContent value="week" className="mt-4 space-y-3 outline-none">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Week view</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">Grid · tap a block for detail and cancel.</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/35 px-2 py-1 text-xs font-semibold text-foreground">
          {allBookings.length} booked
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Previous week"
            onClick={() => shiftWeek(-1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted/50"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setWeekStart(startOfWeekMonday(new Date()))}
            className="rounded-lg border border-border px-2 py-1 text-[11px] font-semibold text-foreground hover:bg-muted/50"
          >
            This week
          </button>
          <button
            type="button"
            aria-label="Next week"
            onClick={() => shiftWeek(1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted/50"
          >
            <ChevronRight className="size-3.5" />
          </button>
          <div className="ml-1 text-xs font-semibold text-foreground">{rangeLabel}</div>
        </div>
        <div className="text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
          {visibleCount} this week
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1100px] overflow-hidden rounded-xl border border-border bg-background">
          <div className="sticky top-0 z-20 grid grid-cols-[86px_repeat(7,minmax(0,1fr))] border-b border-border bg-muted/40 backdrop-blur-sm backdrop-blur">
            <div className="px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Time</div>
            {days.map((d) => {
              const key = fmt(d);
              const count = byDay.get(key)?.length ?? 0;
              const hasSessions = count > 0;
              return (
                <div key={`head-${key}`} className="border-l border-border">
                  {hasSessions ? (
                    <button
                      type="button"
                      onClick={() => openDaySheet(key)}
                      className="w-full px-2 py-2 text-left transition hover:bg-indigo-50/80 dark:hover:bg-indigo-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                    >
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {d.toLocaleDateString(undefined, { weekday: "short" })}
                      </div>
                      <div className="text-xs font-bold text-foreground mt-0.5">
                        {d.toLocaleDateString(undefined, { month: "2-digit", day: "2-digit" })}
                      </div>
                      <div className="text-[10px] font-medium text-indigo-700 dark:text-indigo-300 mt-0.5">
                        {count} · detail
                      </div>
                    </button>
                  ) : (
                    <div className="px-2 py-2">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {d.toLocaleDateString(undefined, { weekday: "short" })}
                      </div>
                      <div className="text-xs font-bold text-foreground mt-0.5">
                        {d.toLocaleDateString(undefined, { month: "2-digit", day: "2-digit" })}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">-</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-[86px_repeat(7,minmax(0,1fr))]">
            <div className="border-r border-border">
              {hours.map((h) => (
                <div
                  key={`h-${h}`}
                  className="box-border px-2.5 border-b border-border/60 text-[10px] text-muted-foreground flex items-start pt-1 leading-none"
                  style={{ height: rowHeight }}
                >
                  {String(h).padStart(2, "0")}:00
                </div>
              ))}
            </div>

            {days.map((d) => {
              const key = fmt(d);
              const items = byDay.get(key) ?? [];
              return (
                <div key={`col-${key}`} className="relative border-r border-border last:border-r-0" style={{ height: rowHeight * hours.length }}>
                  {hours.map((h) => (
                    <div
                      key={`line-${key}-${h}`}
                      className="box-border border-b border-border/60"
                      style={{ height: rowHeight }}
                    />
                  ))}

                  {items.map((b) => {
                    const hour = parseHour(b.time);
                    const lastRow = hours.length - 1;
                    const fracInDay = Math.max(0, hour - 6);
                    const rowIndex = Math.min(lastRow, Math.max(0, Math.floor(fracInDay)));
                    const slotTop = rowIndex * rowHeight;
                    const slotBottom = slotTop + rowHeight;
                    const offsetInSlot = (fracInDay - rowIndex) * rowHeight;
                    const top = slotTop + offsetInSlot + cellInset;
                    const maxHeight = Math.max(0, slotBottom - top - cellInset);
                    const chip = styleChip(b.name);
                    const compactCard = maxHeight > 0 && maxHeight < 30;
                    if (maxHeight <= 0) {
                      return null;
                    }
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => openDaySheet(key, b.id)}
                        className={cn(
                          "absolute left-0.5 right-0.5 overflow-hidden rounded-md border border-indigo-600/35 bg-card text-left shadow-sm transition",
                          "dark:border-indigo-400/28 dark:bg-card/90",
                          "hover:border-indigo-600/50 hover:shadow dark:hover:border-indigo-400/45",
                          compactCard ? "flex flex-col justify-center gap-0.5 px-1 py-0.5" : "flex flex-col"
                        )}
                        style={{ top, height: maxHeight }}
                      >
                        {compactCard ? (
                          <>
                            <div className="flex min-h-0 items-center justify-between gap-1">
                              <span className="min-w-0 truncate text-[9px] font-bold tabular-nums text-indigo-950 dark:text-indigo-100">
                                {b.time}
                              </span>
                              <span className={`shrink-0 rounded-full border px-1 py-px text-[8px] font-semibold leading-none ${chip}`}>
                                {b.paidWith === "credits" ? `€${b.priceEUR}` : b.paidWith}
                              </span>
                            </div>
                            <div className="truncate text-[10px] font-semibold leading-tight text-foreground">
                              {b.name}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex h-5 shrink-0 items-center justify-between gap-2 border-b border-indigo-200/50 bg-indigo-50/80 px-1.5 dark:border-indigo-500/20 dark:bg-indigo-950/45">
                              <span className="min-w-0 truncate text-[9px] font-bold tabular-nums tracking-tight text-indigo-950 dark:text-indigo-100">
                                {b.time}
                              </span>
                              <span className={`shrink-0 rounded-full border px-1.5 py-px text-[8px] font-semibold leading-none ${chip}`}>
                                {b.paidWith === "credits" ? `€${b.priceEUR}` : b.paidWith}
                              </span>
                            </div>
                            <div className="min-h-0 flex-1 space-y-px overflow-hidden px-1.5 py-0.5">
                              <div className="truncate text-[10px] font-semibold leading-tight text-foreground">
                                {b.name}
                              </div>
                              <div className="truncate text-[9px] leading-tight text-muted-foreground">
                                {getYogaStudioById(b.studioId)?.name ?? b.studioId}
                              </div>
                            </div>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {visibleCount === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-muted/25 px-6 py-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
            <Calendar className="size-6" aria-hidden />
          </div>
          <div className="mt-4 text-base font-semibold text-foreground">No sessions this week</div>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Confirm a booking from the schedule or choose another week. The grid updates from your saved reservations.
          </p>
          <Link
            href="/yoga/schedule"
            className="mt-5 inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Browse schedule
          </Link>
        </div>
      ) : null}

      <Sheet open={Boolean(sheetDayKey)} onOpenChange={closeSheet}>
        <SheetContent
          side="right"
          overlayClassName="bg-black/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          className={cn(
            "flex w-full max-h-[calc(100vh-8px)] min-h-0 flex-col gap-0 overflow-hidden p-0",
            "top-1 bottom-1 right-1 h-auto border border-border bg-background shadow-2xl sm:right-1",
            "rounded-l-2xl border-r-0",
            "sm:max-w-2xl",
            "[&>button.absolute]:hidden"
          )}
        >
          <div className="flex h-8 shrink-0 items-center justify-between gap-3 border-b border-border/80 bg-muted/35 px-3 backdrop-blur-sm">
            <span className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              FlowFill · Day detail
            </span>
            <SheetClose className="relative right-0 top-0 flex size-7 shrink-0 items-center justify-center rounded-md opacity-80 ring-offset-background transition hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-1">
              <X className="size-3.5" strokeWidth={2} />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-1">
            <div className="border-b border-border/70 bg-muted/30 px-4 py-3">
              <SheetHeader className="space-y-0.5 p-0 text-left">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                  My schedule · credits
                </p>
                <SheetTitle className="text-lg font-bold leading-snug text-foreground">
                  {sheetDate
                    ? sheetDate.toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })
                    : "Day"}
                </SheetTitle>
                <SheetDescription className="text-xs leading-relaxed text-muted-foreground">
                  {sheetBookings.length} session{sheetBookings.length === 1 ? "" : "s"} on this day. Payment method and
                  wallet snapshot.
                </SheetDescription>
              </SheetHeader>
            </div>

            <div className="space-y-5 px-4 pb-4 pt-4">
            <section
              className="rounded-2xl border border-indigo-200/80 bg-indigo-50/60 p-4 dark:border-indigo-500/25 dark:bg-indigo-500/10"
              aria-labelledby="credit-wallet-heading"
            >
              <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
                <Coins className="size-4 shrink-0" aria-hidden />
                <h2 id="credit-wallet-heading" className="text-sm font-bold">
                  Credit wallet · {walletName}
                </h2>
              </div>
              <p className="mt-1 text-xs font-medium text-indigo-800/80 dark:text-indigo-200/80">
                {MOCK_CREDIT_PROFILE.memberTier}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-indigo-200/60 bg-card/80 px-3 py-2.5 dark:border-indigo-500/20 dark:bg-card/55">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Balance</div>
                  <div className="text-lg font-extrabold tabular-nums text-foreground">
                    {walletLoading ? "…" : `€${balanceEUR}`}
                  </div>
                </div>
                <div className="rounded-xl border border-indigo-200/60 bg-card/80 px-3 py-2.5 dark:border-indigo-500/20 dark:bg-card/55">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Monthly cap</div>
                  <div className="text-lg font-extrabold tabular-nums text-foreground">€{MOCK_CREDIT_PROFILE.monthlyAllowanceEUR}</div>
                </div>
                <div className="col-span-2 rounded-xl border border-indigo-200/60 bg-card/80 px-3 py-2.5 sm:col-span-1 dark:border-indigo-500/20 dark:bg-card/55">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Used this month</div>
                  <div className="text-lg font-extrabold tabular-nums text-foreground">€{MOCK_CREDIT_PROFILE.usedThisMonthEUR}</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
                  <Sparkles className="size-3.5" aria-hidden />
                  +€{MOCK_CREDIT_PROFILE.pendingCashbackEUR} pending cashback
                </span>
              </div>
              <p className="mt-3 text-xs font-medium leading-relaxed text-indigo-900/85 dark:text-indigo-100/90">
                {MOCK_CREDIT_PROFILE.nextReward}
              </p>
            </section>

            <section aria-labelledby="sessions-heading">
              <h2 id="sessions-heading" className="text-sm font-bold text-foreground">
                Classes this day
              </h2>
              <ul className="mt-3 space-y-3">
                {sheetBookings.map((b) => {
                  const studio = getYogaStudioById(b.studioId)?.name ?? b.studioId;
                  const highlighted = highlightBookingId === b.id;
                  const chip = styleChip(b.name);
                  return (
                    <li
                      key={b.id}
                      className={cn(
                        "rounded-2xl border border-border bg-card p-4",
                        highlighted && "ring-2 ring-indigo-500/50 dark:ring-indigo-400/40"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-muted-foreground">{b.time}</div>
                          <div className="text-base font-bold text-foreground">{b.name}</div>
                          <div className="mt-1 text-sm text-muted-foreground">{studio}</div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span>{b.dur}</span>
                            <span>·</span>
                            <span>{b.teacher || "TBD"}</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-2">
                          {b.paidWith === "credits" ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-800 dark:border-indigo-500/30 dark:bg-indigo-500/15 dark:text-indigo-200">
                              <Coins className="size-3" aria-hidden />€{b.priceEUR} credits
                            </span>
                          ) : b.paidWith === "membership" ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-800 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200">
                              Membership
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-bold text-foreground">
                              <CreditCard className="size-3" aria-hidden /> Card €{b.priceEUR}
                            </span>
                          )}
                          <span className={`text-[10px] font-semibold capitalize ${chip}`}>{b.paidWith}</span>
                        </div>
                      </div>
                      {!isMockBooking(b.id) ? (
                        <div className="mt-4 border-t border-border/60 pt-3">
                          {cancelErr && cancelLoadingId === b.id ? (
                            <div className="mb-2 text-xs text-rose-700 dark:text-rose-200">{cancelErr}</div>
                          ) : null}
                          <button
                            type="button"
                            disabled={cancelLoadingId !== null}
                            onClick={async () => {
                              setCancelErr(null);
                              setCancelLoadingId(b.id);
                              if (b.serverBookingId != null) {
                                try {
                                  await backend.cancelBooking(b.serverBookingId);
                                } catch (e) {
                                  setCancelErr(e instanceof Error ? e.message : "Could not cancel on server.");
                                  setCancelLoadingId(null);
                                  return;
                                }
                              }
                              removeBooking(b.id);
                              void refreshBookingsFromApi();
                              void refetchWallet();
                              setCancelLoadingId(null);
                              if (sheetBookings.filter((x) => x.id !== b.id).length === 0) {
                                setSheetDayKey(null);
                                setHighlightBookingId(null);
                              }
                            }}
                            className="w-full rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200 dark:hover:bg-rose-950/70"
                          >
                            {cancelLoadingId === b.id ? "Cancelling…" : "Cancel booking"}
                          </button>
                        </div>
                      ) : (
                        <p className="mt-3 text-[11px] text-muted-foreground">
                          Network roster suggestion: book from the schedule to add it to your account.
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
            </div>
          </div>
        </SheetContent>
      </Sheet>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function YogaCalendarPage() {
  return (
    <Suspense fallback={<div className="ff-panel h-64 animate-pulse rounded-xl" aria-hidden />}>
      <YogaCalendarPageInner />
    </Suspense>
  );
}

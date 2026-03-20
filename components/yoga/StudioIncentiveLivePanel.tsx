"use client";

import { useMemo, type ComponentType } from "react";
import { Activity, Coins, TrendingUp, Users } from "lucide-react";
import { useAuth } from "@/components/auth/useAuth";
import { useYogaBookings } from "@/components/yoga/useYogaBookings";
import { getYogaStudioById } from "@/components/yoga/useYogaStudio";
import {
  buildDemandMap,
  demandCurveForYogaBooking,
  rollingPeriod,
  yogaBookingsToLifecycles,
} from "@/lib/bookingLifecycleFromYoga";
import { studioPeriodSummary } from "@/lib/incentive-earnings-model";
import { cn } from "@/lib/utils";

function bookingInPeriod(month: string, day: number, period: { from: string; to: string }) {
  const iso = `${month}-${String(day).padStart(2, "0")}`;
  return iso >= period.from && iso <= period.to;
}

type Props = {
  studioId: string;
  className?: string;
};

export function StudioIncentiveLivePanel({ studioId, className }: Props) {
  // FIXED: Destructured 'hydrated' to match the updated useYogaBookings hook
  const { bookings, hydrated } = useYogaBookings();
  
  // FIXED: Destructured 'hydrated' as 'authHydrated' to match updated useAuth hook
  const { user, hydrated: authHydrated } = useAuth();

  const customerKey = user?.id != null ? String(user.id) : "session-anonymous";

  const period = useMemo(() => {
    const relevant = bookings.filter((b) => b.studioId === studioId);
    if (!relevant.length) return rollingPeriod(30);
    const dates = relevant
      .map((b) => `${b.month}-${String(b.day).padStart(2, "0")}`)
      .sort();
    return { from: dates[0]!, to: dates[dates.length - 1]! };
  }, [bookings, studioId]);

  const studioBookings = useMemo(() => {
    return bookings.

import { YogaBooking } from "@/components/yoga/useYogaBookings";

/**
 * Updated BookingLifecycle to include financial fields required by the
 * incentive earnings model.
 */
export type BookingLifecycle = {
  id: string;
  studioId: string;
  customerId: string;
  slot: string;
  date: string;
  bookedAt: string;
  // FIXED: Added missing properties required by the earnings model
  attended: boolean;
  incentiveCreditEUR: number;
  grossListPriceEUR: number;
};

export function yogaBookingsToLifecycles(
  bookings: YogaBooking[],
  fallbackCustomerId: string
): BookingLifecycle[] {
  return bookings.map((b) => {
    const slot = `${b.month}-${String(b.day).padStart(2, "0")} ${b.time}`;
    const date = `${b.month}-${String(b.day).padStart(2, "0")}`;
    
    return {
      id: b.id,
      studioId: b.studioId,
      customerId: b.customerId ?? fallbackCustomerId,
      slot,
      date,
      bookedAt: new Date(b.createdAt || Date.now()).toISOString(),
      // FIXED: Populating required fields from the booking data
      attended: true, // Defaulting to true for live panel estimates
      incentiveCreditEUR: b.paidWith === "credits" ? b.priceEUR : 0,
      grossListPriceEUR: b.priceEUR,
    };
  });
}

export function buildDemandMap(bookings: YogaBooking[]) {
  const map: Record<string, number> = {};
  bookings.forEach((b) => {
    const key = `${b.month}-${String(b.day).padStart(2, "0")} ${b.time}`;
    map[key] = (map[key] || 0) + 1;
  });
  return map;
}

export function rollingPeriod(days: number) {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - days);
  
  const fmt = (d: Date) => {
    const month = d.toISOString().split("T")[0]!.substring(0, 7);
    const day = String(d.getDate()).padStart(2, "0");
    return `${month}-${day}`;
  };
  return { from: fmt(from), to: fmt(to) };
}

export function demandCurveForYogaBooking(b: YogaBooking) {
  const hour = parseInt(b.time.split(":")[0] || "0");
  if (hour >= 17 && hour <= 20) return { desirability: "peak" as const };
  if (hour >= 7 && hour <= 9) return { desirability: "shoulder" as const };
  return { desirability: "off_peak" as const };
}

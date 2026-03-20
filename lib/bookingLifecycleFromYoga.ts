import { YogaBooking } from "@/components/yoga/useYogaBookings";
import { BookingLifecycle, TimeSlot } from "./incentive-earnings-model";

/**
 * Helper to convert "HH:MM" string to minutes from midnight.
 */
function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function yogaBookingsToLifecycles(
  bookings: YogaBooking[],
  fallbackCustomerId: string
): BookingLifecycle[] {
  return bookings.map((b) => {
    const date = `${b.month}-${String(b.day).padStart(2, "0")}`;
    
    // FIXED: Convert string time to TimeSlot object required by the model
    const startMinutes = parseTimeToMinutes(b.time);
    const slot: TimeSlot = {
      startMinutes,
      endMinutes: startMinutes + 60, // Defaulting to 1 hour duration
    };

    return {
      id: b.id,
      studioId: b.studioId,
      customerId: b.customerId ?? fallbackCustomerId,
      slot, // Now correctly typed as TimeSlot
      date,
      bookedAt: new Date(b.createdAt || Date.now()).toISOString(),
      attended: true,
      incentiveCreditEUR: b.paidWith === "credits" ? b.priceEUR : 0,
      grossListPriceEUR: b.priceEUR,
    };
  });
}

export function buildDemandMap(bookings: YogaBooking[]) {
  // Use a Map to match the signature expected by studioPeriodSummary
  const map = new Map<string, any>();
  bookings.forEach((b) => {
    map.set(b.id, {
      slot: { startMinutes: parseTimeToMinutes(b.time), endMinutes: parseTimeToMinutes(b.time) + 60 },
      desirability: demandCurveForYogaBooking(b).desirability,
      baselineFillRate: 0.5,
    });
  });
  return map;
}

export function rollingPeriod(days: number) {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - days);
  const fmt = (d: Date) => d.toISOString().split("T")[0]!;
  return { from: fmt(from), to: fmt(to) };
}

export function demandCurveForYogaBooking(b: YogaBooking) {
  const hour = parseInt(b.time.split(":")[0] || "0");
  if (hour >= 17 && hour <= 20) return { desirability: "peak" as const };
  if (hour >= 7 && hour <= 9) return { desirability: "shoulder" as const };
  return { desirability: "off_peak" as const };
}

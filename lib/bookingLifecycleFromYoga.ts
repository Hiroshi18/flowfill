import { YogaBooking } from "@/components/yoga/useYogaBookings";
import { BookingLifecycle, TimeSlot, DemandCurvePoint, BookingId } from "./incentive-earnings-model";

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
    const startMinutes = parseTimeToMinutes(b.time);
    const slot: TimeSlot = {
      startMinutes,
      endMinutes: startMinutes + 60,
    };

    return {
      id: b.id,
      studioId: b.studioId,
      customerId: b.customerId ?? fallbackCustomerId,
      slot,
      date,
      bookedAt: new Date(b.createdAt || Date.now()).toISOString(),
      attended: true,
      incentiveCreditEUR: b.paidWith === "credits" ? b.priceEUR : 0,
      grossListPriceEUR: b.priceEUR,
    };
  });
}

export function buildDemandMap(bookings: YogaBooking[]): Map<BookingId, DemandCurvePoint> {
  const map = new Map<BookingId, DemandCurvePoint>();
  bookings.forEach((b) => {
    const startMinutes = parseTimeToMinutes(b.time);
    map.set(b.id, {
      slot: { startMinutes, endMinutes: startMinutes + 60 },
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

import YogaShell from "@/components/yoga/YogaShell";
import { YogaBookingsProvider } from "@/components/yoga/useYogaBookings";

export default function YogaLayout({ children }: { children: React.ReactNode }) {
  return (
    <YogaBookingsProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        <YogaShell>{children}</YogaShell>
      </div>
    </YogaBookingsProvider>
  );
}

import YogaScheduleSwitcher from "@/components/yoga/YogaScheduleSwitcher";
import { ScheduleMemberGuide } from "@/components/yoga/ScheduleMemberGuide";
import { SchedulePageIntro } from "@/components/yoga/SchedulePageIntro";
import { YogaScheduleLiveInsights } from "@/components/yoga/YogaScheduleLiveInsights";

export default function YogaSchedulePage() {
  return (
    <div className="space-y-3">
      <SchedulePageIntro />
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <YogaScheduleSwitcher />
      </div>
      <YogaScheduleLiveInsights />
      <ScheduleMemberGuide />
    </div>
  );
}

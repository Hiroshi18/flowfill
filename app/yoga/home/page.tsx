"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StudioScaffold } from "@/components/ds/studio";
import { StudioDirectoryTile } from "@/components/yoga/StudioDirectoryTile";
import { StudiosDataRibbon } from "@/components/yoga/StudiosDataRibbon";
import { YogaStudiosGlobePanel } from "@/components/yoga/YogaStudiosGlobePanel";
import { useYogaStudio } from "@/components/yoga/useYogaStudio";
import { useStudiosForUi } from "@/hooks/use-studios-for-ui";

function YogaHomeContent() {
	const { studios, source, loading, error } = useStudiosForUi();
	const router = useRouter();
	const { studioId, setActiveStudio } = useYogaStudio();

	return (
		<StudioScaffold
			eyebrow="Discover"
			title="Pick your studio"
			description="Tap the studio you actually go to. Your schedule and any little “fill this class” offers line up with what the front desk sees — same place, same names."
			action={
				<div className="flex flex-col items-end gap-1 text-right">
					<Link href="/yoga/schedule" className="text-xs font-semibold text-primary hover:underline sm:text-sm">
						Schedule
					</Link>
					<Link href="/dashboard/directory" className="text-[11px] font-medium text-muted-foreground hover:text-foreground hover:underline">
						Directory
					</Link>
					<Link href="/dashboard" className="text-[11px] font-medium text-muted-foreground hover:text-foreground hover:underline">
						Desk
					</Link>
				</div>
			}
		>
			<div className="space-y-2">
				<p className="text-xs text-muted-foreground">
					<span className="font-medium text-foreground">Next:</span> tap a card to open that studio&apos;s schedule.
				</p>
				<StudiosDataRibbon loading={loading} error={error} source={source} />
			</div>
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{studios.map((s) => (
					<StudioDirectoryTile
						key={s.id}
						studio={s}
						active={s.id === studioId}
						layout="home"
						onSelect={() => {
							setActiveStudio(s.id);
							router.push(`/yoga/schedule?studio=${encodeURIComponent(s.id)}`);
						}}
					/>
				))}
			</div>

			<YogaStudiosGlobePanel studioId={studioId} setActiveStudio={setActiveStudio} />
		</StudioScaffold>
	);
}

export default function YogaHomePage() {
	return (
		<Suspense fallback={<div className="ff-panel h-48 animate-pulse" aria-hidden />}>
			<YogaHomeContent />
		</Suspense>
	);
}

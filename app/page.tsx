import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero";
import { HomeSections } from "@/components/landing/HomeSections";
import { FlowFillSiteFooter } from "@/components/FlowFillJourney";
import { LogosSection } from "@/components/logos-section";

export default function Home() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<Header />
			<main className="relative min-h-[calc(100vh-3.5rem)]">
				<HeroSection />
				<HomeSections />
				<div className="ff-page-frame">
					<LogosSection />
				</div>
				<FlowFillSiteFooter />
			</main>
		</div>
	);
}

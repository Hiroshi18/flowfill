"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LandingContent } from "@/components/landing/LandingContent";

function LandingWrapper() {
  // This hook call is what requires the Suspense boundary
  const searchParams = useSearchParams();
  return <LandingContent />;
}

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden">
      {/* Background stays rendered even during loading */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-muted/20 via-background to-background" />
      
      <Suspense fallback={
        <div className="flex h-[50vh] w-full items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }>
        <LandingWrapper />
      </Suspense>
    </main>
  );
}

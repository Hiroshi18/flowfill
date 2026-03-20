"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
// Import your actual Landing UI components
import { LandingContent } from "@/components/landing/LandingContent";

function LandingWrapper() {
  // This component "traps" the useSearchParams call
  const searchParams = useSearchParams(); 
  return <LandingContent />;
}

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden">
      {/* Structural elements like background gradients stay OUTSIDE Suspense */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-muted/20 via-background to-background" />
      
      <Suspense fallback={
        <div className="flex h-96 w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }>
        <LandingWrapper />
      </Suspense>
    </main>
  );
}

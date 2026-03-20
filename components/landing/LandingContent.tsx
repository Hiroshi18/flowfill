"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LandingContent() {
  return (
    <div className="container relative z-10 flex flex-col items-center px-4 py-24 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
        Flow<span className="text-primary">fill</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
        Intelligent capacity management and automated incentives for modern studios.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Button size="lg" asChild>
          <Link href="/login">Get Started</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/about">Learn More</Link>
        </Button>
      </div>
    </div>
  );
}

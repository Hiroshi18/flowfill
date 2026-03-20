"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
// Import your other components (Hero, Features, etc.)

function HomeContent() {
  const searchParams = useSearchParams();
  // Any logic using searchParams goes here...

  return (
    <>
      {/* Your existing landing page JSX */}
      <main>
        <h1>Welcome to Flowfill</h1>
        {/* ... */}
      </main>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

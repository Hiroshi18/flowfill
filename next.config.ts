import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      { source: "/book/demo-studio", destination: "/yoga/schedule", permanent: false },
      { source: "/yoga/today", destination: "/yoga/schedule", permanent: false },
      { source: "/yoga/search", destination: "/yoga/home", permanent: false },
      { source: "/yoga/upcoming", destination: "/yoga/my-calendar?view=list", permanent: false },
      { source: "/yoga/store", destination: "/yoga/credits", permanent: false },
      { source: "/yoga/community", destination: "/yoga/home", permanent: false },
      { source: "/yoga/completed", destination: "/yoga/schedule", permanent: false },
      { source: "/yoga/saved", destination: "/yoga/schedule", permanent: false },
      { source: "/yoga/programs", destination: "/yoga/schedule", permanent: false },
    ];
  },
};

export default nextConfig;

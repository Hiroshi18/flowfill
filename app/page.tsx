import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <div className="text-5xl mb-6">⚡</div>
        <h1 className="text-5xl font-bold mb-4">FlowFill</h1>
        <p className="text-zinc-400 text-xl mb-10">
          Fill your empty classes with smart credit incentives
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition"
          >
            Studio Dashboard →
          </Link>
          <Link
            href="/book/demo-studio"
            className="border border-zinc-700 hover:border-zinc-500 text-white px-8 py-3 rounded-full font-semibold transition"
          >
            View Booking Page
          </Link>
        </div>
      </div>
    </div>
  );
}
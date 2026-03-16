import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-800 bg-zinc-950">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-lg">⚡</span>
        <span className="font-bold">FlowFill</span>
      </Link>
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="text-zinc-400 hover:text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition text-sm">
          Dashboard
        </Link>
        <Link href="/credits" className="text-zinc-400 hover:text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition text-sm">
          Credits
        </Link>
        <Link href="/book/demo-studio" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
          Booking Page
        </Link>
      </div>
    </nav>
  )
}
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <span className="font-bold text-lg">FlowFill</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-zinc-400 hover:text-white transition text-sm">Dashboard</Link>
          <Link href="/book/demo-studio" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">See Demo</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-8 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm px-4 py-2 rounded-full mb-8">
          ⚡ Smart credit incentives for fitness studios
        </div>
        <h1 className="text-6xl font-bold mb-6 leading-tight">
          Fill your empty classes.<br />
          <span className="text-indigo-400">Automatically.</span>
        </h1>
        <p className="text-zinc-400 text-xl mb-10 max-w-2xl mx-auto">
          FlowFill detects underbooked classes and offers smart credit incentives to shift customers into empty slots. More revenue, happier customers.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition text-lg">
            Studio Dashboard →
          </Link>
          <Link href="/book/demo-studio" className="border border-zinc-700 hover:border-zinc-500 text-white px-8 py-4 rounded-xl font-semibold transition text-lg">
            View Booking Page
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-8 py-16 grid grid-cols-3 gap-6">
        {[
          { value: "69.7%", label: "Average no-show rate", sub: "across fitness studios" },
          { value: "€20K+", label: "Revenue lost per period", sub: "to empty class spots" },
          { value: "3.5x", label: "ROI for studios", sub: "recovering just 20% of lost revenue" },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-indigo-400 mb-2">{stat.value}</p>
            <p className="font-semibold mb-1">{stat.label}</p>
            <p className="text-zinc-500 text-sm">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How FlowFill works</h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            { step: "01", icon: "📊", title: "Detects empty slots", desc: "FlowFill monitors your class schedule in real time and identifies underbooked slots." },
            { step: "02", icon: "⚡", title: "Activates credits", desc: "48 hours before class, dynamic credits appear automatically. The closer to the class, the higher the reward." },
            { step: "03", icon: "💰", title: "Studio earns more", desc: "Customers book empty slots to earn credits. You fill classes, they save money. Everyone wins." },
          ].map((item, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="text-3xl mb-4">{item.icon}</div>
              <div className="text-zinc-600 text-xs font-mono mb-2">STEP {item.step}</div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-zinc-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Credit logic */}
      <div className="max-w-5xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Dynamic credit system</h2>
        <p className="text-zinc-400 text-center mb-10">Credits activate automatically based on fill rate and time remaining</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { time: "48 hours before", condition: "Below 60% full", credit: "€3 credit", color: "border-amber-500/30 bg-amber-500/10", badge: "text-amber-400" },
            { time: "24 hours before", condition: "Below 40% full", credit: "€5 credit", color: "border-orange-500/30 bg-orange-500/10", badge: "text-orange-400" },
            { time: "6 hours before", condition: "Below 40% full", credit: "€8 credit", color: "border-red-500/30 bg-red-500/10", badge: "text-red-400" },
          ].map((item, i) => (
            <div key={i} className={`border rounded-xl p-6 ${item.color}`}>
              <p className={`text-2xl font-bold mb-2 ${item.badge}`}>{item.credit}</p>
              <p className="font-semibold mb-1">{item.time}</p>
              <p className="text-zinc-400 text-sm">{item.condition}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-8 py-16 text-center">
        <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to fill your classes?</h2>
          <p className="text-zinc-400 mb-8">€99/month. Cancel anytime. Setup in minutes.</p>
          <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition text-lg">
            Get Started →
          </Link>
        </div>
      </div>

    </div>
  );
}
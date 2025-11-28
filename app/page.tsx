"use client";

import Link from "next/link";
import { useState } from "react";

// --- Icons & Visual Helpers ---

const ArrowRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="inline-block transition-transform group-hover:translate-x-1"
  >
    <path
      d="M6.66669 4L10.6667 8L6.66669 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlayIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="ml-1"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

// --- Mockup Components (CSS Art) ---

const UrlToVideoMockup = () => (
  <div className="relative overflow-hidden rounded-xl border border-black/5 bg-white shadow-2xl">
    <div className="flex items-center gap-2 border-b border-black/5 bg-gray-50/50 px-4 py-3">
      <div className="flex gap-1.5">
        <div className="h-2.5 w-2.5 rounded-full bg-red-400/20" />
        <div className="h-2.5 w-2.5 rounded-full bg-amber-400/20" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-400/20" />
      </div>
      <div className="mx-auto flex h-6 w-1/2 items-center rounded-md bg-white border border-black/5 px-2 text-[10px] text-gray-400 shadow-sm">
        https://your-app-url.com
      </div>
    </div>
    <div className="grid grid-cols-[1fr_280px] h-[400px]">
      {/* Left: Content Analysis / Script */}
      <div className="border-r border-black/5 bg-gray-50/30 p-6 space-y-6">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          Analyzing Content
        </div>
        <div className="space-y-3">
          <div className="h-2 w-1/3 rounded-full bg-black/10" />
          <div className="h-2 w-3/4 rounded-full bg-black/5" />
          <div className="h-2 w-1/2 rounded-full bg-black/5" />
        </div>
        <div className="h-px w-full bg-black/5" />
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="h-2 w-16 rounded-full bg-black/10" />
            <div className="h-4 w-8 rounded bg-blue-100 text-[8px] text-blue-600 flex items-center justify-center">
              AI
            </div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-black/5 text-[10px] leading-relaxed text-gray-500 shadow-sm">
            "Experience the future of productivity. Our app streamlines your
            workflow..."
          </div>
        </div>
      </div>

      {/* Right: Video Preview */}
      <div className="relative bg-white p-6 flex flex-col">
        <div className="flex-1 rounded-lg bg-gray-900 relative overflow-hidden group shadow-lg">
          {/* Simulated Video Content */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-80"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform group-hover:scale-110 cursor-pointer">
              <PlayIcon />
            </div>
          </div>
          {/* Video timeline */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex justify-between text-[9px] text-white/80 mb-1">
              <span>0:00</span>
              <span>0:15</span>
            </div>
            <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <div className="h-2 w-20 bg-black/10 rounded-full"></div>
            <div className="flex gap-1">
              <div className="h-4 w-4 rounded-full bg-blue-500/10"></div>
              <div className="h-4 w-4 rounded-full bg-pink-500/10"></div>
              <div className="h-4 w-4 rounded-full bg-indigo-500/10"></div>
            </div>
          </div>
          <button className="w-full py-2 bg-black text-white text-xs font-medium rounded-md hover:bg-gray-800 transition-colors">
            Export for Socials
          </button>
        </div>
      </div>
    </div>
  </div>
);

const StatCard = ({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: string;
}) => (
  <div className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
    <div className="text-sm text-gray-500 font-medium">{label}</div>
    <div className="mt-2 flex items-end justify-between">
      <div className="text-3xl font-semibold tracking-tight text-gray-900">
        {value}
      </div>
      <div className="mb-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
        {trend}
      </div>
    </div>
  </div>
);

// --- Main Component ---

export default function Home() {
  const [activeTab, setActiveTab] = useState("analyze");

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-semibold text-xl tracking-tight">
            <div className="h-6 w-6 rounded bg-black" />
            AppCine
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-black transition-colors">
              Product
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Showcase
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Pricing
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Enterprise
            </a>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <a
              href="#"
              className="hidden sm:block text-gray-600 hover:text-black"
            >
              Log in
            </a>
            <a
              href="#"
              className="rounded-full bg-black px-5 py-2.5 text-white transition hover:bg-gray-800"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl space-y-8">
              <h1 className="text-5xl font-medium tracking-tight sm:text-7xl text-black">
                Turn your URL into <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                  viral social ads.
                </span>
              </h1>
              <p className="max-w-xl text-lg text-gray-600 leading-relaxed">
                Paste your app or website link. AppCine's AI analyzes your
                content and generates high-converting video ads for Instagram,
                TikTok, and LinkedIn in seconds.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-black/10 bg-white p-1 pl-5 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <input
                    type="text"
                    placeholder="Paste your website URL..."
                    className="w-full bg-transparent outline-none text-sm"
                  />
                  <Link
                    href="/playground"
                    className="flex-shrink-0 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Generate Video
                  </Link>
                </div>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  No credit card required
                </span>
                <span>·</span>
                <span>100+ brands trust us</span>
              </p>
            </div>

            {/* Hero Visual / Dashboard Mockup */}
            <div className="mt-20">
              <UrlToVideoMockup />
            </div>

            {/* Social Proof */}
            <div className="mt-20 border-y border-black/5 py-10">
              <p className="text-center text-sm font-medium text-gray-400 mb-8">
                POWERING ADS FOR HIGH-GROWTH COMPANIES
              </p>
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 grayscale opacity-50">
                {[
                  "Acme Corp",
                  "Global Bank",
                  "Nebula",
                  "Fox",
                  "Linear",
                  "Raycast",
                ].map((name) => (
                  <span key={name} className="text-lg font-bold font-serif">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-6 bg-gray-50/50">
          <div className="mx-auto max-w-6xl space-y-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-medium sm:text-4xl tracking-tight">
                From landing page to <br /> launching campaign.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Card 1: Large span */}
              <div className="md:col-span-2 rounded-3xl border border-black/5 bg-white p-8 shadow-sm transition hover:shadow-md group cursor-default">
                <div className="h-64 w-full rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 mb-8 flex items-center justify-center relative overflow-hidden">
                  {/* Grid pattern background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                  {/* Platform Pills */}
                  <div className="absolute top-6 right-6 flex flex-col gap-2">
                    <div className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-pink-600 shadow-sm border border-pink-100">
                      Instagram Reels
                    </div>
                    <div className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-black shadow-sm border border-gray-100">
                      TikTok
                    </div>
                    <div className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-blue-600 shadow-sm border border-blue-100">
                      LinkedIn Ads
                    </div>
                  </div>

                  <div className="bg-white shadow-xl rounded-lg p-4 w-64 transform transition-transform group-hover:translate-y-[-4px]">
                    <div className="flex gap-2 mb-3">
                      <div className="h-8 w-8 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                        Ad
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="h-2 w-20 bg-gray-100 rounded" />
                        <div className="h-2 w-12 bg-gray-100 rounded" />
                      </div>
                    </div>
                    <div className="h-24 bg-gray-900 rounded mb-3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-50"></div>
                      <div className="absolute bottom-2 right-2 text-[8px] bg-black/50 text-white px-1 rounded">
                        0:15
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-2 w-16 bg-gray-100 rounded"></div>
                      <div className="h-6 px-3 bg-blue-600 rounded text-[10px] text-white flex items-center justify-center font-medium">
                        Publish
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold">
                  Multi-Platform Formatting
                </h3>
                <p className="mt-2 text-gray-500 max-w-md">
                  One URL generates assets optimized for every platform. 9:16
                  for Reels/TikTok, 1:1 for Instagram Feed, and 16:9 for YouTube
                  Ads.
                </p>
              </div>

              {/* Card 2: Tall */}
              <div className="md:row-span-2 rounded-3xl border border-black/5 bg-white p-8 shadow-sm transition hover:shadow-md flex flex-col">
                <div className="flex-1 rounded-xl bg-gradient-to-b from-emerald-50 to-white mb-8 border border-emerald-100/50 p-6">
                  <div className="space-y-3">
                    <StatCard label="Ad CTR" value="4.2%" trend="+1.5%" />
                    <StatCard
                      label="Generation Time"
                      value="12s"
                      trend="Fast"
                    />
                    <StatCard
                      label="Cost per Asset"
                      value="$0.50"
                      trend="-90%"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">Performance First</h3>
                <p className="mt-2 text-gray-500">
                  Our AI is trained on high-converting ad creatives. We don't
                  just make videos; we make ads that sell.
                </p>
              </div>

              {/* Card 3 */}
              <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm transition hover:shadow-md">
                <div className="h-40 w-full rounded-xl bg-orange-50 mb-6 flex items-center justify-center">
                  <div className="w-3/4 space-y-2 bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                    <div className="h-2 w-full bg-gray-100 rounded"></div>
                    <div className="h-2 w-2/3 bg-gray-100 rounded"></div>
                    <div className="mt-3 h-8 w-full bg-orange-100 rounded text-xs flex items-center justify-center text-orange-600 font-medium">
                      "Best productivity tool 2025"
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold">Smart Scripting</h3>
                <p className="mt-2 text-gray-500">
                  We extract your unique value propositions and customer
                  testimonials to write compelling ad scripts automatically.
                </p>
              </div>

              {/* Card 4 */}
              <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm transition hover:shadow-md">
                <div className="h-40 w-full rounded-xl bg-violet-50 mb-6 flex items-center justify-center">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-violet-200 blur-xl absolute top-0 left-0 opacity-50"></div>
                    <div className="h-24 w-24 rounded-2xl bg-white shadow-lg border border-violet-100 flex items-center justify-center text-4xl">
                      🎨
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-black text-white text-[10px] px-2 py-1 rounded-full">
                      Brand Safe
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold">On-Brand Styling</h3>
                <p className="mt-2 text-gray-500">
                  Upload your logo and fonts once. Every generated video will
                  look like it was made by your in-house design team.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Detail Section with Tabs */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl font-medium tracking-tight">
                  How it works.
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      id: "analyze",
                      title: "1. Paste URL",
                      desc: "We crawl your site to understand your product, features, and audience.",
                    },
                    {
                      id: "generate",
                      title: "2. AI Generation",
                      desc: "Our engine creates scripts, selects stock footage, and animates text overlays.",
                    },
                    {
                      id: "publish",
                      title: "3. Publish Ads",
                      desc: "Export optimized video files ready for your ad manager campaigns.",
                    },
                  ].map((step) => (
                    <button
                      key={step.id}
                      onClick={() => setActiveTab(step.id)}
                      className={`block text-left w-full p-6 rounded-xl border transition-all ${
                        activeTab === step.id
                          ? "bg-white border-black/10 shadow-md"
                          : "border-transparent hover:bg-gray-50"
                      }`}
                    >
                      <h4 className="text-lg font-semibold">{step.title}</h4>
                      {activeTab === step.id && (
                        <p className="mt-2 text-sm text-gray-600 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-300">
                          {step.desc}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[500px] bg-gray-100 rounded-2xl border border-black/5 relative overflow-hidden group">
                {/* Contextual graphic based on active tab */}
                <div className="absolute inset-0 flex items-center justify-center p-10">
                  {activeTab === "analyze" && (
                    <div className="w-full max-w-xs bg-white rounded-xl shadow-xl border border-black/5 overflow-hidden animate-in zoom-in duration-500">
                      <div className="bg-gray-50 border-b border-black/5 p-3 text-xs text-gray-400">
                        Scanning site...
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="h-2 w-full bg-blue-100 rounded-full animate-pulse"></div>
                        <div className="h-2 w-2/3 bg-blue-100 rounded-full animate-pulse"></div>
                        <div className="h-2 w-5/6 bg-blue-100 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  )}
                  {activeTab === "generate" && (
                    <div className="grid grid-cols-2 gap-4 animate-in zoom-in duration-500">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-32 w-32 bg-white rounded-lg shadow-lg border border-black/5 flex items-center justify-center text-2xl"
                        >
                          🎬
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === "publish" && (
                    <div className="text-center space-y-4 animate-in zoom-in duration-500">
                      <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 text-green-600 text-4xl mb-4">
                        ✓
                      </div>
                      <h3 className="text-xl font-semibold">
                        Ready for launch
                      </h3>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="mx-auto max-w-4xl rounded-3xl bg-black px-6 py-16 text-center text-white sm:px-16">
            <h2 className="text-3xl font-medium sm:text-4xl mb-6">
              Stop editing. Start growing.
            </h2>
            <p className="mx-auto max-w-xl text-lg text-gray-400 mb-10">
              Create a month's worth of video ads in minutes. Scale your
              campaigns without scaling your team.
            </p>
            <button className="rounded-full bg-white px-8 py-4 text-base font-bold text-black transition hover:bg-gray-200">
              Generate Your First Ad Free
            </button>
            <p className="mt-6 text-xs text-gray-500">
              No credit card required · Cancel anytime
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-black/5 bg-gray-50 py-12 px-6">
          <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-4">
              <div className="h-6 w-6 rounded bg-black" />
              <p className="text-sm text-gray-500">© 2025 AppCine.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
              {["Product", "Company", "Resources", "Legal"].map((col) => (
                <div key={col} className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900">{col}</h4>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li>
                      <a href="#" className="hover:text-black">
                        Link One
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-black">
                        Link Two
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-black">
                        Link Three
                      </a>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

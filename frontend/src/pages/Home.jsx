import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext, { isJwtValid } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SparkleIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036a2.63 2.63 0 001.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258a2.63 2.63 0 00-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.63 2.63 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.63 2.63 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-1">
    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>
);

const FEATURES = [
  {
    icon: "⚡",
    color: "violet",
    title: "Instant Valuations",
    desc: "Sub-second ML inference delivers accurate price estimates the moment you submit property details.",
  },
  {
    icon: "🎯",
    color: "indigo",
    title: "98%+ Accuracy",
    desc: "Ensemble models trained on millions of transactions ensure valuations you can actually trust.",
  },
  {
    icon: "📊",
    color: "cyan",
    title: "Market Insights",
    desc: "Understand neighbourhood trends, appreciation rates, and comparable sales in real time.",
  },
  {
    icon: "🔒",
    color: "emerald",
    title: "Secure Accounts",
    desc: "JWT-authenticated profiles keep your valuation history and saved properties private.",
  },
  {
    icon: "📈",
    color: "amber",
    title: "Prediction History",
    desc: "Track, compare, and revisit every prediction from your personal dashboard.",
  },
  {
    icon: "🌐",
    color: "rose",
    title: "Nationwide Data",
    desc: "Covering thousands of zip codes with continuously refreshed, region-aware price models.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Enter Property Details",
    desc: "Provide key specs — bedrooms, bathrooms, square footage, location, and more.",
    color: "from-violet-500/20 to-violet-600/10 border-violet-500/30",
    text: "text-violet-400",
  },
  {
    step: "02",
    title: "AI Analyses the Data",
    desc: "Our stacked ML pipeline benchmarks your inputs against live market comparables.",
    color: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30",
    text: "text-indigo-400",
  },
  {
    step: "03",
    title: "Get Your Valuation",
    desc: "Receive an instant price estimate with confidence range and market trend context.",
    color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
    text: "text-emerald-400",
  },
];

export default function Home() {
  const auth = useContext(AuthContext);
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
  const isLoggedIn = Boolean(auth?.isAuthenticated || isJwtValid(token));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-x-hidden">
      {/* Ambient top glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-64 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-radial from-violet-600/20 via-indigo-600/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] bg-indigo-500/8 blur-3xl rounded-full" />
        <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] bg-violet-500/8 blur-3xl rounded-full" />
      </div>

      <Navbar />

      <main className="flex-grow">
        {/* ═══════════════════════ HERO ═══════════════════════ */}
        <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ML Model v2.4 is live and fully operational
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] max-w-5xl mx-auto">
              Know Your Home's{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                True Value
              </span>
              <br />
              <span className="text-slate-300 font-light text-3xl sm:text-4xl lg:text-5xl mt-2 block">
                in under 3 seconds
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 sm:mt-8 text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
              HousePredict uses advanced machine learning to deliver instant,
              accurate property valuations — no agents, no waiting, no guesswork.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/predict"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 bg-size-200 hover:bg-pos-100 shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] active:scale-95 transition-all duration-300"
              >
                <SparkleIcon className="w-5 h-5 text-violet-200" />
                Predict My House Price
                <ArrowRightIcon />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700 hover:border-slate-600 transition-all duration-200 backdrop-blur-sm"
              >
                See How It Works
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckIcon />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckIcon />
                Instant results
              </span>
              <span className="flex items-center gap-1.5">
                <CheckIcon />
                20,000+ training samples
              </span>
            </div>

            {/* Preview Card */}
            <div className="mt-16 sm:mt-20 max-w-3xl mx-auto">
              <div className="rounded-3xl p-px bg-gradient-to-b from-violet-500/40 via-slate-700/20 to-slate-900/50 shadow-2xl shadow-violet-950/50">
                <div className="bg-slate-900/95 rounded-3xl p-6 sm:p-8 backdrop-blur-sm border border-slate-800/50">
                  {/* Faux terminal top bar */}
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-3 text-xs text-slate-500 font-mono">predict.housepredict.ai</span>
                  </div>
                  {/* Result showcase */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="text-left space-y-1">
                      <p className="text-xs uppercase tracking-widest font-semibold text-violet-400">Sample Output</p>
                      <h3 className="text-lg sm:text-xl font-bold text-white">4 bed · 3 bath · 2,850 sq ft</h3>
                      <p className="text-sm text-slate-400">Suburban Area, San Francisco Bay</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Estimated Value</p>
                      <p className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent leading-none">
                        $748,500
                      </p>
                      <p className="text-xs text-cyan-400 font-semibold mt-1">Confidence: 98.4%</p>
                    </div>
                  </div>
                  {/* Stats bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
                    {[
                      { label: "Range", value: "$725k – $768k" },
                      { label: "YoY Growth", value: "+6.2%" },
                      { label: "Latency", value: "<120ms" },
                      { label: "Confidence", value: "98.4%" },
                    ].map((m) => (
                      <div key={m.label} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-left">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{m.label}</p>
                        <p className="text-sm font-bold text-white mt-0.5">{m.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════ HOW IT WORKS ═══════════════════════ */}
        <section id="how-it-works" className="py-20 sm:py-28 bg-slate-900/40 border-y border-slate-800/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-xs uppercase tracking-widest font-semibold text-violet-400 mb-2">Simple 3-Step Process</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                From Details to Valuation in Seconds
              </h2>
              <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
                Our pipeline bridges raw property specs with production-grade ML regression — instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  className={`relative p-7 rounded-2xl bg-gradient-to-br ${s.color} border backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300`}
                >
                  {/* Connector line (desktop) */}
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-700 text-lg z-10">
                      →
                    </div>
                  )}
                  <span className={`text-3xl font-black ${s.text} mb-4 block`}>{s.step}</span>
                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════ FEATURES ═══════════════════════ */}
        <section className="py-20 sm:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-xs uppercase tracking-widest font-semibold text-violet-400 mb-2">Why HousePredict</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Built for Real Estate Professionals
              </h2>
              <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
                Everything buyers, sellers, and investors need to make data-driven decisions with confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all duration-200 group"
                >
                  <div className="text-2xl mb-4 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 group-hover:scale-110 transition-transform duration-200">
                    {f.icon}
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5">{f.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════ SOCIAL PROOF STRIP ═══════════════════════ */}
        <section className="py-12 bg-slate-900/40 border-y border-slate-800/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: "20K+", label: "Training Samples" },
                { value: "98.4%", label: "Avg. Confidence" },
                { value: "<120ms", label: "Inference Speed" },
                { value: "100%", label: "Free to Try" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════ FINAL CTA ═══════════════════════ */}
        <section className="py-20 sm:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-violet-900/40 via-slate-900 to-slate-950 border border-violet-500/25 shadow-2xl overflow-hidden">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-6">
                  <SparkleIcon className="w-3.5 h-3.5" />
                  Start for Free
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  Ready to Find Out What
                  <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                    {" "}Your Home Is Worth?
                  </span>
                </h2>
                <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
                  {isLoggedIn
                    ? "Run your next AI valuation today — completely free."
                    : "Run your first AI valuation today — completely free, no sign-up required."}
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/predict"
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                  >
                    <SparkleIcon className="w-5 h-5 text-violet-200" />
                    {isLoggedIn ? "Predict Now" : "Predict Now — It's Free"}
                    <ArrowRightIcon />
                  </Link>
                  {!isLoggedIn && (
                    <Link
                      to="/register"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all duration-200"
                    >
                      Create a Free Account
                    </Link>
                  )}
                </div>

                <p className="mt-5 text-xs text-slate-500">
                  No credit card required · Instant setup · Predictions in under 3 seconds
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

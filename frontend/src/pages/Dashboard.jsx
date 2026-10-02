import { useState, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthContext, { isJwtValid } from "../context/AuthContext";
import { API_BASE_URL } from "../services/api";

const SparkleIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036a2.63 2.63 0 001.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258a2.63 2.63 0 00-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.63 2.63 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.63 2.63 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-emerald-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-violet-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-indigo-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const CpuChipIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-cyan-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1">
    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
  </svg>
);

const formatUSD = (val) => {
  if (!val && val !== 0) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
};

export default function Dashboard() {
  const auth = useContext(AuthContext);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;

    if (!token || !isJwtValid(token)) {
      setPredictions([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    // Explicitly reset predictions so stale account data is never retained during fetch
    setPredictions([]);

    try {
      const res = await fetch(`${API_BASE_URL}/api/predictions/history`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        setPredictions([]);
        throw new Error("Session expired or unauthorized. Please log in.");
      }

      if (!res.ok) throw new Error(`Failed to load history (${res.status})`);
      const data = await res.json();
      setPredictions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to load prediction history");
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();

    const handleAuthChange = () => {
      fetchHistory();
    };

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [fetchHistory, auth?.token, auth?.user?._id, auth?.user?.id]);

  const totalPredictions = predictions.length;
  const avgPrice =
    totalPredictions > 0
      ? predictions.reduce((sum, p) => sum + (p.usdPrice || 0), 0) / totalPredictions
      : null;
  const latest = predictions[0] || null;
  const recentRows = predictions.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-violet-500 selection:text-white relative overflow-hidden">
      <div className="absolute top-12 left-1/3 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-violet-600/15 via-indigo-500/10 to-transparent blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-[500px] right-[-10%] w-[500px] h-[400px] bg-indigo-500/10 blur-[140px] pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Your{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
                Prediction Overview
              </span>
            </h1>
            <p className="mt-1 text-sm sm:text-base text-slate-400">
              Real-time summary of your property valuations.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/predict"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] active:scale-95 transition-all duration-200 group"
            >
              <SparkleIcon className="w-4 h-4 text-violet-200" />
              Quick Predict
              <ArrowRightIcon />
            </Link>
            <Link
              to="/history"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all duration-200"
            >
              View History
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-8">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Predictions</span>
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <ChartBarIcon />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              {loading ? (
                <span className="h-8 w-12 rounded bg-slate-800 animate-pulse block" />
              ) : (
                <span className="text-3xl font-extrabold text-white">{totalPredictions}</span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">Evaluations run on your account</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Predicted Price</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <TrendingUpIcon />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              {loading ? (
                <span className="h-8 w-28 rounded bg-slate-800 animate-pulse block" />
              ) : (
                <span className="text-3xl font-extrabold text-white">
                  {avgPrice != null ? formatUSD(avgPrice) : "—"}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">Mean across all your predictions</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Latest Prediction</span>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <CalendarIcon />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              {loading ? (
                <span className="h-8 w-24 rounded bg-slate-800 animate-pulse block" />
              ) : latest ? (
                <span className="text-2xl font-extrabold text-white">{formatUSD(latest.usdPrice)}</span>
              ) : (
                <span className="text-xl font-semibold text-slate-500">No predictions yet</span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {latest ? formatDate(latest.createdAt) : "Run your first prediction"}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Model Used</span>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <CpuChipIcon />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-lg font-extrabold text-white leading-tight">Random Forest</span>
              <span className="block text-xs text-cyan-400 font-medium mt-0.5">Regressor</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">California Housing Dataset</p>
          </div>
        </div>

        {/* Recent Predictions */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Recent Predictions</h2>
              <p className="text-xs sm:text-sm text-slate-400">Your most recent machine learning valuations</p>
            </div>
            <Link
              to="/history"
              className="text-xs sm:text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors inline-flex items-center gap-1 group"
            >
              See all <ArrowRightIcon />
            </Link>
          </div>

          {loading && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-12 text-center">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-slate-400">Loading your predictions...</p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-10 text-center text-rose-300">
              <p className="text-sm font-semibold mb-1">Failed to load prediction history</p>
              <p className="text-xs text-rose-400/80">{error}</p>
            </div>
          )}

          {!loading && !error && recentRows.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto mb-4">
                <SparkleIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">No Predictions Yet</h3>
              <p className="mt-1 text-sm text-slate-400 max-w-sm mx-auto">
                Run your first house price prediction to see your history here.
              </p>
              <div className="mt-6">
                <Link
                  to="/predict"
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-600/30 transition-all"
                >
                  Predict House Price
                </Link>
              </div>
            </div>
          )}

          {!loading && !error && recentRows.length > 0 && (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden backdrop-blur-sm shadow-xl">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950/60 border-b border-slate-800 text-xs uppercase font-semibold text-slate-400 tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Coordinates</th>
                      <th className="px-6 py-4">Key Features</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Predicted Value</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {recentRows.map((row) => {
                      const lat = row.Latitude != null ? Number(row.Latitude).toFixed(2) : "—";
                      const lng = row.Longitude != null ? Number(row.Longitude).toFixed(2) : "—";
                      const rooms = row.AveRooms != null ? Math.round(Number(row.AveRooms)) : "—";
                      const pop = row.Population != null ? Math.round(Number(row.Population)).toLocaleString() : "—";
                      return (
                        <tr key={row._id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-white font-mono text-xs">
                              {lat}&deg;, {lng}&deg;
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">California</div>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-400">
                            {rooms} rooms &bull; Pop: {pop} &bull; Inc: {row.MedInc != null ? Number(row.MedInc).toFixed(1) : "—"}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">{formatDate(row.createdAt)}</td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-emerald-400 text-base">{formatUSD(row.usdPrice)}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              to="/predict"
                              className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                            >
                              Re-evaluate &rarr;
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {recentRows.map((item) => {
                  const lat = item.Latitude != null ? Number(item.Latitude).toFixed(2) : "—";
                  const lng = item.Longitude != null ? Number(item.Longitude).toFixed(2) : "—";
                  const rooms = item.AveRooms != null ? Math.round(Number(item.AveRooms)) : "—";
                  const pop = item.Population != null ? Math.round(Number(item.Population)).toLocaleString() : "—";
                  return (
                    <div key={item._id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-xs font-semibold text-violet-400 block">
                            {lat}&deg;, {lng}&deg;
                          </span>
                          <p className="text-xs text-slate-400 mt-0.5">California</p>
                        </div>
                        <span className="text-xs text-slate-500">{formatDate(item.createdAt)}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {rooms} rooms &bull; Pop: {pop} &bull; Inc: {item.MedInc != null ? Number(item.MedInc).toFixed(1) : "—"}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <div>
                          <span className="text-[10px] uppercase text-slate-500 tracking-wider block">Predicted Value</span>
                          <span className="text-lg font-extrabold text-emerald-400">{formatUSD(item.usdPrice)}</span>
                        </div>
                        <Link
                          to="/predict"
                          className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          Re-evaluate &rarr;
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

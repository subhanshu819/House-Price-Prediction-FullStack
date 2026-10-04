import { useState, useEffect, useCallback, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthContext, { isJwtValid, getStoredUser } from "../context/AuthContext";
import { API_BASE_URL } from "../services/api";

/* ─── Icons ────────────────────────────────────────────────── */
const SparkleIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036a2.63 2.63 0 001.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258a2.63 2.63 0 00-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.63 2.63 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.63 2.63 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-indigo-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-violet-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const ActivityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-emerald-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

const CpuChipIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-cyan-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
  </svg>
);

const ShieldLockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-12 h-12 text-rose-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const RefreshIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

/* ─── Helpers ──────────────────────────────────────────────── */
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "recently";
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return `${Math.max(1, seconds)}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function AdminDashboard() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [unauthenticated, setUnauthenticated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAdminData = useCallback(async () => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
    const storedUser = getStoredUser();

    // Check if user is logged in
    if (!token || !isJwtValid(token)) {
      setUnauthenticated(true);
      setLoading(false);
      return;
    }

    // Client-side quick check
    const currentRole = auth?.user?.role || storedUser?.role;
    if (currentRole && currentRole !== "admin") {
      setAccessDenied(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        setUnauthenticated(true);
        setData(null);
        return;
      }

      if (res.status === 403) {
        setAccessDenied(true);
        setData(null);
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to fetch admin data (${res.status})`);
      }

      const resData = await res.json();
      setData(resData);
      setAccessDenied(false);
      setUnauthenticated(false);
    } catch (err) {
      console.error("[AdminDashboard] Error:", err);
      setError(err.message || "Failed to load admin panel data");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [auth?.user?.role]);

  useEffect(() => {
    fetchAdminData();

    const handleAuthChange = () => {
      fetchAdminData();
    };

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [fetchAdminData]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchAdminData();
  };

  /* ─── State 1: Unauthenticated ─── */
  if (unauthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-violet-500 selection:text-white relative overflow-hidden">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4 pt-28 pb-16">
          <div className="max-w-md w-full text-center p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-sm">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto mb-4">
              <ShieldLockIcon />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Sign-In Required</h1>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              The Administrative Operations panel requires authentication with an administrator account.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/login"
                className="w-full py-3 px-5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/30 transition-all"
              >
                Sign In to Continue
              </Link>
              <Link
                to="/"
                className="w-full py-2.5 px-5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-950 border border-slate-800 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ─── State 2: Access Denied (Role !== 'admin') ─── */
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-violet-500 selection:text-white relative overflow-hidden transition-colors duration-200">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4 pt-28 pb-16">
          <div className="max-w-md w-full text-center p-8 rounded-2xl bg-white dark:bg-slate-900/90 border border-rose-300 dark:border-rose-900/40 shadow-2xl shadow-rose-950/20 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <ShieldLockIcon />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Access Denied</h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 text-xs font-semibold uppercase tracking-wider my-3">
              <span>Admin Role Required</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Your account does not possess administrative privileges. Access to this control panel is strictly restricted to system administrators.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/dashboard"
                className="w-full py-3 px-5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/30 transition-all"
              >
                Go to User Dashboard
              </Link>
              <Link
                to="/"
                className="w-full py-2.5 px-5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const stats = data?.stats || {};
  const modelInfo = data?.modelInfo || {};
  const usersList = data?.users || [];
  const recentActivity = data?.recentActivity || [];
  const mlStatus = stats?.mlStatus || {};

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-violet-500 selection:text-white relative overflow-hidden transition-colors duration-200">
      {/* Background ambient glow */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-[850px] h-[380px] bg-gradient-to-tr from-violet-600/10 dark:from-violet-600/15 via-indigo-500/5 dark:via-indigo-500/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[550px] right-[-5%] w-[600px] h-[450px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[150px] pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <SparkleIcon className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span>Administrative Operations</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Live system monitoring, user analytics, model inference metrics, and operational control.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Real FastAPI ML Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-sm">
              <span
                className={`w-2 h-2 rounded-full ${
                  mlStatus.status === "healthy"
                    ? "bg-emerald-500 dark:bg-emerald-400 animate-pulse"
                    : mlStatus.status === "degraded"
                    ? "bg-amber-500 dark:bg-amber-400 animate-pulse"
                    : "bg-rose-500"
                }`}
              />
              <span className="font-medium text-slate-700 dark:text-slate-200">
                Inference Server:{" "}
                <span
                  className={
                    mlStatus.status === "healthy"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : mlStatus.status === "degraded"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-rose-600 dark:text-rose-400"
                  }
                >
                  {mlStatus.status === "healthy"
                    ? `Healthy (${mlStatus.latencyMs != null ? mlStatus.latencyMs + "ms" : "Active"})`
                    : mlStatus.status === "degraded"
                    ? "Degraded"
                    : "Offline"}
                </span>
              </span>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={loading || isRefreshing}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 disabled:opacity-60 shadow-sm"
              title="Refresh live metrics"
            >
              <RefreshIcon className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-violet-500" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Error notification if any */}
        {error && (
          <div className="my-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={handleManualRefresh}
              className="underline text-xs hover:text-slate-900 dark:hover:text-white font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* ================= 4 PRIMARY METRIC CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-8">
          {/* Card 1: Total Users */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all backdrop-blur-sm shadow-sm dark:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Users</span>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <UsersIcon />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              {loading ? (
                <div className="h-9 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              ) : (
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {stats.totalUsers != null ? stats.totalUsers : 0}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">Registered MongoDB accounts</p>
          </div>

          {/* Card 2: Total Predictions */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all backdrop-blur-sm shadow-sm dark:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Predictions</span>
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <ChartBarIcon />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              {loading ? (
                <div className="h-9 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              ) : (
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {stats.totalPredictions != null ? stats.totalPredictions : 0}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">All-time stored predictions</p>
          </div>

          {/* Card 3: Most Active User */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all backdrop-blur-sm shadow-sm dark:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Most Active User</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <ActivityIcon />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2 min-w-0">
              {loading ? (
                <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              ) : stats.mostActiveUser ? (
                <div className="min-w-0">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white block truncate">
                    {stats.mostActiveUser.name}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {stats.mostActiveUser.predictionsCount} predictions
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-slate-400 dark:text-slate-500">No activity yet</span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500 truncate">
              {stats.mostActiveUser ? stats.mostActiveUser.email : "Awaiting first user evaluation"}
            </p>
          </div>

          {/* Card 4: ML Service Health */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all backdrop-blur-sm shadow-sm dark:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">ML API Status</span>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <CpuChipIcon />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              {loading ? (
                <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              ) : (
                <>
                  <span
                    className={`text-2xl font-extrabold capitalize ${
                      mlStatus.status === "healthy"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : mlStatus.status === "degraded"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {mlStatus.status || "Unknown"}
                  </span>
                  {mlStatus.latencyMs != null && (
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {mlStatus.latencyMs}ms latency
                    </span>
                  )}
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">FastAPI backend probe</p>
          </div>
        </div>

        {/* ================= ML MODEL INFORMATION CARD ================= */}
        <div className="my-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 sm:p-8 backdrop-blur-sm shadow-sm dark:shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">
                <CpuChipIcon />
                <span>Production Machine Learning Core</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {modelInfo.name || "Random Forest Regressor"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {modelInfo.architecture || "RandomForestRegressor (scikit-learn)"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                Active Model
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider block">R² Determination</span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                {modelInfo.r2Score ? `~${modelInfo.r2Score}` : "approximately 0.806"}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">High variance capture</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider block">Dataset Records</span>
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">
                {modelInfo.datasetRecords ? Number(modelInfo.datasetRecords).toLocaleString() : "20,640"}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {modelInfo.dataset || "California Housing"}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider block">Feature Dimensions</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1 block">
                {modelInfo.featuresCount || 8} Inputs
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">MedInc, HouseAge, AveRooms, etc.</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider block">Model Engine</span>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                FastAPI + Joblib
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
                {mlStatus.modelLoaded ? "Model Loaded in Memory" : "Microservice Online"}
              </span>
            </div>
          </div>
        </div>

        {/* ================= 2-COLUMN: USER MANAGEMENT & RECENT ACTIVITY ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-8">
          
          {/* User Management Table (2 Columns) */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 overflow-hidden backdrop-blur-sm shadow-sm dark:shadow-xl">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">User Management</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">All registered accounts and actual prediction engagement</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                {usersList.length} Users
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Loading user accounts...</p>
              </div>
            ) : usersList.length === 0 ? (
              <div className="p-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                No registered users found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">User</th>
                      <th className="px-6 py-3.5">Role</th>
                      <th className="px-6 py-3.5">Predictions</th>
                      <th className="px-6 py-3.5 text-right">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900 dark:text-white">{u.name}</div>
                          <div className="text-xs text-slate-500">{u.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                              u.role === "admin"
                                ? "bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-700/60"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-900 dark:text-white font-mono">{u.predictionsCount}</span>
                        </td>
                        <td className="px-6 py-4 text-right text-xs text-slate-500">
                          {formatDate(u.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Activity Log (1 Column) */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 backdrop-blur-sm shadow-sm dark:shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Predictions</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40">
                  Live Feed
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Real-time valuation events from MongoDB</p>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">Loading activity...</p>
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                  No prediction activity recorded yet.
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {recentActivity.map((act) => (
                    <div key={act.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-violet-600 dark:text-violet-300 truncate max-w-[150px]">
                          {act.userName}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {formatTimeAgo(act.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                        {act.action}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 mt-6">
              <Link
                to="/predict"
                className="w-full block text-center py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors shadow-sm"
              >
                Test Inference Execution →
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthContext from "../context/AuthContext";
import { API_BASE_URL } from "../services/api";

/* ─── Icons ─────────────────────────────────────────────── */
const HouseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z" />
  </svg>
);

const SparkleIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036a2.63 2.63 0 001.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258a2.63 2.63 0 00-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.63 2.63 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.63 2.63 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);



const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);

/* ─── Spinner ─────────────────────────────────────────────── */
const Spinner = () => (
  <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

/* ─── Field wrapper ─────────────────────────────────────────── */
const FieldError = ({ msg }) =>
  msg ? (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-400 font-medium">
      <AlertIcon />
      {msg}
    </p>
  ) : null;

/* ─── Main component ─────────────────────────────────────────── */
export default function Login() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  /* Forgot-password inline flow */
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    if (error) setError("");
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Please enter a valid email address.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      // Clear any previous user state from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Store new JWT token and user info
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      if (auth?.login) {
        auth.login(data.token, data.user);
      } else {
        window.dispatchEvent(new Event("auth-change"));
      }

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Network error. Please make sure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSent(true);
    }, 1600);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-violet-500 selection:text-white relative overflow-x-hidden transition-colors duration-200">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[420px] bg-gradient-radial from-violet-600/10 dark:from-violet-600/20 via-indigo-600/5 dark:via-indigo-600/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/3 -right-32 w-[350px] h-[350px] bg-indigo-500/5 dark:bg-indigo-500/8 blur-3xl rounded-full" />
      </div>

      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="w-full max-w-md">

          {/* ── Brand header ── */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 group mb-5" aria-label="HousePredict home">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform duration-200">
                <HouseIcon />
              </span>
              <span className="text-slate-900 dark:text-white font-extrabold text-2xl tracking-tight">
                House<span className="text-violet-600 dark:text-violet-400">Predict</span>
              </span>
            </Link>

            {!forgotMode ? (
              <>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome back</h1>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">Sign in to your HousePredict account</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Reset password</h1>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">We'll send a reset link to your inbox</p>
              </>
            )}
          </div>

          {/* ── Card ── */}
          <div className="rounded-2xl p-px bg-gradient-to-b from-violet-500/30 via-slate-300/30 dark:via-slate-700/20 to-slate-200/40 dark:to-slate-900/40 shadow-2xl shadow-violet-950/20 dark:shadow-violet-950/40">
            <div className="bg-white/95 dark:bg-slate-900/95 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800/60 backdrop-blur-sm">

              {/* ════════════ LOGIN FLOW ════════════ */}
              {!forgotMode && (
                <>
                  {/* Global error banner */}
                  {error && (
                    <div className="flex items-start gap-2.5 px-4 py-3.5 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-300 text-sm font-medium animate-fade-in">
                      <AlertIcon />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all duration-200
                          ${fieldErrors.email
                            ? "border-rose-500/60 focus:ring-rose-500/30 focus:border-rose-500"
                            : "border-slate-300 dark:border-slate-800 focus:ring-violet-500/40 focus:border-violet-500"}`}
                      />
                      <FieldError msg={fieldErrors.email} />
                    </div>

                    {/* Password */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => { setForgotMode(true); setForgotSent(false); setForgotEmail(""); }}
                          className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          value={form.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className={`w-full pl-4 pr-11 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all duration-200
                            ${fieldErrors.password
                              ? "border-rose-500/60 focus:ring-rose-500/30 focus:border-rose-500"
                              : "border-slate-300 dark:border-slate-800 focus:ring-violet-500/40 focus:border-violet-500"}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 focus:outline-none transition-colors"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                      <FieldError msg={fieldErrors.password} />
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center gap-2.5">
                      <div className="relative flex items-center">
                        <input
                          id="remember-me"
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="peer w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-violet-600 focus:ring-violet-500 cursor-pointer appearance-none checked:bg-violet-600 checked:border-violet-600 transition-all"
                        />
                        {rememberMe && (
                          <svg className="absolute left-0.5 top-0.5 w-3 h-3 text-white pointer-events-none" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <label htmlFor="remember-me" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none hover:text-slate-900 dark:hover:text-slate-300 transition-colors">
                        Remember me for 30 days
                      </label>
                    </div>

                    {/* Submit */}
                    <button
                      id="login-submit-btn"
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
                    >
                      {isLoading ? (
                        <>
                          <Spinner />
                          Signing in…
                        </>
                      ) : (
                        <>
                          <SparkleIcon className="w-4 h-4" />
                          Sign In to HousePredict
                        </>
                      )}
                    </button>
                  </form>

                  {/* Sign-up prompt */}
                  <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/80 text-center text-sm text-slate-600 dark:text-slate-400">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors">
                      Create one free →
                    </Link>
                  </div>
                </>
              )}

              {/* ════════════ FORGOT PASSWORD FLOW ════════════ */}
              {forgotMode && (
                <>
                  {forgotSent ? (
                    /* Success state */
                    <div className="text-center py-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 mb-5">
                        <CheckCircleIcon />
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Check your inbox</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                        We've sent a password reset link to{" "}
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{forgotEmail}</span>.
                        It may take a minute to arrive.
                      </p>
                      <button
                        onClick={() => { setForgotMode(false); setForgotSent(false); }}
                        className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                      >
                        ← Back to sign in
                      </button>
                    </div>
                  ) : (
                    /* Email input state */
                    <form onSubmit={handleForgotSubmit} className="space-y-5">
                      <div>
                        <label htmlFor="forgot-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Your Email Address
                        </label>
                        <input
                          id="forgot-email"
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all duration-200"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {forgotLoading ? (
                          <>
                            <Spinner />
                            Sending reset link…
                          </>
                        ) : (
                          "Send Reset Link"
                        )}
                      </button>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setForgotMode(false)}
                          className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
                        >
                          ← Back to sign in
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}

            </div>
          </div>

          {/* Bottom trust note */}
          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-600">
            🔒 Your data is encrypted and never shared with third parties.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

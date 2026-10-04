import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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

const GoogleIcon = () => (
  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.8l3.7-2.9z" />
    <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.3 7.5 23.5 12 23.5z" />
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

const Spinner = () => (
  <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

/* ─── Mini helpers ────────────────────────────────────────── */
const FieldError = ({ msg }) =>
  msg ? (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-400 font-medium">
      <AlertIcon />
      {msg}
    </p>
  ) : null;

const CriteriaRow = ({ met, label }) => (
  <span className={`flex items-center gap-1.5 text-xs ${met ? "text-emerald-400" : "text-slate-500"}`}>
    <svg viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="none">
      {met ? (
        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2" />
      )}
    </svg>
    {label}
  </span>
);

/* ─── Password strength ───────────────────────────────────── */
const getStrength = (pass) => {
  if (!pass) return { score: 0, label: "", bar: "bg-slate-700", text: "text-slate-500" };
  const c = {
    length: pass.length >= 8,
    upper: /[A-Z]/.test(pass),
    number: /[0-9]/.test(pass),
    special: /[^A-Za-z0-9]/.test(pass),
  };
  const score = Object.values(c).filter(Boolean).length;
  const map = [
    null,
    { label: "Weak",   bar: "bg-rose-500",    text: "text-rose-400"   },
    { label: "Fair",   bar: "bg-amber-500",   text: "text-amber-400"  },
    { label: "Good",   bar: "bg-indigo-400",  text: "text-indigo-400" },
    { label: "Strong", bar: "bg-emerald-400", text: "text-emerald-400"},
  ];
  return { score, criteria: c, ...(map[score] || map[1]) };
};

/* ─── Main component ──────────────────────────────────────── */
export default function Register() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const strength = useMemo(() => getStrength(form.password), [form.password]);
  const passwordsMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword;
  const passwordsMismatch = form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((p) => ({ ...p, [name]: "" }));
    if (globalError) setGlobalError("");
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required.";
    else if (form.fullName.trim().length < 2) errs.fullName = "Name must be at least 2 characters.";

    if (!form.email) errs.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email address.";

    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 8) errs.password = "Password must be at least 8 characters.";

    if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match.";

    if (!agreeTerms) errs.terms = "You must accept the Terms of Service to continue.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    setIsLoading(true);
    setGlobalError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setGlobalError(data.message || "Registration failed. Please try again.");
        return;
      }

      setSuccessMessage(data.message || "User registered successfully");
      setSubmitted(true);
    } catch (err) {
      setGlobalError(err.message || "Network error. Please make sure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Success screen ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-x-hidden">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4 pt-28 pb-16">
          <div className="text-center max-w-md mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 mb-6">
              <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 text-emerald-400">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Account created!</h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              {successMessage ? (
                <>
                  <span className="block text-emerald-400 font-semibold mb-2">{successMessage}</span>
                  Welcome, <span className="font-semibold text-white">{form.fullName}</span>! Your HousePredict account is ready.
                  Check <span className="font-semibold text-white">{form.email}</span> for a verification email.
                </>
              ) : (
                <>
                  Welcome, <span className="font-semibold text-white">{form.fullName}</span>! Your HousePredict account is ready.
                  Check <span className="font-semibold text-white">{form.email}</span> for a verification email.
                </>
              )}
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 shadow-lg shadow-violet-600/30 hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              <SparkleIcon />
              Sign In Now
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ── Main form ── */
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-violet-500 selection:text-white relative overflow-x-hidden transition-colors duration-200">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[420px] bg-gradient-radial from-violet-600/10 dark:from-violet-600/20 via-indigo-600/5 dark:via-indigo-600/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/2 -left-32 w-[300px] h-[300px] bg-fuchsia-500/5 dark:bg-fuchsia-500/8 blur-3xl rounded-full" />
      </div>

      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="w-full max-w-md">

          {/* Brand header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 group mb-5" aria-label="HousePredict home">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform duration-200">
                <HouseIcon />
              </span>
              <span className="text-slate-900 dark:text-white font-extrabold text-2xl tracking-tight">
                House<span className="text-violet-600 dark:text-violet-400">Predict</span>
              </span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create your account</h1>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">Free forever. No credit card required.</p>
          </div>

          {/* Card */}
          <div className="rounded-2xl p-px bg-gradient-to-b from-violet-500/30 via-slate-300/30 dark:via-slate-700/20 to-slate-200/40 dark:to-slate-900/40 shadow-2xl shadow-violet-950/20 dark:shadow-violet-950/40">
            <div className="bg-white/95 dark:bg-slate-900/95 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800/60 backdrop-blur-sm shadow-sm">

              {/* Global error */}
              {globalError && (
                <div className="flex items-start gap-2.5 px-4 py-3.5 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-300 text-sm font-medium">
                  <AlertIcon />
                  <span>{globalError}</span>
                </div>
              )}

              {/* Google OAuth placeholder */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-200 transition-all duration-200 shadow-sm active:scale-[0.99]"
              >
                <GoogleIcon />
                Sign up with Google
              </button>

              {/* Divider */}
              <div className="relative my-6 flex items-center gap-3">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                <span className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold whitespace-nowrap">
                  or register with email
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all duration-200
                      ${fieldErrors.fullName ? "border-rose-500/60 focus:ring-rose-500/30 focus:border-rose-500" : "border-slate-300 dark:border-slate-800 focus:ring-violet-500/40 focus:border-violet-500"}`}
                  />
                  <FieldError msg={fieldErrors.fullName} />
                </div>

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
                      ${fieldErrors.email ? "border-rose-500/60 focus:ring-rose-500/30 focus:border-rose-500" : "border-slate-300 dark:border-slate-800 focus:ring-violet-500/40 focus:border-violet-500"}`}
                  />
                  <FieldError msg={fieldErrors.email} />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    {form.password && (
                      <span className={`text-xs font-semibold ${strength.text}`}>{strength.label}</span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={show.password ? "text" : "password"}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-4 pr-11 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all duration-200
                        ${fieldErrors.password ? "border-rose-500/60 focus:ring-rose-500/30 focus:border-rose-500" : "border-slate-300 dark:border-slate-800 focus:ring-violet-500/40 focus:border-violet-500"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShow((p) => ({ ...p, password: !p.password }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 focus:outline-none transition-colors"
                      aria-label={show.password ? "Hide password" : "Show password"}
                    >
                      {show.password ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {form.password && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4].map((s) => (
                          <div
                            key={s}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${strength.score >= s ? strength.bar : "bg-slate-200 dark:bg-slate-800"}`}
                          />
                        ))}
                      </div>
                      {/* Criteria pills */}
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                        <CriteriaRow met={strength.criteria?.length}  label="At least 8 characters" />
                        <CriteriaRow met={strength.criteria?.upper}   label="Uppercase letter" />
                        <CriteriaRow met={strength.criteria?.number}  label="Number (0–9)" />
                        <CriteriaRow met={strength.criteria?.special} label="Special character" />
                      </div>
                    </div>
                  )}
                  <FieldError msg={fieldErrors.password} />
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Confirm Password
                    </label>
                    {passwordsMatch && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Passwords match
                      </span>
                    )}
                    {passwordsMismatch && (
                      <span className="text-xs font-semibold text-rose-500 dark:text-rose-400">Does not match</span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={show.confirm ? "text" : "password"}
                      autoComplete="new-password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-4 pr-11 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all duration-200
                        ${fieldErrors.confirmPassword || passwordsMismatch
                          ? "border-rose-500/60 focus:ring-rose-500/30 focus:border-rose-500"
                          : passwordsMatch
                            ? "border-emerald-500/40 focus:ring-emerald-500/30 focus:border-emerald-500"
                            : "border-slate-300 dark:border-slate-800 focus:ring-violet-500/40 focus:border-violet-500"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShow((p) => ({ ...p, confirm: !p.confirm }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 focus:outline-none transition-colors"
                      aria-label={show.confirm ? "Hide password" : "Show password"}
                    >
                      {show.confirm ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  <FieldError msg={fieldErrors.confirmPassword} />
                </div>

                {/* Terms */}
                <div className={`flex items-start gap-3 pt-1 p-3.5 rounded-xl border transition-colors duration-200
                  ${fieldErrors.terms ? "bg-rose-50 dark:bg-rose-500/5 border-rose-300 dark:border-rose-500/25" : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60"}`}>
                  <div className="relative flex items-center mt-0.5 shrink-0">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => {
                        setAgreeTerms(e.target.checked);
                        if (fieldErrors.terms) setFieldErrors((p) => ({ ...p, terms: "" }));
                      }}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-violet-600 focus:ring-violet-500 cursor-pointer appearance-none checked:bg-violet-600 checked:border-violet-600 transition-all"
                    />
                    {agreeTerms && (
                      <svg className="absolute left-0.5 top-0.5 w-3 h-3 text-white pointer-events-none" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer select-none hover:text-slate-900 dark:hover:text-slate-300 transition-colors">
                    I agree to HousePredict's{" "}
                    <a href="#terms" className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium underline underline-offset-2 decoration-violet-500/40">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#privacy" className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium underline underline-offset-2 decoration-violet-500/40">
                      Privacy Policy
                    </a>. I understand that my prediction data will be processed to improve the model.
                  </label>
                </div>
                {fieldErrors.terms && (
                  <p className="flex items-center gap-1 text-xs text-rose-500 dark:text-rose-400 font-medium -mt-2">
                    <AlertIcon />{fieldErrors.terms}
                  </p>
                )}

                {/* Submit */}
                <button
                  id="register-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 mt-2"
                >
                  {isLoading ? (
                    <>
                      <Spinner />
                      Creating your account…
                    </>
                  ) : (
                    <>
                      <SparkleIcon className="w-4 h-4" />
                      Create Free Account
                    </>
                  )}
                </button>
              </form>

              {/* Sign-in link */}
              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/80 text-center text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors">
                  Sign in →
                </Link>
              </div>

            </div>
          </div>

          {/* Trust note */}
          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-600">
            🔒 Your data is encrypted in transit and at rest.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

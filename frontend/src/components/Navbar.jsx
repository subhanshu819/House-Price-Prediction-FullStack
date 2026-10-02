import { useState, useEffect, useContext } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import AuthContext, { isJwtValid, getStoredUser } from "../context/AuthContext";

/* ─── Icons ────────────────────────────────────────────────── */
const HouseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 sm:w-6 sm:h-6"
  >
    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z" />
  </svg>
);

const SparkleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-3.5 h-3.5"
  >
    <path
      fillRule="evenodd"
      d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036a2.63 2.63 0 001.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258a2.63 2.63 0 00-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.63 2.63 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.63 2.63 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z"
      clipRule="evenodd"
    />
  </svg>
);

const LogoutIcon = ({ className = "w-4 h-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/* Base navigation links */
const BASE_NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Predict", to: "/predict" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "History", to: "/history" },
];

export default function Navbar() {
  const auth = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track authentication state with live sync
  const [authState, setAuthState] = useState(() => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
    const valid = isJwtValid(token);
    return {
      isAuthenticated: valid,
      user: valid ? getStoredUser() : null,
    };
  });

  // Keep state synchronized with storage, auth events, and route changes
  useEffect(() => {
    const sync = () => {
      const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
      const valid = isJwtValid(token);
      setAuthState({
        isAuthenticated: valid,
        user: valid ? getStoredUser() : null,
      });
    };

    sync();

    window.addEventListener("storage", sync);
    window.addEventListener("auth-change", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth-change", sync);
    };
  }, [location.pathname, location.key]);

  // Also sync from AuthContext if updated
  useEffect(() => {
    if (auth && typeof auth.isAuthenticated === "boolean") {
      setAuthState({
        isAuthenticated: auth.isAuthenticated,
        user: auth.user,
      });
    }
  }, [auth?.isAuthenticated, auth?.user]);

  /* Detect scroll to switch navbar to frosted-glass */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isAuthenticated = Boolean(authState.isAuthenticated || auth?.isAuthenticated);
  const currentUser = authState.user || auth?.user;

  const displayName =
    currentUser?.name ||
    currentUser?.fullName ||
    (currentUser?.email ? currentUser.email.split("@")[0] : "User");

  const displayEmail = currentUser?.email || "";
  const userInitial = (displayName || "U").charAt(0).toUpperCase();

  const handleLogout = () => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    if (auth?.logout) {
      auth.logout();
    }
    window.dispatchEvent(new Event("auth-change"));
    setAuthState({ isAuthenticated: false, user: null });
    setMenuOpen(false);
    navigate("/login");
  };

  // When logged in, remove "Login" from links; when logged out, include "Login"; if admin, show "Admin"
  const isAdmin = currentUser?.role === "admin";
  const currentNavLinks = isAuthenticated
    ? (isAdmin ? [...BASE_NAV_LINKS, { label: "Admin", to: "/admin" }] : BASE_NAV_LINKS)
    : [...BASE_NAV_LINKS, { label: "Login", to: "/login" }];

  return (
    <>
      {/* ── Fixed Header ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-slate-950/50"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group shrink-0"
              aria-label="HousePredict home"
              onClick={() => setMenuOpen(false)}
            >
              <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-500/25 group-hover:scale-105 group-hover:shadow-violet-500/40 transition-all duration-200">
                <HouseIcon />
              </span>
              <span className="text-white font-extrabold text-lg sm:text-xl tracking-tight leading-none">
                House<span className="text-violet-400">Predict</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1 lg:gap-1.5">
              {currentNavLinks.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-white bg-slate-900/90 shadow-sm border border-slate-800"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      {isActive && (
                        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-violet-400 shadow-sm shadow-violet-400" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Desktop CTA / Auth State */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                {/* Clear Authenticated User Indicator */}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all duration-200 group"
                  title={`Signed in as ${displayName}`}
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold text-xs uppercase shadow-sm shadow-violet-500/30">
                    {userInitial}
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white leading-tight max-w-[130px] truncate">
                      {displayName}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium leading-none flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Logged In
                    </span>
                  </div>
                </Link>

                {/* Logout Button */}
                <button
                  id="navbar-logout-btn"
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-rose-200 bg-slate-900/60 hover:bg-rose-500/15 border border-slate-800 hover:border-rose-500/30 transition-all duration-200 shadow-sm active:scale-95 group"
                  title="Sign out of your account"
                >
                  <LogoutIcon className="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  id="navbar-get-started-btn"
                  to="/register"
                  className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] active:scale-95 transition-all duration-200 overflow-hidden group"
                >
                  <SparkleIcon />
                  <span>Get Started</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-slate-300 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all duration-200"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile Overlay ── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md md:hidden transition-opacity duration-300"
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ── */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 sm:w-80 bg-slate-950 border-l border-slate-800 shadow-2xl md:hidden transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!menuOpen}
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-slate-800/80">
            <Link
              to="/"
              className="flex items-center gap-2 text-white font-bold"
              onClick={() => setMenuOpen(false)}
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                <HouseIcon />
              </span>
              <span className="font-extrabold tracking-tight">
                House<span className="text-violet-400">Predict</span>
              </span>
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-all duration-200"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Drawer Links */}
          <div className="flex flex-col gap-1.5 px-4 pt-5">
            {currentNavLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-violet-600/15 text-violet-300 border border-violet-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Drawer Bottom CTA / User Profile & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
          {isAuthenticated ? (
            <div className="space-y-3">
              {/* Authenticated User Indicator Card */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold text-sm uppercase shadow-md shadow-violet-500/30 shrink-0">
                  {userInitial}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-white truncate">
                    {displayName}
                  </span>
                  {displayEmail ? (
                    <span className="text-xs text-slate-400 truncate">
                      {displayEmail}
                    </span>
                  ) : null}
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Logged In
                  </span>
                </div>
              </div>

              {/* Mobile Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl text-sm font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 hover:border-rose-500/40 shadow-md active:scale-95 transition-all duration-200"
              >
                <LogoutIcon className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/30 active:scale-95 transition-all duration-200"
              >
                <SparkleIcon />
                <span>Get Started Free</span>
              </Link>
              <p className="text-center text-slate-500 text-xs mt-3">
                Accurate property valuations
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

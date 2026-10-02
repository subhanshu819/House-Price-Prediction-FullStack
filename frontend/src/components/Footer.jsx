import { Link } from "react-router-dom";

const HouseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
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

export default function Footer() {
  return (
    <footer className="bg-slate-950/95 border-t border-slate-800/80 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & Description */}
          <div className="sm:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-500/25 group-hover:scale-105 group-hover:shadow-violet-500/40 transition-all duration-200">
                <HouseIcon />
              </span>
              <span className="text-white font-extrabold text-lg tracking-tight">
                House<span className="text-violet-400">Predict</span>
              </span>
            </Link>
            
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering home buyers, sellers, and real estate professionals with high-precision valuations and real-time market insights.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white tracking-widest uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-violet-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/predict" className="inline-flex items-center gap-1.5 text-violet-400 font-medium hover:text-violet-300 transition-colors duration-200">
                  <SparkleIcon />
                  Predict Price
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-violet-400 transition-colors duration-200">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-violet-400 transition-colors duration-200">
                  Prediction History
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Portal */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white tracking-widest uppercase">
              Account
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/login" className="hover:text-violet-400 transition-colors duration-200">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-violet-400 transition-colors duration-200">
                  Register / Get Started
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-violet-400 transition-colors duration-200">
                  User Profile
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-slate-500 hover:text-slate-400 transition-colors duration-200">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom border & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 HousePredict. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400 font-medium">Smart Real Estate Intelligence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

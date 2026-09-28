import { useState } from "react";

const BookmarkIcon = ({ filled = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={filled ? 0 : 1.8}
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
    />
  </svg>
);

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const SparkleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-3 h-3 text-violet-400"
  >
    <path
      fillRule="evenodd"
      d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5z"
      clipRule="evenodd"
    />
  </svg>
);

export default function PropertyCard({
  title = "742 Evergreen Terrace",
  location = "Springfield, OR",
  predictedPrice = "$645,000",
  date = "Sep 24, 2026",
  isSaved = false,
  onView,
  onSave,
}) {
  const [saved, setSaved] = useState(isSaved);

  const handleSaveToggle = () => {
    const nextSaved = !saved;
    setSaved(nextSaved);
    if (onSave) {
      onSave(nextSaved);
    }
  };

  return (
    <div className="relative rounded-2xl p-0.5 bg-gradient-to-b from-slate-800 via-slate-850 to-slate-900 hover:from-violet-500/40 hover:via-slate-800 hover:to-slate-900 transition-all duration-300 shadow-lg group">
      <div className="bg-slate-900/95 rounded-[15px] p-5 sm:p-6 border border-slate-800/80 flex flex-col justify-between h-full backdrop-blur-sm">
        
        {/* Top: Header & Save Icon Button */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] font-semibold uppercase tracking-wider">
              <SparkleIcon />
              AI Valued
            </span>
            <span className="text-xs text-slate-500 font-medium">{date}</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-violet-200 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5 line-clamp-1">
            {location}
          </p>
        </div>

        {/* Middle: Predicted Price Callout */}
        <div className="my-5 pt-4 border-t border-slate-800/80">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">
            Estimated Value
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent mt-0.5">
            {predictedPrice}
          </div>
        </div>

        {/* Bottom: Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          {/* View Button */}
          <button
            type="button"
            onClick={onView}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 hover:border-slate-600 transition-all duration-200 active:scale-95 shadow-sm"
          >
            <EyeIcon />
            <span>View Details</span>
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSaveToggle}
            aria-label={saved ? "Remove from saved" : "Save property"}
            className={`inline-flex items-center justify-center p-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border active:scale-95 shadow-sm ${
              saved
                ? "bg-violet-600 text-white border-violet-500 shadow-violet-600/30"
                : "bg-slate-800 text-slate-400 hover:text-white border-slate-700 hover:border-slate-600"
            }`}
          >
            <BookmarkIcon filled={saved} />
          </button>
        </div>

      </div>
    </div>
  );
}


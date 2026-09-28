import { useState } from "react";

const SparkleIcon = ({ className = "w-4 h-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036a2.63 2.63 0 001.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258a2.63 2.63 0 00-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.63 2.63 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.63 2.63 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z"
      clipRule="evenodd"
    />
  </svg>
);

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

const DownloadIcon = () => (
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
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-4 h-4 text-emerald-400"
  >
    <path
      fillRule="evenodd"
      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
      clipRule="evenodd"
    />
  </svg>
);

export default function PredictionResult({
  price = "$748,500",
  modelName = "California Housing Ensemble (XGBoost + Ridge v2.4)",
  confidence = "98.4%",
  range = "$725,000 - $768,000",
  specs = {
    medianIncome: "$83,250",
    houseAge: "28 years",
    avgRooms: "6.98",
    avgBedrooms: "1.02",
    population: "1,425",
    avgOccupancy: "2.55",
    coordinates: "37.88° N, 122.23° W",
  },
  featureImportance = [
    { name: "Median Income", weight: 52, impact: "High Positive" },
    { name: "Latitude / Longitude (Location)", weight: 26, impact: "Strong Driver" },
    { name: "Average Rooms", weight: 12, impact: "Moderate" },
    { name: "House Age", weight: 6, impact: "Depreciation Offset" },
    { name: "Average Occupancy", weight: 4, impact: "Minor Adjustment" },
  ],
}) {
  const [saved, setSaved] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleSave = () => {
    setSaved((prev) => !prev);
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
    }, 1200);
  };

  return (
    <div className="relative rounded-3xl p-1 bg-gradient-to-b from-violet-500/30 via-slate-800/40 to-slate-900/60 shadow-2xl backdrop-blur-xl">
      <div className="bg-slate-900/95 rounded-2xl p-6 sm:p-8 border border-slate-800/80">
        
        {/* Header: Model & Status Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">
              <SparkleIcon className="w-3.5 h-3.5" />
              <span>Valuation Inference Complete</span>
            </div>
            <h3 className="text-sm font-medium text-slate-300">
              Active Model: <span className="text-white font-semibold">{modelName}</span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              High Confidence ({confidence})
            </span>
          </div>
        </div>

        {/* Valuation Hero Callout */}
        <div className="my-8 p-6 rounded-2xl bg-gradient-to-br from-violet-950/40 via-slate-950/80 to-slate-900 border border-violet-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block">
              Estimated Market Value
            </span>
            <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent mt-1">
              {price}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Statistically projected within 95% interval: <strong className="text-slate-200">{range}</strong>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={handleSave}
              className={`flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md ${
                saved
                  ? "bg-violet-600 text-white shadow-violet-600/30"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600"
              }`}
            >
              <BookmarkIcon filled={saved} />
              <span>{saved ? "Saved to Portfolio" : "Save Prediction"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all duration-200 active:scale-95 disabled:opacity-50"
            >
              <DownloadIcon />
              <span>{downloading ? "Generating PDF..." : "Download Report"}</span>
            </button>
          </div>
        </div>

        {/* Two-Column Grid: Property Summary & Feature Importance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
          
          {/* 1. Property Summary */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center justify-between">
              <span>Property Input Summary</span>
              <span className="text-[11px] text-slate-500 font-normal">Standardized Vectors</span>
            </h4>
            <dl className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
              <div>
                <dt className="text-slate-500">Median Income</dt>
                <dd className="font-semibold text-white mt-0.5">{specs.medianIncome}</dd>
              </div>
              <div>
                <dt className="text-slate-500">House Age</dt>
                <dd className="font-semibold text-white mt-0.5">{specs.houseAge}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Average Rooms</dt>
                <dd className="font-semibold text-white mt-0.5">{specs.avgRooms}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Average Bedrooms</dt>
                <dd className="font-semibold text-white mt-0.5">{specs.avgBedrooms}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Block Population</dt>
                <dd className="font-semibold text-white mt-0.5">{specs.population}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Avg Occupancy</dt>
                <dd className="font-semibold text-white mt-0.5">{specs.avgOccupancy}</dd>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-800/80">
                <dt className="text-slate-500">Coordinates</dt>
                <dd className="font-semibold text-white mt-0.5">{specs.coordinates}</dd>
              </div>
            </dl>
          </div>

          {/* 2. Feature Importance Section Placeholder */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center justify-between">
              <span>Feature Importance</span>
              <span className="text-[11px] text-violet-400 font-medium">SHAP Weights</span>
            </h4>
            <div className="space-y-3">
              {featureImportance.map((feat) => (
                <div key={feat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{feat.name}</span>
                    <span className="text-slate-500 text-[11px]">{feat.impact} ({feat.weight}%)</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${feat.weight}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer info note */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-500">
          <CheckIcon />
          <span>Calculated via cross-validated multi-variate regression comps. Valuations update in accordance with market fluctuations.</span>
        </div>

      </div>
    </div>
  );
}


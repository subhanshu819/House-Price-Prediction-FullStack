import { useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../services/api";

/* ─────────────────────────── Icons ─────────────────────────── */

const SparkleIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036a2.63 2.63 0 001.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258a2.63 2.63 0 00-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.63 2.63 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.63 2.63 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z"
      clipRule="evenodd"
    />
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-emerald-400 shrink-0">
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-rose-400 shrink-0">
    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
  </svg>
);

const BeakerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15a2.25 2.25 0 01.45 1.328V19.5a2.25 2.25 0 01-2.25 2.25H5.85A2.25 2.25 0 013.6 19.5v-3.072c0-.487.18-.957.45-1.328L9.75 9.81" />
  </svg>
);

/* ─────────────────────────── Field Definitions ─────────────────────────── */

const FIELD_CONFIG = [
  {
    key: "medianIncome",
    id: "medianIncome",
    label: "Median Income ($10,000s)",
    helper: "Example: 5.2 = $52,000",
    placeholder: "e.g. 5.2",
    min: 0.4999,
    max: 15.0001,
    step: 0.01,
    inputMode: "decimal",
    unit: null,
    rangeLabel: "0.50 – 15.00 (in $10,000 units)",
  },
  {
    key: "houseAge",
    id: "houseAge",
    label: "House Age",
    placeholder: "e.g. 25",
    min: 1,
    max: 52,
    step: 1,
    inputMode: "numeric",
    unit: "yrs",
    rangeLabel: "1 – 52 years",
  },
  {
    key: "avgRooms",
    id: "avgRooms",
    label: "Average Rooms",
    placeholder: "e.g. 5.5",
    min: 0.85,
    max: 10.36,
    step: 0.01,
    inputMode: "decimal",
    unit: null,
    rangeLabel: "0.85 – 10.36 · Typical range (covers 99% of training data)",
  },
  {
    key: "avgBedrooms",
    id: "avgBedrooms",
    label: "Average Bedrooms",
    placeholder: "e.g. 1.2",
    min: 0.33,
    max: 2.13,
    step: 0.01,
    inputMode: "decimal",
    unit: null,
    rangeLabel: "0.33 – 2.13 · Typical range (covers 99% of training data)",
  },
  {
    key: "population",
    id: "population",
    label: "Block Population",
    placeholder: "e.g. 1500",
    min: 3,
    max: 35682,
    step: 1,
    inputMode: "numeric",
    unit: "people",
    rangeLabel: "3 – 35,682 people per block",
  },
  {
    key: "avgOccupancy",
    id: "avgOccupancy",
    label: "Average Occupancy",
    placeholder: "e.g. 3.0",
    min: 0.69,
    max: 5.39,
    step: 0.01,
    inputMode: "decimal",
    unit: "ppl/hh",
    rangeLabel: "0.69 – 5.39 · Typical range (covers 99% of training data)",
  },
  {
    key: "latitude",
    id: "latitude",
    label: "Latitude",
    placeholder: "e.g. 34.05",
    min: 32.54,
    max: 41.95,
    step: 0.01,
    inputMode: "decimal",
    unit: "°N",
    rangeLabel: "32.54 – 41.95 °N (California)",
  },
  {
    key: "longitude",
    id: "longitude",
    label: "Longitude",
    placeholder: "e.g. -118.25",
    min: -124.35,
    max: -114.31,
    step: 0.01,
    inputMode: "decimal",
    unit: "°W",
    rangeLabel: "-124.35 – -114.31 °W (California)",
  },
];

const INITIAL_FORM_STATE = Object.fromEntries(FIELD_CONFIG.map((f) => [f.key, ""]));

/* ─────────────────────────── Sample Data ─────────────────────────── */

const SAMPLE_DATA = {
  medianIncome: "8.3252",
  houseAge: "28",
  avgRooms: "6.98",
  avgBedrooms: "1.02",
  population: "1425",
  avgOccupancy: "2.55",
  latitude: "37.88",
  longitude: "-122.23",
};

/* ─────────────────────────── Validation ─────────────────────────── */

function validateField(key, raw) {
  const cfg = FIELD_CONFIG.find((f) => f.key === key);
  if (!cfg) return "";
  if (raw === "" || raw === null || raw === undefined) return `${cfg.label} is required`;
  const val = Number(raw);
  if (isNaN(val)) return `${cfg.label} must be a number`;
  if (val < cfg.min || val > cfg.max)
    return `Must be between ${cfg.min} and ${cfg.max} (${cfg.rangeLabel})`;
  return "";
}

function validateAll(formData) {
  const errors = {};
  for (const { key } of FIELD_CONFIG) {
    const msg = validateField(key, formData[key]);
    if (msg) errors[key] = msg;
  }
  return errors;
}

/* ─────────────────────────── Component ─────────────────────────── */

export default function Predict() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (touched[name]) {
        const msg = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: msg }));
      }
      if (apiError) setApiError("");
    },
    [touched, apiError]
  );

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const msg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: msg }));
  }, []);

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setTouched({});
    setApiError("");
    setPredictionResult(null);
  };

  const handleFillDemo = () => {
    setFormData(SAMPLE_DATA);
    setErrors({});
    setTouched({});
    setApiError("");
    setPredictionResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(FIELD_CONFIG.map((f) => [f.key, true]));
    setTouched(allTouched);
    const validationErrors = validateAll(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstKey = FIELD_CONFIG.find((f) => validationErrors[f.key])?.id;
      if (firstKey) {
        document.getElementById(firstKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setLoading(true);
    setApiError("");
    setPredictionResult(null);

    const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;

    const payload = {
      MedInc: Number(formData.medianIncome),
      HouseAge: Number(formData.houseAge),
      AveRooms: Number(formData.avgRooms),
      AveBedrms: Number(formData.avgBedrooms),
      Population: Number(formData.population),
      AveOccup: Number(formData.avgOccupancy),
      Latitude: Number(formData.latitude),
      Longitude: Number(formData.longitude),
    };

    const startTime = performance.now();

    try {
      const response = await fetch(`${API_BASE_URL}/api/predictions/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      const endTime = performance.now();
      const latency = `${Math.round(endTime - startTime)}ms`;

      if (!response.ok) {
        setApiError(data.message || data.error || "Failed to generate prediction. Please try again.");
        return;
      }

      const usdPrice =
        typeof data.usd_price === "number" ? data.usd_price : parseFloat(data.usd_price) || 0;

      const USD_TO_INR = 93;
      const inrPrice = usdPrice * USD_TO_INR;

      const formattedUSD = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(Math.round(usdPrice));

      const formattedINR = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(Math.round(inrPrice));

      setPredictionResult({
        estimatedPrice: formattedINR,
        inrPrice: formattedINR,
        usdPrice: formattedUSD,
        latency,
      });
    } catch (err) {
      setApiError(err.message || "Network error. Please make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-violet-500 selection:text-white relative overflow-hidden transition-colors duration-200">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[380px] bg-gradient-to-tr from-violet-600/10 dark:from-violet-600/15 via-indigo-500/5 dark:via-indigo-500/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">

        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            House Price Predictor
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Enter California residential census block attributes to get an instant ML-powered valuation.
          </p>
        </div>

        <div className="relative rounded-3xl p-px bg-gradient-to-b from-violet-500/25 via-slate-300/40 dark:via-slate-800/40 to-slate-200/60 dark:to-slate-900/60 shadow-2xl backdrop-blur-xl">
          <div className="bg-white/95 dark:bg-slate-900/95 rounded-[calc(1.5rem-1px)] p-5 sm:p-8 border border-slate-200 dark:border-slate-800/80 shadow-sm">

            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                Feature Parameters
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 hover:text-teal-800 dark:hover:text-teal-200 hover:border-teal-400/50 transition-all duration-200 active:scale-95"
              >
                <BeakerIcon />
                Use Sample Data
              </button>
            </div>

            {apiError && (
              <div className="mb-5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-300 text-sm font-medium flex items-start gap-2.5">
                <AlertIcon />
                <span>{apiError}</span>
              </div>
            )}

            {errorCount > 1 && (
              <div className="mb-5 p-3 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/25 text-amber-700 dark:text-amber-300 text-xs font-medium flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                {errorCount} fields need your attention. Please review the highlighted inputs below.
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-0">
              {/*
                Each field card is a flex-col. The "label header" area is given a
                fixed min-height (min-h-[36px]) so that fields with helper text
                (e.g. Median Income) and fields without helper text occupy exactly
                the same vertical space above the input. This keeps both grid
                columns pixel-aligned on every row — desktop and mobile.
              */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                {FIELD_CONFIG.map((field) => {
                  const hasError = Boolean(errors[field.key]);
                  return (
                    <div key={field.key} className="flex flex-col">

                      {/* ── Fixed-height label area: always 36px tall ── */}
                      <div className="min-h-[36px] flex flex-col justify-end mb-1.5">
                        <div className="flex items-baseline justify-between">
                          <label
                            htmlFor={field.id}
                            className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                          >
                            {field.label}
                          </label>
                          {field.unit && (
                            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 ml-1 shrink-0">
                              {field.unit}
                            </span>
                          )}
                        </div>
                        {field.helper && (
                          <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-500 leading-snug">
                            {field.helper}
                          </p>
                        )}
                      </div>

                      {/* ── Input ── */}
                      <div className="relative">
                        <input
                          id={field.id}
                          name={field.key}
                          type="number"
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          inputMode={field.inputMode}
                          placeholder={field.placeholder}
                          value={formData[field.key]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                          className={[
                            "w-full px-4 py-3 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500",
                            "bg-slate-50 dark:bg-slate-950/70 border transition-all duration-200",
                            "focus:outline-none focus:ring-2",
                            hasError
                              ? "border-rose-500/70 focus:ring-rose-500/40 bg-rose-50/50 dark:bg-rose-950/20"
                              : "border-slate-300 dark:border-slate-800 focus:ring-violet-500/50 focus:border-violet-500",
                          ].join(" ")}
                        />
                        {hasError && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-rose-500 dark:text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* ── Below-input: error OR range hint ── */}
                      {hasError ? (
                        <p role="alert" className="mt-1.5 text-xs text-rose-500 dark:text-rose-400 leading-snug">
                          {errors[field.key]}
                        </p>
                      ) : (
                        <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-600 leading-snug">
                          Range: {field.rangeLabel}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing Feature Weights...
                    </>
                  ) : (
                    <>
                      <SparkleIcon className="w-4 h-4 text-violet-200" />
                      Predict House Price
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-950/70 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-95"
                >
                  <RefreshIcon />
                  Reset
                </button>
              </div>
            </form>

            {predictionResult && (
              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800/80">
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-violet-50 to-white dark:from-violet-950/40 dark:to-slate-900 border border-violet-300 dark:border-violet-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-300 mb-1">
                      <CheckCircleIcon />
                      <span>Model Inference Completed ({predictionResult.latency})</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Estimated Property Valuation</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      US Dollar Valuation: {predictionResult.usdPrice} USD (1 USD = Rs.93)
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Predicted Value
                    </span>
                    <span className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                      {predictionResult.inrPrice}
                    </span>
                    <span className="block text-xs font-semibold text-cyan-600 dark:text-cyan-400 mt-1">
                      USD Value: {predictionResult.usdPrice}
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        <p className="mt-5 text-center text-[11px] text-slate-500 dark:text-slate-600">
          Ranges are based on the California Housing Dataset. Values outside dataset bounds will be rejected.
        </p>
      </main>

      <Footer />
    </div>
  );
}

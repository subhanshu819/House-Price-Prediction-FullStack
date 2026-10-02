import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../services/api";

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

const RefreshIcon = () => (
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
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 text-emerald-400 shrink-0"
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
      clipRule="evenodd"
    />
  </svg>
);

const AlertIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 text-rose-400 shrink-0"
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.125 4.5a1.125 1.125 0 012.25 0v6a1.125 1.125 0 01-2.25 0v-6zm1.125 10.125a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
      clipRule="evenodd"
    />
  </svg>
);

const INITIAL_FORM_STATE = {
  medianIncome: "",
  houseAge: "",
  avgRooms: "",
  avgBedrooms: "",
  population: "",
  avgOccupancy: "",
  latitude: "",
  longitude: "",
};

export default function Predict() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  const validate = () => {
    const newErrors = {};

    if (!formData.medianIncome) {
      newErrors.medianIncome = "Median income is required";
    } else if (Number(formData.medianIncome) <= 0) {
      newErrors.medianIncome = "Must be greater than 0 (in $10k units)";
    }

    if (!formData.houseAge) {
      newErrors.houseAge = "House age is required";
    } else if (Number(formData.houseAge) < 0 || Number(formData.houseAge) > 150) {
      newErrors.houseAge = "Must be between 0 and 150 years";
    }

    if (!formData.avgRooms) {
      newErrors.avgRooms = "Average rooms is required";
    } else if (Number(formData.avgRooms) <= 0) {
      newErrors.avgRooms = "Must be greater than 0";
    }

    if (!formData.avgBedrooms) {
      newErrors.avgBedrooms = "Average bedrooms is required";
    } else if (Number(formData.avgBedrooms) <= 0) {
      newErrors.avgBedrooms = "Must be greater than 0";
    }

    if (!formData.population) {
      newErrors.population = "Block population is required";
    } else if (Number(formData.population) < 1) {
      newErrors.population = "Must be at least 1 person";
    }

    if (!formData.avgOccupancy) {
      newErrors.avgOccupancy = "Average occupancy is required";
    } else if (Number(formData.avgOccupancy) <= 0) {
      newErrors.avgOccupancy = "Must be greater than 0";
    }

    if (!formData.latitude) {
      newErrors.latitude = "Latitude is required";
    } else if (Number(formData.latitude) < 32 || Number(formData.latitude) > 42) {
      newErrors.latitude = "Valid California latitude: ~32.0 to 42.0";
    }

    if (!formData.longitude) {
      newErrors.longitude = "Longitude is required";
    } else if (Number(formData.longitude) < -125 || Number(formData.longitude) > -114) {
      newErrors.longitude = "Valid California longitude: ~-125.0 to -114.0";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) {
      setApiError("");
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setApiError("");
    setPredictionResult(null);
  };

  const handleFillDemo = () => {
    setFormData({
      medianIncome: "8.3252",
      houseAge: "28",
      avgRooms: "6.98",
      avgBedrooms: "1.02",
      population: "1425",
      avgOccupancy: "2.55",
      latitude: "37.88",
      longitude: "-122.23",
    });
    setErrors({});
    setApiError("");
    setPredictionResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
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
        typeof data.usd_price === "number"
          ? data.usd_price
          : parseFloat(data.usd_price) || 0;

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-violet-500 selection:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[380px] bg-gradient-to-tr from-violet-600/15 via-indigo-500/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Navbar */}
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            House Price Predictor
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Enter the residential census block attributes below to calculate an immediate valuation using our trained machine learning pipeline.
          </p>
        </div>

        {/* Form Container Card */}
        <div className="relative rounded-3xl p-1 bg-gradient-to-b from-violet-500/25 via-slate-800/40 to-slate-900/60 shadow-2xl backdrop-blur-xl">
          <div className="bg-slate-900/95 rounded-2xl p-6 sm:p-10 border border-slate-800/80">
            
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Feature Parameters
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-xs font-medium text-violet-400 hover:text-violet-300 underline underline-offset-4 transition-colors"
              >
                Fill with Sample Data
              </button>
            </div>

            {apiError && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-sm font-medium flex items-start gap-2.5 animate-fade-in">
                <AlertIcon />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 2-Column Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* 1. Median Income */}
                <div>
                  <label htmlFor="medianIncome" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Median Income (in $10k)
                  </label>
                  <input
                    id="medianIncome"
                    name="medianIncome"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 8.3252 ($83,252)"
                    value={formData.medianIncome}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950/70 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.medianIncome
                        ? "border-rose-500/70 focus:ring-rose-500/40"
                        : "border-slate-800 focus:ring-violet-500/50 focus:border-violet-500"
                    }`}
                  />
                  {errors.medianIncome && (
                    <p className="mt-1.5 text-xs text-rose-400">{errors.medianIncome}</p>
                  )}
                </div>

                {/* 2. House Age */}
                <div>
                  <label htmlFor="houseAge" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    House Age (Years)
                  </label>
                  <input
                    id="houseAge"
                    name="houseAge"
                    type="number"
                    step="1"
                    placeholder="e.g. 28"
                    value={formData.houseAge}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950/70 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.houseAge
                        ? "border-rose-500/70 focus:ring-rose-500/40"
                        : "border-slate-800 focus:ring-violet-500/50 focus:border-violet-500"
                    }`}
                  />
                  {errors.houseAge && (
                    <p className="mt-1.5 text-xs text-rose-400">{errors.houseAge}</p>
                  )}
                </div>

                {/* 3. Average Rooms */}
                <div>
                  <label htmlFor="avgRooms" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Average Rooms
                  </label>
                  <input
                    id="avgRooms"
                    name="avgRooms"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 6.98"
                    value={formData.avgRooms}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950/70 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.avgRooms
                        ? "border-rose-500/70 focus:ring-rose-500/40"
                        : "border-slate-800 focus:ring-violet-500/50 focus:border-violet-500"
                    }`}
                  />
                  {errors.avgRooms && (
                    <p className="mt-1.5 text-xs text-rose-400">{errors.avgRooms}</p>
                  )}
                </div>

                {/* 4. Average Bedrooms */}
                <div>
                  <label htmlFor="avgBedrooms" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Average Bedrooms
                  </label>
                  <input
                    id="avgBedrooms"
                    name="avgBedrooms"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 1.02"
                    value={formData.avgBedrooms}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950/70 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.avgBedrooms
                        ? "border-rose-500/70 focus:ring-rose-500/40"
                        : "border-slate-800 focus:ring-violet-500/50 focus:border-violet-500"
                    }`}
                  />
                  {errors.avgBedrooms && (
                    <p className="mt-1.5 text-xs text-rose-400">{errors.avgBedrooms}</p>
                  )}
                </div>

                {/* 5. Population */}
                <div>
                  <label htmlFor="population" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Block Population
                  </label>
                  <input
                    id="population"
                    name="population"
                    type="number"
                    step="1"
                    placeholder="e.g. 1425"
                    value={formData.population}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950/70 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.population
                        ? "border-rose-500/70 focus:ring-rose-500/40"
                        : "border-slate-800 focus:ring-violet-500/50 focus:border-violet-500"
                    }`}
                  />
                  {errors.population && (
                    <p className="mt-1.5 text-xs text-rose-400">{errors.population}</p>
                  )}
                </div>

                {/* 6. Average Occupancy */}
                <div>
                  <label htmlFor="avgOccupancy" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Average Occupancy
                  </label>
                  <input
                    id="avgOccupancy"
                    name="avgOccupancy"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 2.55"
                    value={formData.avgOccupancy}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950/70 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.avgOccupancy
                        ? "border-rose-500/70 focus:ring-rose-500/40"
                        : "border-slate-800 focus:ring-violet-500/50 focus:border-violet-500"
                    }`}
                  />
                  {errors.avgOccupancy && (
                    <p className="mt-1.5 text-xs text-rose-400">{errors.avgOccupancy}</p>
                  )}
                </div>

                {/* 7. Latitude */}
                <div>
                  <label htmlFor="latitude" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Latitude
                  </label>
                  <input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 37.88"
                    value={formData.latitude}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950/70 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.latitude
                        ? "border-rose-500/70 focus:ring-rose-500/40"
                        : "border-slate-800 focus:ring-violet-500/50 focus:border-violet-500"
                    }`}
                  />
                  {errors.latitude && (
                    <p className="mt-1.5 text-xs text-rose-400">{errors.latitude}</p>
                  )}
                </div>

                {/* 8. Longitude */}
                <div>
                  <label htmlFor="longitude" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Longitude
                  </label>
                  <input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="0.01"
                    placeholder="e.g. -122.23"
                    value={formData.longitude}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950/70 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.longitude
                        ? "border-rose-500/70 focus:ring-rose-500/40"
                        : "border-slate-800 focus:ring-violet-500/50 focus:border-violet-500"
                    }`}
                  />
                  {errors.longitude && (
                    <p className="mt-1.5 text-xs text-rose-400">{errors.longitude}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Analyzing Feature Weights...</span>
                    </>
                  ) : (
                    <>
                      <SparkleIcon className="w-4 h-4 text-violet-200" />
                      <span>Predict House Price</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all duration-200"
                >
                  <RefreshIcon />
                  <span>Reset</span>
                </button>
              </div>
            </form>

            {/* Prediction Result Display */}
            {predictionResult && (
              <div className="mt-8 pt-8 border-t border-slate-800/80 animate-fade-in">
                <div className="p-6 rounded-2xl bg-gradient-to-b from-violet-950/40 to-slate-900 border border-violet-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-300 mb-1">
                      <CheckCircleIcon />
                      <span>Model Inference Completed ({predictionResult.latency})</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Estimated Property Valuation</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      US Dollar Valuation: {predictionResult.usdPrice} USD (1 USD = ₹93)
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Predicted Value</span>
                    <span className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                      {predictionResult.inrPrice}
                    </span>
                    <span className="block text-xs font-semibold text-cyan-400 mt-1">
                      USD Value: {predictionResult.usdPrice}
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}


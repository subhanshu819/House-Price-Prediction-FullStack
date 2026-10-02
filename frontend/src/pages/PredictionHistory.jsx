import { useState, useMemo, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthContext, { isJwtValid } from "../context/AuthContext";
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

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-4 h-4 text-slate-400"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-4 h-4 text-rose-400 hover:text-rose-300"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-4 h-4 text-violet-400 hover:text-violet-300"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const formatCurrency = (val) => {
  if (typeof val !== "number" || isNaN(val)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export default function PredictionHistory() {
  const auth = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModel, setSelectedModel] = useState("ALL");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchHistory = useCallback(async () => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;

    if (!token || !isJwtValid(token)) {
      setRecords([]);
      setSelectedRecord(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    // Explicitly reset records and selectedRecord so stale account data is never retained during fetch
    setRecords([]);
    setSelectedRecord(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/predictions/history`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        setRecords([]);
        setSelectedRecord(null);
        throw new Error("Session expired or unauthorized. Please log in.");
      }

      if (!res.ok) {
        throw new Error(`Failed to load history (${res.status})`);
      }

      const data = await res.json();
      const mapped = (Array.isArray(data) ? data : []).map((doc) => {
        const lat = doc.Latitude != null ? Number(doc.Latitude).toFixed(2) : "N/A";
        const lng = doc.Longitude != null ? Number(doc.Longitude).toFixed(2) : "N/A";
        const rooms = doc.AveRooms != null ? Math.round(Number(doc.AveRooms)) : "—";
        const bedrms = doc.AveBedrms != null ? Math.round(Number(doc.AveBedrms)) : "—";
        const populationFormatted = doc.Population != null ? Math.round(Number(doc.Population)).toLocaleString() : "—";
        const rawPrice = doc.usdPrice != null ? Number(doc.usdPrice) : 0;

        return {
          id: doc._id || "",
          date: formatDate(doc.createdAt),
          address: `Coordinates: ${lat}°, ${lng}°`,
          location: `California (${lat}, ${lng})`,
          specs: `${rooms} rooms • ${bedrms} bed • Pop: ${populationFormatted}`,
          rawPrice,
          price: formatCurrency(rawPrice),
          model: "Random Forest Regressor",
          modelType: "Random Forest",
          // Prediction input fields formatted properly
          MedInc: doc.MedInc != null ? Number(doc.MedInc).toFixed(2) : "—",
          HouseAge: doc.HouseAge != null ? Math.round(Number(doc.HouseAge)) : "—",
          AveRooms: doc.AveRooms != null ? Math.round(Number(doc.AveRooms)) : "—",
          AveBedrms: doc.AveBedrms != null ? Math.round(Number(doc.AveBedrms)) : "—",
          Population: doc.Population != null ? Math.round(Number(doc.Population)).toLocaleString() : "—",
          AveOccup: doc.AveOccup != null ? Number(doc.AveOccup).toFixed(2) : "—",
          Latitude: doc.Latitude != null ? Number(doc.Latitude).toFixed(4) : "—",
          Longitude: doc.Longitude != null ? Number(doc.Longitude).toFixed(4) : "—",
          usdPrice: rawPrice,
          createdAt: doc.createdAt,
        };
      });

      setRecords(mapped);
    } catch (err) {
      console.error("Error fetching prediction history:", err);
      setError(err.message || "Failed to load prediction history");
      setRecords([]);
      setSelectedRecord(null);
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

  // Filtered and searched data
  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        (item.address && item.address.toLowerCase().includes(term)) ||
        (item.location && item.location.toLowerCase().includes(term)) ||
        (item.id && item.id.toLowerCase().includes(term)) ||
        (item.model && item.model.toLowerCase().includes(term)) ||
        (item.specs && item.specs.toLowerCase().includes(term));

      const matchesModel =
        selectedModel === "ALL" || item.modelType === selectedModel;

      return matchesSearch && matchesModel;
    });
  }, [records, searchTerm, selectedModel]);

  const handleDelete = async (id) => {
    try {
      const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${API_BASE_URL}/api/predictions/history/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete record (${res.status})`);
      }

      setRecords((prev) => prev.filter((item) => item.id !== id));
      if (selectedRecord && selectedRecord.id === id) {
        setSelectedRecord(null);
      }
    } catch (err) {
      console.error("Error deleting prediction:", err);
      alert(err.message || "Failed to delete prediction record");
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedModel("ALL");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-violet-500 selection:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/3 -translate-x-1/2 w-[850px] h-[380px] bg-gradient-to-tr from-violet-600/15 via-indigo-500/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Navbar */}
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Prediction History
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Audit and manage all historical machine learning valuations generated across your account.
            </p>
          </div>

          <Link
            to="/predict"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] active:scale-95 transition-all duration-200 self-start md:self-auto"
          >
            <SparkleIcon className="w-4 h-4 text-violet-200" />
            New Prediction
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="my-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by address, city or ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-200"
            />
          </div>

          {/* Model Filter */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label htmlFor="modelFilter" className="text-xs uppercase tracking-wider text-slate-400 font-semibold shrink-0">
              Filter Model:
            </label>
            <select
              id="modelFilter"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-200"
            >
              <option value="ALL">All Models</option>
              <option value="Random Forest">Random Forest</option>
            </select>
          </div>
        </div>

        {/* History Table Container */}
        {loading ? (
          <div className="my-12 py-16 px-6 text-center rounded-2xl border border-slate-800 bg-slate-900/40">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-400">Loading prediction archives...</p>
          </div>
        ) : error ? (
          <div className="my-12 py-12 px-6 text-center rounded-2xl border border-rose-900/40 bg-rose-950/20 text-rose-300">
            <p className="text-sm font-semibold mb-1">Failed to load prediction history</p>
            <p className="text-xs text-rose-400/80">{error}</p>
          </div>
        ) : filteredRecords.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden backdrop-blur-sm shadow-xl">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-xs uppercase font-semibold text-slate-400 tracking-wider">
                  <tr>
                    <th className="px-6 py-4">ID & Date</th>
                    <th className="px-6 py-4">Property Details</th>
                    <th className="px-6 py-4">Model Used</th>
                    <th className="px-6 py-4">Predicted Value</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredRecords.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-semibold text-violet-400 block">{item.id}</span>
                        <span className="text-xs text-slate-500">{item.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{item.address}</div>
                        <div className="text-xs text-slate-400">{item.location} • {item.specs}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-medium">
                          {item.model}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-base font-extrabold text-emerald-400">
                          {item.price}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedRecord(item)}
                            className="p-2 rounded-lg bg-slate-800/80 hover:bg-violet-900/40 border border-slate-700/60 hover:border-violet-500/40 transition-all duration-200"
                            title="View Details"
                          >
                            <EyeIcon />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-950/40 border border-slate-700/60 hover:border-rose-500/40 transition-all duration-200"
                            title="Delete Record"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-4">
              {filteredRecords.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs font-semibold text-violet-400 block">{item.id}</span>
                      <h3 className="font-bold text-white text-base mt-0.5">{item.address}</h3>
                      <p className="text-xs text-slate-400">{item.location}</p>
                    </div>
                    <span className="text-xs text-slate-500">{item.date}</span>
                  </div>

                  <p className="text-xs text-slate-400">{item.specs}</p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 tracking-wider block">Predicted Price</span>
                      <span className="text-lg font-extrabold text-emerald-400">{item.price}</span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      {item.modelType}
                    </span>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800/60">
                    <button
                      type="button"
                      onClick={() => setSelectedRecord(item)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-violet-400 bg-violet-950/40 border border-violet-800/40 flex items-center gap-1"
                    >
                      <EyeIcon /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 bg-rose-950/40 border border-rose-800/40 flex items-center gap-1"
                    >
                      <TrashIcon /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="my-12 py-16 px-6 text-center rounded-2xl border border-slate-800 bg-slate-900/40">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto mb-4">
              <SparkleIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">No Predictions Found</h3>
            <p className="mt-1 text-sm text-slate-400 max-w-sm mx-auto">
              {searchTerm || selectedModel !== "ALL"
                ? "No archived valuations match your query. Try resetting your search or filter parameters."
                : "You haven't generated any property valuations yet. Run your first prediction now."}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              {searchTerm || selectedModel !== "ALL" ? (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Clear Filters
                </button>
              ) : (
                <Link
                  to="/predict"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-600/30 transition-all"
                >
                  Predict House Price
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Modal: View Details */}
        {selectedRecord && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedRecord(null)}
          >
            <div
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="font-mono text-xs font-semibold text-violet-400">{selectedRecord.id}</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{selectedRecord.address}</h3>
                  <p className="text-xs text-slate-400">{selectedRecord.location}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Evaluation Date:</span>
                  <span className="font-medium text-white">{selectedRecord.date}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Model Engine:</span>
                  <span className="font-medium text-white">{selectedRecord.model}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Property Specs:</span>
                  <span className="font-medium text-white">{selectedRecord.specs}</span>
                </div>
                {selectedRecord.MedInc != null && (
                  <div className="pt-2 pb-1 border-b border-slate-800/60">
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block mb-1.5">
                      Prediction Inputs
                    </span>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <div><span className="text-slate-500">MedInc:</span> <span className="text-slate-300 font-mono">{selectedRecord.MedInc}</span></div>
                      <div><span className="text-slate-500">HouseAge:</span> <span className="text-slate-300 font-mono">{selectedRecord.HouseAge}</span></div>
                      <div><span className="text-slate-500">AveRooms:</span> <span className="text-slate-300 font-mono">{selectedRecord.AveRooms}</span></div>
                      <div><span className="text-slate-500">AveBedrms:</span> <span className="text-slate-300 font-mono">{selectedRecord.AveBedrms}</span></div>
                      <div><span className="text-slate-500">Population:</span> <span className="text-slate-300 font-mono">{selectedRecord.Population}</span></div>
                      <div><span className="text-slate-500">AveOccup:</span> <span className="text-slate-300 font-mono">{selectedRecord.AveOccup}</span></div>
                      <div><span className="text-slate-500">Latitude:</span> <span className="text-slate-300 font-mono">{selectedRecord.Latitude}</span></div>
                      <div><span className="text-slate-500">Longitude:</span> <span className="text-slate-300 font-mono">{selectedRecord.Longitude}</span></div>
                    </div>
                  </div>
                )}
                <div className="flex justify-between py-1 pt-2">
                  <span className="text-slate-500">Estimated Price:</span>
                  <span className="font-extrabold text-emerald-400 text-lg">{selectedRecord.price}</span>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <Link
                  to="/predict"
                  className="flex-1 text-center py-2.5 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors"
                >
                  Re-run Model
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}


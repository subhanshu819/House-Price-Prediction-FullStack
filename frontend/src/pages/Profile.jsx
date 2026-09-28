import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthContext from "../context/AuthContext";
import { API_BASE_URL, getDefaultHeaders } from "../services/api";

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

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-12 h-12 text-violet-300"
  >
    <path
      fillRule="evenodd"
      d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      clipRule="evenodd"
    />
  </svg>
);

const EditIcon = () => (
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
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
    />
  </svg>
);

const KeyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-4 h-4 text-violet-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
    />
  </svg>
);

const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-5 h-5 text-rose-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
    />
  </svg>
);

const LoadingSpinner = () => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

/** Feedback banner for success/error messages */
function FeedbackBanner({ type, message, onDismiss }) {
  if (!message) return null;
  const isSuccess = type === "success";
  return (
    <div
      className={`mb-4 p-3 rounded-xl text-xs flex items-center justify-between ${
        isSuccess
          ? "bg-emerald-950/40 border border-emerald-500/30 text-emerald-300"
          : "bg-rose-950/40 border border-rose-500/30 text-rose-300"
      }`}
    >
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="ml-3 opacity-60 hover:opacity-100 text-sm">
          ✕
        </button>
      )}
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, logout, login } = useContext(AuthContext);

  // Profile state
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({ name: "", email: "", role: "", createdAt: "" });
  const [editData, setEditData] = useState({ name: "", email: "" });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState({ type: "", message: "" });

  // Password state
  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState({ type: "", message: "" });

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteFeedback, setDeleteFeedback] = useState({ type: "", message: "" });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch profile from backend
  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
          headers: getDefaultHeaders(),
        });
        const data = await res.json();
        if (!cancelled && res.ok && data.user) {
          setProfileData({
            name: data.user.name || "",
            email: data.user.email || "",
            role: data.user.role || "user",
            createdAt: data.user.createdAt || "",
          });
          setEditData({ name: data.user.name || "", email: data.user.email || "" });
        }
      } catch {
        // Network error – keep whatever we have from context
        if (!cancelled && user) {
          setProfileData({
            name: user.name || "",
            email: user.email || "",
            role: user.role || "user",
            createdAt: user.createdAt || "",
          });
          setEditData({ name: user.name || "", email: user.email || "" });
        }
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    };

    fetchProfile();
    return () => { cancelled = true; };
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Format the joined date
  const joinedDate = profileData.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  // ───── Edit Profile Handlers ─────
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async () => {
    setProfileFeedback({ type: "", message: "" });

    if (!editData.name.trim() && !editData.email.trim()) {
      setProfileFeedback({ type: "error", message: "Name and email cannot both be empty." });
      return;
    }

    setProfileSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: "PUT",
        headers: getDefaultHeaders(),
        body: JSON.stringify({ name: editData.name.trim(), email: editData.email.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.user) {
        setProfileData({
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          createdAt: data.user.createdAt,
        });
        setEditData({ name: data.user.name, email: data.user.email });
        setIsEditing(false);
        setProfileFeedback({ type: "success", message: "Profile updated successfully." });

        // Sync updated user info with AuthContext & localStorage
        const updatedUser = { ...user, name: data.user.name, email: data.user.email };
        login(token, updatedUser);
      } else {
        setProfileFeedback({ type: "error", message: data.message || "Failed to update profile." });
      }
    } catch {
      setProfileFeedback({ type: "error", message: "Network error. Please try again." });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({ name: profileData.name, email: profileData.email });
    setProfileFeedback({ type: "", message: "" });
  };

  // ───── Password Handlers ─────
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordState((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordFeedback({ type: "", message: "" });

    const { currentPassword, newPassword, confirmPassword } = passwordState;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordFeedback({ type: "error", message: "All password fields are required." });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordFeedback({ type: "error", message: "New password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: "error", message: "New passwords do not match." });
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/password`, {
        method: "PUT",
        headers: getDefaultHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setPasswordFeedback({ type: "success", message: data.message || "Password changed successfully." });
        setPasswordState({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPasswordFeedback({ type: "error", message: data.message || "Failed to change password." });
      }
    } catch {
      setPasswordFeedback({ type: "error", message: "Network error. Please try again." });
    } finally {
      setPasswordSaving(false);
    }
  };

  // ───── Delete Account Handlers ─────
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      setDeleteFeedback({ type: "error", message: 'Please type "DELETE" to confirm.' });
      return;
    }

    setDeleting(true);
    setDeleteFeedback({ type: "", message: "" });
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/account`, {
        method: "DELETE",
        headers: getDefaultHeaders(),
      });
      const data = await res.json();

      if (res.ok) {
        logout();
        navigate("/login");
      } else {
        setDeleteFeedback({ type: "error", message: data.message || "Failed to delete account." });
      }
    } catch {
      setDeleteFeedback({ type: "error", message: "Network error. Please try again." });
    } finally {
      setDeleting(false);
    }
  };

  // ───── Render ─────
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-violet-500 selection:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/3 -translate-x-1/2 w-[850px] h-[380px] bg-gradient-to-tr from-violet-600/15 via-indigo-500/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Navbar */}
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <SparkleIcon className="w-3.5 h-3.5 text-violet-400" />
            <span>Account Preferences</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            User Profile
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your personal information and security preferences.
          </p>
        </div>

        {profileLoading ? (
          <div className="flex items-center justify-center py-24">
            <LoadingSpinner />
            <span className="ml-3 text-sm text-slate-400">Loading profile…</span>
          </div>
        ) : (
          <>
            {/* 1. Profile Avatar & Information Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-sm shadow-xl">
              <FeedbackBanner
                type={profileFeedback.type}
                message={profileFeedback.message}
                onDismiss={() => setProfileFeedback({ type: "", message: "" })}
              />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-5">
                  {/* Profile Avatar */}
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-600 to-violet-800 p-0.5 shadow-lg shadow-violet-500/25 flex items-center justify-center">
                      <div className="w-full h-full bg-slate-950/80 rounded-2xl flex items-center justify-center">
                        <UserIcon />
                      </div>
                    </div>
                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900" title="Online" />
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">{profileData.name}</h2>
                    <p className="text-sm text-slate-400">{profileData.email}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 font-semibold capitalize">
                        {profileData.role}
                      </span>
                      <span className="text-xs text-slate-500">• Member since {joinedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Edit Profile Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      handleCancelEdit();
                    } else {
                      setIsEditing(true);
                      setEditData({ name: profileData.name, email: profileData.email });
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all duration-200 shadow-sm"
                >
                  <EditIcon />
                  <span>{isEditing ? "Cancel Editing" : "Edit Profile"}</span>
                </button>
              </div>

              {/* Account Information Details */}
              <div className="pt-6">
                <h3 className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-4">
                  Account Information
                </h3>

                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleEditChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleEditChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                      />
                    </div>
                    <div className="sm:col-span-2 pt-2">
                      <button
                        type="button"
                        onClick={handleProfileSave}
                        disabled={profileSaving}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {profileSaving && <LoadingSpinner />}
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    <div>
                      <dt className="text-slate-500 text-xs">Full Name</dt>
                      <dd className="text-white font-medium mt-0.5">{profileData.name}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500 text-xs">Email Address</dt>
                      <dd className="text-white font-medium mt-0.5">{profileData.email}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500 text-xs">Role</dt>
                      <dd className="text-white font-medium mt-0.5 capitalize">{profileData.role}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500 text-xs">Member Since</dt>
                      <dd className="text-white font-medium mt-0.5">{joinedDate}</dd>
                    </div>
                  </dl>
                )}
              </div>
            </div>

            {/* 2. Change Password Section */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-2 mb-1">
                <KeyIcon />
                <h3 className="text-lg font-bold text-white">Change Password</h3>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Ensure your account uses a secure password with at least 6 characters.
              </p>

              <FeedbackBanner
                type={passwordFeedback.type}
                message={passwordFeedback.message}
                onDismiss={() => setPasswordFeedback({ type: "", message: "" })}
              />

              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    required
                    value={passwordState.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    required
                    value={passwordState.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={passwordState.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-600/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordSaving && <LoadingSpinner />}
                  Update Password
                </button>
              </form>
            </div>

            {/* 3. Delete Account Section (Danger Zone) */}
            <div className="rounded-2xl border border-rose-900/40 bg-rose-950/10 p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <WarningIcon />
                <h3 className="text-lg font-bold text-rose-300">Delete Account</h3>
              </div>
              <p className="text-xs text-slate-400 mb-6 max-w-xl">
                Permanently delete your profile, prediction history, and account data.
                This action cannot be undone.
              </p>

              <FeedbackBanner
                type={deleteFeedback.type}
                message={deleteFeedback.message}
                onDismiss={() => setDeleteFeedback({ type: "", message: "" })}
              />

              {showDeleteConfirm ? (
                <div className="space-y-4 max-w-md">
                  <p className="text-xs text-rose-300">
                    Type <span className="font-bold">DELETE</span> below to confirm permanent account deletion:
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder='Type "DELETE" to confirm'
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-rose-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      disabled={deleting || deleteConfirmText !== "DELETE"}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-700 hover:bg-rose-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting && <LoadingSpinner />}
                      Confirm Deletion
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText("");
                        setDeleteFeedback({ type: "", message: "" });
                      }}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 border border-rose-800 hover:border-rose-700 transition-all duration-200 shadow-sm"
                >
                  Delete Account Permanently
                </button>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

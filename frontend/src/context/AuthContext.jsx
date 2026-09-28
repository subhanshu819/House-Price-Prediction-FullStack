import { createContext, useState, useEffect, useCallback } from "react";

/**
 * Validates a JWT string by checking structure (3 base64 parts) and expiration time.
 */
export function isJwtValid(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.trim().split(".");
  if (parts.length !== 3) return false;
  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    if (payload.exp && typeof payload.exp === "number") {
      if (Date.now() >= payload.exp * 1000) {
        return false; // Expired
      }
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieves and parses stored user information from localStorage or JWT payload.
 */
export function getStoredUser() {
  if (typeof localStorage === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!isJwtValid(token)) return null;

  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const parsed = JSON.parse(userStr);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  // Fallback: extract from token payload
  try {
    const parts = token.trim().split(".");
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return {
      _id: payload.id || payload._id,
      name: payload.name || (payload.email ? payload.email.split("@")[0] : "User"),
      email: payload.email || "",
      role: payload.role || "user",
    };
  } catch {
    return { name: "User" };
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    if (typeof localStorage === "undefined") return null;
    const stored = localStorage.getItem("token");
    return isJwtValid(stored) ? stored : null;
  });

  const [user, setUser] = useState(() => {
    return getStoredUser();
  });

  const [loading, setLoading] = useState(false);

  // Sync state with localStorage
  const syncAuthState = useCallback(() => {
    if (typeof localStorage === "undefined") return;
    const storedToken = localStorage.getItem("token");
    if (isJwtValid(storedToken)) {
      setToken(storedToken);
      setUser(getStoredUser());
    } else {
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    syncAuthState();

    const handleStorage = () => syncAuthState();
    const handleAuthChange = () => syncAuthState();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, [syncAuthState]);

  const login = (newToken, newUser) => {
    if (typeof localStorage !== "undefined") {
      if (newToken) localStorage.setItem("token", newToken);
      if (newUser) localStorage.setItem("user", JSON.stringify(newUser));
      window.dispatchEvent(new Event("auth-change"));
    }
    setToken(newToken);
    setUser(newUser || getStoredUser());
  };

  const logout = () => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth-change"));
    }
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token && isJwtValid(token));

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    syncAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;

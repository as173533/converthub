import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, clearSession, setSession, storedUser } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storedUser());
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    api.profile()
      .then((payload) => setUser(payload.user))
      .catch(() => clearSession())
      .finally(() => setBooting(false));
  }, []);

  const value = useMemo(() => ({
    user,
    booting,
    async login(payload) {
      const session = await api.login(payload);
      setSession(session.token, session.user);
      setUser(session.user);
    },
    async register(payload) {
      const session = await api.register(payload);
      setSession(session.token, session.user);
      setUser(session.user);
    },
    async logout() {
      await api.logout().catch(() => null);
      clearSession();
      setUser(null);
    }
  }), [user, booting]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}


import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authApi, adhesionApi, type Member } from "../api/members";

interface AuthContextType {
  user: Member | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  role: Member["role"] | "membre";
  canAccessAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      adhesionApi
        .monProfil()
        .then((r) => setUser(r.data))
        .catch(() => {
          localStorage.clear();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login(email, password);
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    const profile = await adhesionApi.monProfil();
    setUser(profile.data);
  };

  const logout = () => {
    const refresh = localStorage.getItem("refresh_token");
    if (refresh) {
      authApi.logout(refresh).catch(() => {});
    }
    localStorage.clear();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const profile = await adhesionApi.monProfil();
      setUser(profile.data);
    } catch {
      /* ignore */
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        isAdmin: !!user?.is_staff,
        role: user?.role ?? "membre",
        canAccessAdmin:
          !!user?.is_staff ||
          ["bureau", "tresorier", "comite_scientifique"].includes(
            user?.role ?? "membre",
          ),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

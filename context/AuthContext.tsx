import { createContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

interface AuthContextProps {
  user: any | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any | null>(null);

  // Mantener sesión activa
  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) setUser(data.session.user);
    };
    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ---------------------------
  // ✔ Login (único funcional)
  // ---------------------------
  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error en login:", error.message);
      return false;
    }

    setUser(data.user);
    return true;
  };

  // ---------------------------
  // AuthProviderRegister (solo estructura)
  // ---------------------------
  const register = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    console.warn("register() aún no implementado");
    return false;
  };

  // ---------------------------
  // AuthProviderReset password (estructura)
  // ---------------------------
  const resetPassword = async (email: string): Promise<void> => {
    console.warn("resetPassword() aún no implementado");
  };

  // ---------------------------
  // AuthProviderLogout (estructura)
  // ---------------------------
  const logout = async (): Promise<void> => {
    console.warn("logout() aún no implementado");
  };

  // ---------------------------
  // AuthProviderRefresh user (estructura)
  // ---------------------------
  const refreshUser = async (): Promise<void> => {
    console.warn("refreshUser() aún no implementado");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        resetPassword,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

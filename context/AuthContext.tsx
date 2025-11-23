import { createContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

// ---------------------------
// Interfaces
// ---------------------------
export interface User {
  id: string;
  email: string;
  name: string;
  lastname: string;
  actualweight: number;
  targetweight: number;
  height: number;
  activitylevel: string;
  fatindex?: number | null;
  targetfatindex?: number | null;
  avatar_url?: string | null;
  aicontext?: string | null;
}

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (password: string, userData: Omit<User, "id">) => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (fields: Partial<User>) => Promise<boolean>;
}

// ---------------------------
// Context
// ---------------------------
export const AuthContext = createContext({} as AuthContextProps);

// ---------------------------
// Provider
// ---------------------------
export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);

  // ---------------------------
  // Inicializar sesión
  // ---------------------------
  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        await refreshUser();
      }
    };
    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await refreshUser();
        } else {
          setUser(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------
  // Formatear perfil al tipo User
  // ---------------------------
  const mapUser = (profile: any): User => ({
    id: profile.id,
    email: profile.email,
    name: profile.name,
    lastname: profile.lastname,
    actualweight: profile.actualweight,
    targetweight: profile.targetweight,
    height: profile.height,
    activitylevel: profile.activitylevel,
    fatindex: profile.fatindex,
    avatar_url: profile.avatar_url,
    targetfatindex: profile.targetfatindex,
    aicontext: profile.aicontext,
  });

  // ---------------------------
  // Login
  // ---------------------------
  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("Error en login:", error.message);
      return false;
    }

    await refreshUser();
    return true;
  };

  // ---------------------------
  // Registro completo
  // ---------------------------
  const register = async (
    password: string,
    userData: Omit<User, "id">
  ): Promise<boolean> => {
    // 1. Crear usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password,
    });

    if (error || !data.user) {
      console.log("Error al registrar:", error?.message);
      return false;
    }

    const userId = data.user.id;

    // 2. Insertar en profiles con campos EXACTOS de tu DB
    const { error: insertError } = await supabase.from("profiles").insert({
      id: userId, // UUID de Auth
      email: userData.email,
      name: userData.name,
      lastname: userData.lastname,
      actualweight: userData.actualweight,
      targetweight: userData.targetweight,
      height: userData.height,
      activitylevel: userData.activitylevel,
      fatindex: userData.fatindex ?? null,
      targetfatindex: userData.targetfatindex ?? null,
      aicontext: userData.aicontext ?? null,
    });

    if (insertError) {
      console.log("Error al insertar perfil:", insertError.message);
      return false;
    }

    // 3. Actualizar estado global
    await refreshUser();
    return true;
  };

  // ---------------------------
  // Update User — actualizar perfil
  // ---------------------------
  const updateUser = async (
    updates: Partial<Omit<User, "id" | "email">>
  ): Promise<boolean> => {
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;

    if (!userId) {
      console.log("No hay usuario autenticado");
      return false;
    }

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);

    if (error) {
      console.log("Error actualizando perfil:", error.message);
      return false;
    }

    return true;
  };

  // ---------------------------
  // Reset Password
  // ---------------------------
  const resetPassword = async (email: string): Promise<void> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) console.log("Error en reset:", error.message);
  };

  // ---------------------------
  // Logout
  // ---------------------------
  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // ---------------------------
  // Refresh — carga perfil desde DB
  // ---------------------------
  const refreshUser = async (): Promise<void> => {
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;

    if (!userId) {
      setUser(null);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.log("Error cargando profile:", error.message);
      return;
    }

    if (!data) {
      setUser(null);
      return;
    }

    setUser(mapUser(data));
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
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useContext, useState } from "react";
import { supabase } from "../utils/supabase";
import { AuthContext } from "./AuthContext";

// ----------------------------------------------
// Tipo para el CRUD genérico
// ----------------------------------------------
type CRUD = {
  getAll: () => Promise<any[] | null>;
  getById: (id: string) => Promise<any | null>;
  create: (payload: any) => Promise<boolean>;
  update: (id: string, payload: any) => Promise<boolean>;
  delete: (id: string) => Promise<boolean>;
};

export interface LiveTrainingAPI {
  createSession: () => Promise<{ success: boolean; session?: any }>;
  joinSession: (
    roomCode: string
  ) => Promise<{ success: boolean; session?: any }>;
  joinSessionRoom: (sessionId: string, userId: string) => Promise<boolean>;
  subscribeToMembers: (
    sessionId: string,
    callback: (payload: any) => void
  ) => { memberChannel: any; statusChannel: any };
  leaveSession: (channels: any) => Promise<void>;
  updateSessionStatus: (sessionId: string, status: string) => Promise<boolean>;
  deleteSessionFull: (sessionId: string, channels: any) => Promise<boolean>;
}

// ----------------------------------------------
// Interfaz del Contexto
// ----------------------------------------------
export interface DataContextType {
  data: any;
  setData: (value: any) => void;

  productsAPI: CRUD;
  routinesAPI: CRUD;
  exercisesAPI: CRUD;
  activitiesAPI: CRUD;
  messagesAPI: CRUD;
  liveTrainingAPI: LiveTrainingAPI;
}

// ----------------------------------------------
// Crear Contexto (inicialmente null)
// ----------------------------------------------
export const DataContext = createContext<DataContextType>(
  {} as DataContextType
);

// ----------------------------------------------
// Provider
// ----------------------------------------------
export const DataProvider = ({ children }: any) => {
  const [data, setData] = useState({});
  const { user } = useContext(AuthContext); // <<< OBTENER UUID DEL USUARIO
  const userId = user?.id ?? null;

  // -------------------------------------------
  // Helper CRUD reutilizable
  // -------------------------------------------
  const createCRUD = (table: string): CRUD => ({
    getAll: async () => {
      const query = supabase.from(table).select("*");

      // Filtrar por usuario si la tabla lo tiene
      if (userId) query.eq("user_id", userId);

      const { data, error } = await query;

      if (error) {
        console.log(`Error getting ${table}:`, error.message);
        return null;
      }
      return data;
    },

    getById: async (id: string) => {
      const query = supabase.from(table).select("*").eq("id", id);

      if (userId) query.eq("user_id", userId);

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.log(`Error getting ${table} by id:`, error.message);
        return null;
      }
      return data;
    },

    create: async (payload: any) => {
      const finalPayload = userId ? { ...payload, user_id: userId } : payload;

      const { error } = await supabase.from(table).insert(finalPayload);

      if (error) {
        console.log(`Error inserting ${table}:`, error.message);
        return false;
      }
      return true;
    },

    update: async (id: string, payload: any) => {
      const query = supabase.from(table).update(payload).eq("id", id);

      if (userId) query.eq("user_id", userId);

      const { error } = await query;

      if (error) {
        console.log(`Error updating ${table}:`, error.message);
        return false;
      }
      return true;
    },

    delete: async (id: string) => {
      const query = supabase.from(table).delete().eq("id", id);

      if (userId) query.eq("user_id", userId);

      const { error } = await query;

      if (error) {
        console.log(`Error deleting ${table}:`, error.message);
        return false;
      }
      return true;
    },
  });

  // -------------------------------------------
  // CRUD de cada tabla REAL
  // -------------------------------------------
  const productsAPI = createCRUD("products");
  const routinesAPI = createCRUD("routines");
  const exercisesAPI = createCRUD("exercises");
  const activitiesAPI = createCRUD("activities");
  const messagesAPI = createCRUD("messages");

  const liveTrainingAPI = {
    createSession: async (): Promise<{ success: boolean; session?: any }> => {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const { data, error } = await supabase
        .from("sessions")
        .insert({ room_code: code })
        .select("*")
        .single();

      if (error) {
        console.log("Error creando sesión:", error.message);
        return { success: false };
      }
      return { success: true, session: data };
    },

    updateSessionStatus: async (sessionId: string, status: string) => {
      const { error } = await supabase
        .from("sessions")
        .update({ status })
        .eq("id", sessionId);

      if (error) {
        console.log("Error actualizando status:", error.message);
        return false;
      }
      return true;
    },

    joinSession: async (roomCode: string) => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("room_code", roomCode)
        .single();

      if (error || !data) {
        console.log("Sala no encontrada:", error?.message);
        return { success: false };
      }

      return { success: true, session: data };
    },

    joinSessionRoom: async (sessionId: string, userId: string) => {
      const { error } = await supabase
        .from("session_members")
        .insert({ session_id: sessionId, user_id: userId });

      if (error) {
        console.log("Error uniendo a la sala:", error.message);
        return false;
      }

      // --- Consultar cuántos usuarios hay ahora ---
      const { data: members } = await supabase
        .from("session_members")
        .select("id")
        .eq("session_id", sessionId);

      if (members && members.length === 2) {
        await supabase
          .from("sessions")
          .update({ status: "started" })
          .eq("id", sessionId);
      }

      return true;
    },
    deleteSessionFull: async (sessionId: string, channels: any) => {
      try {
        // 1. Salir de los canales (subscripciones)
        if (channels) {
          if (channels.memberChannel)
            await supabase.removeChannel(channels.memberChannel);
          if (channels.statusChannel)
            await supabase.removeChannel(channels.statusChannel);
        }

        // 2. Eliminar miembros
        await supabase
          .from("session_members")
          .delete()
          .eq("session_id", sessionId);

        // 3. Eliminar la sesión completa
        await supabase.from("sessions").delete().eq("id", sessionId);

        // 4. Limpia cualquier canal restante de supabase
        supabase.removeAllChannels();

        return true;
      } catch (error) {
        console.log("Error en deleteSessionFull:", error);
        return false;
      }
    },

    subscribeToMembers: (
      sessionId: string,
      callback: (arg0: {
        type: string;
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        data: {} | { [key: string]: any };
      }) => void
    ) => {
      const memberChannel = supabase
        .channel(`session-members-${sessionId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "session_members",
            filter: `session_id=eq.${sessionId}`,
          },
          (event) => {
            callback({
              type: "member",
              data: event.new || event.old,
            });
          }
        )
        .subscribe();

      const statusChannel = supabase
        .channel(`session-status-${sessionId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "sessions",
            filter: `id=eq.${sessionId}`,
          },
          (event) => {
            callback({
              type: "status",
              data: event.new,
            });
          }
        )
        .subscribe();

      return { memberChannel, statusChannel };
    },

    leaveSession: async (channels: any) => {
      if (channels) {
        if (channels.memberChannel)
          await supabase.removeChannel(channels.memberChannel);
        if (channels.statusChannel)
          await supabase.removeChannel(channels.statusChannel);
      }
    },
  };

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        productsAPI,
        routinesAPI,
        exercisesAPI,
        activitiesAPI,
        messagesAPI,
        liveTrainingAPI,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

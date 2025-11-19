import React, { createContext, useState } from "react";
import { supabase } from "../utils/supabase";

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

  // -------------------------------------------
  // Helper CRUD reutilizable
  // -------------------------------------------
  const createCRUD = (table: string): CRUD => ({
    getAll: async () => {
      const { data, error } = await supabase.from(table).select("*");
      if (error) {
        console.error(`Error getting ${table}:`, error.message);
        return null;
      }
      return data;
    },

    getById: async (id: string) => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error(`Error getting ${table} by id:`, error.message);
        return null;
      }
      return data;
    },

    create: async (payload: any) => {
      const { error } = await supabase.from(table).insert(payload);
      if (error) {
        console.error(`Error inserting ${table}:`, error.message);
        return false;
      }
      return true;
    },

    update: async (id: string, payload: any) => {
      const { error } = await supabase.from(table).update(payload).eq("id", id);
      if (error) {
        console.error(`Error updating ${table}:`, error.message);
        return false;
      }
      return true;
    },

    delete: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) {
        console.error(`Error deleting ${table}:`, error.message);
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

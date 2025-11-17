import React, { createContext, useState } from "react";

// Crear el contexto
export const DataContext = createContext({});

// Proveedor
export const DataProvider = ({ children }: any) => {
  // Estado dummy para guardar cualquier información
  const [data, setData] = useState({});

  return (
    <DataContext.Provider
      value={{
        data,
        setData, // puedes actualizarlo desde cualquier componente
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

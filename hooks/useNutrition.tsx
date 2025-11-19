import { DataContext } from "@/context/DataContext";
import { RegistroComida, ResumenSemana } from "@/types/nutrition";
import { useFocusEffect } from "expo-router";
import { useCallback, useContext, useState } from "react";

export const useNutrition = () => {
  const { productsAPI } = useContext(DataContext);

  const [registrosDiarios, setRegistrosDiarios] = useState<RegistroComida[]>(
    []
  );
  const [resumenSemanal, setResumenSemanal] = useState<ResumenSemana>({
    semana: 0,
    año: 0,
    dias: [],
  });

  // ------------------------------------------------
  // 1️⃣ Cargar productos desde Supabase
  // ------------------------------------------------
  const cargarDatos = async () => {
    const productos = await productsAPI.getAll();
    if (!productos) return;

    // ------------------------------------------------
    // 2️⃣ Separar por comidas según hora de creación
    // ------------------------------------------------
    const desayuno: any[] = [];
    const almuerzo: any[] = [];
    const cena: any[] = [];

    productos.forEach((prod) => {
      const fechaReal = new Date(prod.created_at);
      const hora = fechaReal.getHours();

      if (hora < 12) desayuno.push(prod);
      else if (hora < 18) almuerzo.push(prod);
      else cena.push(prod);
    });

    // ------------------------------------------------
    // 3️⃣ Convertir product → alimento
    // ------------------------------------------------
    const mapToAlimento = (p: any) => ({
      nombre: p.name,
      calorias: Number(p.kcal || 0),
      proteina: Number(p.proteins || 0),
      carbohidratos: Number(p.carbohydrates || 0),
      grasas: Number(p.fats || 0),
    });

    const registros: RegistroComida[] = [
      {
        id: "1",
        comida: "Desayuno",
        hora: "08:00 AM",
        alimentos: desayuno.map(mapToAlimento),
      },
      {
        id: "2",
        comida: "Almuerzo",
        hora: "01:00 PM",
        alimentos: almuerzo.map(mapToAlimento),
      },
      {
        id: "3",
        comida: "Cena",
        hora: "07:30 PM",
        alimentos: cena.map(mapToAlimento),
      },
    ];

    setRegistrosDiarios(registros);

    // ------------------------------------------------
    // 4️⃣ Generar resumen semanal
    // ------------------------------------------------
    generarResumenSemanal(productos);
  };
  useFocusEffect(
    useCallback(() => {
      cargarDatos();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  // ------------------------------------------------
  // 5️⃣ Resumen semanal (solo kcal)
  // ------------------------------------------------
  const generarResumenSemanal = (productos: any[]) => {
    const dias: Record<
      string,
      {
        calorias: number;
        comidas: any[];
      }
    > = {};

    productos.forEach((p) => {
      const fecha = p.created_at.slice(0, 10);
      const kcal = Number(p.kcal || 0);

      if (!dias[fecha]) {
        dias[fecha] = { calorias: 0, comidas: [] };
      }

      dias[fecha].calorias += kcal;
      dias[fecha].comidas.push(p);
    });

    const resumen = Object.keys(dias).map((fecha) => ({
      nombre: new Date(fecha).toLocaleDateString("es-ES", {
        weekday: "long",
      }),
      fecha,
      calorias: dias[fecha].calorias,
      comidas: dias[fecha].comidas, // ⬅ AGREGADO
      cumplido: dias[fecha].calorias <= 2200,
    }));

    setResumenSemanal({
      semana: 1,
      año: new Date().getFullYear(),
      dias: resumen,
    });
  };

  // ------------------------------------------------
  // 6️⃣ Crear nuevo producto (alimento)
  // ------------------------------------------------
  const agregarProducto = async (producto: any) => {
    await productsAPI.create(producto);
    await cargarDatos();
  };

  // ------------------------------------------------
  // 7️⃣ Totales diarios
  // ------------------------------------------------
  const calcularTotales = (registros: RegistroComida[]) => {
    const totalCalorias = registros.reduce(
      (acc, comida) =>
        acc +
        comida.alimentos.reduce((sum, alimento) => sum + alimento.calorias, 0),
      0
    );

    const totalProteina = registros.reduce(
      (acc, comida) =>
        acc +
        comida.alimentos.reduce((sum, alimento) => sum + alimento.proteina, 0),
      0
    );

    return { totalCalorias, totalProteina };
  };

  return {
    registrosDiarios,
    resumenSemanal,
    calcularTotales,
    agregarProducto,
  };
};

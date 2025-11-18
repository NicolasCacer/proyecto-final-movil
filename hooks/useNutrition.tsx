import { RegistroComida, ResumenSemana } from "@/types/nutrition";
import { useState } from "react";

export const useNutrition = () => {
  // Datos de ejemplo para el diario
  const [registrosDiarios] = useState<RegistroComida[]>([
    {
      id: "1",
      comida: "Desayuno",
      hora: "08:30 AM",
      alimentos: [
        {
          nombre: "Avena con frutas",
          calorias: 350,
          proteina: 12,
          carbohidratos: 65,
          grasas: 8,
        },
        {
          nombre: "Huevos revueltos",
          calorias: 180,
          proteina: 15,
          carbohidratos: 2,
          grasas: 12,
        },
        {
          nombre: "Jugo de naranja",
          calorias: 110,
          proteina: 2,
          carbohidratos: 26,
          grasas: 0,
        },
      ],
    },
    {
      id: "2",
      comida: "Almuerzo",
      hora: "01:00 PM",
      alimentos: [
        {
          nombre: "Pechuga de pollo",
          calorias: 280,
          proteina: 53,
          carbohidratos: 0,
          grasas: 6,
        },
        {
          nombre: "Arroz integral",
          calorias: 215,
          proteina: 5,
          carbohidratos: 45,
          grasas: 2,
        },
        {
          nombre: "Ensalada mixta",
          calorias: 80,
          proteina: 3,
          carbohidratos: 12,
          grasas: 2,
        },
      ],
    },
    {
      id: "3",
      comida: "Cena",
      hora: "07:30 PM",
      alimentos: [
        {
          nombre: "Salmón a la plancha",
          calorias: 367,
          proteina: 40,
          carbohidratos: 0,
          grasas: 22,
        },
        {
          nombre: "Verduras al vapor",
          calorias: 95,
          proteina: 4,
          carbohidratos: 18,
          grasas: 1,
        },
      ],
    },
  ]);

  // Datos de ejemplo para la semana
  const [resumenSemanal] = useState<ResumenSemana>({
    semana: 1,
    año: 2024,
    dias: [
      { nombre: "Lunes", fecha: "2024-01-15", calorias: 2100, cumplido: true },
      { nombre: "Martes", fecha: "2024-01-16", calorias: 3000, cumplido: false },
      {
        nombre: "Miércoles",
        fecha: "2024-01-17",
        calorias: 2500,
        cumplido: false,
      },
      { nombre: "Jueves", fecha: "2024-01-18", calorias: 2200, cumplido: true },
      { nombre: "Viernes", fecha: "2024-01-19", calorias: 1800, cumplido: true },
      { nombre: "Sábado", fecha: "2024-01-20", calorias: 2400, cumplido: false },
      { nombre: "Domingo", fecha: "2024-01-21", calorias: 2000, cumplido: true },
    ],
  });

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
  };
};
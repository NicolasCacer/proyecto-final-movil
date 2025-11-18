export interface Alimento {
  nombre: string;
  calorias: number;
  proteina: number;
  carbohidratos?: number;
  grasas?: number;
}

export interface RegistroComida {
  id: string;
  comida: "Desayuno" | "Almuerzo" | "Merienda" | "Cena";
  hora: string;
  alimentos: Alimento[];
}

export interface ResumenDia {
  fecha: string;
  totalCalorias: number;
  totalProteina: number;
  totalCarbohidratos: number;
  totalGrasas: number;
  comidas: RegistroComida[];
}

export interface ResumenSemana {
  semana: number;
  año: number;
  dias: {
    nombre: string;
    fecha: string;
    calorias: number;
    cumplido: boolean;
  }[];
}
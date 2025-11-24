export type PlanType = 'monthly' | 'semester' | 'annual';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  originalPrice?: number;
  duration: string;
  discount?: string;
  features: string[];
  badge?: string;
  popular?: boolean;
}

export interface PaymentFormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  email: string;
}

export const PLANS: Plan[] = [
  {
    id: 'monthly',
    name: 'Plan Mensual',
    price: 29900,
    duration: '1 mes',
    features: [
      'Rutinas personalizadas con IA',
      'Chat con entrenador virtual',
      'Escaneo de alimentos',
      'Tracking de progreso',
      'Acceso a todos los ejercicios',
    ],
  },
  {
    id: 'semester',
    name: 'Plan Semestral',
    price: 149900,
    originalPrice: 179400,
    duration: '6 meses',
    discount: '17% OFF',
    popular: true,
    badge: 'Más Popular',
    features: [
      'Todo del plan mensual',
      'Entrenamientos en tiempo real',
      'Tracking de postura con IA',
      'Retos exclusivos',
      'Sin anuncios',
      'Soporte prioritario',
    ],
  },
  {
    id: 'annual',
    name: 'Plan Anual',
    price: 259900,
    originalPrice: 358800,
    duration: '12 meses',
    discount: '28% OFF',
    badge: 'Mejor Valor',
    features: [
      'Todo del plan semestral',
      'Planes nutricionales personalizados',
      'Análisis avanzado de métricas',
      'Descuentos en productos fitness',
      'Acceso anticipado a nuevas funciones',
      'Asesoría personalizada mensual',
    ],
  },
];
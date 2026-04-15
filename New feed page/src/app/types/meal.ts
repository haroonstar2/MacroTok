export interface MealData {
  breakfast: { calories: number; dish?: string };
  lunch: { calories: number; dish?: string };
  dinner: { calories: number; dish?: string };
}

export type MealType = 'breakfast' | 'lunch' | 'dinner';

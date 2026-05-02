/**
 * Recipe type definitions
 */

export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
}

export interface Ingredient {
  id: number;
  name: string;
  original: string;
  amount: number;
  unit: string;
}

export interface InstructionStep {
  number: number;
  step: string;
}

export interface AnalyzedInstruction {
  name: string;
  steps: InstructionStep[];
}

export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  level?: string;
  sourceUrl?: string;
  extendedIngredients: Ingredient[];
  analyzedInstructions: AnalyzedInstruction[];
  nutrition?: {
    nutrients: Nutrient[];
  };
  summary?: string;
}

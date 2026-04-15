/**
 * Recipe Store using Zustand
 * Manages recipe state and API calls
 */

import { create } from 'zustand';
import { Recipe } from '../types/recipe';

interface RecipeStore {
  recipe: Recipe | null;
  loading: boolean;
  error: string | null;
  getRandomRecipe: () => Promise<void>;
}

// Mock recipes data
const MOCK_RECIPES: Recipe[] = [
  {
    id: 1,
    title: "Grilled Chicken & Quinoa Bowl",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
    readyInMinutes: 25,
    servings: 2,
    level: "Easy",
    extendedIngredients: [
      { id: 1, name: "chicken breast", original: "2 chicken breasts", amount: 2, unit: "pieces" },
      { id: 2, name: "quinoa", original: "1 cup quinoa", amount: 1, unit: "cup" },
      { id: 3, name: "broccoli", original: "2 cups broccoli florets", amount: 2, unit: "cups" },
      { id: 4, name: "olive oil", original: "2 tablespoons olive oil", amount: 2, unit: "tablespoons" },
      { id: 5, name: "garlic", original: "3 cloves garlic, minced", amount: 3, unit: "cloves" },
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Cook quinoa according to package directions." },
          { number: 2, step: "Season chicken breasts with salt and pepper." },
          { number: 3, step: "Grill chicken for 6-7 minutes per side until cooked through." },
          { number: 4, step: "Steam broccoli until tender, about 5 minutes." },
          { number: 5, step: "Slice chicken and serve over quinoa with broccoli on the side." },
        ],
      },
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 450, unit: "kcal" },
        { name: "Protein", amount: 42, unit: "g" },
        { name: "Carbohydrates", amount: 35, unit: "g" },
        { name: "Fat", amount: 15, unit: "g" },
      ],
    },
  },
  {
    id: 2,
    title: "Salmon with Lemon Herb Butter",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
    readyInMinutes: 30,
    servings: 4,
    level: "Medium",
    extendedIngredients: [
      { id: 1, name: "salmon", original: "4 salmon fillets (6 oz each)", amount: 4, unit: "fillets" },
      { id: 2, name: "butter", original: "4 tablespoons unsalted butter", amount: 4, unit: "tablespoons" },
      { id: 3, name: "lemon", original: "2 lemons (juiced and zested)", amount: 2, unit: "whole" },
      { id: 4, name: "garlic", original: "3 cloves garlic, minced", amount: 3, unit: "cloves" },
      { id: 5, name: "fresh dill", original: "2 tablespoons fresh dill", amount: 2, unit: "tablespoons" },
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Pat salmon dry and season with salt and pepper." },
          { number: 2, step: "Heat oil in a skillet over medium-high heat." },
          { number: 3, step: "Cook salmon skin-side up for 4-5 minutes." },
          { number: 4, step: "Flip and cook another 3-4 minutes." },
          { number: 5, step: "Make butter sauce with garlic, lemon, and dill." },
          { number: 6, step: "Pour sauce over salmon and serve." },
        ],
      },
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 380, unit: "kcal" },
        { name: "Protein", amount: 34, unit: "g" },
        { name: "Carbohydrates", amount: 3, unit: "g" },
        { name: "Fat", amount: 26, unit: "g" },
      ],
    },
  },
  {
    id: 3,
    title: "Turkey Meatballs with Zoodles",
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800",
    readyInMinutes: 35,
    servings: 4,
    level: "Medium",
    extendedIngredients: [
      { id: 1, name: "ground turkey", original: "1 lb ground turkey", amount: 1, unit: "lb" },
      { id: 2, name: "zucchini", original: "4 medium zucchini, spiralized", amount: 4, unit: "pieces" },
      { id: 3, name: "marinara sauce", original: "2 cups marinara sauce", amount: 2, unit: "cups" },
      { id: 4, name: "parmesan", original: "1/2 cup grated parmesan", amount: 0.5, unit: "cup" },
      { id: 5, name: "basil", original: "1/4 cup fresh basil", amount: 0.25, unit: "cup" },
      { id: 6, name: "onion", original: "1 small onion, diced", amount: 1, unit: "piece" },
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Mix ground turkey with onion, garlic, and seasonings." },
          { number: 2, step: "Form mixture into 16 meatballs." },
          { number: 3, step: "Bake meatballs at 400°F for 20-25 minutes." },
          { number: 4, step: "Spiralize zucchini into noodles." },
          { number: 5, step: "Heat marinara sauce and add cooked meatballs." },
          { number: 6, step: "Serve meatballs and sauce over zoodles with parmesan." },
        ],
      },
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 320, unit: "kcal" },
        { name: "Protein", amount: 35, unit: "g" },
        { name: "Carbohydrates", amount: 18, unit: "g" },
        { name: "Fat", amount: 12, unit: "g" },
      ],
    },
  },
  {
    id: 4,
    title: "Greek Yogurt Parfait with Berries",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800",
    readyInMinutes: 10,
    servings: 2,
    level: "Easy",
    extendedIngredients: [
      { id: 1, name: "greek yogurt", original: "2 cups Greek yogurt", amount: 2, unit: "cups" },
      { id: 2, name: "mixed berries", original: "1 cup mixed berries", amount: 1, unit: "cup" },
      { id: 3, name: "granola", original: "1/2 cup granola", amount: 0.5, unit: "cup" },
      { id: 4, name: "honey", original: "2 tablespoons honey", amount: 2, unit: "tablespoons" },
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Layer Greek yogurt in glasses or bowls." },
          { number: 2, step: "Add a layer of mixed berries." },
          { number: 3, step: "Sprinkle granola on top." },
          { number: 4, step: "Drizzle with honey and serve immediately." },
        ],
      },
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 280, unit: "kcal" },
        { name: "Protein", amount: 20, unit: "g" },
        { name: "Carbohydrates", amount: 38, unit: "g" },
        { name: "Fat", amount: 6, unit: "g" },
      ],
    },
  },
];

const useRecipesStore = create<RecipeStore>((set) => ({
  recipe: null,
  loading: false,
  error: null,

  getRandomRecipe: async () => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Get random recipe from mock data
      const randomIndex = Math.floor(Math.random() * MOCK_RECIPES.length);
      const randomRecipe = MOCK_RECIPES[randomIndex];
      
      set({ recipe: randomRecipe, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load recipe',
        loading: false 
      });
    }
  },
}));

export default useRecipesStore;

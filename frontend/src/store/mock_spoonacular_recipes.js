export const MOCK_SPOONACULAR_RECIPES = [
  {
    id: 101001,
    title: "Grilled Chicken Bowl",
    image: "https://spoonacular.com/recipeImages/101001-556x370.jpg",
    readyInMinutes: 25,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 430 },
        { name: "Protein", amount: 42 },
        { name: "Carbohydrates", amount: 38 },
        { name: "Fat", amount: 14 },
      ],
    },
    extendedIngredients: [
      { id: 1, original: "1 lb chicken breast" },
      { id: 2, original: "1 cup cooked rice" },
      { id: 3, original: "1 tbsp olive oil" },
      { id: 4, original: "1 tsp garlic powder" },
      { id: 5, original: "1/2 cup mixed vegetables" },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Season chicken with garlic powder and salt." },
          { number: 2, step: "Heat oil in a skillet and cook chicken until browned." },
          { number: 3, step: "Add vegetables and cook for 3 more minutes." },
          { number: 4, step: "Serve chicken and vegetables over rice." },
          { number: 5, step: "Serve chicken and vegetables over rice." },
          { number: 6, step: "Serve chicken and vegetables over rice." },
          { number: 7, step: "Serve chicken and vegetables over rice." },
        ],
      },
    ],
  },

  {
    id: 101002,
    title: "Beef Stir Fry",
    image: "https://spoonacular.com/recipeImages/101002-556x370.jpg",
    readyInMinutes: 20,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 510 },
        { name: "Protein", amount: 36 },
        { name: "Carbohydrates", amount: 45 },
        { name: "Fat", amount: 21 },
      ],
    },
    extendedIngredients: [
      { id: 11, original: "8 oz sliced beef" },
      { id: 12, original: "1 bell pepper, sliced" },
      { id: 13, original: "1 tbsp soy sauce" },
      { id: 14, original: "1 tbsp sesame oil" },
      { id: 15, original: "1 cup broccoli florets" },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Heat sesame oil in a pan." },
          { number: 2, step: "Add beef and cook until browned." },
          { number: 3, step: "Add broccoli and bell pepper and stir fry 5 minutes." },
          { number: 4, step: "Add soy sauce and cook 1 minute more." },
        ],
      },
    ],
  },

  {
    id: 101003,
    title: "Turkey Pasta",
    image: "https://spoonacular.com/recipeImages/101003-556x370.jpg",
    readyInMinutes: 30,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 620 },
        { name: "Protein", amount: 48 },
        { name: "Carbohydrates", amount: 70 },
        { name: "Fat", amount: 16 },
      ],
    },
    extendedIngredients: [
      { id: 21, original: "8 oz ground turkey" },
      { id: 22, original: "2 cups cooked pasta" },
      { id: 23, original: "1 cup marinara sauce" },
      { id: 24, original: "1 tsp Italian seasoning" },
      { id: 25, original: "1 tbsp olive oil" },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Heat olive oil in a skillet." },
          { number: 2, step: "Cook ground turkey until browned." },
          { number: 3, step: "Add marinara sauce and seasoning; simmer 5 minutes." },
          { number: 4, step: "Stir in cooked pasta and serve warm." },
        ],
      },
    ],
  },

  {
    id: 101004,
    title: "Greek Yogurt Parfait",
    image: "https://spoonacular.com/recipeImages/101004-556x370.jpg",
    readyInMinutes: 5,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 280 },
        { name: "Protein", amount: 22 },
        { name: "Carbohydrates", amount: 32 },
        { name: "Fat", amount: 8 },
      ],
    },
    extendedIngredients: [
      { id: 31, original: "1 cup Greek yogurt" },
      { id: 32, original: "1/2 cup granola" },
      { id: 33, original: "1/2 cup mixed berries" },
      { id: 34, original: "1 tsp honey" },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Layer Greek yogurt in a bowl or glass." },
          { number: 2, step: "Top with berries and granola." },
          { number: 3, step: "Drizzle honey on top and serve." },
        ],
      },
    ],
  },
];

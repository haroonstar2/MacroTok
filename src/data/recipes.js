// src/data/recipes.js
// ------------------------------------------------------------
// Static recipe dataset used by Feed.jsx and RecipeDetail.jsx.
// Each recipe object contains:
//   - id:          unique string used in routing (/recipe/:id)
//   - title:       display name of the recipe
//   - img:         image URL for card and detail views
//   - time:        estimated cooking/prep time (minutes)
//   - calories:    total calories per serving
//   - protein:     grams of protein per serving
//   - carbs:       grams of carbohydrates per serving
//   - fats:        grams of fats per serving
//   - level:       difficulty label ("Easy", "Medium", "Hard")
//   - ingredients: string list of ingredients
//   - steps:       ordered instructions for cooking/preparation
// ------------------------------------------------------------

export const RECIPES = [
  {
    // Unique identifier used for navigation and lookups
    id: "grilled-chicken-salad-fruit",

    // Display title in feed cards and detail page
    title: "Grilled Chicken Salad with Seasonal Fruit",

    // Card and detail image
    img: "https://www.allrecipes.com/thmb/YwjKMwHsgrH0zHYwzXnpIgLERFg=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/14186grilled-chicken-salad-with-seasonal-fruitMyHotSouthernMessvideo4x3-f5a19d6ca2454588b6117e54c30e2d93.jpg",

    // Nutrition and time metadata
    time: 30,
    calories: 468,
    protein: 52,
    carbs: 35,
    fats: 15,

    // Difficulty tag used by DifficultyTag component
    level: "Medium",

    // Ingredient list shown on the detail page
    ingredients: [
      "2 chicken breasts",
      "Mixed lettuce",
      "Strawberries (sliced)",
      "Pecans",
      "Olive oil",
      "Salt",
      "Pepper",
      "Red wine vinegar",
      "Sugar",
      "Vegetable oil",
      "Onion",
      "Mustard",
    ],

    // Ordered cooking steps shown in RecipeDetail
    steps: [
      "Preheat grill to high heat and lightly oil the grate.",
      "Grill chicken ~8 min per side until juices run clear. Cool and slice.",
      "Toast pecans in a dry skillet over medium-high heat, stirring, ~8 min.",
      "Blend dressing: red wine vinegar, sugar, vegetable oil, onion, mustard, salt, pepper.",
      "Arrange lettuce; top with chicken, strawberries, pecans. Drizzle with dressing.",
    ],
  },

  {
    id: "high-protein-broccoli-cheddar-soup",
    title: "High Protein Broccoli Cheddar Soup",
    img: "https://www.allrecipes.com/thmb/GiaXx_OGXO0Oo_yhaLWpKW8YTtQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11706191_High-Protein-Broccoli-Cheddar-Soup_Nicole-Russell_4x3-e2eaaaf242a149de950b3dc0b066833c.jpg",

    time: 30,
    calories: 476,
    protein: 28,
    carbs: 41,
    fats: 24,
    level: "Medium",

    ingredients: [
      "2 tablespoons butter",
      "1 yellow onion, chopped",
      "1 large carrot, chopped",
      "1 stalk celery, chopped",
      "2 cloves garlic",
      "1 (15.5 ounce) can navy beans, drained",
      "4 cups chicken broth",
      "1 ½ pounds broccoli, chopped",
      "1 teaspoon paprika",
      "1 teaspoon salt or to taste",
      "1/2 teaspoon freshly ground black pepper",
      "1 cup full-fat cottage cheese (small or large curd)",
      "1 ½ cups shredded Cheddar cheese",
    ],

    steps: [
      "Melt butter in a large stockpot over medium heat. Add onion, carrot, and celery. Cook for 8 minutes. Add garlic and cook 2 minutes more. Add beans, broth, broccoli, paprika, salt, and pepper. Simmer for 10 minutes.",
      "Turn heat off; ladle about 1 ½ cups of soup into a blender. Let cool for 10 minutes. This cooling step is important for blending cottage cheese.",
      "Add cottage cheese to blender; blend until smooth. Return mixture to the stockpot; turn heat back on to low. Add Cheddar cheese and stir until melted and soup is thickened. Ladle into bowls and serve.",
    ],
  },

  {
    id: "juicy-grilled-chicken-breasts",
    title: "Juicy Grilled Chicken Breasts",
    img: "https://www.allrecipes.com/thmb/63Xg9YuEJCfuAKj99tMblgLhPgI=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/16160-juicy-grilled-chicken-breasts-ddmfs-5594-hero-3x4-902673c819994c0191442304b40104af.jpg",

    time: 1,          // in minutes (displayed as ⏱ time min in Feed/Detail)
    calories: 139,
    protein: 27,
    carbs: 3,
    fats: 2,

    // This value is read as a difficulty label by the UI
    level: "High",

    ingredients: [
      "4 skinless, boneless chicken breast halves",
      "¼ cup lemon juice, plus wedges for serving",
      "¼ cup olive oil",
      "2 teaspoons dried oregano or parsley",
      "1 teaspoon seasoning salt",
      "½ teaspoon ground black pepper",
      "½ teaspoon onion powder",
    ],

    steps: [
      "Gather the ingredients.",
      "Preheat an outdoor grill for medium-high heat, and lightly oil the grate.",
      "Working with one chicken breast at a time, place chicken breast between two sheets of plastic wrap or parchment paper on a cutting board. Using a meat mallet or a rolling pin, gently pound each breast to 1/2-inch thickness.",
      "Add lemon juice, olive oil, dried oregano or parsley, seasoning salt, black pepper, and onion powder to a large zip-top bag; add chicken and press out as much air as possible before sealing bag. Gently massage chicken to distribute marinade. Marinate chicken in the refrigerator for at least 30 minutes or up to 12 hours.",
      "Preheat grill to medium-high and lightly oil the grate.",
      "Place chicken breasts, smooth-side down on preheated grill; cook, covered, until no longer pink and juices run clear, about 5 minutes per side.",
      "Transfer chicken to a cutting board and tent with aluminum foil. Let rest 5 minutes.",
      "Serve with lemon wedges.",
    ],
  },

  {
    id: "raspberry-blackberry-smoothie",
    title: "Raspberry Blackberry Smoothie",
    img: "https://www.allrecipes.com/thmb/acq332wC39oqfl9oBHYMHqxVMQk=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Raspberry-Blackberry-Smoothie-2000-3a85c58ac97d4c02897d155ff718288a.jpg",

    time: 10,
    calories: 195,
    protein: 6,
    carbs: 43,
    fats: 2,
    level: "Easy",

    ingredients: [
      "1 small banana",
      "½ cup blackberries",
      "1 cup fresh raspberries",
      "1 (6 ounce) container vanilla yogurt",
      "1 tablespoon honey",
      "4 ice cubes",
    ],

    steps: [
      "Place banana, blackberries, raspberries, yogurt, honey, and ice cubes into a blender. Blend until smooth.",
    ],
  },
];

import { createBrowserRouter } from "react-router";
import Feed from "./feed/Feed";
import RecipeDetail from "./recipes/RecipeDetail";
import MealPlan from "./components/MealPlan";
import RandomRecipe from "./components/RandomRecipe";
import Layout from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Feed,
      },
      {
        path: "feed",
        Component: Feed,
      },
      {
        path: "recipe/:id",
        Component: RecipeDetail,
      },
      {
        path: "meal-plan",
        Component: MealPlan,
      },
      {
        path: "random",
        Component: RandomRecipe,
      },
    ],
  },
]);

# MacroTok

MacroTok is a React-based Nutrition and Wellness app that is designed to organize, streamline, and assist you in meeting your goals.

Trying to cut weight? Maybe you're trying to gain weight? Or maybe you just want to find an easier way to eat healthier and cut out fast food. MacroTok allows you to find recipes that best fit your needs. Once you find the right recipe, you can favorite it to save it for later, or save it straight to our built in calender to organize and perfect your meal plan.

# Tech Stack

    - Front End
        React 18
        Vite
        Plain CSS and Tailwind

    - Back End
        Spoonacular API for recipes
        Firebase for user, recipe storage, and account auth
        JavaScript XML

[Test Case Document](https://docs.google.com/spreadsheets/d/11eN6jlCc2WGbhi0SdFV2t9eHWWzdylhxalVzqCzvMi0/edit?usp=sharing)

### Quick Start

For quick testing, the webpage is currently being hosted on https://macro-tok.vercel.app/

For file - and development build testing (assuming npm is installed)

```bash
cd frontend
npm install
npm run dev
```

## Landing Page

This is the "welcome page". Here is the first impression for the website, meant to introduce the user to some of the things the website will do. The user will see:

- A clean welcome page that features a rotating food image to give them an example of what they will see.
- Tiles lie towards the bottom of the page, highlighting some of the features the website has
- Buttons that allow users to create an account
  - Users can like recipes and save recipes to their calendar

```Files
    /frontend/src/app/landing/Landing.jsx
    /frontend/src/app/landing/Landing.css
```

## Side Bar

This is the navigation for each page of the website. The sidebar persists from page to page. Buttons navigate to:

- Home/Feed
- Meal Plan
- Liked Recipes
- Profile settings

```Files
    /frontend/src/app/sidebar/Sidebar.jsx
    /frontend/src/app/sidebar/sidebar.css
```

## Feed Page

The feed page is where users can find a rotating set of recipes. Users can like a post to save it for later and schedule a meal in a calendar. Here they will see:

- A scrolling page of Recipe Cards that give the name, recipe photo, calorie count, cook time, recipe difficulty, and macros.
  - Hovering over the card will trigger a responsive, hover animation.
- Like and Calendar buttons.
  - Liking a recipe will save it for later, where users can go to find all their favorite recipes.
  - The calendar button will activate a pop-up. This popup shows allows the user to choose a day, month, and year to schedule their desired meals, as well as a time slot so they can choose to have it for.
- A search bar that will allow users to use keywords to find specific recipes

```Files
    /frontend/src/app/feed/Feed.jsx
    /frontend/src/app/feed/Feed.css
```

## Calender & Goal Tracker

This page is where users will be able to see their meal plan. Here they can find:

- A calendar with 2 different viewing options, monthly and weekly.
  - The monthly option shows every day for the month with colored blips on the days, corresponding to the meals users have planned
- Clicking on the day will bring up a small menu on the right-hand side
- The menu shows a small, but detailed breakdown of the meals

Switching to a weekly page will shorten the information feed down to 4 rows of 7 columns.

- The top row represents the days and dates of the week.
- The rest of the rows will show the meals the user has saved, showing their planned breakfast, lunch, and dinner.
- Selecting the days will show the meals that users have saved for that specific date.

```Files
    /frontend/src/app/calendar/Calendar.jsx
    /frontend/src/app/calendar/calendar.css
```

## Recipe Page

On the feed page, clicking a recipe will navigate here. Users will see:

- Recipe name
- Recipe image
- Cooking time
- Step-by-step instructions
- A drop-down menu that allows users to change the serving size of the recipe.
  - Changing the serving size will dynamically change the amount of ingredients needed for the recipe.
- Check boxes lie next to the ingredients. This allows users to mark what they need and save it to a shopping list.

```Files
    src/components/Sidebar.jsx
    src/components/sidebar.css
```

## List Page

This page is where the user can see the items they have saved for a shopping list. -

Project Structure

    backend/
        ├── api/
            └── route.js
        ├── src/
             ├── App.js
             ├── Class.js

    frontend/
        ├──src/
        │   ├── App.jsx
        │   ├── App.css
        │   ├── api/
        │   │    ├── calender.js
        │   │    ├── client.js
        │   │    ├── config.js
        │   │    ├── recipeAPI.js
        │   │    └── goal.ts
        │   ├── app
        │   │    ├── (auth)
        │   │    ├── calender
        │   │    ├── feed
        │   │    ├── landing
        │   │    ├── login
        │   │    ├── profile
        │   │    ├── recipes
        │   │    ├── bot
        │   │    ├── shopping
        │   │    └── sidebar
        │   ├── store
        │   │    ├── actual_spoonacular_recipes.js
        │   │    └── recipeStore.js
        ├── global.css
        ...

## CHANGES MADE FROM JAN - MAY

- App is hosted on Vercel and accessible from any web browser
- Complete UI Overhaul to the following pages
  - Calender
  - Feed
  - Recipe
  - Landing pages
- New pages
  - The List Page: designed to allow the user to mark ingredients that they do not have at home, and save them to a shopping list.
  - The Chat Bot: A little bot that can help the user find meals that are right for them. They can ask questions or give examples of meals that they are looking for.
- Improved functionality of the landing page buttons:
  - Some buttons had routing issues, or some did not have any uses. The team overhauled all the buttons on the landing page.
- Prompt the user to make an account before accessing the feed, calendar, and other parts of the webapp.
  - Users can save their recipes and not lose any information they want to save.
- Improvements to settings logic
  - Giving the user freedom to change profile info, change preferences, and even delete their account.
- Improvements to the feed page
  - Users receive a randomized selection of recipes daily. This keeps the web app fresh and interesting for both new and old users.
- Improvements to storage for recipes
  - Recipes now get stored in cache. This helps shorten load times when accessing the feed and the recipe page.
- Stronger security and authentication
  - SMS verification for existing accounts. When the user attempts to log in, they will receive a code to their phones for 2-factor authentication
- Improved quality for the user
  - Added the ability to like and unlike recipes to store recipes in a "liked" page
  - Added the ability to add recipes to the calendar with a specific date and for what meal it would belong to (i.e., breakfast, lunch, or dinner)
  - Added the ability to remove recipes from the calendar
  - Profile picture upload
  - Account deactivation and deletion
  - Notifications
  - Password Reset

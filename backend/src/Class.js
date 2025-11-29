 import fs from "fs";

class Tiles {
   constructor(recipeName, imageData = null) {
      this.nutrition = new Map(); //hashmap that will take the macro, and nutritional value
      this.recipe = recipeName; //string for recipe name
      this.imageData = imageData; //image of the recipe
      this.ingredients = []; //list of ingredients
      this.steps = []; //steps to cook the food
   }
   addNutriValue(macro, value) { //adding to the hashmap
      this.nutrition.set(macro, value);
   }

   addIngredients(item) { //adding to ingredients list
      this.ingredients.push(item)
    }

   addSteps(step) { //adding to the recipe steps
      this.steps.push(step);
    }

   setImage(picture) { //hopefully getting the image for the recipe
      this.imageData = picture;
    }

    saveImage(fileName) { //to store image data just for tile testing
        if (!this.imageData) {
            console.log("Error: no image to load");
            return;
        }
        fs.writeFilsync(fileName, this.imageData);
        console.log(`image saved to ${fileName}`);
    }

//getting and storing image data from a URL for testing purposes
  static async fetchImage(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`cant fetch image: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

// Creating the TILE data from the API
   static async fromSpoonacular(recipeID, apiKey) {
    const url = new URL(`https://api.spoonacular.com/recipes/${recipeID}/information`); //searching the URL for recipes
    url.searchParams.set("apiKey", apiKey); //sets the API key to run the function
    url.searchParams.set("includeNutrition", "true"); //seachees the params to fill the class

    const response = await fetch(url); //error checking
    if (!response.ok) {
        throw new Error(`Faild to get recipe data from API: ${response.status}`);
    }
    
    const data = await response.json(); //speaks for itself
    const tile = new Tiles(data.recipeName); //starting to store the data in the class vars
    
    if (Array.isArray(data.extendedIngredients)) { //checking if we are passing an array
        data.extendedIngredients.forEach( ing => { 
            tile.addIngredients(ing.original); //input ingredients into class var
        });
    }
    if (Array.isArray(data.analyzedInstructions) && data.analyzedInstructions.length > 0) { //again
        data.analyzedInstructions[0].steps.forEach(stepObj  => { 
            tile.addSteps(stepObj.step); //putting steps into class vector
    });
}
    if (data.nutrition && Array.isArray(data.nutrition.nutrients)) { //again
        data.nutrition.nutrients.forEach(
            nutr => { //just as above
                const name = nutr.name;
                const amount = nutr.amount;
                tile.addNutriValue(name, amount);
            });
        }
    if (data.image) { //image??????
        const imageBuffer = await Tiles.fetchImage(data.image); //just as above
        tile.setImage(imageBuffer);
    }
    return tile;
  }
}

(async () => {
    try {
        const apiKey = "242b2785b76948bcaff0bb905055a100"; //getting the values from the API itself and error checking
        const recipeID = " ";

        const tileData = await Tiles.fromSpoonacular(recipeID, apiKey);

        console.log("data gathered properly");
        console.log(tileData);

        if (tileData.imageData) {
            tileData.saveImage("recipe-image.jpg");
        }
    }
    catch (error) {
        console.error(error.message);
    }

    console.log(tileData);
});

export default Tiles; //exporting to be able to test the code
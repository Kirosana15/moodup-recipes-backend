import RecipeService from "../services/recipeService";

const recipeService = new RecipeService();

// RecipeController class for recipe related requests
class RecipeController {
    // Returns a list of all recipes
    public async getAllRecipes(req: any, res: any) {
        recipeService.getAllRecipes(req.query.page, req.query.limit)
            .then((recipes: any) => {
                res.status(200).send(recipes);
            }).catch((err: any) => {
                res.status(400).send(err);
            }
        );
    }
    // Returns a recipe with provided id
    public async getRecipe(req: any, res: any) {
        recipeService.getRecipe(req.params.id)
            .then((recipe: any) => {
                console.log(recipe)
                res.status(200).send(recipe);
            }).catch((err: any) => {
                res.status(400).send(err);
            }
        );
    }
    // Returns a list of all recipes for logged in user
    public async getRecipesByOwner(req: any, res: any) {
        recipeService.getRecipesByOwner(req.user.id, req.query.page, req.query.limit)
            .then((recipes: any) => {
                res.status(200).send(recipes);
            }).catch((err: any) => {
                res.status(400).send(err);
            }
        );
    }
    // Creates a new recipe
    public async createRecipe(req: any, res: any) {
        recipeService.createRecipe(req.user.id, req.body.title, req.body.body)
            .then((recipe: any) => {
                res.status(201).send(recipe);
            }).catch((err: any) => {
                res.status(400).send(err);
            }
        );
    }
    // Updates body of a recipe with provided id if the user is the owner or an admin
    public async updateRecipe(req: any, res: any) {
        recipeService.updateRecipe(req.params.id, req.body.body)
            .then((recipe: any) => {
                if (recipe) {
                    if (recipe.ownerId.toString() === req.user.id || req.user.isAdmin) {
                        res.status(200).send(recipe);
                    } else {
                        res.status(403).send("Unauthorized");
                    }
                } else {
                    res.status(404).send("Recipe not found");
                }
            }).catch((err: any) => {
                res.status(400).send(err);
            }
        );
    }
    // Deletes a recipe with provided id if the user is the owner or an admin
    public async removeRecipe(req: any, res: any) {
        const recipe = await recipeService.getRecipe(req.params.id);
        if (recipe) {
            if (recipe.ownerId.toString() === req.user.id || req.user.isAdmin) {
                recipeService.removeRecipe(req.params.id)
                    .then((recipe: any) => {
                        res.status(200).send(recipe);
                    }).catch((err: any) => {
                        res.status(400).send(err);
                    }
                );
            } else {
                res.status(403).send("Unauthorized");
            }
        } else {
            res.status(404).send("Recipe not found");
        }
    }
    // Returns a list of recipes satisfying the search query in the title
    public async searchRecipes(req: any, res: any) {
        recipeService.getRecipesByTitle(req.params.query, req.query.page, req.query.limit)
            .then((recipes: any) => {
                res.status(200).send(recipes);
            }).catch((err: any) => {
                res.status(400).send(err);
            }
        );
    }
}

export default RecipeController;
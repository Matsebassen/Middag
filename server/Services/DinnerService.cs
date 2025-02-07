using Microsoft.EntityFrameworkCore;
using MiddagApi.Models;

namespace MiddagApi.Services;

public class DinnerService(DinnerContext context) : IDinnerService
{
    public async Task<IEnumerable<DinnerItem>> GetAllDinnersAsync()
    {
        var dinners = await context.DinnerItems
            .Include(d => d.Ingredients)
            .ThenInclude(i => i.Ingredient)
            .AsNoTracking()
            .ToListAsync();;
        
        return dinners;
    }

    public async Task<DinnerItem?> GetDinnerAsync(long id)
    {
        var dinner = await context.DinnerItems
            .Include(d => d.Ingredients)
            .ThenInclude(i => i.Ingredient)
            .AsNoTracking()
            .SingleOrDefaultAsync(d => d.ID == id);
        return dinner;
    }

    public async Task<IEnumerable<DinnerItem>> GetDinnersAsync(string search)
    {
        var dinners = await context.DinnerItems
            .Include(d => d.Ingredients)
            .ThenInclude(i => i.Ingredient)
            .Where(d => d.Name.Contains(search) ||
                        d.Ingredients.Any(i => i.Ingredient.Name.Contains(search)))
            .ToListAsync();
        return dinners;
    }

    public async Task<DinnerItem?> UpdateDinnerAsync(DinnerItem dinnerItem)
    {
        var dinner = await context.DinnerItems
            .Include(d => d.Ingredients)
            .ThenInclude(ri => ri.Ingredient) // Ensure Ingredient is loaded to avoid EF tracking issues
            .FirstOrDefaultAsync(d => d.ID == dinnerItem.ID);

        if (dinner == null)
        {
            return null;
        }

        // Step 1: Remove RecipeItems that no longer exist in the updated dinnerItem
        var deletedRecipeItems = dinner.Ingredients
            .Where(existing => dinnerItem.Ingredients.All(updated => updated.ID != existing.ID))
            .ToList();

        context.RecipeItem.RemoveRange(deletedRecipeItems); // More efficient way to remove items

        // Step 2: Update existing RecipeItems or add new ones
        var updatedIngredients = new List<RecipeItem>();

        foreach (var recipeItem in dinnerItem.Ingredients)
        {
            var existingItem = dinner.Ingredients.FirstOrDefault(i => i.ID == recipeItem.ID);

            if (existingItem == null)
            {
                // New RecipeItem - ensure it's properly attached
                var newRecipeItem = new RecipeItem
                {
                    ID = recipeItem.ID,
                    Unit = recipeItem.Unit,
                    Qty = recipeItem.Qty,
                    Ingredient = await GetIngredientItem(recipeItem.Ingredient?.Name)
                };
                updatedIngredients.Add(newRecipeItem);
            }
            else
            {
                // Existing RecipeItem - update properties
                existingItem.Unit = recipeItem.Unit;
                existingItem.Qty = recipeItem.Qty;
                existingItem.Ingredient = await GetIngredientItem(recipeItem.Ingredient?.Name);
                context.Attach(existingItem.Ingredient); // Ensure EF knows about it
                updatedIngredients.Add(existingItem);
            }
        }

        // Step 3: Assign updated ingredients list
        dinner.Ingredients = updatedIngredients;

        // Step 4: Update dinner properties
        dinner.Name = dinnerItem.Name;
        dinner.PicUrl = dinnerItem.PicUrl;
        dinner.Portions = dinnerItem.Portions;
        dinner.Tags = dinnerItem.Tags;
        dinner.Url = dinnerItem.Url;

        await context.SaveChangesAsync();
        return dinner;
    }

    public async Task<DinnerItem?> CreateDinnerAsync(DinnerItem dinnerItem)
    {
        if (dinnerItem.Ingredients != null)
        {
            var ingredientsList = dinnerItem.Ingredients.ToList(); // Convert to List

            foreach (var recipeItem in ingredientsList)
            {
                if (recipeItem.Ingredient != null)
                {
                    var ingredientName = recipeItem.Ingredient.Name;
                    var ingredientItem = await context.IngredientItem.FirstOrDefaultAsync(i => i.Name == ingredientName);
                    if (ingredientItem != null)
                    {
                        recipeItem.Ingredient = ingredientItem;
                    }
                }
            }
            dinnerItem.Ingredients = ingredientsList;
        }
        var dinner = await context.DinnerItems.AddAsync(dinnerItem);
        await context.SaveChangesAsync();
        return dinner.Entity;
    }

    public async Task<bool> DeleteDinnerAsync(long id)
    {
        var dinnerItem = await context.DinnerItems.FindAsync(id);
        if (dinnerItem == null)
        {
            return false;
        }

        context.DinnerItems.Remove(dinnerItem);
        await context.SaveChangesAsync();
        return true;
    }
    
    private async Task<IngredientItem> GetIngredientItem(string name)
    {
        var ingredient = await context.IngredientItem
            .FirstOrDefaultAsync(i => i.Name == name);
        if (ingredient != null)
        {
            // Update to existing ingredient
            return ingredient;
        }

        // Create a new ingredient
        var ingredientItem = new IngredientItem();
        ingredientItem.Name = name;
        var newIngredient = await context.IngredientItem.AddAsync(ingredientItem);
        await context.SaveChangesAsync(); // Ensure it's saved so EF assigns an ID
        return newIngredient.Entity;
    }
}
using Microsoft.EntityFrameworkCore;
using MiddagApi.Models;

namespace MiddagApi.Services;

public class DinnerService(DinnerContext context) : IDinnerService
{
    public async Task<IEnumerable<DinnerItem>> GetAllDinnersAsync()
    {
        var dinners = await context.DinnerItems
            .Include(d => d.ingredients)
            .AsNoTracking()
            .ToListAsync();;
        
        return dinners;
    }

    public async Task<DinnerItem?> GetDinnerAsync(string id)
    {
        var dinner = await context.DinnerItems
            .Include(d => d.ingredients)
            .AsNoTracking()
            .SingleOrDefaultAsync(d => d.id == id);
        return dinner;
    }

    public async Task<IEnumerable<DinnerItem>> GetDinnersAsync(string search)
    {
        var searchUpper = search.ToUpper();
        var dinners = await context.DinnerItems
            .Include(d => d.ingredients)
            .Where(d => d.name.ToUpper().Contains(searchUpper) ||
                        d.ingredients.Any(i => i.name.ToUpper().Contains(searchUpper)))
            .ToListAsync();
        return dinners;
    }

    public async Task<DinnerItem?> UpdateDinnerAsync(DinnerItem dinnerItem)
    {
        var dinner = await context.DinnerItems
            .FirstOrDefaultAsync(d => d.id == dinnerItem.id);

        if (dinner == null)
        {
            return null;
        }
        
        foreach (var ingredient in dinnerItem.ingredients)
        {
            ingredient.id ??= Guid.NewGuid().ToString();
        }

        // Step 4: Update dinner properties
        dinner.name = dinnerItem.name;
        dinner.picUrl = dinnerItem.picUrl;
        dinner.portions = dinnerItem.portions;
        dinner.tags = dinnerItem.tags;
        dinner.url = dinnerItem.url;
        dinner.ingredients = dinnerItem.ingredients;


        await context.SaveChangesAsync();
        return dinner;
    }

    public async Task<DinnerItem?> CreateDinnerAsync(DinnerItem dinnerItem)
    {
     
        dinnerItem.id = Guid.NewGuid().ToString();
        foreach (var ingredient in dinnerItem.ingredients)
        {
            ingredient.id = Guid.NewGuid().ToString();
        }
        var dinner = await context.DinnerItems.AddAsync(dinnerItem);
        await context.SaveChangesAsync();
        return dinner.Entity;
    }

    public async Task<bool> DeleteDinnerAsync(string id)
    {
        var dinnerItem = await context.DinnerItems.FirstOrDefaultAsync(d => d.id == id);
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
            .FirstOrDefaultAsync(i => i.name == name);
        if (ingredient != null)
        {
            // Update to existing ingredient
            return ingredient;
        }

        // Create a new ingredient
        var ingredientItem = new IngredientItem();
        ingredientItem.name = name;
        var newIngredient = await context.IngredientItem.AddAsync(ingredientItem);
        await context.SaveChangesAsync(); // Ensure it's saved so EF assigns an ID
        return newIngredient.Entity;
    }
}
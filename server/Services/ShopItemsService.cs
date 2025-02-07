using Mapster;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MiddagApi.Controllers;
using MiddagApi.Models;

namespace MiddagApi.Services;

public class ShopItemsService(DinnerContext context, IHubContext<NotificationHub> _hubContext) : IShopItemsService
{
    public async Task<IEnumerable<ShopItem>> GetShopItemsAsync(long categoryId)
    {
        var shopItems= await context.ShopItems.Include(item => item.Category)
            .Include(item => item.Ingredient)
            .ThenInclude(ingredient => ingredient.ingredientType)
            .Where(item => item.Category != null && item.Category.ID == categoryId)
            .ToListAsync();
        return shopItems;
    }

    public async Task<IEnumerable<IngredientType>> GetIngredientTypesAsync()
    {
        return await context.IngredientTypes.OrderBy(i => i.order)
            .ToListAsync();
    }

    public async Task<IngredientItem?> UpdateIngredientTypeAsync(long ingredientId, long ingredientTypeId)
    {
        var ingredientItem = await context.IngredientItem.FindAsync(ingredientId);
        if (ingredientItem == null)
        {
            return null;
        }
        var ingredientType = await context.IngredientTypes.FindAsync(ingredientTypeId);

        if (ingredientType == null)
        {
            return null;
        }
        ingredientItem.ingredientType = ingredientType;
        await context.SaveChangesAsync();
        return ingredientItem;
    }

    public async Task<ShopItemResponse?> UpdateShopItemAsync(long id, ShopItemResponse item)
    {
        var shopItem = await context.ShopItems
            .Include(s => s.Ingredient)
            .ThenInclude(i => i.ingredientType)
            .FirstOrDefaultAsync(s => s.ID == id);
            
        if (shopItem is null)
        {
            return null;
        }
        shopItem.Description = item.Description;
        shopItem.RecentlyUsed = item.RecentlyUsed;
            
        await context.SaveChangesAsync();
        var response = shopItem.Adapt<ShopItemResponse>();
        await _hubContext.Clients.All.SendAsync("ToggleShopItem", response);

        return response;
    }

    public async Task<ShopItemResponse?> ToggleShopItemAsync(long id)
    {
        var shopItem = await context.ShopItems
            .Include(item => item.Category)
            .Include(item => item.Ingredient)
            .ThenInclude(i => i.ingredientType)
            .SingleOrDefaultAsync(i => i.ID == id);
        
        if (shopItem == null)
        {
            return null;
        }

        if (shopItem.RecentlyUsed > 0)
        {
            shopItem.RecentlyUsed = 0;
        }
        else
        {
            // Find next number for recentlyUsed
            var maxRecentlyUsed = await context.ShopItems
                .MaxAsync(s => s.RecentlyUsed);
            var nextRecentlyUsed = maxRecentlyUsed > 0 ? maxRecentlyUsed + 1 : 1;
            shopItem.RecentlyUsed = nextRecentlyUsed;
            var shopItemCategory = shopItem.Category;
                
                
            // Delete the older recent item if more than 10 recent items exist
            var recentItems = await context.ShopItems
                .Where(s => s.Category == shopItemCategory || s.Category == null)
                .Where(s => s.RecentlyUsed > 0)
                .OrderBy(s => -s.RecentlyUsed) // Order by RecentlyUsed ascending
                .ToListAsync();

            if (recentItems.Count > 9)
            {
                var itemsToDelete = recentItems.Skip(9); // Skip the first 9 items
                context.ShopItems.RemoveRange(itemsToDelete); // Remove the rest
            }

        }
        await context.SaveChangesAsync();
        var response = shopItem.Adapt<ShopItemResponse>();
        await _hubContext.Clients.All.SendAsync("ToggleShopItem", response);
        return response;
    }

    public async Task<ShopItemResponse?> CreateShopItemAsync(long categoryId, string name)
    {
        var shopItem = await AddIngredientToList(name, categoryId);
        await context.SaveChangesAsync();
        var response = shopItem.Adapt<ShopItemResponse>();
        await _hubContext.Clients.All.SendAsync("ToggleShopItem", response);
        return response;
    }

    public async Task<string?> AddDinnerToListAsync(long dinnerId)
    {
        var dinnerItem = await context.DinnerItems
            .AsNoTracking()
            .Include(d => d.Ingredients)
            .ThenInclude(ri => ri.Ingredient)
            .FirstOrDefaultAsync(d => d.ID == dinnerId);

        if (dinnerItem == null || dinnerItem.Ingredients == null)
        {
            return null;
        }
        foreach (var recipeItem in dinnerItem.Ingredients)
        {
            if (recipeItem.Ingredient != null && recipeItem.Ingredient.Name != null)
            {
                await AddIngredientToList(recipeItem.Ingredient.Name, 1);
            }
        }

        await context.SaveChangesAsync();
        return dinnerItem.Name;
    }

    public async Task<bool> DeleteShopItemAsync(long id)
    {
        var shopItem = await context.ShopItems.FindAsync(id);
        if (shopItem == null)
        {
            return false;
        }

        context.ShopItems.Remove(shopItem);
        await context.SaveChangesAsync();
        return true;
    }
    
    private async Task<ShopItem> AddIngredientToList(string shopItemName, long? categoryId)
    {
        var existingShopItem = await context.ShopItems
            .Include(s => s.Category)
            .Include(s => s.Ingredient)
            .ThenInclude(i => i.ingredientType)
            .SingleOrDefaultAsync(si => si.Ingredient.Name.Equals(shopItemName) && si.Category.ID == categoryId);
        
        if (existingShopItem != null)
        {
            // Already exists in shopping list
            if (existingShopItem.RecentlyUsed > 0)
            {
                // It's in recently used section only. So revert to the "to buy" list and reset desc
                existingShopItem.RecentlyUsed = 0;
                existingShopItem.Description = "";
            }
            else
            {
                // Add a + to the description if it already exists
                existingShopItem.Description += " +";
            }
            return existingShopItem;
        } else
        {
            // new ingredient to shopping list
            var shopItem = new ShopItem();
            var ingredientItem = await context.IngredientItem
                .FirstOrDefaultAsync(i => i.Name == shopItemName);
            if (ingredientItem != null)
            {
                shopItem.Ingredient = ingredientItem;
            }
            else
            {
                shopItem.Ingredient = new IngredientItem();
                shopItem.Ingredient.Name = shopItemName;
            }
            shopItem.RecentlyUsed = 0;
            shopItem.Description = "";
            shopItem.Category = await context.ShopCategories.FindAsync(categoryId);
            context.ShopItems.Add(shopItem);
            return shopItem;
        }
    }
}
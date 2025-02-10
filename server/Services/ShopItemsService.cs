using Mapster;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MiddagApi.Controllers;
using MiddagApi.Models;

namespace MiddagApi.Services;

public class ShopItemsService(DinnerContext context, IHubContext<NotificationHub> _hubContext) : IShopItemsService
{
    public async Task<IEnumerable<ShopItem>> GetShopItemsAsync(string categoryId)
    {
        var shopItems= await context.ShopItems
            .Where(item => item.categoryId == categoryId)
            .ToListAsync();
        return shopItems;
    }

    public async Task<IEnumerable<IngredientType>> GetIngredientTypesAsync()
    {
        return await context.IngredientTypes.OrderBy(i => i.order)
            .ToListAsync();
    }

    public async Task<IngredientItem?> UpdateIngredientTypeAsync(string ingredientId, string ingredientTypeId)
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

    public async Task<ShopItem?> UpdateShopItemAsync(string id, ShopItem item)
    {
        var shopItem = await context.ShopItems
            .FirstOrDefaultAsync(s => s.id == id);
            
        if (shopItem is null)
        {
            return null;
        }
        shopItem.description = item.description;
        shopItem.recentlyUsed = item.recentlyUsed;
            
        await context.SaveChangesAsync();
        //var response = shopItem.Adapt<ShopItemResponse>();
        await _hubContext.Clients.All.SendAsync("ToggleShopItem", shopItem);

        return shopItem;
    }

    public async Task<ShopItem?> ToggleShopItemAsync(string id)
    {
        var shopItem = await context.ShopItems
            .SingleOrDefaultAsync(i => i.id == id);
        
        if (shopItem == null)
        {
            return null;
        }

        if (shopItem.recentlyUsed > 0)
        {
            shopItem.recentlyUsed = 0;
        }
        else
        {
            // Find next number for recentlyUsed
            var maxRecentlyUsed = await context.ShopItems
                .MaxAsync(s => s.recentlyUsed);
            var nextRecentlyUsed = maxRecentlyUsed > 0 ? maxRecentlyUsed + 1 : 1;
            shopItem.recentlyUsed = nextRecentlyUsed;
                
                
            // Delete the older recent item if more than 10 recent items exist
            var recentItems = await context.ShopItems
                .Where(s => s.categoryId == shopItem.categoryId)
                .Where(s => s.recentlyUsed > 0)
                .OrderBy(s => -s.recentlyUsed) // Order by RecentlyUsed ascending
                .ToListAsync();

            if (recentItems.Count > 9)
            {
                var itemsToDelete = recentItems.Skip(9); // Skip the first 9 items
                context.ShopItems.RemoveRange(itemsToDelete); // Remove the rest
            }

        }
        await context.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("ToggleShopItem", shopItem);
        return shopItem;
    }

    public async Task<ShopItem?> CreateShopItemAsync(string categoryId, string name)
    {
        var shopItem = await AddIngredientToList(name, categoryId);
        await context.SaveChangesAsync();
        //var response = shopItem.Adapt<ShopItemResponse>();
        await _hubContext.Clients.All.SendAsync("ToggleShopItem", shopItem);
        return shopItem;
    }

    public async Task<string?> AddDinnerToListAsync(string dinnerId)
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
                await AddIngredientToList(recipeItem.Ingredient.Name, "1");
            }
        }

        await context.SaveChangesAsync();
        return dinnerItem.Name;
    }

    public async Task<bool> DeleteShopItemAsync(string id)
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
    
    private async Task<ShopItem> AddIngredientToList(string shopItemName, string? categoryId)
    {
        var existingShopItem = await context.ShopItems
            .SingleOrDefaultAsync(si => si.name.Equals(shopItemName) && si.categoryId == categoryId);
        
        if (existingShopItem != null)
        {
            // Already exists in shopping list
            if (existingShopItem.recentlyUsed > 0)
            {
                // It's in recently used section only. So revert to the "to buy" list and reset desc
                existingShopItem.recentlyUsed = 0;
                existingShopItem.description = "";
            }
            else
            {
                // Add a + to the description if it already exists
                existingShopItem.description += " +";
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
                shopItem.name = ingredientItem.Name;
            }
            else
            {
                // TODO: Fix new ingredient item
                //shopItem.Ingredient = new IngredientItem();
                shopItem.name = shopItemName;
            }
            shopItem.recentlyUsed = 0;
            shopItem.description = "";
            shopItem.categoryId = categoryId ?? "1"; //await context.ShopCategories.FindAsync(categoryId);
            context.ShopItems.Add(shopItem);
            return shopItem;
        }
    }
}
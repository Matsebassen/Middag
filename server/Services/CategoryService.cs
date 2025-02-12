using Microsoft.EntityFrameworkCore;
using MiddagApi.Models;

namespace MiddagApi.Services;

public class CategoryService(DinnerContext context) : ICategoryService
{
    public async Task<IEnumerable<ShopCategory>> GetCategoriesAsync()
    {
        return await context.ShopCategories.OrderBy(i => i.name)
            .ToListAsync();
    }

    public async Task<ShopCategory> CreateCategoryAsync(string name)
    {
        var entry = context.ShopCategories.Add(new ShopCategory { name = name, id = Guid.NewGuid().ToString()});
        await context.SaveChangesAsync();
        return entry.Entity;
    }

    public async Task<bool> DeleteCategoryAsync(string id)
    {
        var category = await context.ShopCategories.FindAsync(id);
        if (category == null)
        {
            return false;
        }
        
        
        var shopItemsWithCategory =  await context.ShopItems.Where(shopItem => shopItem.categoryId == id).ToListAsync();
        foreach (var shopItem in shopItemsWithCategory)
        {
            shopItem.categoryId = "1";
        }
        

        context.Remove(category);

        await context.SaveChangesAsync();
        return true;
    }

    public async Task<ShopCategory?> UpdateCategoryAsync(ShopCategory category)
    {
        var foundCategory = await context.ShopCategories.FindAsync(category.id);
        if (foundCategory is null)
        {
            return null;
        }

        foundCategory.name = category.name;
        await context.SaveChangesAsync();
        return foundCategory;
    }
}
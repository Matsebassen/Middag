using MiddagApi.Models;

namespace MiddagApi.Services;

public interface IShopItemsService
{
    public Task<IEnumerable<ShopItem>> GetShopItemsAsync(string categoryId);
    public Task<IEnumerable<IngredientType>> GetIngredientTypesAsync();
    public Task<IngredientItem?> UpdateIngredientTypeAsync(string ingredientId, string ingredientTypeId);
    public Task<ShopItem?> UpdateShopItemAsync(string id, ShopItem item);
    public Task<ShopItem?> ToggleShopItemAsync(string id);
    public Task<ShopItem?> CreateShopItemAsync(string categoryId, string name);
    public Task<string?> AddDinnerToListAsync(string dinnerId);
    public Task<bool> DeleteShopItemAsync(string id);
    
}
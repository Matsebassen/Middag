using MiddagApi.Models;

namespace MiddagApi.Services;

public interface IShopItemsService
{
    public Task<IEnumerable<ShopItem>> GetShopItemsAsync(long categoryId);
    public Task<IEnumerable<IngredientType>> GetIngredientTypesAsync();
    public Task<IngredientItem?> UpdateIngredientTypeAsync(long ingredientId, long ingredientTypeId);
    public Task<ShopItemResponse?> UpdateShopItemAsync(long id, ShopItemResponse item);
    public Task<ShopItemResponse?> ToggleShopItemAsync(long id);
    public Task<ShopItemResponse?> CreateShopItemAsync(long categoryId, string name);
    public Task<string?> AddDinnerToListAsync(long dinnerId);
    public Task<bool> DeleteShopItemAsync(long id);
    
}
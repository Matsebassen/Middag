using MiddagApi.Models;

namespace MiddagApi.Services;

public interface ICategoryService
{
    public Task<IEnumerable<ShopCategory>> GetCategoriesAsync();
    public Task<ShopCategory> CreateCategoryAsync(string name);
    public Task<bool> DeleteCategoryAsync(long id);
    public Task<ShopCategory?> UpdateCategoryAsync(ShopCategory category);
}
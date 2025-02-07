using MiddagApi.Models;

namespace MiddagApi.Services;

public interface IDinnerService
{
    public Task<IEnumerable<DinnerItem>> GetAllDinnersAsync();
    public Task<DinnerItem?> GetDinnerAsync(long id);
    public Task<IEnumerable<DinnerItem>> GetDinnersAsync(string search);
    public Task<DinnerItem?> UpdateDinnerAsync(DinnerItem dinnerItem);
    public Task<DinnerItem?> CreateDinnerAsync(DinnerItem dinner);
    public Task<bool> DeleteDinnerAsync(long id);
}
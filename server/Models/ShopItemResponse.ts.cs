namespace MiddagApi.Models;

public class ShopItemResponse
{
    public long ID { get; set; }
    public long IngredientId { get; set; }
    public string Name { get; set; }
    public long? IngredientTypeId { get; set; }
    public string? Description { get; set; }
    public int? RecentlyUsed { get; set; }
    public long? CategoryId { get; set; }
    public int? Order { get; set; }
}


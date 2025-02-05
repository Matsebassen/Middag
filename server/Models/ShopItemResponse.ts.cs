namespace MiddagApi.Models;

public class ShopItemResponse
{
    public long ID { get; set; }
    public string? Description { get; set; }
    public int? RecentlyUsed { get; set; }
    public long? CategoryId { get; set; }
    public required IngredientItemResponse IngredientItem { get; set; }
}



namespace MiddagApi.Models
{
  public class ShopItem
  {
    public string id { get; set; }
    public string name { get; set; }
    public string categoryId { get; set; }
    public string ingredientId { get; set; }
    public string? ingredientTypeId { get; set; }
    public string? description { get; set; }
    public long? recentlyUsed { get; set; }
    public long? order { get; set; }
  }
}
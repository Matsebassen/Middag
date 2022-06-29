namespace MiddagApi.Models
{
    public class ShopItem
    {
      public long ID {get;set;}
      public IngredientItem? Ingredient {get; set;}
      public string? Description {get;set;}
      public int? RecentlyUsed {get;set;}
    }
}
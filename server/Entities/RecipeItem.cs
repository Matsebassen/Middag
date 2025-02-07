namespace MiddagApi.Models
{
    public class RecipeItem
    {
        public long ID { get; set; }
        public string? Unit { get; set; }
        public string? Qty { get; set; }
        public IngredientItem? Ingredient {get;set;}
    }
}
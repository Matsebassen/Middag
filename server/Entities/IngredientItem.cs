namespace MiddagApi.Models
{
    public class IngredientItem
    {
        public string id { get; set; }
        public string? Name { get; set; }
        public IngredientType? ingredientType { get; set; }
    }
}

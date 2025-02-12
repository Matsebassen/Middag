namespace MiddagApi.Models
{
    public class IngredientItem
    {
        public string id { get; set; }
        public string? name { get; set; }
        public string? ingredientTypeId { get; set; }
        public long? order { get; set; }
    }
}

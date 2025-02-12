namespace MiddagApi.Models
{
    public class IngredientType
    {
        public required string id { get; set; }
        public string? name { get; set; }
        public int? order { get; set; }
    }
}

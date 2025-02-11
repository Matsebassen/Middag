namespace MiddagApi.Models
{
    public class DinnerItem
    {
        public string id { get; set; }
        public string name { get; set; }
        public string? picUrl { get; set;}
        public string? portions { get; set;}
        public string? tags { get; set;}
        public string? url { get; set;} 
        public IEnumerable<RecipeItem> ingredients { get; set; } = new List<RecipeItem>(); // Ensures non-nullability
    }
}
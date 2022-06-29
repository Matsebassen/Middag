namespace MiddagApi.Models
{
    public class DinnerItem
    {
        public long ID { get; set; }
        public string? Name { get; set; }
        public string? PicUrl { get; set;}
        public string? Portions { get; set;}
        public string? Tags { get; set;}
        public string? Url { get; set;} 
        public List<RecipeItem>? Ingredients { get; set;}
    }
}
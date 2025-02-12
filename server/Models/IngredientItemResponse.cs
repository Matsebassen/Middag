namespace MiddagApi.Models;

public class IngredientItemResponse
{
   public string Name { get; set; }
   public string ID { get; set; }
   public string? IngredientTypeId { get; set; }
   public int? Order { get; set; }

}
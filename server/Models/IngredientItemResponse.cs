namespace MiddagApi.Models;

public class IngredientItemResponse
{
   public string Name { get; set; }
   public long ID { get; set; }
   public long? IngredientTypeId { get; set; }
   public int? Order { get; set; }

}
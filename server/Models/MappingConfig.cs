namespace MiddagApi.Models;

using Mapster;

public class MappingConfig
{
    public static void ConfigureMappings()
    {
        TypeAdapterConfig<ShopItem, ShopItemResponse>.NewConfig()
            .Map(dest => dest.CategoryId, src => src.Category != null ? src.Category.ID : null)
            .Map(dest => dest.IngredientItem.Name, src => src.Ingredient != null ? src.Ingredient.Name : null )
            .Map(dest => dest.IngredientItem.ID, src => src.Ingredient != null ? src.Ingredient.ID : 0 )
            .Map(dest => dest.IngredientItem.Order, src => (src.Ingredient != null && src.Ingredient.ingredientType != null) ? src.Ingredient.ingredientType.order : 99 )
            .Map(dest => dest.IngredientItem.IngredientTypeId, src => (src.Ingredient != null && src.Ingredient.ingredientType != null) ? src.Ingredient.ingredientType.ID : 0 );

        TypeAdapterConfig<IngredientItem, IngredientItemResponse>.NewConfig()
            .Map(dest => dest.Order, src => src.ingredientType != null ? src.ingredientType.order : 0)
            .Map(dest => dest.IngredientTypeId, src => src.ingredientType != null ? src.ingredientType.ID : 99);
            

        
        TypeAdapterConfig<ShopItemResponse, ShopItem>.NewConfig()
            .Map(dest => dest.Category.ID, src => src.CategoryId != null ? src.CategoryId : null)
            .Map(dest => dest.Ingredient.Name, src => src.IngredientItem.Name != null ? src.IngredientItem.Name : null )
            .Map(dest => dest.Ingredient.ID, src => src.IngredientItem.ID  )
            .Map(dest => dest.Ingredient.ingredientType.order, src => (src.IngredientItem.Order != null) ? src.IngredientItem.Order : 99 )
            .Map(dest => dest.Ingredient.ingredientType.ID, src => (src.IngredientItem.IngredientTypeId != null ) ? src.IngredientItem.IngredientTypeId : 0 );
        
    }
}

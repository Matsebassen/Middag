namespace MiddagApi.Models;

using Mapster;

public class MappingConfig
{
    public static void ConfigureMappings()
    {
        TypeAdapterConfig<ShopItem, ShopItemResponse>.NewConfig()
            .Map(dest => dest.CategoryId, src => src.Category != null ? src.Category.ID : null)
            .Map(dest => dest.Name, src => src.Ingredient != null ? src.Ingredient.Name : null )
            .Map(dest => dest.IngredientId, src => src.Ingredient != null ? src.Ingredient.ID : 0 )
            .Map(dest => dest.Order, src => (src.Ingredient != null && src.Ingredient.ingredientType != null) ? src.Ingredient.ingredientType.order : 99 )
            .Map(dest => dest.IngredientTypeId, src => (src.Ingredient != null && src.Ingredient.ingredientType != null) ? src.Ingredient.ingredientType.ID : 0 );
        
        TypeAdapterConfig<ShopItemResponse, ShopItem>.NewConfig()
            .Map(dest => dest.Category.ID, src => src.CategoryId != null ? src.CategoryId : null)
            .Map(dest => dest.Ingredient.Name, src => src.Name != null ? src.Name : null )
            .Map(dest => dest.Ingredient.ID, src => src.IngredientId != null ? src.IngredientId : 0 )
            .Map(dest => dest.Ingredient.ingredientType.order, src => (src.Order != null) ? src.Order : 99 )
            .Map(dest => dest.Ingredient.ingredientType.ID, src => (src.IngredientTypeId != null ) ? src.IngredientTypeId : 0 );
        
    }
}

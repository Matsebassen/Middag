using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;

namespace MiddagApi.Models
{
    public class DinnerContext : DbContext
    {
        public DinnerContext(DbContextOptions<DinnerContext> options)
            : base(options)
        {
        }

        public DbSet<DinnerItem> DinnerItems { get; set; } = null!;
        public DbSet<ShopItem> ShopItems { get; set; } = null!;
        public DbSet<IngredientItem> IngredientItem { get; set; } = null!;
        public DbSet<RecipeItem> RecipeItem { get; set; } = null!;
        public DbSet<IngredientType> IngredientTypes { get; set; } = null!;


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DinnerItem>().ToTable("Dinners");
        }

    }
}
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
        public DbSet<IngredientType> IngredientTypes { get; set; } = null!;
        public DbSet<ShopCategory> ShopCategories { get; set; } = null!;



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Define a separate container for each entity
            modelBuilder.Entity<ShopItem>().ToContainer("ShopItems").HasNoDiscriminator();
            modelBuilder.Entity<DinnerItem>().ToContainer("Dinners").HasNoDiscriminator();
            modelBuilder.Entity<IngredientItem>().ToContainer("Ingredients").HasNoDiscriminator();
            modelBuilder.Entity<IngredientType>().ToContainer("IngredientTypes").HasNoDiscriminator();
            modelBuilder.Entity<ShopCategory>().ToContainer("ShopCategory").HasNoDiscriminator();

            // Set partition keys (important for performance)
            modelBuilder.Entity<ShopItem>().HasPartitionKey(x => x.id);
            modelBuilder.Entity<DinnerItem>().HasPartitionKey(x => x.id);
            modelBuilder.Entity<IngredientItem>().HasPartitionKey(x => x.id);
            modelBuilder.Entity<IngredientType>().HasPartitionKey(x => x.id);
            modelBuilder.Entity<ShopCategory>().HasPartitionKey(x => x.id);
        }

    }
}
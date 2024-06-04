﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MiddagApi.Models;

#nullable disable

namespace MiddagApi.Migrations
{
    [DbContext(typeof(DinnerContext))]
    partial class DinnerContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("MiddagApi.Models.DinnerItem", b =>
                {
                    b.Property<long>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("ID"), 1L, 1);

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PicUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Portions")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Tags")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Url")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ID");

                    b.ToTable("Dinners", (string)null);
                });

            modelBuilder.Entity("MiddagApi.Models.IngredientItem", b =>
                {
                    b.Property<long>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("ID"), 1L, 1);

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<long?>("ingredientTypeID")
                        .HasColumnType("bigint");

                    b.HasKey("ID");

                    b.HasIndex("ingredientTypeID");

                    b.ToTable("IngredientItem");
                });

            modelBuilder.Entity("MiddagApi.Models.IngredientType", b =>
                {
                    b.Property<long>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("ID"), 1L, 1);

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("order")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.ToTable("IngredientTypes");
                });

            modelBuilder.Entity("MiddagApi.Models.RecipeItem", b =>
                {
                    b.Property<long>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("ID"), 1L, 1);

                    b.Property<long?>("DinnerItemID")
                        .HasColumnType("bigint");

                    b.Property<long?>("IngredientID")
                        .HasColumnType("bigint");

                    b.Property<string>("Qty")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Unit")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ID");

                    b.HasIndex("DinnerItemID");

                    b.HasIndex("IngredientID");

                    b.ToTable("RecipeItem");
                });

            modelBuilder.Entity("MiddagApi.Models.ShopItem", b =>
                {
                    b.Property<long>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("ID"), 1L, 1);

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<long?>("IngredientID")
                        .HasColumnType("bigint");

                    b.Property<int?>("RecentlyUsed")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.HasIndex("IngredientID");

                    b.ToTable("ShopItems");
                });

            modelBuilder.Entity("MiddagApi.Models.IngredientItem", b =>
                {
                    b.HasOne("MiddagApi.Models.IngredientType", "ingredientType")
                        .WithMany()
                        .HasForeignKey("ingredientTypeID");

                    b.Navigation("ingredientType");
                });

            modelBuilder.Entity("MiddagApi.Models.RecipeItem", b =>
                {
                    b.HasOne("MiddagApi.Models.DinnerItem", null)
                        .WithMany("Ingredients")
                        .HasForeignKey("DinnerItemID");

                    b.HasOne("MiddagApi.Models.IngredientItem", "Ingredient")
                        .WithMany()
                        .HasForeignKey("IngredientID");

                    b.Navigation("Ingredient");
                });

            modelBuilder.Entity("MiddagApi.Models.ShopItem", b =>
                {
                    b.HasOne("MiddagApi.Models.IngredientItem", "Ingredient")
                        .WithMany()
                        .HasForeignKey("IngredientID");

                    b.Navigation("Ingredient");
                });

            modelBuilder.Entity("MiddagApi.Models.DinnerItem", b =>
                {
                    b.Navigation("Ingredients");
                });
#pragma warning restore 612, 618
        }
    }
}
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MiddagApi.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /*
            migrationBuilder.CreateTable(
                name: "Dinners",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PicUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Portions = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tags = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dinners", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "IngredientItem",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IngredientItem", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "RecipeItem",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Unit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Qty = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IngredientID = table.Column<long>(type: "bigint", nullable: true),
                    DinnerItemID = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecipeItem", x => x.ID);
                    table.ForeignKey(
                        name: "FK_RecipeItem_Dinners_DinnerItemID",
                        column: x => x.DinnerItemID,
                        principalTable: "Dinners",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_RecipeItem_IngredientItem_IngredientID",
                        column: x => x.IngredientID,
                        principalTable: "IngredientItem",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "ShopItems",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IngredientID = table.Column<long>(type: "bigint", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RecentlyUsed = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShopItems", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ShopItems_IngredientItem_IngredientID",
                        column: x => x.IngredientID,
                        principalTable: "IngredientItem",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_RecipeItem_DinnerItemID",
                table: "RecipeItem",
                column: "DinnerItemID");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeItem_IngredientID",
                table: "RecipeItem",
                column: "IngredientID");

            migrationBuilder.CreateIndex(
                name: "IX_ShopItems_IngredientID",
                table: "ShopItems",
                column: "IngredientID");
                */
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RecipeItem");

            migrationBuilder.DropTable(
                name: "ShopItems");

            migrationBuilder.DropTable(
                name: "Dinners");

            migrationBuilder.DropTable(
                name: "IngredientItem");
        }
    }
}

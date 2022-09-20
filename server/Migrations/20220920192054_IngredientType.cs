using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MiddagApi.Migrations
{
    public partial class IngredientType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "ingredientTypeID",
                table: "IngredientItem",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "IngredientTypes",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IngredientTypes", x => x.ID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_IngredientItem_ingredientTypeID",
                table: "IngredientItem",
                column: "ingredientTypeID");

            migrationBuilder.AddForeignKey(
                name: "FK_IngredientItem_IngredientTypes_ingredientTypeID",
                table: "IngredientItem",
                column: "ingredientTypeID",
                principalTable: "IngredientTypes",
                principalColumn: "ID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_IngredientItem_IngredientTypes_ingredientTypeID",
                table: "IngredientItem");

            migrationBuilder.DropTable(
                name: "IngredientTypes");

            migrationBuilder.DropIndex(
                name: "IX_IngredientItem_ingredientTypeID",
                table: "IngredientItem");

            migrationBuilder.DropColumn(
                name: "ingredientTypeID",
                table: "IngredientItem");
        }
    }
}

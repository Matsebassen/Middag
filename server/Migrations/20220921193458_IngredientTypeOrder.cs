using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MiddagApi.Migrations
{
    public partial class IngredientTypeOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "order",
                table: "IngredientTypes",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "order",
                table: "IngredientTypes");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MiddagApi.Migrations
{
    public partial class AddShopCategory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "CategoryID",
                table: "ShopItems",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ShopCategories",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShopCategories", x => x.ID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ShopItems_CategoryID",
                table: "ShopItems",
                column: "CategoryID");

            migrationBuilder.AddForeignKey(
                name: "FK_ShopItems_ShopCategories_CategoryID",
                table: "ShopItems",
                column: "CategoryID",
                principalTable: "ShopCategories",
                principalColumn: "ID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShopItems_ShopCategories_CategoryID",
                table: "ShopItems");

            migrationBuilder.DropTable(
                name: "ShopCategories");

            migrationBuilder.DropIndex(
                name: "IX_ShopItems_CategoryID",
                table: "ShopItems");

            migrationBuilder.DropColumn(
                name: "CategoryID",
                table: "ShopItems");
        }
    }
}

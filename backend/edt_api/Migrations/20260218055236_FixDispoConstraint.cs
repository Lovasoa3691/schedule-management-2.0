using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace edt_api.Migrations
{
    /// <inheritdoc />
    public partial class FixDispoConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Disponibilites_Utilisateurs_enseignantId",
                table: "Disponibilites");

            migrationBuilder.DropForeignKey(
                name: "FK_Edts_Matieres_matiereId",
                table: "Edts");

            migrationBuilder.AddForeignKey(
                name: "FK_Disponibilites_Utilisateurs_enseignantId",
                table: "Disponibilites",
                column: "enseignantId",
                principalTable: "Utilisateurs",
                principalColumn: "idUt",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Edts_Matieres_matiereId",
                table: "Edts",
                column: "matiereId",
                principalTable: "Matieres",
                principalColumn: "codeMat",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Disponibilites_Utilisateurs_enseignantId",
                table: "Disponibilites");

            migrationBuilder.DropForeignKey(
                name: "FK_Edts_Matieres_matiereId",
                table: "Edts");

            migrationBuilder.AddForeignKey(
                name: "FK_Disponibilites_Utilisateurs_enseignantId",
                table: "Disponibilites",
                column: "enseignantId",
                principalTable: "Utilisateurs",
                principalColumn: "idUt",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Edts_Matieres_matiereId",
                table: "Edts",
                column: "matiereId",
                principalTable: "Matieres",
                principalColumn: "codeMat",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

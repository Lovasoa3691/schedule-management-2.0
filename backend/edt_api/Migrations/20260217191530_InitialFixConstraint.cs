using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace edt_api.Migrations
{
    /// <inheritdoc />
    public partial class InitialFixConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AnneeScolaires",
                columns: table => new
                {
                    idAnnee = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    dateDebutAnnee = table.Column<string>(type: "varchar(4)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dateFinAnnee = table.Column<string>(type: "varchar(4)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    status = table.Column<string>(type: "varchar(10)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnneeScolaires", x => x.idAnnee);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "CalendrierAcademiques",
                columns: table => new
                {
                    idCal = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    dateDebut = table.Column<DateOnly>(type: "date", nullable: false),
                    dateFin = table.Column<DateOnly>(type: "date", nullable: false),
                    typeCal = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    descriptionCal = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CalendrierAcademiques", x => x.idCal);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Matieres",
                columns: table => new
                {
                    codeMat = table.Column<string>(type: "varchar(36)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nomMat = table.Column<string>(type: "varchar(20)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nbHor = table.Column<int>(type: "int", nullable: false),
                    coefficient = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Matieres", x => x.codeMat);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Mentions",
                columns: table => new
                {
                    idMent = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    nomMent = table.Column<string>(type: "varchar(20)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mentions", x => x.idMent);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Niveaux",
                columns: table => new
                {
                    idNiv = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    intitule = table.Column<string>(type: "varchar(20)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Niveaux", x => x.idNiv);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Salles",
                columns: table => new
                {
                    idSalle = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    nomSalle = table.Column<string>(type: "varchar(20)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    capacite = table.Column<int>(type: "int", nullable: false),
                    typeSalle = table.Column<string>(type: "varchar(40)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    localisation = table.Column<string>(type: "varchar(20)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Salles", x => x.idSalle);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Utilisateurs",
                columns: table => new
                {
                    idUt = table.Column<string>(type: "varchar(36)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nom = table.Column<string>(type: "varchar(50)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    prenom = table.Column<string>(type: "varchar(50)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    telephone = table.Column<string>(type: "varchar(15)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    genre = table.Column<string>(type: "varchar(15)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    adresse = table.Column<string>(type: "varchar(20)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    typeUtilisateur = table.Column<string>(type: "varchar(21)", maxLength: 21, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    grade = table.Column<string>(type: "varchar(50)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    role = table.Column<string>(type: "varchar(20)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Utilisateurs", x => x.idUt);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MatiereMentions",
                columns: table => new
                {
                    matiereId = table.Column<string>(type: "varchar(36)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    mentionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatiereMentions", x => new { x.matiereId, x.mentionId });
                    table.ForeignKey(
                        name: "FK_MatiereMentions_Matieres_matiereId",
                        column: x => x.matiereId,
                        principalTable: "Matieres",
                        principalColumn: "codeMat",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MatiereMentions_Mentions_mentionId",
                        column: x => x.mentionId,
                        principalTable: "Mentions",
                        principalColumn: "idMent",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MatiereNiveaux",
                columns: table => new
                {
                    matiereId = table.Column<string>(type: "varchar(36)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    niveauId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatiereNiveaux", x => new { x.matiereId, x.niveauId });
                    table.ForeignKey(
                        name: "FK_MatiereNiveaux_Matieres_matiereId",
                        column: x => x.matiereId,
                        principalTable: "Matieres",
                        principalColumn: "codeMat",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MatiereNiveaux_Niveaux_niveauId",
                        column: x => x.niveauId,
                        principalTable: "Niveaux",
                        principalColumn: "idNiv",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Activites",
                columns: table => new
                {
                    idActivite = table.Column<string>(type: "varchar(36)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    heureEffectue = table.Column<double>(type: "double", nullable: false),
                    statusActivite = table.Column<string>(type: "varchar(15)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    matiereId = table.Column<string>(type: "varchar(36)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    enseignantId = table.Column<string>(type: "varchar(36)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Activites", x => x.idActivite);
                    table.ForeignKey(
                        name: "FK_Activites_Matieres_matiereId",
                        column: x => x.matiereId,
                        principalTable: "Matieres",
                        principalColumn: "codeMat",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Activites_Utilisateurs_enseignantId",
                        column: x => x.enseignantId,
                        principalTable: "Utilisateurs",
                        principalColumn: "idUt",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Authentifications",
                columns: table => new
                {
                    idAuth = table.Column<string>(type: "varchar(36)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    mdp = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    isActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    utilisateurId = table.Column<string>(type: "varchar(36)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Authentifications", x => x.idAuth);
                    table.ForeignKey(
                        name: "FK_Authentifications_Utilisateurs_utilisateurId",
                        column: x => x.utilisateurId,
                        principalTable: "Utilisateurs",
                        principalColumn: "idUt",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Disponibilites",
                columns: table => new
                {
                    numDispo = table.Column<string>(type: "varchar(36)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dateDispo = table.Column<DateOnly>(type: "date", nullable: false),
                    hDeb = table.Column<TimeOnly>(type: "time(6)", nullable: false),
                    hFin = table.Column<TimeOnly>(type: "time(6)", nullable: false),
                    statusDispo = table.Column<string>(type: "varchar(15)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    enseignantId = table.Column<string>(type: "varchar(36)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Disponibilites", x => x.numDispo);
                    table.ForeignKey(
                        name: "FK_Disponibilites_Utilisateurs_enseignantId",
                        column: x => x.enseignantId,
                        principalTable: "Utilisateurs",
                        principalColumn: "idUt",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Edts",
                columns: table => new
                {
                    numEd = table.Column<string>(type: "varchar(36)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    jour = table.Column<DateOnly>(type: "date", nullable: false),
                    hDeb = table.Column<TimeOnly>(type: "time(6)", nullable: false),
                    hFin = table.Column<TimeOnly>(type: "time(6)", nullable: false),
                    type = table.Column<string>(type: "varchar(30)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    disponibilite = table.Column<string>(type: "varchar(20)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    semaine = table.Column<string>(type: "varchar(15)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    responsableId = table.Column<string>(type: "varchar(36)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    salleId = table.Column<int>(type: "int", nullable: false),
                    enseignantId = table.Column<string>(type: "varchar(36)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    matiereId = table.Column<string>(type: "varchar(36)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    mentionId = table.Column<int>(type: "int", nullable: false),
                    niveauId = table.Column<int>(type: "int", nullable: false),
                    anneeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Edts", x => x.numEd);
                    table.ForeignKey(
                        name: "FK_Edts_AnneeScolaires_anneeId",
                        column: x => x.anneeId,
                        principalTable: "AnneeScolaires",
                        principalColumn: "idAnnee",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Edts_Matieres_matiereId",
                        column: x => x.matiereId,
                        principalTable: "Matieres",
                        principalColumn: "codeMat",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Edts_Mentions_mentionId",
                        column: x => x.mentionId,
                        principalTable: "Mentions",
                        principalColumn: "idMent",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Edts_Niveaux_niveauId",
                        column: x => x.niveauId,
                        principalTable: "Niveaux",
                        principalColumn: "idNiv",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Edts_Salles_salleId",
                        column: x => x.salleId,
                        principalTable: "Salles",
                        principalColumn: "idSalle",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Edts_Utilisateurs_enseignantId",
                        column: x => x.enseignantId,
                        principalTable: "Utilisateurs",
                        principalColumn: "idUt",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Edts_Utilisateurs_responsableId",
                        column: x => x.responsableId,
                        principalTable: "Utilisateurs",
                        principalColumn: "idUt",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    idMes = table.Column<string>(type: "varchar(36)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dateMes = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    texte = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    statusMes = table.Column<string>(type: "varchar(20)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    enseignantId = table.Column<string>(type: "varchar(36)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    responsableId = table.Column<string>(type: "varchar(36)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.idMes);
                    table.ForeignKey(
                        name: "FK_Messages_Utilisateurs_enseignantId",
                        column: x => x.enseignantId,
                        principalTable: "Utilisateurs",
                        principalColumn: "idUt",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Messages_Utilisateurs_responsableId",
                        column: x => x.responsableId,
                        principalTable: "Utilisateurs",
                        principalColumn: "idUt",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Activites_enseignantId",
                table: "Activites",
                column: "enseignantId");

            migrationBuilder.CreateIndex(
                name: "IX_Activites_matiereId",
                table: "Activites",
                column: "matiereId");

            migrationBuilder.CreateIndex(
                name: "IX_Authentifications_utilisateurId",
                table: "Authentifications",
                column: "utilisateurId");

            migrationBuilder.CreateIndex(
                name: "IX_Disponibilites_enseignantId",
                table: "Disponibilites",
                column: "enseignantId");

            migrationBuilder.CreateIndex(
                name: "IX_Edts_anneeId",
                table: "Edts",
                column: "anneeId");

            migrationBuilder.CreateIndex(
                name: "IX_Edts_enseignantId",
                table: "Edts",
                column: "enseignantId");

            migrationBuilder.CreateIndex(
                name: "IX_Edts_matiereId",
                table: "Edts",
                column: "matiereId");

            migrationBuilder.CreateIndex(
                name: "IX_Edts_mentionId",
                table: "Edts",
                column: "mentionId");

            migrationBuilder.CreateIndex(
                name: "IX_Edts_niveauId",
                table: "Edts",
                column: "niveauId");

            migrationBuilder.CreateIndex(
                name: "IX_Edts_responsableId",
                table: "Edts",
                column: "responsableId");

            migrationBuilder.CreateIndex(
                name: "IX_Edts_salleId",
                table: "Edts",
                column: "salleId");

            migrationBuilder.CreateIndex(
                name: "IX_MatiereMentions_mentionId",
                table: "MatiereMentions",
                column: "mentionId");

            migrationBuilder.CreateIndex(
                name: "IX_MatiereNiveaux_niveauId",
                table: "MatiereNiveaux",
                column: "niveauId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_enseignantId",
                table: "Messages",
                column: "enseignantId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_responsableId",
                table: "Messages",
                column: "responsableId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Activites");

            migrationBuilder.DropTable(
                name: "Authentifications");

            migrationBuilder.DropTable(
                name: "CalendrierAcademiques");

            migrationBuilder.DropTable(
                name: "Disponibilites");

            migrationBuilder.DropTable(
                name: "Edts");

            migrationBuilder.DropTable(
                name: "MatiereMentions");

            migrationBuilder.DropTable(
                name: "MatiereNiveaux");

            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropTable(
                name: "AnneeScolaires");

            migrationBuilder.DropTable(
                name: "Salles");

            migrationBuilder.DropTable(
                name: "Mentions");

            migrationBuilder.DropTable(
                name: "Matieres");

            migrationBuilder.DropTable(
                name: "Niveaux");

            migrationBuilder.DropTable(
                name: "Utilisateurs");
        }
    }
}

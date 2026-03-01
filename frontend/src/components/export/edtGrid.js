import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function EdtGrid({ mentions, niveaux, events, currentDate }) {
  const getCurrentWeek = (date) => {
    const monday = new Date(date);
    monday.setDate(monday.getDate() - monday.getDay() + 1); // lundi
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6); // dimanche
    return { monday, sunday };
  };

  const exportPdf = () => {
    const element = document.getElementById("edtContainer");
    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
      pdf.save("edt.pdf");
    });
  };

  const { monday, sunday } = getCurrentWeek(currentDate);

  return (
    <div>
      <button
        onClick={exportPdf}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Export PDF
      </button>

      <div id="edtContainer" style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {niveaux.map((niveau) => (
          <div
            key={niveau.value}
            style={{
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "8px",
              minWidth: "300px",
              flex: "1 1 300px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h2 style={{ color: "#003366", margin: "0 0 4px 0" }}>
              Niveau {niveau.label}
            </h2>
            <div style={{ fontSize: "0.8rem", marginBottom: "8px" }}>
              Semaine du {monday.toLocaleDateString("fr-FR")} au{" "}
              {sunday.toLocaleDateString("fr-FR")}
            </div>

            {mentions.map((mention) => {
              const filteredEvents = events.filter((e) => {
                const d = new Date(e.start);
                return (
                  e.mention === mention.value &&
                  e.niveau === niveau.value &&
                  d >= monday &&
                  d <= sunday
                );
              });

              return (
                <div
                  key={mention.value}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    marginBottom: "12px",
                    overflow: "hidden",
                  }}
                >
                  {/* Titre mention */}
                  <div
                    style={{
                      backgroundColor: "#c8dcf0",
                      padding: "4px 8px",
                      fontWeight: "bold",
                      color: "#003366",
                      borderBottom: "1px solid #999",
                    }}
                  >
                    {mention.label}
                  </div>

                  {/* Tableau header */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "12% 18% 28% 22% 20%",
                      backgroundColor: "#dceefc",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      borderBottom: "1px solid #999",
                      padding: "2px 4px",
                    }}
                  >
                    <div>JOUR</div>
                    <div>HORAIRE</div>
                    <div>MATIÈRE</div>
                    <div>PROFESSEUR</div>
                    <div>SALLE</div>
                  </div>

                  {/* Lignes de cours */}
                  {filteredEvents.length === 0 ? (
                    <div
                      style={{
                        padding: "4px",
                        textAlign: "center",
                        color: "#a00",
                      }}
                    >
                      Aucun cours
                    </div>
                  ) : (
                    filteredEvents.map((e, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "12% 18% 28% 22% 20%",
                          padding: "2px 4px",
                          backgroundColor: idx % 2 === 0 ? "#f1f7fc" : "#ffffff",
                          borderBottom: "1px solid #eee",
                          fontSize: "0.7rem",
                        }}
                      >
                        <div>
                          {new Date(e.start)
                            .toLocaleDateString("fr-FR", { weekday: "short" })
                            .toUpperCase()}
                        </div>
                        <div>
                          {new Date(e.start).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(e.end).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div>{e.title}</div>
                        <div>{e.prenomEns}</div>
                        <div>{e.salle}</div>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
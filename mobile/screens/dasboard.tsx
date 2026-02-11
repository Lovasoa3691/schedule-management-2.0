import axios from "axios";
import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import api from "../hooks/api";

interface Semaine {
  jour: string;
  cours: number;
}

interface Seance {
  id: string;
  jour: string;
  hDeb: string;
  hFin: string;
  matiere: string;
  mention: string;
  niveau: string;
  salle: string;
}

const Dashboard: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState("");
  const [prochaineSeance, setProchaineSeance] = useState<Seance | null>(null);
  const [currentDate, setCurrentDate] = useState("");
  const [userName, setUserName] = useState("");

  const [courses, setCourses] = useState<Seance[]>([]);
  const [resumeSemaine, setResumeSemaine] = useState<Semaine[]>([]);

  const getCurrentWeek = (date: Date) => {
    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { monday, sunday };
  };

  const loadCourses = () => {
    const today = new Date();
    const { monday, sunday } = getCurrentWeek(today);

    const start = monday.toISOString().split("T")[0];
    const end = sunday.toISOString().split("T")[0];

    const dateFormat = (date: Date) => {
      const dateStr = new Date(date);
      const year = dateStr.getFullYear();
      const month = String(dateStr.getMonth() + 1).padStart(2, "0");
      const day = String(dateStr.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    api
      .get("/edt/98421799-1f02-4c1a-9bfe-ebe00d327004", {
        params: { start, end },
      })
      .then((rep) => {
        if (rep.data.length > 0) {
          const today = dateFormat(new Date());

          const coursSemaine: Seance[] = rep.data
            .filter((c: any) => c.jour === today)
            .map((c: any) => ({
              id: c.numEd,
              hDeb: c.hDeb,
              hFin: c.hFin,
              jour: c.jour,
              matiere: c.nomMatiere,
              mention: c.mention,
              niveau: c.niveau,
              salle: c.nomSalle,
            }));

          setCourses(coursSemaine);

          const cours: Seance[] = rep.data.filter((c: any) => ({
            id: c.numEd,
            hDeb: c.hDeb,
            hFin: c.hFin,
            jour: c.jour.includes(dateFormat(new Date())),
            matiere: c.nomMatiere,
            mention: c.mention,
            niveau: c.niveau,
            salle: c.nomSalle,
            status: c.status === "Accompli" ? true : false,
          }));

          const joursSemaine = [
            "Lundi",
            "Mardi",
            "Mercredi",
            "Jeudi",
            "Vendredi",
          ];
          const resumeMap: { [key: string]: number } = {};
          joursSemaine.forEach((j) => (resumeMap[j] = 0));

          const getJourSemaine = (dateStr: string) => {
            const date = new Date(dateStr);
            const options: Intl.DateTimeFormatOptions = { weekday: "long" };
            return date.toLocaleDateString("fr-FR", options);
          };

          cours.forEach((c) => {
            const jourNom = getJourSemaine(c.jour);
            const jourCap = jourNom.charAt(0).toUpperCase() + jourNom.slice(1);
            if (resumeMap[jourCap] !== undefined) {
              resumeMap[jourCap] += 1;
            }
          });

          setResumeSemaine(
            joursSemaine.map((j) => ({
              jour: j,
              cours: resumeMap[j],
            })),
          );
        }
      });
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(dateStr);

    const seanceAVenir = courses.find((seance) => {
      const [hours, minutes] = seance.hDeb.split(":").map(Number);
      const seanceTime = new Date();
      seanceTime.setHours(hours, minutes, 0, 0);
      return seanceTime > now;
    });

    if (seanceAVenir) {
      setProchaineSeance(seanceAVenir);
      const interval = setInterval(() => {
        const now = new Date();
        const [h, m] = seanceAVenir.hDeb.split(":").map(Number);
        const target = new Date();
        target.setHours(h, m, 0, 0);
        const diff = target.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeLeft("La séance commence !");
          clearInterval(interval);
          return;
        }

        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hrs}h ${mins}m ${secs}s`);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setTimeLeft("Aucune autre séance aujourd’hui.");
    }
  }, []);

  const hPrevue = 60;
  const hEffectue = 48;
  const performance = hPrevue > 0 ? (hEffectue / hPrevue) * 100 : 0;

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, { marginBottom: 30, color: "#5a5a5aff" }]}>
        Bienvenue sur{" "}
        <Text style={{ color: "rgba(30, 47, 223, 0.8)" }}>Sched.</Text>
        <Text style={{ color: "black" }}>Connect</Text> {userName}{" "}
      </Text>
      <Text style={styles.date}>
        Aujourd'hui, {currentDate}
        {/* <MaterialIcons name="wb-sunny" size={20} color="#fbc02d" /> 25°C */}
      </Text>

      {prochaineSeance && (
        <View
          style={[
            styles.card,
            {
              backgroundColor: "rgba(29, 149, 204, 1)",
              borderRadius: 16,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 5,
              padding: 6,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Ionicons name="time-outline" size={100} color="#f4fbffff" />
            <View>
              <Text
                style={{ fontSize: 16, color: "#d6d6d6ff", marginBottom: 4 }}
              >
                {prochaineSeance.hDeb} - {prochaineSeance.hFin} |{" "}
                {prochaineSeance.matiere}
              </Text>
              <Text
                style={{ fontSize: 16, color: "#d6d6d6ff", marginBottom: 4 }}
              >
                Salle {prochaineSeance.salle}
              </Text>
              <Text style={{ fontSize: 14, color: "#d6d6d6ff" }}>
                Débute dans :{" "}
                <Text style={{ fontWeight: "600", fontSize: 22 }}>
                  {timeLeft}
                </Text>
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.card}>
        <View style={[styles.iconTitle, { paddingBottom: 8 }]}>
          <Ionicons name="calendar-outline" size={20} color="#2980b9" />
          <Text style={styles.cardTitle}> Votre programme d'aujourd’hui</Text>
        </View>

        {courses.length === 0 ? (
          <Text style={{ color: "gray", fontSize: 16 }}>
            Vous n'avez pas de cours aujourd'hui.
          </Text>
        ) : (
          courses.map((seance, index) => {
            const now = new Date();
            const [startHour, startMinute] = seance.hDeb.split(":").map(Number);
            const startTime = new Date();
            startTime.setHours(startHour, startMinute, 0, 0);

            const endTime = new Date(startTime);
            const [startH, startM] = seance.hFin.split(":").map(Number);
            endTime.setHours(startH, startM, 0, 0);

            let statut = "";
            if (now < startTime) {
              statut = "À venir";
            } else if (now >= startTime && now <= endTime) {
              statut = "En cours";
            } else {
              statut = "Terminé";
            }

            const statutColor =
              statut === "En cours"
                ? "#27ae60"
                : statut === "Terminé"
                ? "#c0392b"
                : "#2980b9";

            return (
              <View key={index} style={styles.seanceItem}>
                <Text style={styles.cardContent}>
                  {seance.hDeb} - {seance.hFin} | {seance.matiere}
                </Text>
                <Text style={styles.cardContent}>Salle {seance.salle}</Text>
                <Text style={styles.cardContent}>
                  {" "}
                  {seance.mention} {seance.niveau}
                </Text>
                <Text style={[styles.statut, { color: statutColor }]}>
                  <Ionicons
                    name={
                      statut === "En cours"
                        ? "play-circle-outline"
                        : statut === "Terminé"
                        ? "checkmark-done-outline"
                        : "time-outline"
                    }
                    size={16}
                    color={statutColor}
                  />{" "}
                  {statut}
                </Text>
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: "#929995ff",
                    marginTop: 7,
                  }}
                ></View>
              </View>
            );
          })
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.iconTitle}>
          {/* <Ionicons name="stats-chart-outline" size={20} color="#2980b9" /> */}
          <Text style={styles.cardTitle}>Resume de la semaine</Text>
        </View>
        {resumeSemaine.length === 0 ? (
          <Text style={{ color: "gray", fontSize: 16 }}>
            Vous n'avez pas de cours cette semaine.
          </Text>
        ) : (
          resumeSemaine.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  height: 50,
                  paddingBottom: 8,
                  flexDirection: "row",
                  padding: 5,
                  alignItems: "center",

                  borderColor: "#2ecc76",
                }}
              >
                <View
                  style={[styles.colorBar, { backgroundColor: "orange" }]}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ color: "gray", fontSize: 16, fontWeight: "bold" }}
                  >
                    {item.jour}
                  </Text>
                </View>
                <View style={{}}>
                  <Text
                    style={{ color: "gray", fontSize: 16, fontWeight: "bold" }}
                  >
                    {item.cours === 0 ? "Aucune" : item.cours}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* <View style={styles.card}>
        <View style={styles.iconTitle}>
          <Ionicons name="flash-outline" size={20} color="#2980b9" />
          <Text style={styles.cardTitle}>Actions rapides</Text>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            borderRadius: 5,
            padding: 10,
            borderColor: "#339adfff",
            borderWidth: 1,
            marginBottom: 15,
          }}
        >
          <Ionicons name="add" size={28} color="#686868ff" />
          <Text style={{ color: "#686868ff", fontSize: 16 }}>
            Ajouter disponibilité
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            borderRadius: 5,
            padding: 10,
            borderColor: "#339adfff",
            borderWidth: 1,
            marginBottom: 15,
          }}
        >
          <Ionicons name="add" size={28} color="#686868ff" />
          <Text style={{ color: "#686868ff", fontSize: 16 }}>
            Voir statitstiques
          </Text>
        </TouchableOpacity>
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  colorBar: {
    width: 10,
    height: "100%",
    borderRadius: 4,
    marginRight: 12,
  },
  iconTitle: {
    // display: 'flex',
    // justifyContent: 'flex-start',
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  container: {
    flex: 1,
    backgroundColor: "#f2f6fc",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 5,
  },

  info: {
    fontSize: 16,
    marginVertical: 2,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  date: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardLink: {},
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#2f95dc",
  },
  cardContent: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  countdown: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,

    color: "#d35400",
  },
  chatButton: {
    marginTop: 20,
    backgroundColor: "#2f95dc",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  chatButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  seanceItem: {
    marginBottom: 10,
  },
  statut: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 2,
  },
});

export default Dashboard;

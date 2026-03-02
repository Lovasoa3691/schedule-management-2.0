import axios from "axios";
import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import api from "../hooks/api";
import { getUserIdFromToken } from "../decode";
import { RefreshControl } from "react-native";
import * as Notifications from "expo-notifications";
import * as Speech from "expo-speech";
import * as Location from "expo-location";
import { usePlanning } from "./utils/PlanningContext";

export const getUserLocationWithCity = async () => {
  // Permission
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Permission localisation refusée");
  }

  // Position GPS
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  const { latitude, longitude } = location.coords;

  // Convertir coordonnées → ville
  const address = await Location.reverseGeocodeAsync({
    latitude,
    longitude,
  });

  const city =
    address[0]?.city ||
    address[0]?.subregion ||
    address[0]?.region ||
    "Localisation inconnue";

  return {
    latitude,
    longitude,
    city,
    country: address[0]?.country,
  };
};

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
  status: string;
}

type CurrentWeather = {
  time: string;
  interval: number;
  temperature: number;
  windspeed: number;
  winddirection: number;
  is_day: number;
  weathercode: number;
};

type OpenMeteoResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
  current_weather: CurrentWeather;
};

type WeatherUI = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

interface User {
  nom: string;
  prenom: string;
  email: string;
}

const weatherMap: Record<number, WeatherUI> = {
  0: { label: "Ciel dégagé", icon: "sunny-outline" },
  1: { label: "Principalement dégagé", icon: "partly-sunny-outline" },
  2: { label: "Partiellement nuageux", icon: "cloud-outline" },
  3: { label: "Couvert", icon: "cloudy-outline" },

  45: { label: "Brouillard", icon: "cloud-outline" },
  48: { label: "Brouillard givrant", icon: "cloud-outline" },

  51: { label: "Bruine légère", icon: "rainy-outline" },
  53: { label: "Bruine modérée", icon: "rainy-outline" },
  55: { label: "Bruine dense", icon: "rainy-outline" },

  61: { label: "Pluie faible", icon: "rainy-outline" },
  63: { label: "Pluie modérée", icon: "rainy-outline" },
  65: { label: "Pluie forte", icon: "rainy-outline" },

  71: { label: "Neige faible", icon: "snow-outline" },
  73: { label: "Neige modérée", icon: "snow-outline" },
  75: { label: "Neige forte", icon: "snow-outline" },

  95: { label: "Orage", icon: "thunderstorm-outline" },
};

const getWeatherUI = (weather: CurrentWeather): WeatherUI => {
  const base = weatherMap[weather.weathercode] ?? {
    label: "Météo inconnue",
    icon: "cloud-outline",
  };

  if (weather.is_day === 0 && base.icon === "sunny-outline") {
    return { ...base, icon: "moon-outline" };
  }

  return base;
};

const Dashboard: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState("");
  const [prochaineSeance, setProchaineSeance] = useState<Seance | null>(null);
  const [currentDate, setCurrentDate] = useState("");
  const [userName, setUserName] = useState("");

  const [courses, setCourses] = useState<Seance[]>([]);
  const [resumeSemaine, setResumeSemaine] = useState<Semaine[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { selectedWeek } = usePlanning();

  const getCurrentWeek = (date: Date) => {
    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { monday, sunday };
  };

  const [weather, setWeather] = useState<OpenMeteoResponse | null>(null);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [user, setUser] = useState<User | null>(null);

  const loadWeather = async () => {
    try {
      const location = await getUserLocationWithCity();

      const res = await axios.get("https://api.open-meteo.com/v1/forecast", {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          current_weather: true,
        },
      });

      setWeather(res.data as OpenMeteoResponse);
      setCity(location.city);
      // setCountry(location.country);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async () => {
    try {
      const user = await getUserIdFromToken();
      if (!user?.userId) {
        Alert.alert("Erreur", "Utilisateur non authentifié");
        return;
      }

      api
        .get(`/user/info?id=${user.userId}&role=${user.role}`)
        .then((res) => {
          console.log(res.data);
          setUser({
            nom: res.data[0]?.nom || "Utilisateur inconnu",
            prenom: res.data[0]?.prenom || "",
            email: res.data[0]?.email || "Email non disponible",
          });
        })
        .catch((err) => console.error("Erreur de recuperation: ", err));
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Erreur",
        "Impossible de récupérer les informations utilisateur",
      );
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const loadCourses = async () => {
    loadWeather();

    const today = new Date(selectedWeek);
    const { monday, sunday } = getCurrentWeek(selectedWeek);

    const start = monday.toISOString().split("T")[0];
    const end = sunday.toISOString().split("T")[0];

    const dateFormat = (date: Date) => {
      const dateStr = new Date(date);
      const year = dateStr.getFullYear();
      const month = String(dateStr.getMonth() + 1).padStart(2, "0");
      const day = String(dateStr.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const data = await getUserIdFromToken();
    if (!data || !data.userId) {
      Alert.alert("Erreur", "Utilisateur non authentifié");
      return;
    }
    setEmail(data.email || "");
    setLoading(true);

    const week = `${monday.getDate()}-${sunday.getDate()}_${monday.getMonth() + 1}_${monday.getFullYear()}`;

    api
      .get(`/edt/${data.userId}/week_${week}`, {
        params: { start, end },
      })
      .then((rep) => {
        const joursSemaine = [
          "Lundi",
          "Mardi",
          "Mercredi",
          "Jeudi",
          "Vendredi",
          "Samedi",
        ];
        const resumeMap: { [key: string]: number } = {};
        joursSemaine.forEach((j) => (resumeMap[j] = 0));
        // console.log("Données de l'emploi du temps: ", rep.data);
        if (rep.data.length > 0) {
          const today = dateFormat(new Date(selectedWeek));
          // Alert.alert("Today: ", today);

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
              status: c.dispo,
            }));

          console.log("Cours de la semaine: ", coursSemaine);

          setCourses(coursSemaine);

          const cours: Seance[] = rep.data.filter((c: any) => ({
            id: c.numEd,
            hDeb: c.hDeb,
            hFin: c.hFin,
            jour: c.jour.includes(dateFormat(new Date(selectedWeek))),
            matiere: c.nomMatiere,
            mention: c.mention,
            niveau: c.niveau,
            salle: c.nomSalle,
            status: c.dispo === "Terminé" ? true : false,
          }));

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
        } else {
          setCourses([]);
          setResumeSemaine(
            joursSemaine.map((j) => ({
              jour: j,
              cours: resumeMap[j],
            })),
          );
        }
      })
      .catch((err) => {
        Alert.alert(
          "Erreur de chargement",
          "Impossible de charger les données de l'emploi du temps. Veuillez réessayer plus tard.",
        );
      })
      .finally(() => setLoading(false));
  };

  const loadProchaineSeance = async () => {
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
          setTimeLeft("N/A");
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
      setTimeLeft("N/A");
    }
  };

  useEffect(() => {
    loadCourses();
  }, [selectedWeek]);

  useEffect(() => {
    if (courses.length > 0) {
      loadProchaineSeance();
    }
  }, [courses]);

  const hPrevue = 60;
  const hEffectue = 48;
  const performance = hPrevue > 0 ? (hEffectue / hPrevue) * 100 : 0;

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadCourses(), loadProchaineSeance()]);
    } finally {
      setRefreshing(false);
    }
  };

  const message = "Votre séance commence dans dix minutes";

  const AlertInfo = async () => {
    const trigger: Notifications.TimeIntervalTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
      repeats: false,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Rappel emploi du temps",
        body: message,
      },
      trigger,
    });

    Speech.speak(message, { language: "fr" });
  };

  useEffect(() => {
    AlertInfo();
  }, []);

  const normalizeDate = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getStatutSeance = (
    seanceDateStr: string, // "2026-03-01"
    hDeb: string, // "08:00"
    hFin: string, // "10:00"
  ) => {
    const now = new Date();

    const today = normalizeDate(now);
    const seanceDate = normalizeDate(new Date(seanceDateStr));

    if (seanceDate > today) {
      return "À venir";
    }

    if (seanceDate < today) {
      return "Terminé";
    }

    const [hStart, mStart] = hDeb.split(":").map(Number);
    const [hEnd, mEnd] = hFin.split(":").map(Number);

    const startTime = new Date();
    startTime.setHours(hStart, mStart, 0, 0);

    const endTime = new Date();
    endTime.setHours(hEnd, mEnd, 0, 0);

    if (now < startTime) return "À venir";
    if (now >= startTime && now <= endTime) return "En cours";

    return "Terminé";
  };

  const today = new Date();
  const selected = new Date(selectedWeek);

  const isToday = today.toDateString() === selected.toDateString();

  const title = isToday
    ? "Votre programme d’aujourd’hui"
    : `Programme du ${selected.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })}`;

  if (!weather) return null;

  const ui = getWeatherUI(weather.current_weather);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3a5dd9" />
        <Text style={{ marginTop: 10, textAlign: "center" }}>
          Chargement en cours...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#2980b9"]}
          tintColor="#2980b9"
        />
      }
    >
      <Text style={styles.greeting}>
        Bonjour <Text style={styles.greetingName}>{user?.prenom}</Text>
        {" !"}
      </Text>

      <Text style={styles.date}>
        Aujourd'hui, {currentDate} |{" "}
        <View style={styles.weatherRow}>
          <Ionicons name={ui.icon} size={18} color="#f59e0b" />
          <Text style={styles.weatherText}>
            {ui.label} · {Math.round(weather.current_weather.temperature)}°C —
            {city ? ` ${city}` : ""}
          </Text>
        </View>
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
                {prochaineSeance.hDeb.slice(0, 5)} -{" "}
                {prochaineSeance.hFin.slice(0, 5)}
              </Text>
              <Text
                style={{ fontSize: 16, color: "#d6d6d6ff", marginBottom: 4 }}
              >
                {prochaineSeance.matiere} | {prochaineSeance.mention}{" "}
                {prochaineSeance.niveau}
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
          <Text style={styles.cardTitle}> {title}</Text>
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

            const statut = getStatutSeance(
              seance.jour,
              seance.hDeb,
              seance.hFin,
            );

            const statutColor =
              statut === "En cours"
                ? "#27ae60"
                : statut === "Terminé"
                  ? "#c0392b"
                  : "#2980b9";

            const statutIcon =
              statut === "En cours"
                ? "play-circle-outline"
                : statut === "Terminé"
                  ? "checkmark-done-outline"
                  : "time-outline";

            return (
              <View key={index} style={styles.seanceItem}>
                <Text style={styles.cardContent}>
                  {seance.hDeb.slice(0, 5)} - {seance.hFin.slice(0, 5)} |{" "}
                  {seance.matiere}
                </Text>
                <Text style={styles.cardContent}>Salle {seance.salle}</Text>
                <Text style={styles.cardContent}>
                  {" "}
                  {seance.mention} {seance.niveau}
                </Text>

                <Text style={[styles.statut, { color: statutColor }]}>
                  <Ionicons name={statutIcon} size={16} color={statutColor} />{" "}
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
          <Text style={styles.cardTitle}>Resumé de la semaine</Text>
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
  greeting: {
    fontSize: 22,
    fontWeight: "600",
    color: "#444",
    marginBottom: 24,
  },
  greetingName: {
    color: "#1e2fdf",
    fontWeight: "700",
  },
  weatherRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  weatherText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
  },
});

export default Dashboard;

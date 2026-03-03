import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  Button,
  Animated,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Easing,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Calendar, Mode } from "react-native-big-calendar";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import axios from "axios";
import api from "../hooks/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserIdFromToken } from "../decode";

type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
};

interface Dispo {
  id: string;
  dateDispo: string;
  hdeb: string;
  hfin: string;
  codeEns: string;
  semaine: string;
}

export default function DisponibilityCalendar() {
  const [mode, setMode] = useState<Mode>("week");
  const [date, setDate] = useState(new Date());

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [heureDebut, setHeureDebut] = useState<string>("");
  const [heureFin, setHeureFin] = useState<string>("");
  const [dateDispo, setDateDispo] = useState<string>("");

  const slideAnim = useRef(new Animated.Value(500)).current;

  const [pickerMode, setPickerMode] = useState<"debut" | "fin" | "date" | null>(
    null,
  );
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  const [dispoData, setDispoData] = useState<Event[]>([]);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<string>("");

  const loadDispo = async () => {
    const data = await getUserIdFromToken();
    if (!data || !data.userId) {
      Alert.alert("Erreur", "Utilisateur non authentifié");
      return;
    }
    setId(data.userId);
    setLoading(true);

    api
      .get(
        `/disponibilite/${data.userId}?week=${mode === "week" ? date.toISOString() : undefined}`,
      )
      .then((rep) => {
        if (!rep.data || rep.data.length === 0) {
          setDispoData([]);
          return;
        }
        const events: Event[] = rep.data.map((d: any) => ({
          id: d.idDispo,
          title: "Disponible",
          start: new Date(`${d.dateDispo}T${d.hDeb}`),
          end: new Date(`${d.dateDispo}T${d.hFin}`),
          color: "green",
        }));
        setDispoData(events);
      })
      .catch((err) =>
        console.error(
          "Erreur de chargement dispo",
          err.response?.data || err.message,
        ),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDispo();
  }, []);

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  const getCurrentWeek = (date: Date) => {
    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { monday, sunday };
  };

  const formatTime = (date: Date): string =>
    date.toLocaleTimeString(["fr-FR"], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (event.type === "set" && selectedDate) {
      const formatted = formatTime(selectedDate);

      const formatedDate = formatDate(selectedDate);

      if (pickerMode === "debut") {
        setHeureDebut(formatted);
      } else if (pickerMode === "fin") {
        setHeureFin(formatted);
      } else if (pickerMode === "date") {
        setDateDispo(formatedDate);
      }
    }
  };

  const saveDispo = () => {
    if (!dateDispo || !heureDebut || !heureFin) {
      Alert.alert("Veuillez remplir les champs s'il vous plait!");
    }

    const today = getCurrentWeek(new Date(dateDispo));

    const newDispo: Omit<Dispo, "id"> = {
      dateDispo: dateDispo,
      hdeb: heureDebut,
      hfin: heureFin,
      codeEns: id,
      semaine: `${today.monday.getDate()}-${today.sunday.getDate()}_${today.monday.getMonth() + 1}_${today.monday.getFullYear()}`,
    };

    api
      .post("/disponibilite", newDispo)
      .then((rep) => {
        Alert.alert("Disponibilité ajoutée avec succès");
        loadDispo();
        newDispo.dateDispo = "";
        newDispo.hdeb = "";
        newDispo.hfin = "";
        newDispo.semaine = "";
        newDispo.codeEns = id;
      })
      .catch((err) => {
        console.error("Erreur: ", err.response.data);
      });
  };

  const cancelDispo = () => {
    if (!selectedEvent) return;

    api
      .patch(`/disponibilite/${selectedEvent.id}/annuler`)
      .then(() => {
        Alert.alert("Disponibilité annulée");
        setActionModalVisible(false);
        loadDispo();
      })
      .catch(() => {
        Alert.alert("Erreur", "Impossible d'annuler la disponibilité");
      });
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadDispo()]);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3a5dd9" />
        <Text style={{ marginTop: 10, textAlign: "center" }}>
          Chargement des disponibilités...
        </Text>
      </View>
    );
  }

  if (dispoData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Vous n’avez encore aucune disponibilité enregistrée.
        </Text>
        <Text style={{ marginTop: 8, color: "gray", textAlign: "center" }}>
          Ajoutez vos créneaux pour les voir apparaître ici.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onRefresh}
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          margin: 10,
          backgroundColor: "#2f95dc",
          borderRadius: 8,
          alignSelf: "flex-end",
          marginBottom: 10,
        }}
      >
        <Ionicons name="refresh" size={20} color="#fff" />
        <Text style={{ color: "#fff" }}>Actualiser</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            setDate(
              new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1),
            )
          }
        >
          <Text style={styles.navBtn}>◀</Text>
        </TouchableOpacity>

        <Text style={styles.dateText}>
          {date.toLocaleDateString("fr-FR", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </Text>

        <TouchableOpacity
          onPress={() =>
            setDate(
              new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
            )
          }
        >
          <Text style={styles.navBtn}>▶</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.modeSwitch}>
        {["day", "3days", "week", "month"].map((m) => (
          <TouchableOpacity key={m} onPress={() => setMode(m as Mode)}>
            <Text style={[styles.modeBtn, mode === m && styles.activeMode]}>
              {m}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Calendar
        events={dispoData}
        height={600}
        mode={mode}
        date={date}
        swipeEnabled
        weekStartsOn={1}
        onPressEvent={(event) => {
          setSelectedEvent(event);
          setActionModalVisible(true);
        }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />

          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <Text style={styles.title}>Ajouter une programme</Text>

              <TouchableOpacity
                onPress={() => {
                  setPickerMode("date");
                  setShowTimePicker(true);
                }}
                style={styles.input}
              >
                <Text style={{ color: dateDispo ? "#000" : "#999" }}>
                  {dateDispo || "Date cible"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setPickerMode("debut");
                  setShowTimePicker(true);
                }}
                style={styles.input}
              >
                <Text style={{ color: heureDebut ? "#000" : "#999" }}>
                  {heureDebut || "Heure de début"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setPickerMode("fin");
                  setShowTimePicker(true);
                }}
                style={styles.input}
              >
                <Text style={{ color: heureFin ? "#000" : "#999" }}>
                  {heureFin || "Heure de fin"}
                </Text>
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode={pickerMode === "date" ? "date" : "time"}
                  is24Hour={true}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onChange}
                />
              )}

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  saveDispo();
                  setModalVisible(false);
                }}
              >
                <Text style={styles.addButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={actionModalVisible}
        animationType="fade"
        onRequestClose={() => setActionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.actionModal}>
            <Text style={styles.modalTitle}>Disponibilité</Text>

            <Text style={{ marginBottom: 10 }}>
              {selectedEvent?.start.toLocaleString("fr-FR")} -{" "}
              {selectedEvent?.end.toLocaleTimeString("fr-FR")}
            </Text>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#e74c3c" }]}
              onPress={() => {
                Alert.alert(
                  "Fonctionnalité indisponible",
                  "Cette fonctionnalité n’est pas encore disponible en raison de la complexité de manipulation du projet. Elle sera implémentée ultérieurement.",
                );
              }}
            >
              <Text style={styles.actionBtnText}>Modifier</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActionModalVisible(false)}
              style={[styles.actionBtn, { backgroundColor: "#ccc" }]}
            >
              <Text>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 10, backgroundColor: "#f2f6fc" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  message: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  addButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#2f95dc",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 100,
  },
  navBtn: { fontSize: 20, fontWeight: "bold", color: "#333" },
  dateText: { fontSize: 18, fontWeight: "600", color: "#333" },
  modeSwitch: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  modeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 4,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  activeMode: {
    backgroundColor: "#2196F3",
    color: "#fff",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  calendar: { marginBottom: 10 },
  subtitle: { fontSize: 18, marginBottom: 10, fontWeight: "600" },
  courseItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  courseInfo: {
    flex: 1,
  },
  courseText: { fontSize: 16 },
  input: {
    color: "#333",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: "#2f95dc",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },

  modalContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  actionModal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 40,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  actionBtn: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: "center",
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

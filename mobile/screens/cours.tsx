import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Easing,
  Modal,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import api from "../hooks/api";
import { getUserIdFromToken } from "../decode";
// import Animated from 'react-native-reanimated';
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { usePlanning } from "./utils/PlanningContext";

type coursesList = {
  id: string;
  hDeb: string;
  hFin: string;
  jour: string;
  salle: string;
  localisation: string;
  mention: string;
  niveau: string;
  status: string;
  matiere: string;
  completed: boolean;
  canceled: boolean;
  statusEns: boolean;
};

export default function courses(): React.JSX.Element {
  const [date, setDate] = useState<Date>(new Date());
  const [courses, setCourses] = useState<coursesList[]>([]);
  const [loading, setLoading] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();
  const [refreshing, setRefreshing] = useState(false);
  const { selectedWeek } = usePlanning();

  const formatdate = (date: Date) => {
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    return `${hour}:${minutes}`.padStart(2, "0");
  };

  const getCurrentWeek = (date: Date) => {
    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { monday, sunday };
  };

  useEffect(() => {
    loadCourses();
  }, [selectedWeek]);

  const loadCourses = async () => {
    const today = new Date(selectedWeek);
    const { monday, sunday } = getCurrentWeek(today);

    const start = monday.toISOString().split("T")[0];
    const end = sunday.toISOString().split("T")[0];
    const data = await getUserIdFromToken();
    if (!data || !data.userId) {
      Alert.alert("Erreur", "Utilisateur non authentifié");
      return;
    }
    setLoading(true);

    api
      .get(`/edt/${data.userId}/week_${monday.getDate()}-${sunday.getDate()}`, {
        params: { start, end },
      })
      .then((rep) => {
        console.log("Cours chargés: ", rep.data);
        if (rep.data.length > 0) {
          const cours: coursesList[] = rep.data.map((c: any) => ({
            id: c.numEd,
            hDeb: c.hDeb,
            hFin: c.hFin,
            jour: c.jour,
            matiere: c.nomMatiere,
            status: c.dispo,
            mention: c.mention,
            niveau: c.niveau,
            salle: c.nomSalle,
            localisation: "",
            completed: c.dispo === "Terminé" ? true : false,
            canceled: c.dispo === "Annulé" ? true : false,
            statusEns: c.status === "Accompli" ? true : false,
          }));
          setCourses(cours);
        }
        setCourses((prev) =>
          prev.map((cours) => ({
            ...cours,
            jour: new Date(cours.jour).toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            }),
          })),
        );
      })
      .catch((err) =>
        console.error(
          "Erreur de chargement des cours: ",
          err.response?.data || err.message,
        ),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(500)).current;

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

  const done = (id: string) => {
    setLoadingDone(true);
    api
      .put(`/edt/status/${id}/done`)
      .then(() => {
        loadCourses();
      })
      .catch((err) => {
        console.error("Erreur lors de la mise à jour du cours:", err);
      })
      .finally(() => setLoadingDone(false));
  };

  const toggleComplete = (id: string) => {
    setCourses((prev) =>
      prev.map((cours) =>
        cours.id === id ? { ...cours, completed: !cours.completed } : cours,
      ),
    );
  };

  const getStatus = (cours: coursesList): "Annulé" | "En cours" | "Terminé" => {
    if (cours.completed) return "Terminé";
    if (cours.canceled) return "Annulé";
    // const today = new Date();
    // const target = new Date(cours.jour);
    // if (target > today) return "À venir";
    return "En cours";
  };

  const canceledCours = (id: string) => {
    api
      .put(`/edt/cancel/${id}`)
      .then(() => {
        loadCourses();
      })
      .catch((err) => {
        console.error("Erreur lors de l'annulation du cours:", err);
        Alert.alert(
          "Erreur",
          "Une erreur est survenue lors de l'annulation du cours. Veuillez réessayer.",
        );
      });
  };

  const cancelCours = (id: string) => {
    Alert.alert("Annulation", "Voulez-vous annuler cette cours ?", [
      { text: "Non", style: "cancel" },
      {
        text: "Oui",
        onPress: () => canceledCours(id),
        style: "destructive",
      },
    ]);
  };

  const openCourseMenu = (item: coursesList) => {
    const options = ["⏸ Arrêter le cours", "❌ Annuler le cours", "Fermer"];
    const cancelButtonIndex = 2;
    const destructiveButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (index?: number) => {
        if (index === 0) {
          // TODO: logique arrêter le cours
          Alert.alert("Info", "Cours arrêté (à implémenter côté API)");
        }
        if (index === 1) {
          cancelCours(item.id);
        }
      },
    );
  };

  const [loadingDone, setLoadingDone] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };

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
    <ActionSheetProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <Text style={styles.title}>Liste de mes cours</Text>

        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Vous n'avez pas du cours cette semaine.
            </Text>
          }
          renderItem={({ item }) => {
            const status = getStatus(item);
            const statusColor =
              status === "Terminé"
                ? "#4caf50"
                : status === "En cours"
                  ? "#ff9800"
                  : "#2196f3";

            return (
              <View
                style={[
                  styles.coursItem,
                  item.completed && { backgroundColor: "#e6f4ea" },
                  item.canceled && { backgroundColor: "#fce4e4" },
                ]}
              >
                <View style={styles.coursHeader}>
                  <Text style={styles.coursTitle}>
                    {item.hDeb.slice(0, 5)} à {item.hFin.slice(0, 5)} (
                    {item.matiere})
                  </Text>
                </View>
                <Text style={styles.coursNotes}>
                  {item.mention} {item.niveau} | Salle {item.salle}
                </Text>
                <Text style={styles.coursDate}> {item.jour} </Text>
                <Text style={[styles.coursestatus, { color: statusColor }]}>
                  {status === "Terminé" ? (
                    <Ionicons name="checkmark-done" size={16} color="#4caf50" />
                  ) : status === "En cours" ? (
                    <Ionicons
                      name="play-circle-outline"
                      size={16}
                      color="#ff9800"
                    />
                  ) : (
                    <Ionicons name="close-circle-outline" size={16} color="#2196f3" />
                  )}{" "}
                  {status}
                </Text>

                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  {!item.completed ||
                    (!item.canceled && (
                      <TouchableOpacity
                        onPress={() => done(item.id)}
                        style={styles.completeButton}
                        disabled={loadingDone}
                      >
                        {loadingDone ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <>
                            <Ionicons
                              name="checkmark-done"
                              size={18}
                              color="#fff"
                            />
                            <Text style={styles.completeText}>
                              Marquer comme fait
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    ))}

                  {!item.completed ||
                    (!item.canceled && (
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => cancelCours(item.id)}
                      >
                        <Text style={styles.cancelText}>Annuler</Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </View>
            );
          }}
        />
      </KeyboardAvoidingView>
    </ActionSheetProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f2f6fc" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: "#e3e8ef",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  dateText: { fontSize: 16 },

  coursItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 6,
    marginBottom: 10,
  },
  coursTitle: { fontWeight: "bold", color: "#555", fontSize: 18 },
  coursNotes: { fontSize: 14, color: "#555" },
  doneText: { color: "green", fontWeight: "bold", marginTop: 5 },

  addButton: {
    marginTop: 20,
    backgroundColor: "#2f95dc",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
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
  coursHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  coursDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  coursestatus: {
    fontWeight: "bold",
    marginTop: 6,
  },
  completeButton: {
    marginTop: 10,
    backgroundColor: "#4caf50",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "#e53935",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  stopButton: {
    marginTop: 10,
    backgroundColor: "#ff9800",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  stopText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
  },
  cancelText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
  },
  completeText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
  },
});

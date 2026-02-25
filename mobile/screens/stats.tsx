import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import api from "../hooks/api";
import { getUserIdFromToken } from "../decode";
import { RefreshControl } from "react-native";

interface MatiereInfo {
  matiere: string;
  hEffectue: number;
  hPrevue: number;
}

interface Enseignant {
  nom: string;
  prenom: string;
  email: string;
  grade: string;
  matiereInfo: MatiereInfo[];
}

export default function App() {
  const [subjectData, setSubjectData] = useState<Enseignant[]>([]);
  const [loading, setLoading] = useState(false);

  const loadStates = async () => {
    setLoading(true);
    const user = await getUserIdFromToken();
    if (!user?.userId) {
      Alert.alert("Erreur", "Utilisateur non authentifié");
      setLoading(false);
      return;
    }

    api
      .get(`/utilisateur/teacher/info/${user.userId}`)
      .then((rep) => {
        // Alert.alert("Données chargées!", JSON.stringify(rep.data));
        setSubjectData(rep.data);
      })
      .catch((err) => {
        console.error("Erreur: ", err.message);
        Alert.alert("Erreur de chargement", err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStates();
  }, []);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadStates()]);
    } finally {
      setRefreshing(false);
    }
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

  if (subjectData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Vous n’avez encore aucune disponibilité enregistrée.
        </Text>
        {/* <Text style={{ marginTop: 8, color: "gray", textAlign: "center" }}>
          Ajoutez vos créneaux pour les voir apparaître ici.
        </Text> */}
      </View>
    );
  }

  const matiereInfo = Array.isArray(subjectData[0]?.matiereInfo)
    ? subjectData[0].matiereInfo
    : [];

  const safeChartData = matiereInfo
    .map((s) => ({
      label: s.matiere ?? "Inconnu",
      value: typeof s.hEffectue === "number" ? s.hEffectue : 0,
      hPrevue: typeof s.hPrevue === "number" ? s.hPrevue : 0,
    }))
    .filter((s) => s.value > 0);

  const labels = safeChartData.map((s) => s.label);
  const dataDone = safeChartData.map((s) => s.value);

  // const labels = subjectData[0]?.matiereInfo?.map((s) => s.matiere);
  // const dataDone = subjectData[0]?.matiereInfo?.map((s) => s.hEffectue);

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
      <View style={{ padding: 8 }}>
        <Text style={styles.title}>Performance hebdomadaire</Text>

        {dataDone.length > 0 ? (
          <LineChart
            data={{
              labels,
              datasets: [{ data: dataDone }],
            }}
            width={Dimensions.get("window").width - 16}
            height={300}
            yAxisSuffix="h"
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#f9f9f9",
              backgroundGradientTo: "#f1f1f1",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
              labelColor: () => "#333",
              propsForDots: {
                r: "3",
                strokeWidth: "1",
                stroke: "#007bff",
              },
            }}
            style={styles.chart}
            bezier
          />
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Données insuffisantes pour afficher le graphique
          </Text>
        )}

        {matiereInfo.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Aucune matière disponible
          </Text>
        )}

        {matiereInfo.map((s, index) => {
          const hEffectue = typeof s.hEffectue === "number" ? s.hEffectue : 0;
          const hPrevue = typeof s.hPrevue === "number" ? s.hPrevue : 0;

          const remaining = hPrevue - hEffectue;
          const completed = hEffectue >= hPrevue && hPrevue > 0;

          return (
            <View key={index} style={styles.card}>
              <View style={[styles.colorBar, { backgroundColor: "#ab5" }]} />

              <View style={{ flex: 1 }}>
                <Text style={styles.subjectName}>{s.matiere ?? "Inconnu"}</Text>
                <Text style={styles.details}>EC : {hPrevue}h</Text>
                <Text style={styles.details}>
                  Accompli : {hEffectue}h | Restant : {remaining}h
                </Text>
              </View>

              {completed && <Text style={styles.completeBadge}>Complété</Text>}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f2f6fc" },
  colorBar: {
    width: 10,
    height: "100%",
    borderRadius: 4,
    marginRight: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  chart: {
    marginVertical: 16,
    borderRadius: 16,
  },
  completeBadge: {
    backgroundColor: "#2ecc71",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    color: "white",
    fontSize: 12,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },
  subjectName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  details: {
    fontSize: 14,
    color: "#555",
  },
});

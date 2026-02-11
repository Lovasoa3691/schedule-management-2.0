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
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import api from "../hooks/api";

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

  const loadStates = () => {
    api
      .get("/utilisateur/teacher/info/98421799-1f02-4c1a-9bfe-ebe00d327004")
      .then((rep) => {
        setSubjectData(rep.data);
      })
      .catch((err) => console.error("Erreur: ", err.message));
  };

  useEffect(() => {
    loadStates();
  }, []);

  if (subjectData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chargement des données...</Text>
      </View>
    );
  }

  const labels = subjectData[0]?.matiereInfo?.map((s) => s.matiere);
  const dataDone = subjectData[0]?.matiereInfo?.map((s) => s.hEffectue);

  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 8 }}>
        <Text style={styles.title}>Performance hebdomadaire</Text>

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
            style: { borderRadius: 16 },
          }}
          style={styles.chart}
          bezier
        />

        {subjectData[0]?.matiereInfo?.map((s, index) => {
          const remaining = s.hPrevue - s.hEffectue;
          const completed = s.hEffectue >= s.hPrevue;

          return (
            <View key={index} style={styles.card}>
              <View style={[styles.colorBar, { backgroundColor: "#ab5" }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.subjectName}>{s.matiere}</Text>
                <Text style={styles.details}>Crédit total : {s.hPrevue}h</Text>
                <Text style={styles.details}>
                  Accompli : {s.hEffectue}h | Restant : {remaining}h
                </Text>
              </View>

              <View>
                {completed && (
                  <Text
                    style={{
                      backgroundColor: "#2ecc71",
                      padding: 3,
                      borderRadius: 6,
                      color: "white",
                      width: 90,
                      textAlign: "center",
                    }}
                  >
                    {" "}
                    Complete
                  </Text>
                )}
              </View>
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

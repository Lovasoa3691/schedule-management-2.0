// UserProfile.tsx
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import api from "../hooks/api";
import { AuthContext } from "./utils/AuthContext";
import { getUserIdFromToken } from "../decode";

interface User {
  nom: string;
  prenom: string;
  email: string;
  avatarUrl?: string;
}

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const user = await getUserIdFromToken();
      if (!user?.userId) {
        Alert.alert("Erreur", "Utilisateur non authentifié");
        // setLoading(false);
        return;
      }
      // Alert.alert("Utilisateur: ", user.email);

      api
        .get(`/user/info?id=${user.userId}&role=${user.role}`)
        .then((res) => {
          console.log(res.data);
          setUser({
            nom: res.data[0]?.nom || "Utilisateur inconnu",
            prenom: res.data[0]?.prenom || "",
            email: res.data[0]?.email || "Email non disponible",
            avatarUrl: "https://avatars.githubusercontent.com/u/105380583?v=4",
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

  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await api.post("/user/logout");
      logout();
      //   Alert.alert("Déconnexion", "Vous êtes maintenant déconnecté");
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la déconnexion. Veuillez réessayer.",
      );
    } finally {
      setLoading(false);
    }
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchUser()]);
    } finally {
      setRefreshing(false);
    }
  };

  const Option = ({
    iconName,
    label,
    onPress,
    color,
    loading,
  }: {
    iconName: string;
    label: string;
    onPress: () => void;
    color?: string;
    loading?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={onPress}
      disabled={loading}
    >
      <View style={styles.optionLeft}>
        <Ionicons name={iconName as any} size={24} color={color || "#4e73df"} />
        {loading ? (
          <ActivityIndicator
            size="small"
            color={color || "#4e73df"}
            style={{ marginLeft: 15 }}
          />
        ) : (
          <Text style={[styles.optionText, { color: color || "#000" }]}>
            {label}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#aaa" />
    </TouchableOpacity>
  );

  if (!user)
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );

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
      <View style={styles.header}>
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.initials}>
              {user.prenom
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.name}>{user.prenom}</Text>
        <View style={styles.emailContainer}>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>

      <View style={styles.optionsContainer}>
        <Option
          iconName="pencil-outline"
          label="Modifier le profil"
          onPress={() => Alert.alert("Edit Profile")}
        />
        <Option
          iconName="lock-closed-outline"
          label="Ajouter un pin"
          onPress={() => Alert.alert("Add Pin")}
        />
        <Option
          iconName="settings-outline"
          label="Paramètres"
          onPress={() => Alert.alert("Settings")}
        />
        {/* <Option
          iconName="person-add-outline"
          label="Invite a friend"
          onPress={() => Alert.alert("Invite")}
        /> */}
        <Option
          iconName="log-out-outline"
          color="#ff5c5c"
          onPress={handleLogout}
          label="Déconnexion"
          loading={loading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa" },
  header: { alignItems: "center", paddingVertical: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: {
    backgroundColor: "#4e73df",
    justifyContent: "center",
    alignItems: "center",
  },
  initials: { color: "white", fontSize: 36, fontWeight: "bold" },
  name: { fontSize: 22, fontWeight: "600", marginTop: 10 },
  emailContainer: {
    backgroundColor: "#dbe5f7",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 30,
  },
  email: { color: "#1a3e8c" },
  optionsContainer: {
    marginTop: 30,
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 15,
    overflow: "hidden",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  optionLeft: { flexDirection: "row", alignItems: "center" },
  optionText: { marginLeft: 15, fontSize: 16 },
});

export default UserProfile;

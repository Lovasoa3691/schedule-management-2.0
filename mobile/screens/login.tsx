import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";
import api from "../hooks/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { AuthContext } from "./utils/AuthContext";
import { getUserIdFromToken } from "../decode";
import { jwtDecode } from "jwt-decode";

type Props = {
  onLoginSucces: () => void;
};

export default function LoginScreen() {
  const { setAuthenticated } = useContext(AuthContext);

  const [rememberMe, setRememberMe] = React.useState(false);
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await api.post<{
        email: string;
        role: string;
        token: string;
      }>("/utilisateur/login", {
        email,
        mdp,
        client: "mobile",
      });

      const token = response.data.token;
      const decoded = jwtDecode<{ userId?: string; role?: string }>(token);
      if (decoded.role !== "Enseignant") {
        Alert.alert(
          "Accès refusé",
          "Seuls les enseignants peuvent se connecter.",
        );
        return;
      }

      await AsyncStorage.setItem("jwt", token);

      const profile = await api.get<{ userId: string; userRole: string }>(
        "/utilisateur/profile",
      );
      await AsyncStorage.setItem("userId", profile.data.userId);

      setAuthenticated(true);
    } catch (err: any) {
      const message = err.response?.data || err.message || "Erreur inconnue";
      Alert.alert("Erreur de connexion", message.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.card}> */}
      <View style={styles.logoCard}>
        <Image
          source={require("../assets/image/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.appName}>
          Sched<Text style={styles.appNameHighlight}>Connect</Text>
        </Text>
      </View>
      <Text style={styles.title}>Connectez-vous à votre compte</Text>

      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={20} color="#666" />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={"gray"}
          style={styles.input}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={20} color="#666" />
        <TextInput
          placeholder="*********"
          value={mdp}
          onChangeText={setMdp}
          placeholderTextColor={"gray"}
          style={styles.input}
          secureTextEntry
        />
        <Icon name="eye-outline" size={20} color="#ccc" />
      </View>

      <View style={styles.row}>
        <View style={styles.remember}>
          {/* <CheckBox
              value={rememberMe}
              onValueChange={setRememberMe}
            /> */}
          <Text style={styles.rememberText}>Souvenir de moi</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.replace("Home")}>
          <Text style={styles.link}>Mot de passe oublié?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.loginText}>Se connecter</Text>
        )}
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={styles.signup}>N'a pas encore un compte?</Text>
        <TouchableOpacity>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Register")}
          >
            S'inscrire
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    justifyContent: "center",
    padding: 25,
  },
  card: {
    backgroundColor: "#fff",
    padding: 25,
    width: "85%",
    borderRadius: 15,
    elevation: 10,
    shadowColor: "#000",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    color: "#666",
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  remember: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    marginLeft: 5,
    fontSize: 14,
  },
  link: {
    marginTop: 20,
    color: "#3a5dd9",
    fontWeight: "700",
  },
  loginButton: {
    backgroundColor: "#3a5dd9",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  signup: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  or: {
    marginHorizontal: 8,
    color: "#888",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  socialButton: {
    backgroundColor: "#fff",
    borderRadius: 50,
    // padding: 10,
    elevation: 3,
  },
  socialIcon: {
    width: 35,
    height: 35,
  },
  logoCard: {
    alignItems: "center",
    marginBottom: 30,
  },

  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },

  appName: {
    fontSize: 37,
    fontWeight: "bold",
  },

  appNameHighlight: {
    color: "blue",
  },
});

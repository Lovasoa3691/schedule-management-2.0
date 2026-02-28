import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  //   CheckBox,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";
import axios from "axios";
import api from "../hooks/api";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [confirmMdp, setConfirmMdp] = useState("");

  const [loading, setLoading] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleRegister = async () => {
    if (mdp !== confirmMdp) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }

    const data = {
      email: email,
      mdp: mdp,
    };

    try {
      setLoading(true);

      const rep = await api.post("/user/register", data);

      Alert.alert(
        "Votre compte est activé!",
        "Vous pouvez maintenant vous connecter.",
      );
    } catch (err: any) {
      if (err.response) {
        console.error("Status:", err.response.status, err.response.data);
        Alert.alert(
          "Erreur d'activation",
          err.response.data?.message || "Une erreur est survenue",
        );
      } else {
        console.error("Erreur:", err.message);
        Alert.alert("Erreur", "Une erreur est survenue lors de l'inscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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

      <Text style={styles.title}>Activation de compte</Text>

      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={20} color="#666" />
        <TextInput
          placeholder="-- Email --"
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
          placeholder="Mot de passe"
          value={mdp}
          onChangeText={setMdp}
          placeholderTextColor={"gray"}
          style={styles.input}
          secureTextEntry
        />
        <Icon name="eye-outline" size={20} color="#ccc" />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={20} color="#666" />
        <TextInput
          placeholder="Confirmation"
          onChangeText={setConfirmMdp}
          placeholderTextColor={"gray"}
          style={styles.input}
          secureTextEntry
        />
        <Icon name="eye-outline" size={20} color="#ccc" />
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.loginText}>Activer</Text>
        )}
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={styles.signup}>Déjà un compte ?</Text>
        <TouchableOpacity>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Login")}
          >
            Se connecter
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
    width: 70,
    height: 70,
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

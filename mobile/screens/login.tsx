import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";
import api from "../hooks/api";

type Props = {
  onLoginSucces: () => void;
};

export default function LoginScreen({ onLoginSucces }: Props) {
  const [rememberMe, setRememberMe] = React.useState(false);
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogin = () => {
    api
      .post(
        "/utilisateur/login",
        { email: email, mdp: mdp, role: "enseignant" }
      )
      .then((rep) => {
        api
          .get("/utilisateur/profile")
          .then((rep) => {
            console.log(rep.data);
            onLoginSucces();
          })
          .catch((err) => {
            console.error(err.message);
          });
      })
      .catch((err) => {
        Alert.alert(err.response.data);
        console.log("Erreur: ", err);
      });
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.card}> */}
      <View style={styles.logoCard}>
        <Text style={{ fontSize: 40, fontWeight: "bold", alignSelf: "center" }}>
          Sched.<Text style={{ color: "blue" }}>Connect</Text>
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

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Se connecter</Text>
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

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.or}>ou connecte avec</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../assets/image/facebook.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../assets/image/google.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../assets/image/github.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
      </View>
      {/* </View> */}
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
    color: "#3a5dd9",
    fontWeight: "500",
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
    paddingBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
});

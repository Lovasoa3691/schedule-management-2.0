import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ListRenderItem,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
};

export default function ChatScreen(): React.JSX.Element {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "👋 Bonjour ! Je suis ton assistant IA. Que veux-tu faire aujourd’hui ?",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = (text: string): void => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const response = getBotResponse(text);
      const botMessage: Message = {
        id: Date.now().toString(),
        sender: "bot",
        text: response,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const getBotResponse = (userText: string): string => {
    const t = userText.toLowerCase();

    if (t.includes("réviser") || t.includes("qcm")) {
      return "📚 Très bien ! Quelle matière veux-tu réviser ? Par exemple : Maths, Info, Histoire.";
    } else if (t.includes("math")) {
      return "🧠 Question : Quelle est la dérivée de f(x) = x² ?\nA. 2x\nB. x\nC. x³";
    } else if (t.includes("plan")) {
      return "📅 Tu as un cours demain à 9h. Je te recommande de réviser ce soir vers 20h.";
    } else if (t.includes("conseil")) {
      return "✅ Conseil : 25 min de révision, puis pause de 5 min (méthode Pomodoro).";
    } else if (t.includes("rappel")) {
      return "🔔 Je peux te rappeler de réviser à 18h. (Simulé ici)";
    } else {
      return "🤖 Je n’ai pas compris, mais je peux t’aider à planifier ou réviser. Dis 'réviser' ou 'conseil'.";
    }
  };

  const renderItem: ListRenderItem<Message> = ({ item }) => (
    <View
      style={[
        styles.message,
        item.sender === "user" ? styles.userMsg : styles.botMsg,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messages}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Écris un message..."
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          onPress={() => sendMessage(input)}
          style={styles.sendButton}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fbfd" },
  messages: { padding: 16, paddingBottom: 20 },
  message: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMsg: {
    backgroundColor: "#d1f8d4",
    alignSelf: "flex-end",
  },
  botMsg: {
    backgroundColor: "#e6e8ec",
    alignSelf: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopColor: "#eee",
    borderTopWidth: 1,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f1f3f6",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#2f95dc",
    borderRadius: 25,
    padding: 10,
  },
});

import Ionicons from "react-native-vector-icons/Ionicons";
import { RouteProp } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from "@react-navigation/drawer";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { Text, TouchableOpacity, View } from "react-native";
import Dashboard from "./dasboard";
import StatsScreen from "./stats";
import Revision from "./cours";
import DisponibilityCalendar from "./disponibility";

type RootTabParamList = {
  Dashboard: undefined;
  Statistiques: undefined;
  Disponibilité: undefined;
  Messages: undefined;
  Notifications: undefined;
  Cours: undefined;
  Profile: undefined;
  Historique: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <View style={{ flexDirection: "row", marginRight: 0 }}>
              <TouchableOpacity
                // onPress={() => navigation.navigate("Messages")}
                style={{ marginHorizontal: 10 }}
              >
                <Ionicons name="chatbubble-outline" size={24} color={"#000"} />
              </TouchableOpacity>
              <TouchableOpacity
                // onPress={() => navigation.navigate("Notifications")}
                style={{ marginHorizontal: 10 }}
              >
                <Ionicons name="notifications-outline" size={24} color="#000" />
              </TouchableOpacity>

              <TouchableOpacity
                // onPress={() => navigation.navigate("Profile")}
                style={{ marginHorizontal: 10 }}
              >
                <Ionicons name="person-outline" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

export function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }): BottomTabNavigationOptions => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = "";

          if (route.name === "Dashboard")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Statistiques")
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          else if (route.name === "Disponibilité")
            iconName = focused ? "time" : "time-outline";
          else if (route.name === "Messages")
            iconName = focused ? "chatbubble" : "chatbubble-outline";
          else if (route.name === "Notifications")
            iconName = focused ? "notifications" : "notifications-outline";
          else if (route.name === "Historique")
            iconName = focused ? "Historique" : "notifications-outline";
          else if (route.name === "Profile")
            iconName = focused ? "person" : "person-outline";
          else if (route.name === "Cours")
            iconName = focused ? "book" : "book-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2f95dc",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Cours" component={Revision} />
      <Tab.Screen name="Disponibilité" component={DisponibilityCalendar} />
      {/* <Tab.Screen name="Messages" component={Revision} />
      <Tab.Screen name="Notifications" component={ChatScreen} /> */}

      <Tab.Screen name="Statistiques" component={StatsScreen} />
      {/* <Tab.Screen name="Historique" component={ChatScreen} /> */}
    </Tab.Navigator>
  );
}

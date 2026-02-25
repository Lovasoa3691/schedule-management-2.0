import { Ionicons } from "@expo/vector-icons";
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
import UserProfile from "./profile";
import { PlanningProvider } from "./utils/PlanningContext";
import WeekFilter from "../components/weekfilter";

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
    <PlanningProvider>
      <Stack.Navigator initialRouteName="SchedConnect">
        <Stack.Screen
          name="SchedConnect"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerRight: () => <WeekFilter />,
          })}
        />
      </Stack.Navigator>
    </PlanningProvider>
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

          return <Ionicons name={iconName as any} size={size} color={color} />;
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
      <Tab.Screen name="Profile" component={UserProfile} />
    </Tab.Navigator>
  );
}

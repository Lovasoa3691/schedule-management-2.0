import { View, TouchableOpacity, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { usePlanning } from "../screens/utils/PlanningContext";

const WeekFilter = () => {
  const { selectedWeek, setSelectedWeek } = usePlanning();
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={{ marginRight: 10 }}>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <Ionicons name="calendar-outline" size={26} color="#197003" />
        <Text style={{ marginLeft: 6 }}>
          {selectedWeek.toLocaleDateString("fr-FR")}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={selectedWeek}
          mode="date"
          display="calendar"
          onChange={(_, date) => {
            setShowPicker(false);
            if (date) {
              const safeDate = new Date(date);
              safeDate.setHours(12, 0, 0, 0);
              setSelectedWeek(safeDate);
            }
          }}
        />
      )}
    </View>
  );
};

export default WeekFilter;

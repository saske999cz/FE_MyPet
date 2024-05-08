import { View, Text, Image } from "react-native";
import { Tabs, Redirect } from "expo-router";
import { icons } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const TabIcon = ({ icon, name, color, focused }) => {
  return (
    <View className="items-center justify-center gap-1">
      <FontAwesomeIcon icon={icon} size={20} style={{ color: color }} />
      <Text
        className={`text-[10px]`}
        style={focused ? { color: color } : { color: "#374151" }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#fb923c",
          tabBarInactiveTintColor: "#CDCDE0",
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.faHome}
                name="Home"
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="market"
          options={{
            title: "Market",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.faStore}
                name="Market"
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="adopt"
          options={{
            title: "Adopt",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.faPaw}
                name="Adopt"
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="appointment"
          options={{
            title: "Appointment",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.faCalendarCheck}
                name="Appointment"
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: "Menu",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.faBars}
                name="Menu"
                color={color}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;

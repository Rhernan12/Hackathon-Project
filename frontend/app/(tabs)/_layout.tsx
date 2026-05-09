import { Tabs } from "expo-router";
import React from "react";

import { Feather, FontAwesome6, AntDesign } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#6366f1",
        },
        headerTitleStyle: {
          fontFamily: "Poppins-Medium",
        },
        headerTintColor: "#ffffff",

        headerShown: true,
        tabBarStyle: {
          backgroundColor: "#6366f1",
          borderTopWidth: 0,
          elevation: 10,
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#1e293b",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={28} name="house-chimney" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="action"
        options={{
          title: "Upload",
          tabBarIcon: ({ color }) => (
            <AntDesign size={28} name="upload" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Feather size={28} name="settings" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

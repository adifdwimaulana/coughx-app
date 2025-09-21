import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

const COLORS = {
  primary: "#16A34A",
  accent: "#0EA5E9",
  neutral: "#64748B",
  white: "#FFFFFF",
  background: "#F8FAFC",
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.neutral,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: "#E2E8F0",
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 25,
          paddingTop: 5,
          paddingHorizontal: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        headerShown: false,
        tabBarHideOnKeyboard: false,
      }}
    >
      <Tabs.Screen
        name="screening"
        options={{
          title: "Skrining",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medical-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Riwayat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

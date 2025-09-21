import { Stack } from "expo-router";

export default function ProfileStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Profil" }} />
      <Stack.Screen name="legal" options={{ title: "Legal" }} />
    </Stack>
  );
}

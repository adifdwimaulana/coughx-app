import { Stack } from "expo-router";

export default function ScreeningStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Skrining" }} />
      <Stack.Screen name="anamnesis" options={{ title: "Anamnesis" }} />
      <Stack.Screen name="record" options={{ title: "Rekam" }} />
      <Stack.Screen name="referral" options={{ title: "Rujukan" }} />
      <Stack.Screen name="results" options={{ title: "Hasil" }} />
    </Stack>
  );
}

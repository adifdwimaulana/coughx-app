import { Stack } from "expo-router";

export default function HistoryStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Riwayat" }} />
      <Stack.Screen name="detail" options={{ title: "Detail" }} />
    </Stack>
  );
}

import { Ionicons } from "@expo/vector-icons";
// import { Audio } from "expo-audio";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const COLORS = {
  primary: "#16A34A",
  accent: "#0EA5E9",
  danger: "#DC2626",
  neutral: "#64748B",
  white: "#FFFFFF",
  background: "#F8FAFC",
  text: "#1E293B",
  textLight: "#64748B",
  border: "#E2E8F0",
  success: "#10B981",
  warning: "#F59E0B",
};

export default function ScreeningIntro() {
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean | null>(
    null
  );
  const [hasMediaPermission, setHasMediaPermission] = useState<boolean | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    // try {
    //   console.log('Checking audio and media permissions...');
    //   // Check audio recording permissions
    //   const audioPermission = await Audio.getPermissionsAsync();
    //   console.log('Audio permission status:', audioPermission.status);
    //   setHasAudioPermission(audioPermission.granted);
    //   // Check media library permissions
    //   const mediaPermission = await MediaLibrary.getPermissionsAsync();
    //   console.log('Media permission status:', mediaPermission.status);
    //   setHasMediaPermission(mediaPermission.granted);
    // } catch (error) {
    //   console.error('Error checking permissions:', error);
    //   setHasAudioPermission(false);
    //   setHasMediaPermission(false);
    // }
  };

  // const requestPermissions = async () => {
  //   try {
  //     setIsLoading(true);
  //     console.log("Requesting permissions...");

  //     // Request audio recording permissions
  //     const audioResult = await Audio.requestPermissionsAsync();
  //     console.log("Audio permission result:", audioResult);
  //     setHasAudioPermission(audioResult.granted);

  //     // Request media library permissions
  //     const mediaResult = await MediaLibrary.requestPermissionsAsync();
  //     console.log("Media permission result:", mediaResult);
  //     setHasMediaPermission(mediaResult.granted);

  //     if (audioResult.granted && mediaResult.granted) {
  //       Alert.alert(
  //         "Izin Diberikan",
  //         "Sekarang Anda dapat memulai perekaman suara batuk.",
  //         [{ text: "OK" }]
  //       );
  //     } else {
  //       Alert.alert(
  //         "Izin Diperlukan",
  //         "Aplikasi membutuhkan akses mikrofon dan media untuk merekam suara batuk. Silakan berikan izin di pengaturan.",
  //         [{ text: "OK" }]
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error requesting permissions:", error);
  //     Alert.alert("Error", "Terjadi kesalahan saat meminta izin mikrofon.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const startRecording = async () => {
    if (!hasAudioPermission || !hasMediaPermission) {
      // await requestPermissions();
      return;
    }

    console.log("Starting recording flow...");
    router.push("/(tabs)/screening/record");
  };

  const permissionsGranted = hasAudioPermission && hasMediaPermission;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Skrining TB</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="mic-outline" size={80} color={COLORS.primary} />
        </View>

        <Text style={styles.title}>Rekam Suara Batuk</Text>

        <Text style={styles.description}>
          Untuk memulai skrining TB, Anda perlu merekam suara batuk sebanyak 3
          kali. Pastikan lingkungan tenang dan mikropon perangkat berfungsi
          dengan baik.
        </Text>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Instruksi Perekaman:</Text>

          <View style={styles.instruction}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              Cari tempat yang tenang dan bebas dari gangguan suara
            </Text>
          </View>

          <View style={styles.instruction}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              Pegang perangkat 15-20 cm dari mulut Anda
            </Text>
          </View>

          <View style={styles.instruction}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>
              Batuk dengan suara yang jelas dan alami (jangan dipaksakan)
            </Text>
          </View>

          <View style={styles.instruction}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <Text style={styles.instructionText}>
              Ulangi sebanyak 3 kali dengan jeda beberapa detik
            </Text>
          </View>
        </View>

        {(!hasAudioPermission || !hasMediaPermission) && (
          <View style={styles.permissionAlert}>
            <Ionicons
              name="alert-circle-outline"
              size={24}
              color={COLORS.warning}
            />
            <Text style={styles.permissionAlertText}>
              Izin mikrofon dan media diperlukan untuk perekaman
            </Text>
          </View>
        )}

        <View style={styles.permissionStatus}>
          <View style={styles.permissionItem}>
            <Ionicons
              name={hasAudioPermission ? "checkmark-circle" : "close-circle"}
              size={20}
              color={hasAudioPermission ? COLORS.success : COLORS.danger}
            />
            <Text style={styles.permissionText}>
              Mikrofon: {hasAudioPermission ? "Diizinkan" : "Belum diizinkan"}
            </Text>
          </View>

          <View style={styles.permissionItem}>
            <Ionicons
              name={hasMediaPermission ? "checkmark-circle" : "close-circle"}
              size={20}
              color={hasMediaPermission ? COLORS.success : COLORS.danger}
            />
            <Text style={styles.permissionText}>
              Media: {hasMediaPermission ? "Diizinkan" : "Belum diizinkan"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={startRecording}
          style={[
            styles.startButton,
            !permissionsGranted && styles.startButtonDisabled,
          ]}
          disabled={isLoading}
        >
          <Ionicons
            name={permissionsGranted ? "mic" : "settings-outline"}
            size={24}
            color={COLORS.white}
          />
          <Text style={styles.startButtonText}>
            {isLoading
              ? "Meminta izin..."
              : permissionsGranted
              ? "Mulai Perekaman"
              : "Berikan Izin Mikrofon"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  instructionsContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: COLORS.neutral,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  instruction: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  permissionAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.warning + "20",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  permissionAlertText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.warning,
    marginLeft: 12,
    fontWeight: "500",
  },
  permissionStatus: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 34,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
    minHeight: 56,
  },
  startButtonDisabled: {
    backgroundColor: COLORS.neutral,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
});

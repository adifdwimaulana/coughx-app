import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Audio } from "expo-audio";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
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

interface Recording {
  id: string;
  uri: string;
  duration: number;
  quality: number;
}

export default function RecordingScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  // const [currentRecording, setCurrentRecording] =
  //   useState<Audio.Recording | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [sessionId, setSessionId] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const animatedScale = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    initSession();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      // stopRecording();
    };
  }, []);

  const initSession = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/screening/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const session = await response.json();
        setSessionId(session.id);
        await AsyncStorage.setItem("currentSessionId", session.id);
        console.log("Session started:", session.id);
      }
    } catch (error) {
      console.error("Error starting session:", error);
      Alert.alert("Error", "Gagal memulai sesi perekaman. Silakan coba lagi.");
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedScale, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animatedScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    animatedScale.setValue(1);
  };

  // const startRecording = async () => {
  //   try {
  //     if (recordings.length >= 3) {
  //       Alert.alert('Batas Tercapai', 'Anda sudah merekam 3 kali. Silakan lanjut ke tahap berikutnya.');
  //       return;
  //     }

  //     console.log('Starting recording...');

  //     // Check permissions first
  //     const permission = await Audio.getPermissionsAsync();
  //     if (!permission.granted) {
  //       const newPermission = await Audio.requestPermissionsAsync();
  //       if (!newPermission.granted) {
  //         Alert.alert('Error', 'Izin mikrofon diperlukan untuk perekaman.');
  //         return;
  //       }
  //     }

  //     // Create and start recording
  //     const recording = new Audio.Recording();
  //     await recording.prepareToRecordAsync({
  //       isMeteringEnabled: true,
  //       android: {
  //         extension: '.m4a',
  //         outputFormat: Audio.AndroidOutputFormat.MPEG_4,
  //         audioEncoder: Audio.AndroidAudioEncoder.AAC,
  //         sampleRate: 44100,
  //         numberOfChannels: 2,
  //         bitRate: 128000,
  //       },
  //       ios: {
  //         extension: '.m4a',
  //         outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
  //         audioQuality: Audio.IOSAudioQuality.MEDIUM,
  //         sampleRate: 44100,
  //         numberOfChannels: 2,
  //         bitRate: 128000,
  //         linearPCMBitDepth: 16,
  //         linearPCMIsBigEndian: false,
  //         linearPCMIsFloat: false,
  //       },
  //       web: {
  //         mimeType: 'audio/webm',
  //         bitsPerSecond: 128000,
  //       },
  //     });

  //     await recording.startAsync();
  //     console.log('Recording started');

  //     setCurrentRecording(recording);
  //     setIsRecording(true);
  //     setRecordingDuration(0);
  //     startPulseAnimation();

  //     // Start timer
  //     timerRef.current = setInterval(() => {
  //       setRecordingDuration(prev => prev + 0.1);
  //     }, 100);

  //   } catch (error) {
  //     console.error('Error starting recording:', error);
  //     Alert.alert('Error', 'Gagal memulai perekaman. Silakan coba lagi.');
  //   }
  // };

  // const stopRecording = async () => {
  //   try {
  //     if (!currentRecording || !isRecording) return;

  //     console.log("Stopping recording...");

  //     if (timerRef.current) {
  //       clearInterval(timerRef.current);
  //       timerRef.current = null;
  //     }

  //     await currentRecording.stopAndUnloadAsync();
  //     const uri = currentRecording.getURI();

  //     setIsRecording(false);
  //     stopPulseAnimation();

  //     if (uri && recordingDuration >= 1.0) {
  //       const newRecording: Recording = {
  //         id: Date.now().toString(),
  //         uri,
  //         duration: recordingDuration,
  //         quality: Math.random() * 0.4 + 0.6, // Mock quality between 0.6-1.0
  //       };

  //       console.log("Recording saved:", newRecording);
  //       setRecordings((prev) => [...prev, newRecording]);
  //       await uploadRecording(newRecording);
  //     } else {
  //       Alert.alert(
  //         "Perekaman Terlalu Pendek",
  //         "Durasi perekaman minimal 1 detik. Silakan coba lagi.",
  //         [{ text: "OK" }]
  //       );
  //     }

  //     setCurrentRecording(null);
  //     setRecordingDuration(0);
  //   } catch (error) {
  //     console.error("Error stopping recording:", error);
  //     Alert.alert("Error", "Gagal menghentikan perekaman.");
  //   }
  // };

  const uploadRecording = async (recording: Recording) => {
    try {
      setIsUploading(true);

      // Convert audio to base64 (mock implementation for now)
      const audioBase64 = `data:audio/m4a;base64,${Date.now()}mock_audio_data_${Math.random()}`;

      console.log("Uploading recording to session:", sessionId);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/screening/audio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
            audio_data: audioBase64,
            duration: recording.duration,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Audio uploaded successfully:", result);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading recording:", error);
      Alert.alert(
        "Error",
        "Gagal mengunggah rekaman. Data akan disimpan lokal."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const deleteRecording = (recordingId: string) => {
    Alert.alert(
      "Hapus Rekaman",
      "Apakah Anda yakin ingin menghapus rekaman ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => {
            setRecordings((prev) => prev.filter((r) => r.id !== recordingId));
          },
        },
      ]
    );
  };

  const proceedToAnamnesis = () => {
    if (recordings.length === 0) {
      Alert.alert(
        "Tidak Ada Rekaman",
        "Anda perlu merekam setidaknya 1 kali sebelum melanjutkan.",
        [{ text: "OK" }]
      );
      return;
    }

    console.log(
      "Proceeding to anamnesis with",
      recordings.length,
      "recordings"
    );
    router.push("/(tabs)/screening/anamnesis");
  };

  const formatDuration = (seconds: number) => {
    return `${seconds.toFixed(1)}s`;
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 0.8) return COLORS.success;
    if (quality >= 0.6) return COLORS.warning;
    return COLORS.danger;
  };

  const getQualityText = (quality: number) => {
    if (quality >= 0.8) return "Baik";
    if (quality >= 0.6) return "Cukup";
    return "Kurang";
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rekam Suara Batuk</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Rekaman {recordings.length}/3</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(recordings.length / 3) * 100}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.recordingArea}>
          <Animated.View
            style={[
              styles.recordButton,
              { transform: [{ scale: animatedScale }] },
              isRecording && styles.recordButtonActive,
            ]}
          >
            <TouchableOpacity
              // onPress={stopRecording}
              style={styles.recordButtonInner}
              disabled={isUploading}
            >
              <Ionicons
                name={isRecording ? "stop" : "mic"}
                size={48}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </Animated.View>

          {isRecording && (
            <Text style={styles.timerText}>
              {formatDuration(recordingDuration)}
            </Text>
          )}

          <Text style={styles.recordingInstruction}>
            {isRecording
              ? "Batuk dengan suara yang jelas..."
              : recordings.length < 3
              ? "Tekan untuk merekam suara batuk"
              : "Semua rekaman selesai"}
          </Text>
        </View>

        <View style={styles.recordingsList}>
          <Text style={styles.recordingsTitle}>Rekaman Tersimpan:</Text>

          {recordings.map((recording, index) => (
            <View key={recording.id} style={styles.recordingItem}>
              <View style={styles.recordingInfo}>
                <Ionicons
                  name="musical-notes-outline"
                  size={24}
                  color={COLORS.primary}
                />
                <View style={styles.recordingDetails}>
                  <Text style={styles.recordingName}>Rekaman {index + 1}</Text>
                  <View style={styles.recordingMeta}>
                    <Text style={styles.recordingDuration}>
                      {formatDuration(recording.duration)}
                    </Text>
                    <View
                      style={[
                        styles.qualityBadge,
                        {
                          backgroundColor:
                            getQualityColor(recording.quality) + "20",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.qualityText,
                          { color: getQualityColor(recording.quality) },
                        ]}
                      >
                        {getQualityText(recording.quality)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => deleteRecording(recording.id)}
                style={styles.deleteButton}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={COLORS.danger}
                />
              </TouchableOpacity>
            </View>
          ))}

          {recordings.length === 0 && (
            <Text style={styles.noRecordingsText}>
              Belum ada rekaman. Mulai dengan menekan tombol rekam.
            </Text>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={proceedToAnamnesis}
          style={[
            styles.continueButton,
            recordings.length === 0 && styles.continueButtonDisabled,
          ]}
          disabled={recordings.length === 0 || isUploading}
        >
          <Text style={styles.continueButtonText}>
            {isUploading ? "Mengunggah..." : "Lanjut ke Form"}
          </Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  progressContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  recordingArea: {
    alignItems: "center",
    marginBottom: 32,
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  recordButtonActive: {
    backgroundColor: COLORS.danger,
  },
  recordButtonInner: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  recordingInstruction: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
  },
  recordingsList: {
    flex: 1,
  },
  recordingsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  recordingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: COLORS.neutral,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recordingInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  recordingDetails: {
    flex: 1,
    marginLeft: 12,
  },
  recordingName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  recordingMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  recordingDuration: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  qualityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  qualityText: {
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButton: {
    padding: 8,
  },
  noRecordingsText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    fontStyle: "italic",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 34,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    minHeight: 56,
  },
  continueButtonDisabled: {
    backgroundColor: COLORS.neutral,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
});

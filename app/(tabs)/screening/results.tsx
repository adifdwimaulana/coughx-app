import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

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

const { width } = Dimensions.get("window");
const chartSize = width - 100;
const chartRadius = chartSize / 2 - 20;
const strokeWidth = 20;

interface TBAnalysisResult {
  tb_probability: number;
  classification: string;
  confidence: string;
  guidance: string;
}

export default function ResultsScreen() {
  const [results, setResults] = useState<TBAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const currentSessionId = await AsyncStorage.getItem("currentSessionId");
      if (!currentSessionId) {
        Alert.alert("Error", "Session tidak ditemukan.");
        router.back();
        return;
      }

      setSessionId(currentSessionId);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/screening/${currentSessionId}/results`
      );

      if (response.ok) {
        const analysisResult = await response.json();
        setResults(analysisResult);
      } else {
        throw new Error("Failed to load results");
      }
    } catch (error) {
      console.error("Error loading results:", error);
      Alert.alert("Error", "Gagal memuat hasil analisis. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveToHistory = async () => {
    try {
      Alert.alert(
        "Simpan ke Riwayat",
        "Hasil skrining akan disimpan dalam riwayat Anda.",
        [
          { text: "Batal", style: "cancel" },
          {
            text: "Simpan",
            onPress: () => {
              // Results are already saved in backend
              Alert.alert(
                "Tersimpan",
                "Hasil skrining telah disimpan ke riwayat.",
                [
                  {
                    text: "OK",
                    onPress: () => router.push("/(tabs)/history"),
                  },
                ]
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error saving to history:", error);
      Alert.alert("Error", "Gagal menyimpan ke riwayat.");
    }
  };

  const viewReferral = () => {
    router.push("/(tabs)/screening/referral");
  };

  const startNewScreening = () => {
    Alert.alert("Skrining Baru", "Apakah Anda ingin memulai skrining baru?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Ya",
        onPress: () => {
          AsyncStorage.removeItem("currentSessionId");
          router.push("/(tabs)/screening");
        },
      },
    ]);
  };

  const renderDonutChart = () => {
    if (!results) return null;

    const probability = results.tb_probability;
    const circumference = 2 * Math.PI * chartRadius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - probability * circumference;

    const isPositive = results.classification.includes("Positif");
    const chartColor = isPositive ? COLORS.danger : COLORS.success;

    return (
      <View style={styles.chartContainer}>
        <Svg width={chartSize} height={chartSize}>
          {/* Background circle */}
          <Circle
            cx={chartSize / 2}
            cy={chartSize / 2}
            r={chartRadius}
            stroke={COLORS.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={chartSize / 2}
            cy={chartSize / 2}
            r={chartRadius}
            stroke={chartColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            transform={`rotate(-90 ${chartSize / 2} ${chartSize / 2})`}
          />
        </Svg>

        <View style={styles.chartCenter}>
          <Text style={styles.probabilityText}>
            {Math.round(probability * 100)}%
          </Text>
          <Text style={styles.probabilityLabel}>Kemungkinan TB</Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="analytics-outline" size={60} color={COLORS.primary} />
          <Text style={styles.loadingText}>Menganalisis hasil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!results) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={60}
            color={COLORS.danger}
          />
          <Text style={styles.errorText}>Gagal memuat hasil analisis</Text>
          <TouchableOpacity style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isPositive = results.classification.includes("Positif");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hasil Skrining</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderDonutChart()}

        <View style={styles.resultCard}>
          <View style={styles.classificationContainer}>
            <View
              style={[
                styles.classificationBadge,
                {
                  backgroundColor: isPositive ? COLORS.danger : COLORS.success,
                },
              ]}
            >
              <Ionicons
                name={isPositive ? "alert-circle" : "checkmark-circle"}
                size={24}
                color={COLORS.white}
              />
              <Text style={styles.classificationText}>
                {results.classification}
              </Text>
            </View>
          </View>

          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Tingkat Kepercayaan:</Text>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>{results.confidence}</Text>
            </View>
          </View>

          <View style={styles.guidanceContainer}>
            <Text style={styles.guidanceTitle}>Rekomendasi:</Text>
            <Text style={styles.guidanceText}>{results.guidance}</Text>
          </View>
        </View>

        {isPositive && (
          <View style={styles.warningCard}>
            <Ionicons name="warning-outline" size={24} color={COLORS.warning} />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Penting!</Text>
              <Text style={styles.warningText}>
                Hasil ini bukan diagnosis final. Konsultasi dengan dokter untuk
                pemeriksaan lebih lanjut.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>Langkah Selanjutnya</Text>

          <TouchableOpacity onPress={viewReferral} style={styles.actionButton}>
            <Ionicons
              name="location-outline"
              size={24}
              color={COLORS.primary}
            />
            <View style={styles.actionContent}>
              <Text style={styles.actionLabel}>Lihat Fasilitas Kesehatan</Text>
              <Text style={styles.actionDescription}>
                Temukan puskesmas atau rumah sakit terdekat
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.neutral} />
          </TouchableOpacity>

          <TouchableOpacity onPress={saveToHistory} style={styles.actionButton}>
            <Ionicons name="save-outline" size={24} color={COLORS.accent} />
            <View style={styles.actionContent}>
              <Text style={styles.actionLabel}>Simpan ke Riwayat</Text>
              <Text style={styles.actionDescription}>
                Simpan hasil untuk referensi di kemudian hari
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.neutral} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={startNewScreening}
          style={styles.newScreeningButton}
        >
          <Ionicons name="refresh-outline" size={20} color={COLORS.white} />
          <Text style={styles.newScreeningButtonText}>Skrining Baru</Text>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.textLight,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.text,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 32,
    position: "relative",
  },
  chartCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -60 }, { translateY: -30 }],
    alignItems: "center",
  },
  probabilityText: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.text,
  },
  probabilityLabel: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 4,
  },
  resultCard: {
    backgroundColor: COLORS.white,
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: COLORS.neutral,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  classificationContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  classificationBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  classificationText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },
  confidenceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  confidenceLabel: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "600",
  },
  confidenceBadge: {
    backgroundColor: COLORS.accent + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  confidenceText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: "600",
  },
  guidanceContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
  guidanceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  guidanceText: {
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 24,
  },
  warningCard: {
    flexDirection: "row",
    backgroundColor: COLORS.warning + "10",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.warning,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: COLORS.warning,
    lineHeight: 20,
  },
  actionCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    elevation: 2,
    shadowColor: COLORS.neutral,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  actionContent: {
    flex: 1,
    marginLeft: 12,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 34,
  },
  newScreeningButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    minHeight: 56,
  },
  newScreeningButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
});

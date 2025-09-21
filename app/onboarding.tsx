import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const ONBOARDING_SLIDES = [
  {
    title: "Selamat Datang di CoughX",
    subtitle:
      "Aplikasi AI untuk skrining dini Tuberkulosis melalui analisis batuk",
    icon: "medical-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    title: "Rekam Suara Batuk",
    subtitle:
      "Rekam suara batuk Anda untuk dianalisis menggunakan kecerdasan buatan",
    icon: "mic-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    title: "Hasil Instan",
    subtitle:
      "Dapatkan hasil skrining TB dan rekomendasi tindak lanjut dengan cepat",
    icon: "analytics-outline" as keyof typeof Ionicons.glyphMap,
  },
];

const COLORS = {
  primary: "#16A34A",
  accent: "#0EA5E9",
  danger: "#DC2626",
  neutral: "#64748B",
  white: "#FFFFFF",
  background: "#F8FAFC",
  text: "#1E293B",
  textLight: "#64748B",
};

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const nextSlide = () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push("/consent");
    }
  };

  const skipOnboarding = () => {
    router.push("/consent");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={skipOnboarding} style={styles.skipButton}>
          <Text style={styles.skipText}>Lewati</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.slideContainer}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={ONBOARDING_SLIDES[currentSlide].icon}
              size={80}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.title}>
            {ONBOARDING_SLIDES[currentSlide].title}
          </Text>

          <Text style={styles.subtitle}>
            {ONBOARDING_SLIDES[currentSlide].subtitle}
          </Text>
        </View>

        <View style={styles.pagination}>
          {ONBOARDING_SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlide ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={nextSlide} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>
            {currentSlide === ONBOARDING_SLIDES.length - 1 ? "Mulai" : "Lanjut"}
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
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: COLORS.neutral,
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  slideContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: width - 80,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  inactiveDot: {
    backgroundColor: COLORS.neutral + "40",
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    minHeight: 56,
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
});

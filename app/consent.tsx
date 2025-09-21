import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
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
};

export default function ConsentScreen() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    if (!termsAccepted || !privacyAccepted) {
      Alert.alert(
        "Persetujuan Diperlukan",
        "Anda harus menyetujui syarat dan ketentuan serta kebijakan privasi untuk melanjutkan.",
        [{ text: "OK" }]
      );
      return;
    }
    router.replace("/(tabs)/screening/results");
  };

  const toggleTerms = () => setTermsAccepted(!termsAccepted);
  const togglePrivacy = () => setPrivacyAccepted(!privacyAccepted);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Persetujuan</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="shield-checkmark-outline"
            size={60}
            color={COLORS.primary}
          />
        </View>

        <Text style={styles.title}>Privasi dan Keamanan Data</Text>

        <Text style={styles.description}>
          Sebelum memulai skrining TB, mohon baca dan setujui ketentuan berikut:
        </Text>

        <View style={styles.consentSection}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={toggleTerms}
          >
            <View
              style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}
            >
              {termsAccepted && (
                <Ionicons name="checkmark" size={16} color={COLORS.white} />
              )}
            </View>
            <Text style={styles.checkboxText}>
              Saya menyetujui{" "}
              <Text style={styles.linkText}>syarat dan ketentuan</Text>{" "}
              penggunaan aplikasi CoughX
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={togglePrivacy}
          >
            <View
              style={[
                styles.checkbox,
                privacyAccepted && styles.checkboxChecked,
              ]}
            >
              {privacyAccepted && (
                <Ionicons name="checkmark" size={16} color={COLORS.white} />
              )}
            </View>
            <Text style={styles.checkboxText}>
              Saya menyetujui{" "}
              <Text style={styles.linkText}>kebijakan privasi</Text> dan
              pemrosesan data kesehatan saya
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.noteContainer}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={COLORS.accent}
          />
          <Text style={styles.noteText}>
            Rekaman suara batuk akan dianalisis secara otomatis dan dihapus
            setelah proses skrining selesai. Data tidak akan disimpan permanen.
          </Text>
        </View>

        <View style={styles.privacyPoints}>
          <Text style={styles.privacyTitle}>Yang perlu Anda ketahui:</Text>

          <View style={styles.privacyPoint}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.privacyPointText}>
              Data rekaman hanya digunakan untuk analisis TB
            </Text>
          </View>

          <View style={styles.privacyPoint}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.privacyPointText}>
              Rekaman otomatis dihapus setelah analisis
            </Text>
          </View>

          <View style={styles.privacyPoint}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.privacyPointText}>
              Data kesehatan disimpan dengan enkripsi
            </Text>
          </View>

          <View style={styles.privacyPoint}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.privacyPointText}>
              Hasil skrining hanya tersimpan di perangkat Anda
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleContinue}
          style={[
            styles.continueButton,
            (!termsAccepted || !privacyAccepted) &&
              styles.continueButtonDisabled,
          ]}
          disabled={!termsAccepted || !privacyAccepted}
        >
          <Text style={styles.continueButtonText}>Lanjut ke Skrining</Text>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  iconContainer: {
    alignItems: "center",
    marginVertical: 32,
  },
  title: {
    fontSize: 24,
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
  consentSection: {
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 6,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  noteContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.accent + "10",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.accent,
    lineHeight: 20,
    marginLeft: 12,
  },
  privacyPoints: {
    marginBottom: 32,
  },
  privacyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  privacyPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  privacyPointText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginLeft: 12,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
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

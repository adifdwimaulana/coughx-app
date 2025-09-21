import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Linking,
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
  success: "#10B981",
};

export default function ProfileScreen() {
  const router = useRouter();

  const handleAbout = () => {
    Alert.alert(
      "Tentang CoughX",
      "CoughX adalah aplikasi AI untuk skrining dini Tuberkulosis melalui analisis suara batuk.\n\nVersi: 1.0.0\nDikembangkan untuk membantu deteksi dini TB di masyarakat.",
      [{ text: "OK" }]
    );
  };

  const handleContact = () => {
    Alert.alert(
      "Hubungi Kami",
      "Untuk bantuan dan saran, hubungi:\nEmail: support@coughx.id\nTelepon: (021) 123-4567",
      [
        {
          text: "Email",
          onPress: () => Linking.openURL("mailto:support@coughx.id"),
        },
        { text: "Tutup", style: "cancel" },
      ]
    );
  };

  const handlePrivacy = () => {
    router.push("/(tabs)/profile/legal");
  };

  const handleTerms = () => {
    router.push("/(tabs)/profile/legal");
  };

  const handleFeedback = () => {
    Alert.alert(
      "Berikan Masukan",
      "Bantu kami meningkatkan aplikasi dengan memberikan masukan Anda.",
      [
        {
          text: "Kirim Email",
          onPress: () =>
            Linking.openURL(
              "mailto:feedback@coughx.id?subject=Masukan untuk CoughX"
            ),
        },
        { text: "Batal", style: "cancel" },
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      "Hapus Semua Data",
      "Apakah Anda yakin ingin menghapus semua data skrining? Tindakan ini tidak dapat dibatalkan.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => {
            // Clear all local data
            Alert.alert("Berhasil", "Semua data telah dihapus.");
          },
        },
      ]
    );
  };

  const renderMenuItem = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    description: string,
    onPress: () => void,
    color: string = COLORS.text
  ) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIcon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.neutral} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View> */}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons
              name="person-circle-outline"
              size={80}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.profileName}>Pengguna CoughX</Text>
          <Text style={styles.profileDescription}>
            Aplikasi Skrining TB dengan Teknologi AI
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aplikasi</Text>

          {renderMenuItem(
            "information-circle-outline",
            "Tentang CoughX",
            "Versi aplikasi dan informasi pengembangan",
            handleAbout,
            COLORS.primary
          )}

          {renderMenuItem(
            "call-outline",
            "Hubungi Kami",
            "Bantuan dan dukungan pelanggan",
            handleContact,
            COLORS.accent
          )}

          {renderMenuItem(
            "chatbubble-outline",
            "Berikan Masukan",
            "Kirim saran untuk perbaikan aplikasi",
            handleFeedback,
            COLORS.success
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privasi & Keamanan</Text>

          {renderMenuItem(
            "shield-checkmark-outline",
            "Kebijakan Privasi",
            "Cara kami melindungi data Anda",
            handlePrivacy,
            COLORS.primary
          )}

          {renderMenuItem(
            "document-text-outline",
            "Syarat & Ketentuan",
            "Ketentuan penggunaan aplikasi",
            handleTerms,
            COLORS.neutral
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>

          {renderMenuItem(
            "trash-outline",
            "Hapus Semua Data",
            "Hapus riwayat skrining dan data lokal",
            handleReset,
            COLORS.danger
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="medical-outline" size={32} color={COLORS.primary} />
            <Text style={styles.infoTitle}>Disclaimer</Text>
            <Text style={styles.infoText}>
              CoughX adalah alat bantu skrining awal dan bukan pengganti
              diagnosis medis profesional. Selalu konsultasi dengan dokter untuk
              pemeriksaan dan pengobatan yang tepat.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>CoughX v1.0.0</Text>
          <Text style={styles.footerSubtext}>
            Dikembangkan untuk kesehatan masyarakat Indonesia
          </Text>
        </View>
      </ScrollView>
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
  },
  profileCard: {
    backgroundColor: COLORS.white,
    alignItems: "center",
    padding: 32,
    margin: 24,
    borderRadius: 16,
    elevation: 2,
    shadowColor: COLORS.neutral,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  profileDescription: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
    marginHorizontal: 24,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 24,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 1,
    shadowColor: COLORS.neutral,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  infoSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: COLORS.primary + "10",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.primary,
    textAlign: "center",
    lineHeight: 20,
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#16A34A',
  accent: '#0EA5E9',
  danger: '#DC2626',
  neutral: '#64748B',
  white: '#FFFFFF',
  background: '#F8FAFC',
  text: '#1E293B',
  textLight: '#64748B',
  border: '#E2E8F0',
};

export default function LegalInfoScreen() {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');
  const router = useRouter();

  const privacyContent = {
    title: 'Kebijakan Privasi',
    sections: [
      {
        title: 'Pengumpulan Data',
        content: 'Kami mengumpulkan data rekaman suara batuk dan informasi kesehatan yang Anda berikan secara sukarela untuk keperluan analisis TB. Data ini diproses menggunakan teknologi AI untuk memberikan hasil skrining.'
      },
      {
        title: 'Penggunaan Data',
        content: 'Data yang dikumpulkan hanya digunakan untuk:\n• Analisis suara batuk menggunakan AI\n• Memberikan hasil skrining TB\n• Menyimpan riwayat skrining\n• Meningkatkan akurasi sistem'
      },
      {
        title: 'Penyimpanan Data',
        content: 'Rekaman suara batuk dihapus secara otomatis setelah proses analisis selesai. Data anamnesis dan hasil skrining disimpan dalam bentuk terenkripsi dan hanya dapat diakses oleh Anda.'
      },
      {
        title: 'Keamanan Data',
        content: 'Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi data pribadi Anda dari akses, pengubahan, pengungkapan, atau penghancuran yang tidak sah.'
      },
      {
        title: 'Hak Anda',
        content: 'Anda memiliki hak untuk:\n• Mengakses data pribadi Anda\n• Memperbaiki data yang tidak akurat\n• Menghapus data pribadi Anda\n• Membatasi pemrosesan data\n• Memindahkan data ke layanan lain'
      }
    ]
  };

  const termsContent = {
    title: 'Syarat & Ketentuan',
    sections: [
      {
        title: 'Penerimaan Ketentuan',
        content: 'Dengan menggunakan aplikasi CoughX, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak menyetujui ketentuan ini, mohon tidak menggunakan aplikasi.'
      },
      {
        title: 'Penggunaan Aplikasi',
        content: 'CoughX adalah alat bantu skrining awal untuk TB dan BUKAN pengganti diagnosis medis profesional. Anda wajib berkonsultasi dengan tenaga medis untuk diagnosis dan pengobatan yang tepat.'
      },
      {
        title: 'Akurasi Hasil',
        content: 'Meskipun menggunakan teknologi AI terdepan, hasil skrining mungkin tidak 100% akurat. Aplikasi ini tidak dapat menggantikan pemeriksaan medis komprehensif oleh dokter.'
      },
      {
        title: 'Tanggung Jawab Pengguna',
        content: 'Pengguna bertanggung jawab untuk:\n• Memberikan informasi yang akurat\n• Mengikuti petunjuk penggunaan\n• Segera berkonsultasi dengan dokter jika hasil menunjukkan kemungkinan TB\n• Tidak mengandalkan aplikasi sebagai satu-satunya alat diagnosis'
      },
      {
        title: 'Batasan Tanggung Jawab',
        content: 'Pengembang aplikasi tidak bertanggung jawab atas keputusan medis yang diambil berdasarkan hasil aplikasi. Selalu konsultasi dengan profesional medis untuk keputusan pengobatan.'
      },
      {
        title: 'Perubahan Ketentuan',
        content: 'Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diberitahukan melalui aplikasi dan berlaku setelah dipublikasikan.'
      }
    ]
  };

  const currentContent = activeTab === 'privacy' ? privacyContent : termsContent;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Informasi Legal</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'privacy' && styles.activeTab]}
          onPress={() => setActiveTab('privacy')}
        >
          <Text style={[styles.tabText, activeTab === 'privacy' && styles.activeTabText]}>
            Privasi
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'terms' && styles.activeTab]}
          onPress={() => setActiveTab('terms')}
        >
          <Text style={[styles.tabText, activeTab === 'terms' && styles.activeTabText]}>
            Syarat
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.contentTitle}>{currentContent.title}</Text>
          <Text style={styles.lastUpdated}>
            Terakhir diperbarui: 1 Januari 2025
          </Text>
        </View>

        {currentContent.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Hubungi Kami</Text>
          <Text style={styles.contactText}>
            Jika Anda memiliki pertanyaan tentang kebijakan privasi atau syarat ketentuan ini, 
            silakan hubungi kami di:
          </Text>
          <Text style={styles.contactInfo}>
            Email: legal@coughx.id{'\n'}
            Telepon: (021) 123-4567{'\n'}
            Alamat: Jakarta, Indonesia
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  placeholder: {
    width: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
    elevation: 1,
    shadowColor: COLORS.neutral,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  activeTabText: {
    color: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleContainer: {
    marginTop: 24,
    marginBottom: 20,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 1,
    shadowColor: COLORS.neutral,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 24,
  },
  contactSection: {
    backgroundColor: COLORS.primary + '10',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    color: COLORS.primary,
    lineHeight: 24,
    marginBottom: 12,
  },
  contactInfo: {
    fontSize: 16,
    color: COLORS.primary,
    lineHeight: 24,
    fontWeight: '500',
  },
});
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
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
  success: '#10B981',
};

const HEALTH_FACILITIES = [
  {
    id: '1',
    name: 'Puskesmas Kecamatan Jakarta Pusat',
    type: 'Puskesmas',
    address: 'Jl. Kebon Kacang No. 12, Jakarta Pusat',
    phone: '(021) 3456789',
    distance: '1.2 km',
  },
  {
    id: '2',
    name: 'RS Umum Jakarta Medical Center',
    type: 'Rumah Sakit',
    address: 'Jl. Letjen S. Parman No. 87, Jakarta Barat',
    phone: '(021) 5678901',
    distance: '2.8 km',
  },
  {
    id: '3',
    name: 'Klinik Spesialis Paru Dr. Ahmad',
    type: 'Klinik Spesialis',
    address: 'Jl. Sudirman No. 45, Jakarta Selatan',
    phone: '(021) 2345678',
    distance: '3.5 km',
  },
];

export default function ReferralScreen() {
  const router = useRouter();

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
  };

  const handleFinish = () => {
    router.push('/(tabs)/history');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rujukan Kesehatan</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={32} color={COLORS.accent} />
          <Text style={styles.infoTitle}>Langkah Selanjutnya</Text>
          <Text style={styles.infoText}>
            Berdasarkan hasil skrining, berikut adalah fasilitas kesehatan terdekat 
            yang dapat Anda kunjungi untuk pemeriksaan lebih lanjut.
          </Text>
        </View>

        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Yang Perlu Dibawa:</Text>
          
          <View style={styles.instruction}>
            <Ionicons name="card-outline" size={20} color={COLORS.primary} />
            <Text style={styles.instructionText}>KTP atau identitas diri</Text>
          </View>

          <View style={styles.instruction}>
            <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
            <Text style={styles.instructionText}>Kartu BPJS (jika ada)</Text>
          </View>

          <View style={styles.instruction}>
            <Ionicons name="phone-portrait-outline" size={20} color={COLORS.primary} />
            <Text style={styles.instructionText}>Hasil skrining dari aplikasi ini</Text>
          </View>

          <View style={styles.instruction}>
            <Ionicons name="cash-outline" size={20} color={COLORS.primary} />
            <Text style={styles.instructionText}>Uang untuk biaya pemeriksaan</Text>
          </View>
        </View>

        <View style={styles.facilitiesCard}>
          <Text style={styles.facilitiesTitle}>Fasilitas Kesehatan Terdekat</Text>
          
          {HEALTH_FACILITIES.map((facility) => (
            <View key={facility.id} style={styles.facilityItem}>
              <View style={styles.facilityIcon}>
                <Ionicons 
                  name={
                    facility.type === 'Puskesmas' 
                      ? 'medical-outline'
                      : facility.type === 'Rumah Sakit'
                        ? 'business-outline'
                        : 'fitness-outline'
                  } 
                  size={24} 
                  color={COLORS.primary} 
                />
              </View>
              
              <View style={styles.facilityInfo}>
                <Text style={styles.facilityName}>{facility.name}</Text>
                <Text style={styles.facilityType}>{facility.type}</Text>
                <Text style={styles.facilityAddress}>{facility.address}</Text>
                <Text style={styles.facilityDistance}>{facility.distance}</Text>
              </View>
              
              <View style={styles.facilityActions}>
                <TouchableOpacity 
                  onPress={() => handleCall(facility.phone)}
                  style={styles.actionButton}
                >
                  <Ionicons name="call-outline" size={20} color={COLORS.accent} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => handleDirections(facility.address)}
                  style={styles.actionButton}
                >
                  <Ionicons name="navigate-outline" size={20} color={COLORS.success} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.emergencyCard}>
          <Ionicons name="warning-outline" size={24} color={COLORS.danger} />
          <View style={styles.emergencyContent}>
            <Text style={styles.emergencyTitle}>Kondisi Darurat</Text>
            <Text style={styles.emergencyText}>
              Jika mengalami sesak napas berat, batuk darah, atau demam tinggi, 
              segera ke unit gawat darurat terdekat.
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={() => handleCall('119')}
          style={styles.emergencyButton}
        >
          <Ionicons name="call" size={24} color={COLORS.white} />
          <Text style={styles.emergencyButtonText}>Panggil Ambulans (119)</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleFinish} style={styles.finishButton}>
          <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
          <Text style={styles.finishButtonText}>Selesai</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    elevation: 2,
    shadowColor: COLORS.neutral,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  instructionsCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: COLORS.neutral,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  instruction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  facilitiesCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: COLORS.neutral,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  facilitiesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  facilityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  facilityInfo: {
    flex: 1,
  },
  facilityName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  facilityType: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  facilityAddress: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
    marginBottom: 4,
  },
  facilityDistance: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: '500',
  },
  facilityActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emergencyCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.danger + '10',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  emergencyContent: {
    flex: 1,
    marginLeft: 12,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.danger,
    marginBottom: 4,
  },
  emergencyText: {
    fontSize: 14,
    color: COLORS.danger,
    lineHeight: 20,
  },
  emergencyButton: {
    backgroundColor: COLORS.danger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 32,
  },
  emergencyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 34,
  },
  finishButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    minHeight: 56,
  },
  finishButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
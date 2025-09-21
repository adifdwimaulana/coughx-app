import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

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

interface ScreeningDetail {
  id: string;
  created_at: string;
  tb_probability: number;
  classification: string;
  confidence: string;
  anamnesis: {
    age: number;
    sex: string;
    fever: boolean;
    night_sweats: boolean;
    weight_loss: boolean;
    cough_duration: number;
    tb_contact: boolean;
    comorbidities: string[];
  };
  recordings: any[];
}

export default function HistoryDetailScreen() {
  const [detail, setDetail] = useState<ScreeningDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (id) {
      loadDetail();
    }
  }, [id]);

  const loadDetail = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/screening/history/${id}`
      );
      
      if (response.ok) {
        const detailData = await response.json();
        setDetail(detailData);
      } else {
        throw new Error('Failed to load detail');
      }
    } catch (error) {
      console.error('Error loading detail:', error);
      Alert.alert('Error', 'Gagal memuat detail riwayat.');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const getClassificationColor = (classification: string) => {
    return classification.includes('Positif') ? COLORS.danger : COLORS.success;
  };

  const formatBooleanAnswer = (value: boolean) => {
    return value ? 'Ya' : 'Tidak';
  };

  const formatComorbidities = (comorbidities: string[]) => {
    if (!comorbidities || comorbidities.length === 0) {
      return 'Tidak ada';
    }
    
    const mapping: { [key: string]: string } = {
      diabetes: 'Diabetes',
      hiv: 'HIV/AIDS',
      asma: 'Asma',
      jantung: 'Penyakit Jantung',
      ginjal: 'Penyakit Ginjal',
      kanker: 'Kanker',
    };
    
    return comorbidities.map(item => mapping[item] || item).join(', ');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="time-outline" size={60} color={COLORS.primary} />
          <Text style={styles.loadingText}>Memuat detail...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!detail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={COLORS.danger} />
          <Text style={styles.errorText}>Data tidak ditemukan</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Skrining</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultDate}>
              {format(new Date(detail.created_at), 'dd MMMM yyyy, HH:mm')}
            </Text>
            
            <View style={[
              styles.classificationBadge,
              { backgroundColor: getClassificationColor(detail.classification) }
            ]}>
              <Text style={styles.classificationText}>
                {detail.classification}
              </Text>
            </View>
          </View>

          <View style={styles.probabilitySection}>
            <Text style={styles.probabilityLabel}>Kemungkinan TB</Text>
            <Text style={styles.probabilityValue}>
              {Math.round(detail.tb_probability * 100)}%
            </Text>
          </View>

          <View style={styles.confidenceSection}>
            <Text style={styles.confidenceLabel}>Tingkat Kepercayaan:</Text>
            <Text style={styles.confidenceValue}>{detail.confidence}</Text>
          </View>
        </View>

        <View style={styles.recordingsCard}>
          <Text style={styles.cardTitle}>Data Rekaman</Text>
          <View style={styles.recordingsInfo}>
            <Ionicons name="mic-outline" size={20} color={COLORS.primary} />
            <Text style={styles.recordingsText}>
              {detail.recordings.length} rekaman suara batuk
            </Text>
          </View>
        </View>

        <View style={styles.anamnesisCard}>
          <Text style={styles.cardTitle}>Data Anamnesis</Text>
          
          <View style={styles.anamnesisSection}>
            <Text style={styles.sectionTitle}>Informasi Dasar</Text>
            
            <View style={styles.anamnesisItem}>
              <Text style={styles.anamnesisLabel}>Usia:</Text>
              <Text style={styles.anamnesisValue}>{detail.anamnesis.age} tahun</Text>
            </View>
            
            <View style={styles.anamnesisItem}>
              <Text style={styles.anamnesisLabel}>Jenis Kelamin:</Text>
              <Text style={styles.anamnesisValue}>
                {detail.anamnesis.sex === 'laki-laki' ? 'Laki-laki' : 'Perempuan'}
              </Text>
            </View>
            
            <View style={styles.anamnesisItem}>
              <Text style={styles.anamnesisLabel}>Durasi Batuk:</Text>
              <Text style={styles.anamnesisValue}>
                {detail.anamnesis.cough_duration} minggu
              </Text>
            </View>
          </View>

          <View style={styles.anamnesisSection}>
            <Text style={styles.sectionTitle}>Gejala Penyerta</Text>
            
            <View style={styles.anamnesisItem}>
              <Text style={styles.anamnesisLabel}>Demam:</Text>
              <Text style={[
                styles.anamnesisValue,
                { color: detail.anamnesis.fever ? COLORS.danger : COLORS.success }
              ]}>
                {formatBooleanAnswer(detail.anamnesis.fever)}
              </Text>
            </View>
            
            <View style={styles.anamnesisItem}>
              <Text style={styles.anamnesisLabel}>Keringat Malam:</Text>
              <Text style={[
                styles.anamnesisValue,
                { color: detail.anamnesis.night_sweats ? COLORS.danger : COLORS.success }
              ]}>
                {formatBooleanAnswer(detail.anamnesis.night_sweats)}
              </Text>
            </View>
            
            <View style={styles.anamnesisItem}>
              <Text style={styles.anamnesisLabel}>Penurunan Berat Badan:</Text>
              <Text style={[
                styles.anamnesisValue,
                { color: detail.anamnesis.weight_loss ? COLORS.danger : COLORS.success }
              ]}>
                {formatBooleanAnswer(detail.anamnesis.weight_loss)}
              </Text>
            </View>
            
            <View style={styles.anamnesisItem}>
              <Text style={styles.anamnesisLabel}>Kontak TB:</Text>
              <Text style={[
                styles.anamnesisValue,
                { color: detail.anamnesis.tb_contact ? COLORS.danger : COLORS.success }
              ]}>
                {formatBooleanAnswer(detail.anamnesis.tb_contact)}
              </Text>
            </View>
          </View>

          <View style={styles.anamnesisSection}>
            <Text style={styles.sectionTitle}>Penyakit Penyerta</Text>
            
            <View style={styles.comorbiditiesContainer}>
              <Text style={styles.comorbiditiesText}>
                {formatComorbidities(detail.anamnesis.comorbidities)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Tutup</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.textLight,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: COLORS.text,
    marginTop: 16,
  },
  resultCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    marginTop: 24,
    marginBottom: 16,
    elevation: 2,
    shadowColor: COLORS.neutral,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  resultDate: {
    fontSize: 14,
    color: COLORS.textLight,
    flex: 1,
  },
  classificationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  classificationText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  probabilitySection: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  probabilityLabel: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  probabilityValue: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
  },
  confidenceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accent,
  },
  recordingsCard: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  recordingsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingsText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 8,
  },
  anamnesisCard: {
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
  anamnesisSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  anamnesisItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  anamnesisLabel: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  anamnesisValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  comorbiditiesContainer: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
  },
  comorbiditiesText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 34,
  },
  closeButton: {
    backgroundColor: COLORS.neutral,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 56,
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

interface AnamnesisFormData {
  age: number;
  sex: string;
  fever: boolean;
  night_sweats: boolean;
  weight_loss: boolean;
  cough_duration: number;
  tb_contact: boolean;
  comorbidities: string[];
}

const COMORBIDITY_OPTIONS = [
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'hiv', label: 'HIV/AIDS' },
  { value: 'asma', label: 'Asma' },
  { value: 'jantung', label: 'Penyakit Jantung' },
  { value: 'ginjal', label: 'Penyakit Ginjal' },
  { value: 'kanker', label: 'Kanker' },
];

export default function AnamnesisScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<AnamnesisFormData>({
    defaultValues: {
      age: 0,
      sex: '',
      fever: false,
      night_sweats: false,
      weight_loss: false,
      cough_duration: 0,
      tb_contact: false,
      comorbidities: [],
    },
  });

  const watchedComorbidities = watch('comorbidities');

  const toggleComorbidity = (value: string) => {
    const current = watchedComorbidities || [];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    setValue('comorbidities', updated);
  };

  const onSubmit = async (data: AnamnesisFormData) => {
    try {
      setIsSubmitting(true);
      
      const sessionId = await AsyncStorage.getItem('currentSessionId');
      if (!sessionId) {
        Alert.alert('Error', 'Session tidak ditemukan. Silakan mulai ulang.');
        return;
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/screening/anamnesis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          anamnesis: data,
        }),
      });

      if (response.ok) {
        router.push('/(tabs)/screening/results');
      } else {
        throw new Error('Failed to submit anamnesis');
      }
    } catch (error) {
      console.error('Error submitting anamnesis:', error);
      Alert.alert('Error', 'Gagal menyimpan data anamnesis. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderNumberInput = (
    name: keyof AnamnesisFormData,
    label: string,
    placeholder: string,
    min: number = 0,
    max: number = 150,
    unit?: string
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <Controller
        control={control}
        name={name}
        rules={{ 
          required: 'Field ini wajib diisi',
          min: { value: min, message: `Minimal ${min}` },
          max: { value: max, message: `Maksimal ${max}` },
        }}
        render={({ field: { onChange, value } }) => (
          <View style={styles.numberInputContainer}>
            <TouchableOpacity 
              onPress={() => onChange(Math.max(min, (value as number) - 1))}
              style={styles.numberButton}
            >
              <Ionicons name="remove" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            
            <View style={styles.numberDisplay}>
              <Text style={styles.numberText}>{value as number}</Text>
              {unit && <Text style={styles.unitText}>{unit}</Text>}
            </View>
            
            <TouchableOpacity 
              onPress={() => onChange(Math.min(max, (value as number) + 1))}
              style={styles.numberButton}
            >
              <Ionicons name="add" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}
      />
      {errors[name] && (
        <Text style={styles.errorText}>{errors[name]?.message}</Text>
      )}
    </View>
  );

  const renderBooleanInput = (
    name: keyof AnamnesisFormData,
    label: string,
    description?: string
  ) => (
    <View style={styles.inputGroup}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <TouchableOpacity
            onPress={() => onChange(!(value as boolean))}
            style={styles.booleanContainer}
          >
            <View style={styles.booleanContent}>
              <Text style={styles.booleanLabel}>{label}</Text>
              {description && (
                <Text style={styles.booleanDescription}>{description}</Text>
              )}
            </View>
            <View style={[styles.checkbox, (value as boolean) && styles.checkboxChecked]}>
              {(value as boolean) && (
                <Ionicons name="checkmark" size={16} color={COLORS.white} />
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderSexInput = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Jenis Kelamin</Text>
      <Controller
        control={control}
        name="sex"
        rules={{ required: 'Pilih jenis kelamin' }}
        render={({ field: { onChange, value } }) => (
          <View style={styles.radioGroup}>
            <TouchableOpacity
              onPress={() => onChange('laki-laki')}
              style={[styles.radioOption, value === 'laki-laki' && styles.radioOptionSelected]}
            >
              <View style={[styles.radio, value === 'laki-laki' && styles.radioSelected]}>
                {value === 'laki-laki' && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.radioText, value === 'laki-laki' && styles.radioTextSelected]}>
                Laki-laki
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => onChange('perempuan')}
              style={[styles.radioOption, value === 'perempuan' && styles.radioOptionSelected]}
            >
              <View style={[styles.radio, value === 'perempuan' && styles.radioSelected]}>
                {value === 'perempuan' && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.radioText, value === 'perempuan' && styles.radioTextSelected]}>
                Perempuan
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {errors.sex && (
        <Text style={styles.errorText}>{errors.sex.message}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Form Anamnesis</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.description}>
            Mohon lengkapi informasi berikut untuk mendapatkan hasil skrining yang lebih akurat.
          </Text>

          {renderNumberInput('age', 'Usia', 'Masukkan usia', 1, 120, 'tahun')}
          
          {renderSexInput()}
          
          {renderNumberInput('cough_duration', 'Durasi Batuk', 'Berapa lama batuk', 0, 52, 'minggu')}
          
          <Text style={styles.sectionTitle}>Gejala Penyerta</Text>
          
          {renderBooleanInput('fever', 'Demam', 'Apakah mengalami demam dalam 2 minggu terakhir?')}
          
          {renderBooleanInput('night_sweats', 'Keringat Malam', 'Apakah sering berkeringat di malam hari?')}
          
          {renderBooleanInput('weight_loss', 'Penurunan Berat Badan', 'Apakah mengalami penurunan berat badan tanpa sebab jelas?')}
          
          {renderBooleanInput('tb_contact', 'Kontak TB', 'Apakah pernah berkontak dengan penderita TB?')}
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Penyakit Penyerta (Komorbid)</Text>
            <Text style={styles.inputDescription}>Pilih semua yang sesuai:</Text>
            
            {COMORBIDITY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => toggleComorbidity(option.value)}
                style={styles.comorbidityOption}
              >
                <View style={[
                  styles.checkbox, 
                  watchedComorbidities?.includes(option.value) && styles.checkboxChecked
                ]}>
                  {watchedComorbidities?.includes(option.value) && (
                    <Ionicons name="checkmark" size={16} color={COLORS.white} />
                  )}
                </View>
                <Text style={styles.comorbidityText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.bottomSpacer} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Memproses...' : 'Lihat Hasil'}
            </Text>
            <Ionicons name="analytics-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  description: {
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 24,
    marginTop: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  inputDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  numberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  numberButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberDisplay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  numberText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  unitText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  booleanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  booleanContent: {
    flex: 1,
  },
  booleanLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  booleanDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 1,
  },
  radioOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  radioText: {
    fontSize: 16,
    color: COLORS.text,
  },
  radioTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  comorbidityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  comorbidityText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.danger,
    marginTop: 4,
  },
  bottomSpacer: {
    height: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 34,
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    minHeight: 56,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.neutral,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
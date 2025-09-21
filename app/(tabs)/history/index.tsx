import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
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

interface ScreeningHistory {
  id: string;
  created_at: string;
  tb_probability: number;
  classification: string;
  confidence: string;
  status: string;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<ScreeningHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/screening/history`);
      
      if (response.ok) {
        const historyData = await response.json();
        setHistory(historyData);
      } else {
        throw new Error('Failed to load history');
      }
    } catch (error) {
      console.error('Error loading history:', error);
      Alert.alert('Error', 'Gagal memuat riwayat skrining.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const handleItemPress = (sessionId: string) => {
    router.push(`/(tabs)/history/detail?id=${sessionId}`);
  };

  const getClassificationColor = (classification: string) => {
    return classification.includes('Positif') ? COLORS.danger : COLORS.success;
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case 'tinggi':
        return COLORS.success;
      case 'sedang':
        return COLORS.accent;
      case 'rendah':
        return COLORS.neutral;
      default:
        return COLORS.neutral;
    }
  };

  const renderHistoryItem = ({ item }: { item: ScreeningHistory }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => handleItemPress(item.id)}
    >
      <View style={styles.itemHeader}>
        <View style={styles.itemDate}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.textLight} />
          <Text style={styles.dateText}>
            {format(new Date(item.created_at), 'dd MMM yyyy, HH:mm')}
          </Text>
        </View>
        
        <View style={[
          styles.classificationBadge,
          { backgroundColor: getClassificationColor(item.classification) }
        ]}>
          <Text style={styles.classificationText}>
            {item.classification}
          </Text>
        </View>
      </View>

      <View style={styles.itemContent}>
        <View style={styles.probabilityContainer}>
          <Text style={styles.probabilityLabel}>Kemungkinan TB:</Text>
          <Text style={styles.probabilityValue}>
            {Math.round(item.tb_probability * 100)}%
          </Text>
        </View>

        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceLabel}>Kepercayaan:</Text>
          <View style={[
            styles.confidenceBadge,
            { backgroundColor: getConfidenceColor(item.confidence) + '20' }
          ]}>
            <Text style={[
              styles.confidenceText,
              { color: getConfidenceColor(item.confidence) }
            ]}>
              {item.confidence}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.itemFooter}>
        <Ionicons name="chevron-forward" size={20} color={COLORS.neutral} />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="time-outline" size={80} color={COLORS.neutral} />
      <Text style={styles.emptyTitle}>Belum Ada Riwayat</Text>
      <Text style={styles.emptyText}>
        Riwayat skrining TB Anda akan muncul di sini setelah melakukan skrining.
      </Text>
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/screening')}
        style={styles.startScreeningButton}
      >
        <Text style={styles.startScreeningText}>Mulai Skrining</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Riwayat Skrining</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {history.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Ringkasan</Text>
            <Text style={styles.summaryText}>
              Total {history.length} skrining dilakukan
            </Text>
            <Text style={styles.summarySubtext}>
              Terakhir: {history.length > 0 
                ? format(new Date(history[0].created_at), 'dd MMM yyyy')
                : 'Belum ada'
              }
            </Text>
          </View>
        )}

        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
            />
          }
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={[
            styles.listContainer,
            history.length === 0 && styles.emptyListContainer,
          ]}
          showsVerticalScrollIndicator={false}
        />
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
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    margin: 24,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: COLORS.neutral,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  listContainer: {
    paddingHorizontal: 24,
  },
  emptyListContainer: {
    flex: 1,
  },
  historyItem: {
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemDate: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 6,
  },
  classificationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  classificationText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  itemContent: {
    marginBottom: 12,
  },
  probabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  probabilityLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  probabilityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  confidenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemFooter: {
    alignItems: 'flex-end',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  startScreeningButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  startScreeningText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
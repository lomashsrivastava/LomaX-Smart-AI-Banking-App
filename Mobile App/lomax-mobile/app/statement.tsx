import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { transactionsApi } from '@/services/api/index';
import { useAccountsStore } from '@/stores/index';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, Typography, Radius } from '@/theme';
import { maskAccountNumber } from '@/utils/format';

export default function StatementScreen() {
  const router = useRouter();
  const { accounts } = useAccountsStore();
  const [selectedAcc, setSelectedAcc] = useState(accounts[0]?.accountNumber || '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: 'pdf' | 'csv') => {
    if (!selectedAcc) return Alert.alert('Error', 'Please select an account');
    if (!startDate.trim() || !endDate.trim()) {
      return Alert.alert('Error', 'Please enter both start and end dates');
    }

    setLoading(true);
    try {
      let fileUri = '';
      const params = {
        accountNumber: selectedAcc,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      };

      if (format === 'pdf') {
        const res = await transactionsApi.getStatementPDF(params);
        // Save PDF to local cache
        const base64Data = await blobToBase64(res.data);
        fileUri = `${FileSystem.cacheDirectory}LomaX_Statement_${selectedAcc}.pdf`;
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } else {
        const res = await transactionsApi.getStatementCSV(params);
        fileUri = `${FileSystem.cacheDirectory}LomaX_Statement_${selectedAcc}.csv`;
        await FileSystem.writeAsStringAsync(fileUri, res.data, {
          encoding: FileSystem.EncodingType.UTF8,
        });
      }

      // Share local file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Success', `Statement saved to: ${fileUri}`);
      }
    } catch (err: any) {
      console.log('Export error:', err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to export statement. Check dates.');
    } finally {
      setLoading(false);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Account Statement</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>1. Select Account</Text>
          <View style={styles.accList}>
            {accounts.map(acc => (
              <TouchableOpacity
                key={acc._id}
                style={[styles.accBtn, selectedAcc === acc.accountNumber && styles.accBtnActive]}
                onPress={() => setSelectedAcc(acc.accountNumber)}
              >
                <Ionicons
                  name={selectedAcc === acc.accountNumber ? 'radio-button-on' : 'radio-button-off'}
                  size={18}
                  color={selectedAcc === acc.accountNumber ? Colors.primary : Colors.textMuted}
                />
                <View>
                  <Text style={styles.accType}>{acc.accountType}</Text>
                  <Text style={styles.accNum}>{maskAccountNumber(acc.accountNumber)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>2. Date Range</Text>
          <Input
            label="Start Date (YYYY-MM-DD)"
            placeholder="e.g. 2026-06-01"
            value={startDate}
            onChangeText={setStartDate}
            leftIcon="calendar-outline"
          />

          <Input
            label="End Date (YYYY-MM-DD)"
            placeholder="e.g. 2026-06-30"
            value={endDate}
            onChangeText={setEndDate}
            leftIcon="calendar-outline"
            containerStyle={styles.gap}
          />

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>3. Choose Format</Text>
          <View style={styles.formatRow}>
            <Button
              title="Export PDF"
              onPress={() => handleExport('pdf')}
              loading={loading}
              style={[styles.exportBtn, { backgroundColor: Colors.surface2 }]}
              textStyle={{ color: Colors.primary }}
            />
            <Button
              title="Export CSV"
              onPress={() => handleExport('csv')}
              loading={loading}
              style={[styles.exportBtn, { backgroundColor: Colors.surface2 }]}
              textStyle={{ color: Colors.primary }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  back: { padding: 4 },
  title: { ...Typography.h2, color: Colors.text },
  scroll: { padding: Spacing.lg },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  sectionLabel: { ...Typography.label, color: Colors.primary, marginBottom: Spacing.md, textTransform: 'uppercase' },
  accList: { gap: Spacing.sm },
  accBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.surface2, borderStyle: 'solid', borderWidth: 1, borderColor: Colors.border },
  accBtnActive: { borderColor: Colors.primary },
  accType: { ...Typography.body, color: Colors.text, fontWeight: '600' },
  accNum: { ...Typography.monoSmall, color: Colors.textMuted },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.lg },
  gap: { marginTop: Spacing.md },
  formatRow: { flexDirection: 'row', gap: Spacing.md },
  exportBtn: { flex: 1, borderWidth: 1, borderColor: Colors.primary },
});

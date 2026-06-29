import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { scheduledApi } from '@/services/api/index';
import { useAccountsStore } from '@/stores/index';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, Typography, Radius } from '@/theme';
import { formatCurrency, formatDate, maskAccountNumber } from '@/utils/format';

interface ScheduledTransfer {
  _id: string;
  sourceAccount: string;
  targetAccount: string;
  payeeName: string;
  amount: number;
  frequency: string;
  nextExecution: string;
  status: string;
}

export default function ScheduledScreen() {
  const router = useRouter();
  const { accounts } = useAccountsStore();
  const [scheduled, setScheduled] = useState<ScheduledTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form Fields
  const [sourceAccount, setSourceAccount] = useState('');
  const [targetAccount, setTargetAccount] = useState('');
  const [payeeName, setPayeeName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('one-time');
  const [nextExecution, setNextExecution] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchScheduled = async () => {
    try {
      const res = await scheduledApi.getAll();
      const scheduledArray = res.data?.data || res.data?.scheduled || (Array.isArray(res.data) ? res.data : []);
      setScheduled(scheduledArray);
    } catch (e) {
      console.log('Error fetching scheduled transfers:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduled();
    if (accounts.length > 0) {
      setSourceAccount(accounts[0].accountNumber);
    }
  }, [accounts]);

  const handleCreate = async () => {
    const amt = parseFloat(amount);
    if (!sourceAccount) return Alert.alert('Error', 'Please select source account');
    if (!targetAccount.trim()) return Alert.alert('Error', 'Please enter target account number');
    if (!payeeName.trim()) return Alert.alert('Error', 'Please enter payee name');
    if (isNaN(amt) || amt <= 0) return Alert.alert('Error', 'Please enter a valid amount');
    if (!nextExecution.trim()) return Alert.alert('Error', 'Please enter execution date');

    setSubmitting(true);
    try {
      await scheduledApi.create({
        sourceAccount,
        targetAccount: targetAccount.trim(),
        payeeName: payeeName.trim(),
        amount: amt,
        frequency,
        nextExecution: new Date(nextExecution).toISOString(),
      });
      Alert.alert('Success', 'Scheduled transfer created successfully');
      setShowAddModal(false);
      // Reset form
      setTargetAccount('');
      setPayeeName('');
      setAmount('');
      setFrequency('one-time');
      setNextExecution('');
      fetchScheduled();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to schedule transfer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = (id: string) => {
    Alert.alert(
      'Cancel Scheduled Transfer',
      'Are you sure you want to cancel this scheduled transfer? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Cancel Transfer',
          style: 'destructive',
          onPress: async () => {
            try {
              await scheduledApi.cancel(id);
              Alert.alert('Success', 'Scheduled transfer cancelled');
              fetchScheduled();
            } catch (e) {
              Alert.alert('Error', 'Failed to cancel transfer');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Scheduled Payments</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Button
          title="Schedule New Payment"
          onPress={() => setShowAddModal(true)}
          style={{ marginBottom: Spacing.md }}
        />

        {scheduled.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="time-outline" size={64} color={Colors.textDim} />
            <Text style={styles.emptyTitle}>No Scheduled Payments</Text>
            <Text style={styles.emptyMsg}>You have no pending scheduled recurring or one-time transfers.</Text>
          </View>
        ) : (
          scheduled.map((item) => (
            <View key={item._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.payee}>{item.payeeName}</Text>
                  <Text style={styles.acc}>To: {maskAccountNumber(item.targetAccount)}</Text>
                </View>
                <TouchableOpacity onPress={() => handleCancel(item._id)}>
                  <Ionicons name="trash-outline" size={20} color={Colors.error} />
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <View style={styles.details}>
                <View style={styles.detailItem}>
                  <Text style={styles.labelMuted}>Amount</Text>
                  <Text style={styles.detailVal}>{formatCurrency(item.amount)}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.labelMuted}>Frequency</Text>
                  <Text style={styles.detailVal}>{item.frequency?.toUpperCase()}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.labelMuted}>Next Due</Text>
                  <Text style={styles.detailVal}>{formatDate(item.nextExecution)}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Transfer</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody} keyboardShouldPersistTaps="handled">
              <Text style={styles.fieldLabel}>Select Source Account</Text>
              <View style={styles.sourceScroll}>
                {accounts.map(acc => (
                  <TouchableOpacity
                    key={acc._id}
                    style={[styles.accBtn, sourceAccount === acc.accountNumber && styles.accBtnActive]}
                    onPress={() => setSourceAccount(acc.accountNumber)}
                  >
                    <Text style={[styles.accBtnText, sourceAccount === acc.accountNumber && { color: Colors.primary }]}>
                      {acc.accountType} ({maskAccountNumber(acc.accountNumber)})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Input
                label="Payee Account Number"
                placeholder="Enter Payee Account"
                keyboardType="numeric"
                value={targetAccount}
                onChangeText={setTargetAccount}
                leftIcon="card-outline"
                containerStyle={styles.gap}
              />

              <Input
                label="Payee Name"
                placeholder="Enter Payee Name"
                value={payeeName}
                onChangeText={setPayeeName}
                leftIcon="person-outline"
                containerStyle={styles.gap}
              />

              <Input
                label="Amount (₹)"
                placeholder="e.g. 5000"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                leftIcon="wallet-outline"
                containerStyle={styles.gap}
              />

              <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>Select Frequency</Text>
              <View style={styles.sourceScroll}>
                {['one-time', 'daily', 'weekly', 'monthly'].map(freq => (
                  <TouchableOpacity
                    key={freq}
                    style={[styles.freqBtn, frequency === freq && styles.freqBtnActive]}
                    onPress={() => setFrequency(freq)}
                  >
                    <Text style={[styles.freqBtnText, frequency === freq && { color: Colors.primary }]}>
                      {freq.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Input
                label="Next Execution Date (YYYY-MM-DD)"
                placeholder="e.g. 2026-07-15"
                value={nextExecution}
                onChangeText={setNextExecution}
                leftIcon="calendar-outline"
                containerStyle={styles.gap}
              />

              <Button
                title="Create Schedule"
                onPress={handleCreate}
                loading={submitting}
                fullWidth
                style={styles.modalBtn}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  back: { padding: 4 },
  title: { ...Typography.h2, color: Colors.text },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 40 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { ...Typography.h3, color: Colors.text, marginTop: Spacing.md },
  emptyMsg: { ...Typography.body, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  payee: { ...Typography.body, color: Colors.text, fontWeight: '700' },
  acc: { ...Typography.caption, color: Colors.textMuted },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  details: { flexDirection: 'row', gap: Spacing.md },
  detailItem: { flex: 1 },
  labelMuted: { ...Typography.caption, color: Colors.textMuted, marginBottom: 2 },
  detailVal: { ...Typography.bodySmall, color: Colors.text, fontWeight: '600' },
  modalBg: { flex: 1, backgroundColor: 'rgba(2,11,24,0.85)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.surface, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, minHeight: '60%', maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  modalTitle: { ...Typography.h3, color: Colors.text },
  modalBody: { padding: Spacing.lg, paddingBottom: 40 },
  fieldLabel: { ...Typography.label, color: Colors.textMuted, marginBottom: Spacing.sm },
  sourceScroll: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  accBtn: { padding: Spacing.sm, borderRadius: Radius.sm, backgroundColor: Colors.surface2, borderStyle: 'solid', borderWidth: 1, borderColor: Colors.border },
  accBtnActive: { borderColor: Colors.primary },
  accBtnText: { ...Typography.caption, color: Colors.textMuted, fontWeight: '600' },
  freqBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: Radius.sm, backgroundColor: Colors.surface2, borderStyle: 'solid', borderWidth: 1, borderColor: Colors.border },
  freqBtnActive: { borderColor: Colors.primary },
  freqBtnText: { ...Typography.caption, color: Colors.textMuted, fontWeight: '600' },
  gap: { marginTop: Spacing.md },
  modalBtn: { marginTop: Spacing.xl },
});

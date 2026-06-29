import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { loansApi } from '@/services/api/index';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, Typography, Radius } from '@/theme';
import { formatCurrency, formatDate } from '@/utils/format';

interface Loan {
  _id: string;
  loanType: string;
  amount: number;
  interestRate: number;
  durationMonths: number;
  monthlyEMI: number;
  status: string;
  purpose: string;
  createdAt: string;
  emiSchedule?: Array<{
    month: number;
    amount: number;
    dueDate: string;
    status: string;
  }>;
}

export default function LoansScreen() {
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showEmiModal, setShowEmiModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  // New Loan Form fields
  const [loanType, setLoanType] = useState('Personal Loan');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchLoans = async () => {
    try {
      const res = await loansApi.getLoans();
      const loansArray = res.data?.data || res.data?.loans || (Array.isArray(res.data) ? res.data : []);
      setLoans(loansArray);
    } catch (e) {
      console.log('Error fetching loans:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleApply = async () => {
    const amt = parseFloat(amount);
    const dur = parseInt(duration);
    if (isNaN(amt) || amt <= 0) return Alert.alert('Error', 'Please enter a valid loan amount');
    if (isNaN(dur) || dur <= 0) return Alert.alert('Error', 'Please enter duration in months');
    if (!purpose.trim()) return Alert.alert('Error', 'Please enter purpose');

    setSubmitting(true);
    try {
      await loansApi.apply({
        loanType,
        amount: amt,
        durationMonths: dur,
        purpose: purpose.trim(),
      });
      Alert.alert('Success', 'Your loan application has been submitted successfully.');
      setShowApplyModal(false);
      // Reset form
      setAmount('');
      setDuration('');
      setPurpose('');
      fetchLoans();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Application failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return Colors.success;
      case 'pending': return Colors.warning;
      case 'rejected': return Colors.error;
      default: return Colors.textMuted;
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>My Loans</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {loans.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="trending-up-outline" size={64} color={Colors.textDim} />
            <Text style={styles.emptyTitle}>No Loan Applications</Text>
            <Text style={styles.emptyMsg}>You don't have any active loans or applications with LomaX.</Text>
            <Button title="Apply for a Loan" onPress={() => setShowApplyModal(true)} style={styles.applyBtn} />
          </View>
        ) : (
          <View style={styles.loansSection}>
            <Button title="Apply for a Loan" onPress={() => setShowApplyModal(true)} style={{ marginBottom: Spacing.md }} />
            {loans.map((loan) => (
              <View key={loan._id} style={styles.loanCard}>
                <View style={styles.loanHeader}>
                  <View>
                    <Text style={styles.loanType}>{loan.loanType}</Text>
                    <Text style={styles.loanDate}>Applied on {formatDate(loan.createdAt)}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: `${getStatusColor(loan.status)}22` }]}>
                    <Text style={[styles.badgeText, { color: getStatusColor(loan.status) }]}>
                      {loan.status?.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.loanBody}>
                  <View style={styles.loanDetail}>
                    <Text style={styles.detailLabel}>Loan Amount</Text>
                    <Text style={styles.detailVal}>{formatCurrency(loan.amount)}</Text>
                  </View>
                  <View style={styles.loanDetail}>
                    <Text style={styles.detailLabel}>Monthly EMI</Text>
                    <Text style={styles.detailVal}>{formatCurrency(loan.monthlyEMI)}</Text>
                  </View>
                </View>

                <View style={[styles.loanBody, { marginTop: Spacing.md }]}>
                  <View style={styles.loanDetail}>
                    <Text style={styles.detailLabel}>Duration</Text>
                    <Text style={styles.detailVal}>{loan.durationMonths} Months</Text>
                  </View>
                  <View style={styles.loanDetail}>
                    <Text style={styles.detailLabel}>Interest Rate</Text>
                    <Text style={styles.detailVal}>{loan.interestRate}% P.A.</Text>
                  </View>
                </View>

                {loan.status === 'approved' && (
                  <Button
                    title="View EMI Schedule"
                    variant="outline"
                    size="sm"
                    style={{ marginTop: Spacing.md }}
                    onPress={() => {
                      setSelectedLoan(loan);
                      setShowEmiModal(true);
                    }}
                  />
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Apply Loan Modal */}
      <Modal visible={showApplyModal} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Apply for Loan</Text>
              <TouchableOpacity onPress={() => setShowApplyModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">
              <Text style={styles.fieldLabel}>Select Loan Type</Text>
              <View style={styles.typeOptions}>
                {['Personal Loan', 'Home Loan', 'Car Loan', 'Education Loan'].map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typeBtn, loanType === type && styles.typeBtnActive]}
                    onPress={() => setLoanType(type)}
                  >
                    <Text style={[styles.typeBtnText, loanType === type && { color: Colors.primary }]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Input
                label="Amount Requested (₹)"
                placeholder="e.g. 50000"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                leftIcon="wallet-outline"
                containerStyle={styles.gap}
              />

              <Input
                label="Duration (Months)"
                placeholder="e.g. 12"
                keyboardType="numeric"
                value={duration}
                onChangeText={setDuration}
                leftIcon="time-outline"
                containerStyle={styles.gap}
              />

              <Input
                label="Purpose of Loan"
                placeholder="Describe why you need this loan"
                value={purpose}
                onChangeText={setPurpose}
                leftIcon="document-text-outline"
                containerStyle={styles.gap}
              />

              <Button
                title="Submit Application"
                onPress={handleApply}
                loading={submitting}
                fullWidth
                style={styles.modalBtn}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* EMI Schedule Modal */}
      <Modal visible={showEmiModal} animationType="fade" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>EMI Schedule</Text>
              <TouchableOpacity onPress={() => setShowEmiModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={selectedLoan?.emiSchedule || []}
              keyExtractor={(item) => String(item.month)}
              contentContainerStyle={{ padding: Spacing.lg }}
              renderItem={({ item }) => (
                <View style={styles.emiItem}>
                  <View>
                    <Text style={styles.emiMonth}>Month {item.month}</Text>
                    <Text style={styles.emiDate}>Due: {formatDate(item.dueDate)}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.emiAmount}>{formatCurrency(item.amount)}</Text>
                    <Text style={[styles.emiStatus, { color: item.status === 'paid' ? Colors.success : Colors.warning }]}>
                      {item.status?.toUpperCase()}
                    </Text>
                  </View>
                </View>
              )}
            />
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
  emptyMsg: { ...Typography.body, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm, marginBottom: Spacing.xl },
  applyBtn: { width: '80%' },
  loansSection: { paddingBottom: Spacing.xl },
  loanCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
  loanHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  loanType: { ...Typography.body, color: Colors.text, fontWeight: '700' },
  loanDate: { ...Typography.caption, color: Colors.textMuted },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  badgeText: { ...Typography.caption, fontWeight: '700' },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  loanBody: { flexDirection: 'row', justifyContent: 'space-between' },
  loanDetail: { flex: 1 },
  detailLabel: { ...Typography.caption, color: Colors.textMuted, marginBottom: 2 },
  detailVal: { ...Typography.body, color: Colors.text, fontWeight: '600' },
  modalBg: { flex: 1, backgroundColor: 'rgba(2,11,24,0.85)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.surface, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, minHeight: '60%', maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  modalTitle: { ...Typography.h3, color: Colors.text },
  modalScroll: { padding: Spacing.lg, paddingBottom: 40 },
  fieldLabel: { ...Typography.label, color: Colors.textMuted, marginBottom: Spacing.sm },
  typeOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  typeBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: Radius.sm, backgroundColor: Colors.surface2, borderStyle: 'solid', borderWidth: 1, borderColor: Colors.border },
  typeBtnActive: { borderColor: Colors.primary },
  typeBtnText: { ...Typography.caption, color: Colors.textMuted, fontWeight: '600' },
  gap: { marginTop: Spacing.md },
  modalBtn: { marginTop: Spacing.xl },
  emiItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  emiMonth: { ...Typography.body, color: Colors.text, fontWeight: '600' },
  emiDate: { ...Typography.caption, color: Colors.textMuted },
  emiAmount: { ...Typography.body, color: Colors.text, fontWeight: '700' },
  emiStatus: { ...Typography.caption, fontWeight: '600' },
});

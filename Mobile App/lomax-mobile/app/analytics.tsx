import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { analyticsApi } from '@/services/api/index';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, Typography, Radius } from '@/theme';
import { formatCurrency } from '@/utils/format';

interface Budget {
  _id: string;
  category: string;
  amount: number;
  spent: number;
}

interface SavingsGoal {
  _id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

interface SmartAnalytics {
  totalSpent: number;
  monthlySavings: number;
  healthScore: number;
  fraudRisk: string;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

export default function AnalyticsScreen() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<SmartAnalytics | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savings, setSavings] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & Forms
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [activeGoal, setActiveGoal] = useState<SavingsGoal | null>(null);

  const [budgetCategory, setBudgetCategory] = useState('Bills');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  const [actionLoading, setActionLoading] = useState(false);

  const fetchAnalyticsData = async () => {
    try {
      const [anRes, bgRes, svRes] = await Promise.all([
        analyticsApi.getSmart(),
        analyticsApi.getBudgets(),
        analyticsApi.getSavings(),
      ]);
      setAnalytics(anRes.data?.analytics || anRes.data || null);
      setBudgets(bgRes.data?.budgets || bgRes.data || []);
      setSavings(svRes.data?.savings || svRes.data || []);
    } catch (e) {
      console.log('Error fetching analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const handleSetBudget = async () => {
    const amt = parseFloat(budgetAmount);
    if (isNaN(amt) || amt <= 0) return Alert.alert('Error', 'Please enter a valid amount');
    setActionLoading(true);
    try {
      await analyticsApi.setBudget({ category: budgetCategory, amount: amt });
      Alert.alert('Success', 'Budget set successfully');
      setShowBudgetModal(false);
      setBudgetAmount('');
      fetchAnalyticsData();
    } catch (e) {
      Alert.alert('Error', 'Failed to save budget');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateGoal = async () => {
    const amt = parseFloat(goalTarget);
    if (!goalTitle.trim()) return Alert.alert('Error', 'Please enter a goal title');
    if (isNaN(amt) || amt <= 0) return Alert.alert('Error', 'Please enter a valid target amount');
    setActionLoading(true);
    try {
      await analyticsApi.createSavingsGoal({
        title: goalTitle,
        targetAmount: amt,
        targetDate: goalDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      });
      Alert.alert('Success', 'Savings goal created');
      setShowSavingsModal(false);
      setGoalTitle('');
      setGoalTarget('');
      setGoalDate('');
      fetchAnalyticsData();
    } catch (e) {
      Alert.alert('Error', 'Failed to create savings goal');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDepositGoal = async () => {
    const amt = parseFloat(depositAmount);
    if (!activeGoal) return;
    if (isNaN(amt) || amt <= 0) return Alert.alert('Error', 'Please enter a valid amount');
    setActionLoading(true);
    try {
      await analyticsApi.addDeposit({
        goalId: activeGoal._id,
        amount: amt,
      });
      Alert.alert('Success', 'Deposit successful');
      setShowDepositModal(false);
      setDepositAmount('');
      setActiveGoal(null);
      fetchAnalyticsData();
    } catch (e) {
      Alert.alert('Error', 'Failed to deposit');
    } finally {
      setActionLoading(false);
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return Colors.success;
    if (score >= 50) return Colors.warning;
    return Colors.error;
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Smart Analytics</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Core Metrics */}
        {analytics && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Financial Overview</Text>
            <View style={styles.overviewRow}>
              <View style={styles.overviewItem}>
                <Text style={styles.overviewLabel}>Total Spent</Text>
                <Text style={[styles.overviewVal, { color: Colors.error }]}>
                  {formatCurrency(analytics.totalSpent || 0)}
                </Text>
              </View>
              <View style={styles.overviewItem}>
                <Text style={styles.overviewLabel}>Savings</Text>
                <Text style={[styles.overviewVal, { color: Colors.success }]}>
                  {formatCurrency(analytics.monthlySavings || 0)}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Health Score Gauge */}
            <View style={styles.healthRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.healthTitle}>Financial Health Score</Text>
                <Text style={styles.healthDesc}>Based on budget compliance and fraud risk logs</Text>
              </View>
              <View style={[styles.healthCircle, { borderColor: getHealthColor(analytics.healthScore || 85) }]}>
                <Text style={[styles.healthText, { color: getHealthColor(analytics.healthScore || 85) }]}>
                  {analytics.healthScore || 85}
                </Text>
              </View>
            </View>

            {analytics.fraudRisk && (
              <View style={styles.fraudBox}>
                <Ionicons name="shield-outline" size={16} color={Colors.primary} />
                <Text style={styles.fraudText}>Security Standing: {analytics.fraudRisk}</Text>
              </View>
            )}
          </View>
        )}

        {/* Category Breakdown */}
        {analytics?.categoryBreakdown && analytics.categoryBreakdown.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Spending by Category</Text>
            <View style={styles.breakdownCard}>
              {analytics.categoryBreakdown.map((cat) => (
                <View key={cat.category} style={styles.catRow}>
                  <View style={styles.catHeader}>
                    <Text style={styles.catName}>{cat.category}</Text>
                    <Text style={styles.catVal}>{formatCurrency(cat.amount)} ({cat.percentage}%)</Text>
                  </View>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${cat.percentage}%`, backgroundColor: Colors.primary }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Budgets Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Budgets</Text>
            <TouchableOpacity onPress={() => setShowBudgetModal(true)}>
              <Text style={styles.linkText}>Set Budget</Text>
            </TouchableOpacity>
          </View>

          {budgets.length === 0 ? (
            <Text style={styles.emptyText}>No active budgets set for this month.</Text>
          ) : (
            budgets.map((b) => {
              const percentage = Math.min((b.spent / b.amount) * 100, 100);
              return (
                <View key={b._id} style={styles.budgetCard}>
                  <View style={styles.catHeader}>
                    <Text style={styles.catName}>{b.category}</Text>
                    <Text style={styles.catVal}>
                      {formatCurrency(b.spent)} of {formatCurrency(b.amount)}
                    </Text>
                  </View>
                  <View style={styles.barBg}>
                    <View style={[
                      styles.barFill,
                      {
                        width: `${percentage}%`,
                        backgroundColor: percentage >= 90 ? Colors.error : Colors.success,
                      },
                    ]} />
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Savings Goals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Savings Goals</Text>
            <TouchableOpacity onPress={() => setShowSavingsModal(true)}>
              <Text style={styles.linkText}>Add Goal</Text>
            </TouchableOpacity>
          </View>

          {savings.length === 0 ? (
            <Text style={styles.emptyText}>Start a goal to track your milestones.</Text>
          ) : (
            savings.map((g) => {
              const progress = Math.min((g.currentAmount / g.targetAmount) * 100, 100);
              return (
                <View key={g._id} style={styles.savingsCard}>
                  <View style={styles.savingsHeader}>
                    <View>
                      <Text style={styles.goalTitle}>{g.title}</Text>
                      <Text style={styles.goalProgressText}>
                        {formatCurrency(g.currentAmount)} saved of {formatCurrency(g.targetAmount)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.depositBtn}
                      onPress={() => {
                        setActiveGoal(g);
                        setShowDepositModal(true);
                      }}
                    >
                      <Text style={styles.depositBtnText}>Deposit</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${progress}%`, backgroundColor: Colors.gold }]} />
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>

      {/* Set Budget Modal */}
      <Modal visible={showBudgetModal} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Budget</Text>
              <TouchableOpacity onPress={() => setShowBudgetModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.fieldLabel}>Select Category</Text>
              <View style={styles.typeOptions}>
                {['Food', 'Bills', 'Shopping', 'Travel', 'Entertainment', 'Others'].map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.typeBtn, budgetCategory === cat && styles.typeBtnActive]}
                    onPress={() => setBudgetCategory(cat)}
                  >
                    <Text style={[styles.typeBtnText, budgetCategory === cat && { color: Colors.primary }]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Input
                label="Budget Limit (₹)"
                placeholder="e.g. 10000"
                keyboardType="numeric"
                value={budgetAmount}
                onChangeText={setBudgetAmount}
                leftIcon="wallet-outline"
                containerStyle={styles.gap}
              />

              <Button
                title="Save Budget"
                onPress={handleSetBudget}
                loading={actionLoading}
                fullWidth
                style={styles.modalBtn}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Goal Modal */}
      <Modal visible={showSavingsModal} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Savings Goal</Text>
              <TouchableOpacity onPress={() => setShowSavingsModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Input
                label="Goal Title"
                placeholder="e.g. Emergency Fund"
                value={goalTitle}
                onChangeText={setGoalTitle}
                leftIcon="flag-outline"
              />

              <Input
                label="Target Amount (₹)"
                placeholder="e.g. 50000"
                keyboardType="numeric"
                value={goalTarget}
                onChangeText={setGoalTarget}
                leftIcon="wallet-outline"
                containerStyle={styles.gap}
              />

              <Input
                label="Target Date (YYYY-MM-DD)"
                placeholder="e.g. 2026-12-31"
                value={goalDate}
                onChangeText={setGoalDate}
                leftIcon="calendar-outline"
                containerStyle={styles.gap}
              />

              <Button
                title="Create Goal"
                onPress={handleCreateGoal}
                loading={actionLoading}
                fullWidth
                style={styles.modalBtn}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Goal Deposit Modal */}
      <Modal visible={showDepositModal} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Deposit to Goal</Text>
              <TouchableOpacity onPress={() => setShowDepositModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.goalLabel}>Goal: {activeGoal?.title}</Text>
              <Input
                label="Deposit Amount (₹)"
                placeholder="e.g. 5000"
                keyboardType="numeric"
                value={depositAmount}
                onChangeText={setDepositAmount}
                leftIcon="wallet-outline"
              />

              <Button
                title="Confirm Deposit"
                onPress={handleDepositGoal}
                loading={actionLoading}
                fullWidth
                style={styles.modalBtn}
              />
            </View>
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
  scroll: { paddingHorizontal: Spacing.lg },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.lg },
  cardTitle: { ...Typography.label, color: Colors.primary, marginBottom: Spacing.md, textTransform: 'uppercase' },
  overviewRow: { flexDirection: 'row', gap: Spacing.md },
  overviewItem: { flex: 1 },
  overviewLabel: { ...Typography.caption, color: Colors.textMuted, marginBottom: 2 },
  overviewVal: { ...Typography.h3, fontWeight: '700' },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  healthRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  healthTitle: { ...Typography.body, color: Colors.text, fontWeight: '600' },
  healthDesc: { ...Typography.caption, color: Colors.textMuted },
  healthCircle: { width: 50, height: 50, borderRadius: 25, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  healthText: { ...Typography.body, fontWeight: '700' },
  fraudBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: `${Colors.primary}11`, padding: Spacing.sm, borderRadius: Radius.sm, marginTop: Spacing.md },
  fraudText: { ...Typography.caption, color: Colors.primary, fontWeight: '600' },
  section: { marginTop: Spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  sectionTitle: { ...Typography.h4, color: Colors.text },
  linkText: { ...Typography.bodySmall, color: Colors.primary, fontWeight: '600' },
  breakdownCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: Spacing.lg, gap: Spacing.md },
  catRow: { gap: Spacing.xs },
  catHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  catName: { ...Typography.body, color: Colors.text, fontWeight: '500' },
  catVal: { ...Typography.bodySmall, color: Colors.textMuted },
  barBg: { height: 8, backgroundColor: Colors.surface2, borderRadius: Radius.full, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: Radius.full },
  emptyText: { ...Typography.bodySmall, color: Colors.textMuted, marginVertical: Spacing.xs },
  budgetCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, gap: Spacing.xs, marginBottom: Spacing.sm },
  savingsCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, gap: Spacing.md, marginBottom: Spacing.sm },
  savingsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalTitle: { ...Typography.body, color: Colors.text, fontWeight: '600' },
  goalProgressText: { ...Typography.caption, color: Colors.textMuted },
  depositBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: Radius.sm, backgroundColor: `${Colors.gold}22` },
  depositBtnText: { ...Typography.caption, color: Colors.gold, fontWeight: '700' },
  modalBg: { flex: 1, backgroundColor: 'rgba(2,11,24,0.85)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.surface, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  modalTitle: { ...Typography.h3, color: Colors.text },
  modalBody: { padding: Spacing.lg },
  fieldLabel: { ...Typography.label, color: Colors.textMuted, marginBottom: Spacing.sm },
  typeOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  typeBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: Radius.sm, backgroundColor: Colors.surface2, borderStyle: 'solid', borderWidth: 1, borderColor: Colors.border },
  typeBtnActive: { borderColor: Colors.primary },
  typeBtnText: { ...Typography.caption, color: Colors.textMuted, fontWeight: '600' },
  gap: { marginTop: Spacing.md },
  modalBtn: { marginTop: Spacing.xl },
  goalLabel: { ...Typography.body, color: Colors.text, fontWeight: '700', marginBottom: Spacing.md },
});

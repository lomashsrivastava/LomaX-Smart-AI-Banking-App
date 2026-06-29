import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl,
  TouchableOpacity, FlatList, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/auth.store';
import { useAccountsStore, useTransactionsStore } from '@/stores/index';
import { accountsApi, transactionsApi } from '@/services/api/index';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors, Spacing, Typography, Radius } from '@/theme';
import { formatCurrency, formatCompactCurrency, maskAccountNumber, getInitials, formatDate } from '@/utils/format';

const { width } = Dimensions.get('window');

const QUICK_ACTIONS = [
  { icon: 'swap-horizontal', label: 'Transfer', route: '/(tabs)/transfer', color: Colors.primary },
  { icon: 'add-circle', label: 'Deposit', route: '/(tabs)/transfer', color: Colors.success },
  { icon: 'remove-circle', label: 'Withdraw', route: '/(tabs)/transfer', color: Colors.warning },
  { icon: 'card', label: 'Cards', route: '/cards', color: Colors.secondary },
  { icon: 'trending-up', label: 'Loans', route: '/loans', color: Colors.gold },
  { icon: 'document-text', label: 'Statement', route: '/statement', color: Colors.info },
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { accounts, setAccounts } = useAccountsStore();
  const { transactions, setTransactions } = useTransactionsStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);

  const customerId = user?.customerId || user?.id || '';

  const fetchData = useCallback(async () => {
    if (!customerId) return;
    try {
      const [accRes, txnRes] = await Promise.all([
        accountsApi.getAccounts(customerId),
        transactionsApi.getHistory({ limit: 5 }),
      ]);
      const accountsArray = accRes.data?.data || accRes.data?.accounts || (Array.isArray(accRes.data) ? accRes.data : []);
      setAccounts(accountsArray);
      const txns = txnRes.data?.data || txnRes.data?.transactions || (Array.isArray(txnRes.data) ? txnRes.data : []);
      setTransactions(txns.slice(0, 5));
    } catch (e) {
      console.log('Dashboard fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [customerId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={Colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient colors={['#020B18', '#0A1628']} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.userName}>{user?.name || 'Customer'}</Text>
              <Text style={styles.customerId}>{customerId}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} activeOpacity={0.7} style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(user?.name || 'DC')}</Text>
            </TouchableOpacity>
          </View>

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <LinearGradient colors={['#0F1E35', '#162440']} style={styles.balanceGradient}>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
                <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
                  <Ionicons name={balanceVisible ? 'eye' : 'eye-off'} size={18} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
              <Text style={styles.balanceAmount}>
                {balanceVisible ? formatCurrency(totalBalance) : '₹ ••••••••'}
              </Text>
              <Text style={styles.accountCount}>{accounts.length} Account{accounts.length !== 1 ? 's' : ''}</Text>
            </LinearGradient>
          </View>
        </LinearGradient>

        {/* Account Cards */}
        {accounts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Accounts</Text>
            <FlatList
              data={accounts}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: 12 }}
              renderItem={({ item }) => (
                <LinearGradient colors={['#00D4FF22', '#6C63FF22']} style={styles.accountCard}>
                  <View style={styles.accountCardTop}>
                    <Text style={styles.accountType}>{item.accountType}</Text>
                    <View style={[styles.statusDot, { backgroundColor: item.status === 'active' ? Colors.success : Colors.warning }]} />
                  </View>
                  <Text style={styles.accountNumber}>{maskAccountNumber(item.accountNumber)}</Text>
                  <Text style={styles.accountBalance}>{balanceVisible ? formatCurrency(item.balance) : '₹ ••••'}</Text>
                  <Text style={styles.accountBranch}>{item.branchName}</Text>
                </LinearGradient>
              )}
            />
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={styles.actionBtn}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}22` }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <><SkeletonCard /><SkeletonCard /></>
          ) : transactions.length === 0 ? (
            <EmptyState icon="receipt-outline" title="No Transactions" message="Your transactions will appear here" />
          ) : (
            transactions.map((txn) => (
              <View key={txn._id} style={styles.txnItem}>
                <View style={[styles.txnIcon, {
                  backgroundColor: txn.type === 'credit' ? Colors.successBg : Colors.errorBg,
                }]}>
                  <Ionicons
                    name={txn.type === 'credit' ? 'arrow-down-circle' : 'arrow-up-circle'}
                    size={22} color={txn.type === 'credit' ? Colors.success : Colors.error}
                  />
                </View>
                <View style={styles.txnInfo}>
                  <Text style={styles.txnName}>{txn.payeeName || txn.remarks || 'Transaction'}</Text>
                  <Text style={styles.txnDate}>{formatDate(txn.createdAt)}</Text>
                </View>
                <Text style={[styles.txnAmount, { color: txn.type === 'credit' ? Colors.success : Colors.error }]}>
                  {txn.type === 'credit' ? '+' : '-'}{formatCompactCurrency(txn.amount)}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.lg },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  greeting: { ...Typography.body, color: Colors.textMuted },
  userName: { ...Typography.h3, color: Colors.text },
  customerId: { ...Typography.caption, color: Colors.primary, fontFamily: 'monospace' },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { ...Typography.h4, color: Colors.background, fontWeight: '700' },
  balanceCard: { borderRadius: Radius.xl, overflow: 'hidden' },
  balanceGradient: { padding: Spacing.lg, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  balanceLabel: { ...Typography.label, color: Colors.textMuted },
  balanceAmount: { ...Typography.displayLarge, color: Colors.text, marginBottom: 4 },
  accountCount: { ...Typography.caption, color: Colors.primary },
  section: { marginTop: Spacing.lg },
  sectionTitle: { ...Typography.h4, color: Colors.text, paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  seeAll: { ...Typography.bodySmall, color: Colors.primary },
  accountCard: {
    width: width * 0.7, padding: Spacing.md, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, gap: 6,
  },
  accountCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  accountType: { ...Typography.label, color: Colors.primary },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  accountNumber: { ...Typography.mono, color: Colors.textMuted, fontSize: 13 },
  accountBalance: { ...Typography.h3, color: Colors.text },
  accountBranch: { ...Typography.caption, color: Colors.textDim },
  actionsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  actionBtn: {
    width: (width - Spacing.lg * 2 - Spacing.sm * 2) / 3,
    alignItems: 'center', gap: 6,
  },
  actionIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center' },
  txnItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface, marginHorizontal: Spacing.lg,
    borderRadius: Radius.md, marginBottom: Spacing.sm,
  },
  txnIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  txnInfo: { flex: 1 },
  txnName: { ...Typography.body, color: Colors.text, fontWeight: '600' },
  txnDate: { ...Typography.caption, color: Colors.textMuted },
  txnAmount: { ...Typography.body, fontWeight: '700' },
});

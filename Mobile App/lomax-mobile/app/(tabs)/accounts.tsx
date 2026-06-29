import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/auth.store';
import { useAccountsStore } from '@/stores/index';
import { accountsApi } from '@/services/api/index';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors, Spacing, Typography, Radius } from '@/theme';
import { formatCurrency, maskAccountNumber } from '@/utils/format';

export default function AccountsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { accounts, setAccounts } = useAccountsStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAccounts = useCallback(async () => {
    const customerId = user?.customerId || user?.id;
    if (!customerId) return;
    try {
      const res = await accountsApi.getAccounts(customerId);
      const accountsArray = res.data?.data || res.data?.accounts || (Array.isArray(res.data) ? res.data : []);
      setAccounts(accountsArray);
    } catch (e) {
      console.log('Accounts fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  const renderAccount = ({ item }: any) => (
    <TouchableOpacity activeOpacity={0.85}>
      <LinearGradient colors={['#0F1E35', '#162440']} style={styles.card}>
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.accountType}>{item.accountType}</Text>
            <Text style={styles.accountNum}>{maskAccountNumber(item.accountNumber)}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: item.status === 'active' ? Colors.successBg : Colors.warningBg }]}>
            <Text style={[styles.badgeText, { color: item.status === 'active' ? Colors.success : Colors.warning }]}>
              {item.status?.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.balance}>{formatCurrency(item.balance)}</Text>

        <View style={styles.divider} />

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>IFSC</Text>
            <Text style={styles.detailValue}>{item.ifscCode}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Branch</Text>
            <Text style={styles.detailValue} numberOfLines={1}>{item.branchName}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="copy-outline" size={14} color={Colors.primary} />
            <Text style={styles.actionText}>Copy Number</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}
            onPress={() => router.push('/(tabs)/history')}
          >
            <Ionicons name="receipt-outline" size={14} color={Colors.primary} />
            <Text style={styles.actionText}>Statement</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Accounts</Text>
        <Text style={styles.subtitle}>{accounts.length} account{accounts.length !== 1 ? 's' : ''}</Text>
      </View>

      {loading ? (
        <View style={{ padding: Spacing.lg }}>
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : accounts.length === 0 ? (
        <EmptyState icon="card-outline" title="No Accounts Found" message="Contact your branch to open an account" />
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(item) => item._id}
          renderItem={renderAccount}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAccounts(); }} tintColor={Colors.primary} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.lg, paddingBottom: Spacing.md },
  title: { ...Typography.h2, color: Colors.text },
  subtitle: { ...Typography.body, color: Colors.textMuted, marginTop: 2 },
  list: { padding: Spacing.lg, gap: Spacing.md },
  card: { borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  accountType: { ...Typography.label, color: Colors.primary, marginBottom: 4 },
  accountNum: { ...Typography.mono, color: Colors.textMuted, fontSize: 15 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  badgeText: { ...Typography.caption, fontWeight: '700' },
  balance: { ...Typography.displayMedium, color: Colors.text, marginBottom: Spacing.md },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: Spacing.md },
  details: { flexDirection: 'row', gap: Spacing.xl, marginBottom: Spacing.md },
  detailItem: { flex: 1 },
  detailLabel: { ...Typography.caption, color: Colors.textDim, marginBottom: 2 },
  detailValue: { ...Typography.bodySmall, color: Colors.text, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: Spacing.md },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { ...Typography.caption, color: Colors.primary, fontWeight: '600' },
});

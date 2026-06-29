import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTransactionsStore } from '@/stores/index';
import { transactionsApi } from '@/services/api/index';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors, Spacing, Typography, Radius } from '@/theme';
import { formatCurrency, formatDate, getTransactionIcon } from '@/utils/format';

type FilterType = 'all' | 'credit' | 'debit';

export default function HistoryScreen() {
  const router = useRouter();
  const {
    transactions, page, hasMore, isLoading,
    setTransactions, appendTransactions, setPage, setHasMore, setLoading, reset,
  } = useTransactionsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = useCallback(async (pageNum: number, isRefresh = false) => {
    setLoading(true);
    try {
      const limit = 15;
      const res = await transactionsApi.getHistory({
        page: pageNum,
        limit,
      });

      // Handle paginated data response
      const results = res.data?.results || res.data?.data || res.data?.transactions || res.data || [];
      const total = res.data?.total || results.length;
      
      const newTxns = Array.isArray(results) ? results : [];

      if (isRefresh || pageNum === 1) {
        setTransactions(newTxns);
      } else {
        appendTransactions(newTxns);
      }

      setHasMore(newTxns.length >= limit);
    } catch (e) {
      console.log('Error fetching history:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    reset();
    fetchHistory(1, true);
  }, [fetchHistory]);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    fetchHistory(1, true);
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchHistory(nextPage);
    }
  };

  // Local filtering based on UI search/tab select
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.remarks?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.payeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.transactionId?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      filterType === 'all' || t.type?.toLowerCase() === filterType;

    return matchesSearch && matchesType;
  });

  const renderTxn = ({ item }: any) => {
    const isCredit = item.type?.toLowerCase() === 'credit';
    return (
      <View style={styles.txnItem}>
        <View style={[styles.iconBox, { backgroundColor: isCredit ? Colors.successBg : Colors.errorBg }]}>
          <Ionicons
            name={getTransactionIcon(item.type) as any}
            size={22}
            color={isCredit ? Colors.success : Colors.error}
          />
        </View>
        <View style={styles.txnInfo}>
          <Text style={styles.txnTitle} numberOfLines={1}>
            {item.payeeName || item.remarks || 'LomaX Transaction'}
          </Text>
          <Text style={styles.txnSubtitle}>{formatDate(item.createdAt, 'long')}</Text>
          <Text style={styles.txId}>{item.transactionId}</Text>
        </View>
        <View style={styles.txnAmountContainer}>
          <Text style={[styles.txnAmount, { color: isCredit ? Colors.success : Colors.error }]}>
            {isCredit ? '+' : '-'}{formatCurrency(item.amount)}
          </Text>
          <Text style={styles.txnMode}>{item.transferMode || 'Transfer'}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>History</Text>
          <TouchableOpacity
            style={styles.statementBtn}
            onPress={() => router.push('/statement')}
          >
            <Ionicons name="document-text-outline" size={16} color={Colors.primary} />
            <Text style={styles.statementBtnText}>Export</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <TextInput
            placeholder="Search by name, ID, or remarks..."
            placeholderTextColor={Colors.textDim}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filters */}
        <View style={styles.filters}>
          {(['all', 'credit', 'debit'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.filterTab, filterType === type && styles.filterTabActive]}
              onPress={() => setFilterType(type)}
            >
              <Text style={[styles.filterText, filterType === type && styles.filterTextActive]}>
                {type.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* List */}
      {filteredTransactions.length === 0 && !isLoading ? (
        <EmptyState icon="receipt-outline" title="No Transactions" message="Try adjusting your filters or search query." />
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item._id}
          renderItem={renderTxn}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.primary} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isLoading && !refreshing ? (
              <ActivityIndicator color={Colors.primary} style={{ marginVertical: Spacing.md }} />
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.lg, paddingBottom: 0 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  title: { ...Typography.h2, color: Colors.text },
  statementBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 12, borderRadius: Radius.sm, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border },
  statementBtnText: { ...Typography.caption, color: Colors.primary, fontWeight: '700' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surface2, paddingHorizontal: Spacing.md,
    borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border,
    height: 48,
  },
  searchInput: { flex: 1, color: Colors.text, ...Typography.body },
  filters: { flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  filterTab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  filterTabActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  filterText: { ...Typography.caption, color: Colors.textMuted, fontWeight: '700' },
  filterTextActive: { color: Colors.primary },
  list: { padding: Spacing.lg },
  txnItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  iconBox: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  txnInfo: { flex: 1, gap: 2 },
  txnTitle: { ...Typography.body, color: Colors.text, fontWeight: '600' },
  txnSubtitle: { ...Typography.caption, color: Colors.textMuted },
  txId: { ...Typography.monoSmall, color: Colors.textDim, fontSize: 10 },
  txnAmountContainer: { alignItems: 'flex-end', gap: 2 },
  txnAmount: { ...Typography.body, fontWeight: '700' },
  txnMode: { ...Typography.caption, color: Colors.textDim },
});

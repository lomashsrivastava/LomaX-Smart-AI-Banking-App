import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNotificationsStore } from '@/stores/index';
import { notificationsApi } from '@/services/api/index';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors, Spacing, Typography, Radius } from '@/theme';
import { formatDate } from '@/utils/format';

export default function NotificationsScreen() {
  const {
    notifications, unreadCount, setNotifications, markRead, markAllRead, isLoading, setLoading,
  } = useNotificationsStore();
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await notificationsApi.getAll();
      const notifsArray = res.data?.data || res.data?.notifications || (Array.isArray(res.data) ? res.data : []);
      setNotifications(notifsArray);
    } catch (e) {
      console.log('Error fetching notifications:', e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markRead(id);
      markRead(id);
    } catch (e) {
      console.log('Error marking as read:', e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      markAllRead();
    } catch (e) {
      console.log('Error marking all read:', e);
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'transaction':
      case 'transfer':
      case 'deposit':
      case 'withdraw':
        return 'swap-horizontal-outline';
      case 'security':
      case 'auth':
      case 'login':
        return 'shield-checkmark-outline';
      case 'alert':
      case 'loan':
        return 'alert-circle-outline';
      default:
        return 'notifications-outline';
    }
  };

  const getNotifIconColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'transaction':
        return Colors.primary;
      case 'security':
        return Colors.success;
      case 'alert':
        return Colors.warning;
      default:
        return Colors.textMuted;
    }
  };

  const renderNotif = ({ item }: any) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.item, !item.read && styles.itemUnread]}
      onPress={() => !item.read && handleMarkAsRead(item._id)}
    >
      <View style={[styles.iconBox, { backgroundColor: `${getNotifIconColor(item.type)}15` }]}>
        <Ionicons name={getNotifIcon(item.type) as any} size={20} color={getNotifIconColor(item.type)} />
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={[styles.itemTitle, !item.read && styles.itemTitleUnread]}>{item.title}</Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.itemMessage}>{item.message}</Text>
        <Text style={styles.itemTime}>{formatDate(item.createdAt, 'long')} at {formatDate(item.createdAt, 'time')}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Alerts & Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.subtitle}>{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <EmptyState icon="notifications-off-outline" title="No Notifications" message="You will receive alerts here when transactions occur." />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderNotif}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.primary} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.lg, paddingBottom: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { ...Typography.h2, color: Colors.text },
  subtitle: { ...Typography.bodySmall, color: Colors.primary, marginTop: 2 },
  markAllBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: Radius.sm, backgroundColor: Colors.surface2 },
  markAllText: { ...Typography.caption, color: Colors.primary, fontWeight: '700' },
  list: { paddingHorizontal: Spacing.lg },
  item: {
    flexDirection: 'row', gap: Spacing.md, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  itemUnread: { backgroundColor: `${Colors.primary}05`, marginHorizontal: -Spacing.lg, paddingHorizontal: Spacing.lg },
  iconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { ...Typography.body, color: Colors.text, fontWeight: '500' },
  itemTitleUnread: { fontWeight: '700' },
  itemMessage: { ...Typography.bodySmall, color: Colors.textMuted, lineHeight: 18 },
  itemTime: { ...Typography.caption, color: Colors.textDim, marginTop: 4 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
});

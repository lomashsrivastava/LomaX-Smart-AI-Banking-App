import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/auth.store';
import { Colors, Spacing, Typography, Radius } from '@/theme';
import { getInitials } from '@/utils/format';

interface MenuOption {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route?: string;
  color?: string;
  onPress?: () => void;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of LomaX Banking?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const menuSections: { title: string; options: MenuOption[] }[] = [
    {
      title: 'Banking Features',
      options: [
        { icon: 'card', label: 'My Cards', route: '/cards', color: Colors.primary },
        { icon: 'trending-up', label: 'My Loans', route: '/loans', color: Colors.gold },
        { icon: 'pie-chart', label: 'Smart Analytics', route: '/analytics', color: Colors.secondary },
        { icon: 'people', label: 'Beneficiaries', route: '/beneficiaries', color: Colors.info },
        { icon: 'time', label: 'Scheduled Transfers', route: '/scheduled', color: Colors.warning },
      ],
    },
    {
      title: 'Security & Preferences',
      options: [
        { icon: 'settings-sharp', label: 'Settings', route: '/settings', color: Colors.textMuted },
        { icon: 'log-out', label: 'Sign Out', onPress: handleLogout, color: Colors.error },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user?.name || 'DC')}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'LomaX Customer'}</Text>
          <Text style={styles.customerId}>ID: {user?.customerId || user?.id}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Menu Sections */}
        {menuSections.map((sec) => (
          <View key={sec.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{sec.title}</Text>
            <View style={styles.menu}>
              {sec.options.map((opt) => (
                <TouchableOpacity
                  key={opt.label}
                  style={styles.menuItem}
                  onPress={() => {
                    if (opt.onPress) opt.onPress();
                    else if (opt.route) router.push(opt.route as any);
                  }}
                >
                  <View style={[styles.iconBox, { backgroundColor: `${opt.color || Colors.primary}15` }]}>
                    <Ionicons name={opt.icon} size={20} color={opt.color || Colors.primary} />
                  </View>
                  <Text style={styles.menuLabel}>{opt.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textDim} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg },
  userCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.xl, alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: { ...Typography.h1, color: Colors.background, fontWeight: '700' },
  userName: { ...Typography.h3, color: Colors.text, marginBottom: 2 },
  customerId: { ...Typography.mono, color: Colors.primary, fontSize: 13, marginBottom: 4 },
  email: { ...Typography.bodySmall, color: Colors.textMuted },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { ...Typography.label, color: Colors.textMuted, marginBottom: Spacing.sm, textTransform: 'uppercase' },
  menu: { backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.md, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  iconBox: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { ...Typography.body, color: Colors.text, flex: 1 },
});

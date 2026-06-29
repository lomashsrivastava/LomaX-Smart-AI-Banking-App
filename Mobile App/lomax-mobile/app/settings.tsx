import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, Typography, Radius } from '@/theme';

export default function SettingsScreen() {
  const router = useRouter();

  // Notification Preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  // Security Toggles
  const [twoFactor, setTwoFactor] = useState(false);

  // Change Password Form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirm) {
      return Alert.alert('Error', 'Please fill in all fields');
    }
    if (newPassword !== confirm) {
      return Alert.alert('Error', 'New passwords do not match');
    }

    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Your password has been changed successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirm('');
    }, 1200);
  };

  const handleToggle2FA = (val: boolean) => {
    if (val) {
      Alert.alert(
        'Setup 2FA',
        'Scan QR code in Google Authenticator or use secret key:\n\nLOMAX-AUTH-KEY-2026',
        [
          { text: 'Cancel', onPress: () => setTwoFactor(false), style: 'cancel' },
          { text: 'Confirm Active', onPress: () => setTwoFactor(true) },
        ]
      );
    } else {
      setTwoFactor(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View>
                <Text style={styles.itemTitle}>Push Notifications</Text>
                <Text style={styles.itemDesc}>Receive instant balance updates</Text>
              </View>
              <Switch value={pushAlerts} onValueChange={setPushAlerts} />
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View>
                <Text style={styles.itemTitle}>Email Alerts</Text>
                <Text style={styles.itemDesc}>Receive statements & logins via email</Text>
              </View>
              <Switch value={emailAlerts} onValueChange={setEmailAlerts} />
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View>
                <Text style={styles.itemTitle}>SMS Alerts</Text>
                <Text style={styles.itemDesc}>Receive standard phone SMS notifications</Text>
              </View>
              <Switch value={smsAlerts} onValueChange={setSmsAlerts} />
            </View>
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Settings</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View>
                <Text style={styles.itemTitle}>Two-Factor Authentication (2FA)</Text>
                <Text style={styles.itemDesc}>Enhance security with dynamic TOTP codes</Text>
              </View>
              <Switch value={twoFactor} onValueChange={handleToggle2FA} />
            </View>

            <View style={styles.divider} />

            <Text style={styles.formTitle}>Change Password</Text>
            <Input
              label="Current Password"
              placeholder="Enter current password"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
              leftIcon="lock-closed-outline"
            />

            <Input
              label="New Password"
              placeholder="Enter new password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              leftIcon="lock-closed-outline"
              containerStyle={styles.gap}
            />

            <Input
              label="Confirm New Password"
              placeholder="Confirm new password"
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
              leftIcon="lock-closed-outline"
              containerStyle={styles.gap}
            />

            <Button
              title="Update Password"
              onPress={handlePasswordChange}
              loading={loading}
              fullWidth
              style={styles.btn}
            />
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>LomaX Mobile Banking • Version 1.0.0 (Production)</Text>
          <Text style={styles.infoText}>© 2026 LomaX Digital Bank Ltd. All rights reserved.</Text>
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
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 40 },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { ...Typography.label, color: Colors.primary, marginBottom: Spacing.sm, textTransform: 'uppercase' },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { ...Typography.body, color: Colors.text, fontWeight: '600' },
  itemDesc: { ...Typography.caption, color: Colors.textMuted },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  formTitle: { ...Typography.body, color: Colors.text, fontWeight: '700', marginBottom: Spacing.md },
  gap: { marginTop: Spacing.md },
  btn: { marginTop: Spacing.lg },
  infoBox: { alignItems: 'center', marginTop: Spacing.xl, gap: 4 },
  infoText: { ...Typography.caption, color: Colors.textDim, textAlign: 'center' },
});

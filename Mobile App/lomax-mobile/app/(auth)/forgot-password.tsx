import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, Typography, Radius } from '@/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (!customerId.trim()) return Alert.alert('Error', 'Enter your Customer ID');
    setStep(1);
  };

  const handleReset = () => {
    if (!newPassword || newPassword !== confirm)
      return Alert.alert('Error', 'Passwords do not match');
    Alert.alert('Success', 'Password updated! Please login.', [
      { text: 'OK', onPress: () => router.replace('/(auth)/login') },
    ]);
  };

  return (
    <LinearGradient colors={['#020B18', '#0A1628']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => (step > 0 ? setStep(0) : router.back())} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.icon}>
          <Ionicons name="key-outline" size={48} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          {step === 0 ? 'Enter your Customer ID to continue' : 'Set your new password'}
        </Text>

        <View style={styles.card}>
          {step === 0 ? (
            <>
              <Input label="Customer ID" placeholder="e.g. CUST100001" value={customerId}
                onChangeText={setCustomerId} leftIcon="person-outline" autoCapitalize="characters" />
              <Button title="Continue" onPress={handleNext} fullWidth style={styles.btn} />
            </>
          ) : (
            <>
              <Input label="New Password" value={newPassword} onChangeText={setNewPassword}
                secureTextEntry leftIcon="lock-closed-outline" placeholder="New password"
                containerStyle={styles.gap} />
              <Input label="Confirm Password" value={confirm} onChangeText={setConfirm}
                secureTextEntry leftIcon="lock-closed-outline" placeholder="Confirm password"
                containerStyle={styles.gap} />
              <Button title="Reset Password" onPress={handleReset} fullWidth style={styles.btn} />
            </>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: Spacing.lg, paddingTop: 60 },
  back: { marginBottom: Spacing.xl },
  icon: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: `${Colors.primary}22`,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: Spacing.lg,
  },
  title: { ...Typography.h2, color: Colors.text, textAlign: 'center', marginBottom: 4 },
  subtitle: { ...Typography.body, color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.xl },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  btn: { marginTop: Spacing.lg },
  gap: { marginTop: Spacing.md },
});

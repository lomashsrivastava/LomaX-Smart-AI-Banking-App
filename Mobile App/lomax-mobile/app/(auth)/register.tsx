import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { authApi } from '@/services/api/auth.api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, Typography, Radius } from '@/theme';

const STEPS = ['Personal Info', 'Account Type', 'Review'];

export default function RegisterScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', mobile: '',
    pan: '', aadhaar: '', dob: '', gender: 'Male',
    address: '', city: '', state: '', pincode: '',
    accountType: 'Savings Account',
    initialDeposit: '1000',
  });

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      await authApi.register(form);
      router.replace('/(auth)/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#020B18', '#0A1628']} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => (step > 0 ? setStep(step - 1) : router.back())} style={styles.back}>
              <Ionicons name="arrow-back" size={22} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Open Account</Text>
          </View>

          {/* Stepper */}
          <View style={styles.stepper}>
            {STEPS.map((s, i) => (
              <View key={s} style={styles.stepItem}>
                <View style={[styles.stepDot, i <= step && styles.stepDotActive]}>
                  {i < step
                    ? <Ionicons name="checkmark" size={14} color="#fff" />
                    : <Text style={styles.stepNum}>{i + 1}</Text>}
                </View>
                <Text style={[styles.stepLabel, i <= step && styles.stepLabelActive]}>{s}</Text>
              </View>
            ))}
          </View>

          {/* Form */}
          <View style={styles.card}>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {step === 0 && (
              <>
                <View style={styles.row}>
                  <Input label="First Name" value={form.firstName} onChangeText={(v) => update('firstName', v)}
                    placeholder="Arjun" containerStyle={styles.half} />
                  <Input label="Last Name" value={form.lastName} onChangeText={(v) => update('lastName', v)}
                    placeholder="Sharma" containerStyle={styles.half} />
                </View>
                <Input label="Email" value={form.email} onChangeText={(v) => update('email', v)}
                  placeholder="arjun@email.com" keyboardType="email-address" containerStyle={styles.gap}
                  leftIcon="mail-outline" />
                <Input label="Mobile" value={form.mobile} onChangeText={(v) => update('mobile', v)}
                  placeholder="+91 98765 43210" keyboardType="phone-pad" containerStyle={styles.gap}
                  leftIcon="call-outline" />
                <Input label="Date of Birth" value={form.dob} onChangeText={(v) => update('dob', v)}
                  placeholder="YYYY-MM-DD" containerStyle={styles.gap} leftIcon="calendar-outline" />
                <Input label="PAN Number" value={form.pan} onChangeText={(v) => update('pan', v)}
                  placeholder="ABCDE1234F" autoCapitalize="characters" containerStyle={styles.gap}
                  leftIcon="card-outline" />
                <Input label="Aadhaar Number" value={form.aadhaar} onChangeText={(v) => update('aadhaar', v)}
                  placeholder="1234 5678 9012" keyboardType="numeric" containerStyle={styles.gap}
                  leftIcon="shield-outline" />
              </>
            )}

            {step === 1 && (
              <>
                <Text style={styles.sectionLabel}>Select Account Type</Text>
                {['Savings Account', 'Current Account', 'Salary Account'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.option, form.accountType === type && styles.optionSelected]}
                    onPress={() => update('accountType', type)}
                  >
                    <Ionicons
                      name={form.accountType === type ? 'radio-button-on' : 'radio-button-off'}
                      size={20} color={form.accountType === type ? Colors.primary : Colors.textMuted}
                    />
                    <Text style={[styles.optionText, form.accountType === type && { color: Colors.primary }]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
                <Input label="Initial Deposit (₹)" value={form.initialDeposit}
                  onChangeText={(v) => update('initialDeposit', v)}
                  keyboardType="numeric" containerStyle={styles.gap} leftIcon="wallet-outline"
                  hint="Minimum ₹1000" />
                <Input label="Address" value={form.address} onChangeText={(v) => update('address', v)}
                  placeholder="House/Street" containerStyle={styles.gap} leftIcon="home-outline" />
                <View style={styles.row}>
                  <Input label="City" value={form.city} onChangeText={(v) => update('city', v)}
                    placeholder="Mumbai" containerStyle={styles.half} />
                  <Input label="State" value={form.state} onChangeText={(v) => update('state', v)}
                    placeholder="Maharashtra" containerStyle={styles.half} />
                </View>
                <Input label="Pincode" value={form.pincode} onChangeText={(v) => update('pincode', v)}
                  placeholder="400001" keyboardType="numeric" containerStyle={styles.gap} />
              </>
            )}

            {step === 2 && (
              <>
                <Text style={styles.sectionLabel}>Review Your Details</Text>
                {[
                  ['Full Name', `${form.firstName} ${form.lastName}`],
                  ['Email', form.email],
                  ['Mobile', form.mobile],
                  ['PAN', form.pan],
                  ['Account Type', form.accountType],
                  ['Initial Deposit', `₹${form.initialDeposit}`],
                  ['City', form.city],
                  ['State', form.state],
                ].map(([label, value]) => (
                  <View key={label} style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>{label}</Text>
                    <Text style={styles.reviewValue}>{value}</Text>
                  </View>
                ))}
              </>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            {step < STEPS.length - 1 ? (
              <Button title="Continue" onPress={() => setStep(step + 1)} fullWidth />
            ) : (
              <Button title="Submit Application" onPress={handleRegister} loading={loading} fullWidth />
            )}
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  back: { padding: 4 },
  title: { ...Typography.h2, color: Colors.text },
  stepper: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg },
  stepItem: { alignItems: 'center', gap: 4, flex: 1 },
  stepDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.surface2, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
  },
  stepDotActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepNum: { ...Typography.caption, color: Colors.textMuted, fontWeight: '600' },
  stepLabel: { ...Typography.caption, color: Colors.textDim, textAlign: 'center' },
  stepLabelActive: { color: Colors.primary },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  errorBox: { backgroundColor: Colors.errorBg, padding: Spacing.md, borderRadius: Radius.md, marginBottom: Spacing.md },
  errorText: { ...Typography.bodySmall, color: Colors.error },
  row: { flexDirection: 'row', gap: Spacing.sm },
  half: { flex: 1 },
  gap: { marginTop: Spacing.md },
  sectionLabel: { ...Typography.h4, color: Colors.text, marginBottom: Spacing.md },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1,
    borderColor: Colors.border, marginBottom: Spacing.sm,
  },
  optionSelected: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}11` },
  optionText: { ...Typography.body, color: Colors.textMuted },
  reviewRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  reviewLabel: { ...Typography.body, color: Colors.textMuted },
  reviewValue: { ...Typography.body, color: Colors.text, fontWeight: '600', maxWidth: '55%', textAlign: 'right' },
  actions: { marginTop: Spacing.lg },
  loginLink: { alignItems: 'center', marginTop: Spacing.lg },
  loginLinkText: { ...Typography.body, color: Colors.primary },
});

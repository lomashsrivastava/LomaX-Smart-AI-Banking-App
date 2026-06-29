import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, TouchableOpacity, Alert, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/auth.store';
import { authApi } from '@/services/api/auth.api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, Typography, Radius } from '@/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [customerId, setCustomerId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!customerId.trim() || !password.trim()) {
      setError('Please enter Customer ID and password');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(customerId.trim(), password.trim());
      const { token, user } = res.data;
      await setAuth(user, token, token);
      router.replace('/(tabs)');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Check credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const autoFillHint = () => {
    if (customerId) {
      setPassword(customerId.split('').reverse().join(''));
    } else {
      Alert.alert('Hint', 'Password = reverse of your Customer ID\n\nExample:\nID: CUST100001\nPassword: 100001TSUC');
    }
  };

  return (
    <LinearGradient colors={['#020B18', '#0A1628']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Logo */}
          <View style={styles.logoSection}>
            <Image
              source={require('../../assets/lomax-logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>LomaX Banking</Text>
            <Text style={styles.tagline}>Your Smart Banking Partner</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={Colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Input
              label="Customer ID"
              placeholder="e.g. CUST100001"
              value={customerId}
              onChangeText={setCustomerId}
              leftIcon="person-outline"
              autoCapitalize="characters"
              autoCorrect={false}
              containerStyle={styles.inputGap}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              leftIcon="lock-closed-outline"
              rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
              onRightIconPress={() => setShowPassword(!showPassword)}
              secureTextEntry={!showPassword}
              autoCorrect={false}
              containerStyle={styles.inputGap}
            />

            <TouchableOpacity onPress={autoFillHint} style={styles.hint}>
              <Ionicons name="information-circle-outline" size={14} color={Colors.primary} />
              <Text style={styles.hintText}>Password hint</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              fullWidth
              style={styles.loginBtn}
            />

            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => router.push('/(auth)/forgot-password')}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Register */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>New to LomaX? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLink}>Open Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.lg },
  logoSection: { alignItems: 'center', marginBottom: Spacing.xl },
  logoImage: {
    width: 220,
    height: 80,
    marginBottom: Spacing.sm,
  },
  brandName: { ...Typography.h2, color: Colors.text, marginBottom: 4 },
  tagline: { ...Typography.body, color: Colors.textMuted },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border,
  },
  title: { ...Typography.h2, color: Colors.text, marginBottom: 4 },
  subtitle: { ...Typography.body, color: Colors.textMuted, marginBottom: Spacing.lg },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.errorBg, padding: Spacing.md,
    borderRadius: Radius.md, marginBottom: Spacing.md,
  },
  errorText: { ...Typography.bodySmall, color: Colors.error, flex: 1 },
  inputGap: { marginBottom: Spacing.md },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: Spacing.md },
  hintText: { ...Typography.caption, color: Colors.primary },
  loginBtn: { marginTop: Spacing.sm },
  forgotBtn: { alignItems: 'center', marginTop: Spacing.md },
  forgotText: { ...Typography.body, color: Colors.primary },
  registerRow: {
    flexDirection: 'row', justifyContent: 'center',
    marginTop: Spacing.xl, alignItems: 'center',
  },
  registerText: { ...Typography.body, color: Colors.textMuted },
  registerLink: { ...Typography.body, color: Colors.primary, fontWeight: '700' },
});

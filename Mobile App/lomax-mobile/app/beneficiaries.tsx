import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { beneficiariesApi } from '@/services/api/index';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, Typography, Radius } from '@/theme';
import { maskAccountNumber } from '@/utils/format';

interface Beneficiary {
  _id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  nickName?: string;
}

export default function BeneficiariesScreen() {
  const router = useRouter();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [nickName, setNickName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchBeneficiaries = async () => {
    try {
      const res = await beneficiariesApi.getAll();
      const beneficiariesArray = res.data?.data || res.data?.beneficiaries || (Array.isArray(res.data) ? res.data : []);
      setBeneficiaries(beneficiariesArray);
    } catch (e) {
      console.log('Error fetching beneficiaries:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const handleAdd = async () => {
    if (!name.trim()) return Alert.alert('Error', 'Enter beneficiary full name');
    if (!accountNumber.trim()) return Alert.alert('Error', 'Enter account number');
    if (!bankName.trim()) return Alert.alert('Error', 'Enter bank name');
    if (!ifscCode.trim()) return Alert.alert('Error', 'Enter IFSC code');

    setSubmitting(true);
    try {
      await beneficiariesApi.add({
        name: name.trim(),
        accountNumber: accountNumber.trim(),
        bankName: bankName.trim(),
        ifscCode: ifscCode.trim().toUpperCase(),
        nickName: nickName.trim() || undefined,
      });
      Alert.alert('Success', 'Beneficiary added successfully');
      setShowAddModal(false);
      // Reset form
      setName('');
      setAccountNumber('');
      setBankName('');
      setIfscCode('');
      setNickName('');
      fetchBeneficiaries();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to add beneficiary');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string, bName: string) => {
    Alert.alert(
      'Remove Beneficiary',
      `Are you sure you want to remove ${bName} from your beneficiaries list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await beneficiariesApi.delete(id);
              Alert.alert('Success', 'Beneficiary removed');
              fetchBeneficiaries();
            } catch (e) {
              Alert.alert('Error', 'Failed to delete beneficiary');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Beneficiaries</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Button
          title="Add Beneficiary"
          onPress={() => setShowAddModal(true)}
          style={{ marginBottom: Spacing.md }}
        />

        {beneficiaries.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={Colors.textDim} />
            <Text style={styles.emptyTitle}>No Beneficiaries</Text>
            <Text style={styles.emptyMsg}>Add payees here to perform lightning-fast transfers.</Text>
          </View>
        ) : (
          beneficiaries.map((b) => (
            <View key={b._id} style={styles.card}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{b.name.slice(0, 2).toUpperCase()}</Text>
              </View>

              <View style={styles.content}>
                <Text style={styles.name}>{b.name}</Text>
                {b.nickName ? <Text style={styles.nick}>({b.nickName})</Text> : null}
                <Text style={styles.bankInfo}>{b.bankName} • {b.ifscCode}</Text>
                <Text style={styles.accNum}>{maskAccountNumber(b.accountNumber)}</Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => router.push('/(tabs)/transfer')}
                >
                  <Ionicons name="swap-horizontal" size={18} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleDelete(b._id, b.name)}
                >
                  <Ionicons name="trash-outline" size={18} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Beneficiary</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody} keyboardShouldPersistTaps="handled">
              <Input
                label="Full Name"
                placeholder="Payee Account Holder Name"
                value={name}
                onChangeText={setName}
                leftIcon="person-outline"
              />

              <Input
                label="Account Number"
                placeholder="Enter Account Number"
                keyboardType="numeric"
                value={accountNumber}
                onChangeText={setAccountNumber}
                leftIcon="card-outline"
                containerStyle={styles.gap}
              />

              <Input
                label="Bank Name"
                placeholder="e.g. State Bank of India"
                value={bankName}
                onChangeText={setBankName}
                leftIcon="business-outline"
                containerStyle={styles.gap}
              />

              <Input
                label="IFSC Code"
                placeholder="e.g. SBIN0001234"
                autoCapitalize="characters"
                value={ifscCode}
                onChangeText={setIfscCode}
                leftIcon="code-outline"
                containerStyle={styles.gap}
              />

              <Input
                label="Nickname (Optional)"
                placeholder="e.g. Bro, Mom"
                value={nickName}
                onChangeText={setNickName}
                leftIcon="bookmark-outline"
                containerStyle={styles.gap}
              />

              <Button
                title="Add Payee"
                onPress={handleAdd}
                loading={submitting}
                fullWidth
                style={styles.modalBtn}
              />
            </ScrollView>
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
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 40 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { ...Typography.h3, color: Colors.text, marginTop: Spacing.md },
  emptyMsg: { ...Typography.body, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center',
    gap: Spacing.md, marginBottom: Spacing.sm,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { ...Typography.body, color: Colors.background, fontWeight: '700' },
  content: { flex: 1, gap: 2 },
  name: { ...Typography.body, color: Colors.text, fontWeight: '600' },
  nick: { ...Typography.caption, color: Colors.primary, fontWeight: '500' },
  bankInfo: { ...Typography.caption, color: Colors.textMuted },
  accNum: { ...Typography.monoSmall, color: Colors.textDim },
  actions: { flexDirection: 'row', gap: Spacing.xs },
  actionBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surface2, alignItems: 'center', justifyContent: 'center' },
  modalBg: { flex: 1, backgroundColor: 'rgba(2,11,24,0.85)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.surface, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, minHeight: '60%', maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  modalTitle: { ...Typography.h3, color: Colors.text },
  modalBody: { padding: Spacing.lg, paddingBottom: 40 },
  gap: { marginTop: Spacing.md },
  modalBtn: { marginTop: Spacing.xl },
});

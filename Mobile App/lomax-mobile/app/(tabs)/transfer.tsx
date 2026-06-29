import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/auth.store';
import { useAccountsStore } from '@/stores/index';
import { transactionsApi, beneficiariesApi } from '@/services/api/index';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, Typography, Radius } from '@/theme';
import { formatCurrency, maskAccountNumber } from '@/utils/format';

type ActiveTab = 'transfer' | 'deposit' | 'withdraw';
type TransferMode = 'IMPS' | 'NEFT' | 'RTGS' | 'UPI';

interface Beneficiary {
  _id: string;
  name: string;
  accountNumber: string;
  bankName?: string;
  ifscCode?: string;
  nickName?: string;
}

export default function TransferScreen() {
  const { user } = useAuthStore();
  const { accounts } = useAccountsStore();
  const [activeTab, setActiveTab] = useState<ActiveTab>('transfer');

  // Common fields
  const [selectedAccountNum, setSelectedAccountNum] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  // Transfer specific fields
  const [payeeName, setPayeeName] = useState('');
  const [payeeAccount, setPayeeAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [transferMode, setTransferMode] = useState<TransferMode>('IMPS');
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [showBeneficiaries, setShowBeneficiaries] = useState(false);

  // Initialize source account
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountNum) {
      setSelectedAccountNum(accounts[0].accountNumber);
    }
  }, [accounts, selectedAccountNum]);

  // Fetch beneficiaries
  useEffect(() => {
    if (activeTab === 'transfer') {
      beneficiariesApi.getAll()
        .then((res) => {
          const beneficiariesArray = res.data?.data || res.data?.beneficiaries || (Array.isArray(res.data) ? res.data : []);
          setBeneficiaries(beneficiariesArray);
        })
        .catch((err) => console.log('Error fetching beneficiaries:', err));
    }
  }, [activeTab]);

  const sourceAccountObj = accounts.find(a => a.accountNumber === selectedAccountNum);

  const handleSelectBeneficiary = (b: Beneficiary) => {
    setPayeeName(b.name);
    setPayeeAccount(b.accountNumber);
    setIfscCode(b.ifscCode || '');
    setShowBeneficiaries(false);
  };

  const handleAction = async () => {
    if (!selectedAccountNum) return Alert.alert('Error', 'Please select a source account');
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return Alert.alert('Error', 'Please enter a valid amount');

    if (activeTab === 'transfer') {
      if (!payeeName.trim()) return Alert.alert('Error', 'Enter Payee Name');
      if (!payeeAccount.trim()) return Alert.alert('Error', 'Enter Payee Account Number');
      if (transferMode !== 'UPI' && !ifscCode.trim()) return Alert.alert('Error', 'Enter IFSC Code');
    }

    setLoading(true);
    try {
      if (activeTab === 'transfer') {
        const payload = {
          transferType: transferMode,
          sourceAccount: selectedAccountNum,
          targetAccount: payeeAccount,
          payeeAccount,
          payeeName,
          ifscCode,
          amount: amt,
          remarks,
        };
        await transactionsApi.transfer(payload);
        Alert.alert('Success', `Transfer of ${formatCurrency(amt)} completed successfully.`);
        // Reset inputs
        setAmount('');
        setRemarks('');
        setPayeeName('');
        setPayeeAccount('');
        setIfscCode('');
      } else if (activeTab === 'deposit') {
        await transactionsApi.deposit({
          accountNumber: selectedAccountNum,
          amount: amt,
          remarks: remarks || 'Self Cash Deposit',
        });
        Alert.alert('Success', `Deposit of ${formatCurrency(amt)} completed successfully.`);
        setAmount('');
        setRemarks('');
      } else if (activeTab === 'withdraw') {
        await transactionsApi.withdraw({
          accountNumber: selectedAccountNum,
          amount: amt,
          remarks: remarks || 'Self Cash Withdrawal',
        });
        Alert.alert('Success', `Withdrawal of ${formatCurrency(amt)} completed successfully.`);
        setAmount('');
        setRemarks('');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Transaction failed';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* Header Tabs */}
        <View style={styles.tabContainer}>
          {(['transfer', 'deposit', 'withdraw'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.tabActive]}
              onPress={() => {
                setActiveTab(tab);
              }}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Source Account Selection */}
          <Text style={styles.label}>Select Source Account</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.accountList}>
            {accounts.map((acc) => (
              <TouchableOpacity
                key={acc._id}
                style={[
                  styles.accountItem,
                  selectedAccountNum === acc.accountNumber && styles.accountItemActive,
                ]}
                onPress={() => setSelectedAccountNum(acc.accountNumber)}
              >
                <Text style={styles.accType}>{acc.accountType}</Text>
                <Text style={styles.accNum}>{maskAccountNumber(acc.accountNumber)}</Text>
                <Text style={styles.accBal}>{formatCurrency(acc.balance)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Form */}
          <View style={styles.card}>
            <Input
              label="Amount (₹)"
              placeholder="Enter Amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              leftIcon="wallet-outline"
            />

            <Input
              label="Remarks"
              placeholder="Add payment notes"
              value={remarks}
              onChangeText={setRemarks}
              leftIcon="document-text-outline"
              containerStyle={styles.gap}
            />

            {activeTab === 'transfer' && (
              <>
                <View style={styles.divider} />
                <View style={styles.payeeHeader}>
                  <Text style={styles.payeeTitle}>Payee Details</Text>
                  {beneficiaries.length > 0 && (
                    <TouchableOpacity onPress={() => setShowBeneficiaries(!showBeneficiaries)}>
                      <Text style={styles.beneficiaryLink}>
                        {showBeneficiaries ? 'Hide Beneficiaries' : 'Select Beneficiary'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {showBeneficiaries && (
                  <View style={styles.beneficiaryBox}>
                    {beneficiaries.map((b) => (
                      <TouchableOpacity
                        key={b._id}
                        style={styles.beneficiaryItem}
                        onPress={() => handleSelectBeneficiary(b)}
                      >
                        <Ionicons name="person-circle-outline" size={24} color={Colors.primary} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.bName}>{b.name}</Text>
                          <Text style={styles.bAcc}>{maskAccountNumber(b.accountNumber)}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <Input
                  label="Payee Account Number"
                  placeholder="Enter Account Number"
                  keyboardType="numeric"
                  value={payeeAccount}
                  onChangeText={setPayeeAccount}
                  leftIcon="card-outline"
                  containerStyle={styles.gap}
                />

                <Input
                  label="Payee Full Name"
                  placeholder="Enter Name"
                  value={payeeName}
                  onChangeText={setPayeeName}
                  leftIcon="person-outline"
                  containerStyle={styles.gap}
                />

                <View style={styles.modeContainer}>
                  <Text style={styles.modeLabel}>Transfer Mode</Text>
                  <View style={styles.modes}>
                    {(['IMPS', 'NEFT', 'RTGS', 'UPI'] as const).map((mode) => (
                      <TouchableOpacity
                        key={mode}
                        style={[styles.modeBtn, transferMode === mode && styles.modeBtnActive]}
                        onPress={() => setTransferMode(mode)}
                      >
                        <Text style={[styles.modeBtnText, transferMode === mode && styles.modeBtnTextActive]}>
                          {mode}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {transferMode !== 'UPI' && (
                  <Input
                    label="IFSC Code"
                    placeholder="Enter IFSC Code"
                    autoCapitalize="characters"
                    value={ifscCode}
                    onChangeText={setIfscCode}
                    leftIcon="business-outline"
                    containerStyle={styles.gap}
                  />
                )}
              </>
            )}

            <Button
              title={`Confirm ${activeTab.toUpperCase()}`}
              onPress={handleAction}
              loading={loading}
              fullWidth
              style={styles.actionBtnConfirm}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  tabContainer: { flexDirection: 'row', backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabButton: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabText: { ...Typography.label, color: Colors.textMuted },
  tabTextActive: { color: Colors.primary },
  scroll: { padding: Spacing.lg, paddingBottom: 40 },
  label: { ...Typography.label, color: Colors.textMuted, marginBottom: Spacing.sm },
  accountList: { gap: Spacing.sm, marginBottom: Spacing.lg },
  accountItem: {
    padding: Spacing.md, borderRadius: Radius.md,
    backgroundColor: Colors.surface2, borderStyle: 'solid', borderWidth: 1.5, borderColor: Colors.border,
    minWidth: 160,
  },
  accountItemActive: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}11` },
  accType: { ...Typography.label, color: Colors.primary, marginBottom: 2 },
  accNum: { ...Typography.mono, color: Colors.textMuted, fontSize: 12 },
  accBal: { ...Typography.body, color: Colors.text, fontWeight: '700', marginTop: 4 },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  gap: { marginTop: Spacing.md },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.lg },
  payeeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  payeeTitle: { ...Typography.h4, color: Colors.text },
  beneficiaryLink: { ...Typography.bodySmall, color: Colors.primary },
  beneficiaryBox: { backgroundColor: Colors.surface2, borderRadius: Radius.md, padding: Spacing.sm, marginBottom: Spacing.md, gap: Spacing.xs },
  beneficiaryItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  bName: { ...Typography.body, color: Colors.text, fontWeight: '600' },
  bAcc: { ...Typography.mono, color: Colors.textMuted, fontSize: 11 },
  modeContainer: { marginTop: Spacing.md },
  modeLabel: { ...Typography.label, color: Colors.textMuted, marginBottom: Spacing.xs },
  modes: { flexDirection: 'row', gap: Spacing.xs },
  modeBtn: { flex: 1, paddingVertical: 10, borderRadius: Radius.sm, backgroundColor: Colors.surface2, alignItems: 'center' },
  modeBtnActive: { backgroundColor: Colors.primary },
  modeBtnText: { ...Typography.caption, color: Colors.textMuted, fontWeight: '700' },
  modeBtnTextActive: { color: Colors.background },
  actionBtnConfirm: { marginTop: Spacing.xl },
});

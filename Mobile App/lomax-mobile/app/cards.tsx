import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { cardsApi, accountsApi } from '@/services/api/index';
import { useAuthStore } from '@/stores/auth.store';
import { useAccountsStore } from '@/stores/index';
import { Button } from '@/components/ui/Button';
import { Colors, Spacing, Typography, Radius } from '@/theme';
import { formatCurrency, maskAccountNumber } from '@/utils/format';

interface Card {
  _id: string;
  cardNumber: string;
  cardType: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  status: string;
  accountNumber: string;
  controls: {
    atmWithdrawal: boolean;
    onlineTransactions: boolean;
    internationalPayments: boolean;
  };
}

export default function CardsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { accounts } = useAccountsStore();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCards = async () => {
    try {
      const res = await cardsApi.getCards();
      const cardsArray = res.data?.data || res.data?.cards || (Array.isArray(res.data) ? res.data : []);
      setCards(cardsArray);
    } catch (e) {
      console.log('Error fetching cards:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleToggleLock = async (card: Card) => {
    const nextStatus = card.status === 'active' ? 'locked' : 'active';
    try {
      await cardsApi.updateStatus(card._id, nextStatus);
      setCards(prev => prev.map(c => c._id === card._id ? { ...c, status: nextStatus } : c));
      Alert.alert('Success', `Card has been ${nextStatus === 'locked' ? 'locked' : 'unlocked'} successfully.`);
    } catch (e) {
      Alert.alert('Error', 'Failed to update card status');
    }
  };

  const handleToggleControl = async (card: Card, key: 'atmWithdrawal' | 'onlineTransactions' | 'internationalPayments', val: boolean) => {
    const updatedControls = { ...card.controls, [key]: val };
    try {
      await cardsApi.updateControls(card._id, updatedControls);
      setCards(prev => prev.map(c => c._id === card._id ? { ...c, controls: updatedControls } : c));
    } catch (e) {
      Alert.alert('Error', 'Failed to update card controls');
    }
  };

  const handleRequestCard = async () => {
    if (accounts.length === 0) return Alert.alert('Error', 'No accounts found to link a card.');
    Alert.alert(
      'Request Card',
      'Would you like to request a new Debit Card for your primary account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request',
          onPress: async () => {
            try {
              await cardsApi.issueCard({
                accountNumber: accounts[0].accountNumber,
                cardType: 'Debit',
                cardName: user?.name || 'LomaX Cardholder',
              });
              Alert.alert('Success', 'Your card request was submitted and issued.');
              fetchCards();
            } catch (e: any) {
              Alert.alert('Error', e.response?.data?.message || 'Request failed');
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
        <Text style={styles.title}>My Cards</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {cards.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="card-outline" size={64} color={Colors.textDim} />
            <Text style={styles.emptyTitle}>No Active Cards</Text>
            <Text style={styles.emptyMsg}>You don't have any debit or credit cards linked yet.</Text>
            <Button title="Request New Card" onPress={handleRequestCard} style={styles.reqBtn} />
          </View>
        ) : (
          cards.map((card) => (
            <View key={card._id} style={styles.cardSection}>
              {/* Visual Card */}
              <LinearGradient
                colors={card.status === 'locked' ? ['#4A5568', '#2D3748'] : ['#6C63FF', '#00D4FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.creditCard}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardBrand}>{card.cardType?.toUpperCase()}</Text>
                  <Ionicons name="wifi" size={20} color="#fff" />
                </View>

                {card.status === 'locked' && (
                  <View style={styles.lockOverlay}>
                    <Ionicons name="lock-closed" size={32} color={Colors.error} />
                    <Text style={styles.lockText}>LOCKED</Text>
                  </View>
                )}

                <Text style={styles.cardNumber}>
                  {card.cardNumber?.replace(/(\d{4})(?=\d)/g, '$1 ') || '•••• •••• •••• ••••'}
                </Text>

                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.cardLabel}>CARD HOLDER</Text>
                    <Text style={styles.cardValue}>{card.cardName}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: Spacing.md }}>
                    <View>
                      <Text style={styles.cardLabel}>EXPIRES</Text>
                      <Text style={styles.cardValue}>{card.expiryDate}</Text>
                    </View>
                    <View>
                      <Text style={styles.cardLabel}>CVV</Text>
                      <Text style={styles.cardValue}>***</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>

              {/* Status / Quick Actions */}
              <View style={styles.cardDetails}>
                <View style={styles.row}>
                  <View>
                    <Text style={styles.secTitle}>{card.status === 'locked' ? 'Card Locked' : 'Card Active'}</Text>
                    <Text style={styles.secDesc}>Temporarily freeze or unfreeze this card</Text>
                  </View>
                  <Switch
                    value={card.status === 'locked'}
                    onValueChange={() => handleToggleLock(card)}
                    trackColor={{ false: Colors.border, true: Colors.error }}
                    thumbColor={card.status === 'locked' ? Colors.error : Colors.textMuted}
                  />
                </View>

                <View style={styles.divider} />

                {/* Controls */}
                <Text style={styles.controlsTitle}>Card Controls</Text>

                <View style={styles.controlRow}>
                  <View>
                    <Text style={styles.cTitle}>ATM Withdrawal</Text>
                    <Text style={styles.cDesc}>Allow cash withdrawals from ATMs</Text>
                  </View>
                  <Switch
                    value={card.controls?.atmWithdrawal ?? true}
                    onValueChange={(val) => handleToggleControl(card, 'atmWithdrawal', val)}
                    disabled={card.status === 'locked'}
                  />
                </View>

                <View style={styles.controlRow}>
                  <View>
                    <Text style={styles.cTitle}>Online Transactions</Text>
                    <Text style={styles.cDesc}>Allow e-commerce & internet transactions</Text>
                  </View>
                  <Switch
                    value={card.controls?.onlineTransactions ?? true}
                    onValueChange={(val) => handleToggleControl(card, 'onlineTransactions', val)}
                    disabled={card.status === 'locked'}
                  />
                </View>

                <View style={styles.controlRow}>
                  <View>
                    <Text style={styles.cTitle}>International Payments</Text>
                    <Text style={styles.cDesc}>Allow foreign currency payments</Text>
                  </View>
                  <Switch
                    value={card.controls?.internationalPayments ?? false}
                    onValueChange={(val) => handleToggleControl(card, 'internationalPayments', val)}
                    disabled={card.status === 'locked'}
                  />
                </View>
              </View>
            </View>
          ))
        )}

        {cards.length > 0 && (
          <Button
            title="Request Another Card"
            variant="outline"
            onPress={handleRequestCard}
            style={styles.requestAnother}
          />
        )}
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  back: { padding: 4 },
  title: { ...Typography.h2, color: Colors.text },
  scroll: { paddingHorizontal: Spacing.lg },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { ...Typography.h3, color: Colors.text, marginTop: Spacing.md },
  emptyMsg: { ...Typography.body, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm, marginBottom: Spacing.xl },
  reqBtn: { width: '80%' },
  cardSection: { marginBottom: Spacing.xl },
  creditCard: {
    height: 200, borderRadius: Radius.xl, padding: Spacing.lg,
    justifyContent: 'space-between', overflow: 'hidden',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardBrand: { ...Typography.label, color: '#fff', fontWeight: '800' },
  lockOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  lockText: { ...Typography.h3, color: Colors.error, fontWeight: '700' },
  cardNumber: { ...Typography.displayMedium, color: '#fff', letterSpacing: 2, fontSize: 20, textAlign: 'center', marginVertical: Spacing.sm },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardLabel: { ...Typography.caption, color: '#ffffff88', marginBottom: 2 },
  cardValue: { ...Typography.bodySmall, color: '#fff', fontWeight: '600' },
  cardDetails: { backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: Spacing.lg, marginTop: Spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  secTitle: { ...Typography.body, color: Colors.text, fontWeight: '600' },
  secDesc: { ...Typography.caption, color: Colors.textMuted },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  controlsTitle: { ...Typography.label, color: Colors.primary, marginBottom: Spacing.md, textTransform: 'uppercase' },
  controlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  cTitle: { ...Typography.body, color: Colors.text },
  cDesc: { ...Typography.caption, color: Colors.textMuted },
  requestAnother: { marginTop: Spacing.md },
});

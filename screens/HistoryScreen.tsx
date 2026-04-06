import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useWallet } from '../context/WalletContext';
import TransactionRow from '../components/TransactionRow';

export default function HistoryScreen() {
  const { wallet } = useWallet();
  return (
    <ScrollView style={s.root} contentContainerStyle={s.content}>
      <Text style={s.pageTitle}>All Transactions</Text>
      <View style={s.card}>
        {wallet.transactions.length === 0
          ? <Text style={s.empty}>No transactions yet</Text>
          : wallet.transactions.map(tx => <TransactionRow key={tx.id} tx={tx} />)
        }
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f5f5f3' },
  content: { padding: 16, paddingTop: 60 },
  pageTitle: { fontSize: 11, fontWeight: '600', color: '#888780', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.1)', paddingHorizontal: 16, paddingVertical: 4 },
  empty: { fontSize: 13, color: '#888780', textAlign: 'center', paddingVertical: 14 },
});

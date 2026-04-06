 import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWallet } from '../context/WalletContext';
import TransactionRow from '../components/TransactionRow';

export default function HomeScreen() {
  const { wallet } = useWallet();
  const nav = useNavigation<any>();
  const fmt = (n: number) => n.toLocaleString('en-KE');

  return (
    <View style={s.root}>
      <View style={s.header}>
        <View style={s.headerRow}>
          <Text style={s.logo}>SmartPay</Text>
          <TouchableOpacity onPress={() => nav.navigate('Settings')} style={s.avatar}>
            <Text style={s.avatarTxt}>{wallet.userName.slice(0,2).toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
        <Text style={s.balLabel}>Available balance</Text>
        <Text style={s.balAmt}>KES {fmt(wallet.balance)}</Text>
        <Text style={s.balSub}>{wallet.userName}'s Wallet · ****4321</Text>
        <View style={s.quickRow}>
          {[['↑','Send'],['↓','Receive'],['≡','History']].map(([icon, label]) => (
            <TouchableOpacity key={label} style={s.qbtn} onPress={() => nav.navigate(label)}>
              <Text style={s.qbtnIcon}>{icon}</Text>
              <Text style={s.qbtnLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.secTitle}>Recent Transactions</Text>
        <View style={s.card}>
          {wallet.transactions.slice(0,4).map(tx => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f5f5f3' },
  header: { backgroundColor: '#085041', paddingTop: 52, paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  logo: { color: '#fff', fontSize: 20, fontWeight: '700', letterSpacing: -0.5 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: '#fff', fontSize: 13, fontWeight: '600' },
  balLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 3 },
  balAmt: { color: '#fff', fontSize: 34, fontWeight: '700', letterSpacing: -1.5 },
  balSub: { color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 3 },
  quickRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  qbtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.13)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)', borderRadius: 10, paddingVertical: 9, alignItems: 'center', gap: 3 },
  qbtnIcon: { color: '#fff', fontSize: 17 },
  qbtnLabel: { color: '#fff', fontSize: 12, fontWeight: '500' },
  content: { flex: 1, padding: 16 },
  secTitle: { fontSize: 11, fontWeight: '600', color: '#888780', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.1)', paddingHorizontal: 16, paddingVertical: 4 },
});

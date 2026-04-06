import React, { useState } from 'react';
import { View, Text, Switch, ScrollView, StyleSheet } from 'react-native';
import { useWallet } from '../context/WalletContext';

export default function SettingsScreen() {
  const { wallet } = useWallet();
  const fmt = (n: number) => n.toLocaleString('en-KE');
  const [qrAlert, setQrAlert] = useState(true);
  const [txAlert, setTxAlert] = useState(true);
  const [biometric, setBiometric] = useState(false);

  return (
    <ScrollView style={s.root} contentContainerStyle={s.content}>
      <Text style={s.pageTitle}>Account</Text>
      <View style={[s.card, { marginBottom: 12 }]}>
        <View style={s.profileRow}>
          <View style={s.avatarCircle}>
            <Text style={s.avatarTxt}>{wallet.userName.slice(0,2).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={s.name}>{wallet.userName}</Text>
            <Text style={s.phone}>{wallet.phone}</Text>
          </View>
        </View>
        <View style={s.balRow}>
          <Text style={s.balTxt}>Wallet ****4321 · KES {fmt(wallet.balance)}</Text>
        </View>
      </View>
      <Text style={s.pageTitle}>Preferences</Text>
      <View style={s.card}>
        {[
          { label: 'QR expiry reminder', sub: 'Alert when QR is older than 5 min', val: qrAlert, set: setQrAlert },
          { label: 'Transaction alerts', sub: 'Notify on send / receive', val: txAlert, set: setTxAlert },
          { label: 'Biometric lock', sub: 'Fingerprint to open app', val: biometric, set: setBiometric },
        ].map(({ label, sub, val, set }) => (
          <View key={label} style={s.row}>
            <View style={s.rowLeft}>
              <Text style={s.rowLabel}>{label}</Text>
              <Text style={s.rowSub}>{sub}</Text>
            </View>
            <Switch value={val} onValueChange={set}
              trackColor={{ false: 'rgba(0,0,0,0.18)', true: '#1D9E75' }}
              thumbColor="#fff" />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f5f5f3' },
  content: { padding: 16, paddingTop: 60 },
  pageTitle: { fontSize: 11, fontWeight: '600', color: '#888780', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.1)', padding: 18 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatarCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E1F5EE', alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: '#085041', fontSize: 16, fontWeight: '600' },
  name: { fontSize: 15, fontWeight: '500', color: '#1a1a18' },
  phone: { fontSize: 12, color: '#5f5e5a' },
  balRow: { borderTopWidth: 0.5, borderTopColor: 'rgba(0,0,0,0.1)', paddingTop: 10 },
  balTxt: { fontFamily: 'monospace', fontSize: 13, color: '#5f5e5a' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.08)' },
  rowLeft: { flex: 1, paddingRight: 12 },
  rowLabel: { fontSize: 14, fontWeight: '500', color: '#1a1a18' },
  rowSub: { fontSize: 11, color: '#888780', marginTop: 1 },
});

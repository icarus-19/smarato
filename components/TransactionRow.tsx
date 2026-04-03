import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '../context/WalletContext';

export default function TransactionRow({ tx }: { tx: Transaction }) {
  const fmt = (n: number) => n.toLocaleString('en-KE');
  const isSent = tx.dir === 'sent';
  return (
    <View style={s.row}>
      <View style={s.left}>
        <View style={[s.dot, isSent ? s.dotSent : s.dotRecv]}>
          <Text style={[s.dotTxt, isSent ? s.dotSentTxt : s.dotRecvTxt]}>{isSent ? '↑' : '↓'}</Text>
        </View>
        <View>
          <Text style={s.name}>{tx.name}</Text>
          <Text style={s.time}>{tx.time}{tx.note ? ' · ' + tx.note : ''}</Text>
        </View>
      </View>
      <Text style={[s.amt, isSent ? s.amtSent : s.amtRecv]}>
        {isSent ? '-' : '+'}{fmt(tx.amount)}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.07)' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  dotSent: { backgroundColor: '#FAECE7' },
  dotRecv: { backgroundColor: '#E1F5EE' },
  dotTxt: { fontSize: 14 },
  dotSentTxt: { color: '#D85A30' },
  dotRecvTxt: { color: '#085041' },
  name: { fontSize: 14, fontWeight: '500', color: '#1a1a18' },
  time: { fontSize: 11, color: '#888780', marginTop: 1 },
  amt: { fontFamily: 'monospace', fontSize: 14, fontWeight: '700' },
  amtSent: { color: '#D85A30' },
  amtRecv: { color: '#1D9E75' },
});

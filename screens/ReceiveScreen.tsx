import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function ReceiveScreen() {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [qrData, setQrData] = useState<string | null>(null);

  const fmt = (n: number) => n.toLocaleString('en-KE');

  const generate = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return Alert.alert('Invalid amount', 'Please enter a valid amount.');
    setQrData(`SMPAY:${amt}:${note || 'Payment'}`);
  };

  const clear = () => {
    setQrData(null);
    setAmount('');
    setNote('');
  };

  return (
    <ScrollView style={s.root} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.pageTitle}>Receive Money</Text>
      <View style={s.card}>
        <Text style={s.label}>Amount (KES)</Text>
        <TextInput style={s.input} placeholder="e.g. 500" keyboardType="numeric"
          value={amount} onChangeText={setAmount} placeholderTextColor="#888780" />
        <Text style={s.label}>Note (optional)</Text>
        <TextInput style={s.input} placeholder="e.g. Lunch" value={note}
          onChangeText={setNote} placeholderTextColor="#888780" />
        <TouchableOpacity style={s.btnGreen} onPress={generate}>
          <Text style={s.btnGreenTxt}>Generate QR Code</Text>
        </TouchableOpacity>
      </View>
      {qrData && (
        <View style={s.card}>
          <View style={s.qrWrap}>
            <QRCode value={qrData} size={200} color="#085041" backgroundColor="#fff" />
            <View style={s.qrTag}>
              <Text style={s.qrTagTxt}>KES {fmt(parseFloat(amount))}</Text>
            </View>
            {note ? <Text style={s.qrNote}>Note: {note}</Text> : null}
            <Text style={s.qrHint}>Show this to the sender to scan</Text>
          </View>
          <TouchableOpacity style={s.btnOutline} onPress={clear}>
            <Text style={s.btnOutlineTxt}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f5f5f3' },
  content: { padding: 16, paddingTop: 60 },
  pageTitle: { fontSize: 11, fontWeight: '600', color: '#888780', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.1)', padding: 18, marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '500', color: '#5f5e5a', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: 'rgba(0,0,0,0.18)', borderRadius: 8, padding: 11, fontSize: 15, color: '#1a1a18', backgroundColor: '#f5f5f3', marginBottom: 12 },
  btnGreen: { backgroundColor: '#1D9E75', borderRadius: 10, padding: 14, alignItems: 'center' },
  btnGreenTxt: { color: '#fff', fontSize: 15, fontWeight: '600' },
  btnOutline: { borderWidth: 1, borderColor: 'rgba(0,0,0,0.18)', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 8 },
  btnOutlineTxt: { fontSize: 14, fontWeight: '500', color: '#1a1a18' },
  qrWrap: { alignItems: 'center', paddingVertical: 10 },
  qrTag: { backgroundColor: '#E1F5EE', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 6, marginTop: 12 },
  qrTagTxt: { color: '#085041', fontSize: 15, fontWeight: '700' },
  qrNote: { fontSize: 12, color: '#888780', marginTop: 6 },
  qrHint: { fontSize: 11, color: '#888780', marginTop: 4 },
});
